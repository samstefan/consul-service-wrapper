const ConsulService = require('./lib')
const vaildateServiceConfig = require('./lib').vaildateServiceConfig

module.exports = opts => new ConsulService(opts)

module.exports.vaildateServiceConfig = vaildateServiceConfig
