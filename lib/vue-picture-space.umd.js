(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-picture-space"] = factory();
	else
		root["vue-picture-space"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "0a06":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var buildURL = __webpack_require__("30b5");
var InterceptorManager = __webpack_require__("f6b4");
var dispatchRequest = __webpack_require__("5270");
var mergeConfig = __webpack_require__("4a7b");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "0df6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "1c62":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "1d2b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "1e55":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_table_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("65d5");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_table_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_table_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_table_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "2444":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__("c532");
var normalizeHeaderName = __webpack_require__("c8af");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__("b50d");
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__("b50d");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("f28c")))

/***/ }),

/***/ "2d83":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__("387f");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "2e67":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "30b5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "387f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "3934":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "467f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__("2d83");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "4a7b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach([
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
    'socketPath'
  ], function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),

/***/ "5270":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var transformData = __webpack_require__("c401");
var isCancel = __webpack_require__("2e67");
var defaults = __webpack_require__("2444");
var isAbsoluteURL = __webpack_require__("d925");
var combineURLs = __webpack_require__("e683");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "65d5":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "7a77":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "7aac":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "7c96":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "8df4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__("7a77");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "b50d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var settle = __webpack_require__("467f");
var buildURL = __webpack_require__("30b5");
var parseHeaders = __webpack_require__("c345");
var isURLSameOrigin = __webpack_require__("3934");
var createError = __webpack_require__("2d83");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__("7aac");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "bc3a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("cee4");

/***/ }),

/***/ "bc51":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_upload_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1c62");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_upload_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_upload_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_upload_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "c0b2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_picture_space_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7c96");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_picture_space_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_picture_space_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_picture_space_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "c345":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "c401":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "c532":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("1d2b");
var isBuffer = __webpack_require__("c7ce");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "c7ce":
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ "c8af":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "cee4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");
var bind = __webpack_require__("1d2b");
var Axios = __webpack_require__("0a06");
var mergeConfig = __webpack_require__("4a7b");
var defaults = __webpack_require__("2444");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__("7a77");
axios.CancelToken = __webpack_require__("8df4");
axios.isCancel = __webpack_require__("2e67");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__("0df6");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "d925":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "e683":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "f28c":
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "f6b4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("c532");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"eb09c088-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/picture-space/src/picture-space.vue?vue&type=template&id=10fe5664&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"drag",rawName:"v-drag",value:(_vm.isWindow),expression:"isWindow"}],staticClass:"picture-space",class:{ 'window-mode' : _vm.isWindow },style:({'width':_vm.w, 'height':_vm.h})},[_c('el-container',{staticStyle:{"height":"100%"}},[_c('el-aside',{staticStyle:{"background-color":"#fff","border-right":"solid 1px #e6e6e6"},attrs:{"width":"200px"}},[_c('el-tree',{ref:"tree",staticStyle:{"margin-top":"10px"},attrs:{"lazy":"","load":_vm.getData,"node-key":"prefix","props":_vm.defaultProps,"highlight-current":"","default-expanded-keys":_vm.default_expanded_keys},on:{"node-click":_vm.handleNodeClick}})],1),_c('el-container',[_c('el-header',[_c('div',{staticClass:"control-bar"},[_c('ul',{staticClass:"picture-crumb"},_vm._l((_vm.currentNodes),function(node,index){return _c('li',{on:{"click":function($event){return _vm.handleNodeClick(node.data, node)}}},[_vm._v(_vm._s(node.data.name))])}),0),(_vm.percentage!==undefined)?_c('el-progress',{attrs:{"percentage":_vm.percentage,"color":_vm.customColors}}):_vm._e(),(_vm.currentNodes.length>0)?_c('div',{staticClass:"picture-control"},[_c('el-button-group',[(_vm.isUpload)?_c('el-button',{attrs:{"type":"primary","icon":"el-icon-upload2","title":"上传文件"},on:{"click":_vm.hanleUploadClick}}):_vm._e(),(_vm.isAddFolder)?_c('el-button',{attrs:{"type":"primary","icon":"el-icon-folder-add","title":"新建文件夹"},on:{"click":_vm.hanleAddFolder}}):_vm._e(),(_vm.isDelete)?_c('el-button',{attrs:{"type":"primary","icon":"el-icon-delete","title":"删除","disabled":_vm.isSelectedEmpty},on:{"click":_vm.handleDelete}}):_vm._e(),(_vm.close != undefined)?_c('el-button',{attrs:{"type":"primary","icon":"el-icon-close","title":"关闭"},on:{"click":_vm.close}}):_vm._e(),(_vm.selected!=undefined && !_vm.isInstantCallback)?_c('el-button',{attrs:{"type":"primary","icon":"el-icon-check","title":"选择完成","disabled":_vm.selecteds.objectsIndex.length==0},on:{"click":_vm.handleCallback}}):_vm._e()],1)],1):_vm._e()],1)]),_c('el-main',[(_vm.currentNodes.length > 0)?_c('picture-table',{attrs:{"list":_vm.currentNodes[_vm.currentNodes.length - 1],"selecteds":_vm.selecteds,"tableSize":_vm.tableSize},on:{"dblclickNode":_vm.dblclickNode,"getData":_vm.getData,"selected":_vm.handleNodeSelected}}):_vm._e()],1)],1)],1),(_vm.currentNodes.length>0)?_c('add-folder',{attrs:{"addFolder":_vm.addFolder,"prefix":_vm.currentNodes[_vm.currentNodes.length-1].data.prefix},on:{"addFolderEvent":_vm.addFolderEvent}}):_vm._e(),(_vm.currentNodes.length>0 && _vm.isUpload)?_c('upload',{attrs:{"upload":_vm.upload,"prefix":_vm.currentNodes[_vm.currentNodes.length-1].data.prefix,"uploadUrl":_vm.apiUrl},on:{"update:upload":function($event){_vm.upload=$event},"uploadEvent":_vm.uploadEvent}}):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./packages/picture-space/src/picture-space.vue?vue&type=template&id=10fe5664&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"eb09c088-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/picture-space/src/table.vue?vue&type=template&id=7b48b624&
var tablevue_type_template_id_7b48b624_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',{staticClass:"picture-table"},[_vm._l((_vm.prefixList),function(object,index){return _c('li',{key:'folder_'+index,staticClass:"folder",class:{ 'selected': _vm.selecteds.prefixsIndex.indexOf(index) > -1 },attrs:{"id":'fol_'+index},on:{"click":function($event){return _vm.select('prefixsIndex', index)}}},[_c('div',{staticClass:"icon-bar",style:({'width':_vm.tableSize+'px', 'height':_vm.tableSize+'px'})},[_c('i',{staticClass:"PSicon icon-icon_folder",style:({'line-height':_vm.tableSize+'px'}),on:{"dblclick":function($event){return _vm.openFolder(index)}}})]),_c('div',{staticClass:"object-name"},[_vm._v(_vm._s(object.name == "" ? "/" : object.name))])])}),_vm._l((_vm.objectList),function(object,index){return _c('li',{key:'object_'+index,staticClass:"file",class:{ 'selected': _vm.selecteds.objectsIndex.indexOf(index) > -1 },attrs:{"id":'obj_'+index},on:{"click":function($event){return _vm.select('objectsIndex', index)}}},[_c('div',{staticClass:"icon-bar",style:({'width':_vm.tableSize+'px', 'height':_vm.tableSize+'px'})},[(_vm.imgContentType.indexOf(object.contentType)>-1)?_c('div',{directives:[{name:"lazy",rawName:"v-lazy:background-image",value:(object.url),expression:"object.url",arg:"background-image"}],staticClass:"img-preview"}):_vm._e(),(_vm.imgContentType.indexOf(object.contentType)==-1)?_c('div',{staticClass:"img-preview"},[_vm._v(_vm._s(object.contentType))]):_vm._e()]),_c('div',{staticClass:"object-name"},[_vm._v(_vm._s(object.name))])])})],2)}
var tablevue_type_template_id_7b48b624_staticRenderFns = []


// CONCATENATED MODULE: ./packages/picture-space/src/table.vue?vue&type=template&id=7b48b624&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/picture-space/src/table.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var tablevue_type_script_lang_js_ = ({
    name: 'picture-table',
    data() {
        return {
            prefixList: [],
            objectList: [],
            imgContentType: ['image/bmp', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
        }
    },
    props: ['list', 'selecteds', 'tableSize'],
    mounted() {
        this.prefixList = this.list.data.prefixList;
        this.objectList = this.list.data.objectList;
    },
    methods: {
        openFolder(index) {
            let node = this.list.childNodes[index];
            if (node.loaded === true) {
                this.$emit("dblclickNode", node);
            } else {
                this.$emit("getData", node);
            }
        },
        select(c, i) {
            this.$emit("selected", c, i);
        }
    },
    watch: {
        list: function(a) {
        	this.prefixList = a.data.prefixList;
            this.objectList = a.data.objectList;
        }
    },
    uploaded() {
    	let _this = this;
        this.$nextTick(function() {
            console.log(_this.objectList)
        })
    }
});

// CONCATENATED MODULE: ./packages/picture-space/src/table.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_tablevue_type_script_lang_js_ = (tablevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/picture-space/src/table.vue?vue&type=style&index=0&lang=css&
var tablevue_type_style_index_0_lang_css_ = __webpack_require__("1e55");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./packages/picture-space/src/table.vue






/* normalize component */

var component = normalizeComponent(
  src_tablevue_type_script_lang_js_,
  tablevue_type_template_id_7b48b624_render,
  tablevue_type_template_id_7b48b624_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var table = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"eb09c088-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/picture-space/src/add-folder.vue?vue&type=template&id=2058e0ee&
var add_foldervue_type_template_id_2058e0ee_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-dialog',{attrs:{"title":"新建文件夹","visible":_vm.addFolder,"before-close":_vm.handleCancelAddFolder,"append-to-body":""},on:{"update:visible":function($event){_vm.addFolder=$event}}},[_c('el-form',{ref:"addFolderData",attrs:{"model":_vm.addFolderData,"rules":_vm.addFolderRules}},[_c('el-form-item',{attrs:{"label":"文件夹名称","label-width":_vm.formLabelWidth,"prop":"folderName"}},[_c('el-input',{staticStyle:{"width":"300px"},attrs:{"autocomplete":"off","placeholder":"文件夹名称"},model:{value:(_vm.addFolderData.folderName),callback:function ($$v) {_vm.$set(_vm.addFolderData, "folderName", $$v)},expression:"addFolderData.folderName"}})],1),_c('el-form-item',{attrs:{"label":"注","label-width":_vm.formLabelWidth}},[_c('ol',{staticStyle:{"line-height":"2","margin-top":"7px"}},[_c('li',[_vm._v("推荐使用中文、字母、数字和下划线")]),_c('li',[_vm._v("不允许使用的符号： /?\"^.\\:<>|")]),_c('li',[_vm._v("不允许使用表情符")]),_c('li',[_vm._v("总长度在1-100个字符以内")])])])],1),_c('div',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('el-button',{on:{"click":_vm.handleCancelAddFolder}},[_vm._v("取 消")]),_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.submitForm('addFolderData')}}},[_vm._v("确 定")])],1)],1)}
var add_foldervue_type_template_id_2058e0ee_staticRenderFns = []


// CONCATENATED MODULE: ./packages/picture-space/src/add-folder.vue?vue&type=template&id=2058e0ee&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/picture-space/src/add-folder.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var add_foldervue_type_script_lang_js_ = ({
    name: "add-folder",
    data() {
        return {
            addFolderData: {
                folderName: ''
            },
            formLabelWidth: '120px',
            addFolderRules: {
                folderName: [
                    { required: true, message: '请输入文件夹名称', trigger: 'blur' },
                    { min: 1, max: 100, message: '长度在 1-100 个字符', trigger: 'blur' },
                    { pattern: /^[^\\.^/:\*\?""<>|]+$/, message: '有非法字符' }
                ]
            }
        }
    },
    props: {
        addFolder: {
            type: Boolean,
            default: false
        },
        prefix: {
        	type: String,
        	default: ''
        }
    },
    methods: {
        handleAddFolder() {
        	const prefix = this.prefix == "/" ? "" : this.prefix;
            const formData = {
            	'name' : this.addFolderData.folderName,
            	'prefix' : prefix + this.addFolderData.folderName + "/"
            }
            
            this.$emit('addFolderEvent', 'addFolder', formData);
        },
        handleCancelAddFolder(){
        	this.$emit('addFolderEvent', 'cancelAddFolder');
        },
        submitForm(formName){
        	let _this = this;
        	this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.handleAddFolder();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
});

// CONCATENATED MODULE: ./packages/picture-space/src/add-folder.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_add_foldervue_type_script_lang_js_ = (add_foldervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/picture-space/src/add-folder.vue





/* normalize component */

var add_folder_component = normalizeComponent(
  src_add_foldervue_type_script_lang_js_,
  add_foldervue_type_template_id_2058e0ee_render,
  add_foldervue_type_template_id_2058e0ee_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var add_folder = (add_folder_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"eb09c088-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/picture-space/src/upload.vue?vue&type=template&id=3f263d44&
var uploadvue_type_template_id_3f263d44_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-dialog',{staticClass:"picture-upload",attrs:{"title":"上传文件","visible":_vm.upload,"before-close":_vm.handleCancelUpload,"append-to-body":""},on:{"update:visible":function($event){_vm.upload=$event}}},[_c('el-upload',{ref:"upload",attrs:{"action":_vm.uploadUrl,"list-type":"picture-card","auto-upload":false,"multiple":"","on-success":_vm.handleUploadSuccess,"data":_vm.uploadData,"on-change":_vm.handleChange,"on-error":_vm.handleUploadError},scopedSlots:_vm._u([{key:"file",fn:function(ref){
var file = ref.file;
return _c('div',{},[(file.percentage>0&&file.percentage<100)?_c('span',{staticClass:"picture-space-uploading"},[_c('el-progress',{attrs:{"type":"circle","percentage":parseInt(file.percentage),"width":80,"color":_vm.customColors,"stroke-width":3}})],1):_vm._e(),(file.percentage==100)?_c('i',{staticClass:"el-icon-check uploadSuccess"}):_vm._e(),(_vm.imgContentType.indexOf(file.raw.type)>-1)?_c('img',{staticClass:"el-upload-list__item-thumbnail",attrs:{"src":file.url,"alt":""}}):_vm._e(),(_vm.imgContentType.indexOf(file.raw.type)==-1)?_c('div',{staticClass:"noImg"},[_vm._v(_vm._s(file.raw.type))]):_vm._e(),_c('span',{staticClass:"el-upload-list__item-actions"},[_c('span',{staticClass:"el-upload-list__item-preview",on:{"click":function($event){return _vm.handlePictureCardPreview(file)}}},[_c('i',{staticClass:"el-icon-zoom-in"})]),(!_vm.disabled)?_c('span',{staticClass:"el-upload-list__item-delete",on:{"click":function($event){return _vm.handleRemove(file)}}},[_c('i',{staticClass:"el-icon-delete"})]):_vm._e()])])}}])},[_c('i',{staticClass:"el-icon-plus",attrs:{"slot":"default"},slot:"default"})]),_c('span',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[(_vm.waitUpload>0&&_vm.waitUpload<=_vm.max)?_c('i',[_vm._v("等待上传的文件总数："+_vm._s(_vm.waitUpload))]):_vm._e(),(_vm.waitUpload>_vm.max)?_c('i',{staticStyle:{"color":"red"}},[_vm._v("等待上传的文件总数："+_vm._s(_vm.waitUpload)+"，已超出最大值"+_vm._s(_vm.max))]):_vm._e(),_c('el-button',{attrs:{"type":"primary","disabled":_vm.waitUpload==0||_vm.waitUpload>_vm.max},on:{"click":_vm.submitUpload}},[_vm._v("上传文件")])],1),_c('el-dialog',{attrs:{"visible":_vm.dialogVisible,"append-to-body":""},on:{"update:visible":function($event){_vm.dialogVisible=$event}}},[_c('img',{attrs:{"width":"100%","src":_vm.dialogImageUrl,"alt":""}})])],1)}
var uploadvue_type_template_id_3f263d44_staticRenderFns = []


// CONCATENATED MODULE: ./packages/picture-space/src/upload.vue?vue&type=template&id=3f263d44&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/picture-space/src/upload.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var uploadvue_type_script_lang_js_ = ({
    name: 'upload',
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            uploadData: {},
            uploadIndex: 0,
            customColors: [
                { color: '#67c23a', percentage: 100 }
            ],
            imgContentType: ['image/bmp', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
            waitUpload: 0,
            max: 10
        }
    },
    props: {
        upload: {
            type: Boolean,
            default: false
        },
        uploadUrl: {
            type: String
        },
        prefix: {
            type: String
        }
    },
    mounted() {
        this.uploadData = { "prefix": this.prefix };
    },
    methods: {
        handleCancelUpload() {
            this.$emit('update:upload', false)
        },
        handleRemove(file) {
            let objs = this.$refs.upload.uploadFiles;
            for (let i = 0; i < objs.length; i++) {
                if (file.uid == objs[i].uid) {
                    objs.splice(i, 1);
                }
            }
            this.handleChange(file, objs);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleUploadSuccess(a) {

            this.$emit('uploadEvent', a);
            this.uploadIndex++;
        },
        handleChange(a, fileList) {
            this.waitUpload = 0;
            for (let i = 0; i < fileList.length; i++) {
                if (fileList[i].percentage == 0) {
                    this.waitUpload += 1;
                }
            }
        },
        handleUploadError(err, file) {
            this.$message({
                showClose: true,
                message: '[' + file.name + ']上传错误！',
                type: 'error'
            });
        },
        on_exceed() {
            this.$message({
                showClose: true,
                message: '最多同时可以上传[' + this.limit + ']个文件！',
                type: 'error'
            });
        }
    }
});

// CONCATENATED MODULE: ./packages/picture-space/src/upload.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_uploadvue_type_script_lang_js_ = (uploadvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/picture-space/src/upload.vue?vue&type=style&index=0&lang=css&
var uploadvue_type_style_index_0_lang_css_ = __webpack_require__("bc51");

// CONCATENATED MODULE: ./packages/picture-space/src/upload.vue






/* normalize component */

var upload_component = normalizeComponent(
  src_uploadvue_type_script_lang_js_,
  uploadvue_type_template_id_3f263d44_render,
  uploadvue_type_template_id_3f263d44_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var upload = (upload_component.exports);
// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__("bc3a");
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);

// CONCATENATED MODULE: ./packages/picture-space/packages/mime.js
/* harmony default export */ var mime = ({
    ".323": "text/h323",
    ".3gp": "video/3gpp",
    ".aab": "application/x-authoware-bin",
    ".aam": "application/x-authoware-map",
    ".aas": "application/x-authoware-seg",
    ".acx": "application/internet-property-stream",
    ".ai": "application/postscript",
    ".aif": "audio/x-aiff",
    ".aifc": "audio/x-aiff",
    ".aiff": "audio/x-aiff",
    ".als": "audio/X-Alpha5",
    ".amc": "application/x-mpeg",
    ".ani": "application/octet-stream",
    ".apk": "application/vnd.android.package-archive",
    ".asc": "text/plain",
    ".asd": "application/astound",
    ".asf": "video/x-ms-asf",
    ".asn": "application/astound",
    ".asp": "application/x-asap",
    ".asr": "video/x-ms-asf",
    ".asx": "video/x-ms-asf",
    ".au": "audio/basic",
    ".avb": "application/octet-stream",
    ".avi": "video/x-msvideo",
    ".awb": "audio/amr-wb",
    ".axs": "application/olescript",
    ".bas": "text/plain",
    ".bcpio": "application/x-bcpio",
    ".bin ": "application/octet-stream",
    ".bld": "application/bld",
    ".bld2": "application/bld2",
    ".bmp": "image/bmp",
    ".bpk": "application/octet-stream",
    ".bz2": "application/x-bzip2",
    ".c": "text/plain",
    ".cal": "image/x-cals",
    ".cat": "application/vnd.ms-pkiseccat",
    ".ccn": "application/x-cnc",
    ".cco": "application/x-cocoa",
    ".cdf": "application/x-cdf",
    ".cer": "application/x-x509-ca-cert",
    ".cgi": "magnus-internal/cgi",
    ".chat": "application/x-chat",
    ".class": "application/octet-stream",
    ".clp": "application/x-msclip",
    ".cmx": "image/x-cmx",
    ".co": "application/x-cult3d-object",
    ".cod": "image/cis-cod",
    ".conf": "text/plain",
    ".cpio": "application/x-cpio",
    ".cpp": "text/plain",
    ".cpt": "application/mac-compactpro",
    ".crd": "application/x-mscardfile",
    ".crl": "application/pkix-crl",
    ".crt": "application/x-x509-ca-cert",
    ".csh": "application/x-csh",
    ".csm": "chemical/x-csml",
    ".csml": "chemical/x-csml",
    ".css": "text/css",
    ".cur": "application/octet-stream",
    ".dcm": "x-lml/x-evm",
    ".dcr": "application/x-director",
    ".dcx": "image/x-dcx",
    ".der": "application/x-x509-ca-cert",
    ".dhtml": "text/html",
    ".dir": "application/x-director",
    ".dll": "application/x-msdownload",
    ".dmg": "application/octet-stream",
    ".dms": "application/octet-stream",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".dot": "application/msword",
    ".dvi": "application/x-dvi",
    ".dwf": "drawing/x-dwf",
    ".dwg": "application/x-autocad",
    ".dxf": "application/x-autocad",
    ".dxr": "application/x-director",
    ".ebk": "application/x-expandedbook",
    ".emb": "chemical/x-embl-dl-nucleotide",
    ".embl": "chemical/x-embl-dl-nucleotide",
    ".eps": "application/postscript",
    ".epub": "application/epub+zip",
    ".eri": "image/x-eri",
    ".es": "audio/echospeech",
    ".esl": "audio/echospeech",
    ".etc": "application/x-earthtime",
    ".etx": "text/x-setext",
    ".evm": "x-lml/x-evm",
    ".evy": "application/envoy",
    ".exe": "application/octet-stream",
    ".fh4": "image/x-freehand",
    ".fh5": "image/x-freehand",
    ".fhc": "image/x-freehand",
    ".fif": "application/fractals",
    ".flr": "x-world/x-vrml",
    ".flv": "flv-application/octet-stream",
    ".fm": "application/x-maker",
    ".fpx": "image/x-fpx",
    ".fvi": "video/isivideo",
    ".gau": "chemical/x-gaussian-input",
    ".gca": "application/x-gca-compressed",
    ".gdb": "x-lml/x-gdb",
    ".gif": "image/gif",
    ".gps": "application/x-gps",
    ".gtar": "application/x-gtar",
    ".gz": "application/x-gzip",
    ".h": "text/plain",
    ".hdf": "application/x-hdf",
    ".hdm": "text/x-hdml",
    ".hdml": "text/x-hdml",
    ".hlp": "application/winhlp",
    ".hqx": "application/mac-binhex40",
    ".hta": "application/hta",
    ".htc": "text/x-component",
    ".htm": "text/html",
    ".html": "text/html",
    ".hts": "text/html",
    ".htt": "text/webviewhtml",
    ".ice": "x-conference/x-cooltalk",
    ".ico": "image/x-icon",
    ".ief": "image/ief",
    ".ifm": "image/gif",
    ".ifs": "image/ifs",
    ".iii": "application/x-iphone",
    ".imy": "audio/melody",
    ".ins": "application/x-internet-signup",
    ".ips": "application/x-ipscript",
    ".ipx": "application/x-ipix",
    ".isp": "application/x-internet-signup",
    ".it": "audio/x-mod",
    ".itz": "audio/x-mod",
    ".ivr": "i-world/i-vrml",
    ".j2k": "image/j2k",
    ".jad": "text/vnd.sun.j2me.app-descriptor",
    ".jam": "application/x-jam",
    ".jar": "application/java-archive",
    ".java": "text/plain",
    ".jfif": "image/pipeg",
    ".jnlp": "application/x-java-jnlp-file",
    ".jpe": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".jpz": "image/jpeg",
    ".js": "application/x-javascript",
    ".jwc": "application/jwc",
    ".kjx": "application/x-kjx",
    ".lak": "x-lml/x-lak",
    ".latex": "application/x-latex",
    ".lcc": "application/fastman",
    ".lcl": "application/x-digitalloca",
    ".lcr": "application/x-digitalloca",
    ".lgh": "application/lgh",
    ".lha": "application/octet-stream",
    ".lml": "x-lml/x-lml",
    ".lmlpack": "x-lml/x-lmlpack",
    ".log": "text/plain",
    ".lsf": "video/x-la-asf",
    ".lsx": "video/x-la-asf",
    ".lzh": "application/octet-stream",
    ".m13": "application/x-msmediaview",
    ".m14": "application/x-msmediaview",
    ".m15": "audio/x-mod",
    ".m3u": "audio/x-mpegurl",
    ".m3url": "audio/x-mpegurl",
    ".m4a": "audio/mp4a-latm",
    ".m4b": "audio/mp4a-latm",
    ".m4p": "audio/mp4a-latm",
    ".m4u": "video/vnd.mpegurl",
    ".m4v": "video/x-m4v",
    ".ma1": "audio/ma1",
    ".ma2": "audio/ma2",
    ".ma3": "audio/ma3",
    ".ma5": "audio/ma5",
    ".man": "application/x-troff-man",
    ".map": "magnus-internal/imagemap",
    ".mbd": "application/mbedlet",
    ".mct": "application/x-mascot",
    ".mdb": "application/x-msaccess",
    ".mdz": "audio/x-mod",
    ".me": "application/x-troff-me",
    ".mel": "text/x-vmel",
    ".mht": "message/rfc822",
    ".mhtml": "message/rfc822",
    ".mi": "application/x-mif",
    ".mid": "audio/mid",
    ".midi": "audio/midi",
    ".mif": "application/x-mif",
    ".mil": "image/x-cals",
    ".mio": "audio/x-mio",
    ".mmf": "application/x-skt-lbs",
    ".mng": "video/x-mng",
    ".mny": "application/x-msmoney",
    ".moc": "application/x-mocha",
    ".mocha": "application/x-mocha",
    ".mod": "audio/x-mod",
    ".mof": "application/x-yumekara",
    ".mol": "chemical/x-mdl-molfile",
    ".mop": "chemical/x-mopac-input",
    ".mov": "video/quicktime",
    ".movie": "video/x-sgi-movie",
    ".mp2": "video/mpeg",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".mpa": "video/mpeg",
    ".mpc": "application/vnd.mpohun.certificate",
    ".mpe": "video/mpeg",
    ".mpeg": "video/mpeg",
    ".mpg": "video/mpeg",
    ".mpg4": "video/mp4",
    ".mpga": "audio/mpeg",
    ".mpn": "application/vnd.mophun.application",
    ".mpp": "application/vnd.ms-project",
    ".mps": "application/x-mapserver",
    ".mpv2": "video/mpeg",
    ".mrl": "text/x-mrml",
    ".mrm": "application/x-mrm",
    ".ms": "application/x-troff-ms",
    ".msg": "application/vnd.ms-outlook",
    ".mts": "application/metastream",
    ".mtx": "application/metastream",
    ".mtz": "application/metastream",
    ".mvb": "application/x-msmediaview",
    ".mzv": "application/metastream",
    ".nar": "application/zip",
    ".nbmp": "image/nbmp",
    ".nc": "application/x-netcdf",
    ".ndb": "x-lml/x-ndb",
    ".ndwn": "application/ndwn",
    ".nif": "application/x-nif",
    ".nmz": "application/x-scream",
    ".nokia-op-logo": "image/vnd.nok-oplogo-color",
    ".npx": "application/x-netfpx",
    ".nsnd": "audio/nsnd",
    ".nva": "application/x-neva1",
    ".nws": "message/rfc822",
    ".oda": "application/oda",
    ".ogg": "audio/ogg",
    ".oom": "application/x-AtlasMate-Plugin",
    ".p10": "application/pkcs10",
    ".p12": "application/x-pkcs12",
    ".p7b": "application/x-pkcs7-certificates",
    ".p7c": "application/x-pkcs7-mime",
    ".p7m": "application/x-pkcs7-mime",
    ".p7r": "application/x-pkcs7-certreqresp",
    ".p7s": "application/x-pkcs7-signature",
    ".pac": "audio/x-pac",
    ".pae": "audio/x-epac",
    ".pan": "application/x-pan",
    ".pbm": "image/x-portable-bitmap",
    ".pcx": "image/x-pcx",
    ".pda": "image/x-pda",
    ".pdb": "chemical/x-pdb",
    ".pdf": "application/pdf",
    ".pfr": "application/font-tdpfr",
    ".pfx": "application/x-pkcs12",
    ".pgm": "image/x-portable-graymap",
    ".pict": "image/x-pict",
    ".pko": "application/ynd.ms-pkipko",
    ".pm": "application/x-perl",
    ".pma": "application/x-perfmon",
    ".pmc": "application/x-perfmon",
    ".pmd": "application/x-pmd",
    ".pml": "application/x-perfmon",
    ".pmr": "application/x-perfmon",
    ".pmw": "application/x-perfmon",
    ".png": "image/png",
    ".pnm": "image/x-portable-anymap",
    ".pnz": "image/png",
    ".pot,": "application/vnd.ms-powerpoint",
    ".ppm": "image/x-portable-pixmap",
    ".pps": "application/vnd.ms-powerpoint",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".pqf": "application/x-cprplayer",
    ".pqi": "application/cprplayer",
    ".prc": "application/x-prc",
    ".prf": "application/pics-rules",
    ".prop": "text/plain",
    ".proxy": "application/x-ns-proxy-autoconfig",
    ".ps": "application/postscript",
    ".ptlk": "application/listenup",
    ".pub": "application/x-mspublisher",
    ".pvx": "video/x-pv-pvx",
    ".qcp": "audio/vnd.qcelp",
    ".qt": "video/quicktime",
    ".qti": "image/x-quicktime",
    ".qtif": "image/x-quicktime",
    ".r3t": "text/vnd.rn-realtext3d",
    ".ra": "audio/x-pn-realaudio",
    ".ram": "audio/x-pn-realaudio",
    ".rar": "application/octet-stream",
    ".ras": "image/x-cmu-raster",
    ".rc": "text/plain",
    ".rdf": "application/rdf+xml",
    ".rf": "image/vnd.rn-realflash",
    ".rgb": "image/x-rgb",
    ".rlf": "application/x-richlink",
    ".rm": "audio/x-pn-realaudio",
    ".rmf": "audio/x-rmf",
    ".rmi": "audio/mid",
    ".rmm": "audio/x-pn-realaudio",
    ".rmvb": "audio/x-pn-realaudio",
    ".rnx": "application/vnd.rn-realplayer",
    ".roff": "application/x-troff",
    ".rp": "image/vnd.rn-realpix",
    ".rpm": "audio/x-pn-realaudio-plugin",
    ".rt": "text/vnd.rn-realtext",
    ".rte": "x-lml/x-gps",
    ".rtf": "application/rtf",
    ".rtg": "application/metastream",
    ".rtx": "text/richtext",
    ".rv": "video/vnd.rn-realvideo",
    ".rwc": "application/x-rogerwilco",
    ".s3m": "audio/x-mod",
    ".s3z": "audio/x-mod",
    ".sca": "application/x-supercard",
    ".scd": "application/x-msschedule",
    ".sct": "text/scriptlet",
    ".sdf": "application/e-score",
    ".sea": "application/x-stuffit",
    ".setpay": "application/set-payment-initiation",
    ".setreg": "application/set-registration-initiation",
    ".sgm": "text/x-sgml",
    ".sgml": "text/x-sgml",
    ".sh": "application/x-sh",
    ".shar": "application/x-shar",
    ".shtml": "magnus-internal/parsed-html",
    ".shw": "application/presentations",
    ".si6": "image/si6",
    ".si7": "image/vnd.stiwap.sis",
    ".si9": "image/vnd.lgtwap.sis",
    ".sis": "application/vnd.symbian.install",
    ".sit": "application/x-stuffit",
    ".skd": "application/x-Koan",
    ".skm": "application/x-Koan",
    ".skp": "application/x-Koan",
    ".skt": "application/x-Koan",
    ".slc": "application/x-salsa",
    ".smd": "audio/x-smd",
    ".smi": "application/smil",
    ".smil": "application/smil",
    ".smp": "application/studiom",
    ".smz": "audio/x-smd",
    ".snd": "audio/basic",
    ".spc": "application/x-pkcs7-certificates",
    ".spl": "application/futuresplash",
    ".spr": "application/x-sprite",
    ".sprite": "application/x-sprite",
    ".sdp": "application/sdp",
    ".spt": "application/x-spt",
    ".src": "application/x-wais-source",
    ".sst": "application/vnd.ms-pkicertstore",
    ".stk": "application/hyperstudio",
    ".stl": "application/vnd.ms-pkistl",
    ".stm": "text/html",
    ".svg": "image/svg+xml",
    ".sv4cpio": "application/x-sv4cpio",
    ".sv4crc": "application/x-sv4crc",
    ".svf": "image/vnd",
    ".svg": "image/svg+xml",
    ".svh": "image/svh",
    ".svr": "x-world/x-svr",
    ".swf": "application/x-shockwave-flash",
    ".swfl": "application/x-shockwave-flash",
    ".t": "application/x-troff",
    ".tad": "application/octet-stream",
    ".talk": "text/x-speech",
    ".tar": "application/x-tar",
    ".taz": "application/x-tar",
    ".tbp": "application/x-timbuktu",
    ".tbt": "application/x-timbuktu",
    ".tcl": "application/x-tcl",
    ".tex": "application/x-tex",
    ".texi": "application/x-texinfo",
    ".texinfo": "application/x-texinfo",
    ".tgz": "application/x-compressed",
    ".thm": "application/vnd.eri.thm",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".tki": "application/x-tkined",
    ".tkined": "application/x-tkined",
    ".toc": "application/toc",
    ".toy": "image/toy",
    ".tr": "application/x-troff",
    ".trk": "x-lml/x-gps",
    ".trm": "application/x-msterminal",
    ".tsi": "audio/tsplayer",
    ".tsp": "application/dsptype",
    ".tsv": "text/tab-separated-values",
    ".ttf": "application/octet-stream",
    ".ttz": "application/t-time",
    ".txt": "text/plain",
    ".uls": "text/iuls",
    ".ult": "audio/x-mod",
    ".ustar": "application/x-ustar",
    ".uu": "application/x-uuencode",
    ".uue": "application/x-uuencode",
    ".vcd": "application/x-cdlink",
    ".vcf": "text/x-vcard",
    ".vdo": "video/vdo",
    ".vib": "audio/vib",
    ".viv": "video/vivo",
    ".vivo": "video/vivo",
    ".vmd": "application/vocaltec-media-desc",
    ".vmf": "application/vocaltec-media-file",
    ".vmi": "application/x-dreamcast-vms-info",
    ".vms": "application/x-dreamcast-vms",
    ".vox": "audio/voxware",
    ".vqe": "audio/x-twinvq-plugin",
    ".vqf": "audio/x-twinvq",
    ".vql": "audio/x-twinvq",
    ".vre": "x-world/x-vream",
    ".vrml": "x-world/x-vrml",
    ".vrt": "x-world/x-vrt",
    ".vrw": "x-world/x-vream",
    ".vts": "workbook/formulaone",
    ".wav": "audio/x-wav",
    ".wax": "audio/x-ms-wax",
    ".wbmp": "image/vnd.wap.wbmp",
    ".wcm": "application/vnd.ms-works",
    ".wdb": "application/vnd.ms-works",
    ".web": "application/vnd.xara",
    ".wi": "image/wavelet",
    ".wis": "application/x-InstallShield",
    ".wks": "application/vnd.ms-works",
    ".wm": "video/x-ms-wm",
    ".wma": "audio/x-ms-wma",
    ".wmd": "application/x-ms-wmd",
    ".wmf": "application/x-msmetafile",
    ".wml": "text/vnd.wap.wml",
    ".wmlc": "application/vnd.wap.wmlc",
    ".wmls": "text/vnd.wap.wmlscript",
    ".wmlsc": "application/vnd.wap.wmlscriptc",
    ".wmlscript": "text/vnd.wap.wmlscript",
    ".wmv": "audio/x-ms-wmv",
    ".wmx": "video/x-ms-wmx",
    ".wmz": "application/x-ms-wmz",
    ".wpng": "image/x-up-wpng",
    ".wps": "application/vnd.ms-works",
    ".wpt": "x-lml/x-gps",
    ".wri": "application/x-mswrite",
    ".wrl": "x-world/x-vrml",
    ".wrz": "x-world/x-vrml",
    ".ws": "text/vnd.wap.wmlscript",
    ".wsc": "application/vnd.wap.wmlscriptc",
    ".wv": "video/wavelet",
    ".wvx": "video/x-ms-wvx",
    ".wxl": "application/x-wxl",
    ".x-gzip": "application/x-gzip",
    ".xaf": "x-world/x-vrml",
    ".xar": "application/vnd.xara",
    ".xbm": "image/x-xbitmap",
    ".xdm": "application/x-xdma",
    ".xdma": "application/x-xdma",
    ".xdw": "application/vnd.fujixerox.docuworks",
    ".xht": "application/xhtml+xml",
    ".xhtm": "application/xhtml+xml",
    ".xhtml": "application/xhtml+xml",
    ".xla": "application/vnd.ms-excel",
    ".xlc": "application/vnd.ms-excel",
    ".xll": "application/x-excel",
    ".xlm": "application/vnd.ms-excel",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xlt": "application/vnd.ms-excel",
    ".xlw": "application/vnd.ms-excel",
    ".xm": "audio/x-mod",
    ".xml": "text/plain",
    ".xml": "application/xml",
    ".xmz": "audio/x-mod",
    ".xof": "x-world/x-vrml",
    ".xpi": "application/x-xpinstall",
    ".xpm": "image/x-xpixmap",
    ".xsit": "text/xml",
    ".xsl": "text/xml",
    ".xul": "text/xul",
    ".xwd": "image/x-xwindowdump",
    ".xyz": "chemical/x-pdb",
    ".yz1": "application/x-yz1",
    ".z": "application/x-compress",
    ".zac": "application/x-zaurus-zac",
    ".zip": "application/zip",
    ".json": "application/json"
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/picture-space/src/picture-space.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ var picture_spacevue_type_script_lang_js_ = ({
    name: 'picture-space',
    components: {
        pictureTable: table,
        addFolder: add_folder,
        upload: upload
    },
    data() {
        return {
            defaultProps: {
                children: 'prefixList',
                label: 'name',
            },
            currentNodes: [],
            selecteds: {
                objectsIndex: [],
                prefixsIndex: []
            },
            addFolder: false,
            upload: false,
            apiUrl: this.$pictureSpanceOption.apiUrl,
            headers: this.$pictureSpanceOption.headers,
            prefixName: this.$pictureSpanceOption.prefix,
            w: "100%",
            h: "100%",
            isSelectedEmpty: true,
            tableSize: 160,
            percentage: undefined,
            customColors: [
                { color: '#67c23a', percentage: 80 },
                { color: '#e6a23c', percentage: 90 },
                { color: '#f56c6c', percentage: 100 }
            ],
            default_expanded_keys: []
        }
    },
    props: {
        // 选择后回调
        selected: {
            type: Function
        },
        // 关闭按钮点击回调
        close: {
            type: Function
        },
        // 是否允许多选
        multiple: {
            type: Boolean,
            default: true
        },
        // 是否瞬间瞬间回调
        isInstantCallback: {
            type: Boolean,
            default: false
        },
        // 是否允许上传
        isUpload: {
            type: Boolean,
            default: true
        },
        // 是否允许新建文件夹
        isAddFolder: {
            type: Boolean,
            default: true
        },
        // 是否允许删除
        isDelete: {
            type: Boolean,
            default: true
        },
        // 窗口模式
        isWindow: {
            type: Boolean,
            default: false
        },
        iconType: {
            type: String,
            default: 'normal'
        }
    },
    mounted() {
        if (this.isWindow) {
            this.w = document.documentElement.clientWidth * 70 / 100 + 'px';
            this.h = document.documentElement.clientHeight * 70 / 100 + 'px';
            window.onresize = () => {
                this.w = document.documentElement.clientWidth * 70 / 100 + 'px';
                this.h = document.documentElement.clientHeight * 70 / 100 + 'px';
            }
        };
        switch (this.iconType) {
            case 'big':
                this.tableSize = 180;
                break;
            case 'small':
                this.tableSize = 140;
                break;
            default:
                this.tableSize = 160;
                break;
        };
    },
    methods: {
        // 节点被点击
        handleNodeClick(data, node) {
            if (!node.loaded) {
                return false;
            }

            let nodes = new Array(node);
            this.getParentNodes(node, nodes);
            // 清空之前所有选择
            this.selecteds.objectsIndex = [];
            this.selecteds.prefixsIndex = [];
            this.isSelectedEmpty = true;
            // 指定当前选择节点
            this.currentNodes = nodes;
            // 高亮当前选择节点
            this.$refs.tree.store.nodesMap[node.key].expanded = true;
            this.$refs.tree.setCurrentKey(node.key);
        },
        // 查找节点的父节点直到最顶端
        getParentNodes(node, nodes) {
            if (node.parent) {
                if (node.parent.level > 0) {
                    nodes.unshift(node.parent);
                }

                this.getParentNodes(node.parent, nodes);
            }
        },
        // 处理objectList数据
        handleObjectList(objectList) {
            for (let i = 0; i < objectList.length; i++) {
                if (!objectList[i].contentType) {
                    let t = objectList[i].key.split(".");
                    let tp = t[t.length - 1];
                    objectList[i].contentType = mime['.' + tp];
                }
            }
            return objectList;
        },
        // 加载数据
        getData(node, resolve) {
            let url = node.level == 0 ? "" : '?' + this.prefixName + '=' + node.data.prefix;
            let _this = this;
            node.loading = true;
            axios_default.a.get(this.apiUrl + url).then(function(response) {
                    let r = response.data;
                    r.objectList = _this.handleObjectList(r.objectList);

                    let newChildNodes;
                    if (node.level == 0) {
                        node.data = r;
                        newChildNodes = [r];
                        _this.default_expanded_keys.push(r.prefix);
                    } else {
                        node.data.prefixList = r.prefixList
                        node.data.objectList = r.objectList;
                        newChildNodes = r.prefixList;
                    }

                    if (resolve) resolve(newChildNodes);
                    else {
                        node.loaded = true;
                        node.loading = false;
                        node.childNodes = [];
                        node.data.objectList = r.objectList;

                        node.doCreateChildren(newChildNodes);
                    }

                    if (r.percentage) {
                        let percentage = parseInt(r.percentage);
                        if (percentage >= 0 && percentage <= 100) {
                            this.percentage = percentage;
                        }
                    }

                    _this.handleNodeClick(r, node);
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        // 处理table中的文件夹双击事件
        dblclickNode(node) {
            this.handleNodeClick(node.data, node);
        },
        // 处理选择table的文件及文件夹被选中事件
        handleNodeSelected(c, i) {
            let index = this.selecteds[c].indexOf(i);

            if (index > -1) {
                this.selecteds[c].splice(index, 1);
            } else {
                if (!this.multiple) {
                    this.selecteds.objectsIndex = [];
                    this.selecteds.prefixsIndex = [];
                }
                this.selecteds[c].push(i);
            }

            if (this.isInstantCallback) {
                this.handleCallback();
            }

            if (this.selecteds.objectsIndex.length == 0 && this.selecteds.prefixsIndex.length == 0) {
                this.isSelectedEmpty = true;
            } else {
                this.isSelectedEmpty = false;
            }
        },
        // 右键点击未实现
        rightShow() {
            alert(1)
        },
        // 上传按钮被点击
        hanleUploadClick() {
            this.upload = true;
        },
        // 上传组件事件回调
        uploadEvent(op) {

            const node = this.currentNodes[this.currentNodes.length - 1];
            const data = node.data;
            const newobj = this.handleObjectList([op]);

            data.objectList.push(newobj[0]);
        },
        // 新建文件夹按钮被点击
        hanleAddFolder() {
            this.addFolder = true;
        },
        // 新建文件夹组件事件回调
        addFolderEvent(ev, op) {
            let _this = this;
            switch (ev) {
                case 'cancelAddFolder':
                    _this.addFolder = false;
                    break;

                case 'addFolder':
                    {
                        axios_default.a.post(_this.apiUrl, { prefix: op.prefix }).then(function(response) {
                            const node = _this.currentNodes[_this.currentNodes.length - 1];
                            const data = node.data;
                            const newChild = { name: op.name, prefix: op.prefix };

                            data.prefixList.push(newChild);
                            node.doCreateChildren([newChild]);

                            _this.addFolder = false;
                        });
                        break;
                    }
            }
        },
        // 处理回调
        handleCallback() {
            let d = this.getSelectedData();
            if (d.objectList.length > 0) {
                if (this.isInstantCallback) {
                    this.selected(d.objectList[d.objectList.length - 1]);
                } else {
                    this.selected(d.objectList);
                }
            }
        },
        // 处理删除
        handleDelete() {
            let objs = this.getSelectedData();
            if (objs.prefixList.length == 0 && objs.objectList.length == 0) {
                return false;
            }
            const _this = this;

            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let d = {
                    key: [],
                    prefix: []
                }
                for (let i = 0; i < objs.objectList.length; i++) {
                    d.key.push(objs.objectList[i].key);
                }
                for (let i = 0; i < objs.prefixList.length; i++) {
                    d.prefix.push(objs.prefixList[i].prefix);
                }
                axios_default.a.delete(this.apiUrl, { data: d }).then(function(response) {
                    for (let i = 0; i < objs.prefixList.length; i++) {
                        _this.$refs.tree.remove(objs.prefixList[i]);
                    }

                    let nodeData = _this.currentNodes[_this.currentNodes.length - 1].data.objectList;
                    for (let i = 0; i < response.data.key.length; i++) {
                        for (let a = 0; a < nodeData.length; a++) {
                            if (nodeData[a].key == response.data.key[i]) {
                                nodeData.splice(a, 1);
                            }
                        }
                    }
                    // 清空之前所有选择
                    _this.selecteds.objectsIndex = [];
                    _this.selecteds.prefixsIndex = [];

                    _this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        getSelectedData() {
            let d = {
                objectList: [],
                prefixList: []
            };
            let node = this.currentNodes[this.currentNodes.length - 1];
            for (let i = 0; i < this.selecteds.objectsIndex.length; i++) {
                d.objectList[i] = node.data.objectList[this.selecteds.objectsIndex[i]];
            }
            for (let i = 0; i < this.selecteds.prefixsIndex.length; i++) {
                d.prefixList[i] = node.data.prefixList[this.selecteds.prefixsIndex[i]];
            }
            return d;
        }
    }
});

// CONCATENATED MODULE: ./packages/picture-space/src/picture-space.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_picture_spacevue_type_script_lang_js_ = (picture_spacevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/picture-space/src/picture-space.vue?vue&type=style&index=0&lang=css&
var picture_spacevue_type_style_index_0_lang_css_ = __webpack_require__("c0b2");

// CONCATENATED MODULE: ./packages/picture-space/src/picture-space.vue






/* normalize component */

var picture_space_component = normalizeComponent(
  src_picture_spacevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var picture_space = (picture_space_component.exports);
// CONCATENATED MODULE: ./packages/picture-space/index.js
/*
 * @Author: xinkong2000
 * @Date:   2019-07-03 09:27:05
 * @Last Modified by:   xinkong2000
 * @Last Modified time: 2019-07-15 16:42:20
 */


picture_space.install = (Vue, option) => {

    Vue.prototype.$pictureSpanceOption = Object.assign({
		"apiUrl" : "",
		"headers" : "",
		"prefix" : "prefix"
	}, option);

    /**
     * [全局拖拽指令]
     * ---------------------------------------
     * 调用方法：标签上v-drag
     */
    Vue.directive('drag', {
        bind: function(el) {
            el.onmousedown = (e) => {
                let elX = e.clientX - el.offsetLeft;
                let exY = e.clientY - el.offsetTop;

                document.onmousemove = function(e) {
                    let left = e.clientX - elX;
                    let top = e.clientY - exY;

                    this.positionX = top;
                    this.positionY = left;

                    el.style.left = left + 'px';
                    el.style.top = top + 'px';
                };
                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
        }
    });

    Vue.component(picture_space.name, picture_space);
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}


/* harmony default export */ var packages_picture_space = (picture_space);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js
/* concated harmony reexport PictureSpace */__webpack_require__.d(__webpack_exports__, "PictureSpace", function() { return picture_space; });


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (packages_picture_space);



/***/ })

/******/ });
});
//# sourceMappingURL=vue-picture-space.umd.js.map