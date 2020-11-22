(function () {
	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var sha512 = createCommonjsModule(function (module) {
	/*
	 * [js-sha512]{@link https://github.com/emn178/js-sha512}
	 *
	 * @version 0.8.0
	 * @author Chen, Yi-Cyuan [emn178@gmail.com]
	 * @copyright Chen, Yi-Cyuan 2014-2018
	 * @license MIT
	 */
	/*jslint bitwise: true */
	(function () {

	  var INPUT_ERROR = 'input is invalid type';
	  var FINALIZE_ERROR = 'finalize already called';
	  var WINDOW = typeof window === 'object';
	  var root = WINDOW ? window : {};
	  if (root.JS_SHA512_NO_WINDOW) {
	    WINDOW = false;
	  }
	  var WEB_WORKER = !WINDOW && typeof self === 'object';
	  var NODE_JS = !root.JS_SHA512_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
	  if (NODE_JS) {
	    root = commonjsGlobal;
	  } else if (WEB_WORKER) {
	    root = self;
	  }
	  var COMMON_JS = !root.JS_SHA512_NO_COMMON_JS && 'object' === 'object' && module.exports;
	  var ARRAY_BUFFER = !root.JS_SHA512_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
	  var HEX_CHARS = '0123456789abcdef'.split('');
	  var EXTRA = [-2147483648, 8388608, 32768, 128];
	  var SHIFT = [24, 16, 8, 0];
	  var K = [
	    0x428A2F98, 0xD728AE22, 0x71374491, 0x23EF65CD,
	    0xB5C0FBCF, 0xEC4D3B2F, 0xE9B5DBA5, 0x8189DBBC,
	    0x3956C25B, 0xF348B538, 0x59F111F1, 0xB605D019,
	    0x923F82A4, 0xAF194F9B, 0xAB1C5ED5, 0xDA6D8118,
	    0xD807AA98, 0xA3030242, 0x12835B01, 0x45706FBE,
	    0x243185BE, 0x4EE4B28C, 0x550C7DC3, 0xD5FFB4E2,
	    0x72BE5D74, 0xF27B896F, 0x80DEB1FE, 0x3B1696B1,
	    0x9BDC06A7, 0x25C71235, 0xC19BF174, 0xCF692694,
	    0xE49B69C1, 0x9EF14AD2, 0xEFBE4786, 0x384F25E3,
	    0x0FC19DC6, 0x8B8CD5B5, 0x240CA1CC, 0x77AC9C65,
	    0x2DE92C6F, 0x592B0275, 0x4A7484AA, 0x6EA6E483,
	    0x5CB0A9DC, 0xBD41FBD4, 0x76F988DA, 0x831153B5,
	    0x983E5152, 0xEE66DFAB, 0xA831C66D, 0x2DB43210,
	    0xB00327C8, 0x98FB213F, 0xBF597FC7, 0xBEEF0EE4,
	    0xC6E00BF3, 0x3DA88FC2, 0xD5A79147, 0x930AA725,
	    0x06CA6351, 0xE003826F, 0x14292967, 0x0A0E6E70,
	    0x27B70A85, 0x46D22FFC, 0x2E1B2138, 0x5C26C926,
	    0x4D2C6DFC, 0x5AC42AED, 0x53380D13, 0x9D95B3DF,
	    0x650A7354, 0x8BAF63DE, 0x766A0ABB, 0x3C77B2A8,
	    0x81C2C92E, 0x47EDAEE6, 0x92722C85, 0x1482353B,
	    0xA2BFE8A1, 0x4CF10364, 0xA81A664B, 0xBC423001,
	    0xC24B8B70, 0xD0F89791, 0xC76C51A3, 0x0654BE30,
	    0xD192E819, 0xD6EF5218, 0xD6990624, 0x5565A910,
	    0xF40E3585, 0x5771202A, 0x106AA070, 0x32BBD1B8,
	    0x19A4C116, 0xB8D2D0C8, 0x1E376C08, 0x5141AB53,
	    0x2748774C, 0xDF8EEB99, 0x34B0BCB5, 0xE19B48A8,
	    0x391C0CB3, 0xC5C95A63, 0x4ED8AA4A, 0xE3418ACB,
	    0x5B9CCA4F, 0x7763E373, 0x682E6FF3, 0xD6B2B8A3,
	    0x748F82EE, 0x5DEFB2FC, 0x78A5636F, 0x43172F60,
	    0x84C87814, 0xA1F0AB72, 0x8CC70208, 0x1A6439EC,
	    0x90BEFFFA, 0x23631E28, 0xA4506CEB, 0xDE82BDE9,
	    0xBEF9A3F7, 0xB2C67915, 0xC67178F2, 0xE372532B,
	    0xCA273ECE, 0xEA26619C, 0xD186B8C7, 0x21C0C207,
	    0xEADA7DD6, 0xCDE0EB1E, 0xF57D4F7F, 0xEE6ED178,
	    0x06F067AA, 0x72176FBA, 0x0A637DC5, 0xA2C898A6,
	    0x113F9804, 0xBEF90DAE, 0x1B710B35, 0x131C471B,
	    0x28DB77F5, 0x23047D84, 0x32CAAB7B, 0x40C72493,
	    0x3C9EBE0A, 0x15C9BEBC, 0x431D67C4, 0x9C100D4C,
	    0x4CC5D4BE, 0xCB3E42B6, 0x597F299C, 0xFC657E2A,
	    0x5FCB6FAB, 0x3AD6FAEC, 0x6C44198C, 0x4A475817
	  ];

	  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

	  var blocks = [];

	  if (root.JS_SHA512_NO_NODE_JS || !Array.isArray) {
	    Array.isArray = function (obj) {
	      return Object.prototype.toString.call(obj) === '[object Array]';
	    };
	  }

	  if (ARRAY_BUFFER && (root.JS_SHA512_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
	    ArrayBuffer.isView = function (obj) {
	      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
	    };
	  }

	  var createOutputMethod = function (outputType, bits) {
	    return function (message) {
	      return new Sha512(bits, true).update(message)[outputType]();
	    };
	  };

	  var createMethod = function (bits) {
	    var method = createOutputMethod('hex', bits);
	    method.create = function () {
	      return new Sha512(bits);
	    };
	    method.update = function (message) {
	      return method.create().update(message);
	    };
	    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
	      var type = OUTPUT_TYPES[i];
	      method[type] = createOutputMethod(type, bits);
	    }
	    return method;
	  };

	  var createHmacOutputMethod = function (outputType, bits) {
	    return function (key, message) {
	      return new HmacSha512(key, bits, true).update(message)[outputType]();
	    };
	  };

	  var createHmacMethod = function (bits) {
	    var method = createHmacOutputMethod('hex', bits);
	    method.create = function (key) {
	      return new HmacSha512(key, bits);
	    };
	    method.update = function (key, message) {
	      return method.create(key).update(message);
	    };
	    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
	      var type = OUTPUT_TYPES[i];
	      method[type] = createHmacOutputMethod(type, bits);
	    }
	    return method;
	  };

	  function Sha512(bits, sharedMemory) {
	    if (sharedMemory) {
	      blocks[0] = blocks[1] = blocks[2] = blocks[3] = blocks[4] =
	      blocks[5] = blocks[6] = blocks[7] = blocks[8] =
	      blocks[9] = blocks[10] = blocks[11] = blocks[12] =
	      blocks[13] = blocks[14] = blocks[15] = blocks[16] =
	      blocks[17] = blocks[18] = blocks[19] = blocks[20] =
	      blocks[21] = blocks[22] = blocks[23] = blocks[24] =
	      blocks[25] = blocks[26] = blocks[27] = blocks[28] =
	      blocks[29] = blocks[30] = blocks[31] = blocks[32] = 0;
	      this.blocks = blocks;
	    } else {
	      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	    }

	    if (bits == 384) {
	      this.h0h = 0xCBBB9D5D;
	      this.h0l = 0xC1059ED8;
	      this.h1h = 0x629A292A;
	      this.h1l = 0x367CD507;
	      this.h2h = 0x9159015A;
	      this.h2l = 0x3070DD17;
	      this.h3h = 0x152FECD8;
	      this.h3l = 0xF70E5939;
	      this.h4h = 0x67332667;
	      this.h4l = 0xFFC00B31;
	      this.h5h = 0x8EB44A87;
	      this.h5l = 0x68581511;
	      this.h6h = 0xDB0C2E0D;
	      this.h6l = 0x64F98FA7;
	      this.h7h = 0x47B5481D;
	      this.h7l = 0xBEFA4FA4;
	    } else if (bits == 256) {
	      this.h0h = 0x22312194;
	      this.h0l = 0xFC2BF72C;
	      this.h1h = 0x9F555FA3;
	      this.h1l = 0xC84C64C2;
	      this.h2h = 0x2393B86B;
	      this.h2l = 0x6F53B151;
	      this.h3h = 0x96387719;
	      this.h3l = 0x5940EABD;
	      this.h4h = 0x96283EE2;
	      this.h4l = 0xA88EFFE3;
	      this.h5h = 0xBE5E1E25;
	      this.h5l = 0x53863992;
	      this.h6h = 0x2B0199FC;
	      this.h6l = 0x2C85B8AA;
	      this.h7h = 0x0EB72DDC;
	      this.h7l = 0x81C52CA2;
	    } else if (bits == 224) {
	      this.h0h = 0x8C3D37C8;
	      this.h0l = 0x19544DA2;
	      this.h1h = 0x73E19966;
	      this.h1l = 0x89DCD4D6;
	      this.h2h = 0x1DFAB7AE;
	      this.h2l = 0x32FF9C82;
	      this.h3h = 0x679DD514;
	      this.h3l = 0x582F9FCF;
	      this.h4h = 0x0F6D2B69;
	      this.h4l = 0x7BD44DA8;
	      this.h5h = 0x77E36F73;
	      this.h5l = 0x04C48942;
	      this.h6h = 0x3F9D85A8;
	      this.h6l = 0x6A1D36C8;
	      this.h7h = 0x1112E6AD;
	      this.h7l = 0x91D692A1;
	    } else { // 512
	      this.h0h = 0x6A09E667;
	      this.h0l = 0xF3BCC908;
	      this.h1h = 0xBB67AE85;
	      this.h1l = 0x84CAA73B;
	      this.h2h = 0x3C6EF372;
	      this.h2l = 0xFE94F82B;
	      this.h3h = 0xA54FF53A;
	      this.h3l = 0x5F1D36F1;
	      this.h4h = 0x510E527F;
	      this.h4l = 0xADE682D1;
	      this.h5h = 0x9B05688C;
	      this.h5l = 0x2B3E6C1F;
	      this.h6h = 0x1F83D9AB;
	      this.h6l = 0xFB41BD6B;
	      this.h7h = 0x5BE0CD19;
	      this.h7l = 0x137E2179;
	    }
	    this.bits = bits;

	    this.block = this.start = this.bytes = this.hBytes = 0;
	    this.finalized = this.hashed = false;
	  }

	  Sha512.prototype.update = function (message) {
	    if (this.finalized) {
	      throw new Error(FINALIZE_ERROR);
	    }
	    var notString, type = typeof message;
	    if (type !== 'string') {
	      if (type === 'object') {
	        if (message === null) {
	          throw new Error(INPUT_ERROR);
	        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
	          message = new Uint8Array(message);
	        } else if (!Array.isArray(message)) {
	          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
	            throw new Error(INPUT_ERROR);
	          }
	        }
	      } else {
	        throw new Error(INPUT_ERROR);
	      }
	      notString = true;
	    }
	    var code, index = 0, i, length = message.length, blocks = this.blocks;

	    while (index < length) {
	      if (this.hashed) {
	        this.hashed = false;
	        blocks[0] = this.block;
	        blocks[1] = blocks[2] = blocks[3] = blocks[4] =
	        blocks[5] = blocks[6] = blocks[7] = blocks[8] =
	        blocks[9] = blocks[10] = blocks[11] = blocks[12] =
	        blocks[13] = blocks[14] = blocks[15] = blocks[16] =
	        blocks[17] = blocks[18] = blocks[19] = blocks[20] =
	        blocks[21] = blocks[22] = blocks[23] = blocks[24] =
	        blocks[25] = blocks[26] = blocks[27] = blocks[28] =
	        blocks[29] = blocks[30] = blocks[31] = blocks[32] = 0;
	      }

	      if(notString) {
	        for (i = this.start; index < length && i < 128; ++index) {
	          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
	        }
	      } else {
	        for (i = this.start; index < length && i < 128; ++index) {
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
	      if (i >= 128) {
	        this.block = blocks[32];
	        this.start = i - 128;
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

	  Sha512.prototype.finalize = function () {
	    if (this.finalized) {
	      return;
	    }
	    this.finalized = true;
	    var blocks = this.blocks, i = this.lastByteIndex;
	    blocks[32] = this.block;
	    blocks[i >> 2] |= EXTRA[i & 3];
	    this.block = blocks[32];
	    if (i >= 112) {
	      if (!this.hashed) {
	        this.hash();
	      }
	      blocks[0] = this.block;
	      blocks[1] = blocks[2] = blocks[3] = blocks[4] =
	      blocks[5] = blocks[6] = blocks[7] = blocks[8] =
	      blocks[9] = blocks[10] = blocks[11] = blocks[12] =
	      blocks[13] = blocks[14] = blocks[15] = blocks[16] =
	      blocks[17] = blocks[18] = blocks[19] = blocks[20] =
	      blocks[21] = blocks[22] = blocks[23] = blocks[24] =
	      blocks[25] = blocks[26] = blocks[27] = blocks[28] =
	      blocks[29] = blocks[30] = blocks[31] = blocks[32] = 0;
	    }
	    blocks[30] = this.hBytes << 3 | this.bytes >>> 29;
	    blocks[31] = this.bytes << 3;
	    this.hash();
	  };

	  Sha512.prototype.hash = function () {
	    var h0h = this.h0h, h0l = this.h0l, h1h = this.h1h, h1l = this.h1l,
	      h2h = this.h2h, h2l = this.h2l, h3h = this.h3h, h3l = this.h3l,
	      h4h = this.h4h, h4l = this.h4l, h5h = this.h5h, h5l = this.h5l,
	      h6h = this.h6h, h6l = this.h6l, h7h = this.h7h, h7l = this.h7l,
	      blocks = this.blocks, j, s0h, s0l, s1h, s1l, c1, c2, c3, c4,
	      abh, abl, dah, dal, cdh, cdl, bch, bcl,
	      majh, majl, t1h, t1l, t2h, t2l, chh, chl;

	    for (j = 32; j < 160; j += 2) {
	      t1h = blocks[j - 30];
	      t1l = blocks[j - 29];
	      s0h = ((t1h >>> 1) | (t1l << 31)) ^ ((t1h >>> 8) | (t1l << 24)) ^ (t1h >>> 7);
	      s0l = ((t1l >>> 1) | (t1h << 31)) ^ ((t1l >>> 8) | (t1h << 24)) ^ ((t1l >>> 7) | t1h << 25);

	      t1h = blocks[j - 4];
	      t1l = blocks[j - 3];
	      s1h = ((t1h >>> 19) | (t1l << 13)) ^ ((t1l >>> 29) | (t1h << 3)) ^ (t1h >>> 6);
	      s1l = ((t1l >>> 19) | (t1h << 13)) ^ ((t1h >>> 29) | (t1l << 3)) ^ ((t1l >>> 6) | t1h << 26);

	      t1h = blocks[j - 32];
	      t1l = blocks[j - 31];
	      t2h = blocks[j - 14];
	      t2l = blocks[j - 13];

	      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (s0l & 0xFFFF) + (s1l & 0xFFFF);
	      c2 = (t2l >>> 16) + (t1l >>> 16) + (s0l >>> 16) + (s1l >>> 16) + (c1 >>> 16);
	      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (s0h & 0xFFFF) + (s1h & 0xFFFF) + (c2 >>> 16);
	      c4 = (t2h >>> 16) + (t1h >>> 16) + (s0h >>> 16) + (s1h >>> 16) + (c3 >>> 16);

	      blocks[j] = (c4 << 16) | (c3 & 0xFFFF);
	      blocks[j + 1] = (c2 << 16) | (c1 & 0xFFFF);
	    }

	    var ah = h0h, al = h0l, bh = h1h, bl = h1l, ch = h2h, cl = h2l, dh = h3h, dl = h3l, eh = h4h, el = h4l, fh = h5h, fl = h5l, gh = h6h, gl = h6l, hh = h7h, hl = h7l;
	    bch = bh & ch;
	    bcl = bl & cl;
	    for (j = 0; j < 160; j += 8) {
	      s0h = ((ah >>> 28) | (al << 4)) ^ ((al >>> 2) | (ah << 30)) ^ ((al >>> 7) | (ah << 25));
	      s0l = ((al >>> 28) | (ah << 4)) ^ ((ah >>> 2) | (al << 30)) ^ ((ah >>> 7) | (al << 25));

	      s1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((el >>> 9) | (eh << 23));
	      s1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((eh >>> 9) | (el << 23));

	      abh = ah & bh;
	      abl = al & bl;
	      majh = abh ^ (ah & ch) ^ bch;
	      majl = abl ^ (al & cl) ^ bcl;

	      chh = (eh & fh) ^ (~eh & gh);
	      chl = (el & fl) ^ (~el & gl);

	      t1h = blocks[j];
	      t1l = blocks[j + 1];
	      t2h = K[j];
	      t2l = K[j + 1];

	      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (hl & 0xFFFF);
	      c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (hl >>> 16) + (c1 >>> 16);
	      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (hh & 0xFFFF) + (c2 >>> 16);
	      c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (hh >>> 16) + (c3 >>> 16);

	      t1h = (c4 << 16) | (c3 & 0xFFFF);
	      t1l = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
	      c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
	      c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
	      c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);

	      t2h = (c4 << 16) | (c3 & 0xFFFF);
	      t2l = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (dl & 0xFFFF) + (t1l & 0xFFFF);
	      c2 = (dl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
	      c3 = (dh & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
	      c4 = (dh >>> 16) + (t1h >>> 16) + (c3 >>> 16);

	      hh = (c4 << 16) | (c3 & 0xFFFF);
	      hl = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
	      c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
	      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
	      c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);

	      dh = (c4 << 16) | (c3 & 0xFFFF);
	      dl = (c2 << 16) | (c1 & 0xFFFF);

	      s0h = ((dh >>> 28) | (dl << 4)) ^ ((dl >>> 2) | (dh << 30)) ^ ((dl >>> 7) | (dh << 25));
	      s0l = ((dl >>> 28) | (dh << 4)) ^ ((dh >>> 2) | (dl << 30)) ^ ((dh >>> 7) | (dl << 25));

	      s1h = ((hh >>> 14) | (hl << 18)) ^ ((hh >>> 18) | (hl << 14)) ^ ((hl >>> 9) | (hh << 23));
	      s1l = ((hl >>> 14) | (hh << 18)) ^ ((hl >>> 18) | (hh << 14)) ^ ((hh >>> 9) | (hl << 23));

	      dah = dh & ah;
	      dal = dl & al;
	      majh = dah ^ (dh & bh) ^ abh;
	      majl = dal ^ (dl & bl) ^ abl;

	      chh = (hh & eh) ^ (~hh & fh);
	      chl = (hl & el) ^ (~hl & fl);

	      t1h = blocks[j + 2];
	      t1l = blocks[j + 3];
	      t2h = K[j + 2];
	      t2l = K[j + 3];

	      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (gl & 0xFFFF);
	      c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (gl >>> 16) + (c1 >>> 16);
	      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (gh & 0xFFFF) + (c2 >>> 16);
	      c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (gh >>> 16) + (c3 >>> 16);

	      t1h = (c4 << 16) | (c3 & 0xFFFF);
	      t1l = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
	      c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
	      c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
	      c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);

	      t2h = (c4 << 16) | (c3 & 0xFFFF);
	      t2l = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (cl & 0xFFFF) + (t1l & 0xFFFF);
	      c2 = (cl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
	      c3 = (ch & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
	      c4 = (ch >>> 16) + (t1h >>> 16) + (c3 >>> 16);

	      gh = (c4 << 16) | (c3 & 0xFFFF);
	      gl = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
	      c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
	      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
	      c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);

	      ch = (c4 << 16) | (c3 & 0xFFFF);
	      cl = (c2 << 16) | (c1 & 0xFFFF);

	      s0h = ((ch >>> 28) | (cl << 4)) ^ ((cl >>> 2) | (ch << 30)) ^ ((cl >>> 7) | (ch << 25));
	      s0l = ((cl >>> 28) | (ch << 4)) ^ ((ch >>> 2) | (cl << 30)) ^ ((ch >>> 7) | (cl << 25));

	      s1h = ((gh >>> 14) | (gl << 18)) ^ ((gh >>> 18) | (gl << 14)) ^ ((gl >>> 9) | (gh << 23));
	      s1l = ((gl >>> 14) | (gh << 18)) ^ ((gl >>> 18) | (gh << 14)) ^ ((gh >>> 9) | (gl << 23));

	      cdh = ch & dh;
	      cdl = cl & dl;
	      majh = cdh ^ (ch & ah) ^ dah;
	      majl = cdl ^ (cl & al) ^ dal;

	      chh = (gh & hh) ^ (~gh & eh);
	      chl = (gl & hl) ^ (~gl & el);

	      t1h = blocks[j + 4];
	      t1l = blocks[j + 5];
	      t2h = K[j + 4];
	      t2l = K[j + 5];

	      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (fl & 0xFFFF);
	      c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (fl >>> 16) + (c1 >>> 16);
	      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (fh & 0xFFFF) + (c2 >>> 16);
	      c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (fh >>> 16) + (c3 >>> 16);

	      t1h = (c4 << 16) | (c3 & 0xFFFF);
	      t1l = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
	      c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
	      c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
	      c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);

	      t2h = (c4 << 16) | (c3 & 0xFFFF);
	      t2l = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (bl & 0xFFFF) + (t1l & 0xFFFF);
	      c2 = (bl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
	      c3 = (bh & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
	      c4 = (bh >>> 16) + (t1h >>> 16) + (c3 >>> 16);

	      fh = (c4 << 16) | (c3 & 0xFFFF);
	      fl = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
	      c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
	      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
	      c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);

	      bh = (c4 << 16) | (c3 & 0xFFFF);
	      bl = (c2 << 16) | (c1 & 0xFFFF);

	      s0h = ((bh >>> 28) | (bl << 4)) ^ ((bl >>> 2) | (bh << 30)) ^ ((bl >>> 7) | (bh << 25));
	      s0l = ((bl >>> 28) | (bh << 4)) ^ ((bh >>> 2) | (bl << 30)) ^ ((bh >>> 7) | (bl << 25));

	      s1h = ((fh >>> 14) | (fl << 18)) ^ ((fh >>> 18) | (fl << 14)) ^ ((fl >>> 9) | (fh << 23));
	      s1l = ((fl >>> 14) | (fh << 18)) ^ ((fl >>> 18) | (fh << 14)) ^ ((fh >>> 9) | (fl << 23));

	      bch = bh & ch;
	      bcl = bl & cl;
	      majh = bch ^ (bh & dh) ^ cdh;
	      majl = bcl ^ (bl & dl) ^ cdl;

	      chh = (fh & gh) ^ (~fh & hh);
	      chl = (fl & gl) ^ (~fl & hl);

	      t1h = blocks[j + 6];
	      t1l = blocks[j + 7];
	      t2h = K[j + 6];
	      t2l = K[j + 7];

	      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (el & 0xFFFF);
	      c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (el >>> 16) + (c1 >>> 16);
	      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (eh & 0xFFFF) + (c2 >>> 16);
	      c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (eh >>> 16) + (c3 >>> 16);

	      t1h = (c4 << 16) | (c3 & 0xFFFF);
	      t1l = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
	      c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
	      c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
	      c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);

	      t2h = (c4 << 16) | (c3 & 0xFFFF);
	      t2l = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (al & 0xFFFF) + (t1l & 0xFFFF);
	      c2 = (al >>> 16) + (t1l >>> 16) + (c1 >>> 16);
	      c3 = (ah & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
	      c4 = (ah >>> 16) + (t1h >>> 16) + (c3 >>> 16);

	      eh = (c4 << 16) | (c3 & 0xFFFF);
	      el = (c2 << 16) | (c1 & 0xFFFF);

	      c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
	      c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
	      c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
	      c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);

	      ah = (c4 << 16) | (c3 & 0xFFFF);
	      al = (c2 << 16) | (c1 & 0xFFFF);
	    }

	    c1 = (h0l & 0xFFFF) + (al & 0xFFFF);
	    c2 = (h0l >>> 16) + (al >>> 16) + (c1 >>> 16);
	    c3 = (h0h & 0xFFFF) + (ah & 0xFFFF) + (c2 >>> 16);
	    c4 = (h0h >>> 16) + (ah >>> 16) + (c3 >>> 16);

	    this.h0h = (c4 << 16) | (c3 & 0xFFFF);
	    this.h0l = (c2 << 16) | (c1 & 0xFFFF);

	    c1 = (h1l & 0xFFFF) + (bl & 0xFFFF);
	    c2 = (h1l >>> 16) + (bl >>> 16) + (c1 >>> 16);
	    c3 = (h1h & 0xFFFF) + (bh & 0xFFFF) + (c2 >>> 16);
	    c4 = (h1h >>> 16) + (bh >>> 16) + (c3 >>> 16);

	    this.h1h = (c4 << 16) | (c3 & 0xFFFF);
	    this.h1l = (c2 << 16) | (c1 & 0xFFFF);

	    c1 = (h2l & 0xFFFF) + (cl & 0xFFFF);
	    c2 = (h2l >>> 16) + (cl >>> 16) + (c1 >>> 16);
	    c3 = (h2h & 0xFFFF) + (ch & 0xFFFF) + (c2 >>> 16);
	    c4 = (h2h >>> 16) + (ch >>> 16) + (c3 >>> 16);

	    this.h2h = (c4 << 16) | (c3 & 0xFFFF);
	    this.h2l = (c2 << 16) | (c1 & 0xFFFF);

	    c1 = (h3l & 0xFFFF) + (dl & 0xFFFF);
	    c2 = (h3l >>> 16) + (dl >>> 16) + (c1 >>> 16);
	    c3 = (h3h & 0xFFFF) + (dh & 0xFFFF) + (c2 >>> 16);
	    c4 = (h3h >>> 16) + (dh >>> 16) + (c3 >>> 16);

	    this.h3h = (c4 << 16) | (c3 & 0xFFFF);
	    this.h3l = (c2 << 16) | (c1 & 0xFFFF);

	    c1 = (h4l & 0xFFFF) + (el & 0xFFFF);
	    c2 = (h4l >>> 16) + (el >>> 16) + (c1 >>> 16);
	    c3 = (h4h & 0xFFFF) + (eh & 0xFFFF) + (c2 >>> 16);
	    c4 = (h4h >>> 16) + (eh >>> 16) + (c3 >>> 16);

	    this.h4h = (c4 << 16) | (c3 & 0xFFFF);
	    this.h4l = (c2 << 16) | (c1 & 0xFFFF);

	    c1 = (h5l & 0xFFFF) + (fl & 0xFFFF);
	    c2 = (h5l >>> 16) + (fl >>> 16) + (c1 >>> 16);
	    c3 = (h5h & 0xFFFF) + (fh & 0xFFFF) + (c2 >>> 16);
	    c4 = (h5h >>> 16) + (fh >>> 16) + (c3 >>> 16);

	    this.h5h = (c4 << 16) | (c3 & 0xFFFF);
	    this.h5l = (c2 << 16) | (c1 & 0xFFFF);

	    c1 = (h6l & 0xFFFF) + (gl & 0xFFFF);
	    c2 = (h6l >>> 16) + (gl >>> 16) + (c1 >>> 16);
	    c3 = (h6h & 0xFFFF) + (gh & 0xFFFF) + (c2 >>> 16);
	    c4 = (h6h >>> 16) + (gh >>> 16) + (c3 >>> 16);

	    this.h6h = (c4 << 16) | (c3 & 0xFFFF);
	    this.h6l = (c2 << 16) | (c1 & 0xFFFF);

	    c1 = (h7l & 0xFFFF) + (hl & 0xFFFF);
	    c2 = (h7l >>> 16) + (hl >>> 16) + (c1 >>> 16);
	    c3 = (h7h & 0xFFFF) + (hh & 0xFFFF) + (c2 >>> 16);
	    c4 = (h7h >>> 16) + (hh >>> 16) + (c3 >>> 16);

	    this.h7h = (c4 << 16) | (c3 & 0xFFFF);
	    this.h7l = (c2 << 16) | (c1 & 0xFFFF);
	  };

	  Sha512.prototype.hex = function () {
	    this.finalize();

	    var h0h = this.h0h, h0l = this.h0l, h1h = this.h1h, h1l = this.h1l,
	      h2h = this.h2h, h2l = this.h2l, h3h = this.h3h, h3l = this.h3l,
	      h4h = this.h4h, h4l = this.h4l, h5h = this.h5h, h5l = this.h5l,
	      h6h = this.h6h, h6l = this.h6l, h7h = this.h7h, h7l = this.h7l,
	      bits = this.bits;

	    var hex = HEX_CHARS[(h0h >> 28) & 0x0F] + HEX_CHARS[(h0h >> 24) & 0x0F] +
	      HEX_CHARS[(h0h >> 20) & 0x0F] + HEX_CHARS[(h0h >> 16) & 0x0F] +
	      HEX_CHARS[(h0h >> 12) & 0x0F] + HEX_CHARS[(h0h >> 8) & 0x0F] +
	      HEX_CHARS[(h0h >> 4) & 0x0F] + HEX_CHARS[h0h & 0x0F] +
	      HEX_CHARS[(h0l >> 28) & 0x0F] + HEX_CHARS[(h0l >> 24) & 0x0F] +
	      HEX_CHARS[(h0l >> 20) & 0x0F] + HEX_CHARS[(h0l >> 16) & 0x0F] +
	      HEX_CHARS[(h0l >> 12) & 0x0F] + HEX_CHARS[(h0l >> 8) & 0x0F] +
	      HEX_CHARS[(h0l >> 4) & 0x0F] + HEX_CHARS[h0l & 0x0F] +
	      HEX_CHARS[(h1h >> 28) & 0x0F] + HEX_CHARS[(h1h >> 24) & 0x0F] +
	      HEX_CHARS[(h1h >> 20) & 0x0F] + HEX_CHARS[(h1h >> 16) & 0x0F] +
	      HEX_CHARS[(h1h >> 12) & 0x0F] + HEX_CHARS[(h1h >> 8) & 0x0F] +
	      HEX_CHARS[(h1h >> 4) & 0x0F] + HEX_CHARS[h1h & 0x0F] +
	      HEX_CHARS[(h1l >> 28) & 0x0F] + HEX_CHARS[(h1l >> 24) & 0x0F] +
	      HEX_CHARS[(h1l >> 20) & 0x0F] + HEX_CHARS[(h1l >> 16) & 0x0F] +
	      HEX_CHARS[(h1l >> 12) & 0x0F] + HEX_CHARS[(h1l >> 8) & 0x0F] +
	      HEX_CHARS[(h1l >> 4) & 0x0F] + HEX_CHARS[h1l & 0x0F] +
	      HEX_CHARS[(h2h >> 28) & 0x0F] + HEX_CHARS[(h2h >> 24) & 0x0F] +
	      HEX_CHARS[(h2h >> 20) & 0x0F] + HEX_CHARS[(h2h >> 16) & 0x0F] +
	      HEX_CHARS[(h2h >> 12) & 0x0F] + HEX_CHARS[(h2h >> 8) & 0x0F] +
	      HEX_CHARS[(h2h >> 4) & 0x0F] + HEX_CHARS[h2h & 0x0F] +
	      HEX_CHARS[(h2l >> 28) & 0x0F] + HEX_CHARS[(h2l >> 24) & 0x0F] +
	      HEX_CHARS[(h2l >> 20) & 0x0F] + HEX_CHARS[(h2l >> 16) & 0x0F] +
	      HEX_CHARS[(h2l >> 12) & 0x0F] + HEX_CHARS[(h2l >> 8) & 0x0F] +
	      HEX_CHARS[(h2l >> 4) & 0x0F] + HEX_CHARS[h2l & 0x0F] +
	      HEX_CHARS[(h3h >> 28) & 0x0F] + HEX_CHARS[(h3h >> 24) & 0x0F] +
	      HEX_CHARS[(h3h >> 20) & 0x0F] + HEX_CHARS[(h3h >> 16) & 0x0F] +
	      HEX_CHARS[(h3h >> 12) & 0x0F] + HEX_CHARS[(h3h >> 8) & 0x0F] +
	      HEX_CHARS[(h3h >> 4) & 0x0F] + HEX_CHARS[h3h & 0x0F];
	    if (bits >= 256) {
	      hex += HEX_CHARS[(h3l >> 28) & 0x0F] + HEX_CHARS[(h3l >> 24) & 0x0F] +
	        HEX_CHARS[(h3l >> 20) & 0x0F] + HEX_CHARS[(h3l >> 16) & 0x0F] +
	        HEX_CHARS[(h3l >> 12) & 0x0F] + HEX_CHARS[(h3l >> 8) & 0x0F] +
	        HEX_CHARS[(h3l >> 4) & 0x0F] + HEX_CHARS[h3l & 0x0F];
	    }
	    if (bits >= 384) {
	      hex += HEX_CHARS[(h4h >> 28) & 0x0F] + HEX_CHARS[(h4h >> 24) & 0x0F] +
	        HEX_CHARS[(h4h >> 20) & 0x0F] + HEX_CHARS[(h4h >> 16) & 0x0F] +
	        HEX_CHARS[(h4h >> 12) & 0x0F] + HEX_CHARS[(h4h >> 8) & 0x0F] +
	        HEX_CHARS[(h4h >> 4) & 0x0F] + HEX_CHARS[h4h & 0x0F] +
	        HEX_CHARS[(h4l >> 28) & 0x0F] + HEX_CHARS[(h4l >> 24) & 0x0F] +
	        HEX_CHARS[(h4l >> 20) & 0x0F] + HEX_CHARS[(h4l >> 16) & 0x0F] +
	        HEX_CHARS[(h4l >> 12) & 0x0F] + HEX_CHARS[(h4l >> 8) & 0x0F] +
	        HEX_CHARS[(h4l >> 4) & 0x0F] + HEX_CHARS[h4l & 0x0F] +
	        HEX_CHARS[(h5h >> 28) & 0x0F] + HEX_CHARS[(h5h >> 24) & 0x0F] +
	        HEX_CHARS[(h5h >> 20) & 0x0F] + HEX_CHARS[(h5h >> 16) & 0x0F] +
	        HEX_CHARS[(h5h >> 12) & 0x0F] + HEX_CHARS[(h5h >> 8) & 0x0F] +
	        HEX_CHARS[(h5h >> 4) & 0x0F] + HEX_CHARS[h5h & 0x0F] +
	        HEX_CHARS[(h5l >> 28) & 0x0F] + HEX_CHARS[(h5l >> 24) & 0x0F] +
	        HEX_CHARS[(h5l >> 20) & 0x0F] + HEX_CHARS[(h5l >> 16) & 0x0F] +
	        HEX_CHARS[(h5l >> 12) & 0x0F] + HEX_CHARS[(h5l >> 8) & 0x0F] +
	        HEX_CHARS[(h5l >> 4) & 0x0F] + HEX_CHARS[h5l & 0x0F];
	    }
	    if (bits == 512) {
	      hex += HEX_CHARS[(h6h >> 28) & 0x0F] + HEX_CHARS[(h6h >> 24) & 0x0F] +
	        HEX_CHARS[(h6h >> 20) & 0x0F] + HEX_CHARS[(h6h >> 16) & 0x0F] +
	        HEX_CHARS[(h6h >> 12) & 0x0F] + HEX_CHARS[(h6h >> 8) & 0x0F] +
	        HEX_CHARS[(h6h >> 4) & 0x0F] + HEX_CHARS[h6h & 0x0F] +
	        HEX_CHARS[(h6l >> 28) & 0x0F] + HEX_CHARS[(h6l >> 24) & 0x0F] +
	        HEX_CHARS[(h6l >> 20) & 0x0F] + HEX_CHARS[(h6l >> 16) & 0x0F] +
	        HEX_CHARS[(h6l >> 12) & 0x0F] + HEX_CHARS[(h6l >> 8) & 0x0F] +
	        HEX_CHARS[(h6l >> 4) & 0x0F] + HEX_CHARS[h6l & 0x0F] +
	        HEX_CHARS[(h7h >> 28) & 0x0F] + HEX_CHARS[(h7h >> 24) & 0x0F] +
	        HEX_CHARS[(h7h >> 20) & 0x0F] + HEX_CHARS[(h7h >> 16) & 0x0F] +
	        HEX_CHARS[(h7h >> 12) & 0x0F] + HEX_CHARS[(h7h >> 8) & 0x0F] +
	        HEX_CHARS[(h7h >> 4) & 0x0F] + HEX_CHARS[h7h & 0x0F] +
	        HEX_CHARS[(h7l >> 28) & 0x0F] + HEX_CHARS[(h7l >> 24) & 0x0F] +
	        HEX_CHARS[(h7l >> 20) & 0x0F] + HEX_CHARS[(h7l >> 16) & 0x0F] +
	        HEX_CHARS[(h7l >> 12) & 0x0F] + HEX_CHARS[(h7l >> 8) & 0x0F] +
	        HEX_CHARS[(h7l >> 4) & 0x0F] + HEX_CHARS[h7l & 0x0F];
	    }
	    return hex;
	  };

	  Sha512.prototype.toString = Sha512.prototype.hex;

	  Sha512.prototype.digest = function () {
	    this.finalize();

	    var h0h = this.h0h, h0l = this.h0l, h1h = this.h1h, h1l = this.h1l,
	      h2h = this.h2h, h2l = this.h2l, h3h = this.h3h, h3l = this.h3l,
	      h4h = this.h4h, h4l = this.h4l, h5h = this.h5h, h5l = this.h5l,
	      h6h = this.h6h, h6l = this.h6l, h7h = this.h7h, h7l = this.h7l,
	      bits = this.bits;

	    var arr = [
	      (h0h >> 24) & 0xFF, (h0h >> 16) & 0xFF, (h0h >> 8) & 0xFF, h0h & 0xFF,
	      (h0l >> 24) & 0xFF, (h0l >> 16) & 0xFF, (h0l >> 8) & 0xFF, h0l & 0xFF,
	      (h1h >> 24) & 0xFF, (h1h >> 16) & 0xFF, (h1h >> 8) & 0xFF, h1h & 0xFF,
	      (h1l >> 24) & 0xFF, (h1l >> 16) & 0xFF, (h1l >> 8) & 0xFF, h1l & 0xFF,
	      (h2h >> 24) & 0xFF, (h2h >> 16) & 0xFF, (h2h >> 8) & 0xFF, h2h & 0xFF,
	      (h2l >> 24) & 0xFF, (h2l >> 16) & 0xFF, (h2l >> 8) & 0xFF, h2l & 0xFF,
	      (h3h >> 24) & 0xFF, (h3h >> 16) & 0xFF, (h3h >> 8) & 0xFF, h3h & 0xFF
	    ];

	    if (bits >= 256) {
	      arr.push((h3l >> 24) & 0xFF, (h3l >> 16) & 0xFF, (h3l >> 8) & 0xFF, h3l & 0xFF);
	    }
	    if (bits >= 384) {
	      arr.push(
	        (h4h >> 24) & 0xFF, (h4h >> 16) & 0xFF, (h4h >> 8) & 0xFF, h4h & 0xFF,
	        (h4l >> 24) & 0xFF, (h4l >> 16) & 0xFF, (h4l >> 8) & 0xFF, h4l & 0xFF,
	        (h5h >> 24) & 0xFF, (h5h >> 16) & 0xFF, (h5h >> 8) & 0xFF, h5h & 0xFF,
	        (h5l >> 24) & 0xFF, (h5l >> 16) & 0xFF, (h5l >> 8) & 0xFF, h5l & 0xFF
	      );
	    }
	    if (bits == 512) {
	      arr.push(
	        (h6h >> 24) & 0xFF, (h6h >> 16) & 0xFF, (h6h >> 8) & 0xFF, h6h & 0xFF,
	        (h6l >> 24) & 0xFF, (h6l >> 16) & 0xFF, (h6l >> 8) & 0xFF, h6l & 0xFF,
	        (h7h >> 24) & 0xFF, (h7h >> 16) & 0xFF, (h7h >> 8) & 0xFF, h7h & 0xFF,
	        (h7l >> 24) & 0xFF, (h7l >> 16) & 0xFF, (h7l >> 8) & 0xFF, h7l & 0xFF
	      );
	    }
	    return arr;
	  };

	  Sha512.prototype.array = Sha512.prototype.digest;

	  Sha512.prototype.arrayBuffer = function () {
	    this.finalize();

	    var bits = this.bits;
	    var buffer = new ArrayBuffer(bits / 8);
	    var dataView = new DataView(buffer);
	    dataView.setUint32(0, this.h0h);
	    dataView.setUint32(4, this.h0l);
	    dataView.setUint32(8, this.h1h);
	    dataView.setUint32(12, this.h1l);
	    dataView.setUint32(16, this.h2h);
	    dataView.setUint32(20, this.h2l);
	    dataView.setUint32(24, this.h3h);

	    if (bits >= 256) {
	      dataView.setUint32(28, this.h3l);
	    }
	    if (bits >= 384) {
	      dataView.setUint32(32, this.h4h);
	      dataView.setUint32(36, this.h4l);
	      dataView.setUint32(40, this.h5h);
	      dataView.setUint32(44, this.h5l);
	    }
	    if (bits == 512) {
	      dataView.setUint32(48, this.h6h);
	      dataView.setUint32(52, this.h6l);
	      dataView.setUint32(56, this.h7h);
	      dataView.setUint32(60, this.h7l);
	    }
	    return buffer;
	  };

	  Sha512.prototype.clone = function () {
	    var hash = new Sha512(this.bits, false);
	    this.copyTo(hash);
	    return hash;
	  };

	  Sha512.prototype.copyTo = function (hash) {
	    var i = 0, attrs = [
	      'h0h', 'h0l', 'h1h', 'h1l', 'h2h', 'h2l', 'h3h', 'h3l', 'h4h', 'h4l', 'h5h', 'h5l', 'h6h', 'h6l', 'h7h', 'h7l',
	      'start', 'bytes', 'hBytes', 'finalized', 'hashed', 'lastByteIndex'
	    ];
	    for (i = 0; i < attrs.length; ++i) {
	      hash[attrs[i]] = this[attrs[i]];
	    }
	    for (i = 0; i < this.blocks.length; ++i) {
	      hash.blocks[i] = this.blocks[i];
	    }
	  };

	  function HmacSha512(key, bits, sharedMemory) {
	    var notString, type = typeof key;
	    if (type !== 'string') {
	      if (type === 'object') {
	        if (key === null) {
	          throw new Error(INPUT_ERROR);
	        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
	          key = new Uint8Array(key);
	        } else if (!Array.isArray(key)) {
	          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
	            throw new Error(INPUT_ERROR);
	          }
	        }
	      } else {
	        throw new Error(INPUT_ERROR);
	      }
	      notString = true;
	    }
	    var length = key.length;
	    if (!notString) {
	      var bytes = [], length = key.length, index = 0, code;
	      for (var i = 0; i < length; ++i) {
	        code = key.charCodeAt(i);
	        if (code < 0x80) {
	          bytes[index++] = code;
	        } else if (code < 0x800) {
	          bytes[index++] = (0xc0 | (code >> 6));
	          bytes[index++] = (0x80 | (code & 0x3f));
	        } else if (code < 0xd800 || code >= 0xe000) {
	          bytes[index++] = (0xe0 | (code >> 12));
	          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
	          bytes[index++] = (0x80 | (code & 0x3f));
	        } else {
	          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
	          bytes[index++] = (0xf0 | (code >> 18));
	          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
	          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
	          bytes[index++] = (0x80 | (code & 0x3f));
	        }
	      }
	      key = bytes;
	    }

	    if (key.length > 128) {
	      key = (new Sha512(bits, true)).update(key).array();
	    }

	    var oKeyPad = [], iKeyPad = [];
	    for (var i = 0; i < 128; ++i) {
	      var b = key[i] || 0;
	      oKeyPad[i] = 0x5c ^ b;
	      iKeyPad[i] = 0x36 ^ b;
	    }

	    Sha512.call(this, bits, sharedMemory);

	    this.update(iKeyPad);
	    this.oKeyPad = oKeyPad;
	    this.inner = true;
	    this.sharedMemory = sharedMemory;
	  }
	  HmacSha512.prototype = new Sha512();

	  HmacSha512.prototype.finalize = function () {
	    Sha512.prototype.finalize.call(this);
	    if (this.inner) {
	      this.inner = false;
	      var innerHash = this.array();
	      Sha512.call(this, this.bits, this.sharedMemory);
	      this.update(this.oKeyPad);
	      this.update(innerHash);
	      Sha512.prototype.finalize.call(this);
	    }
	  };

	  HmacSha512.prototype.clone = function () {
	    var hash = new HmacSha512([], this.bits, false);
	    this.copyTo(hash);
	    hash.inner = this.inner;
	    for (var i = 0; i < this.oKeyPad.length; ++i) {
	      hash.oKeyPad[i] = this.oKeyPad[i];
	    }
	    return hash;
	  };

	  var exports = createMethod(512);
	  exports.sha512 = exports;
	  exports.sha384 = createMethod(384);
	  exports.sha512_256 = createMethod(256);
	  exports.sha512_224 = createMethod(224);
	  exports.sha512.hmac = createHmacMethod(512);
	  exports.sha384.hmac = createHmacMethod(384);
	  exports.sha512_256.hmac = createHmacMethod(256);
	  exports.sha512_224.hmac = createHmacMethod(224);

	  if (COMMON_JS) {
	    module.exports = exports;
	  } else {
	    root.sha512 = exports.sha512;
	    root.sha384 = exports.sha384;
	    root.sha512_256 = exports.sha512_256;
	    root.sha512_224 = exports.sha512_224;
	  }
	})();
	});

	var payuApi = createCommonjsModule(function (module, exports) {

	  exports.__esModule = true;
	  exports.PayU = void 0;
	  var PayU;

	  (function (PayU) {
	    var PayUResponse = function () {
	      function PayUResponse() {
	        this.errorCode = "";
	        this.statusCode = "";
	      }

	      return PayUResponse;
	    }();

	    PayU.PayUResponse = PayUResponse;

	    function payuParseResp(response) {
	      var preRegex = new RegExp('^<pre>(.*?)<\/pre>$', 'ims');
	      var match = preRegex.exec(response);
	      var resp = {};

	      if (match && match.length == 2) {
	        var text = match[1];

	        if (!text.startsWith('Array')) {
	          resp['ErrorCode'] = '101';
	          resp['Error'] = text;
	        } else {
	          resp['ErrorCode'] = '0';
	        }
	      } else {
	        resp['ErrorCode'] = '100';
	        resp['Error'] = 'unknown answer';
	      }

	      return resp;
	    }

	    PayU.payuParseResp = payuParseResp;

	    var PayUWrapper = function () {
	      function PayUWrapper(baseUrl, merchantId, salt) {
	        this._endpoint = baseUrl;
	        this._merchantId = merchantId;
	        this._salt = salt;
	      }

	      PayUWrapper.prototype._encodeQueryData = function (data) {
	        var ret = [];

	        for (var key in data) {
	          var value = data[key];
	          ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	        }

	        return ret.join('&');
	      };

	      PayUWrapper.prototype.createInvoice = function (request) {
	        var _this = this;

	        var jsonRequest = JSON.stringify(request);
	        var hashString = this._merchantId + "|create_invoice|" + jsonRequest + "|" + this._salt;
	        var hashRes = sha512.sha512(hashString);
	        var data = {
	          "key": this._merchantId,
	          "command": "create_invoice",
	          "hash": hashRes,
	          "var1": jsonRequest
	        };

	        var requestBody = this._encodeQueryData(data);

	        return new Promise(function (resolve, reject) {
	          var rr = new PayUResponse();
	          rr.transactionId = request.txnid;
	          rr.debugRequest = requestBody;
	          rr.errorCode = "0";
	          var xhr = new XMLHttpRequest();

	          xhr.onreadystatechange = function () {
	            try {
	              if (xhr.readyState !== 4) return;
	              if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status + "; " + xhr.responseText);
	              rr.debugResponse = xhr.responseText;
	              var resp = payuParseResp(xhr.responseText);

	              if (resp['Error']) {
	                rr.errorCode = resp['ErrorCode'];
	                rr.errorDescription = resp['Error'];
	                rr.statusCode = '100';
	              } else {
	                rr.transactionId = resp['Transaction Id'];
	                rr.url = resp['URL'];
	                rr.email = resp['Email Id'];
	              }

	              resolve(rr);
	            } catch (e) {
	              rr.errorCode = "-1";
	              rr.errorDescription = e.message;
	              reject(rr);
	            }
	          };

	          xhr.open("POST", _this._endpoint);
	          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	          xhr.send(requestBody);
	        });
	      };

	      return PayUWrapper;
	    }();

	    PayU.PayUWrapper = PayUWrapper;
	  })(PayU = exports.PayU || (exports.PayU = {}));
	});
	unwrapExports(payuApi);
	var payuApi_1 = payuApi.PayU;

	metadata = {
	  systemName: "PayU API",
	  displayName: "PayU API",
	  description: "PayU integration API",
	  "configuration": {
	    "EndpointUrl": {
	      displayName: "PayU endpoint Url",
	      type: "string",
	      value: "https://test.payu.in/merchant/postservice.php?form=1"
	    },
	    "MerchantId": {
	      displayName: "PayU MerchantId",
	      type: "string",
	      value: "eekig4"
	    },
	    "SALT": {
	      displayName: "PayU Merchant SALT",
	      type: "string",
	      value: "KsnWno3F"
	    },
	    "EMailTemplateId": {
	      displayName: "PayU EMail Template Id",
	      type: "string",
	      value: "1449"
	    },
	    "SMSTemplateId": {
	      displayName: "PayU SMS Template Id",
	      type: "string",
	      value: "1448"
	    },
	    "ValidationPeriod": {
	      displayName: "PayU Validation Period",
	      type: "string",
	      value: "6"
	    },
	    "DoSendSMS": {
	      displayName: "PayU Send SMS on create_invoice",
	      type: "string",
	      value: "1"
	    },
	    "DoSendEmail": {
	      displayName: "PayU Send Email on create_invoice",
	      type: "string",
	      value: "1"
	    }
	  }
	};

	ondescribe = async function ({
	  configuration
	}) {
	  postSchema({
	    objects: {
	      "PayU": {
	        displayName: "PayU payment API",
	        description: "PayU payment API",
	        properties: {
	          "transactionId": {
	            displayName: "transactionId",
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
	          "url": {
	            displayName: "payment url",
	            type: "string"
	          },
	          "email": {
	            displayName: "customer email",
	            type: "string"
	          },
	          "version": {
	            displayName: "version",
	            type: "string"
	          },
	          "timeout": {
	            displayName: "timeout (minutes)",
	            type: "number"
	          }
	        },
	        methods: {
	          "CreateInvoice": {
	            displayName: "Create Invoice",
	            type: "execute",
	            parameters: {
	              "pTransactionId": {
	                displayName: "pTransactionId",
	                description: "Transaction Id",
	                type: "string"
	              },
	              "pProductInfo": {
	                displayName: "pProductInfo",
	                description: "This parameter should contain a brief product description. It should be a string describing the product",
	                type: "string"
	              },
	              "pAmount": {
	                displayName: "pAmount",
	                description: "Transaction amount",
	                type: "string"
	              },
	              "pFirstName": {
	                displayName: "pFirstName",
	                description: "first name of the customer",
	                type: "string"
	              },
	              "pLastName": {
	                displayName: "pLastName",
	                description: "last name of the customer",
	                type: "string"
	              },
	              "pEmail": {
	                displayName: "pEmail",
	                description: "email of the customer",
	                type: "string"
	              },
	              "pPhone": {
	                displayName: "pPhone",
	                description: "The phone number of the customer",
	                type: "string"
	              },
	              "pAddress1": {
	                displayName: "pAddress1",
	                description: "Address line #1",
	                type: "string"
	              },
	              "pCity": {
	                displayName: "pCity",
	                description: "City",
	                type: "string"
	              },
	              "pState": {
	                displayName: "pState",
	                description: "State",
	                type: "string"
	              },
	              "pCountry": {
	                displayName: "pCountry",
	                description: "Country",
	                type: "string"
	              },
	              "pZip": {
	                displayName: "pZip",
	                description: "ZIP Code",
	                type: "string"
	              }
	            },
	            requiredParameters: ["pTransactionId", "pProductInfo", "pAmount", "pFirstName", "pEmail", "pAddress1", "pCity", "pState", "pCountry", "pZip"],
	            outputs: ["transactionId", "statusCode", "statusDescription", "errorCode", "errorDescription", "debugRequest", "debugResponse", "url", "email"]
	          },
	          "GetTransactionId": {
	            displayName: "Generate new transactionId",
	            type: "read",
	            parameters: {
	              "pLeadNumber": {
	                displayName: "pLeadNumber",
	                description: "Lead Number",
	                type: "string"
	              },
	              "pProductType": {
	                displayName: "pProductType",
	                description: "Type of product",
	                type: "string"
	              }
	            },
	            requiredParameters: ["pLeadNumber", "pProductType"],
	            outputs: ["transactionId"]
	          },
	          "GetVersion": {
	            displayName: "Get gateway version",
	            type: "read",
	            outputs: ["version"]
	          },
	          "testRe1": {
	            displayName: "test regexp 1",
	            type: "read",
	            outputs: ["version"]
	          },
	          "testRe2": {
	            displayName: "test regexp 2",
	            type: "read",
	            outputs: ["version"]
	          },
	          "testRe3": {
	            displayName: "test regexp 3",
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
	      case "PayU":
	        await onexecutePayU(methodName, properties, parameters, configuration);
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

	async function onexecutePayU(methodName, properties, parameters, configuration) {
	  switch (methodName) {
	    case "CreateInvoice":
	      await payuCreateInvoice(parameters, configuration);
	      break;

	    case "GetTransactionId":
	      await payuGetTransactionId(parameters);
	      break;

	    case "GetVersion":
	      await payuGetVersion();
	      break;

	    case "testRe1":
	      await testRE1();
	      break;

	    case "testRe2":
	      await testRE2();
	      break;

	    case "testRe3":
	      await testRE3();
	      break;

	    default:
	      throw new Error("The method " + methodName + " is not supported.");
	  }
	}

	function payuCreateInvoice(parameters, configuration) {
	  var endpoint = configuration["EndpointUrl"];
	  var merchantId = configuration["MerchantId"];
	  var salt = configuration["SALT"];
	  let request = {
	    "amount": parameters["pAmount"],
	    "txnid": parameters["pTransactionId"],
	    "productinfo": parameters["pProductInfo"],
	    "firstname": parameters["pFirstName"],
	    "lastname": parameters["pLastName"],
	    "email": parameters["pEmail"],
	    "phone": parameters["pPhone"],
	    "address1": parameters["pAddress1"],
	    "city": parameters["pCity"],
	    "state": parameters["pState"],
	    "country": parameters["pCountry"],
	    "zipcode": parameters["pZip"],
	    "template_id": configuration["EMailTemplateId"],
	    "sms_template_id": configuration["SMSTemplateId"],
	    "validation_period": configuration["ValidationPeriod"],
	    "send_email_now": configuration["DoSendEmail"],
	    "send_sms": configuration["DoSendSMS"]
	  };
	  return new Promise((resolve, reject) => {
	    var wrap = new payuApi_1.PayUWrapper(endpoint, merchantId, salt);
	    wrap.createInvoice(request).then(response => {
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
	      "version": "202011220307"
	    });
	  });
	}

	function payuGetTransactionId(parameters, configuration) {
	  return new Promise((resolve, reject) => {
	    var leadNumber = parameters["pLeadNumber"].toString();
	    var productType = parameters["pProductType"].toString();
	    leadNumber = leadNumber.substr(0, 9).padStart(9, "0");
	    productType = productType.substr(0, 4).padStart(4, "0");
	    var uniqueValue = makeUniqId(20 - 9 - 4);
	    if (parameters["pLeadNumber"].toString() == "test123") uniqueValue = "123456789";
	    var result = `${leadNumber}${productType}${uniqueValue}`;
	    result = result.split('&').join('_');
	    result = result.split(' ').join('_');
	    postResult({
	      "transactionId": result
	    });
	    resolve();
	  });
	}

	function makeUniqId(length) {
	  var result = '';
	  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  var charactersLength = characters.length;

	  for (var i = 0; i < length; i++) {
	    result += characters.charAt(Math.floor(Math.random() * charactersLength));
	  }

	  return result;
	}

	function toK2Result(response) {
	  return {
	    "transactionId": response.transactionId,
	    "statusCode": response.statusCode,
	    "statusDescription": response.statusDescription,
	    "url": response.url,
	    "email": response.email,
	    "errorCode": response.errorCode,
	    "errorDescription": response.errorDescription,
	    "debugRequest": response.debugRequest,
	    "debugResponse": response.debugResponse
	  };
	}

	function testRE1() {
	  var resp3 = `<pre>Array
    (
        [Transaction Id] => test104
        [Email Id] => aleksey.rybakov@gmail.com
        [Phone] => 380672236251
        [Status] => Success
        [URL] => https://test.payu.in/processInvoice?invoiceId=e66333800857d48a36f5127ccc86423c
    )
    </pre>`;
	  const preRegex = new RegExp('^<pre>(.*?)<\/pre>$', 'ims');
	  var match = preRegex.exec(resp3);
	  return new Promise((resolve, reject) => {
	    postResult({
	      "version": match === null || match === void 0 ? void 0 : match.toString()
	    });
	  });
	}

	function testRE2() {
	  var resp3 = `<pre>Array
    (
        [Transaction Id] => test104
        [Email Id] => aleksey.rybakov@gmail.com
        [Phone] => 380672236251
        [Status] => Success
        [URL] => https://test.payu.in/processInvoice?invoiceId=e66333800857d48a36f5127ccc86423c
    )
    </pre>`;
	  const preRegex = new RegExp('^<pre>(.*?)<\/pre>$', 'ims');
	  var match = preRegex.exec(resp3);
	  return new Promise((resolve, reject) => {
	    postResult({
	      "version": match === null || match === void 0 ? void 0 : match.toString()
	    });
	  });
	}

	function testRE3() {
	  var resp3 = `<pre>Array
    (
        [Transaction Id] => test104
        [Email Id] => aleksey.rybakov@gmail.com
        [Phone] => 380672236251
        [Status] => Success
        [URL] => https://test.payu.in/processInvoice?invoiceId=e66333800857d48a36f5127ccc86423c
    )
    </pre>`;
	  let resp = {};
	  resp3.split("\n").forEach(function (line) {
	    let mmm = /\[(.*?)\]\s+=>\s+(.*?)/.exec(line);

	    if (mmm && mmm.length == 3) {
	      resp[mmm[1]] = mmm[2];
	    }
	  });
	  return new Promise((resolve, reject) => {
	    postResult({
	      "version": JSON.stringify(resp)
	    });
	  });
	}

}());
//# sourceMappingURL=index.js.map
