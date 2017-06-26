/// <reference types="consul" />

import * as Consul from 'consul'

/**
 * ConsulService acts as a wrapper around the "consul" packge allowing you to
 * easly reigster a service and get dependent services from Consul
 */
interface ConsulService {
    /**
     * connection options supported by the official
     * consul npm package
     */
    consulSettings: Consul.ConsulOptions,

    /**
     * The consul instance
     */
    consul: Consul.Consul,

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
    registerService (
        service: SSConsul.Service
    ): Promise<void>,

    /**
     * Fetches a service by name, if more than one is available
     * a random one is returned
     */
    getService (
        serviceName: string
    ): Promise<object>,

    /**
     * Fetches a service by tag, if more than one is available
     * a random one is returned
     * Example:
     * 
     */
    getServiceByTag (
        serviceName: string,
        tag: string
    ): Promise<object>,

    /**
     * Returns a uri for a service
     */
    formatUri (
        service: object
    ): string,
}

declare function SSConsul (
    options?: Consul.ConsulOptions
) : ConsulService

declare namespace SSConsul {
    export interface Service {
        /** The name of the service **/
        name: string,
        /** The port the service runs on **/
        port: number,
        /** The tags to register the service with  **/
        tags?: Array<string>,
        /** The id to register the service with (defaults to service name)  **/
        id?: string
        /** The address of the service **/
        address?: string
    }

    /**
     * Validates the configuration for a service
     */
    export function validateServiceConfig(
        configuration: Service
    ) : Service
}

export = SSConsul
