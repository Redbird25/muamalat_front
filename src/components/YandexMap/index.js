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

const YandexMap = ({lat, long, width="100%", height=450, className, language, onClick}) => {
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

YandexMap.defaultProps = {
  lat: 41.311081,
  long: 69.240562,
  width: '100%',
  height: '450px',
  onClick: () => {
  }
}

export default memo(YandexMap)

/*
import React, {memo, useEffect, useRef, useState} from "react";
import {
  Map,
  ZoomControl,
  Placemark,
  FullscreenControl,
  SearchControl,
  GeolocationControl,
  TypeSelector, YMaps
} from "@pbe/react-yandex-maps";
import MarkerIcon from 'assets/images/marker-map.png'

const YandexMap = ({
                     lat = 41.311081,
                     long = 69.240562,
                     p_lat,
                     p_long,
                     width = "100%",
                     height = "200px",
                     className,
                     onClick,
                     noPlugin = false,
                     loadMap,
                     callBackConfirm,
                     placeMarker = false,
                     markerBalloon = false
                   }) => {
  const [mapConstructor, setMapConstructor] = useState(null);
  const [balloonContent, setBalloonContent] = useState(null);
  const mapRef = useRef(null);
  
  
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.id === "confirm-yandex-map") {
        setBalloonContent(prevState => ({...prevState, confirm: true}))
        callBackConfirm(true)
      }
    };
    
    document.addEventListener("click", handleClick);
    
    return () => {
      document.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  if (lat && long) {
    return <>
      <YMaps
        query={{lang: "uz_UZ", apikey: "e698b123-c0f5-4809-aa6c-b2fea426bdbc"}}
      >
        <Map
          modules={["geocode", "balloon"]}
          width={width}
          height={height}
          className={className}
          onLoad={setMapConstructor}
          
          state={{
            zoom: 12,
            center: [lat, long],
          }}
          onClick={(ins) => {
            const newCoords = mapRef.current.getCenter();
            mapConstructor.geocode(newCoords).then((res) => {
              const nearest = res.geoObjects.get(0);
              setBalloonContent({
                state: nearest.properties.get("metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName"),
                street: nearest.properties.get("name"),
                region: nearest.properties.get("metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName"),
                district: nearest.properties.get("metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.DependentLocality.DependentLocalityName"),
                confirm: false,
              })
            });
            onClick(ins.get('coords'))
          }}
          options={{
            yandexMapDisablePoiInteractivity: true
          }}
          instanceRef={mapRef}
        >
          {
            !noPlugin
              ? <>
                <SearchControl/>
                <GeolocationControl/>
                <TypeSelector/>
                <Placemark
                  geometry={[p_lat, p_long]}
                  options={{
                    iconLayout: 'default#image',
                    iconImageHref: MarkerIcon,
                    iconImageSize: [60, 60],
                  }}
                />
              </>
              : null
          }
          {
            placeMarker && mapConstructor
              ? <Placemark
                modules={markerBalloon ? ["geoObject.addon.balloon"] : []}
                geometry={[p_lat, p_long]}
                properties={{
                  balloonContentHeader: `${balloonContent?.street ?? ""}`,
                  balloonContentBody: `${balloonContent?.state ?? ""}${balloonContent?.region ? ", " + balloonContent.region : ""}${balloonContent?.district ? ", " + balloonContent.district : ""}`,
                  balloonContentFooter: `<button type="button" class="btn btn-confirm mt-2 w-100 ${balloonContent?.confirm ? "disabled" : ""}" id="confirm-yandex-map">Tasdiqlash</button>`
                }}
                instanceRef={ref => {
                  if (p_lat && p_long && markerBalloon) {
                    ref && ref.balloon.open();
                  }
                }}
                options={{
                  iconLayout: 'default#image',
                  iconImageHref: MarkerIcon,
                  iconImageSize: [40, 40],
                  iconImageOffset: [-20, -42],
                  balloonOffset: [-75, -45],
                  hideIconOnBalloonOpen: !(p_lat && p_long)
                }}
              />
              : null
          }
          <ZoomControl/>
          <FullscreenControl/>
        </Map>
      </YMaps>
    </>
  } else {
    return null
  }
};

YandexMap.defaultProps = {
  lat: 41.311081,
  long: 69.240562,
  onClick: () => {
  },
  callBackConfirm: () => {
  
  }
}

export default memo(YandexMap)*/
