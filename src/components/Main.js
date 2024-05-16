import { useState, useEffect } from "react";

import MapTest from "./Map02";
import MobileNavigation from "./Menu/MobileNavigation";
import SearchForm from "./SearchForm";
import { calculateDistance } from "./loc.js";
import SearchList from "./List/SearchList";

export default function Main() {
  const { kakao } = window;
  const [insertList, setInsertList] = useState([]);

  const [nowLocation, setNowLocation] = useState({});
  const [searchResult, setSearchResult] = useState({
    keyword: null,
    address: null,
  });

  const getLocation = (location) => {
    setNowLocation(location);
  };

  const getList = (list) => {
    const newList = Object.values(list).map((item) => ({
      id: item.id,
      address: item.address_name,
      name: item.place_name,
      road_name: item.road_address_name,
      phone: item.phone,
      type: item.address_type,
      roadData: calculateDistance(
        nowLocation.lat,
        nowLocation.lng,
        item.y,
        item.x
      ),
      center: {
        lat: item.y,
        lng: item.x,
      },
      categoryName: item.category_name,
      category: item.category_group_name,
    }));
    setInsertList(newList);
  };

  const addressHandler = (value) => {
    setSearchResult((prevValue) => ({
      ...prevValue,
      address: value,
    }));
  };

  const keywordHandler = (value) => {
    setSearchResult((prevValue) => ({
      address: null,
      keyword: value,
    }));
  };

  const geocoder = new kakao.maps.services.Geocoder();
  // 지역검색
  const places = new kakao.maps.services.Places();
  // 키워드 검색
  const categorys = new kakao.maps.services.Places();
  // 카테고리 검색

  const updateSearchDB = (result, status, pagination) => {
    if (status === kakao.maps.services.Status.ZERO_RESULT) {
      console.log("done");
    }

    if (status === kakao.maps.services.Status.OK) {
      getList([...result]);
    }
  };

  useEffect(() => {
    const defaultOptions = {
      x: nowLocation.lng,
      y: nowLocation.lat,
      radius: 5000,
      page: 1,
      size: 15,
      sort: kakao.maps.services.SortBy.DISTANCE,
    };

    const addressOption = {
      page: 1,
      size: 15,
      analyze_type: kakao.maps.services.AnalyzeType.EXACT,
    };

    if (searchResult.keyword !== null) {
      places.keywordSearch(
        searchResult.keyword,
        updateSearchDB,
        defaultOptions
      );
    }

    if (searchResult.address !== null) {
      geocoder.addressSearch(
        searchResult.address,
        updateSearchDB,
        addressOption
      );
    }
    // 일반 검색 (키워드, 콜백함수)
  }, [searchResult.address, searchResult.keyword]);
  // 최초 검색시
  console.log(insertList)
  return (
    <>
      <SearchForm onAddress={addressHandler} onKeyword={keywordHandler} />
      <MapTest handleGeolocation={getLocation}>
        {insertList.map((list) => <li>{list.name}</li>)}
      </MapTest>
      <MobileNavigation />
    </>
  );
}
