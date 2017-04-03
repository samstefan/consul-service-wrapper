'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidServiceConfig = invalidServiceConfig;
exports.getServiceError = getServiceError;
exports.getServiceByTagError = getServiceByTagError;
exports.formatUriError = formatUriError;
/**
 * Invalid service config
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
function invalidServiceConfig(message) {
  var error = new Error(message);
  error.name = 'invalidServiceConfig';
  return error;
}

/**
 * Get service error
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
function getServiceError(message) {
  var error = new Error(message);
  error.name = 'getServiceError';
  return error;
}

/**
 * Get service by tag error
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
function getServiceByTagError(message) {
  var error = new Error(message);
  error.name = 'getServiceByTagError';
  return error;
}

/**
 * Format URI error
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
function formatUriError(message) {
  var error = new Error(message);
  error.name = 'formatUriError';
  return error;
}