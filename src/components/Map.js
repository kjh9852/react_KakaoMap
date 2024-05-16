import { useState, useEffect } from "react";
import { Map, ZoomControl } from "react-kakao-maps-sdk";
import styles from "./Map.module.css";

export default function ReactMap() {
  const { kakao } = window;

  const [geoLocation, setGeoLocation] = useState();
  const [currentLoc, setCurrentLoc] = useState({
    center: {
      lat: null,
      lng: null,
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setGeoLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, [navigator.geolocation]);

  const [showNow, setShowNow] = useState(false);
  const [location, setLocation] = useState({
    center: {
      lat: null,
      lng: null,
    },
    isPanto: false,
    errMsg: null,
    isLoading: true,
  });

  const onNowLocation = () => {
    setCurrentLoc(() => ({
      center: {
        lat: geoLocation.lat,
        lng: geoLocation.lon,
      },
    }));

    setLocation((prev) => ({
      ...prev,
      center: {
        lat: geoLocation.lat,
        lng: geoLocation.lon,
      },
      isPanto: true,
    }));
    setShowNow(true);
  };

  const onDragMap = (map) => {
    setShowNow(false);
    const latlng = map.getCenter();
    setLocation({
      center: {
        lat: latlng.getLat(),
        lng: latlng.getLng(),
      },
      isPanto: false,
    });
  };
  // 지도 드래그시 현재 위치 값 변경

  useEffect(() => {
    //최초 렌더링 현재 위치로 초기화
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
            isLoading: false,
          }));
          setCurrentLoc(() => ({
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
          }));
        },
        (err) => {
          setLocation((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setLocation((prev) => ({
        ...prev,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false,
      }));
    }
  }, []);

  return (
    <Map // 지도를 표시할 Container
      id="map"
      isPanto={location.isPanto}
      center={location.center}
      style={{
        // 지도의 크기
        width: "100%",
        minHeight: "calc(100svh - 142px)",
      }}
      level={3} // 지도의 확대 레벨
      onDragEnd={(map) => onDragMap(map)}
    >
      <div onClick={onNowLocation} className={styles.container}>
        <div className={styles.nowLocation}>
          <button></button>
        </div>
        {showNow && <span>현재 위치</span>}
      </div>
    </Map>
  );
}
