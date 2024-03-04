import { useEffect, useRef, useState } from "react";
import useGeolocation from "react-hook-geolocation";

const Map = (props) => {
  const geolocation = useGeolocation({
    enableHighAccuracy: true, // 가장 높은 정확도의 위치 정보를 수신하고 싶을 때의 불리언 값
    maximumAge: 10000, //캐시에 저장한 위치 정보를 반환할 수 있는 최대 시간
    timeout: 12000, //위치를 반환할 때 소모 할 수 있는 최대 시간
  });

  const [location,setLocation] = useState({
    latitude: geolocation.latitude,
    longitude: geolocation.longitude
  })
  
  console.log(location);

  const { kakao } = window;
  const [kakaoMap, setKakaoMap] = useState(null);

  const container = useRef();

  const moveLatLng = (data) => {
    const newLatLng = new kakao.maps.LatLng(data.y, data.x);
  };

  useEffect(() => {
    const defaultOptions = {
      center: new kakao.maps.LatLng(geolocation.latitude, geolocation.longitude), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    }
    const map = new kakao.maps.Map(container.current, defaultOptions); //지도 생성 및 객체 리턴

    const markerPositions = defaultOptions.center;
    
    const marker = new kakao.maps.Marker({
      position: markerPositions
    })
    marker.setMap(map);
    setKakaoMap(map);

  }, []);

  return (
      <div style={{width: '100%', height: '100vh'}} id="container" ref={container}></div>
  );
};

export default Map;
