// ========================================================================
// bootstrap-server v1.0.0
// http://twitter.github.com/bootstrap
// ========================================================================
// Copyright 2012 Twitter, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ========================================================================

"use strict"

var path  = require('path')
  , https = require('https')
  , less  = require('less')
  , CACHE = {}
  , CW    = "/*!\n * Bootstrap v2.0.2\n *\n * Copyright 2012 Twitter, Inc\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\n */\n"
  , ERROR = "A less error occured trying to build your bundle. Please paste the error below in an issue for us at http://github.com/twitter/bootsrap! thanks!\n\n"
  , FILES = [ "variables.less"
            , "mixins.less"
            , "reset.less"
            , "scaffolding.less"
            , "grid.less"
            , "layouts.less"
            , "type.less"
            , "code.less"
            , "labels.less"
            , "badges.less"
            , "tables.less"
            , "forms.less"
            , "buttons.less"
            , "sprites.less"
            , "button-groups.less"
            , "navs.less"
            , "navbar.less"
            , "breadcrumbs.less"
            , "pagination.less"
            , "pager.less"
            , "thumbnails.less"
            , "alerts.less"
            , "progress-bars.less"
            , "hero-unit.less"
            , "tooltip.less"
            , "popovers.less"
            , "modals.less"
            , "dropdowns.less"
            , "accordion.less"
            , "carousel.less"
            , "wells.less"
            , "close.less"
            , "utilities.less"
            , "component-animations.less"
            , "responsive.less" ]

function cache(callback) {
  var complete = 0
    , _cache   = {}

  FILES.forEach(function (filename) {
    var req
      , res
      , content = []
      , options = {
          host: 'raw.github.com'
        , port: 443
        , path: path.join('/twitter/bootstrap/master/less/', filename)
        , method: 'GET'
        }

    req = https.request(options, function(res) {

      res.setEncoding('utf8')

      res.on('data', function (chunk) {
        content.push(chunk)
      })

      res.on('end', function () {

        _cache[filename] = content.join(' ')

        if (++complete == FILES.length) {
          CACHE = _cache
          callback && callback(null, CACHE)
        }

      })
    })

    req.end()
  })
}

function css(params, callback) {

  var result = ''

  result += CACHE['variables.less']
  result += generateCustomCSS(params)
  result += CACHE['mixins.less']

  params.css.forEach(function (filename) {
    result += CACHE[filename]
  })

  result = result.replace(/@import[^\n]*/gi, '') //strip any imports

  try {
    var parser = new less.Parser({
        paths: ['variables.less', 'mixins.less']
      , optimization: 0
      , filename: 'bootstrap.css'
    }).parse(result, function (err, tree) {
      if (err) callback(null, {'css/error.txt': new Buffer(ERROR + '\n' + JSON.stringify(err), 'utf8')})
      callback(null, {
        'css/bootstrap.css'    : new Buffer(CW + tree.toCSS(), 'utf8')
      , 'css/bootstrap.min.css': new Buffer(CW + tree.toCSS({ compress: true }), 'utf8')
      })
    })
  } catch (err) {
    callback(null, {'css/error.txt': new Buffer(ERROR + '\n' + JSON.stringify(err), 'utf8')})
  }

}

function generateCustomCSS (params) {
  return params.vars ? Object.keys(params.vars)
  .map(function (key) {
    return params.vars[key] ? (key + ': ' + params.vars[key] + ';') : ''
  })
  .join('\n') + '\n\n' : ''
}

module.exports = css
module.exports.cache = cache
module.exports.FILES = FILES
