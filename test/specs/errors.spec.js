const expect = require('chai').expect

const invalidServiceConfig = require('../../lib/errors').invalidServiceConfig
const getServiceError = require('../../lib/errors').getServiceError
const getServiceByTagError = require('../../lib/errors').getServiceByTagError
const formatUriError = require('../../lib/errors').formatUriError

describe('src/errors.js', () => {
  describe('invalidServiceConfig', () => {
    it('Should return an \'Error\' with the correct name and message', () => {
      const error = invalidServiceConfig('test message')
      expect(error instanceof Error).to.equal(true)
      expect(error.message).to.equal('test message')
      expect(error.name).to.equal('invalidServiceConfig')
    })
  })

  describe('getServiceError', () => {
    it('Should return an \'Error\' with the correct name and message', () => {
      const error = getServiceError('test message')
      expect(error instanceof Error).to.equal(true)
      expect(error.message).to.equal('test message')
      expect(error.name).to.equal('getServiceError')
    })
  })

  describe('getServiceByTagError', () => {
    it('Should return an \'Error\' with the correct name and message', () => {
      const error = getServiceByTagError('test message')
      expect(error instanceof Error).to.equal(true)
      expect(error.message).to.equal('test message')
      expect(error.name).to.equal('getServiceByTagError')
    })
  })

  describe('formatUriError', () => {
    it('Should return an \'Error\' with the correct name and message', () => {
      const error = formatUriError('test message')
      expect(error instanceof Error).to.equal(true)
      expect(error.message).to.equal('test message')
      expect(error.name).to.equal('formatUriError')
    })
  })
})
