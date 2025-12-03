import React, {memo, useEffect, useState} from "react";
import {
  Map,
  ZoomControl,
  Placemark,
  FullscreenControl,
  // SearchControl,
  // GeolocationControl,
  // TypeSelector,
  YMaps
} from "@pbe/react-yandex-maps";
import MarkerIcon from 'assets/images/marker.svg'
import config from 'config';

const YandexMap = ({
                     lat = 41.311081,
                     long = 69.240562,
                     width = "100%",
                     height = "450px",
                     className,
                     language,
                     onClick = () => {}
                   }) => {
  const [lang, setLang] = useState(language === "oz" ? "uz_UZ" : "ru_RU")
  
  useEffect(() => {
    setLang(language === "oz" ? "uz_UZ" : "ru_RU")
    
    return () => {
      setLang("");
    };
  }, [language])
  
  if (lat && long && lang) {
    return <>
      <YMaps key={lang} query={{lang, apikey: config.YANDEX_KEY}}>
        <Map
          width={width}
          height={height}
          className={className}
          state={{
            zoom: 10,
            center: [lat, long],
          }}
          onClick={(ins) => onClick(ins.get('coords'))}
        >
          <ZoomControl/>
          <FullscreenControl/>
          {/*<SearchControl/>*/}
          {/*<GeolocationControl/>*/}
          {/*<TypeSelector/>*/}
          <Placemark
            geometry={[lat, long]}
            options={{
              iconLayout: 'default#image',
              iconImageHref: MarkerIcon,
              iconImageSize: [60, 60],
            }}
          />
        </Map>
      </YMaps>
    </>
  }
  else {
    return null
  }
};

export default memo(YandexMap)
