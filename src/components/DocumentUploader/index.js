import React, {useState, useRef} from 'react';
import {api} from 'services';
import axios from 'axios';
import get from 'lodash.get';
import filesize from 'filesize';
import {toast} from "react-toastify";
import "./style.css";
import {serialize} from 'object-to-formdata';
import config from "config";
import {useTranslation} from "react-i18next";
import {ErrorMessage} from "formik";
import {ExtraDownloadFile} from "services"
import Actions from "../../schema/actions";


const FileUpload = ({
                      values,
                      inputName,
                      id,
                      text,
                      displayName,
                      onSuccess,
                      classView,
                      onRemove,
                      canDownload,
                      data,
                      progressBar,
                      isMulti,
                      showPreview,
                      onChange,
                      formats,
                      icon,
                      canDelete,
                      extraPath,
                      extraDownload,
                      linkDownload,
                      fileSize,
                      customPath,
                      errorMessage,
                      errorMessageText,
                      onRemoveStatic,
                      removeOld = false,
                      changeStatus,
                      params,
                      modal = false,
                      stateRemove = '/appeal/file-delete/'
                    }) => {
  const {t} = useTranslation();
  const toastID = useRef(null);
  const [selectedFile, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isError, setError] = useState(false);
  const [removeText, setRemoveText] = useState(errorMessage)
  const CancelToken = axios.CancelToken;
  let cancel = useRef(() => {
  });
  const handleChange = (file) => {
    if (formats.includes(('.' + file.name.split('.').pop()).toString().toLowerCase())) {
      onChange([...values[inputName], file]);
      setFile(file);
      handleUpload(file);
    } else {
      toast.error(t("toast.required_format"));
    }
  };
  
  const handleUpload = (file) => {
    setError(false);
    data = serialize({...data, file});
    
    var config = {
      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      },
      cancelToken: new CancelToken(function executor(c) {
        if (cancel) {
          cancel.current = c;
        }
      })
    };
    
    api.request.post(api.queryBuilder(`${customPath}${extraPath ? extraPath : ''}`, {...params}), data, config)
      .then(function (res) {
        onSuccess(res.data.result.data);
        toast.success(t("other.upload"));
        setFile(null);
        setProgress(0);
        setError(false);
        Actions.OTHER.success({
          name: "File upload",
          url: `${customPath}${extraPath ? extraPath : ''}`,
          data: res,
          values: data,
          params,
        })
      })
      .catch(function (error) {
        if (axios.isCancel(error)) {
          toast.error(t("other.isCancel"));
        } else {
          toast.error(t("toast.error"));
        }
        Actions.OTHER.failure({
          name: "File upload",
          url: `${customPath}${extraPath ? extraPath : ''}`,
          error,
          values: data,
          params,
        })
        setFile(null);
        setProgress(0);
        setError(true);
      });
  };
  
  
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = e => {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleChange(files[0]);
    setFile(files[0]);
  };
  
  const handleRemove = (file) => {
    if (onRemoveStatic) {
      onRemove(file);
      toast.success(t("toast.deleted"));
    } else {
      api.request.delete(api.queryBuilder(`${stateRemove}${file.id}`, {extra: changeStatus ? {status: changeStatus} : ""}),)
        .then(function (res) {
          if (res.data.result.success) {
            toast.success(t("toast.deleted"));
            if (errorMessage && errorMessageText) {
              setRemoveText(true)
            }
            Actions.OTHER.success({
              name: "File delete",
              url: `${stateRemove}${file.id}`,
              data: res,
              values: data,
              params: {extra: changeStatus ? {status: changeStatus} : ""},
            })
            onRemove(file);
          }
        })
        .catch(function () {
          toast.error(t("toast.error"));
        });
    }
  };
  
  
  return (
    <>
      {
        selectedFile
          ? <>
            <div className={"file-view p-3 bg-light "}>
              <div className={'d-flex align-items-start justify-content-between'}>
                <div>
                  <div className="file-name font-size-18">{get(selectedFile, 'name', '')}</div>
                  <small className={'file-size '}>{filesize(get(selectedFile, 'size', ''))}</small>
                </div>
                <span onClick={() => cancel.current()} className={'text-danger cursor-pointer mr-3'}>
                  <i className={'fas fa-times-circle font-weight-light fs-20'}/>
                </span>
              </div>
            </div>
            {
              progressBar && !isError
                ? <div className={"progress rounded-0 position-relative"}>
                  <div className="progress-bar show-progress" style={{background: "#5ac773", width: progress + "%"}}
                       data-progress={progress + "%"}/>
                </div>
                : null
            }
          </>
          : null
      }
      
      {
        showPreview
          ? <>
            {
              get(values, inputName) && get(values, inputName).length
                ? <>
                  {
                    values[inputName].map((file, key) => (
                      <React.Fragment key={key}>
                        <div
                          className={`file-tem bg-white ${classView}`}>
                          <div className={"rounded row mx-0 p-2 border border-orangelight"}>
                            <div
                              className={'file-number px-0 col d-flex align-items-center justify-content-center'}>
                            <span className={"btn border border-orangelight bg-orangelight2 text-orange"}>
                            <i className={"fas fa-file-alt"}/>
                            </span>
                            </div>
                            <div className={'flex-fill file-content col-md-9 px-2'}>
                              <div className="w-100 text-break h-100">
                                <div
                                  className="w-100 text-break d-flex align-items-center h-100">{get(file, 'file_name') ? get(file, 'file_name') : get(file, displayName)}</div>
                                {
                                  fileSize ?
                                    <>
                                      {
                                        get(file, 'size')
                                          ? <span className={'font-size-12'}>{filesize(get(file, 'size', 0))}</span>
                                          : null
                                      }
                                    </>
                                    : null
                                }
                              
                              </div>
                            </div>
                            <div className={'d-flex align-items-center justify-content-center px-0 file-icon col'}>
                              {
                                canDownload
                                  ? <a href={config.FILE_ROOT + file.file} className={"btn focus-none"}
                                       rel={"nopener noreferrer"}
                                       download target={"_blank"}>
                                    <i className="text-blackish fa fa-download"/>
                                  </a>
                                  : !linkDownload && extraDownload
                                    ? <span onClick={() => ExtraDownloadFile({file, toastID, t})}>
                                    <i className="text-blackish fa fa-download"/>
                                  </span>
                                    : linkDownload
                                      ? <a href={file.file} className={"text-black focus-none"}
                                           rel={"nopener noreferrer"}
                                           download target={"_blank"}>
                                        <i className="text-blackish fa fa-download"/>
                                      </a>
                                      : null
                              }
                              {
                                canDelete
                                  ? <span className={'btn focus-none text-grey'} onClick={() => handleRemove(file)}>

                            <i className="fas fa-times-square"/>
                          </span>
                                  : null
                              }
                            
                            </div>
                          </div>
                          {/*{
                            errorMessageText
                              ? <span className={"fs-12 text-danger2"}>{errorMessageText}</span>
                              : null
                          }*/}
                        </div>
                      </React.Fragment>
                    ))
                  }
                </>
                : null
            }
          </>
          : null
      }
      {
        (!(!isMulti && !(values[inputName] && values[inputName].length === 0))) && !selectedFile
          ? removeOld
            ? null
            : <div className={`position-relative ${classView}`}>
              <input
                className={'uploader-input position-absolute h-100 w-100 top-0 start-0 cursor-pointer'}
                type="file"
                id={id || "file"}
                name={inputName}
                onChange={e => {
                  const file = e.target.files[0];
                  handleChange(file);
                }}
                accept={formats.join(",")}
              />
              <label
                className={'document-uploader file-uploader file-uploader-hover  w-100 fs-18'}
                htmlFor={id || "file"}
                onDragEnter={e => {
                  preventDefaults(e);
                  e.target.classList.add('active');
                }}
                onDragOver={e => {
                  preventDefaults(e);
                  e.target.classList.add('active');
                }}
                onDragLeave={e => {
                  preventDefaults(e);
                  e.target.classList.remove('active');
                }}
                onDrop={e => {
                  preventDefaults(e);
                  e.target.classList.remove('active');
                  handleDrop(e);
                }}
              >
              <span className="d-flex flex-column align-items-center justify-content-center">
              <span className={"fs-14 fw-500 text-primary2"}>
                {icon}
              </span>
                <span className={"fs-14"}>{text ?? t("appeal-form.file_text_placeholder")}</span>
              </span>
              </label>
              {
                errorMessage && errorMessageText && values[inputName].length && !removeText
                  ? null
                  : errorMessage && !errorMessageText && !values[inputName].length && removeText
                    ? <ErrorMessage name={inputName} render={() => <span
                      className={"fs-12 text-danger2"}>{t("appeal-form.file_error_return_upload")}</span>}/>
                    : errorMessageText && !values[inputName].length
                      ? <span className={"fs-12 text-danger2"}>{errorMessageText}</span>
                      : null
              }
            </div>
          : null
      }
    </>
  );
};

FileUpload.defaultProps = {
  id: '',
  data: {},
  progressBar: true,
  showPreview: true,
  canDownload: true,
  fileSize: false,
  fileDate: true,
  errorMessage: false,
  onRemoveStatic: false,
  errorMessageText: '',
  formats: [".doc", ".docx", ".xls", ".xlsx", ".pdf", ".zip", ".rar", ".jpg", ".jpeg", ".png", ".gif", ".svg"],
  icon: <i className="fas fa-file-upload fs-20 my-1"/>,
  onChange: () => {
  },
  onSuccess: () => {
  },
  onRemove: () => {
  },
  isMulti: false,
  customPath: "/appeal/file-upload",
  displayName: 'name',
  canDelete: true,
  extraDownload: true,
  linkDownload: false
};

export default FileUpload;