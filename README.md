# Consul Service Wrapper
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![CircleCI](https://circleci.com/gh/samstefan/consul-service-wrapper.svg?style=svg)](https://circleci.com/gh/samstefan/consul-service-wrapper)

Easily create and connect a service with [Consul](https://www.consul.io/) in Node.js.

## Prerequisite
This project is auto compiled from ES2015 to ES5 by Babel, if you'd like to use the ES2015 code directly you can require it by doing the following:
```
import ConsulService from 'consul-service-wrapper/src';
```

## Getting started

### Common JS
- `npm install <add-when-deployed> --save`
- `var ConsulService = require('consul-service-wrapper').default;`

### ES2015 Import
- `npm install <add-when-deployed> --save`
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

### `id`
The id to register the service with.

| Name | Type   | Required | Default |
|------|--------|----------|---------|
| `id` | String | N        | `name`  |

## License
License (MIT)

Copyright (c) 2017 Sam Stefan, http://samstefan.co.uk

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
