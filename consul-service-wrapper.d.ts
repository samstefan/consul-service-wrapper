/// <reference types="consul" />

import * as Consul from 'consul'

/**
 * Factory function for creating a new ConsulService
 * @param options options you would pass to the official Consul client
 */
declare function SSConsul(
  options?: Consul.ConsulOptions
): SSConsul.ConsulService

declare namespace SSConsul {
  /**
   * ConsulService acts as a wrapper around the "consul" packge allowing you to
   * easly reigster a service and get dependent services from Consul
   */
  interface ConsulService {
    /**
     * connection options supported by the official
     * consul npm package
     */
    consulSettings: Consul.ConsulOptions

    /**
     * The consul instance
     */
    consul: Consul.Consul

    /**
     * Register a service with consul
     * Example:
     *
     * {
     *  name: 'redis,
     *  port: 6379,
     *  tags: ['stable'],
     *  address: '127.0.0.1',
     *  id: 'redis'
     * }
     */
    registerService(service: SSConsul.Service): Promise<void>

    /**
     * Fetches a service by name, if more than one is available
     * a random one is returned
     */
    getService(serviceName: string): Promise<object>

    /**
     * Fetches a service by tag, if more than one is available
     * a random one is returned
     * Example:
     *
     * consul.getServiceBytag('redis', 'stable')
     */
    getServiceByTag(serviceName: string, tag: string): Promise<object>

    /**
     * Fetches a service(s) associated with a set of tags. If the tags
     * do not match all of the tags a service is associated with, then it
     * will not be returned.
     * Example:
     *
     * // returns any nodes that match the tags: stable && testing.
     * consul.getServiceByTag('redis', ['stable', 'testing'])
     */
    getServiceByTag(serviceName: string, tags: Array<string>) : Promise<object>

    /**
     * Returns a uri for a service
     */
    formatUri(service: object): string
  }

  /**
   * Options for registering a service with Consul
   */
  interface Service {
    /** The name of the service **/
    name: string
    /** The port the service runs on **/
    port: number
    /** The tags to register the service with  **/
    tags?: Array<string>
    /** The id to register the service with (defaults to service name)  **/
    id?: string
    /** The address of the service **/
    address?: string
  }

  /**
   * Validates the configuration for a service
   */
  export function validateServiceConfig(configuration: Service): Service
}

export = SSConsul
