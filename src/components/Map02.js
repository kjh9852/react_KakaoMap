import { useState, useEffect } from "react";

export default function MapTest({handleGeolocation, children}) {
  const { kakao } = window;
  const [map, setMap] = useState();
  const [zoomControl, setZoomControl] = useState();
  const [geoLocation, setGeoLocation] = useState({
    lat: null,
    lng: null,
    // 기본 위치 설정
  });
  const [position, setPosition] = useState([])

  const level = 3
  const centerLatlng = new kakao.maps.LatLng(geoLocation.lat, geoLocation.lng)
  const mapOption = {
    center: centerLatlng, // 지도의 중심좌표
    level: level, // 지도의 확대 레벨
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) =>
        setGeoLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      );
    }
  }, []);

  useEffect(() => {
    const mapContainer = document.querySelector("#map");
    setZoomControl(new kakao.maps.ZoomControl());
    setMap(new kakao.maps.Map(mapContainer, mapOption));
    setPosition(new kakao.maps.LatLng(33.450701, 126.570667)); 
    handleGeolocation(geoLocation);
  }, [geoLocation]);
       
  if(zoomControl) {
    map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT); 
  }
  var marker = new kakao.maps.Marker({
    position: position
  });

  if(marker) {
    marker.setMap(map);
  }

  return (
    <div
      id="map"
      style={{
        // 지도의 크기
        width: "100%",
        minHeight: "calc(100svh - 142px)",
      }}
    >
      {children}
    </div>
  );
}
