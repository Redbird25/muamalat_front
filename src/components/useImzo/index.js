// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react';
import {IMZOClient as EIMZOClient} from './js/e-imzo-client';

require("./js/e-imzo");
require("./js/e-imzo-client");

const EIMZO_MAJOR = 3;
const EIMZO_MINOR = 37;

const errorCAPIWS = 'Ошибка соединения с 2222E-IMZO. Возможно у вас не установлен модуль E-IMZO или Браузер E-IMZO.';
const errorBrowserWS = 'Браузер не поддерживает технологию WebSocket. Установите последнюю версию браузера.';
const errorUpdateApp = 'ВНИМАНИЕ !!! Установите новую версию приложения E-IMZO или Браузера E-IMZO.<br /><a href="https://e-imzo.uz/main/downloads/" role="button">Скачать ПО E-IMZO</a>';
const errorWrongPassword = 'Пароль неверный.';

EIMZOClient.API_KEYS = [
  'localhost', '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
  '127.0.0.1', 'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
  'null', 'E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D',
  'new-ekspertiza.mc.uz', 'BC914142E74D961E3922458C33B312B0A73B5FB8C3A0EA6C708C557FC7ED33BC3A384E72492C9185160BD67190A318AF4D0849B3F73ECD3F90EA77201E4F5732'
];

function useImzo() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  
  useEffect(() => {
    EIMZOClient.checkVersion(function (major, minor) {
      var newVersion = EIMZO_MAJOR * 100 + EIMZO_MINOR;
      var installedVersion = parseInt(major) * 100 + parseInt(minor);
      setLoading(true);
      if (installedVersion < newVersion) {
        setError(errorUpdateApp);
        setLoading(false);
      } else {
        EIMZOClient.installApiKeys(function () {
          EIMZOClient.listAllUserKeys(function (o, i) {
            return "itm-" + o.serialNumber + "-" + i;
          }, function (itemId, v) {
            return {itemId, v};
          }, function (items, firstId) {
            if (items) {
              setData(items);
            }
            setLoading(false);
          }, function (e, r) {
            setLoading(false);
            setError(errorCAPIWS);
          });
        }, function (e, r) {
          if (r) {
            if (r.indexOf("BadPaddingException") !== -1) {
              console.log(errorWrongPassword)
              setError(errorWrongPassword);
            } else {
               setError(r);
            }
          } else {
            if (e) {
              setError(errorCAPIWS + " : " + e);
            } else {
              setError(errorBrowserWS);
            }
          }
          setLoading(false);
        });
      }
    }, function (e, r) {
      if (r) {
        setError(r);
      } else {
        setError(e);
      }
      setLoading(false);
    });
    
  }, []);
  
  return {isLoading, data, error};
}

export default useImzo;