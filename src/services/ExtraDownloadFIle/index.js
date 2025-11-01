import {api} from "../index";
import {toast} from "react-toastify";
import React from "react";

const ExtraDownloadFile = ({
                             file,
                             file_url = 'file-download',
                             unique_id = '',
                             file_name = '',
                             custom_id = false,
                             custom_pdf = false,
                             toastID,
                             // t,
                             blob = false,
                             params
                           }) => {
  if (!toastID?.current) {
    toastID.current = toast("Yuklanmoqda", {
      theme: "colored",
      type: toast.TYPE.WARNING,
      autoClose: false,
      icon: <i className="fad fa-spinner-third fa-spin"/>
    });
  }
  
  
  if (blob) {
    api.request.post(api.queryBuilder(`${file_url}`), {...file}, {responseType: 'blob'})
      .then(function (response) {
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(response.data);
        a.download = file_name + ".xlsx";
        a.click();
        setTimeout(() => {
          toast.update(toastID.current, {
            theme: "colored",
            render: "Yuklanmoqda",
            type: toast.TYPE.SUCCESS,
            autoClose: 900,
            icon: <i className="fas fa-check-circle"/>,
            className: "animated-toastify",
          });
          toastID.current = null
        }, 900)
      })
      .catch((error) => {
        if (error) {
          setTimeout(() => {
            toast.update(toastID.current, {
              render: "Xatolik yuz berdi!",
              type: toast.TYPE.ERROR,
              autoClose: 3000,
              icon: <i className="fas fa-exclamation-circle"/>,
              className: "animated-toastify",
            });
            toastID.current = null
          }, 900)
        }
      })
  } else {
    api.request.get(api.queryBuilder(`/appeal/${file_url}/${custom_id ? custom_id : file?.id}`, {...params}), {responseType: 'blob'})
      .then(function (response) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response?.data);
        link.setAttribute('target', '_blank');
        link.setAttribute('download', file?.["file_name"] ? file["file_name"] : custom_pdf ? unique_id + file_name + ".pdf" : unique_id + file_name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          toast.update(toastID.current, {
            theme: "colored",
            render: "Yuklanmoqda",
            type: toast.TYPE.SUCCESS,
            autoClose: 900,
            icon: <i className="fas fa-check-circle"/>,
            className: "animated-toastify",
          });
          toastID.current = null
        }, 900)
      })
      .catch((error) => {
        if (error) {
          setTimeout(() => {
            toast.update(toastID.current, {
              render: "Xatolik yuz berdi!",
              type: toast.TYPE.ERROR,
              autoClose: 3000,
              icon: <i className="fas fa-exclamation-circle"/>,
              className: "animated-toastify",
            });
            toastID.current = null
          }, 900)
        }
      });
  }
  
}
export default ExtraDownloadFile