import React,{ useState, useRef } from "react";
import styles from "./SearchForm.module.css";
import Error from "./UI/Error";

const SearchForm = (props) => {
  const [onError, setOnError] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const inputValue = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredInputValue = inputValue.current.value;
    if (enteredInputValue === "") {
      setOnError(true);
      return setErrMessage('검색어를 입력해주세요.')
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
      console.log(response);
      if (!response.ok) {
        throw new Error("Error!");
      }
      const { documents } = await response.json();
      let index = documents.length;
      if (index >= 1) {
        return props.onAddress(value);
      }
      if(index === 0) return value;
    });
  };

  const mapSearchHandler = (enteredInputValue) => {
    const addressUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${enteredInputValue}`;
    const keyWordUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${enteredInputValue}`;

    response(enteredInputValue, addressUrl)
    .then((data) => {
      if(!data) {
        response(enteredInputValue,keyWordUrl)
      }
      return data;
    }).then((data) => {
      return props.onKeyword(data);
    }).catch((error) => {
      setOnError(true);
      return setErrMessage(error)
    });
  };

  const onCancel = () => {
    setOnError(false);
  };

  const message = <Error onCancel={onCancel} message={errMessage && errMessage}/>

  return (
    <main className={styles.container}>
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
    </main>
  );
};

export default SearchForm;
