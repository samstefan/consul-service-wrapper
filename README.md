# Consul Service Wrapper
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Coverage Status](https://coveralls.io/repos/github/samstefan/consul-service-wrapper/badge.svg?branch=master)](https://coveralls.io/github/samstefan/consul-service-wrapper?branch=master)
[![CircleCI](https://circleci.com/gh/samstefan/consul-service-wrapper.svg?style=svg)](https://circleci.com/gh/samstefan/consul-service-wrapper)

Easily create and connect a service with [Consul](https://www.consul.io/) in Node.js.

## Prerequisite
This project is auto compiled from ES2015 to ES5 by Babel, if you'd like to use the ES2015 code directly you can require it by doing the following:
```
import ConsulService from 'consul-service-wrapper/src';
```

## Getting started

### Common JS
- `npm install consul-service-wrapper --save`
- `var ConsulService = require('consul-service-wrapper').default;`

### ES2015 Import
- `npm install consul-service-wrapper --save`
- `import ConsulService from 'consul-service-wrapper';`

## Configuration
The `ConsulService` takes the same configertions as the [Console](https://www.npmjs.com/package/consul) package for connection to the Consule server, for more details please check the [Console package documentation](https://www.npmjs.com/package/consul#init).

## Methods

### `registerService(service)`
registerService takes a service config as an `Object` and registers it with Consul. The following lists each available option and what it does:

#### `name`
The name of the service.

| Name     | Type   | Required | Default     |
|----------|--------|----------|-------------|
| `name`   | String | Y        | `undefined` |

#### `port`
The port the the service runs on.

| Name     | Type   | Required | Default     |
|----------|--------|----------|-------------|
| `port`   | Number | Y        | `undefined` |

#### `tags`
The tags to register the service with.

| Name     | Type   | Required | Default     |
|----------|--------|----------|-------------|
| `tags`   | Array  | N        | `[]`        |

#### `address`
The address of the service. 

| Name      | Type   | Required | Default     |
|-----------|--------|----------|-------------|
| `address` | String | N        | `127.0.0.1` |

#### `id`
The id to register the service with. Defaults to using the service name.

| Name | Type   | Required | Default |
|------|--------|----------|---------|
| `id` | String | N        | `name`  |

#### Usage

```
const service = { name: 'test-service', port: 8080 }
const consulService = new ConsulService()
consulService
  .registerService(service)
  .catch(err => console.log(err))
```

### `getService(serviceName)`
getService allows you to fetch a service by name if more than one is match then one will be returned at random.

#### `serviceName`
The service name you want to fetch.

| Name          | Type   | Required | Default      |
|---------------|--------|----------|--------------|
| `serviceName` | String | Y        | `undefined`  |

#### Usage

```
const consulService = new ConsulService()
consulService
  .getService('test-service')
  .then(service => console.log(service)) 
  .catch(err => console.error(err))
```

### `getServiceByTag(serviceName, tag)`
Get a service by name and tag if more than one service is found one matching service will be retrned at random.

#### `serviceName`
The service name you want to fetch.

| Name          | Type   | Required | Default      |
|---------------|--------|----------|--------------|
| `serviceName` | String | Y        | `undefined`  |

#### `tag`
The service tag you want to filter by.

| Name  | Type   | Required | Default      |
|-------|--------|----------|--------------|
| `tag` | String | Y        | `undefined`  |

### Usage

```
const consulService = new ConsulService()
consulService
  .getServiceByTag('test-service, 'stable')
  .then(service => console.log(service)) 
  .catch(err => console.log(err))
```

### `formatUri(service)`
Takes in a service object and formats a URI from it E.G. `127.0.0.1:8080`

#### `service`
The service object returned from `getServiceByTag` or `getService`.

| Name      | Type   | Required | Default      |
|-----------|--------|----------|--------------|
| `service` | Object | Y        | `undefined`  |

#### Usage

```
const consulService = new ConsulService()
consulService
  .getService('test-service')
  .then(service => consulService.formatUri(service))
  .then(uri => console.log(uri))
  .catch(err => console.error(err))
```

## Contributing and Developing

### Testing
- Running unit tests: `npm test`

### Scripts
- `test`: Runs the unit tests
- `build`: Compiles the code to ES5 in the dist folder
- `dev`: Compiles the code to ES5 and watches for changes

## License
License (MIT)

Copyright (c) 2017 Sam Stefan, http://samstefan.co.uk

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
