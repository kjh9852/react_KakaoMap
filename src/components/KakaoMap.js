import { useEffect, useState, useContext, useCallback, useMemo } from "react";
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
import MobileNavigation from "./Menu/MobileNavigation";
import FavoriteList from "./List/FavoriteList";
import SearchList from "./List/SearchList";
import CategoryList from "./List/CategoryList";
import allLocation from "../images/allLocaiton.png";
import Marker from "./Marker";
import LoadingSpinner from "./UI/LoadingSpinner";
import SearchCount from "./UI/SearchCount";

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

  const [onCategory, setOnCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState();

  const [info, setInfo] = useState([]);
  const [isFavorite, setIsFavorite] = useState([]);

  const [searchResult, setSearchResult] = useState({
    location: null,
    keyword: null,
  });

  const [currentPage, setCurrentPage] = useState();
  const [pageNum, setPageNum] = useState([]);

  const [isActive, setIsActive] = useState();

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
  const [showNow , setShowNow] = useState(false);
  const [maxPageCount, setMaxPageCount] = useState('');
  const [location, setLocation] = useState({
    center: {
      lat: null,
      lng: null,
    },
    isPanto: false,
    errMsg: null,
    isLoading: true,
  });
  // 최초 위치 default 값

  const geoLocationHandler = (value) => {
    setSearchResult({
      keyword: null,
      location: value && value,
    });
  };
  // 장소 검색 저장

  const keyWordHandler = (value) => {
    setSearchResult({
      location: null,
      keyword: value && value,
    });
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

  const onActiveHandler = (data) => {
    switch (data) {
      case 0:
        setOpenMenu(false);
        setOpenFavorite(false);
        setOpenModal((prev) => {
          if (info.length > 0) {
            return !prev;
          } else return;
        });
        break;
      case 1:
        setOpenMenu(false);
        setOpenModal(false);
        setOpenFavorite((prev) => {
          if (info.length > 0) {
            return !prev;
          } else return;
        });
        break;
      case 2:
        setOpenFavorite(false);
        setOpenModal(false);
        setOpenMenu((prev) => !prev);
        break;
      default:
        break;
    }
  };
  // 하단 네비게이션 반응

  const onCategoryHandler = (data) => {
    setOnCategory(data && data.code);
    setSearchResult({
      location: null,
      keyword: null,
    });
    setMarkers((prev) => ({
      ...prev,
      src: data ? data.src : allLocation,
    }));
  };
  // 카테고리 클릭 핸들러

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
    setSearchResult({
      location: null,
      keyword: null,
    });
  };
  // 지도 드래그시 현재 위치 값 변경
  console.log(showNow);

  const onNowLocation = () => {
    setLocation((prev) => ({
      ...prev,
      center: {
        lat: geolocation.latitude,
        lng: geolocation.longitude,
      },
      isPanto: true,
    }));
    setShowNow(true);
  };
  // 현재 위치 값 저장

  const onShowHide = () => {
    setShowNow((prev) => !prev)
  }

  useEffect(() => {
    const pageTime = setTimeout(() => {
      setMaxPageCount('')
    }, [3000])

    if(maxPageCount !== '') {
      clearTimeout(pageTime);
    }
  }, [maxPageCount]);

  const displayMarker = (data) => {
    const bounds = new kakao.maps.LatLngBounds();
    const markers = [];

    for (let i = 0; i < data.length; i++) {
      markers.push({
        position: {
          lat: data[i].y,
          lng: data[i].x,
        },
        infoPosistion: {
          lat: data[i].y,
          lng: data[i].x,
        },
        address: data[i].address_name,
        name: data[i].place_name ? data[i].place_name : null,
      });
      bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    }
    setPositions(markers);
  }; // 마커 생성

  const displayPagination = (pagination) => {
    const pageArray = Array.from({ length: pagination.last }, (v, i) => i + 1);
    setPageNum([...pageArray]);
    setCurrentPage(1);

    setMaxPageCount(pagination.totalCount)

    return;
  }; // 리스트 페이지 생성

  const onPageNumHandler = (page) => {
    setCurrentPage(page);
    searchPlace(page);
    console.log(page);
  }; // current page 감지

  const getList = (data) => {
    const infoArray = [];

    if (info.length > 0) {
      setInfo([]);
    }
    // list있을시 초기화

    if (searchResult.keyword !== null) {
      for (const key in data) {
        setOnCategory(null);
        infoArray.push({
          id: data[key].id,
          address: data[key].address_name,
          name: data[key].place_name,
          road_name: data[key].road_address_name,
          phone: data[key].phone,
          center: {
            lat: data[key].y,
            lng: data[key].x,
          },
          categoryName: data[key].category_name,
          category: data[key].category_group_name,
          favorite: false,
        });
        setInfo(infoArray);
      }
      return info;
      // info State 초기화 후 키워드 검색 시 infoArray에 저장 후 info State에 저장
    }

    if (onCategory) {
      for (const key in data) {
        setSearchResult({
          location: null,
          keyword: null,
        });
        infoArray.push({
          id: data[key].id,
          address: data[key].address_name,
          name: data[key].place_name,
          road_name: data[key].road_address_name,
          phone: data[key].phone,
          center: {
            lat: data[key].y,
            lng: data[key].x,
          },
          categoryName: data[key].category_name,
          category: data[key].category_group_name,
          favorite: false,
        });
        setInfo(infoArray);
      }
      return info;
      // info State 초기화 후 카테고리 클릭 시 infoArray에 저장 후 info State에 저장
    }

    if (searchResult.location !== null) {
      for (const key in data) {
        setOnCategory(null);
        infoArray.push({
          id: data[key].id,
          address: data[key].address_name,
          name: data[key].place_name,
          road_name: data[key].road_address_name,
          phone: data[key].phone,
          center: {
            lat: data[key].y,
            lng: data[key].x,
          },
          categoryName: data[key].category_name,
          category: data[key].category_group_name,
          favorite: false,
        });
        setInfo(infoArray);
      }
      return info;
    }
  }; // 리스트에 저장

  const geocoder = new kakao.maps.services.Geocoder();
  // 지역검색
  const places = new kakao.maps.services.Places();
  // 키워드 검색
  const categorys = new kakao.maps.services.Places();
  // 카테고리 검색

  const searchPlace = (page) => {
    const addressOption = {
      page: page || 1,
      size: 15,
      analyze_type: kakao.maps.services.AnalyzeType.EXACT,
    };
    const defaultOptions = {
      x: geolocation.longitude,
      y: geolocation.latitude,
      raduis: 20000,
      page: page || 1,
      size: 15,
      sort: kakao.maps.services.SortBy.DISTANCE,
    };
    // 검색 시 default 옵션(현재 위치 기반)

    if (searchResult.keyword !== null) {
      places.keywordSearch(searchResult.keyword, searchDB, defaultOptions);
      setMarkers((prev) => ({
        ...prev,
        src: allLocation,
      }));
    } // 키워드 검색 (키워드, 콜백함수, 기본옵션)

    if (onCategory !== null) {
      categorys.categorySearch(onCategory, searchDB, defaultOptions, {
        useMapBounds: true,
      });
    } // 카테고리 검색 (키워드, 콜백함수, 기본옵션, {부드럽게 이동})

    if (searchResult.location !== null) {
      geocoder.addressSearch(searchResult.location, searchDB, addressOption);
      setMarkers((prev) => ({
        ...prev,
        src: allLocation,
      }));
    }
  }; // 페이지 이동시

  useEffect(() => {
    const addressOption = {
      page: 1,
      size: 15,
      analyze_type: kakao.maps.services.AnalyzeType.EXACT,
    };
    const defaultOptions = {
      x: geolocation.longitude,
      y: geolocation.latitude,
      raduis: 20000,
      page: 1,
      size: 15,
      sort: kakao.maps.services.SortBy.DISTANCE,
    };
    // 검색 시 default 옵션(현재 위치 기반)

    if (searchResult.keyword !== null) {
      places.keywordSearch(
        searchResult.keyword,
        updateSearchDB,
        defaultOptions
      );
      setOpenModal((prev) => {
        if (prev) {
          return setOpenModal(prev);
        } else return setOpenModal(!prev);
      });
      setMarkers((prev) => ({
        ...prev,
        src: allLocation,
      }));
    } // 키워드 검색 (키워드, 콜백함수, 기본옵션)

    if (onCategory !== null) {
      categorys.categorySearch(onCategory, updateSearchDB, defaultOptions, {
        useMapBounds: true,
      });
    } // 카테고리 검색 (키워드, 콜백함수, 기본옵션, {부드럽게 이동})

    if (searchResult.location !== null) {
      geocoder.addressSearch(
        searchResult.location,
        updateSearchDB,
        addressOption
      );
      console.log(info);
      setOpenFavorite((prev) => {
        if (prev) {
          return !prev;
        } else return prev;
      });
      setMarkers((prev) => ({
        ...prev,
        src: allLocation,
      }));
    }
    // 일반 검색 (키워드, 콜백함수)
  }, [searchResult.location, searchResult.keyword, onCategory]);
  // 최초 검색시

  const searchDB = (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      setLocation((prev) => ({
        ...prev,
        center: {
          lat: result[0].y,
          lng: result[0].x,
        },
      }));
      displayMarker([...result]); // marker 생성
      getList([...result]); // list 생성
    }
  };

  const updateSearchDB = (result, status, pagination) => {
    if (status === kakao.maps.services.Status.OK) {
      setLocation((prev) => ({
        ...prev,
        center: {
          lat: result[0].y,
          lng: result[0].x,
        },
      }));
      displayPagination(pagination);
      displayMarker([...result]); // marker 생성
      getList([...result]); // list 생성
    }
  };

  useEffect(() => {
    //최초 현재 위치로 초기화
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
  // 현재 위치로 초기화

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
    console.log(mapCtx.lists);
    const changedList = info.map((list) => {
      if (list.id === data.id) {
        return { ...data, favorite: true };
      } else return list;
    });
    setInfo(changedList);
    setIsFavorite(changedList);
  };
  // 즐겨찾기 추가

  const removeFavoriteHandler = (data) => {
    mapCtx.removeList(data.id);

    const changedList = info.map((list) => {
      if (list.id === data.id) {
        return { ...data, favorite: false };
      } else return list;
    });
    setInfo(changedList);
  };
  // 즐겨찾기 제거

  return (
    <div style={{ height: "100%" }}>
      {location.isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <SearchForm
            onSearch={onSearch}
            onKeyword={keyWordHandler}
            onGeoLocation={geoLocationHandler}
          />
        {maxPageCount && <SearchCount fade={styles.fade_in} message={`${maxPageCount}개가 검색되었습니다.`}/>}
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
            <div className={styles.container}>
              <div onClick={onNowLocation} onMouseOver={onShowHide} onMouseOut={onShowHide} className={styles.nowLocation}>
                <button></button>
              </div>
              {showNow && <span>현재 위치</span>}
            </div>
            {/* 현 위치 버튼 */}

            {positions.map((data) => (
              <Marker
                position={data.position}
                onMarkersHandler={onMarkersHandler.bind(null, data)}
                onClick={onMarkersHandler.bind(null, data)}
                onMouseOut={onMouseOut}
                image={{
                  src: markers.src,
                  size: markers.size,
                }}
                isOpen={isOpen}
                name={name && name}
                saveName={name && name.name}
                inSertName={data.name}
                infoPosistion={data.infoPosistion}
                address={data.address}
              />
            ))}
            {/* 맵 마커 */}

            {!openModal && (
              <CategoryList
                openMenu={openMenu}
                onCategory={onCategoryHandler}
                resetMarker={displayMarker}
                resetList={getList}
              />
            )}
            {/* 카테고리 리스트 */}

            {!openMenu && !openFavorite && (
              <SearchList
                openModal={openModal}
                openMenu={openFavorite}
                list={info}
                onMoveLocation={onMoveLocation}
                addFavoriteHandler={addFavoriteHandler}
                pageNum={pageNum}
                onPageChange={onPageNumHandler}
                current={currentPage}
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
            openFavorite={openFavorite}
            openModal={openModal}
            favorite={mapCtx.lists}
            list={info}
            onActiveHandler={onActiveHandler}
          />
        </>
      )}
    </div>
  );
};

export default KakaoMap;
