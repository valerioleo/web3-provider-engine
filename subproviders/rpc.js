<<<<<<< HEAD
=======
const xhr = process.browser ? require('xhr') : require('request')
>>>>>>> master
const inherits = require('util').inherits
const createPayload = require('../util/create-payload.js')
const Subprovider = require('./subprovider.js')
const { ethErrors, serializeError } = require('eth-rpc-errors')


require('es6-promise').polyfill();
require('isomorphic-fetch');

module.exports = RpcSource

inherits(RpcSource, Subprovider)

function RpcSource(opts) {
  const self = this
  self.rpcUrl = opts.rpcUrl
}

<<<<<<< HEAD

RpcSource.prototype.handleRequest = function (payload, next, end) {
=======
RpcSource.prototype.handleRequest = function(payload, next, end){
>>>>>>> master
  const self = this
  const targetUrl = self.rpcUrl

  // overwrite id to conflict with other concurrent users
  const sanitizedPayload = sanitizePayload(payload)
  const newPayload = createPayload(sanitizedPayload)

  fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPayload),
    rejectUnauthorized: false,
<<<<<<< HEAD
  })
  .then((res) => {
    if (res.status != 200) {
      return new Error("HTTP Error: " + res.statusCode + " on " + method);
    }

      // parse response into raw account
    var data
    try {
      data = res.json()
      if (data.error) return end(data.error)
    } catch (err) {
      console.error(err.stack)
      return err
    }
    end(null, data.result)
  })
  .catch((error) => {
    return end(error)
  })
=======
    timeout: 20000,
  }, function(err, res, body) {
    if (err) return end(serializeError(err))

    // check for error code
    switch (res.statusCode) {
      case 405:
        return end(ethErrors.rpc.methodNotFound())
      case 504: // Gateway timeout
        return (function(){
          let msg = `Gateway timeout. The request took too long to process. `
          msg += `This can happen when querying logs over too wide a block range.`
          const err = new Error(msg)
          return end(serializeError(err))
        })()
      case 429: // Too many requests (rate limiting)
        return (function(){
          const err = new Error(`Too Many Requests`)
          return end(serializeError(err))
        })()
      default:
        if (res.statusCode != 200) {
          const msg = 'Unknown Error: ' + res.body
          const err = new Error(msg)
          return end(serializeError(err))
        }
    }

    // parse response
    let data
    try {
      data = JSON.parse(body)
    } catch (err) {
      console.error(err.stack)
      return end(serializeError(err))
    }
    if (data.error) return end(data.error)

    end(null, data.result)
  })
>>>>>>> master
}

// drops any non-standard params
function sanitizePayload (payload) {
  return {
    id: payload.id,
    jsonrpc: payload.jsonrpc,
    method: payload.method,
    params: payload.params,
  }
}