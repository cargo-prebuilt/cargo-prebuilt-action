/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 720:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "MAX", ({
  enumerable: true,
  get: function () {
    return _max.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v1ToV6", ({
  enumerable: true,
  get: function () {
    return _v1ToV.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "v6", ({
  enumerable: true,
  get: function () {
    return _v5.default;
  }
}));
Object.defineProperty(exports, "v6ToV1", ({
  enumerable: true,
  get: function () {
    return _v6ToV.default;
  }
}));
Object.defineProperty(exports, "v7", ({
  enumerable: true,
  get: function () {
    return _v6.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
var _max = _interopRequireDefault(__nccwpck_require__(845));
var _nil = _interopRequireDefault(__nccwpck_require__(874));
var _parse = _interopRequireDefault(__nccwpck_require__(538));
var _stringify = _interopRequireDefault(__nccwpck_require__(446));
var _v = _interopRequireDefault(__nccwpck_require__(777));
var _v1ToV = _interopRequireDefault(__nccwpck_require__(114));
var _v2 = _interopRequireDefault(__nccwpck_require__(166));
var _v3 = _interopRequireDefault(__nccwpck_require__(454));
var _v4 = _interopRequireDefault(__nccwpck_require__(157));
var _v5 = _interopRequireDefault(__nccwpck_require__(616));
var _v6ToV = _interopRequireDefault(__nccwpck_require__(245));
var _v6 = _interopRequireDefault(__nccwpck_require__(594));
var _validate = _interopRequireDefault(__nccwpck_require__(483));
var _version = _interopRequireDefault(__nccwpck_require__(214));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }

/***/ }),

/***/ 845:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

/***/ }),

/***/ 623:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _nodeCrypto = _interopRequireDefault(__nccwpck_require__(5));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }
  return _nodeCrypto.default.createHash('md5').update(bytes).digest();
}
var _default = exports["default"] = md5;

/***/ }),

/***/ 558:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _nodeCrypto = _interopRequireDefault(__nccwpck_require__(5));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports["default"] = {
  randomUUID: _nodeCrypto.default.randomUUID
};

/***/ }),

/***/ 874:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = '00000000-0000-0000-0000-000000000000';

/***/ }),

/***/ 538:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _validate = _interopRequireDefault(__nccwpck_require__(483));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }
  let v;
  const arr = new Uint8Array(16);

  // Parse ########-....-....-....-............
  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff;

  // Parse ........-####-....-....-............
  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff;

  // Parse ........-....-####-....-............
  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff;

  // Parse ........-....-....-####-............
  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff;

  // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}
var _default = exports["default"] = parse;

/***/ }),

/***/ 17:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

/***/ }),

/***/ 100:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;
var _nodeCrypto = _interopRequireDefault(__nccwpck_require__(5));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate
let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _nodeCrypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 198:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _nodeCrypto = _interopRequireDefault(__nccwpck_require__(5));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }
  return _nodeCrypto.default.createHash('sha1').update(bytes).digest();
}
var _default = exports["default"] = sha1;

/***/ }),

/***/ 446:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
exports.unsafeStringify = unsafeStringify;
var _validate = _interopRequireDefault(__nccwpck_require__(483));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  //
  // Note to future-self: No, you can't remove the `toLowerCase()` call.
  // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset);
  // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }
  return uuid;
}
var _default = exports["default"] = stringify;

/***/ }),

/***/ 777:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _rng = _interopRequireDefault(__nccwpck_require__(100));
var _stringify = __nccwpck_require__(446);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

let _nodeId;
let _clockseq;

// Previous uuid creation time
let _lastMSecs = 0;
let _lastNSecs = 0;

// See https://github.com/uuidjs/uuid for API details
function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node;
  let clockseq = options.clockseq;

  // v1 only: Use cached `node` and `clockseq` values
  if (!options._v6) {
    if (!node) {
      node = _nodeId;
    }
    if (clockseq == null) {
      clockseq = _clockseq;
    }
  }

  // Handle cases where we need entropy.  We do this lazily to minimize issues
  // related to insufficient system entropy.  See #189
  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    // Randomize node
    if (node == null) {
      node = [seedBytes[0], seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];

      // v1 only: cache node value for reuse
      if (!_nodeId && !options._v6) {
        // per RFC4122 4.5: Set MAC multicast bit (v1 only)
        node[0] |= 0x01; // Set multicast bit

        _nodeId = node;
      }
    }

    // Randomize clockseq
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
      if (_clockseq === undefined && !options._v6) {
        _clockseq = clockseq;
      }
    }
  }

  // v1 & v6 timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so time is
  // handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  let msecs = options.msecs !== undefined ? options.msecs : Date.now();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }
  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }
  return buf || (0, _stringify.unsafeStringify)(b);
}
var _default = exports["default"] = v1;

/***/ }),

/***/ 114:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = v1ToV6;
var _parse = _interopRequireDefault(__nccwpck_require__(538));
var _stringify = __nccwpck_require__(446);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Convert a v1 UUID to a v6 UUID
 *
 * @param {string|Uint8Array} uuid - The v1 UUID to convert to v6
 * @returns {string|Uint8Array} The v6 UUID as the same type as the `uuid` arg
 * (string or Uint8Array)
 */
function v1ToV6(uuid) {
  const v1Bytes = typeof uuid === 'string' ? (0, _parse.default)(uuid) : uuid;
  const v6Bytes = _v1ToV6(v1Bytes);
  return typeof uuid === 'string' ? (0, _stringify.unsafeStringify)(v6Bytes) : v6Bytes;
}

// Do the field transformation needed for v1 -> v6
function _v1ToV6(v1Bytes, randomize = false) {
  return Uint8Array.of((v1Bytes[6] & 0x0f) << 4 | v1Bytes[7] >> 4 & 0x0f, (v1Bytes[7] & 0x0f) << 4 | (v1Bytes[4] & 0xf0) >> 4, (v1Bytes[4] & 0x0f) << 4 | (v1Bytes[5] & 0xf0) >> 4, (v1Bytes[5] & 0x0f) << 4 | (v1Bytes[0] & 0xf0) >> 4, (v1Bytes[0] & 0x0f) << 4 | (v1Bytes[1] & 0xf0) >> 4, (v1Bytes[1] & 0x0f) << 4 | (v1Bytes[2] & 0xf0) >> 4, 0x60 | v1Bytes[2] & 0x0f, v1Bytes[3], v1Bytes[8], v1Bytes[9], v1Bytes[10], v1Bytes[11], v1Bytes[12], v1Bytes[13], v1Bytes[14], v1Bytes[15]);
}

/***/ }),

/***/ 166:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _v = _interopRequireDefault(__nccwpck_require__(170));
var _md = _interopRequireDefault(__nccwpck_require__(623));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = exports["default"] = v3;

/***/ }),

/***/ 170:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.URL = exports.DNS = void 0;
exports["default"] = v35;
var _stringify = __nccwpck_require__(446);
var _parse = _interopRequireDefault(__nccwpck_require__(538));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];
  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}
const DNS = exports.DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL = exports.URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }
    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }
    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    }

    // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`
    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }
      return buf;
    }
    return (0, _stringify.unsafeStringify)(bytes);
  }

  // Function#name is not settable on some platforms (#270)
  try {
    generateUUID.name = name;
  } catch (err) {}

  // For CommonJS default export support
  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 454:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _native = _interopRequireDefault(__nccwpck_require__(558));
var _rng = _interopRequireDefault(__nccwpck_require__(100));
var _stringify = __nccwpck_require__(446);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function v4(options, buf, offset) {
  if (_native.default.randomUUID && !buf && !options) {
    return _native.default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || _rng.default)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return (0, _stringify.unsafeStringify)(rnds);
}
var _default = exports["default"] = v4;

/***/ }),

/***/ 157:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _v = _interopRequireDefault(__nccwpck_require__(170));
var _sha = _interopRequireDefault(__nccwpck_require__(198));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = exports["default"] = v5;

/***/ }),

/***/ 616:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = v6;
var _stringify = __nccwpck_require__(446);
var _v = _interopRequireDefault(__nccwpck_require__(777));
var _v1ToV = _interopRequireDefault(__nccwpck_require__(114));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 *
 * @param {object} options
 * @param {Uint8Array=} buf
 * @param {number=} offset
 * @returns
 */
function v6(options = {}, buf, offset = 0) {
  // v6 is v1 with different field layout, so we start with a v1 UUID, albeit
  // with slightly different behavior around how the clock_seq and node fields
  // are randomized, which is why we call v1 with _v6: true.
  let bytes = (0, _v.default)({
    ...options,
    _v6: true
  }, new Uint8Array(16));

  // Reorder the fields to v6 layout.
  bytes = (0, _v1ToV.default)(bytes);

  // Return as a byte array if requested
  if (buf) {
    for (let i = 0; i < 16; i++) {
      buf[offset + i] = bytes[i];
    }
    return buf;
  }
  return (0, _stringify.unsafeStringify)(bytes);
}

/***/ }),

/***/ 245:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = v6ToV1;
var _parse = _interopRequireDefault(__nccwpck_require__(538));
var _stringify = __nccwpck_require__(446);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Convert a v6 UUID to a v1 UUID
 *
 * @param {string|Uint8Array} uuid - The v6 UUID to convert to v6
 * @returns {string|Uint8Array} The v1 UUID as the same type as the `uuid` arg
 * (string or Uint8Array)
 */
function v6ToV1(uuid) {
  const v6Bytes = typeof uuid === 'string' ? (0, _parse.default)(uuid) : uuid;
  const v1Bytes = _v6ToV1(v6Bytes);
  return typeof uuid === 'string' ? (0, _stringify.unsafeStringify)(v1Bytes) : v1Bytes;
}

// Do the field transformation needed for v6 -> v1
function _v6ToV1(v6Bytes) {
  return Uint8Array.of((v6Bytes[3] & 0x0f) << 4 | v6Bytes[4] >> 4 & 0x0f, (v6Bytes[4] & 0x0f) << 4 | (v6Bytes[5] & 0xf0) >> 4, (v6Bytes[5] & 0x0f) << 4 | v6Bytes[6] & 0x0f, v6Bytes[7], (v6Bytes[1] & 0x0f) << 4 | (v6Bytes[2] & 0xf0) >> 4, (v6Bytes[2] & 0x0f) << 4 | (v6Bytes[3] & 0xf0) >> 4, 0x10 | (v6Bytes[0] & 0xf0) >> 4, (v6Bytes[0] & 0x0f) << 4 | (v6Bytes[1] & 0xf0) >> 4, v6Bytes[8], v6Bytes[9], v6Bytes[10], v6Bytes[11], v6Bytes[12], v6Bytes[13], v6Bytes[14], v6Bytes[15]);
}

/***/ }),

/***/ 594:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _rng = _interopRequireDefault(__nccwpck_require__(100));
var _stringify = __nccwpck_require__(446);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * UUID V7 - Unix Epoch time-based UUID
 *
 * The IETF has published RFC9562, introducing 3 new UUID versions (6,7,8). This
 * implementation of V7 is based on the accepted, though not yet approved,
 * revisions.
 *
 * RFC 9562:https://www.rfc-editor.org/rfc/rfc9562.html Universally Unique
 * IDentifiers (UUIDs)

 *
 * Sample V7 value:
 * https://www.rfc-editor.org/rfc/rfc9562.html#name-example-of-a-uuidv7-value
 *
 * Monotonic Bit Layout: RFC rfc9562.6.2 Method 1, Dedicated Counter Bits ref:
 *     https://www.rfc-editor.org/rfc/rfc9562.html#section-6.2-5.1
 *
 *   0                   1                   2                   3 0 1 2 3 4 5 6
 *   7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 *  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  |                          unix_ts_ms                           |
 *  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  |          unix_ts_ms           |  ver  |        seq_hi         |
 *  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  |var|               seq_low               |        rand         |
 *  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  |                             rand                              |
 *  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *
 * seq is a 31 bit serialized counter; comprised of 12 bit seq_hi and 19 bit
 * seq_low, and randomly initialized upon timestamp change. 31 bit counter size
 * was selected as any bitwise operations in node are done as _signed_ 32 bit
 * ints. we exclude the sign bit.
 */

let _seqLow = null;
let _seqHigh = null;
let _msecs = 0;
function v7(options, buf, offset) {
  options = options || {};

  // initialize buffer and pointer
  let i = buf && offset || 0;
  const b = buf || new Uint8Array(16);

  // rnds is Uint8Array(16) filled with random bytes
  const rnds = options.random || (options.rng || _rng.default)();

  // milliseconds since unix epoch, 1970-01-01 00:00
  const msecs = options.msecs !== undefined ? options.msecs : Date.now();

  // seq is user provided 31 bit counter
  let seq = options.seq !== undefined ? options.seq : null;

  // initialize local seq high/low parts
  let seqHigh = _seqHigh;
  let seqLow = _seqLow;

  // check if clock has advanced and user has not provided msecs
  if (msecs > _msecs && options.msecs === undefined) {
    _msecs = msecs;

    // unless user provided seq, reset seq parts
    if (seq !== null) {
      seqHigh = null;
      seqLow = null;
    }
  }

  // if we have a user provided seq
  if (seq !== null) {
    // trim provided seq to 31 bits of value, avoiding overflow
    if (seq > 0x7fffffff) {
      seq = 0x7fffffff;
    }

    // split provided seq into high/low parts
    seqHigh = seq >>> 19 & 0xfff;
    seqLow = seq & 0x7ffff;
  }

  // randomly initialize seq
  if (seqHigh === null || seqLow === null) {
    seqHigh = rnds[6] & 0x7f;
    seqHigh = seqHigh << 8 | rnds[7];
    seqLow = rnds[8] & 0x3f; // pad for var
    seqLow = seqLow << 8 | rnds[9];
    seqLow = seqLow << 5 | rnds[10] >>> 3;
  }

  // increment seq if within msecs window
  if (msecs + 10000 > _msecs && seq === null) {
    if (++seqLow > 0x7ffff) {
      seqLow = 0;
      if (++seqHigh > 0xfff) {
        seqHigh = 0;

        // increment internal _msecs. this allows us to continue incrementing
        // while staying monotonic. Note, once we hit 10k milliseconds beyond system
        // clock, we will reset breaking monotonicity (after (2^31)*10000 generations)
        _msecs++;
      }
    }
  } else {
    // resetting; we have advanced more than
    // 10k milliseconds beyond system clock
    _msecs = msecs;
  }
  _seqHigh = seqHigh;
  _seqLow = seqLow;

  // [bytes 0-5] 48 bits of local timestamp
  b[i++] = _msecs / 0x10000000000 & 0xff;
  b[i++] = _msecs / 0x100000000 & 0xff;
  b[i++] = _msecs / 0x1000000 & 0xff;
  b[i++] = _msecs / 0x10000 & 0xff;
  b[i++] = _msecs / 0x100 & 0xff;
  b[i++] = _msecs & 0xff;

  // [byte 6] - set 4 bits of version (7) with first 4 bits seq_hi
  b[i++] = seqHigh >>> 4 & 0x0f | 0x70;

  // [byte 7] remaining 8 bits of seq_hi
  b[i++] = seqHigh & 0xff;

  // [byte 8] - variant (2 bits), first 6 bits seq_low
  b[i++] = seqLow >>> 13 & 0x3f | 0x80;

  // [byte 9] 8 bits seq_low
  b[i++] = seqLow >>> 5 & 0xff;

  // [byte 10] remaining 5 bits seq_low, 3 bits random
  b[i++] = seqLow << 3 & 0xff | rnds[10] & 0x07;

  // [bytes 11-15] always random
  b[i++] = rnds[11];
  b[i++] = rnds[12];
  b[i++] = rnds[13];
  b[i++] = rnds[14];
  b[i++] = rnds[15];
  return buf || (0, _stringify.unsafeStringify)(b);
}
var _default = exports["default"] = v7;

/***/ }),

/***/ 483:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regex = _interopRequireDefault(__nccwpck_require__(17));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}
var _default = exports["default"] = validate;

/***/ }),

/***/ 214:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _validate = _interopRequireDefault(__nccwpck_require__(483));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }
  return parseInt(uuid.slice(14, 15), 16);
}
var _default = exports["default"] = version;

/***/ }),

/***/ 407:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.installQstract = installQstract;
const node_process_1 = __nccwpck_require__(742);
const core = __importStar(__nccwpck_require__(933));
const exec = __importStar(__nccwpck_require__(337));
const vals_1 = __nccwpck_require__(722);
const sha256_1 = __nccwpck_require__(710);
const utils_1 = __nccwpck_require__(442);
const QSTRACT_DL_URL = 'https://github.com/cargo-prebuilt/qstract/releases/download/v0.2.4/';
async function installQstract() {
    let dlFile;
    let dlHash;
    core.info(`Installing qstract to ${vals_1.TMP_DIR}`);
    switch (node_process_1.arch) {
        case 'arm':
            if (node_process_1.platform === 'linux') {
                dlFile = 'armv7-unknown-linux-musleabihf';
                dlHash =
                    '32402ded7f58241eed6d4828b390cf5e1eb36a76cfdfc309a1e60f4b19451f1a';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 'arm64':
            if (node_process_1.platform === 'linux') {
                dlFile = 'aarch64-unknown-linux-musl';
                dlHash =
                    '737e5ce7c575f4f67fadca5da700b71c002206b33a417e787b8a97312538b71d';
            }
            else if (node_process_1.platform === 'darwin') {
                dlFile = 'aarch64-apple-darwin';
                dlHash =
                    '98deb3f9e974feeb4cd71d2043994276870076f2f061480eabf74ed1ce57ef03';
            }
            else if (node_process_1.platform === 'win32') {
                dlFile = 'aarch64-pc-windows-msvc.exe';
                dlHash =
                    '9e6a5c049a54282de979094bb3a115ae3a26af764aa6743af17e1084964a1a39';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 'x64':
            if (node_process_1.platform === 'linux') {
                dlFile = 'x86_64-unknown-linux-musl';
                dlHash =
                    '707502e94f3c06ea2ed926a567f3999f7534e0f6aae4e994b17df657adb48318';
            }
            else if (node_process_1.platform === 'darwin') {
                dlFile = 'x86_64-apple-darwin';
                dlHash =
                    'a3ff3767eb11a0ac54111855b6bbc416921f121ca0e1f4a0ce0c9c97c4c16994';
            }
            else if (node_process_1.platform === 'win32') {
                dlFile = 'x86_64-pc-windows-msvc.exe';
                dlHash =
                    '6badce5c4702ebbe3bcb0e222aeef78ded42639fefbdc83d622adf753a30b359';
            }
            else if (node_process_1.platform === 'freebsd') {
                dlFile = 'x86_64-unknown-freebsd';
                dlHash =
                    'f1ac3af9f0ddb816e8433139621ce4f1fd4f9d312a1ffe6ec7aa93dd396126fc';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 's390x':
            if (node_process_1.platform === 'linux') {
                dlFile = 's390x-unknown-linux-gnu';
                dlHash =
                    'af5b85c77fcf6a8b6c916f2171e1fbd2f69be8192d8b1cc38d95c71758b1bc73';
            }
            else
                core.setFailed('unsupported platform');
            break;
    }
    if (!dlFile)
        core.setFailed('unsupported or missing platform (qstract)');
    let binPath = `${vals_1.TMP_DIR}/qstract`;
    if (node_process_1.platform === 'win32')
        binPath += '.exe';
    core.debug(`qstract: \n    dlFile ${dlFile}\n    dlHash ${dlHash}\n    binPath ${binPath}`);
    await (0, utils_1.downloadFile)(`${QSTRACT_DL_URL}qstract-${dlFile}`, binPath);
    // Check hash
    const hash = await (0, sha256_1.hashFile)(binPath);
    if (hash !== dlHash)
        core.setFailed('sha256 hash does not match for qstract');
    core.debug('Hash matched for qstract');
    if (!binPath.endsWith('.exe')) {
        exec.execGetOutput(`chmod +x ${binPath}`);
        core.debug('Detected unix, trying to set exe bit with chmod');
    }
    // Test run
    exec.execFile(binPath, ['--version']);
    core.info('Installed qstract');
    return binPath;
}


/***/ }),

/***/ 738:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.installRsign2 = installRsign2;
const node_process_1 = __nccwpck_require__(742);
const core = __importStar(__nccwpck_require__(933));
const exec = __importStar(__nccwpck_require__(337));
const vals_1 = __nccwpck_require__(722);
const sha256_1 = __nccwpck_require__(710);
const utils_1 = __nccwpck_require__(442);
const RSIGN_DL_URL = 'https://github.com/cargo-prebuilt/index/releases/download/rsign2-0.6.3/';
async function installRsign2(qstract) {
    let dlFile;
    let dlHash;
    core.info(`Installing rsign2 to ${vals_1.TMP_DIR}`);
    switch (node_process_1.arch) {
        case 'arm':
            if (node_process_1.platform === 'linux') {
                dlFile = 'armv7-unknown-linux-musleabihf';
                dlHash =
                    '2a187ff785d0520ecdd14af4fb0834d0cdb90d41fa42470413ba6f8187e5142b';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 'arm64':
            if (node_process_1.platform === 'linux') {
                dlFile = 'aarch64-unknown-linux-musl';
                dlHash =
                    '18803b59a0c4baa9b3d5c7a26a5e6336df9c5ff04c851944ffafa87e111ae026';
            }
            else if (node_process_1.platform === 'darwin') {
                dlFile = 'aarch64-apple-darwin';
                dlHash =
                    'e5770f96ad51aab5a35e595462283ae521f3fd995158c82f220d28b498802cf0';
            }
            else if (node_process_1.platform === 'win32') {
                dlFile = 'aarch64-pc-windows-msvc';
                dlHash =
                    '07cfee377c07427a95a70dd8a8c81d0c2e376fe5ae848cc294fd9da762b57263';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 'x64':
            if (node_process_1.platform === 'linux') {
                dlFile = 'x86_64-unknown-linux-musl';
                dlHash =
                    'd013658223ba79bd84b2e409ed26f2c533dcb15546071b33eb32b499bade9349';
            }
            else if (node_process_1.platform === 'darwin') {
                dlFile = 'x86_64-apple-darwin';
                dlHash =
                    'cf3a305a760beb7245b564dee4b180198542f63aef2f954e1f9f3f732a7cf6d0';
            }
            else if (node_process_1.platform === 'win32') {
                dlFile = 'x86_64-pc-windows-msvc';
                dlHash =
                    '8e77f7f2f01413cc2ef767fd2adac04ef4972749625dc29a4ee09a014895ee4d';
            }
            else if (node_process_1.platform === 'freebsd') {
                dlFile = 'x86_64-unknown-freebsd';
                dlHash =
                    '4e32038f9acece4996be3671e709b9d188d7e7464c3c13954ee12298244bd884';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 's390x':
            if (node_process_1.platform === 'linux') {
                dlFile = 's390x-unknown-linux-gnu';
                dlHash =
                    '73c4a77aef2bace5a9ea1471348203c26e2c8bb869d587f7376ddff31063b8ad';
            }
            else
                core.setFailed('unsupported platform');
            break;
    }
    if (!dlFile)
        core.setFailed('unsupported or missing platform (rsign2)');
    const tarPath = `${vals_1.TMP_DIR}/rsign.tar.gz`;
    core.debug(`rsign2: \n    dlFile ${dlFile}\n    dlHash ${dlHash}\n    binPath ${tarPath}`);
    await (0, utils_1.downloadFile)(`${RSIGN_DL_URL}${dlFile}.tar.gz`, tarPath);
    // Check tar hash
    const hash = await (0, sha256_1.hashFile)(tarPath);
    if (hash !== dlHash)
        core.setFailed('sha256 hash does not match for rsign2');
    core.debug('Hash matched for rsign');
    // Extract
    core.debug('Extracting rsign');
    exec.execFile(qstract, ['-z', '-C', `${vals_1.TMP_DIR}`, tarPath]);
    let toolPath;
    if (node_process_1.platform === 'win32')
        toolPath = `${vals_1.TMP_DIR}/rsign.exe`;
    else
        toolPath = `${vals_1.TMP_DIR}/rsign`;
    core.debug(`Tool path rsign ${toolPath}`);
    // Check if rsign works
    exec.execFile(toolPath, ['--version']);
    core.info('Installed rsign2');
    return toolPath;
}


/***/ }),

/***/ 356:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = run;
const node_fs_1 = __importDefault(__nccwpck_require__(561));
const node_path_1 = __nccwpck_require__(411);
const core = __importStar(__nccwpck_require__(933));
const exec = __importStar(__nccwpck_require__(337));
const utils_1 = __nccwpck_require__(442);
const vals_1 = __nccwpck_require__(722);
const sha256_1 = __nccwpck_require__(710);
const minisign_1 = __nccwpck_require__(688);
const dl_qstract_1 = __nccwpck_require__(407);
const dl_rsign2_1 = __nccwpck_require__(738);
async function run() {
    try {
        let prebuiltVersion = core.getInput('prebuilt-version');
        let fallbackVersion;
        let prebuiltTarget = core.getInput('prebuilt-target');
        const prebuiltVerify = core.getInput('prebuilt-verify');
        const pkgs = core.getInput('pkgs');
        const target = core.getInput('target');
        const safe = core.getInput('safe');
        const update = core.getInput('update');
        const index = core.getInput('index');
        const pubKey = core.getInput('pub-key');
        const auth = core.getInput('auth');
        const indexKey = core.getInput('index-key');
        const ci = core.getInput('ci');
        const noSig = core.getInput('no-sig');
        const noHash = core.getInput('no-hash');
        const hashBins = core.getInput('hash-bins');
        const path = core.getInput('path');
        const reportPath = core.getInput('report-path');
        const noCreatePath = core.getInput('no-create-path');
        const reports = core.getInput('reports');
        const config = core.getInput('config');
        const requireConfig = core.getInput('require-config');
        const out = core.getInput('out');
        const getLatest = core.getInput('get-latest');
        const color = core.getInput('color');
        if (prebuiltVersion === 'latest') {
            const latest = (0, utils_1.getVersions)();
            prebuiltVersion = latest[latest.length - 1];
            fallbackVersion = latest[latest.length - 2];
            core.info(`Picked cargo-prebuilt version ${prebuiltVersion} with fallback version ${fallbackVersion}`);
        }
        if (prebuiltTarget === 'current') {
            prebuiltTarget = (0, utils_1.currentTarget)();
        }
        core.setOutput('prebuilt-version', prebuiltVersion);
        core.setOutput('prebuilt-target', prebuiltTarget);
        // Install qstract
        const qstract = await (0, dl_qstract_1.installQstract)();
        // Install rsign2
        let rsignLet = '';
        if (prebuiltVerify === 'minisign') {
            core.debug('Verify method is minisign, downloading rsign2');
            rsignLet = await (0, dl_rsign2_1.installRsign2)(qstract);
        }
        const rsign = rsignLet;
        // Install cargo-prebuilt
        const fileEnding = prebuiltTarget.includes('windows-msvc')
            ? '.zip'
            : '.tar.gz';
        // Download
        const prebuiltPath = `${vals_1.TMP_DIR}/${prebuiltTarget}${fileEnding}`;
        const dl1 = await (0, utils_1.downloadFileWithErr)(`${vals_1.DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`, prebuiltPath);
        if (!dl1) {
            core.warning('Failed to install latest version using fallback version');
            if (fallbackVersion)
                prebuiltVersion = fallbackVersion;
            const dl2 = await (0, utils_1.downloadFileWithErr)(`${vals_1.DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`, prebuiltPath);
            if (!dl2)
                core.setFailed('Could not install cargo-prebuilt from fallback');
        }
        // Verify
        if (prebuiltVerify === 'sha256') {
            await (0, sha256_1.verifyFileHash)(prebuiltVersion, prebuiltPath);
            core.info('Verified downloaded archive with sha256 hash');
        }
        else if (prebuiltVerify === 'minisign') {
            await (0, minisign_1.verifyFileMinisign)(prebuiltVersion, `${prebuiltTarget}${fileEnding}`, prebuiltPath, rsign);
            core.info('Verified downloaded archive with minisign');
        }
        // eslint-disable-next-line no-empty
        else if (prebuiltVerify === 'none') {
        }
        else
            core.setFailed('invalid prebuilt-verify type');
        // Extract
        core.debug(`Extracting ${prebuiltPath}`);
        if (prebuiltTarget.includes('windows-msvc'))
            exec.execFile(qstract, ['--zip', '-C', vals_1.TMP_DIR, prebuiltPath]);
        else
            exec.execFile(qstract, ['-z', '-C', vals_1.TMP_DIR, prebuiltPath]);
        let tmpBin = `${vals_1.TMP_DIR}${node_path_1.sep}cargo-prebuilt`;
        let finalBin = `${vals_1.INSTALL_DIR}${node_path_1.sep}cargo-prebuilt`;
        if (prebuiltTarget.includes('windows-msvc')) {
            tmpBin += '.exe';
            finalBin += '.exe';
        }
        exec.execGetOutput(`mv ${tmpBin} ${finalBin}`);
        core.addPath(vals_1.INSTALL_DIR);
        core.info(`Installed cargo-prebuilt@${prebuiltVersion} at ${finalBin}`);
        core.setOutput('prebuilt-binary', finalBin);
        // Install prebuilt crates if needed
        if (pkgs !== '') {
            const args = [];
            if (safe === 'true')
                args.push('--safe');
            if (update === 'true')
                args.push('--update');
            if (ci === 'true')
                args.push('--ci');
            if (noSig === 'true')
                args.push('--no-sig');
            if (noHash === 'true')
                args.push('--no-hash');
            if (hashBins === 'true')
                args.push('--hash-bins');
            if (noCreatePath === 'true')
                args.push('--no-create-path');
            if (requireConfig === 'true')
                args.push('--require-config');
            if (out === 'true')
                args.push('--out');
            if (getLatest === 'true')
                args.push('--get-latest');
            if (color === 'true')
                args.push('--color');
            if (color === 'false')
                args.push('--no-color');
            if (target !== '') {
                args.push('--target');
                args.push(target);
            }
            if (index !== '') {
                args.push('--index');
                args.push(index);
            }
            if (pubKey !== '') {
                args.push('--pub-key');
                args.push(pubKey);
            }
            if (auth !== '') {
                args.push('--auth');
                args.push(auth);
            }
            if (indexKey !== '') {
                args.push('--index-key');
                args.push(indexKey);
            }
            if (path !== '') {
                args.push('--path');
                args.push(path);
            }
            if (reportPath !== '') {
                args.push('--reportPath');
                args.push(reportPath);
            }
            if (reports !== '') {
                args.push('--reports');
                args.push(reports);
            }
            if (config !== '') {
                args.push('--config');
                args.push(config);
            }
            args.push(pkgs);
            const output = exec.execFile(finalBin, args);
            core.setOutput('out', output);
            if (path !== '')
                core.addPath(path);
            core.info(`Installed tools ${pkgs}`);
        }
        core.debug(`Cleaning up tmp dir ${vals_1.TMP_DIR}`);
        node_fs_1.default.rm(vals_1.TMP_DIR, { recursive: true, force: true }, err => {
            if (err)
                core.error(err.message);
        });
        process.exit(0);
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}


/***/ }),

/***/ 688:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.verifyFileMinisign = verifyFileMinisign;
const node_path_1 = __importDefault(__nccwpck_require__(411));
const exec = __importStar(__nccwpck_require__(337));
const vals_1 = __nccwpck_require__(722);
const utils_1 = __nccwpck_require__(442);
async function verifyFileMinisign(version, fileName, filePath, rsign2) {
    const archivePath = node_path_1.default.dirname(filePath);
    const minisignFilePath = `${archivePath}/${fileName}.minisig`;
    await (0, utils_1.downloadFile)(`${vals_1.DL_URL}${version}/${fileName}.minisig`, minisignFilePath);
    exec.execFile(rsign2, [
        'verify',
        `${filePath}`,
        '-P',
        `${vals_1.PREBUILT_INDEX_PUB_KEY}`,
        '-x',
        `${minisignFilePath}`
    ]);
}


/***/ }),

/***/ 710:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.verifyFileHash = verifyFileHash;
exports.hashFile = hashFile;
const node_fs_1 = __nccwpck_require__(561);
const node_crypto_1 = __nccwpck_require__(5);
const vals_1 = __nccwpck_require__(722);
// TODO: Use sha256 from qstract?
async function verifyFileHash(version, filePath) {
    const res = await fetch(`${vals_1.DL_URL}${version}/hashes.sha256`);
    const sha256File = (await res.text()).trim();
    const fileHash = await hashFile(filePath);
    // This is probably fine, but maybe this should be change later
    if (!sha256File.includes(fileHash))
        throw new Error('sha256 hash does not match');
}
async function hashFile(filePath) {
    return new Promise(resolve => {
        const fd = (0, node_fs_1.readFileSync)(filePath);
        const hash = (0, node_crypto_1.createHash)('sha256').update(fd).digest('hex');
        resolve(hash);
    });
}


/***/ }),

/***/ 933:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


/*
 * The MIT License (MIT)
 *
 * Copyright 2019 GitHub
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInput = getInput;
exports.setOutput = setOutput;
exports.info = info;
exports.warning = warning;
exports.error = error;
exports.debug = debug;
exports.setFailed = setFailed;
exports.addPath = addPath;
const node_process_1 = __importDefault(__nccwpck_require__(742));
const node_os_1 = __importDefault(__nccwpck_require__(612));
const node_fs_1 = __importDefault(__nccwpck_require__(561));
const node_path_1 = __importDefault(__nccwpck_require__(411));
const uuid_1 = __nccwpck_require__(720);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode || (ExitCode = {}));
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = node_process_1.default.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
function setOutput(name, value) {
    const filePath = node_process_1.default.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return issueFileCommand('OUTPUT', prepareKeyValueMessage(name, value));
    }
    node_process_1.default.stdout.write(node_os_1.default.EOL);
    issueCommand('set-output', { name }, toCommandValue(value));
}
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    node_process_1.default.stdout.write(message + node_os_1.default.EOL);
}
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    issueCommand('warning', toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    issueCommand('error', toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    issueCommand('debug', {}, message);
}
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    node_process_1.default.exitCode = ExitCode.Failure;
    error(message);
}
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = node_process_1.default.env['GITHUB_PATH'] || '';
    if (filePath) {
        issueFileCommand('PATH', inputPath);
    }
    else {
        issueCommand('add-path', {}, inputPath);
    }
    node_process_1.default.env['PATH'] = `${inputPath}${node_path_1.default.delimiter}${node_process_1.default.env['PATH']}`;
}
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
function issueFileCommand(command, message) {
    const filePath = node_process_1.default.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!node_fs_1.default.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    node_fs_1.default.appendFileSync(filePath, `${toCommandValue(message)}${node_os_1.default.EOL}`, {
        encoding: 'utf8'
    });
}
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${(0, uuid_1.v4)()}`;
    const convertedValue = toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${node_os_1.default.EOL}${convertedValue}${node_os_1.default.EOL}${delimiter}`;
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    node_process_1.default.stdout.write(cmd.toString() + node_os_1.default.EOL);
}
const CMD_STRING = '::';
class Command {
    command;
    message;
    properties;
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}


/***/ }),

/***/ 337:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.execFile = execFile;
exports.execGetOutput = execGetOutput;
const node_child_process_1 = __nccwpck_require__(718);
function execFile(file, args, options) {
    if (!options)
        options = { encoding: 'utf8' };
    else
        options.encoding = 'utf8';
    return (0, node_child_process_1.execFileSync)(file, args, options);
}
function execGetOutput(command) {
    return (0, node_child_process_1.execSync)(command, {
        encoding: 'utf8'
    });
}


/***/ }),

/***/ 442:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getVersions = getVersions;
exports.currentTarget = currentTarget;
exports.downloadFile = downloadFile;
exports.downloadFileWithErr = downloadFileWithErr;
const node_process_1 = __nccwpck_require__(742);
const node_fs_1 = __importDefault(__nccwpck_require__(561));
const promises_1 = __nccwpck_require__(402);
const node_stream_1 = __nccwpck_require__(492);
const core = __importStar(__nccwpck_require__(933));
const exec = __importStar(__nccwpck_require__(337));
function getVersions() {
    const output = exec.execGetOutput('git ls-remote --tags --refs https://github.com/cargo-prebuilt/cargo-prebuilt.git');
    const re = /v((\d+)\.(\d+)\.(\d+))[^-]/g;
    const tmp = [...output.matchAll(re)].map(a => {
        return a[1];
    });
    return tmp.sort((a, b) => {
        if (a === b)
            return 0;
        const as = a.split('.');
        const bs = b.split('.');
        if (as[0] > bs[0] ||
            (as[0] === bs[0] && as[1] > bs[1]) ||
            (as[0] === bs[0] && as[1] === bs[1] && as[2] > bs[2]))
            return 1;
        return -1;
    });
}
function currentTarget() {
    switch (node_process_1.arch) {
        case 'arm':
            if (node_process_1.platform === 'linux')
                return 'armv7-unknown-linux-gnueabihf';
            else
                core.setFailed('unsupported platform');
            break;
        case 'arm64':
            if (node_process_1.platform === 'linux')
                return 'aarch64-unknown-linux-gnu';
            else if (node_process_1.platform === 'darwin')
                return 'aarch64-apple-darwin';
            else
                core.setFailed('unsupported platform');
            break;
        case 'riscv64':
            if (node_process_1.platform === 'linux')
                return 'riscv64gc-unknown-linux-gnu';
            else
                core.setFailed('unsupported platform');
            break;
        case 's390x':
            if (node_process_1.platform === 'linux')
                return 's390x-unknown-linux-gnu';
            else
                core.setFailed('unsupported platform');
            break;
        case 'x64':
            if (node_process_1.platform === 'linux')
                return 'x86_64-unknown-linux-gnu';
            else if (node_process_1.platform === 'darwin')
                return 'x86_64-apple-darwin';
            else if (node_process_1.platform === 'win32')
                return 'x86_64-pc-windows-msvc';
            else if (node_process_1.platform === 'freebsd')
                return 'x86_64-unknown-freebsd';
            else
                core.setFailed('unsupported platform');
            break;
    }
    core.setFailed('unsupported or missing platform');
    return 'NULL';
}
async function downloadFile(url, path) {
    if (!(await downloadFileWithErr(url, path)))
        core.setFailed(`Could not download ${url}`);
}
async function downloadFileWithErr(url, path) {
    core.debug(`Started download of ${url} to ${path}`);
    const res = await fetch(url);
    if (res.status === 200) {
        const stream = node_fs_1.default.createWriteStream(path, { flags: 'w' });
        // @ts-expect-error body stream should not be null
        await (0, promises_1.finished)(node_stream_1.Readable.fromWeb(res.body).pipe(stream));
        core.debug(`Finished download of ${url} to ${path}`);
        return true;
    }
    core.debug(`Could not download ${url}`);
    return false;
}


/***/ }),

/***/ 722:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TMP_DIR = exports.INSTALL_DIR = exports.PREBUILT_INDEX_PUB_KEY = exports.DL_URL = void 0;
const node_fs_1 = __importDefault(__nccwpck_require__(561));
const node_path_1 = __importDefault(__nccwpck_require__(411));
const node_os_1 = __importDefault(__nccwpck_require__(612));
exports.DL_URL = 'https://github.com/cargo-prebuilt/cargo-prebuilt/releases/download/v';
exports.PREBUILT_INDEX_PUB_KEY = 'RWTSqAR1Hbfu6mBFiaz4hb9I9gikhMmvKkVbyz4SJF/oxJcbbScmCqqO';
exports.INSTALL_DIR = node_path_1.default.join(node_os_1.default.homedir(), '.cargo/bin');
exports.TMP_DIR = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), 'cargo-prebuilt-'));


/***/ }),

/***/ 718:
/***/ ((module) => {

module.exports = require("node:child_process");

/***/ }),

/***/ 5:
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ 561:
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ 612:
/***/ ((module) => {

module.exports = require("node:os");

/***/ }),

/***/ 411:
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),

/***/ 742:
/***/ ((module) => {

module.exports = require("node:process");

/***/ }),

/***/ 492:
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ 402:
/***/ ((module) => {

module.exports = require("node:stream/promises");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const main_1 = __nccwpck_require__(356);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(0, main_1.run)();

})();

module.exports = __webpack_exports__;
/******/ })()
;