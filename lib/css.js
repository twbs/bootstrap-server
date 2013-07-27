// ========================================================================
// bootstrap-server v1.0.0
// http://twbs.github.com/bootstrap
// ========================================================================
// Copyright 2013 Twitter, Inc.
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
  , TAG   = "v2.3.2"
  , CW    = "/*!\n * Bootstrap v2.3.2\n *\n * Copyright 2013 Twitter, Inc\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\n */\n"
  , ERROR = "A less error occured trying to build your bundle. You've likely entered an invalid input into the less variable field. Check your syntax and try again!\n\n thanks!\n\n"
  , FILES = [ // CSS Reset
              "reset.less"

              // Core variables and mixins
            , "variables.less"
            , "mixins.less"

            // Grid system and page structure
            , "scaffolding.less"
            , "grid.less"
            , "layouts.less"

            // Base CSS
            , "type.less"
            , "code.less"
            , "forms.less"
            , "tables.less"

            // Components: common
            , "sprites.less"
            , "dropdowns.less"
            , "wells.less"
            , "component-animations.less"
            , "close.less"

            // Components: Buttons & Alerts
            , "buttons.less"
            , "button-groups.less"
            , "alerts.less"

            // Components: Nav
            , "navs.less"
            , "navbar.less"
            , "breadcrumbs.less"
            , "pagination.less"
            , "pager.less"

            // Components: Popovers
            , "modals.less"
            , "tooltip.less"
            , "popovers.less"

            // Components: Misc
            , "thumbnails.less"
            , "media.less"
            , "labels-badges.less"
            , "progress-bars.less"
            , "accordion.less"
            , "carousel.less"
            , "hero-unit.less"

            // Utility classes
            , "utilities.less"

            // responsive styles
            , "responsive-1200px-min.less"
            , "responsive-767px-max.less"
            , "responsive-768px-979px.less"
            , "responsive-navbar.less"
            , "responsive-utilities.less" ]


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
        , path: path.join('/twbs/bootstrap/', TAG, '/less/', filename)
        , method: 'GET'
        }

    req = https.request(options, function(res) {

      res.setEncoding('utf8')

      res.on('data', function (chunk) {
        content.push(chunk)
      })

      res.on('end', function () {

        _cache[filename] = content.join('')

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
