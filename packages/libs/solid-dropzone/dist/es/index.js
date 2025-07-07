var _excluded = ["open"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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

import { createSignal, createEffect, onCleanup, createMemo, splitProps, mergeProps, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { fromEvent } from "file-selector";
import { acceptPropAsAcceptAttr, allFilesAccepted, composeEventHandlers, fileAccepted, fileMatchSize, canUseFileSystemAccessAPI, isAbort, isEvtWithFiles, isIeOrEdge, isPropagationStopped, isSecurityError, onDocumentDragOver, pickerOptionsFromAccept, TOO_MANY_FILES_REJECTION } from "./utils/index.js";
var defaultProps = {
  disabled: false,
  getFilesFromEvent: fromEvent,
  maxSize: Infinity,
  minSize: 0,
  multiple: true,
  maxFiles: 0,
  preventDropOnDocument: true,
  noClick: false,
  noKeyboard: false,
  noDrag: false,
  noDragEventsBubbling: false,
  validator: null,
  useFsAccessApi: false,
  autoFocus: false
};
var initialState = {
  isFocused: false,
  isFileDialogActive: false,
  isDragActive: false,
  isDragAccept: false,
  isDragReject: false,
  acceptedFiles: [],
  fileRejections: []
};
/**
 * A SolidJS composable that creates a drag 'n' drop area.
 *
 * @function createDropzone
 */

export function createDropzone() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mergedProps = mergeProps(defaultProps, props);
  var rootRef;
  var inputRef;
  var dragTargetsRef = [];

  var _createStore = createStore(initialState),
      _createStore2 = _slicedToArray(_createStore, 2),
      state = _createStore2[0],
      setState = _createStore2[1];

  var fsAccessApiWorks = typeof window !== "undefined" && window.isSecureContext && mergedProps.useFsAccessApi && canUseFileSystemAccessAPI();

  var _createSignal = createSignal(fsAccessApiWorks),
      _createSignal2 = _slicedToArray(_createSignal, 2),
      useFsAccess = _createSignal2[0],
      setUseFsAccess = _createSignal2[1];

  var acceptAttr = createMemo(function () {
    return acceptPropAsAcceptAttr(mergedProps.accept);
  });
  var pickerTypes = createMemo(function () {
    return pickerOptionsFromAccept(mergedProps.accept);
  });

  var onFileDialogOpen = function onFileDialogOpen() {
    if (typeof mergedProps.onFileDialogOpen === "function") {
      mergedProps.onFileDialogOpen();
    }
  };

  var onFileDialogCancel = function onFileDialogCancel() {
    if (typeof mergedProps.onFileDialogCancel === "function") {
      mergedProps.onFileDialogCancel();
    }
  };

  var onWindowFocus = function onWindowFocus() {
    if (!useFsAccess() && state.isFileDialogActive) {
      setTimeout(function () {
        if (inputRef) {
          var _inputRef = inputRef,
              files = _inputRef.files;

          if (!files.length) {
            setState("isFileDialogActive", false);
            onFileDialogCancel();
          }
        }
      }, 300);
    }
  };

  createEffect(function () {
    window.addEventListener("focus", onWindowFocus, false);
    onCleanup(function () {
      window.removeEventListener("focus", onWindowFocus, false);
    });
  });

  var onDocumentDrop = function onDocumentDrop(event) {
    if (rootRef && rootRef.contains(event.target)) {
      return;
    }

    event.preventDefault();
    dragTargetsRef = [];
  };

  createEffect(function () {
    if (mergedProps.preventDropOnDocument) {
      document.addEventListener("dragover", onDocumentDragOver, false);
      document.addEventListener("drop", onDocumentDrop, false);
    }

    onCleanup(function () {
      if (mergedProps.preventDropOnDocument) {
        document.removeEventListener("dragover", onDocumentDragOver);
        document.removeEventListener("drop", onDocumentDrop);
      }
    });
  });
  onMount(function () {
    if (!mergedProps.disabled && mergedProps.autoFocus && rootRef) {
      rootRef.focus();
    }
  });

  var onErr = function onErr(e) {
    if (mergedProps.onError) {
      mergedProps.onError(e);
    } else {
      console.error(e);
    }
  };

  var onDragEnterCb = function onDragEnterCb(event) {
    event.preventDefault();
    stopPropagation(event);
    dragTargetsRef = [].concat(_toConsumableArray(dragTargetsRef), [event.target]);

    if (isEvtWithFiles(event)) {
      Promise.resolve(mergedProps.getFilesFromEvent(event)).then(function (files) {
        if (isPropagationStopped(event) && !mergedProps.noDragEventsBubbling) {
          return;
        }

        var fileCount = files.length;
        var isDragAccept = fileCount > 0 && allFilesAccepted({
          files: files,
          accept: acceptAttr(),
          minSize: mergedProps.minSize,
          maxSize: mergedProps.maxSize,
          multiple: mergedProps.multiple,
          maxFiles: mergedProps.maxFiles,
          validator: mergedProps.validator
        });
        var isDragReject = fileCount > 0 && !isDragAccept;
        setState(produce(function (s) {
          s.isDragActive = true;
          s.isDragAccept = isDragAccept;
          s.isDragReject = isDragReject;
        }));

        if (mergedProps.onDragEnter) {
          mergedProps.onDragEnter(event);
        }
      }).catch(function (e) {
        return onErr(e);
      });
    }
  };

  var onDragOverCb = function onDragOverCb(event) {
    event.preventDefault();
    stopPropagation(event);
    var hasFiles = isEvtWithFiles(event);

    if (hasFiles && event.dataTransfer) {
      try {
        event.dataTransfer.dropEffect = "copy";
      } catch (_unused) {}
    }

    if (hasFiles && mergedProps.onDragOver) {
      mergedProps.onDragOver(event);
    }

    return false;
  };

  var onDragLeaveCb = function onDragLeaveCb(event) {
    event.preventDefault();
    stopPropagation(event);
    var targets = dragTargetsRef.filter(function (target) {
      return rootRef && rootRef.contains(target);
    });
    var targetIdx = targets.indexOf(event.target);

    if (targetIdx !== -1) {
      targets.splice(targetIdx, 1);
    }

    dragTargetsRef = targets;

    if (targets.length > 0) {
      return;
    }

    setState(produce(function (s) {
      s.isDragActive = false;
      s.isDragAccept = false;
      s.isDragReject = false;
    }));

    if (isEvtWithFiles(event) && mergedProps.onDragLeave) {
      mergedProps.onDragLeave(event);
    }
  };

  var setFiles = function setFiles(files, event) {
    var acceptedFiles = [];
    var fileRejections = [];
    files.forEach(function (file) {
      var _fileAccepted = fileAccepted(file, acceptAttr()),
          _fileAccepted2 = _slicedToArray(_fileAccepted, 2),
          accepted = _fileAccepted2[0],
          acceptError = _fileAccepted2[1];

      var _fileMatchSize = fileMatchSize(file, mergedProps.minSize, mergedProps.maxSize),
          _fileMatchSize2 = _slicedToArray(_fileMatchSize, 2),
          sizeMatch = _fileMatchSize2[0],
          sizeError = _fileMatchSize2[1];

      var customErrors = mergedProps.validator ? mergedProps.validator(file) : null;

      if (accepted && sizeMatch && !customErrors) {
        acceptedFiles.push(file);
      } else {
        var errors = [acceptError, sizeError];

        if (customErrors) {
          errors = errors.concat(customErrors);
        }

        fileRejections.push({
          file: file,
          errors: errors.filter(function (e) {
            return e;
          })
        });
      }
    });

    if (!mergedProps.multiple && acceptedFiles.length > 1 || mergedProps.multiple && mergedProps.maxFiles >= 1 && acceptedFiles.length > mergedProps.maxFiles) {
      acceptedFiles.forEach(function (file) {
        fileRejections.push({
          file: file,
          errors: [TOO_MANY_FILES_REJECTION]
        });
      });
      acceptedFiles.splice(0);
    }

    setState(produce(function (s) {
      s.acceptedFiles = acceptedFiles;
      s.fileRejections = fileRejections;
      s.isDragReject = fileRejections.length > 0;
    }));

    if (mergedProps.onDrop) {
      mergedProps.onDrop(acceptedFiles, fileRejections, event);
    }

    if (fileRejections.length > 0 && mergedProps.onDropRejected) {
      mergedProps.onDropRejected(fileRejections, event);
    }

    if (acceptedFiles.length > 0 && mergedProps.onDropAccepted) {
      mergedProps.onDropAccepted(acceptedFiles, event);
    }
  };

  var onDropCb = function onDropCb(event) {
    event.preventDefault();
    stopPropagation(event);
    dragTargetsRef = [];

    if (isEvtWithFiles(event)) {
      Promise.resolve(mergedProps.getFilesFromEvent(event)).then(function (files) {
        if (isPropagationStopped(event) && !mergedProps.noDragEventsBubbling) {
          return;
        }

        setFiles(files, event);
      }).catch(function (e) {
        return onErr(e);
      });
    }

    setState(produce(function (s) {
      return Object.assign(s, initialState);
    }));
  };

  var openFileDialog = function openFileDialog() {
    if (useFsAccess()) {
      setState("isFileDialogActive", true);
      onFileDialogOpen();
      var opts = {
        multiple: mergedProps.multiple,
        types: pickerTypes()
      };
      window.showOpenFilePicker(opts).then(function (handles) {
        return mergedProps.getFilesFromEvent(handles);
      }).then(function (files) {
        setFiles(files, null);
        setState("isFileDialogActive", false);
      }).catch(function (e) {
        if (isAbort(e)) {
          onFileDialogCancel(e);
          setState("isFileDialogActive", false);
        } else if (isSecurityError(e)) {
          setUseFsAccess(false);

          if (inputRef) {
            inputRef.value = null;
            inputRef.click();
          } else {
            onErr(new Error("Cannot open the file picker because the File System Access API is not supported and no <input> was provided."));
          }
        } else {
          onErr(e);
        }
      });
      return;
    }

    if (inputRef) {
      setState("isFileDialogActive", true);
      onFileDialogOpen();
      inputRef.value = null;
      inputRef.click();
    }
  };

  var onKeyDownCb = function onKeyDownCb(event) {
    if (!rootRef || !rootRef.isEqualNode(event.target)) {
      return;
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      openFileDialog();
    }
  };

  var onFocusCb = function onFocusCb() {
    return setState("isFocused", true);
  };

  var onBlurCb = function onBlurCb() {
    return setState("isFocused", false);
  };

  var onClickCb = function onClickCb() {
    if (mergedProps.noClick) {
      return;
    }

    if (isIeOrEdge()) {
      setTimeout(openFileDialog, 0);
    } else {
      openFileDialog();
    }
  };

  var composeHandler = function composeHandler(fn) {
    return mergedProps.disabled ? null : fn;
  };

  var composeKeyboardHandler = function composeKeyboardHandler(fn) {
    return mergedProps.noKeyboard ? null : composeHandler(fn);
  };

  var composeDragHandler = function composeDragHandler(fn) {
    return mergedProps.noDrag ? null : composeHandler(fn);
  };

  var stopPropagation = function stopPropagation(event) {
    if (mergedProps.noDragEventsBubbling) {
      event.stopPropagation();
    }
  };

  var getRootProps = createMemo(function () {
    return function () {
      var restProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _splitProps = splitProps(restProps, ["ref", "role", "onKeyDown", "onFocus", "onBlur", "onClick", "onDragEnter", "onDragOver", "onDragLeave", "onDrop"]),
          _splitProps2 = _slicedToArray(_splitProps, 2),
          _ = _splitProps2[0],
          otherRest = _splitProps2[1];

      return _objectSpread(_objectSpread({
        onKeyDown: composeKeyboardHandler(composeEventHandlers(restProps.onKeyDown, onKeyDownCb)),
        onFocus: composeKeyboardHandler(composeEventHandlers(restProps.onFocus, onFocusCb)),
        onBlur: composeKeyboardHandler(composeEventHandlers(restProps.onBlur, onBlurCb)),
        onClick: composeHandler(composeEventHandlers(restProps.onClick, onClickCb)),
        onDragEnter: composeDragHandler(composeEventHandlers(restProps.onDragEnter, onDragEnterCb)),
        onDragOver: composeDragHandler(composeEventHandlers(restProps.onDragOver, onDragOverCb)),
        onDragLeave: composeDragHandler(composeEventHandlers(restProps.onDragLeave, onDragLeaveCb)),
        onDrop: composeDragHandler(composeEventHandlers(restProps.onDrop, onDropCb)),
        role: typeof restProps.role === "string" && restProps.role !== "" ? restProps.role : "presentation",
        ref: function ref(r) {
          return rootRef = r;
        }
      }, !mergedProps.disabled && !mergedProps.noKeyboard ? {
        tabindex: 0
      } : {}), otherRest);
    };
  });

  var onInputElementClick = function onInputElementClick(event) {
    event.stopPropagation();
  };

  var getInputProps = createMemo(function () {
    return function () {
      var restProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _splitProps3 = splitProps(restProps, ["ref", "onChange", "onClick"]),
          _splitProps4 = _slicedToArray(_splitProps3, 2),
          _ = _splitProps4[0],
          otherRest = _splitProps4[1];

      var inputProps = {
        accept: acceptAttr(),
        multiple: mergedProps.multiple,
        type: "file",
        style: {
          border: 0,
          clip: "rect(0, 0, 0, 0)",
          "clip-path": "inset(50%)",
          height: "1px",
          margin: "0 -1px -1px 0",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          width: "1px",
          "white-space": "nowrap"
        },
        onChange: composeHandler(composeEventHandlers(restProps.onChange, onDropCb)),
        onClick: composeHandler(composeEventHandlers(restProps.onClick, onInputElementClick)),
        tabIndex: -1,
        ref: function ref(r) {
          return inputRef = r;
        }
      };
      return _objectSpread(_objectSpread({}, inputProps), otherRest);
    };
  });
  var isFocused = createMemo(function () {
    return state.isFocused && !mergedProps.disabled;
  });
  return _objectSpread(_objectSpread({}, state), {}, {
    get isFocused() {
      return isFocused();
    },

    getRootProps: getRootProps,
    getInputProps: getInputProps,

    get open() {
      return composeHandler(openFileDialog);
    }

  });
}
/**
 * Convenience wrapper component for the `createDropzone` composable
 */

var Dropzone = function Dropzone(props) {
  var _splitProps5 = splitProps(props, ["children", "ref"]),
      _splitProps6 = _slicedToArray(_splitProps5, 2),
      local = _splitProps6[0],
      others = _splitProps6[1];

  var _createDropzone = createDropzone(others),
      open = _createDropzone.open,
      api = _objectWithoutProperties(_createDropzone, _excluded);

  createEffect(function () {
    var ref = local.ref;

    if (ref) {
      if (typeof ref === "function") {
        ref({
          open: open
        });
      } else {
        ref.open = open;
      }
    }
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, local.children(_objectSpread(_objectSpread({}, api), {}, {
    open: open
  })));
};

export default Dropzone;