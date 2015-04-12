var duplexify = require('duplexify')
var url = require('url')
var http = require('http')
var https = require('https')

var destroy = function () {
  this.destroy()
}

var error = function (res) {
  console.log(res)
  var err = new Error('Request failed')
  err.status = res.statusCode
  err.headers = res.headers
  return err
}

var endpoint = function (http, url, opts) {
  e = {
    followRedirects: (opts.followRedirects !== false)
  }

  e.requestVars = function(vars) {
    vars = vars || {}
    vars.method = vars.method || 'GET',
    vars.path = url.path
    vars.port = url.port
    vars.host = url.hostname

    vars.headers = vars.headers || {}
    if (url.auth) headers.Authorization = 'Basic ' + new Buffer(url.auth).toString('base64')

    return vars
  }

  e.createStream = function(vars) {
    vars = e.requestVars(vars)
    var req = http.request(vars)

    var stream = duplexify()
    stream.req = req
    stream.setWritable(req)


    req.on('response', function (res) {
      if (!/2\d\d/.test(res.statusCode)) return stream.destroy(error(res))
      stream.res = res
      stream.setReadable(res)
    })

    return stream
  }

  return e
}

module.exports = function(u, opts) {
  if (!u) throw new Error('Transport required')
  opts = opts || {}

  var u = url.parse(u)
  var proto = u.protocol ? u.protocol.slice(0, -1) : 'http'

  switch (proto) {
  case 'http': return new endpoint(http, u, opts)
  case 'https': return new endpoint(https, u, opts)
  default: throw new Error("unsupported protocol: " + proto)
  }
}
