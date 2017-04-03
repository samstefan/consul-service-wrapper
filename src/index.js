import Consul from 'consul'
import util from 'util'

import {
  invalidServiceConfig,
  getServiceError,
  getServiceByTagError,
  formatUriError
} from './errors'

/**
 * ConsulService acts as a wrapper around the "consul" packge allowing you to
 * easly reigster a service and get dependent services from Consul
 */
export default class ConsulService {
  /**
   * @param {Object} consulSettings is the Consul connection data any options
   *                                that work with the consul npm package will
   *                                work here.
   */
  constructor (consulSettings = {}) {
    this.consulSettings = consulSettings
    this.consul = new Consul(this.consulSettings)
  }

  /**
   * registerService takes a service config and registers it with Consul.
   * @param  {Object}  service is the config object for creating the service.
   *                   Example:
   *                   {
   *                     name: 'redis', - required
   *                     port: 6379, - required
   *                     tags: ['stable'], - optional
   *                     address: '127.0.0.1', - optional
   *                     id: 'reids', - optional
   *                   }
   * @return {Promise} resolves on complete.
   */
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

  /**
   * getService allows you to fetch a service by name if more than one is
   * match then one will be returned at random.
   * @param  {String} service is the service name you want to get data for.
   * @return {Promise}        resolves with the servie data object or null if
   *                          not found.
   */
  getService (service) {
    return new Promise((resolve, reject) => {
      if (!service || typeof service === 'undefined') {
        return reject(getServiceError('"service" is required'))
      }

      this.consul.catalog.service.nodes(service, (err, result) => {
        if (err) {
          return reject(err)
        }

        if (!result || result.length === 0) {
          return resolve(null)
        }

        const service = result[Math.floor(Math.random() * result.length)]

        return resolve(service)
      })
    })
  }

  /**
   * Get a service by name and tag if more than one service is found one matching
   * service will be retrned at random.
   * @param  {String} service is the service name you want to get data for.
   * @param  {String} tag     is the tag you want to get data for.
   * @return {Promise}        resolves with the servie data object or null if
   *                          not found.
   */
  getServiceByTag (service, tag) {
    return new Promise((resolve, reject) => {
      if (!service || typeof service === 'undefined') {
        return reject(getServiceByTagError('"service" is required'))
      }

      if (!tag || typeof tag === 'undefined') {
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

  /**
   * Takes in a service object and formats a URI from it
   * @param  {Object} service is the Service object resolved from
   *                          "getServiceByTag" and "getService"
   * @return {String}         The formatted URI
   */
  formatUri (service) {
    if (!service || typeof service === 'undefined') {
      throw formatUriError('"service" is required')
    }

    const { Address, ServicePort } = service
    return util.format('%s:%d', Address, ServicePort)
  }
}

/**
 * Takes a config and vaildtes
 * @param  {Object} config is the config to validate
 * @return {Object}        the validated config
 */
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
