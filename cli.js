#!/usr/bin/env node

var minimist = require('minimist')
var http = require('./index')
var argv = minimist(process.argv.slice(2), {
  boolean: ['body']
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
stream.pipe(process.stdout)
