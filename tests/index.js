// ========================================================================
// bootstrap-server v0.1.0 - tests
// http://twbs.github.com/bootstrap
// ========================================================================
// Copyright 2013 twitter, Inc.
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

var assert  = require('assert')
var express = require('express')

// CSS
// =======================================

var CSS = require('../lib/css')

// basic api
assert.ok(typeof CSS == 'function')
assert.ok(typeof CSS.cache == 'function')
assert.ok(typeof CSS.FILES == 'object')

// css cache method
CSS.cache(function (err, cache) {
    assert(!err)

    CSS.FILES.forEach(function (filename) {
        assert.ok(cache[filename])
    })

    CSS({ css: ['reset.less'] }, function (err, response) {
        assert(!err)
        assert(response['css/bootstrap.css'])
        assert(response['css/bootstrap.min.css'])
    })
})


// IMG
// =======================================

var IMG = require('../lib/img')

// basic api
assert.ok(typeof IMG == 'function')
assert.ok(typeof IMG.cache == 'function')
assert.ok(typeof IMG.FILES == 'object')

// css cache method
IMG.cache(function (err, cache) {
    assert(!err)

    IMG.FILES.forEach(function (filename) {
        assert.ok(cache[filename])
    })

    IMG({ img: ['glyphicons-halflings.png'] }, function (err, response) {
        assert(!err)
        assert(response['img/glyphicons-halflings.png'])
    })
})


// JS
// =======================================

var JS = require('../lib/js')

// basic api
assert.ok(typeof JS == 'function')
assert.ok(typeof JS.cache == 'function')
assert.ok(typeof JS.FILES == 'object')

// css cache method
JS.cache(function (err, cache) {
    assert(!err)

    JS.FILES.forEach(function (filename) {
        assert.ok(cache[filename])
    })

    JS({ js: ['bootstrap-transition.js'] }, function (err, response) {
        assert(!err)
        assert(response['js/bootstrap.js'])
        assert(response['js/bootstrap.min.js'])
    })
})