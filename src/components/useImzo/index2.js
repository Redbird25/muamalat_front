import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from "react-redux";
import Actions from 'redux/actions';
import ActionsGet from "../../schema/actions";
import Captcha from '../Captcha';
import {useTranslation} from "react-i18next";
import Select, {components} from 'react-select';
import {IMZOClient} from "./js/e-imzo-client";
import useImzo from './useImzo';
import './style.scss';

// require("./js/e-imzo");
// require("./js/imzoTender");


const isLegalEntity = function (tin) {
  return (tin.charAt(0) === '2' || tin.charAt(0) === '3');
};

function Imzo({onSuccess, onError, onFinally}) {

  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [userError, setError] = useState(false);
  const {isLoading, data, error} = useImzo();
  const [selectedKey, setSelectedKey] = useState(null);

  const signSystem = (e) => {
    e.preventDefault();

    let errorBrowserWS = "Brauzer WebSocket texnologiyasini ishlay olmadi Iltimos, brauzeringizning so'nggi versiyasini o'rnating.";
    let errorWrongPassword = "Parol noto'g'ri";

    let uiShowMessage = function (message) {
      alert(message);
    };

    if (selectedKey) {

      dispatch(ActionsGet.LoadOne.request({
        url: '/challenge',
        name: "challenge",
        cb: {
          success: (res) => {
            IMZOClient.loadKey(selectedKey.v, function (id) {
              IMZOClient.createPkcs7(id, res.challenge, null, function (pkcs7) {
                  if (pkcs7) {
                    // dispatch(Actions.LOGIN.request({
                    //   url: '/eimzo',
                    //   values: {
                    //     pkcs7
                    //   },
                    //   cb: {
                    //     success: (data) => {
                    //       onSuccess(data);
                    //     },
                    //     error: err => {
                    //       onError(err);
                    //     },
                    //     finally: () => {
                    //       onFinally();
                    //     }
                    //   }
                    // }))
                  }
                },
                function (e, r) {
                  if (r) {
                    if (r.indexOf("BadPaddingException") !== -1) {
                      uiShowMessage(errorWrongPassword);
                    } else {
                      uiShowMessage(r);
                    }
                  } else {
                    uiShowMessage(errorBrowserWS);
                  }
                  if (e) window.wsError(e);
                });
            }, function (e, r) {
              if (r) {
                if (r.indexOf("BadPaddingException") !== -1) {
                  uiShowMessage(errorWrongPassword);
                } else {
                  uiShowMessage(r);
                }
              } else {
                uiShowMessage(errorBrowserWS);
              }
              if (e) window.wsError(e);
            });
          },
          error: () => {

          },
          finally: () => {

          }
        }
      }))

    }
  };

  return (
    <>
      <div className="login pb-md-5 d-flex justify-content-center px-3 pt-5 has-bg">
        <div className="row w-100 d-flex justify-content-center align-items-center pt-5">
          <form className="col-md-8 col-lg-6 col-xxl-4 col-xl-8 p-md-5 p-4 bg-white rounded shadow-sm border">
            <p className="fs-22 fw-500 text-center mb-4">{t("other.confirmation")}</p>
            <Select
              options={data}
              isOptionDisabled={option => option.v?.expired}
              getOptionValue={(option) => option.itemId}
              getOptionLabel={({v}) => <div>
                <div><span style={{fontWeight: 700}}>{t("esp_select.certificate")}: </span>{v.serialNumber}</div>
                <div><span style={{fontWeight: 700}}>{t("esp_select.inn")}: </span>{v.TIN} <span
                  style={{fontWeight: 700}}>{isLegalEntity(v.TIN) ? `${t("esp_select.legal")}` : `${t("esp_select.individual")}`}</span>
                </div>
                <div><span style={{fontWeight: 700}}>{t("esp_select.surname")}: </span>{v.CN}</div>
                {
                  v.O
                    ? <div><span style={{fontWeight: 700}}>{t("esp_select.organisation")}: </span>{v.O}</div>
                    : null
                }
                {
                  v?.expired
                    ? <div
                      style={{color: 'red'}}>{t("esp_select.term")} {v.validFrom.ddmmyyyy()} - {v.validTo.ddmmyyyy()} da
                      tugagan</div>
                    : <div><span
                      style={{fontWeight: 700}}>{t("esp_select.term")}: </span> {v.validFrom.ddmmyyyy()} - {v.validTo.ddmmyyyy()}
                    </div>
                }
              </div>}
              onChange={option => setSelectedKey(option)}
              components={{
                SingleValue: ({children, data: {v}, ...props}) => {
                  return (
                    <components.SingleValue {...props}>
                      {v.TIN} - {v.CN}
                    </components.SingleValue>
                  )
                }
              }}
              placeholder={"Выберите ключ"}
              isSearchable={false}
            />
            <Captcha
              onClick={signSystem}
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default Imzo;