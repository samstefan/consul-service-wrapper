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

var ConsulService = function () {
  function ConsulService() {
    var consulSettings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ConsulService);

    this.consulSettings = consulSettings;
    this.consul = new _consul2.default(this.consulSettings);
  }

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