import React, {useRef} from 'react';
import get from 'lodash.get';
import filesize from 'filesize';
import {toast} from "react-toastify";
import "./style.css";
import config from "../../config";
import {ExtraDownloadFile} from "services"
import {api} from "../../services";

const CustomDocumentUploading = ({
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
                                   fromArray,
                                   groupStyle
                                 }) => {
  const toastID = useRef(null);
  const handleChange = (file) => {
    if (isMulti) {
      Array.from(file).forEach(item => {
        if (["image/*"].includes(formats) || formats.includes(('.' + item.name.split('.').pop()).toString().toLowerCase())) {
          onChange(fromArray ? values[inputName] ? [values[inputName], Array.from(file)].flat(1) : [Array.from(file)].flat(1) : [...values[inputName], Array.from(file)].flat(1));
        } else {
          toast.error("Noto'g'ri fayl yuklandi");
        }
      });
    } else {
      if (["image/*"].includes(formats) || formats.includes(('.' + file.name.split('.').pop()).toString().toLowerCase())) {
        onChange(fromArray ? values[inputName] ? [values[inputName], file] : [file] : [...values[inputName], file]);
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
    <>
      {
        isMulti || values?.length === 0 || (values && inputName) || fromArray
          ? groupStyle
            ? <label
              className={`btn focus-none custom-rounded-12 w-xl-80 text-white d-flex align-items-center justify-content-center ${get(values, inputName, []).length ? "btn-menu hover-effect" : "bg-75758b"} ${classValidInput}`}
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
              <span className="bg-gradient-custom reverse custom-rounded-12"/>
              <span
                className="position-relative d-flex align-items-center justify-content-center fs-17 fw-600 custom-zindex-2">
                                    {text} {get(values, inputName, []).length ?
                <svg xmlns="http://www.w3.org/2000/svg" className={"ms-2"} width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path
                    d="M20.97 1.5H18.03C16.76 1.5 16 2.26 16 3.53V6.47C16 7.74 16.76 8.5 18.03 8.5H20.97C22.24 8.5 23 7.74 23 6.47V3.53C23 2.26 22.24 1.5 20.97 1.5ZM21.19 4.81C21.07 4.93 20.91 4.99 20.75 4.99C20.59 4.99 20.43 4.93 20.31 4.81L20.13 4.63V6.87C20.13 7.22 19.85 7.5 19.5 7.5C19.15 7.5 18.87 7.22 18.87 6.87V4.63L18.69 4.81C18.45 5.05 18.05 5.05 17.81 4.81C17.57 4.57 17.57 4.17 17.81 3.93L19.06 2.68C19.11 2.63 19.18 2.59 19.25 2.56C19.27 2.55 19.29 2.55 19.31 2.54C19.36 2.52 19.41 2.51 19.47 2.51H19.53C19.6 2.51 19.66 2.52 19.73 2.55H19.75C19.82 2.58 19.88 2.62 19.93 2.67C19.94 2.68 19.94 2.68 19.95 2.68L21.2 3.93C21.44 4.17 21.44 4.57 21.19 4.81Z"
                    fill="white"/>
                  <path
                    d="M9.00012 10.8801C10.3146 10.8801 11.3801 9.81455 11.3801 8.50012C11.3801 7.18568 10.3146 6.12012 9.00012 6.12012C7.68568 6.12012 6.62012 7.18568 6.62012 8.50012C6.62012 9.81455 7.68568 10.8801 9.00012 10.8801Z"
                    fill="white"/>
                  <path
                    d="M20.97 8.5H20.5V13.11L20.37 13C19.59 12.33 18.33 12.33 17.55 13L13.39 16.57C12.61 17.24 11.35 17.24 10.57 16.57L10.23 16.29C9.52 15.67 8.39 15.61 7.59 16.15L3.85 18.66C3.63 18.1 3.5 17.45 3.5 16.69V8.31C3.5 5.49 4.99 4 7.81 4H16V3.53C16 3.13 16.07 2.79 16.23 2.5H7.81C4.17 2.5 2 4.67 2 8.31V16.69C2 17.78 2.19 18.73 2.56 19.53C3.42 21.43 5.26 22.5 7.81 22.5H16.19C19.83 22.5 22 20.33 22 16.69V8.27C21.71 8.43 21.37 8.5 20.97 8.5Z"
                    fill="white"/>
                </svg>
                : <i className="fal fa-plus ms-2" id={inputName + "_file"}/>}
                
                  </span>
              <input
                type="file"
                id={id || "file"}
                multiple={isMulti}
                name={inputName}
                onChange={e => {
                  const file = e.target.files;
                  if (isMulti) {
                    handleChange(file);
                  } else {
                    handleChange(file[0]);
                  }
                }}
                accept={Array.isArray(formats) ? formats.join(",") : formats}
                className="w-0 h-0 visually-hidden"
              />
            </label>
            : <div className={"position-relative mb-2"}>
              <input
                className={`uploader-input position-absolute h-0 w-0 top-0 start-0 cursor-pointer`}
                type="file"
                id={id || "file"}
                multiple={isMulti}
                name={inputName}
                onChange={e => {
                  const file = e.target.files;
                  if (isMulti) {
                    handleChange(file);
                  } else {
                    handleChange(file[0]);
                  }
                }}
                accept={formats.join(",")}
              />
              <label
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
            </div>
          : null
      }
      
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
    </>
  );
};

CustomDocumentUploading.defaultProps = {
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

export default CustomDocumentUploading;