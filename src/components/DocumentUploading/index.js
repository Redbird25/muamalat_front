import React, {useRef} from 'react';
import get from 'lodash.get';
import filesize from 'filesize';
import {toast} from "react-toastify";
import "./style.css";
import config from "../../config";
import {api, ExtraDownloadFile} from "../../services";

const FileUpload = ({
                      values,
                      inputName,
                      id,
                      text,
                      displayName,
                      classValidInput,
                      classValidBtn,
                      isMulti,
                      showPreview,
                      onChange,
                      formats,
                      icon,
                      fileLink,
                      fileName,
                      groupStyle
                    }) => {
  const toastID = useRef(null);
  const handleChange = (file) => {
    if (isMulti) {
      Array.from(file).forEach(item => {
        if (formats.includes(('.' + item.name.split('.').pop()).toString().toLowerCase())) {
          onChange([...values[inputName], Array.from(file)].flat(1));
        } else {
          toast.error("Noto'g'ri fayl yuklandi");
        }
      });
    } else {
      if (formats.includes(('.' + file.name.split('.').pop()).toString().toLowerCase())) {
        onChange([...values[inputName], file]);
      } else {
        toast.error("Noto'g'ri fayl yuklandi");
      }
    }
  };
  
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = e => {
    let dt = e.dataTransfer.files;
    handleChange(dt);
  };
  
  const handleRemove = (i, file) => {
    if (get(file, "appeal_id") && get(file, "id")) {
      api.request.delete(api.queryBuilder(`/appeal/file-delete/${file.id}`),)
        .then(function (res) {
          if (res.data.result.success) {
            toast.success("Fayl o'chirildi");
            const filtered = values[inputName].filter((_, index) => i !== index);
            onChange(filtered);
          }
        })
        .catch(function () {
          toast.error("Xatolik yuz berdi!");
        });
    } else {
      const filtered = values[inputName].filter((_, index) => i !== index);
      onChange(filtered);
    }
  };
  
  
  return (
    <div>
      {
        isMulti || values[inputName]?.length === 0
          ? <div className={"position-relative mb-2"}>
            <input
              className={`uploader-input position-absolute h-0 w-0 top-0 start-0 cursor-pointer`}
              type="file"
              id={id || "file"}
              multiple={isMulti}
              name={inputName}
              onChange={e => {
                const file = e.target.files;
                handleChange(file);
              }}
              accept={formats.join(",")}
            />
            {
              groupStyle
                ? <div className="input-group mb-3">
                  <label
                    className={`form-control ${classValidInput} custom-file-label text-606E80 custom-rounded-start-8`}
                    htmlFor={id || "file"}
                    onDragEnter={e => {
                      preventDefaults(e);
                      get(e, "target.classList").add('active');
                    }}
                    onDragOver={e => {
                      preventDefaults(e);
                      get(e, "target.classList").add('active');
                    }}
                    onDragLeave={e => {
                      preventDefaults(e);
                      get(e, "target.classList").remove('active');
                    }}
                    onDrop={e => {
                      preventDefaults(e);
                      get(e, "target.classList").remove('active');
                      handleDrop(e);
                    }}
                    aria-describedby={inputName + "_file"}
                  >
                    <span className={"text-one-line"}>{text}</span>
                  
                  
                  </label>
                  <span id={inputName + "_file"}>
                <label className={`btn-confirm cursor-pointer custom-rounded-start-0 input-group-text ${classValidBtn}`}
                       htmlFor={id || "file"}>
                  Tanlang
                </label>
              </span>
                </div>
                : <label
                  className={"custom-drop-zone"} htmlFor={id || "file"}
                  onDragEnter={e => {
                    preventDefaults(e);
                    get(e, "target.classList").add('active');
                  }}
                  onDragOver={e => {
                    preventDefaults(e);
                    get(e, "target.classList").add('active');
                  }}
                  onDragLeave={e => {
                    preventDefaults(e);
                    get(e, "target.classList").remove('active');
                  }}
                  onDrop={e => {
                    preventDefaults(e);
                    get(e, "target.classList").remove('active');
                    handleDrop(e);
                  }}
                >
                  <i className="hgi hgi-stroke hgi-upload-02 fs-40 text-606E80"/>
                  
                  <label htmlFor={id || "file"} className={"btn btn-easy"}>
                    Faylni tanlang
                  </label>
                  
                  <span className={"mt-2 text-606E80"}>yoki shu yerga tashlang</span>
                </label>
            }
          
          
          </div>
          : null
      }
      
      {/*{*/}
      {/*  selectedFile*/}
      {/*    ? <>*/}
      {/*      <div className={"d-flex justify-content-between align-items-center file-view p-3 bg-F1F6FB "}>*/}
      {/*        <div className={'d-flex align-items-center'}>*/}
      {/*          <span onClick={() => setFile(null)} className={'text-danger cursor-pointer mr-3'}><i className={'fa fa-times font-weight-light'}/></span>*/}
      {/*          <div>*/}
      {/*            <div className="file-name font-size-18">{get(selectedFile,'name','')}</div>*/}
      {/*            <small className={'file-size '}>{filesize(get(selectedFile,'size',''))}</small>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      {*/}
      {/*        progressBar && !isError*/}
      {/*          ? <div className={"progress rounded-0 position-relative"}>*/}
      {/*            <div className="progress-bar show-progress" style={{ background: "#5ac773",width: progress + "%"}} data-progress={progress+"%"}/>*/}
      {/*          </div>*/}
      {/*          : null*/}
      {/*      }*/}
      {/*    </>*/}
      {/*    : null*/}
      {/*}*/}
      
      {
        showPreview
          ? <div>
            {
              values[inputName]?.length
                ? <div className="file-wrapper bg-transparent rounded-2">
                  {
                    values[inputName]?.map((file, key) => (
                      <div key={key}
                           className={"custom-shadow-file d-flex align-items-center rounded-3 p-1 border bg-white mb-3"}>
                        <div className={'file-icon'}>
                          <div>
                            {icon}
                          </div>
                        </div>
                        {
                          fileLink === file
                            ? <div
                              className={'px-3 flex-fill d-flex align-items-center justify-content-between file-content'}>
                              <div className={"fs-18"}>{fileName}</div>
                              <a href={config.FILE_ROOT + fileLink} className={"btn focus-none"}
                                 rel={"nopener noreferrer"}
                                 download target={"_blank"}>
                                <i className="text-blackish fa fa-download"/>
                              </a>
                            </div>
                            : <div className={'px-2 w-50 flex-fill file-content'}>
                              <div
                                className={"text-one-line fs-15"}>{get(file, 'name') ?? get(file, 'file_name') ?? get(file, displayName)}</div>
                              {
                                get(file, 'size')
                                  ? <span className={'fs-13 text-929FB1'}>{filesize(get(file, 'size', 0))}</span>
                                  : null
                              }
                            </div>
                        }
                        {
                          get(file, "appeal_id") && get(file, "id")
                            ? <button
                              type={"button"}
                              className={'btn border-0 px-1'}
                              onClick={() => ExtraDownloadFile({file, toastID})}
                            >
                              <i className="hgi hgi-stroke hgi-folder-download fs-19"/>
                            </button>
                            : null
                        }
                        
                        <button type={"button"} className={'btn border-0 ps-2 pe-1'}
                                onClick={() => handleRemove(key, file)}>
                          <i className="hgi hgi-stroke text-606E80 hgi-delete-02 fs-19"/>
                        </button>
                      </div>
                    ))
                  }
                </div>
                : null
            }
          </div>
          : null
      }
    </div>
  );
};

FileUpload.defaultProps = {
  id: '',
  progressBar: false,
  showPreview: true,
  text: "Загрузит файлы",
  formats: [".doc", ".docx", ".xls", ".xlsx", ".pdf", ".zip", ".rar", ".jpg", ".jpeg", ".png", ".gif", ".svg"],
  icon: <i className="fal fa-paperclip"/>,
  onChange: () => {
  },
  isMulti: false,
  displayName: 'name',
  groupStyle: true
};

export default FileUpload;