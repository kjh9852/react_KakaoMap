import { useState, useEffect, useRef } from "react";
import MapList from "./MapList";
import useGeolocation from "react-hook-geolocation";
import styles from "./SearchForm.module.css";
import Error from "./UI/Error";

const SearchForm = (props) => {
  const geolocation = useGeolocation({
    enableHighAccuracy: true, // 가장 높은 정확도의 위치 정보를 수신하고 싶을 때의 불리언 값
    maximumAge: 5000, //캐시에 저장한 위치 정보를 반환할 수 있는 최대 시간
    timeout: 5000, //위치를 반환할 때 소모 할 수 있는 최대 시간
  });

  const [geoCoord, setGeoCoord] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (geolocation.loading) {
      <p>Loading...</p>;
    } else {
      setGeoCoord({
        x: geolocation.longitude,
        y: geolocation.latitude,
      });
    }
    if (geolocation.error) {
      <p>Error.</p>;
    }
  }, [geolocation]);

  const inputValue = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredInputValue = inputValue.current.value;
    if (enteredInputValue === "") {
      return setError(true);
    }
    mapSearchHandler(enteredInputValue);
  };

  // console.log(info);

  const token = process.env.REACT_APP_API_KEY;

  const response = async (value, url) => {
     return await fetch(url, {
      body: JSON.stringify(),
      headers: {
        Authorization: `KakaoAK ${token}`,
      },
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error("Error!");
      }
      const { documents } = await response.json();
      console.log(documents);
      let index = documents.length;
      if (index >= 1) {
        return props.onGeoLocation(value);
      } else return value;
    });
  };

  const mapSearchHandler = (enteredInputValue) => {
    const addressUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${enteredInputValue}`;
    const keyWordUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?y=${geoCoord.y}&x=${geoCoord.x}&radius=20000&query=${enteredInputValue}`;

    response(enteredInputValue, addressUrl).then((data) => {
      if (!data) {
        response(enteredInputValue, keyWordUrl)
      }
      return data;
    }).then(data => {
      console.log(data);
      return props.onKeyword(data);
    }).catch(error => console.log(error));
  };

  const onCancel = () => {
    setError(false);
  };

  const message = <Error onCancel={onCancel} message="검색어를 입력해 주세요."/>

  return (
    <main className={styles.container}>
      {error && message}
      <form onSubmit={submitHandler} className={styles.form}>
        <p>
          <input
            type="text"
            placeholder="지역이나 키워드를 입력해 주세요."
            ref={inputValue}
          ></input>
          <button type="submit" />
        </p>
      </form>
    </main>
  );
};

export default SearchForm;
