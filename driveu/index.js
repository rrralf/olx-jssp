(function () {
	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var sha1 = createCommonjsModule(function (module) {
	/*
	 * [js-sha1]{@link https://github.com/emn178/js-sha1}
	 *
	 * @version 0.6.0
	 * @author Chen, Yi-Cyuan [emn178@gmail.com]
	 * @copyright Chen, Yi-Cyuan 2014-2017
	 * @license MIT
	 */
	/*jslint bitwise: true */
	(function() {

	  var root = typeof window === 'object' ? window : {};
	  var NODE_JS = !root.JS_SHA1_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
	  if (NODE_JS) {
	    root = commonjsGlobal;
	  }
	  var COMMON_JS = !root.JS_SHA1_NO_COMMON_JS && 'object' === 'object' && module.exports;
	  var HEX_CHARS = '0123456789abcdef'.split('');
	  var EXTRA = [-2147483648, 8388608, 32768, 128];
	  var SHIFT = [24, 16, 8, 0];
	  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

	  var blocks = [];

	  var createOutputMethod = function (outputType) {
	    return function (message) {
	      return new Sha1(true).update(message)[outputType]();
	    };
	  };

	  var createMethod = function () {
	    var method = createOutputMethod('hex');
	    if (NODE_JS) {
	      method = nodeWrap(method);
	    }
	    method.create = function () {
	      return new Sha1();
	    };
	    method.update = function (message) {
	      return method.create().update(message);
	    };
	    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
	      var type = OUTPUT_TYPES[i];
	      method[type] = createOutputMethod(type);
	    }
	    return method;
	  };

	  var nodeWrap = function (method) {
	    var crypto = eval("require('crypto')");
	    var Buffer = eval("require('buffer').Buffer");
	    var nodeMethod = function (message) {
	      if (typeof message === 'string') {
	        return crypto.createHash('sha1').update(message, 'utf8').digest('hex');
	      } else if (message.constructor === ArrayBuffer) {
	        message = new Uint8Array(message);
	      } else if (message.length === undefined) {
	        return method(message);
	      }
	      return crypto.createHash('sha1').update(new Buffer(message)).digest('hex');
	    };
	    return nodeMethod;
	  };

	  function Sha1(sharedMemory) {
	    if (sharedMemory) {
	      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
	      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
	      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
	      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
	      this.blocks = blocks;
	    } else {
	      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	    }

	    this.h0 = 0x67452301;
	    this.h1 = 0xEFCDAB89;
	    this.h2 = 0x98BADCFE;
	    this.h3 = 0x10325476;
	    this.h4 = 0xC3D2E1F0;

	    this.block = this.start = this.bytes = this.hBytes = 0;
	    this.finalized = this.hashed = false;
	    this.first = true;
	  }

	  Sha1.prototype.update = function (message) {
	    if (this.finalized) {
	      return;
	    }
	    var notString = typeof(message) !== 'string';
	    if (notString && message.constructor === root.ArrayBuffer) {
	      message = new Uint8Array(message);
	    }
	    var code, index = 0, i, length = message.length || 0, blocks = this.blocks;

	    while (index < length) {
	      if (this.hashed) {
	        this.hashed = false;
	        blocks[0] = this.block;
	        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
	        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
	        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
	        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
	      }

	      if(notString) {
	        for (i = this.start; index < length && i < 64; ++index) {
	          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
	        }
	      } else {
	        for (i = this.start; index < length && i < 64; ++index) {
	          code = message.charCodeAt(index);
	          if (code < 0x80) {
	            blocks[i >> 2] |= code << SHIFT[i++ & 3];
	          } else if (code < 0x800) {
	            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
	          } else if (code < 0xd800 || code >= 0xe000) {
	            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
	          } else {
	            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
	            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
	            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
	          }
	        }
	      }

	      this.lastByteIndex = i;
	      this.bytes += i - this.start;
	      if (i >= 64) {
	        this.block = blocks[16];
	        this.start = i - 64;
	        this.hash();
	        this.hashed = true;
	      } else {
	        this.start = i;
	      }
	    }
	    if (this.bytes > 4294967295) {
	      this.hBytes += this.bytes / 4294967296 << 0;
	      this.bytes = this.bytes % 4294967296;
	    }
	    return this;
	  };

	  Sha1.prototype.finalize = function () {
	    if (this.finalized) {
	      return;
	    }
	    this.finalized = true;
	    var blocks = this.blocks, i = this.lastByteIndex;
	    blocks[16] = this.block;
	    blocks[i >> 2] |= EXTRA[i & 3];
	    this.block = blocks[16];
	    if (i >= 56) {
	      if (!this.hashed) {
	        this.hash();
	      }
	      blocks[0] = this.block;
	      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
	      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
	      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
	      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
	    }
	    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
	    blocks[15] = this.bytes << 3;
	    this.hash();
	  };

	  Sha1.prototype.hash = function () {
	    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4;
	    var f, j, t, blocks = this.blocks;

	    for(j = 16; j < 80; ++j) {
	      t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
	      blocks[j] =  (t << 1) | (t >>> 31);
	    }

	    for(j = 0; j < 20; j += 5) {
	      f = (b & c) | ((~b) & d);
	      t = (a << 5) | (a >>> 27);
	      e = t + f + e + 1518500249 + blocks[j] << 0;
	      b = (b << 30) | (b >>> 2);

	      f = (a & b) | ((~a) & c);
	      t = (e << 5) | (e >>> 27);
	      d = t + f + d + 1518500249 + blocks[j + 1] << 0;
	      a = (a << 30) | (a >>> 2);

	      f = (e & a) | ((~e) & b);
	      t = (d << 5) | (d >>> 27);
	      c = t + f + c + 1518500249 + blocks[j + 2] << 0;
	      e = (e << 30) | (e >>> 2);

	      f = (d & e) | ((~d) & a);
	      t = (c << 5) | (c >>> 27);
	      b = t + f + b + 1518500249 + blocks[j + 3] << 0;
	      d = (d << 30) | (d >>> 2);

	      f = (c & d) | ((~c) & e);
	      t = (b << 5) | (b >>> 27);
	      a = t + f + a + 1518500249 + blocks[j + 4] << 0;
	      c = (c << 30) | (c >>> 2);
	    }

	    for(; j < 40; j += 5) {
	      f = b ^ c ^ d;
	      t = (a << 5) | (a >>> 27);
	      e = t + f + e + 1859775393 + blocks[j] << 0;
	      b = (b << 30) | (b >>> 2);

	      f = a ^ b ^ c;
	      t = (e << 5) | (e >>> 27);
	      d = t + f + d + 1859775393 + blocks[j + 1] << 0;
	      a = (a << 30) | (a >>> 2);

	      f = e ^ a ^ b;
	      t = (d << 5) | (d >>> 27);
	      c = t + f + c + 1859775393 + blocks[j + 2] << 0;
	      e = (e << 30) | (e >>> 2);

	      f = d ^ e ^ a;
	      t = (c << 5) | (c >>> 27);
	      b = t + f + b + 1859775393 + blocks[j + 3] << 0;
	      d = (d << 30) | (d >>> 2);

	      f = c ^ d ^ e;
	      t = (b << 5) | (b >>> 27);
	      a = t + f + a + 1859775393 + blocks[j + 4] << 0;
	      c = (c << 30) | (c >>> 2);
	    }

	    for(; j < 60; j += 5) {
	      f = (b & c) | (b & d) | (c & d);
	      t = (a << 5) | (a >>> 27);
	      e = t + f + e - 1894007588 + blocks[j] << 0;
	      b = (b << 30) | (b >>> 2);

	      f = (a & b) | (a & c) | (b & c);
	      t = (e << 5) | (e >>> 27);
	      d = t + f + d - 1894007588 + blocks[j + 1] << 0;
	      a = (a << 30) | (a >>> 2);

	      f = (e & a) | (e & b) | (a & b);
	      t = (d << 5) | (d >>> 27);
	      c = t + f + c - 1894007588 + blocks[j + 2] << 0;
	      e = (e << 30) | (e >>> 2);

	      f = (d & e) | (d & a) | (e & a);
	      t = (c << 5) | (c >>> 27);
	      b = t + f + b - 1894007588 + blocks[j + 3] << 0;
	      d = (d << 30) | (d >>> 2);

	      f = (c & d) | (c & e) | (d & e);
	      t = (b << 5) | (b >>> 27);
	      a = t + f + a - 1894007588 + blocks[j + 4] << 0;
	      c = (c << 30) | (c >>> 2);
	    }

	    for(; j < 80; j += 5) {
	      f = b ^ c ^ d;
	      t = (a << 5) | (a >>> 27);
	      e = t + f + e - 899497514 + blocks[j] << 0;
	      b = (b << 30) | (b >>> 2);

	      f = a ^ b ^ c;
	      t = (e << 5) | (e >>> 27);
	      d = t + f + d - 899497514 + blocks[j + 1] << 0;
	      a = (a << 30) | (a >>> 2);

	      f = e ^ a ^ b;
	      t = (d << 5) | (d >>> 27);
	      c = t + f + c - 899497514 + blocks[j + 2] << 0;
	      e = (e << 30) | (e >>> 2);

	      f = d ^ e ^ a;
	      t = (c << 5) | (c >>> 27);
	      b = t + f + b - 899497514 + blocks[j + 3] << 0;
	      d = (d << 30) | (d >>> 2);

	      f = c ^ d ^ e;
	      t = (b << 5) | (b >>> 27);
	      a = t + f + a - 899497514 + blocks[j + 4] << 0;
	      c = (c << 30) | (c >>> 2);
	    }

	    this.h0 = this.h0 + a << 0;
	    this.h1 = this.h1 + b << 0;
	    this.h2 = this.h2 + c << 0;
	    this.h3 = this.h3 + d << 0;
	    this.h4 = this.h4 + e << 0;
	  };

	  Sha1.prototype.hex = function () {
	    this.finalize();

	    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;

	    return HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
	           HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
	           HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
	           HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
	           HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
	           HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
	           HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
	           HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
	           HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
	           HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
	           HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
	           HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
	           HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
	           HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
	           HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
	           HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
	           HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
	           HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
	           HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
	           HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F];
	  };

	  Sha1.prototype.toString = Sha1.prototype.hex;

	  Sha1.prototype.digest = function () {
	    this.finalize();

	    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;

	    return [
	      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
	      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
	      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
	      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
	      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF
	    ];
	  };

	  Sha1.prototype.array = Sha1.prototype.digest;

	  Sha1.prototype.arrayBuffer = function () {
	    this.finalize();

	    var buffer = new ArrayBuffer(20);
	    var dataView = new DataView(buffer);
	    dataView.setUint32(0, this.h0);
	    dataView.setUint32(4, this.h1);
	    dataView.setUint32(8, this.h2);
	    dataView.setUint32(12, this.h3);
	    dataView.setUint32(16, this.h4);
	    return buffer;
	  };

	  var exports = createMethod();

	  if (COMMON_JS) {
	    module.exports = exports;
	  } else {
	    root.sha1 = exports;
	  }
	})();
	});

	var driveuApi = createCommonjsModule(function (module, exports) {

	  exports.__esModule = true;
	  exports.DriveU = void 0;
	  var DriveU;

	  (function (DriveU_1) {
	    var DriveUResponse = function () {
	      function DriveUResponse() {
	        this.errorCode = "";
	        this.statusCode = "";
	      }

	      return DriveUResponse;
	    }();

	    DriveU_1.DriveUResponse = DriveUResponse;

	    var DriveU = function () {
	      function DriveU(baseUrl, client_slug, salt) {
	        this._endpoint = baseUrl;
	        this._client_slug = client_slug;
	        this._salt = salt;
	      }

	      DriveU.prototype._encodeQueryData = function (data) {
	        var ret = [];

	        for (var key in data) {
	          var value = data[key];
	          ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	        }

	        return ret.join('&');
	      };

	      DriveU.prototype.getHash = function (client_booking_id) {
	        var msg = client_booking_id + "|" + this._salt;
	        var digest = sha1.digest(msg);
	        var identity_hash = Buffer.from(digest).toString('base64');
	        return identity_hash;
	      };

	      DriveU.prototype.validateRequest = function (request) {
	        if (request == undefined) {
	          throw Error('request is empty');
	        }

	        if (request["client_booking_id"] == undefined || request["client_booking_id"] == "") {
	          throw Error('client_booking_id is empty');
	        }

	        var car_types = ["automatic", "manual"];

	        if (car_types.indexOf(request["car_type"]) == -1) {
	          throw Error('wrong car_type value');
	        }

	        var cities = ["bangalore", "chennai", "mumbai", "pure", "delhi", "delhi ncr", "hyderabad", "ahmedabad", "kolkata", "kochi"];

	        if (cities.indexOf(request["city"].toLowerCase()) == -1) {
	          throw Error('wrong city value');
	        }
	      };

	      DriveU.prototype.createBooking = function (request) {
	        var _this = this;

	        try {
	          this.validateRequest(request);
	        } catch (e) {
	          return new Promise(function (resolve, reject) {
	            var rr = new DriveUResponse();
	            rr.errorCode = "-1";
	            rr.errorDescription = e.message;
	            reject(rr);
	          });
	        }

	        var identity_hash = this.getHash(request["client_booking_id"]);
	        console.log('Message hash');
	        console.log(identity_hash);
	        var data = {
	          "identity_hash": identity_hash,
	          "client_booking_id": request["client_booking_id"],
	          "client_slug": this._client_slug,
	          "city": request["city"],
	          "car_type": request["car_type"],
	          "pickup_datetime": request["pickup_datetime"],
	          "drop_location_contact": request["drop_location_contact"],
	          "pickup_longitude": request["pickup_longitude"],
	          "pickup_latitude": request["pickup_latitude"],
	          "customer_name": request["customer_name"],
	          "drop_longitude": request["drop_longitude"],
	          "drop_latitude": request["drop_latitude"],
	          "customer_mobile": request["customer_mobile"],
	          "pickup_address": request["pickup_address"],
	          "drop_address": request["drop_address"]
	        };
	        var jsonRequest = JSON.stringify(data);
	        return new Promise(function (resolve, reject) {
	          var rr = new DriveUResponse();
	          rr.clientBookingId = request["client_booking_id"];
	          rr.debugRequest = jsonRequest;
	          rr.errorCode = "0";
	          var xhr = new XMLHttpRequest();

	          xhr.onreadystatechange = function () {
	            try {
	              if (xhr.readyState !== 4) return;
	              if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status + "; " + xhr.responseText);
	              rr.debugResponse = xhr.responseText;
	              var obj = JSON.parse(xhr.responseText);

	              if (obj != undefined) {
	                if (obj["status"] != undefined && obj["status"] == "success") {
	                  rr.statusCode = obj["booking_status"];
	                  rr.statusDescription = obj["booking_status"];
	                  rr.driveuBookingId = obj['driveu_booking_id'];
	                } else if (obj["status"] != undefined && obj["status"] == "error") {
	                  rr.errorCode = "103";
	                  rr.errorDescription = obj['message'];
	                  rr.statusCode = 'error';
	                } else {
	                  rr.errorCode = "104";
	                  rr.errorDescription = "unknown response";
	                  rr.statusCode = 'error';
	                }
	              } else {
	                rr.errorCode = "105";
	                rr.errorDescription = "unknown response";
	                rr.statusCode = 'error';
	              }

	              resolve(rr);
	            } catch (e) {
	              rr.errorCode = "-1";
	              rr.errorDescription = e.message;
	              reject(rr);
	            }
	          };

	          xhr.open("POST", _this._endpoint + "/affiliate/create-b2b-booking/");
	          xhr.setRequestHeader('Content-Type', 'application/json');
	          xhr.send(jsonRequest);
	        });
	      };

	      DriveU.prototype.cancelBooking = function (request) {
	        var _this = this;

	        var identity_hash = this.getHash(request["client_booking_id"]);
	        console.log('Message hash');
	        console.log(identity_hash);
	        var data = {
	          "identity_hash": identity_hash,
	          "client_booking_id": request["client_booking_id"],
	          "client_slug": this._client_slug,
	          "pickup_datetime": request["pickup_datetime"],
	          "driveu_booking_id": request["driveu_booking_id"]
	        };
	        return new Promise(function (resolve, reject) {
	          var rr = new DriveUResponse();
	          rr.clientBookingId = request["client_booking_id"];
	          rr.debugRequest = JSON.stringify(data);
	          rr.errorCode = "0";
	          var xhr = new XMLHttpRequest();

	          xhr.onreadystatechange = function () {
	            try {
	              if (xhr.readyState !== 4) return;
	              if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status + "; " + xhr.responseText);
	              rr.debugResponse = xhr.responseText;
	              var obj = JSON.parse(xhr.responseText);

	              if (obj != undefined) {
	                if (obj["status"] != undefined && obj["status"] == "success") {
	                  rr.statusCode = obj["booking_status"];
	                  rr.statusDescription = obj["booking_status"];
	                  rr.driveuBookingId = obj['driveu_booking_id'];
	                } else if (obj["status"] != undefined && obj["status"] == "error") {
	                  rr.errorCode = "103";
	                  rr.errorDescription = obj['message'];
	                  rr.statusCode = 'error';
	                } else {
	                  rr.errorCode = "104";
	                  rr.errorDescription = "unknown response";
	                  rr.statusCode = 'error';
	                }
	              } else {
	                rr.errorCode = "105";
	                rr.errorDescription = "unknown response";
	                rr.statusCode = 'error';
	              }

	              resolve(rr);
	            } catch (e) {
	              rr.errorCode = "-1";
	              rr.errorDescription = e.message;
	              reject(rr);
	            }
	          };

	          xhr.open("POST", _this._endpoint + "/affiliate/cancel-b2b-booking/");
	          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	          var requestBody = _this._encodeQueryData(data);

	          xhr.send(requestBody);
	        });
	      };

	      DriveU.prototype.getBookingStatus = function (request) {
	        var _this = this;

	        var identity_hash = this.getHash(request["client_booking_id"]);
	        console.log('Message hash');
	        console.log(identity_hash);
	        var data = {
	          "identity_hash": identity_hash,
	          "client_booking_id": request["client_booking_id"],
	          "client_slug": this._client_slug,
	          "driveu_booking_id": request["driveu_booking_id"]
	        };
	        return new Promise(function (resolve, reject) {
	          var rr = new DriveUResponse();
	          rr.clientBookingId = request["client_booking_id"];
	          rr.debugRequest = JSON.stringify(data);
	          rr.errorCode = "0";
	          var xhr = new XMLHttpRequest();

	          xhr.onreadystatechange = function () {
	            try {
	              if (xhr.readyState !== 4) return;
	              if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status + "; " + xhr.responseText);
	              rr.debugResponse = xhr.responseText;
	              var obj = JSON.parse(xhr.responseText);

	              if (obj != undefined) {
	                if (obj["status"] != undefined && obj["status"] == "success") {
	                  rr.statusCode = obj["booking_status"];
	                  rr.statusDescription = obj["booking_status"];
	                  rr.driveuBookingId = obj['driveu_booking_id'];
	                  rr.driverId = obj["driver_id"];
	                  rr.driverName = obj["driver_name"];
	                  rr.driverNumber = obj["driver_number"];
	                } else if (obj["status"] != undefined && obj["status"] == "error") {
	                  rr.errorCode = "103";
	                  rr.errorDescription = obj['message'];
	                  rr.statusCode = 'error';
	                } else {
	                  rr.errorCode = "104";
	                  rr.errorDescription = "unknown response";
	                  rr.statusCode = 'error';
	                }
	              } else {
	                rr.errorCode = "105";
	                rr.errorDescription = "unknown response";
	                rr.statusCode = 'error';
	              }

	              resolve(rr);
	            } catch (e) {
	              rr.errorCode = "-1";
	              rr.errorDescription = e.message;
	              reject(rr);
	            }
	          };

	          var queryString = _this._encodeQueryData(data);

	          var query = _this._endpoint + "/affiliate/get-booking-status/?" + queryString;
	          xhr.open("GET", query);
	          xhr.responseType = 'json';
	          xhr.send();
	        });
	      };

	      return DriveU;
	    }();

	    DriveU_1.DriveU = DriveU;
	  })(DriveU = exports.DriveU || (exports.DriveU = {}));
	});
	unwrapExports(driveuApi);
	var driveuApi_1 = driveuApi.DriveU;

	metadata = {
	  systemName: "DriveU API",
	  displayName: "DriveU API",
	  description: "DriveU integration API",
	  "configuration": {
	    "EndpointUrl": {
	      displayName: "DriveU endpoint Url",
	      type: "string",
	      value: "http://app1.driveubox.com"
	    },
	    "ClientSlug": {
	      displayName: "DriveU ClientSlug",
	      type: "string",
	      value: "olx"
	    },
	    "SALT": {
	      displayName: "DriveU Client SALT",
	      type: "string",
	      value: "knlir4o3x1"
	    }
	  }
	};

	ondescribe = async function ({
	  configuration
	}) {
	  postSchema({
	    objects: {
	      "DriveU": {
	        displayName: "DriveU car booking API",
	        description: "DriveU car booking API",
	        properties: {
	          "clientBookingId": {
	            displayName: "clientBookingId",
	            type: "string"
	          },
	          "driveuBookingId": {
	            displayName: "driveuBookingId",
	            type: "string"
	          },
	          "statusCode": {
	            displayName: "statusCode",
	            type: "string"
	          },
	          "statusDescription": {
	            displayName: "statusDescription",
	            type: "string"
	          },
	          "errorCode": {
	            displayName: "errorCode",
	            type: "string"
	          },
	          "errorDescription": {
	            displayName: "errorDescription",
	            type: "string"
	          },
	          "debugRequest": {
	            displayName: "debugRequest",
	            type: "string"
	          },
	          "debugResponse": {
	            displayName: "debugResponse",
	            type: "string"
	          },
	          "driverId": {
	            displayName: "driverId",
	            type: "string"
	          },
	          "driverName": {
	            displayName: "driverName",
	            type: "string"
	          },
	          "driverNumber": {
	            displayName: "driverNumber",
	            type: "string"
	          },
	          "version": {
	            displayName: "version",
	            type: "string"
	          }
	        },
	        methods: {
	          "CreateBooking": {
	            displayName: "CreateBooking",
	            type: "execute",
	            parameters: {
	              "pClientBookingId": {
	                displayName: "pClientBookingId",
	                description: "Client Booking Id",
	                type: "string"
	              },
	              "pCity": {
	                displayName: "pCity",
	                description: "This parameter should contain a brief product description. It should be a string describing the product",
	                type: "string"
	              },
	              "pCarType": {
	                displayName: "pCarType",
	                description: "Transaction amount",
	                type: "string"
	              },
	              "pCustomerName": {
	                displayName: "pCustomerName",
	                description: "Address line #1",
	                type: "string"
	              },
	              "pCustomerMobile": {
	                displayName: "pCustomerMobile",
	                description: "City",
	                type: "string"
	              },
	              "pPickupDatetime": {
	                displayName: "pPickupDatetime",
	                description: "datetime at which DriveU driver reaches pickup address",
	                type: "string"
	              },
	              "pPickupAddress": {
	                displayName: "pPickupAddress",
	                description: "State",
	                type: "string"
	              },
	              "pPickupLongitude": {
	                displayName: "pPickupLongitude",
	                description: "email of the customer",
	                type: "string"
	              },
	              "pPickupLatitude": {
	                displayName: "pPickupLatitude",
	                description: "email of the customer",
	                type: "string"
	              },
	              "pDropAddress": {
	                displayName: "pDropAddress",
	                description: "Country",
	                type: "string"
	              },
	              "pDropLongitude": {
	                displayName: "pDropLongitude",
	                description: "email of the customer",
	                type: "string"
	              },
	              "pDropLatitude": {
	                displayName: "pDropLatitude",
	                description: "email of the customer",
	                type: "string"
	              },
	              "pDropLocationContact": {
	                displayName: "pDropLocationContact",
	                description: "last name of the customer",
	                type: "string"
	              }
	            },
	            requiredParameters: ["pClientBookingId", "pCity", "pCarType", "pCustomerName", "pCustomerMobile", "pPickupDatetime", "pPickupAddress", "pPickupLongitude", "pPickupLatitude", "pDropAddress", "pDropLongitude", "pDropLatitude", "pDropLocationContact"],
	            outputs: ["clientBookingId", "driveuBookingId", "statusCode", "statusDescription", "errorCode", "errorDescription", "debugRequest", "debugResponse", "driverId", "driverName", "driverNumber"]
	          },
	          "CancelBooking": {
	            displayName: "Cancel booking",
	            type: "execute",
	            parameters: {
	              "pClientBookingId": {
	                displayName: "pClientBookingId",
	                description: "Client Booking Id",
	                type: "string"
	              },
	              "pDriveUBookingId": {
	                displayName: "pDriveUBookingId",
	                description: "DriveU Booking Id",
	                type: "string"
	              },
	              "pPickupDatetime": {
	                displayName: "pPickupDatetime",
	                description: "datetime at which DriveU driver reaches pickup address",
	                type: "string"
	              }
	            },
	            requiredParameters: ["pClientBookingId", "pDriveUBookingId", "pPickupDatetime"],
	            outputs: ["clientBookingId", "driveuBookingId", "statusCode", "statusDescription", "errorCode", "errorDescription", "debugRequest", "debugResponse", "driverId", "driverName", "driverNumber"]
	          },
	          "GetBookingStatus": {
	            displayName: "Get booking status",
	            type: "execute",
	            parameters: {
	              "pClientBookingId": {
	                displayName: "pClientBookingId",
	                description: "Client Booking Id",
	                type: "string"
	              },
	              "pDriveUBookingId": {
	                displayName: "pDriveUBookingId",
	                description: "DriveU Booking Id",
	                type: "string"
	              }
	            },
	            requiredParameters: ["pClientBookingId", "pDriveUBookingId", "pPickupDatetime"],
	            outputs: ["clientBookingId", "driveuBookingId", "statusCode", "statusDescription", "errorCode", "errorDescription", "debugRequest", "debugResponse", "driverId", "driverName", "driverNumber"]
	          },
	          "GetVersion": {
	            displayName: "Get gateway version",
	            type: "read",
	            outputs: ["version"]
	          }
	        }
	      }
	    }
	  });
	};

	onexecute = async function ({
	  objectName,
	  methodName,
	  parameters,
	  properties,
	  configuration,
	  schema
	}) {
	  try {
	    switch (objectName) {
	      case "DriveU":
	        await onexecuteDriveU(methodName, properties, parameters, configuration);
	        break;

	      default:
	        throw new Error("The object " + objectName + " is not supported.");
	    }
	  } catch (e) {
	    postResult({
	      "statusCode": "Exception",
	      "statusDescription": e.message,
	      "errorCode": "Exception",
	      "errorDescription": e.stack
	    });
	  }
	};

	async function onexecuteDriveU(methodName, properties, parameters, configuration) {
	  switch (methodName) {
	    case "CreateBooking":
	      await driveuCreateBooking(parameters, configuration);
	      break;

	    case "CancelBooking":
	      await driveuCancelBooking(parameters, configuration);
	      break;

	    case "GetBookingStatus":
	      await driveuGetStatus(parameters, configuration);
	      break;

	    case "GetVersion":
	      await payuGetVersion();
	      break;

	    default:
	      throw new Error("The method " + methodName + " is not supported.");
	  }
	}

	function driveuCreateBooking(parameters, configuration) {
	  var endpoint = configuration["EndpointUrl"];
	  var client_slug = configuration["ClientSlug"];
	  var salt = configuration["SALT"];
	  let request = {
	    "client_booking_id": parameters["pClientBookingId"],
	    "city": parameters["pCity"],
	    "car_type": parameters["pCarType"],
	    "pickup_datetime": parameters["pPickupDatetime"],
	    "drop_location_contact": parameters["pDropLocationContact"],
	    "pickup_longitude": parameters["pPickupLongitude"],
	    "pickup_latitude": parameters["pPickupLatitude"],
	    "customer_name": parameters["pCustomerName"],
	    "drop_longitude": parameters["pDropLongitude"],
	    "drop_latitude": parameters["pDropLatitude"],
	    "customer_mobile": parameters["pCustomerMobile"],
	    "pickup_address": parameters["pPickupAddress"],
	    "drop_address": parameters["pDropAddress"]
	  };
	  return new Promise((resolve, reject) => {
	    var wrap = new driveuApi_1.DriveU(endpoint, client_slug, salt);
	    wrap.createBooking(request).then(response => {
	      console.log(response);
	      postResult(toK2Result(response));
	      resolve();
	    }).catch(err => {
	      console.log(err);
	      postResult(toK2Result(err));
	      reject(err);
	    });
	  });
	}

	function driveuCancelBooking(parameters, configuration) {
	  var endpoint = configuration["EndpointUrl"];
	  var client_slug = configuration["ClientSlug"];
	  var salt = configuration["SALT"];
	  let request = {
	    "client_booking_id": parameters["pClientBookingId"],
	    "driveu_booking_id": parameters["pDriveUBookingId"],
	    "pickup_datetime": parameters["pPickupDatetime"]
	  };
	  return new Promise((resolve, reject) => {
	    var wrap = new driveuApi_1.DriveU(endpoint, client_slug, salt);
	    wrap.cancelBooking(request).then(response => {
	      console.log(response);
	      postResult(toK2Result(response));
	      resolve();
	    }).catch(err => {
	      console.log(err);
	      postResult(toK2Result(err));
	      reject(err);
	    });
	  });
	}

	function driveuGetStatus(parameters, configuration) {
	  var endpoint = configuration["EndpointUrl"];
	  var client_slug = configuration["ClientSlug"];
	  var salt = configuration["SALT"];
	  let request = {
	    "client_booking_id": parameters["pClientBookingId"],
	    "driveu_booking_id": parameters["pDriveUBookingId"]
	  };
	  return new Promise((resolve, reject) => {
	    var wrap = new driveuApi_1.DriveU(endpoint, client_slug, salt);
	    wrap.getBookingStatus(request).then(response => {
	      console.log(response);
	      postResult(toK2Result(response));
	      resolve();
	    }).catch(err => {
	      console.log(err);
	      postResult(toK2Result(err));
	      reject(err);
	    });
	  });
	}

	function payuGetVersion(parameters, configuration) {
	  return new Promise((resolve, reject) => {
	    postResult({
	      "version": "202012050033"
	    });
	  });
	}

	function toK2Result(response) {
	  return {
	    "clientBookingId": response.clientBookingId,
	    "driveuBookingId": response.driveuBookingId,
	    "statusCode": response.statusCode,
	    "statusDescription": response.statusDescription,
	    "driverId": response.driverId,
	    "driverName": response.driverName,
	    "driverNumber": response.driverNumber,
	    "errorCode": response.errorCode,
	    "errorDescription": response.errorDescription,
	    "debugRequest": response.debugRequest,
	    "debugResponse": response.debugResponse
	  };
	}

}());
//# sourceMappingURL=index.js.map
