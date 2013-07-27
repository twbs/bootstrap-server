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
  , TAG   = 'v2.3.2'
  , CACHE = {}
  , FILES = [ 'glyphicons-halflings.png'
            , 'glyphicons-halflings-white.png' ]

function cache(callback) {
  var _cache   = {}
    , complete = 0

  FILES.forEach(function (filename) {
    var req
      , res
      , i = 0
      , content = []
      , options = {
          host: 'raw.github.com'
        , port: 443
        , path: path.join('/twbs/bootstrap', TAG, 'img', filename)
        , method: 'GET'
        }

    req = https.request(options, function(res) {

      var buffer = new Buffer(parseInt(res.header('Content-Length')))

      res.setEncoding('binary')

      res.on('data', function (chunk) {
        buffer.write(chunk, i, 'binary')
        i += chunk.length
      })

      res.on('end', function () {
        _cache[filename] = buffer
        if (++complete == FILES.length) {
          CACHE = _cache
          callback && callback(null, CACHE)
        }
      })

    })

    req.end()
  })

}

function img(params, callback) {
  var contents = {}
  params.img.forEach(function (filename) {
    contents['img/' + filename] = CACHE[filename]
  })
  callback(null, contents)
}

module.exports = img
module.exports.cache = cache
module.exports.FILES = FILES
