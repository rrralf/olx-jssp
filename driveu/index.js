(function () {
	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var tssha1 = createCommonjsModule(function (module, exports) {

	  exports.__esModule = true;
	  exports.sha1 = void 0;
	  var sha1;

	  (function (sha1) {
	    var POW_2_24 = Math.pow(2, 24);
	    var POW_2_32 = Math.pow(2, 32);

	    function hex(n) {
	      var s = "",
	          v;

	      for (var i = 7; i >= 0; --i) {
	        v = n >>> (i << 2) & 0xF;
	        s += v.toString(16);
	      }

	      return s;
	    }

	    function lrot(n, bits) {
	      return n << bits | n >>> 32 - bits;
	    }

	    var Uint32ArrayBigEndian = function () {
	      function Uint32ArrayBigEndian(length) {
	        this.bytes = new Uint8Array(length << 2);
	      }

	      Uint32ArrayBigEndian.prototype.get = function (index) {
	        index <<= 2;
	        return this.bytes[index] * POW_2_24 + (this.bytes[index + 1] << 16 | this.bytes[index + 2] << 8 | this.bytes[index + 3]);
	      };

	      Uint32ArrayBigEndian.prototype.set = function (index, value) {
	        var high = Math.floor(value / POW_2_24),
	            rest = value - high * POW_2_24;
	        index <<= 2;
	        this.bytes[index] = high;
	        this.bytes[index + 1] = rest >> 16;
	        this.bytes[index + 2] = rest >> 8 & 0xFF;
	        this.bytes[index + 3] = rest & 0xFF;
	      };

	      return Uint32ArrayBigEndian;
	    }();

	    function string2ArrayBuffer(s) {
	      s = s.replace(/[\u0080-\u07ff]/g, function (c) {
	        var code = c.charCodeAt(0);
	        return String.fromCharCode(0xC0 | code >> 6, 0x80 | code & 0x3F);
	      });
	      s = s.replace(/[\u0080-\uffff]/g, function (c) {
	        var code = c.charCodeAt(0);
	        return String.fromCharCode(0xE0 | code >> 12, 0x80 | code >> 6 & 0x3F, 0x80 | code & 0x3F);
	      });
	      var n = s.length,
	          array = new Uint8Array(n);

	      for (var i = 0; i < n; ++i) {
	        array[i] = s.charCodeAt(i);
	      }

	      return array.buffer;
	    }

	    function hash(bufferOrString) {
	      var source;

	      if (bufferOrString instanceof ArrayBuffer) {
	        source = bufferOrString;
	      } else {
	        source = string2ArrayBuffer(String(bufferOrString));
	      }

	      var h0 = 0x67452301,
	          h1 = 0xEFCDAB89,
	          h2 = 0x98BADCFE,
	          h3 = 0x10325476,
	          h4 = 0xC3D2E1F0,
	          i,
	          sbytes = source.byteLength,
	          sbits = sbytes << 3,
	          minbits = sbits + 65,
	          bits = Math.ceil(minbits / 512) << 9,
	          bytes = bits >>> 3,
	          slen = bytes >>> 2,
	          s = new Uint32ArrayBigEndian(slen),
	          s8 = s.bytes,
	          j,
	          w = new Uint32Array(80),
	          sourceArray = new Uint8Array(source);

	      for (i = 0; i < sbytes; ++i) {
	        s8[i] = sourceArray[i];
	      }

	      s8[sbytes] = 0x80;
	      s.set(slen - 2, Math.floor(sbits / POW_2_32));
	      s.set(slen - 1, sbits & 0xFFFFFFFF);

	      for (i = 0; i < slen; i += 16) {
	        for (j = 0; j < 16; ++j) {
	          w[j] = s.get(i + j);
	        }

	        for (; j < 80; ++j) {
	          w[j] = lrot(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
	        }

	        var a = h0,
	            b = h1,
	            c = h2,
	            d = h3,
	            e = h4,
	            f,
	            k,
	            temp;

	        for (j = 0; j < 80; ++j) {
	          if (j < 20) {
	            f = b & c | ~b & d;
	            k = 0x5A827999;
	          } else if (j < 40) {
	            f = b ^ c ^ d;
	            k = 0x6ED9EBA1;
	          } else if (j < 60) {
	            f = b & c ^ b & d ^ c & d;
	            k = 0x8F1BBCDC;
	          } else {
	            f = b ^ c ^ d;
	            k = 0xCA62C1D6;
	          }

	          temp = lrot(a, 5) + f + e + k + w[j] & 0xFFFFFFFF;
	          e = d;
	          d = c;
	          c = lrot(b, 30);
	          b = a;
	          a = temp;
	        }

	        h0 = h0 + a & 0xFFFFFFFF;
	        h1 = h1 + b & 0xFFFFFFFF;
	        h2 = h2 + c & 0xFFFFFFFF;
	        h3 = h3 + d & 0xFFFFFFFF;
	        h4 = h4 + e & 0xFFFFFFFF;
	      }

	      return hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4);
	    }

	    sha1.hash = hash;
	  })(sha1 = exports.sha1 || (exports.sha1 = {}));
	});
	unwrapExports(tssha1);
	var tssha1_1 = tssha1.sha1;

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
	        var strhash = tssha1.sha1.hash(msg);
	        var digest = [];

	        for (var i = 0; i < strhash.length; i += 2) {
	          var sstr = strhash.substr(i, 2);
	          var charCode = Number("0x" + sstr);
	          digest[digest.length] = charCode;
	        }

	        var identity_hash = Buffer.from(digest).toString('base64');
	        return identity_hash;
	      };

	      DriveU.prototype.validateRequest = function (request) {
	        if (request == undefined) {
	          throw new Error('request is empty');
	        }

	        if (request["client_booking_id"] == undefined || request["client_booking_id"] == "") {
	          throw new Error('client_booking_id is empty');
	        }

	        var car_types = ["automatic", "manual"];

	        if (car_types.indexOf(request["car_type"]) == -1) {
	          throw new Error('wrong car_type value');
	        }

	        var cities = ["bangalore", "chennai", "mumbai", "pure", "delhi", "delhi ncr", "hyderabad", "ahmedabad", "kolkata", "kochi"];

	        if (cities.indexOf(request["city"].toLowerCase()) == -1) {
	          throw new Error('wrong city value');
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
	            displayName: "Create Booking",
	            type: "execute",
	            parameters: {
	              "pClientBookingId": {
	                displayName: "pClientBookingId",
	                description: "Client Booking Id",
	                type: "string"
	              },
	              "pCity": {
	                displayName: "pCity",
	                description: "",
	                type: "string"
	              },
	              "pCarType": {
	                displayName: "pCarType",
	                description: "manual/automatic",
	                type: "string"
	              },
	              "pCustomerName": {
	                displayName: "pCustomerName",
	                description: "",
	                type: "string"
	              },
	              "pCustomerMobile": {
	                displayName: "pCustomerMobile",
	                description: "",
	                type: "string"
	              },
	              "pPickupDatetime": {
	                displayName: "pPickupDatetime",
	                description: "datetime at which DriveU driver reaches pickup address",
	                type: "string"
	              },
	              "pPickupAddress": {
	                displayName: "pPickupAddress",
	                description: "",
	                type: "string"
	              },
	              "pPickupLongitude": {
	                displayName: "pPickupLongitude",
	                description: "",
	                type: "string"
	              },
	              "pPickupLatitude": {
	                displayName: "pPickupLatitude",
	                description: "",
	                type: "string"
	              },
	              "pDropAddress": {
	                displayName: "pDropAddress",
	                description: "",
	                type: "string"
	              },
	              "pDropLongitude": {
	                displayName: "pDropLongitude",
	                description: "",
	                type: "string"
	              },
	              "pDropLatitude": {
	                displayName: "pDropLatitude",
	                description: "",
	                type: "string"
	              },
	              "pDropLocationContact": {
	                displayName: "pDropLocationContact",
	                description: "",
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

	    try {
	      wrap.createBooking(request).then(response => {
	        console.log(response);
	        postResult(toK2Result(response));
	        resolve();
	      }).catch(err => {
	        console.log(err);
	        postResult(toK2Result(err));
	        reject(err);
	      });
	    } catch (e) {
	      var rr = new driveuApi_1.DriveUResponse();
	      rr.errorCode = "-1";
	      rr.errorDescription = e.message;
	      postResult(toK2Result(rr));
	      resolve();
	    }
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
	      "version": "202012050103"
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
