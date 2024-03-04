import { useEffect, useState } from "react";
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import useGeolocation from "react-hook-geolocation";
import SearchForm from "./SearchForm";
import MapList from "./MapList";
import styles from './KakaoMap.module.css'
import MobileNavigation from "./MobileNavigation";
import Modal from './Modal'

const KakaoMap = () => {
  const { kakao } = window;

  const geolocation = useGeolocation({
    enableHighAccuracy: true, // 가장 높은 정확도의 위치 정보를 수신하고 싶을 때의 불리언 값
    maximumAge: 30000, //캐시에 저장한 위치 정보를 반환할 수 있는 최대 시간
    timeout: 27000, //위치를 반환할 때 소모 할 수 있는 최대 시간
  });

  const [searchKeyWord, setSearchKeyWord] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);

  const [info, setInfo] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [name, setName] = useState();
  const [map, setMap] = useState();
  const [openModal, setOpenModal] = useState(false);

  const [location, setLocation] = useState({
    // 위치 기본 값
    center: {
      lat: null,
      lng: null,
    },
    isPanto: false,
    errMsg: null,
    isLoading: true,
  });

  const geoLocationHandler = (value) => {
    setSearchLocation(value);
  };

  const keyWordHandler = (value) => {
    setSearchKeyWord(value);
  };

  const onMoveLocation = (data) => {
    setLocation({
      center: data ? data.center : location.center,
      isPanto: true,
    });
  };

  const onSearch = (data) => {
    setLocation({
      center: data ? data[0].center : location.center,
      isPanto: true,
    });
    setPositions(data);
  };

  const onMarkersHandler = (data) => {
    setIsOpen((prev) => !prev);
    setName(data);
  };

  const onMouseOut = () => {
    setIsOpen((prev) => !prev);
  };

  const openListHandler = () => {
    setOpenModal((prev) => !prev)
  };

  const onDragMap = (map) => {
    const latlng = map.getCenter();
    setLocation({
      center: {
        lat: latlng.getLat(),
        lng: latlng.getLng(),
      },
      isPanto: false,
    })
    setSearchKeyWord(null)
    setSearchLocation(null)
  };

  const onNowLocation = () => {
    setLocation((prev) => ({
      ...prev,
      center: {
        lat: geolocation.latitude,
        lng: geolocation.longitude
      },
      isPanto: true,
    }))
  }

  useEffect(() => {
    const geocoder = new kakao.maps.services.Geocoder();
    // 지역검색

    const places = new kakao.maps.services.Places();
    // 키워드 검색

    const defaultOptions = {
      x: geolocation.longitude,
      y: geolocation.latitude,
      raduis: 20000,
      size: 15,
      sort: kakao.maps.services.SortBy.ACCURACY,
    };
    // 검색 엔진 사용시 기본 옵션(현재 위치 기반)

    const callback = (result, status) => {
      const infoArray = [];
      const markers = [];

      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();

        console.log(result);
        setLocation((prev) => ({
          ...prev,
          center: {
            lat: result[0].y,
            lng: result[0].x,
          },
        }));

        for (let i = 0; i < result.length; i++) {
          markers.push({
            position: {
              lat: result[i].y,
              lng: result[i].x,
            },
            address: result[i].address_name,
            name: result[i].place_name ? result[i].place_name : null,
          });
          bounds.extend(new kakao.maps.LatLng(result[i].y, result[i].x));
        }
        setPositions(markers);

        for (const key in result) {
          infoArray.push({
            id: key,
            address: result[key].address_name,
            name: result[key].place_name,
            road_name: result[key].road_address_name,
            phone: result[key].phone,
            center: {
              lat: result[key].y,
              lng: result[key].x,
            },
            categoryName: result[key].category_name,
            category: result[key].category
          });
          setInfo(infoArray);
        }
      }
    };

    if (searchKeyWord !== null) {
      places.keywordSearch(searchKeyWord, callback, defaultOptions);
      setOpenModal(true)
    }

    if (searchLocation !== null) {
      geocoder.addressSearch(searchLocation, callback);
      setOpenModal(true)
    }
  }, [searchKeyWord, searchLocation]);

  useEffect(() => {
    //현재 위치로 초기화
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position)
          setLocation((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
            isLoading: false,
          }))
        },
        (err) => {
          setLocation((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }))
        }
      )
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setLocation((prev) => ({
        ...prev,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false,
      }))
    }
  }, []);

  return (
    <>
      <SearchForm
        onSearch={onSearch}
        onKeyword={keyWordHandler}
        onGeoLocation={geoLocationHandler}
      />
      <div>
      </div>
      <Map // 지도를 표시할 Container
        id="map"
        isPanto={location.isPanto}
        center={location.center}
        style={{
          // 지도의 크기
          width: "100%",
          height: `calc(100vh - 146px)`,
        }}
        level={3} // 지도의 확대 레벨
        onDragEnd={(map) => onDragMap(map)}
      >
        <div onClick={onNowLocation} className={styles.nowLocation}>
          <button></button>
        </div>
        {positions.map((data) => (
          <MapMarker
            className={styles.markerInfo}
            onMouseOver={onMarkersHandler.bind(null, data)}
            onMouseOut={onMouseOut}
            position={data.position}
          >
            {isOpen && name && name.name === data.name && (
              <div className={styles.markerInfo}>{data.name ? data.name : data.address}</div>
            )}
          </MapMarker>
        ))}
        {openModal && <Modal info={info} onMoveLocation={onMoveLocation} /> }
        <ZoomControl />
      </Map>
      <MobileNavigation openListHandler={openListHandler} />
    </>
  );
};

export default KakaoMap;
