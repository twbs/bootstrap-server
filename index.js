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

var express = require('express')
  , zip     = require('node-native-zip')
  , app     = express.createServer()
  , types   = {}
  , downloadHandler

types.img = require('./lib/img')
types.js  = require('./lib/js')
types.css = require('./lib/css')

app.use(express.bodyParser())

function refreshCache() {
  Object.keys(types).forEach(function (type) {
    types[type].cache()
  })
}

refreshCache()
setInterval(refreshCache, 1000 * 60 * 60 * 2)


// API args:
//  + js   = array
//  + css  = array
//  + img  = array
//  + vars = obj

app.get('/', function (req, res) {
  res.send('Bootstrap Server - w/cache. <3');
})

downloadHandler = function downloadHandler(req, res) {
  var dist    = []
    , started = 0
    , params  = {}
    , archive = new zip()

  params.js   = req.query.js || req.body.js
  params.css  = req.query.css || req.body.css
  params.img  = req.query.img || req.body.img
  params.vars = req.query.vars || req.body.vars

  Object.keys(params).forEach(function (type) {
    if (!params[type] || params[type].length === 0) return
    params[type] = JSON.parse(params[type])
  })

  Object.keys(types).forEach(function (type) {
    if (!params[type] || params[type].length === 0) return
    types[type](params, complete)
  })

  function complete (err, files) {
    for (var i in files) archive.add(i, files[i])
  }

  res.attachment('bootstrap.zip')
  res.send(archive.toBuffer())
}

app.post('/', downloadHandler)
app.get('/bootstrap.zip', downloadHandler)

app.listen(process.env.PORT || 3000)