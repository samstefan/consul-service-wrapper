'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.vaildateServiceConfig = vaildateServiceConfig;

var _consul = require('consul');

var _consul2 = _interopRequireDefault(_consul);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ConsulService acts as a wrapper around the "consul" packge allowing you to
 * easly reigster a service and get dependent services from Consul
 */
var ConsulService = function () {
  /**
   * @param {Object} consulSettings is the Consul connection data any options
   *                                that work with the consul npm package will
   *                                work here.
   */
  function ConsulService() {
    var consulSettings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ConsulService);

    this.consulSettings = consulSettings;
    this.consul = new _consul2.default(this.consulSettings);
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


  _createClass(ConsulService, [{
    key: 'registerService',
    value: function registerService() {
      var _this = this;

      var service = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Promise(function (resolve, reject) {
        var vaildatedServiceConfig = vaildateServiceConfig(service);
        var options = {
          name: vaildatedServiceConfig.name,
          tags: vaildatedServiceConfig.tags,
          port: vaildatedServiceConfig.port
        };

        if (vaildatedServiceConfig.address) {
          options.address = vaildatedServiceConfig.address;
        }

        if (vaildatedServiceConfig.id) {
          options.id = vaildatedServiceConfig.id;
        }

        _this.consul.agent.service.register(options, function (err) {
          if (err) {
            return reject(err);
          }

          resolve();
        });
      });
    }

    /**
     * getService allows you to fetch a service by name if more than one is
     * match then one will be returned at random.
     * @param  {String} service is the service name you want to get data for.
     * @return {Promise}        resolves with the servie data object or null if
     *                          not found.
     */

  }, {
    key: 'getService',
    value: function getService(service) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (!service || typeof service === 'undefined') {
          return reject((0, _errors.getServiceError)('"service" is required'));
        }

        _this2.consul.catalog.service.nodes(service, function (err, result) {
          if (err) {
            return reject(err);
          }

          if (!result || result.length === 0) {
            return resolve(null);
          }

          var service = result[Math.floor(Math.random() * result.length)];

          return resolve(service);
        });
      });
    }

    /**
     * Get a service by name and tag if more than one service is found one matching
     * service will be retrned at random.
     * @param  {String} service is the service name you want to get data for.
     * @param  {String} tag     is the tag you want to get data for.
     * @return {Promise}        resolves with the servie data object or null if
     *                          not found.
     */

  }, {
    key: 'getServiceByTag',
    value: function getServiceByTag(service, tag) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (!service || typeof service === 'undefined') {
          return reject((0, _errors.getServiceByTagError)('"service" is required'));
        }

        if (!tag || typeof tag === 'undefined') {
          return reject((0, _errors.getServiceByTagError)('"tag" is required'));
        }

        _this3.consul.catalog.service.nodes(service, function (err, result) {
          if (err) {
            return reject(err);
          }

          if (!result || result.length === 0) {
            return resolve(null);
          }

          var services = result.filter(function (service) {
            var found = false;

            service.ServiceTags.forEach(function (serviceTag) {
              if (serviceTag === tag) {
                found = true;
              }
            });

            return found;
          });

          if (services.length > 1) {
            return resolve(services[Math.floor(Math.random() * services.length)]);
          }

          if (services.length === 0) {
            return resolve(null);
          }

          resolve(services[0]);
        });
      });
    }

    /**
     * Takes in a service object and formats a URI from it
     * @param  {Object} service is the Service object resolved from
     *                          "getServiceByTag" and "getService"
     * @return {String}         The formatted URI
     */

  }, {
    key: 'formatUri',
    value: function formatUri(service) {
      if (!service || typeof service === 'undefined') {
        throw (0, _errors.formatUriError)('"service" is required');
      }

      var Address = service.Address,
          ServicePort = service.ServicePort;

      return _util2.default.format('%s:%d', Address, ServicePort);
    }
  }]);

  return ConsulService;
}();

/**
 * Takes a config and vaildtes
 * @param  {Object} config is the config to validate
 * @return {Object}        the validated config
 */


exports.default = ConsulService;
function vaildateServiceConfig() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!config.name || typeof config.name === 'undefined') {
    throw (0, _errors.invalidServiceConfig)('"name" is required');
  }

  if (config.name && typeof config.name !== 'string') {
    throw (0, _errors.invalidServiceConfig)('"name" must be a string');
  }

  if (!config.port || typeof config.port === 'undefined') {
    throw (0, _errors.invalidServiceConfig)('"port" is required');
  }

  if (config.port && typeof config.port !== 'number') {
    throw (0, _errors.invalidServiceConfig)('"port" must be a number');
  }

  if (config.tags && !Array.isArray(config.tags)) {
    throw (0, _errors.invalidServiceConfig)('"tags" must be an array');
  }

  if (!config.tags) {
    config.tags = [];
  }

  if (config.address && typeof config.address !== 'string') {
    throw (0, _errors.invalidServiceConfig)('"address" must be a string');
  }

  if (config.address === '') {
    throw (0, _errors.invalidServiceConfig)('"address" can not be a empty string');
  }

  if (config.id && typeof config.id !== 'string') {
    throw (0, _errors.invalidServiceConfig)('"id" must be a string');
  }

  if (config.id === '') {
    throw (0, _errors.invalidServiceConfig)('"id" can not be a empty string');
  }

  return config;
}