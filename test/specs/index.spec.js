const expect = require('chai').expect

const ConsulService = require('../../lib')
const vaildateServiceConfig = require('../../lib').vaildateServiceConfig

describe('src/index.js', () => {
  describe('ConsulService', () => {
    it('Should pass options to consul', () => {
      const options = { host: '127.0.0.1', port: 8500 }
      const consulService = new ConsulService(options)
      expect(consulService.consulSettings).to.deep.equal(options)
    })

    describe('registerService', () => {
      it('Should register a service with consul', () => {
        const service = { name: 'test-service', port: 8080 }
        const consulService = new ConsulService()
        let testOptions = {}

        consulService.consul.agent.service.register = (options, callback) => {
          testOptions = options
          callback()
        }

        return consulService
          .registerService(service)
          .then(() => {
            expect(testOptions.name).to.equal('test-service')
            expect(testOptions.port).to.equal(8080)
          })
      })

      it('Should reject if error', () => {
        const service = { name: 'test-service', port: 8080 }
        const consulService = new ConsulService()

        consulService.consul.agent.service.register = (options, callback) => {
          callback('Something bad as happend')
        }

        return consulService
          .registerService(service)
          .catch(err => {
            expect(err).to.equal('Something bad as happend')
          })
      })

      it('Should throw error if no config passed', () => {
        const consulService = new ConsulService()
        return consulService
          .registerService()
          .catch(err => {
            expect(err.name).to.equal('invalidServiceConfig')
          })
      })

      it('Should pass through tags', () => {
        const service = { name: 'test-service', tags: ['cats'], port: 8080 }
        const consulService = new ConsulService()
        let testOptions = {}

        consulService.consul.agent.service.register = (options, callback) => {
          testOptions = options
          callback()
        }

        return consulService
          .registerService(service)
          .then(() => {
            expect(testOptions.tags).to.deep.equal(['cats'])
          })
      })

      it('Should pass through address', () => {
        const service = { name: 'test-service', port: 8080, address: '192.168.1.1' }
        const consulService = new ConsulService()
        let testOptions = {}

        consulService.consul.agent.service.register = (options, callback) => {
          testOptions = options
          callback()
        }

        return consulService
          .registerService(service)
          .then(() => {
            expect(testOptions.address).to.equal('192.168.1.1')
          })
      })

      it('Should pass through id', () => {
        const service = { name: 'test-service', port: 8080, id: 'test-service' }
        const consulService = new ConsulService()
        let testOptions = {}

        consulService.consul.agent.service.register = (options, callback) => {
          testOptions = options
          callback()
        }

        return consulService
          .registerService(service)
          .then(() => {
            expect(testOptions.id).to.equal('test-service')
          })
      })
    })

    describe('getService', () => {
      it('Should return a found service on "getService" when service ID exists', () => {
        const consulService = new ConsulService()
        const services = [
          {
            Node: 'MBP',
            Address: '127.0.0.1',
            TaggedAddresses: { lan: '127.0.0.1', wan: '127.0.0.1' },
            ServiceID: 'test-service',
            ServiceName: 'test-service',
            ServiceTags: [ ],
            ServiceAddress: '',
            ServicePort: 8080,
            ServiceEnableTagOverride: false,
            CreateIndex: 1440,
            ModifyIndex: 1452
          }
        ]

        consulService.consul.catalog.service.nodes = (serviceName, callback) => {
          callback(null, services)
        }

        return consulService
          .getService('test-service')
          .then(service => {
            expect(service).to.deep.equal(services[0])
          })
      })

      it('Should reject if service is not passed through', () => {
        const consulService = new ConsulService()

        return consulService
          .getService()
          .catch(reason => {
            expect(reason.name).to.equal('getServiceError')
            expect(reason.message).to.equal('"service" is required')
          })
      })

      it('Should reject consul returns an error', () => {
        const consulService = new ConsulService()
        consulService.consul.catalog.service.nodes = (serviceName, callback) => {
          callback('Failed to connect')
        }

        return consulService
          .getService('test-service')
          .catch(reason => {
            expect(reason).to.equal('Failed to connect')
          })
      })

      it('Should resolve rull if no service matched', () => {
        const consulService = new ConsulService()
        consulService.consul.catalog.service.nodes = (serviceName, callback) => {
          callback(null, [])
        }

        return consulService
          .getService('test-service')
          .then(service => {
            expect(service).to.equal(null)
          })
      })
    })

    describe('getServiceByTag', () => {
      it('Should return a found service on "getServiceByTag" when service ID and tag exists', () => {
        const consulService = new ConsulService()
        const services = [
          {
            Node: 'MBP',
            Address: '127.0.0.1',
            TaggedAddresses: { lan: '127.0.0.1', wan: '127.0.0.1' },
            ServiceID: 'test-service',
            ServiceName: 'test-service',
            ServiceTags: [ 'redis' ],
            ServiceAddress: '',
            ServicePort: 8080,
            ServiceEnableTagOverride: false,
            CreateIndex: 1440,
            ModifyIndex: 1452
          }
        ]

        consulService.consul.catalog.service.nodes = (service, callback) => {
          callback(null, services)
        }

        return consulService
          .getServiceByTag('test-service', 'redis')
          .then(service => {
            expect(service).to.deep.equal(services[0])
          })
      })

      it('Should reject if service is not defined', () => {
        const consulService = new ConsulService()
        return consulService
          .getServiceByTag()
          .catch(reason => {
            expect(reason.name).to.equal('getServiceByTagError')
            expect(reason.message).to.equal('"service" is required')
          })
      })

      it('Should reject if tag is not defined', () => {
        const consulService = new ConsulService()
        return consulService
          .getServiceByTag('test-service')
          .catch(reason => {
            expect(reason.name).to.equal('getServiceByTagError')
            expect(reason.message).to.equal('"tag" is required')
          })
      })

      it('Should reject if consul returns error', () => {
        const consulService = new ConsulService()

        consulService.consul.catalog.service.nodes = (service, callback) => {
          callback('Failed to connect')
        }

        return consulService
          .getServiceByTag('test-service', 'redis')
          .catch(reason => {
            expect(reason).to.equal('Failed to connect')
          })
      })

      it('Should return null if no matching service is found', () => {
        const consulService = new ConsulService()

        consulService.consul.catalog.service.nodes = (service, callback) => {
          callback(null, undefined)
        }

        return consulService
          .getServiceByTag('test-service', 'redis')
          .then(service => {
            expect(service).to.equal(null)
          })
      })

      it('Should return null if no matching tag is returned', () => {
        const consulService = new ConsulService()
        const services = [
          {
            Node: 'MBP',
            Address: '127.0.0.1',
            TaggedAddresses: { lan: '127.0.0.1', wan: '127.0.0.1' },
            ServiceID: 'test-service',
            ServiceName: 'test-service',
            ServiceTags: [ 'staging' ],
            ServiceAddress: '',
            ServicePort: 8080,
            ServiceEnableTagOverride: false,
            CreateIndex: 1440,
            ModifyIndex: 1452
          }
        ]

        consulService.consul.catalog.service.nodes = (service, callback) => {
          callback(null, services)
        }

        return consulService
          .getServiceByTag('test-service', 'redis')
          .then(service => {
            expect(service).to.equal(null)
          })
      })

      it('Should return one service if more than one match', () => {
        const consulService = new ConsulService()
        const services = [
          {
            Node: 'MBP',
            Address: '127.0.0.1',
            TaggedAddresses: { lan: '127.0.0.1', wan: '127.0.0.1' },
            ServiceID: 'test-service',
            ServiceName: 'test-service',
            ServiceTags: [ 'staging' ],
            ServiceAddress: '',
            ServicePort: 8080,
            ServiceEnableTagOverride: false,
            CreateIndex: 1440,
            ModifyIndex: 1452
          },
          {
            Node: 'MBP',
            Address: '127.0.0.1',
            TaggedAddresses: { lan: '127.0.0.1', wan: '127.0.0.1' },
            ServiceID: 'test-service',
            ServiceName: 'test-service',
            ServiceTags: [ 'staging' ],
            ServiceAddress: '',
            ServicePort: 8080,
            ServiceEnableTagOverride: false,
            CreateIndex: 1440,
            ModifyIndex: 1452
          }
        ]

        consulService.consul.catalog.service.nodes = (service, callback) => {
          callback(null, services)
        }

        return consulService
          .getServiceByTag('test-service', 'staging')
          .then(service => {
            expect(service).to.deep.equal(services[0])
          })
      })

      describe('when passing in an array of tags', () => {
        const consulService = new ConsulService()
        const services = [
          {
            Node: 'MBP',
            Address: '127.0.0.1',
            TaggedAddresses: { lan: '127.0.0.1', wan: '127.0.0.1' },
            ServiceID: 'test-service',
            ServiceName: 'test-service',
            ServiceTags: [ 'redis', 'testing' ],
            ServiceAddress: '',
            ServicePort: 8080,
            ServiceEnableTagOverride: false,
            CreateIndex: 1440,
            ModifyIndex: 1452
          }
        ]
        consulService.consul.catalog.service.nodes = (service, callback) => {
          callback(null, services)
        }

        it('should return services that are associated with a set of tags', () => {
          return consulService
            .getServiceByTag('test-service', ['redis', 'testing'])
            .then(service => {
              expect(service).to.deep.equal(services[0])
            })
        })

        it('should return null if not all tags match a service\'s set of tags', () => {
          return consulService
            .getServiceByTag('test-service', ['testing'])
            .then(service => {
              expect(service).to.deep.equal(null)
            })
        })

        it('should return null if tags is an empty array', () => {
          return consulService
            .getServiceByTag('test-service', [])
            .then(service => {
              expect(service).to.deep.equal(null)
            })
        })
      })
    })

    describe('formatUri', () => {
      it('Should return a formatted URI when a service is passed in', () => {
        const consul = new ConsulService()
        const uri = consul.formatUri({
          ServiceAddress: '127.0.0.1',
          Address: '127.0.1.1',
          ServicePort: 80
        })
        expect(uri).to.equal('127.0.0.1:80')
      })

      it('Should return "Address" when "ServiceAddress" isn\'t defined', () => {
        const consul = new ConsulService()
        const uri = consul.formatUri({ Address: '127.0.1.1', ServicePort: 80 })
        expect(uri).to.equal('127.0.1.1:80')
      })

      it('Should thorw if no service is defined', () => {
        const consul = new ConsulService()
        expect(consul.formatUri).to.throw('"service" is required')
      })
    })
  })

  describe('vaildateServiceConfig', () => {
    it('Should return a vaild config', () => {
      const config = { name: 'test-service', port: 8080 }
      const vaildatedServiceConfig = vaildateServiceConfig(config)
      expect(config).to.deep.equal(vaildatedServiceConfig)
    })

    it('Should throw an error if name is not defined', () => {
      expect(() => vaildateServiceConfig()).to.throw('"name" is required')
    })

    it('Should throw an error if name is not a string', () => {
      expect(() => vaildateServiceConfig({ name: {} })).to.throw('"name" must be a string')
    })

    it('Should throw an error if port is not defined', () => {
      expect(() => vaildateServiceConfig({ name: 'test' })).to.throw('"port" is required')
    })

    it('Should throw an error if port is not a number', () => {
      expect(() => vaildateServiceConfig({ name: 'test', port: '80' })).to.throw('"port" must be a number')
    })

    it('Should thorw an error if tags is not an array', () => {
      expect(() => vaildateServiceConfig({ name: 'test', port: 80, tags: 'cats' })).to.throw('"tags" must be an array')
    })

    it('Should default tags to an array if not defined', () => {
      const config = { name: 'test-service', port: 8080 }
      const vaildatedServiceConfig = vaildateServiceConfig(config)
      expect(vaildatedServiceConfig.tags).to.be.a('Array')
    })

    it('Should throw an error if address is not a string', () => {
      const config = { name: 'test', port: 80, address: 127 }
      expect(() => vaildateServiceConfig(config)).to.throw('"address" must be a string')
    })

    it('Should throw an error if address is an empty string', () => {
      const config = { name: 'test', port: 80, address: '' }
      expect(() => vaildateServiceConfig(config)).to.throw('"address" can not be a empty string')
    })

    it('Should throw an error if id is not a string', () => {
      const config = { name: 'test', port: 80, id: 127 }
      expect(() => vaildateServiceConfig(config)).to.throw('"id" must be a string')
    })

    it('Should throw an error if id is an empty string', () => {
      const config = { name: 'test', port: 80, id: '' }
      expect(() => vaildateServiceConfig(config)).to.throw('"id" can not be a empty string')
    })
  })
})
