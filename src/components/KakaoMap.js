import { useEffect, useState, useContext, useCallback } from "react";
import { Map, ZoomControl } from "react-kakao-maps-sdk";
import useGeolocation from "react-hook-geolocation";
import MapContext from "../store/map-context";
import SearchForm from "./SearchForm";
import styles from "./KakaoMap.module.css";
import MobileNavigation from "./Menu/MobileNavigation";
import allLocation from "../assets/images/allLocaiton.png";
import myLocationMarker from "../assets/images/my_location_marker.png";
import Marker from "./Marker";
import LoadingSpinner from "./UI/LoadingSpinner";
import SearchCount from "./UI/SearchCount";
import Error from "./UI/Error";
import ListContainer from "./List/ListContainer";
import { calculateDistance } from "../util/loc";

const KakaoMap = () => {
  const { kakao } = window;

  const { sort } = useContext(MapContext);

  const sortOption = sort
    ? kakao.maps.services.SortBy[sort]
    : kakao.maps.services.SortBy.ACCURACY;

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

  const [info, setInfo] = useState([]);

  const [searchResult, setSearchResult] = useState({
    address: null,
    keyword: null,
  });

  const [currentPage, setCurrentPage] = useState();
  const [pageNum, setPageNum] = useState([]);

  const [markers, setMarkers] = useState({
    src: allLocation,
    size: imageSize,
  });

  const [onError, setOnError] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [name, setName] = useState();
  const [listState, setListState] = useState({
    listOpen: false,
    favoriteOpen: false,
    categoryOpen: false,
  });

  const [showNow, setShowNow] = useState(false);
  const [maxPageCount, setMaxPageCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState();

  const [location, setLocation] = useState({
    center: {
      lat: null,
      lng: null,
    },
    isPanto: false,
    errMsg: null,
    isLoading: true,
  });
  // 해당 하는 로케이션으로 지도 이동

  const [currentLoc, setCurrentLoc] = useState({
    center: {
      lat: null,
      lng: null,
    },
  });

  const [myMarkerImg, setMyMarkerImg] = useState({
    src: myLocationMarker,
    size: {
      width: 25,
      height: 25,
    },
  });

  const [myMarker, setMyMarker] = useState({
    position: {
      lat: null,
      lng: null,
    },
  });
  console.log(myMarker !== null);
  const addressHandler = (value) => {
    setSearchResult({
      keyword: null,
      address: value && value,
    });
  };
  // 장소 검색 저장

  const keyWordHandler = (value) => {
    setSearchResult({
      address: null,
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
        setListState((prevList) => {
          if (info.length > 0) {
            return {
              listOpen: !prevList.listOpen,
              favoriteOpen: false,
              categoryOpen: false,
            };
          } else {
            return prevList;
          }
        });
        break;
      case 1:
        setListState((prevList) => {
          if (mapCtx.lists.length > 0) {
            return {
              listOpen: false,
              favoriteOpen: !prevList.favoriteOpen,
              categoryOpen: false,
            };
          } else {
            return { favoriteOpen: false };
          }
        });
        break;
      case 2:
        setListState((prevList) => ({
          listOpen: false,
          favoriteOpen: false,
          categoryOpen: !prevList.categoryOpen,
        }));
        break;
      default:
        break;
    }
  };
  // 하단 네비게이션 반응
  const onCategoryHandler = (data) => {
    setOnCategory(data && data.code);
    setSearchResult({
      address: null,
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
  };
  // 지도 드래그시 현재 위치 값 변경

  const onNowLocation = () => {
    setCurrentLoc(() => ({
      center: {
        lat: geolocation.latitude,
        lng: geolocation.longitude,
      },
    }));

    setMyMarker((prev) => ({
      ...prev,
      position: {
        lat: geolocation.latitude,
        lng: geolocation.longitude,
      },
    }));

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

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, []);

  const onShowHide = () => {
    setShowNow((prev) => {
      if (!mobile) {
        return !prev;
      } else return false;
    });
  };

  const displayMarker = (data) => {
    setIsLoading(true);
    const bounds = new kakao.maps.LatLngBounds();
    const markers = [];

    for (let i = 0; i < data.length; i++) {
      markers.push({
        position: {
          lat: data[i].y,
          lng: data[i].x,
        },
        address: data[i].address_name,
        name: data[i].place_name ? data[i].place_name : data[i].address_name,
      });
      bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
      setIsLoading(false);
    }
    setPositions(markers);
  }; // 마커 생성

  const displayPagination = (pagination) => {
    const pageArray = Array.from({ length: pagination.last }, (v, i) => i + 1);
    setPageNum([...pageArray]);
    setCurrentPage(1);

    setMaxPageCount(pagination.totalCount);
  }; // 페이지 리스트 생성

  const countPageHandler = useCallback(() => {
    setMaxPageCount(null);
  }, []);

  const onPageNumHandler = (page) => {
    setCurrentPage(page);
    searchPlace(page);
  }; // current page 감지

  const getList = (data) => {
    setIsLoading(true);

    if (info.length > 0) {
      setInfo([]);
      setIsLoading(false);
    }
    // list있을시 초기화

    if (searchResult.keyword !== null || searchResult.address !== null) {
      setOnCategory(null);
      const newList = Object.values(data).map((item) => ({
        id: item.id,
        address: item.address_name,
        name: item.place_name,
        road_name: item.road_address_name,
        phone: item.phone,
        type: item.address_type,
        roadData: calculateDistance(
          currentLoc.center.lat,
          currentLoc.center.lng,
          item.y,
          item.x
        ),
        center: {
          lat: item.y,
          lng: item.x,
        },
        categoryName: item.category_name,
        category: item.category_group_name,
        favorite: mapCtx.lists.some((list) => list.id === item.id),
      }));
      setIsLoading(false);
      setInfo(newList);
    }
    if (onCategory) {
      const newList = Object.values(data).map((item) => ({
        id: item.id,
        address: item.address_name,
        name: item.place_name,
        road_name: item.road_address_name,
        phone: item.phone,
        roadData: calculateDistance(
          currentLoc.center.lat,
          currentLoc.center.lng,
          item.y,
          item.x
        ),
        center: {
          lat: item.y,
          lng: item.x,
        },
        categoryName: item.category_name,
        category: item.category_group_name,
        favorite: mapCtx.lists.some((list) => list.id === item.id),
      }));
      setIsLoading(false);
      setInfo(newList);
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
      page: page || 1,
      size: 15,
      sort: sortOption,
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

    if (searchResult.address !== null) {
      geocoder.addressSearch(searchResult.address, searchDB, addressOption);
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
      page: 1,
      size: 15,
      sort: sortOption,
    };
    // 검색 시 default 옵션(현재 위치 기반)

    if (searchResult.keyword !== null) {
      places.keywordSearch(
        searchResult.keyword,
        updateSearchDB,
        defaultOptions
      );

      setListState((prevList) => {
        if (prevList.listOpen) {
          return {
            listOpen: prevList.listOpen,
            favoriteOpen: false,
            categoryOpen: false,
          };
        } else return { ...prevList, listOpen: !prevList.listOpen };
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

    if (searchResult.address !== null) {
      geocoder.addressSearch(
        searchResult.address,
        updateSearchDB,
        addressOption
      );

      setListState((prevList) => {
        if (prevList.listOpen) {
          return {
            listOpen: prevList.listOpen,
            favoriteOpen: false,
            categoryOpen: false,
          };
        } else return { ...prevList, listOpen: !prevList.listOpen };
      });

      setMarkers((prev) => ({
        ...prev,
        src: allLocation,
      }));
    }
    // 일반 검색 (키워드, 콜백함수)
  }, [searchResult.address, searchResult.keyword, onCategory, sort]);
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
    if (status === kakao.maps.services.Status.ZERO_RESULT) {
      setErrMessage("검색 결과가 없습니다.");
      return setOnError(true);
    }

    if (status === kakao.maps.services.Status.OK) {
      setLocation((prev) => ({
        ...prev,
        center: {
          lat: result[0].y,
          lng: result[0].x,
        },
      }));
      console.log(result);
      displayPagination(pagination);
      displayMarker([...result]); // marker 생성
      getList([...result]); // list 생성
      return setOnError(false);
    }
  };
  console.log(searchResult);
  useEffect(() => {
    //최초 현재 위치로 초기화
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

  // 현재 위치로 초기화

  const addFavoriteHandler = (data) => {
    const updatedLists = {
      id: data.id,
      name: data.name,
      address: data.address,
      phone: data.phone,
      roadData: data.roadData,
      center: data.center,
      category: data.category,
      categoryName: data.categoryName,
      favorite: true,
    };

    mapCtx.addList(updatedLists);

    const changedList = info.map((list) => {
      if (list.id === data.id) {
        return { ...data, favorite: true };
      } else return list;
    });
    setInfo(changedList);
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

  const onCancel = () => {
    setOnError(false);
  };

  return (
    <div style={{ height: "100%" }}>
      {location.isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {onError && <Error onCancel={onCancel} message={errMessage} />}
          <SearchForm
            onSearch={onSearch}
            onKeyword={keyWordHandler}
            onAddress={addressHandler}
          />
          {maxPageCount && (
            <SearchCount
              list={info}
              maxPageCount={maxPageCount}
              resetCount={countPageHandler}
            />
          )}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
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
                <div
                  onClick={onNowLocation}
                  onMouseOver={onShowHide}
                  onMouseOut={onShowHide}
                  className={styles.nowLocation}
                >
                  <button></button>
                </div>
                {showNow && <span>현재 위치</span>}
              </div>
              {/* 현 위치 버튼 */}

              {positions.map((data) => (
                <Marker
                  key={`marker-${data.name}-${data.position.lat},${data.position.lng}`}
                  data={data}
                  onMarkersHandler={onMarkersHandler.bind(null, data)}
                  onTouchStart={onMarkersHandler.bind(null, data)}
                  onMouseOut={onMouseOut}
                  image={markers}
                  isOpen={isOpen}
                  name={name && name}
                  saveName={name && name.name}
                />
              ))}
              <Marker data={myMarker} image={myMarkerImg} />
              {/* 맵 마커 */}

              <ListContainer
                listState={listState}
                list={info}
                pageNum={pageNum}
                current={currentPage}
                onCategory={onCategoryHandler}
                resetMarker={displayMarker}
                resetList={getList}
                onMoveLocation={onMoveLocation}
                addFavoriteHandler={addFavoriteHandler}
                removeFavoriteHandler={removeFavoriteHandler}
                onPageChange={onPageNumHandler}
              />
              {/* List 컴포넌트 */}

              <ZoomControl />
              {/* 지도 줌 옵션 */}
            </Map>
          )}
          <MobileNavigation
            listState={listState}
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
