// Most of these are plain JS functions used by the hook.
// They do not need conversion.

export const ErrorCode = {
  FileInvalidType: 'file-invalid-type',
  FileTooLarge: 'file-too-large',
  FileTooSmall: 'file-too-small',
  TooManyFiles: 'too-many-files'
};

export const TOO_MANY_FILES_REJECTION = {
  code: ErrorCode.TooManyFiles,
  message: 'Too many files'
};

// Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragtype checking is discouraged:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1372340
export function fileAccepted(file, accept) {
  const isAcceptable = file.type === 'application/x-moz-file' || accepts(file, accept);
  return [
    isAcceptable,
    isAcceptable ? null : {
      code: ErrorCode.FileInvalidType,
      message: `File type must be ${accept}`
    }
  ];
}

export function fileMatchSize(file, minSize, maxSize) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize) {
        return [
          false,
          {
            code: ErrorCode.FileTooLarge,
            message: `File is larger than ${maxSize} bytes`
          }
        ];
      }
      if (file.size < minSize) {
        return [
          false,
          {
            code: ErrorCode.FileTooSmall,
            message: `File is smaller than ${minSize} bytes`
          }
        ];
      }
    } else if (isDefined(minSize) && file.size < minSize) {
      return [
        false,
        {
          code: ErrorCode.FileTooSmall,
          message: `File is smaller than ${minSize} bytes`
        }
      ];
    } else if (isDefined(maxSize) && file.size > maxSize) {
      return [
        false,
        {
          code: ErrorCode.FileTooLarge,
          message: `File is larger than ${maxSize} bytes`
        }
      ];
    }
  }
  return [true, null];
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

// https://github.com/okonet/attr-accept/blob/master/src/index.js
// Originally from https://github.com/react-bootstrap/react-prop-types/blob/master/src/utils/bootstrapUtils.js
export function accepts(file, acceptedFiles) {
  if (file && acceptedFiles) {
    const acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');
    const fileName = file.name || '';
    const mimeType = (file.type || '').toLowerCase();
    const baseMimeType = mimeType.replace(/\/.*$/, '');

    return acceptedFilesArray.some(type => {
      const validType = type.trim().toLowerCase();
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

export function allFilesAccepted({
  files,
  accept,
  minSize,
  maxSize,
  multiple,
  maxFiles,
  validator
}) {
  if (!multiple && files.length > 1 || (multiple && maxFiles >= 1 && files.length > maxFiles)) {
    return false;
  }

  return files.every(file => {
    const [accepted] = fileAccepted(file, accept);
    const [sizeMatch] = fileMatchSize(file, minSize, maxSize);
    const customErrors = validator ? validator(file) : null;
    return accepted && sizeMatch && !customErrors;
  });
}

export function acceptPropAsAcceptAttr(accept) {
  if (accept === undefined) {
    return undefined;
  }
  return Object.entries(accept)
    .reduce((a, [mime, exts]) => [...a, mime, ...exts], [])
    .join(',');
}

export function pickerOptionsFromAccept(accept) {
  if (accept === undefined) {
    return undefined;
  }
  return Object.entries(accept).map(([mime, exts]) => ({
    description: 'Files',
    accept: {
      [mime]: exts
    }
  }));
}

export function composeEventHandlers(...fns) {
  return (e, ...args) => fns.some(fn => {
    if (fn) {
      fn(e, ...args);
    }
    return e.defaultPrevented || e.propagationStopped;
  });
}

export function isEvtWithFiles(event) {
  if (!event.dataTransfer) {
    return !!event.target && !!event.target.files;
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
  // Note: In case of files dragged from the desktop, dataTransfer.types is not a string array but a DOMStringList
  // and in Safari lists the files' individual file types.
  return Array.prototype.some.call(
    event.dataTransfer.types,
    type => type === 'Files' || type === 'application/x-moz-file'
  );
}

// Check if the provided event is a keyboard event.
export function isKeyboardEvent(event) {
  return event.key !== undefined;
}

// Check if the provided event is a drag event.
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

export const onDocumentDragOver = e => {
  e.preventDefault();
};

export function isIeOrEdge(ua = window.navigator.userAgent) {
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
