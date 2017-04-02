import Consul from 'consul'
import util from 'util'

import {
  invalidServiceConfig,
  getServiceError,
  getServiceByTagError,
  formatUriError
} from './errors'

export default class ConsulService {
  constructor (consulSettings = {}) {
    this.consul = new Consul(consulSettings)
  }

  registerService (service = {}) {
    return new Promise((resolve, reject) => {
      const vaildatedServiceConfig = vaildateServiceConfig(service)
      const options = {
        name: vaildatedServiceConfig.name,
        tags: vaildatedServiceConfig.tags,
        port: vaildatedServiceConfig.port
      }

      if (vaildatedServiceConfig.address) {
        options.address = vaildatedServiceConfig.address
      }

      if (vaildatedServiceConfig.id) {
        options.id = vaildatedServiceConfig.id
      }

      this.consul.agent.service.register(options, err => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  }

  getService (service) {
    return new Promise((resolve, reject) => {
      if (!service || service === '' || typeof service === 'undefined') {
        return reject(getServiceError('"service" is required'))
      }

      this.consul.catalog.service.nodes(service, (err, result) => {
        if (err) {
          return reject(err)
        }

        const service = result[Math.floor(Math.random() * result.length)]

        if (service) {
          return resolve(service)
        }

        resolve(null)
      })
    })
  }

  getServiceByTag (service, tag) {
    return new Promise((resolve, reject) => {
      if (!service || service === '' || typeof service === 'undefined') {
        return reject(getServiceByTagError('"service" is required'))
      }

      if (!tag || tag === '' || typeof tag === 'undefined') {
        return reject(getServiceByTagError('"tag" is required'))
      }

      this.consul.catalog.service.nodes(service, (err, result) => {
        if (err) {
          return reject(err)
        }

        if (!result || result.length === 0) {
          return resolve(null)
        }

        const services = result.filter(service => {
          let found = false

          service.ServiceTags.forEach(serviceTag => {
            if (serviceTag === tag) {
              found = true
            }
          })

          return found
        })

        if (services.length > 1) {
          return resolve(services[Math.floor(Math.random() * services.length)])
        }

        if (services.length === 0) {
          return resolve(null)
        }

        resolve(services[0])
      })
    })
  }

  formatUri (service) {
    if (!service || service === '' || typeof service === 'undefined') {
      throw formatUriError('"service" is required')
    }

    const { Address, ServicePort } = service
    return util.format('%s:%d', Address, ServicePort)
  }
}

export function vaildateServiceConfig (config = {}) {
  if (!config.name || typeof config.name === 'undefined') {
    throw invalidServiceConfig('"name" is required')
  }

  if (config.name && typeof config.name !== 'string') {
    throw invalidServiceConfig('"name" must be a string')
  }

  if (!config.port || typeof config.port === 'undefined') {
    throw invalidServiceConfig('"port" is required')
  }

  if (config.port && typeof config.port !== 'number') {
    throw invalidServiceConfig('"port" must be a number')
  }

  if (config.tags && !Array.isArray(config.tags)) {
    throw invalidServiceConfig('"tags" must be an array')
  }

  if (!config.tags) {
    config.tags = []
  }

  if (config.address && typeof config.address !== 'string') {
    throw invalidServiceConfig('"address" must be a string')
  }

  if (config.address === '') {
    throw invalidServiceConfig('"address" can not be a empty string')
  }

  if (config.id && typeof config.id !== 'string') {
    throw invalidServiceConfig('"id" must be a string')
  }

  if (config.id === '') {
    throw invalidServiceConfig('"id" can not be a empty string')
  }

  return config
}
