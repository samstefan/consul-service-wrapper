/**
 * Invalid service config failed
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
export function invalidServiceConfig (message) {
  const error = new Error(message)
  error.name = 'invalidServiceConfig'
  return error
}

/**
 * Get service error
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
export function getServiceError (message) {
  const error = new Error(message)
  error.name = 'getServiceError'
  return error
}

/**
 * Get service by tag error
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
export function getServiceByTagError (message) {
  const error = new Error(message)
  error.name = 'getServiceByTagError'
  return error
}

/**
 * Format URI error
 * @param  {String} message is discription you want to add to the error.
 * @return {Error}         a new error with the correct name and message.
 */
export function formatUriError (message) {
  const error = new Error(message)
  error.name = 'formatUriError'
  return error
}
