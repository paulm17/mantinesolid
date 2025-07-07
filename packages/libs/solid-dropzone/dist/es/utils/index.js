function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Most of these are plain JS functions used by the hook.
// They do not need conversion.
export var ErrorCode = {
  FileInvalidType: 'file-invalid-type',
  FileTooLarge: 'file-too-large',
  FileTooSmall: 'file-too-small',
  TooManyFiles: 'too-many-files'
};
export var TOO_MANY_FILES_REJECTION = {
  code: ErrorCode.TooManyFiles,
  message: 'Too many files'
}; // Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragtype checking is discouraged:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1372340

export function fileAccepted(file, accept) {
  var isAcceptable = file.type === 'application/x-moz-file' || accepts(file, accept);
  return [isAcceptable, isAcceptable ? null : {
    code: ErrorCode.FileInvalidType,
    message: "File type must be ".concat(accept)
  }];
}
export function fileMatchSize(file, minSize, maxSize) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize) {
        return [false, {
          code: ErrorCode.FileTooLarge,
          message: "File is larger than ".concat(maxSize, " bytes")
        }];
      }

      if (file.size < minSize) {
        return [false, {
          code: ErrorCode.FileTooSmall,
          message: "File is smaller than ".concat(minSize, " bytes")
        }];
      }
    } else if (isDefined(minSize) && file.size < minSize) {
      return [false, {
        code: ErrorCode.FileTooSmall,
        message: "File is smaller than ".concat(minSize, " bytes")
      }];
    } else if (isDefined(maxSize) && file.size > maxSize) {
      return [false, {
        code: ErrorCode.FileTooLarge,
        message: "File is larger than ".concat(maxSize, " bytes")
      }];
    }
  }

  return [true, null];
}

function isDefined(value) {
  return value !== undefined && value !== null;
} // https://github.com/okonet/attr-accept/blob/master/src/index.js
// Originally from https://github.com/react-bootstrap/react-prop-types/blob/master/src/utils/bootstrapUtils.js


export function accepts(file, acceptedFiles) {
  if (file && acceptedFiles) {
    var acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');
    var fileName = file.name || '';
    var mimeType = (file.type || '').toLowerCase();
    var baseMimeType = mimeType.replace(/\/.*$/, '');
    return acceptedFilesArray.some(function (type) {
      var validType = type.trim().toLowerCase();

      if (validType.charAt(0) === '.') {
        return fileName.toLowerCase().endsWith(validType);
      } else if (validType.endsWith('/*')) {
        // This is something like a image/* mime type
        return baseMimeType === validType.replace(/\/.*$/, '');
      }

      return mimeType === validType;
    });
  }

  return true;
}
export function allFilesAccepted(_ref) {
  var files = _ref.files,
      accept = _ref.accept,
      minSize = _ref.minSize,
      maxSize = _ref.maxSize,
      multiple = _ref.multiple,
      maxFiles = _ref.maxFiles,
      validator = _ref.validator;

  if (!multiple && files.length > 1 || multiple && maxFiles >= 1 && files.length > maxFiles) {
    return false;
  }

  return files.every(function (file) {
    var _fileAccepted = fileAccepted(file, accept),
        _fileAccepted2 = _slicedToArray(_fileAccepted, 1),
        accepted = _fileAccepted2[0];

    var _fileMatchSize = fileMatchSize(file, minSize, maxSize),
        _fileMatchSize2 = _slicedToArray(_fileMatchSize, 1),
        sizeMatch = _fileMatchSize2[0];

    var customErrors = validator ? validator(file) : null;
    return accepted && sizeMatch && !customErrors;
  });
}
export function acceptPropAsAcceptAttr(accept) {
  if (accept === undefined) {
    return undefined;
  }

  return Object.entries(accept).reduce(function (a, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        mime = _ref3[0],
        exts = _ref3[1];

    return [].concat(_toConsumableArray(a), [mime], _toConsumableArray(exts));
  }, []).join(',');
}
export function pickerOptionsFromAccept(accept) {
  if (accept === undefined) {
    return undefined;
  }

  return Object.entries(accept).map(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        mime = _ref5[0],
        exts = _ref5[1];

    return {
      description: 'Files',
      accept: _defineProperty({}, mime, exts)
    };
  });
}
export function composeEventHandlers() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (e) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return fns.some(function (fn) {
      if (fn) {
        fn.apply(void 0, [e].concat(args));
      }

      return e.defaultPrevented || e.propagationStopped;
    });
  };
}
export function isEvtWithFiles(event) {
  if (!event.dataTransfer) {
    return !!event.target && !!event.target.files;
  } // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
  // Note: In case of files dragged from the desktop, dataTransfer.types is not a string array but a DOMStringList
  // and in Safari lists the files' individual file types.


  return Array.prototype.some.call(event.dataTransfer.types, function (type) {
    return type === 'Files' || type === 'application/x-moz-file';
  });
} // Check if the provided event is a keyboard event.

export function isKeyboardEvent(event) {
  return event.key !== undefined;
} // Check if the provided event is a drag event.

export function isDragEvent(event) {
  return event.dataTransfer !== undefined;
}
export function isPropagationStopped(event) {
  if (typeof event.isPropagationStopped === 'function') {
    return event.isPropagationStopped();
  } else if (typeof event.cancelBubble !== 'undefined') {
    return event.cancelBubble;
  }

  return false;
}
export var onDocumentDragOver = function onDocumentDragOver(e) {
  e.preventDefault();
};
export function isIeOrEdge() {
  var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.navigator.userAgent;
  return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0;
}
export function canUseFileSystemAccessAPI() {
  return 'showOpenFilePicker' in window;
}
export function isAbort(err) {
  return err.name === 'AbortError';
}
export function isSecurityError(err) {
  return err.name === 'SecurityError';
}