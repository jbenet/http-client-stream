#!/usr/bin/env node

var through2 = require('through2')
var minimist = require('minimist')
var http = require('./index')
var argv = minimist(process.argv.slice(2), {
  alias: {headers: 'I'},
  boolean: ['body', 'headers']
})

if (argv._.length < 1) {
  console.error('usage: ' + argv[0] + ' <url> [<request-opts-json>]')
  process.exit(1)
}

var url = argv._[0]
var opts = ((argv._.length > 1) ? JSON.parse(argv._[1]) : {})

var hcs = http(url)
var stream = hcs.createStream(opts)

if (argv.body) {
  process.stdin.pipe(stream)
} else {
  stream.end()
}

var out = process.stdout
if (argv.headers) {
  out = printHeadersStream(stream)
  out.pipe(process.stdout)
}

stream.pipe(out)

function printHeadersStream(stream) {
  var done = false
  return through2(function(data, enc, cb) {
    if (!done) {
      done = true
      printHeaders(stream.res.headers)
      console.log()
    }

    this.push(data)
    cb()
  })
}

function printHeaders(h) {
  for (var k in h) {
    if (h.hasOwnProperty(k)) {
      console.log(k +': ' + h[k])
    }
  }
}
