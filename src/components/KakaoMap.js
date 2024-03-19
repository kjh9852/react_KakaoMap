import { useEffect, useState, useContext } from "react";
import {
  Map,
  MapMarker,
  ZoomControl,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";
import useGeolocation from "react-hook-geolocation";
import MapContext from "../store/map-context";
import SearchForm from "./SearchForm";
import styles from "./KakaoMap.module.css";
import MobileNavigation from "./MobileNavigation";
import FavoriteList from "./FavoriteList";
import SearchList from "./SearchList";
import CategoryList from "./CategoryList";
import allLocation from '../images/allLocaiton.png'

const KakaoMap = () => {
  const { kakao } = window;

  const geolocation = useGeolocation({
    enableHighAccuracy: true, // 가장 높은 정확도의 위치 정보를 수신하고 싶을 때의 불리언 값
    maximumAge: 30000, //캐시에 저장한 위치 정보를 반환할 수 있는 최대 시간
    timeout: 27000, //위치를 반환할 때 소모 할 수 있는 최대 시간
  });
  const imageSize = {
    width: 24,
    height: 34,
  };

  const mapCtx = useContext(MapContext);

  const [searchKeyWord, setSearchKeyWord] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [onCategory, setOnCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState();

  const [info, setInfo] = useState([]);
  const [isFavorite, setIsFavorite] = useState([]);

  const [markers, setMarkers] = useState({
    src: allLocation,
    size: imageSize,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [name, setName] = useState();
  const [map, setMap] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [openFavorite, setOpenFavorite] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const [location, setLocation] = useState({
    center: {
      lat: null,
      lng: null,
    },
    isPanto: false,
    errMsg: null,
    isLoading: true,
  });
  // 최초 위치 deafault 값

  const geoLocationHandler = (value) => {
    setSearchLocation(value);
  };
  // 장소 검색 저장

  const keyWordHandler = (value) => {
    setSearchKeyWord(value);
  };
  // 키워드 저장

  const onMoveLocation = (data) => {
    setLocation({
      center: data ? data.center : location.center,
      isPanto: true,
    });
  };
  // 검색 리스트에 있는 장소 클릭 시 위치 이동

  const onSearch = (data) => {
    setLocation({
      center: data ? data[0].center : location.center,
      isPanto: true,
    });
    setPositions(data);
  };
  // 검색 시 상단 리스트에 있는 위치 저장

  const onMarkersHandler = (data) => {
    setIsOpen((prev) => !prev);
    setName(data);
  };
  // 마우스 오버시 마커 인포 보이기

  const onMouseOut = () => {
    setIsOpen((prev) => !prev);
  };
  // 마우스 아웃시 마커 숨김

  const openFavoritHandler = () => {
    setOpenModal(false);
    setOpenFavorite((prev) => !prev);
  };
  // 즐겨찾기 리스트 오픈 핸들러

  const openCategoryHandler = () => {
    setOpenMenu((prev) => !prev);
  };
  // 카테고리 리스트 오픈 핸들러

  const openListHandler = (favoriteData) => {
    setOpenFavorite(false);
    setOpenModal((prev) => !prev);
  };
  // 검색 리스트 오픈 핸들러

  const onCategoryHandler = (data) => {
    setOnCategory(data);
    setSearchKeyWord(null);
    setSearchLocation(null);
  };
  // 카테고리 클릭 핸들러

  const onCategorySrc = (data) => {
    setMarkers((prev) => ({
      ...prev,
      src: data ? data : allLocation,
    }));
    console.log(markers);
  };

  const onDragMap = (map) => {
    const latlng = map.getCenter();
    setLocation({
      center: {
        lat: latlng.getLat(),
        lng: latlng.getLng(),
      },
      isPanto: false,
    });
    setSearchKeyWord(null);
    setSearchLocation(null);
  };
  // 지도 드래그시 현재 위치 값 변경

  const onNowLocation = () => {
    setLocation((prev) => ({
      ...prev,
      center: {
        lat: geolocation.latitude,
        lng: geolocation.longitude,
      },
      isPanto: true,
    }));
  };
  // 현재 위치 값 저장

  useEffect(() => {
    setSelectedCategory(onCategory);
    if (selectedCategory === onCategory) {
    }
  }, [onCategory, selectedCategory]);

  useEffect(() => {
    const geocoder = new kakao.maps.services.Geocoder();
    // 지역검색
    const places = new kakao.maps.services.Places();
    // 키워드 검색
    const categorys = new kakao.maps.services.Places();
    // 카테고리 검색

    const defaultOptions = {
      x: geolocation.longitude,
      y: geolocation.latitude,
      raduis: 20000,
      size: 15,
      sort: kakao.maps.services.SortBy.ACCURACY,
    };
    // 검색 시 default 옵션(현재 위치 기반)

    const callback = (result, status) => {
      const infoArray = [];
      const markers = [];
      //  초기화

      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();

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
            infoPosistion : {
              lat: result[i].y,
              lng: result[i].x,
            },
            address: result[i].address_name,
            name: result[i].place_name ? result[i].place_name : null,
          });
          bounds.extend(new kakao.maps.LatLng(result[i].y, result[i].x));
        }
        setPositions(markers);
        // 검색, 카테고리 사용 시 마커 표시

        if (searchKeyWord) {
          for (const key in result) {
            setOnCategory(null);
            setInfo([]);
            infoArray.push({
              id: result[key].id,
              address: result[key].address_name,
              name: result[key].place_name,
              road_name: result[key].road_address_name,
              phone: result[key].phone,
              center: {
                lat: result[key].y,
                lng: result[key].x,
              },
              categoryName: result[key].category_name,
              category: result[key].category_group_name,
              favorite: false,
            });
            setInfo(infoArray);
          }
          // info State 초기화 후 키워드 검색 시 infoArray에 저장 후 info State에 저장
          return;
        }

        if (onCategory) {
          for (const key in result) {
            setSearchKeyWord(null);
            setInfo([]);
            infoArray.push({
              id: result[key].id,
              address: result[key].address_name,
              name: result[key].place_name,
              road_name: result[key].road_address_name,
              phone: result[key].phone,
              center: {
                lat: result[key].y,
                lng: result[key].x,
              },
              categoryName: result[key].category_name,
              category: result[key].category_group_name,
              favorite: false,
            });
            setInfo(infoArray);
          }
          // info State 초기화 후 카테고리 클릭 시 infoArray에 저장 후 info State에 저장
        }
        return;
      }
    };

    if (searchKeyWord !== null) {
      places.keywordSearch(searchKeyWord, callback, defaultOptions);
      setOpenModal(true);
      setMarkers((prev) => ({
        ...prev,
        src: allLocation,
      }));
    } // 키워드 검색 (키워드, 콜백함수, 기본옵션)

    if (onCategory !== null) {
      categorys.categorySearch(onCategory, callback, defaultOptions, {
        useMapBounds: true,
      });
    } // 카테고리 검색 (키워드, 콜백함수, 기본옵션, {부드럽게 이동})

    if (searchLocation !== null) {
      geocoder.addressSearch(searchLocation, callback);
      setOpenModal(true);
      setMarkers((prev) => ({
        ...prev,
        src: allLocation,
      }));
    } // 일반 검색 (키워드, 콜백함수)
  }, [searchKeyWord, searchLocation, onCategory]);

  useEffect(() => {
    //현재 위치로 초기화
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setLocation((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
            isLoading: false,
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

  const addFavoriteHandler = (data) => {
    mapCtx.addList({
      id: data.id,
      name: data.name,
      address: data.address,
      categoryName: data.categoryName,
      phone: data.phone,
      center: data.center,
      favorite: true,
    });

    const changedList = info.map((list) => {
      if (list.id === data.id) {
        return { ...data, favorite: true };
      } else return list;
    });
    setInfo(changedList);
    setIsFavorite(changedList);
  };

  const removeFavoriteHandler = (data) => {
    mapCtx.removeList(data.id);

    const changedList = info.map((list) => {
      if (list.id === data.id) {
        return { ...data, favorite: false };
      } else return list;
    });
    setInfo(changedList);
  };
  console.log(positions);
  return (
    <div style={{ height: "100%" }}>
      <SearchForm
        onSearch={onSearch}
        onKeyword={keyWordHandler}
        onGeoLocation={geoLocationHandler}
      />
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
        <div onClick={onNowLocation} className={styles.nowLocation}>
          <button></button>
        </div>
        {/* 현 위치 버튼 */}

        {positions.map((data) => (
          <div>
            <MapMarker
              className={styles.markerInfo}
              onMouseOver={onMarkersHandler.bind(null, data)}
              onMouseOut={onMouseOut}
              position={data.position}
              image={{
                src: markers.src,
                size: imageSize,
              }}
            />
            {isOpen && name && name.name === data.name && (
              <CustomOverlayMap position={data.infoPosistion} yAnchor={2}>
                <div className={styles.markerInfo}>
                  <p>{data.name ? data.name : data.address}</p>
                </div>
              </CustomOverlayMap>
            )}
          </div>
        ))}
        {/* 맵 마커 */}

        {!openModal && (
          <CategoryList
            openMenu={openMenu}
            onCategory={onCategoryHandler}
            onCategorySrc={onCategorySrc}
          />
        )}
        {/* 카테고리 리스트 */}

        {!openFavorite && info.length >= 1 && (
          <SearchList
            openModal={openModal}
            openMenu={openFavorite}
            list={info}
            onMoveLocation={onMoveLocation}
            addFavoriteHandler={addFavoriteHandler}
          />
        )}
        {/* 검색 리스트 */}

        {!openModal && mapCtx.lists.length >= 1 && (
          <FavoriteList
            openMenu={openModal}
            openModal={openFavorite}
            list={mapCtx.lists}
            onMoveLocation={onMoveLocation}
            removeFavoriteHandler={removeFavoriteHandler}
          />
        )}
        {/* 좋아요 리스트 */}

        <ZoomControl />
        {/* 지도 줌 옵션 */}
      </Map>
      <MobileNavigation
        openList={openListHandler}
        openFavorite={openFavoritHandler}
        openCategory={openCategoryHandler}
      />
    </div>
  );
};

export default KakaoMap;
