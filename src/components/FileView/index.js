import React, {useRef} from 'react';
import get from "lodash.get";
import {ExtraDownloadFile} from "services"

const FileView = ({
                    file,
                    colClassName = ""
                  }) => {
  const toastID = useRef(null);
  
  
  return (
    <div className={`${colClassName ?? "col-xl-6 mt-3"}`}>
      {
        file.link
          ? <a href={file?.file_link} download={file?.file_link} target={"_blank"} rel="noreferrer opener"
               className="cursor-pointer h-100 d-flex align-items-center border border-orangelight p-2 custom-rounded-8 text-body text-break">
                          <span className="bg-orangelight2 px-3 py-2 me-2 rounded text-orange">
                            <i className="fas fa-file-alt"/>
                          </span>
            {get(file, "file_name")}
          </a>
          : <div
            className={`cursor-pointer d-flex h-100 align-items-center border p-2 custom-rounded-8 custom-shadow-file text-body text-break`}>
            <div className={"d-flex-between-center w-100"}>
              <div className={"me-2"}>
                <div
                  style={{
                    width: 44,
                    height: 44
                  }}
                  className={`bg-EBF1FF text-3348FF custom-rounded-6 d-flex-center`}>
                  <i className="hgi hgi-stroke hgi-file-01 fs-20"/>
                </div>
              </div>
              <div className={"d-flex flex-column w-85"}>
                  <span
                    className={`lh-18 text-one-line`}>{get(file, "file_name")}</span>
                <small>{((parseInt(get(file, "size")) / 1024) / 1024).toFixed(1)} mb</small>
              </div>
              
              <div>
                <button
                  type={"button"}
                  className="btn border-0 px-1"
                  onClick={() => ExtraDownloadFile({file, toastID})}>
                  <i className={"hgi hgi-stroke hgi-folder-download fs-19"}/>
                </button>
              </div>
            </div>
          </div>
      }
    </div>
  );
};

export default FileView;
