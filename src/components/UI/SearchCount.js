import { useState, useEffect ,useRef } from "react";

import styles from "./SearchCount.module.css";

const SearchCount = ({list,maxPageCount,resetCount}) => {
  const [fade, setFade] = useState({ fadeAnimation: "fade_in" });

  useEffect(() => {
    setFade({ fadeAnimation: "fade_in" });

    const countTimer = setTimeout(() => {
      console.log('fadeOut')
      setFade({ fadeAnimation: "fade_out" });
    }, 2000);
  
    return () => {
      clearTimeout(countTimer);
    };
  }, [list]);
  // 검색목록이 바뀔때마다 갱신

  useEffect(() => {
    if (fade.fadeAnimation === "fade_out") {
      const resetTimer = setTimeout(() => {
        console.log('reset')
        resetCount()
      }, 1500);
  
      return () => clearTimeout(resetTimer);
    }
  }, [fade, resetCount]);
  // fade State의 상태가 fade_out이 되면 1.5초뒤 resetCount 함수 호출

  return (
    <div className={`${styles.container} ${styles[fade.fadeAnimation]}`}>
      <div className={styles.card}>{`${maxPageCount}개가 검색 되었습니다.`}</div>
    </div>
  );
};

export default SearchCount;
