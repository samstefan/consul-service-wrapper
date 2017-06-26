/**
 * Invalid service config
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
module.exports.invalidServiceConfig = (message) => {
  const error = new Error(message)
  error.name = 'invalidServiceConfig'
  return error
}

/**
 * Get service error
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
module.exports.getServiceError = (message) => {
  const error = new Error(message)
  error.name = 'getServiceError'
  return error
}

/**
 * Get service by tag error
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
module.exports.getServiceByTagError = (message) => {
  const error = new Error(message)
  error.name = 'getServiceByTagError'
  return error
}

/**
 * Format URI error
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
module.exports.formatUriError = (message) => {
  const error = new Error(message)
  error.name = 'formatUriError'
  return error
}
