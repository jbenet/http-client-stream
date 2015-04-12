# http-client-stream

## Usage

Use http requests as streams:

```js
var http = require('http-client-stream')
var endpoint = http('http://www.google.com')
var stream = endpoint.createStream()
process.stdin.pipe(stream.pipe(process.stdout))
```

Use request options to add methods:

```js
var http = require('http-client-stream')
var endpoint = http('http://www.google.com')
var stream = endpoint.createStream({
  method: 'HEAD'
})
process.stdin.pipe(stream.pipe(process.stdout))
```

Use request options to add headers:

```js
var http = require('http-client-stream')
var endpoint = http('http://www.google.com')
var stream = endpoint.createStream({
  headers: {
    'Range': 'bytes=9000-9001'
  }
})
process.stdin.pipe(stream.pipe(process.stdout))
```

## CLI

You can even use the cli:

```sh
npm install -g http-client-stream
http-stream http://gateway.ipfs.io/ipfs/QmUW2JxCaELBzy6jhdQjmyvd7sv1EVpunE2kqQta3SekYM/big_buck_bunny.avi
```

And you can pass json opts

```sh
http-stream http://gateway.ipfs.io/ipfs/QmUW2JxCaELBzy6jhdQjmyvd7sv1EVpunE2kqQta3SekYM/big_buck_bunny.avi '{"headers": {"Range":"bytes=100-104"}}'
```

And a body

```sh
> echo beep boop | http-stream --body http://localhost/echo '{"method": "POST"}'
beep boop
```
