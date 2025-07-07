import {
  createSignal,
  createEffect,
  onCleanup,
  createMemo,
  splitProps,
  mergeProps,
  onMount,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { fromEvent } from "file-selector";
import {
  acceptPropAsAcceptAttr,
  allFilesAccepted,
  composeEventHandlers,
  fileAccepted,
  fileMatchSize,
  canUseFileSystemAccessAPI,
  isAbort,
  isEvtWithFiles,
  isIeOrEdge,
  isPropagationStopped,
  isSecurityError,
  onDocumentDragOver,
  pickerOptionsFromAccept,
  TOO_MANY_FILES_REJECTION,
} from "./utils/index.js";

const defaultProps = {
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
  autoFocus: false,
};

const initialState = {
  isFocused: false,
  isFileDialogActive: false,
  isDragActive: false,
  isDragAccept: false,
  isDragReject: false,
  acceptedFiles: [],
  fileRejections: [],
};

/**
 * A SolidJS composable that creates a drag 'n' drop area.
 *
 * @function createDropzone
 */
export function createDropzone(props = {}) {
  const mergedProps = mergeProps(defaultProps, props);

  let rootRef;
  let inputRef;
  let dragTargetsRef = [];

  const [state, setState] = createStore(initialState);

  const fsAccessApiWorks =
    typeof window !== "undefined" &&
    window.isSecureContext &&
    mergedProps.useFsAccessApi &&
    canUseFileSystemAccessAPI();
  const [useFsAccess, setUseFsAccess] = createSignal(fsAccessApiWorks);

  const acceptAttr = createMemo(() =>
    acceptPropAsAcceptAttr(mergedProps.accept)
  );
  const pickerTypes = createMemo(() =>
    pickerOptionsFromAccept(mergedProps.accept)
  );

  const onFileDialogOpen = () => {
    if (typeof mergedProps.onFileDialogOpen === "function") {
      mergedProps.onFileDialogOpen();
    }
  };

  const onFileDialogCancel = () => {
    if (typeof mergedProps.onFileDialogCancel === "function") {
      mergedProps.onFileDialogCancel();
    }
  };

  const onWindowFocus = () => {
    if (!useFsAccess() && state.isFileDialogActive) {
      setTimeout(() => {
        if (inputRef) {
          const { files } = inputRef;
          if (!files.length) {
            setState("isFileDialogActive", false);
            onFileDialogCancel();
          }
        }
      }, 300);
    }
  };

  createEffect(() => {
    window.addEventListener("focus", onWindowFocus, false);
    onCleanup(() => {
      window.removeEventListener("focus", onWindowFocus, false);
    });
  });

  const onDocumentDrop = (event) => {
    if (rootRef && rootRef.contains(event.target)) {
      return;
    }
    event.preventDefault();
    dragTargetsRef = [];
  };

  createEffect(() => {
    if (mergedProps.preventDropOnDocument) {
      document.addEventListener("dragover", onDocumentDragOver, false);
      document.addEventListener("drop", onDocumentDrop, false);
    }

    onCleanup(() => {
      if (mergedProps.preventDropOnDocument) {
        document.removeEventListener("dragover", onDocumentDragOver);
        document.removeEventListener("drop", onDocumentDrop);
      }
    });
  });

  onMount(() => {
    if (!mergedProps.disabled && mergedProps.autoFocus && rootRef) {
      rootRef.focus();
    }
  });

  const onErr = (e) => {
    if (mergedProps.onError) {
      mergedProps.onError(e);
    } else {
      console.error(e);
    }
  };

  const onDragEnterCb = (event) => {
    event.preventDefault();
    stopPropagation(event);

    dragTargetsRef = [...dragTargetsRef, event.target];

    if (isEvtWithFiles(event)) {
      Promise.resolve(mergedProps.getFilesFromEvent(event))
        .then((files) => {
          if (isPropagationStopped(event) && !mergedProps.noDragEventsBubbling) {
            return;
          }

          const fileCount = files.length;
          const isDragAccept =
            fileCount > 0 &&
            allFilesAccepted({
              files,
              accept: acceptAttr(),
              minSize: mergedProps.minSize,
              maxSize: mergedProps.maxSize,
              multiple: mergedProps.multiple,
              maxFiles: mergedProps.maxFiles,
              validator: mergedProps.validator,
            });
          const isDragReject = fileCount > 0 && !isDragAccept;

          setState(
            produce((s) => {
              s.isDragActive = true;
              s.isDragAccept = isDragAccept;
              s.isDragReject = isDragReject;
            })
          );

          if (mergedProps.onDragEnter) {
            mergedProps.onDragEnter(event);
          }
        })
        .catch((e) => onErr(e));
    }
  };

  const onDragOverCb = (event) => {
    event.preventDefault();
    stopPropagation(event);

    const hasFiles = isEvtWithFiles(event);
    if (hasFiles && event.dataTransfer) {
      try {
        event.dataTransfer.dropEffect = "copy";
      } catch {}
    }

    if (hasFiles && mergedProps.onDragOver) {
      mergedProps.onDragOver(event);
    }

    return false;
  };

  const onDragLeaveCb = (event) => {
    event.preventDefault();
    stopPropagation(event);

    const targets = dragTargetsRef.filter(
      (target) => rootRef && rootRef.contains(target)
    );
    const targetIdx = targets.indexOf(event.target);
    if (targetIdx !== -1) {
      targets.splice(targetIdx, 1);
    }
    dragTargetsRef = targets;
    if (targets.length > 0) {
      return;
    }

    setState(
      produce((s) => {
        s.isDragActive = false;
        s.isDragAccept = false;
        s.isDragReject = false;
      })
    );

    if (isEvtWithFiles(event) && mergedProps.onDragLeave) {
      mergedProps.onDragLeave(event);
    }
  };

  const setFiles = (files, event) => {
    const acceptedFiles = [];
    const fileRejections = [];

    files.forEach((file) => {
      const [accepted, acceptError] = fileAccepted(file, acceptAttr());
      const [sizeMatch, sizeError] = fileMatchSize(
        file,
        mergedProps.minSize,
        mergedProps.maxSize
      );
      const customErrors = mergedProps.validator
        ? mergedProps.validator(file)
        : null;

      if (accepted && sizeMatch && !customErrors) {
        acceptedFiles.push(file);
      } else {
        let errors = [acceptError, sizeError];
        if (customErrors) {
          errors = errors.concat(customErrors);
        }
        fileRejections.push({ file, errors: errors.filter((e) => e) });
      }
    });

    if (
      (!mergedProps.multiple && acceptedFiles.length > 1) ||
      (mergedProps.multiple &&
        mergedProps.maxFiles >= 1 &&
        acceptedFiles.length > mergedProps.maxFiles)
    ) {
      acceptedFiles.forEach((file) => {
        fileRejections.push({ file, errors: [TOO_MANY_FILES_REJECTION] });
      });
      acceptedFiles.splice(0);
    }

    setState(
      produce((s) => {
        s.acceptedFiles = acceptedFiles;
        s.fileRejections = fileRejections;
        s.isDragReject = fileRejections.length > 0;
      })
    );

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

  const onDropCb = (event) => {
    event.preventDefault();
    stopPropagation(event);

    dragTargetsRef = [];

    if (isEvtWithFiles(event)) {
      Promise.resolve(mergedProps.getFilesFromEvent(event))
        .then((files) => {
          if (isPropagationStopped(event) && !mergedProps.noDragEventsBubbling) {
            return;
          }
          setFiles(files, event);
        })
        .catch((e) => onErr(e));
    }
    setState(produce((s) => Object.assign(s, initialState)));
  };

  const openFileDialog = () => {
    if (useFsAccess()) {
      setState("isFileDialogActive", true);
      onFileDialogOpen();
      const opts = {
        multiple: mergedProps.multiple,
        types: pickerTypes(),
      };
      window
        .showOpenFilePicker(opts)
        .then((handles) => mergedProps.getFilesFromEvent(handles))
        .then((files) => {
          setFiles(files, null);
          setState("isFileDialogActive", false);
        })
        .catch((e) => {
          if (isAbort(e)) {
            onFileDialogCancel(e);
            setState("isFileDialogActive", false);
          } else if (isSecurityError(e)) {
            setUseFsAccess(false);
            if (inputRef) {
              inputRef.value = null;
              inputRef.click();
            } else {
              onErr(
                new Error(
                  "Cannot open the file picker because the File System Access API is not supported and no <input> was provided."
                )
              );
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

  const onKeyDownCb = (event) => {
    if (!rootRef || !rootRef.isEqualNode(event.target)) {
      return;
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      openFileDialog();
    }
  };

  const onFocusCb = () => setState("isFocused", true);
  const onBlurCb = () => setState("isFocused", false);

  const onClickCb = () => {
    if (mergedProps.noClick) {
      return;
    }

    if (isIeOrEdge()) {
      setTimeout(openFileDialog, 0);
    } else {
      openFileDialog();
    }
  };

  const composeHandler = (fn) => {
    return mergedProps.disabled ? null : fn;
  };

  const composeKeyboardHandler = (fn) => {
    return mergedProps.noKeyboard ? null : composeHandler(fn);
  };

  const composeDragHandler = (fn) => {
    return mergedProps.noDrag ? null : composeHandler(fn);
  };

  const stopPropagation = (event) => {
    if (mergedProps.noDragEventsBubbling) {
      event.stopPropagation();
    }
  };

  const getRootProps = createMemo(() => (restProps = {}) => {
    const [_, otherRest] = splitProps(restProps, [
      "ref",
      "role",
      "onKeyDown",
      "onFocus",
      "onBlur",
      "onClick",
      "onDragEnter",
      "onDragOver",
      "onDragLeave",
      "onDrop",
    ]);

    return {
      onKeyDown: composeKeyboardHandler(
        composeEventHandlers(restProps.onKeyDown, onKeyDownCb)
      ),
      onFocus: composeKeyboardHandler(
        composeEventHandlers(restProps.onFocus, onFocusCb)
      ),
      onBlur: composeKeyboardHandler(
        composeEventHandlers(restProps.onBlur, onBlurCb)
      ),
      onClick: composeHandler(composeEventHandlers(restProps.onClick, onClickCb)),
      onDragEnter: composeDragHandler(
        composeEventHandlers(restProps.onDragEnter, onDragEnterCb)
      ),
      onDragOver: composeDragHandler(
        composeEventHandlers(restProps.onDragOver, onDragOverCb)
      ),
      onDragLeave: composeDragHandler(
        composeEventHandlers(restProps.onDragLeave, onDragLeaveCb)
      ),
      onDrop: composeDragHandler(
        composeEventHandlers(restProps.onDrop, onDropCb)
      ),
      role:
        typeof restProps.role === "string" && restProps.role !== ""
          ? restProps.role
          : "presentation",
      ref: (r) => (rootRef = r),
      ...(!mergedProps.disabled && !mergedProps.noKeyboard ? { tabindex: 0 } : {}),
      ...otherRest,
    };
  });

  const onInputElementClick = (event) => {
    event.stopPropagation();
  };

  const getInputProps = createMemo(() => (restProps = {}) => {
    const [_, otherRest] = splitProps(restProps, [
      "ref",
      "onChange",
      "onClick",
    ]);
    const inputProps = {
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
        "white-space": "nowrap",
      },
      onChange: composeHandler(composeEventHandlers(restProps.onChange, onDropCb)),
      onClick: composeHandler(
        composeEventHandlers(restProps.onClick, onInputElementClick)
      ),
      tabIndex: -1,
      ref: (r) => (inputRef = r),
    };

    return {
      ...inputProps,
      ...otherRest,
    };
  });

  const isFocused = createMemo(() => state.isFocused && !mergedProps.disabled);

  return {
    ...state,
    get isFocused() {
      return isFocused();
    },
    getRootProps,
    getInputProps,
    get open() {
      return composeHandler(openFileDialog);
    },
  };
}

/**
 * Convenience wrapper component for the `createDropzone` composable
 */
const Dropzone = (props) => {
  const [local, others] = splitProps(props, ["children", "ref"]);
  const { open, ...api } = createDropzone(others);

  createEffect(() => {
    const ref = local.ref;
    if (ref) {
      if (typeof ref === "function") {
        ref({ open });
      } else {
        ref.open = open;
      }
    }
  });

  return <>{local.children({ ...api, open })}</>;
};

export default Dropzone;
