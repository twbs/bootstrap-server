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

var uglifyJS = require('uglify-js')
  , path     = require('path')
  , https    = require('https')
  , TAG      = 'v2.3.2'
  , CACHE    = {}
  , FILES    = [ "bootstrap-transition.js"
               , "bootstrap-affix.js"
               , "bootstrap-modal.js"
               , "bootstrap-dropdown.js"
               , "bootstrap-scrollspy.js"
               , "bootstrap-tab.js"
               , "bootstrap-tooltip.js"
               , "bootstrap-popover.js"
               , "bootstrap-alert.js"
               , "bootstrap-button.js"
               , "bootstrap-collapse.js"
               , "bootstrap-carousel.js"
               , "bootstrap-typeahead.js" ]

function cache() {

  var done   = 0
    , _cache = {}

  FILES.forEach(function (filename) {
    var req
      , content = []
      , options = {
          host: 'raw.github.com'
        , port: 443
        , path: path.join('/twbs/bootstrap/', TAG, '/js/', filename)
        , method: 'GET'
        }

    req = https.request(options, function(res) {

      res.setEncoding('utf8')

      res.on('data', function (chunk) {
        content.push(chunk)
      })

      res.on('end', function () {
        _cache[filename] = content.join('')
        if (++done == FILES.length) {
          CACHE = _cache
        }
      })
    })

    req.end()
  })

}

function js(params, callback) {
  var min, content = params.js.map(function (filename) {
    return CACHE[filename]
  }).join('\n')

  try {
    min = uglify(content, params.js)
  } catch (e) {
    min = 'Error minifying source - please open issue on http://github.com/twbs/bootstrap! thank you :)'
  }

  callback(null, {
    'js/bootstrap.js'    : new Buffer(content, 'utf8')
  , 'js/bootstrap.min.js': new Buffer(min, 'utf8')
  })
}

function uglify(input, names) {
  var content = input.replace(/[\"\']use strict[\"\']/gi, '')
    , tok = uglifyJS.parser.tokenizer(content)
    , c = tok()
    , result
    , ast

  result = '/**\n'
    + '* Bootstrap.js by @fat & @mdo\n'
    + '* plugins: ' + names.join(', ') + '\n'
    + '* Copyright 2013 Twitter, Inc.\n'
    + '* http://www.apache.org/licenses/LICENSE-2.0.txt\n'
    + '*/\n'

  ast = uglifyJS.parser.parse(content)
  ast = uglifyJS.uglify.ast_mangle(ast)
  ast = uglifyJS.uglify.ast_squeeze(ast)

  return result += uglifyJS.uglify.gen_code(ast)
}

module.exports = js
module.exports.cache = cache
module.exports.FILES = FILES
