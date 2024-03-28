import { useState, useEffect, useRef } from "react";
import MapList from "../components/MapList";
import useGeolocation from "react-hook-geolocation";
import styles from "./SearchForm.module.css";

const SearchForm = (props) => {
  const geolocation = useGeolocation({
    enableHighAccuracy: true, // 가장 높은 정확도의 위치 정보를 수신하고 싶을 때의 불리언 값
    maximumAge: 5000, //캐시에 저장한 위치 정보를 반환할 수 있는 최대 시간
    timeout: 5000, //위치를 반환할 때 소모 할 수 있는 최대 시간
  });

  const [geoCoord, setGeoCoord] = useState();

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
    if(enteredInputValue === '') {
      return alert('검색어를 입력해 주세요.')
    }
    mapSearchHandler(enteredInputValue);
  };

  // console.log(info);

  const token = process.env.REACT_APP_API_KEY;

  const mapSearchHandler = async (enteredInputValue) => {
    let url = `https://dapi.kakao.com/v2/local/search/address.json?query=${enteredInputValue}`
    try {
      return await fetch (
        url,
        {
          body: JSON.stringify(),
          headers: {
            Authorization: `KakaoAK ${token}`,
          },
        }
      )
        .then(async (res) => {
          const { documents } = await res.json();
          console.log(documents);
          props.onKeyword(null);
          props.onGeoLocation(enteredInputValue);

          if (documents.length === 0) {
            url = `https://dapi.kakao.com/v2/local/search/keyword.json?y=${geoCoord.y}&x=${geoCoord.x}&radius=20000&query=${enteredInputValue}`
            try {
              await fetch(
                url,
                {
                  body: JSON.stringify(),
                  headers: {
                    Authorization: `KakaoAK ${token}`,
                  },
                }
              ).then(async (res) => {
                const { documents } = await res.json();
                console.log(documents);
                props.onGeoLocation(null);
                props.onKeyword(enteredInputValue);
              });
            } catch (error) {
              console.log(error);
            }
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className={styles.container}>
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
