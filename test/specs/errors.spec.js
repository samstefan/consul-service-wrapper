import chai from 'chai'
const { expect } = chai

import * as errors from './../../src/errors'

describe('src/errors.js', () => {
  describe('invalidServiceConfig', () => {
    it('Should return an \'Error\' with the correct name and message', () => {
      const error = errors.invalidServiceConfig('test message')
      expect(error instanceof Error).to.equal(true)
      expect(error.message).to.equal('test message')
      expect(error.name).to.equal('invalidServiceConfig')
    })
  })

  describe('getServiceError', () => {
    it('Should return an \'Error\' with the correct name and message', () => {
      const error = errors.getServiceError('test message')
      expect(error instanceof Error).to.equal(true)
      expect(error.message).to.equal('test message')
      expect(error.name).to.equal('getServiceError')
    })
  })

  describe('getServiceByTagError', () => {
    it('Should return an \'Error\' with the correct name and message', () => {
      const error = errors.getServiceByTagError('test message')
      expect(error instanceof Error).to.equal(true)
      expect(error.message).to.equal('test message')
      expect(error.name).to.equal('getServiceByTagError')
    })
  })

  describe('formatUriError', () => {
    it('Should return an \'Error\' with the correct name and message', () => {
      const error = errors.formatUriError('test message')
      expect(error instanceof Error).to.equal(true)
      expect(error.message).to.equal('test message')
      expect(error.name).to.equal('formatUriError')
    })
  })
})
