import React, { useState, useRef } from "react";
import styles from "./SearchForm.module.css";
import Error from "./UI/Error";

const SearchForm = ({ onAddress, onKeyword }) => {
  const [onError, setOnError] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const inputValue = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredInputValue = inputValue.current.value;
    if (enteredInputValue === "") {
      setOnError(true);
      return setErrMessage("검색어를 입력해주세요.");
    }
    mapSearchHandler(enteredInputValue);
  };

  // console.log(info);

  const token = process.env.REACT_APP_API_KEY;

  const mapSearchHandler = async (inputValue) => {
    const addressUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${inputValue}`;
    const keyWordUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${inputValue}`;
    try {
      let response = await fetch(addressUrl, {
        body: JSON.stringify(),
        headers: {
          Authorization: `KakaoAK ${token}`,
        },
      });
      const { documents : searchAddress } = await response.json();
      let addressList = searchAddress.length;
      if (addressList > 0) {
        return onAddress(inputValue);
      } else {
        response = await fetch(keyWordUrl, {
          body: JSON.stringify(),
          headers: {
            Authorization: `KakaoAK ${token}`,
          },
        });
        const {documents: searchKeyword} = await response.json();
        if(searchKeyword) {
          return onKeyword(inputValue);
        }
      }
      if (!response.ok) {
        throw new Error("Error!");
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const onCancel = () => {
    setOnError(false);
  };

  const message = (
    <Error onCancel={onCancel} message={errMessage && errMessage} />
  );

  return (
    <div className={styles.container}>
      {onError && message}
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
    </div>
  );
};

export default SearchForm;
