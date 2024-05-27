import cafeMarkers from "../assets/images/cafeMarker.png";
import storeMarkers from "../assets/images/store.png";
import parkMarkers from "../assets/images/parking.png";
import subwayMarkers from "../assets/images/subway.png";
import bankMarkers from "../assets/images/bank.png";
import foodMarkers from "../assets/images/food.png";
import hospitalMarkers from "../assets/images/hospital.png";
import medicationMarkers from "../assets/images/medication.png";

const category = [
  {
    code: "CS2",
    summary: "편의점",
    src: storeMarkers,
  },
  {
    code: "PK6",
    summary: "주차장",
    src: parkMarkers,
  },
  {
    code: "SW8",
    summary: "지하철역",
    src: subwayMarkers,
  },
  {
    code: "BK9",
    summary: "은행",
    src: bankMarkers,
  },
  {
    code: "FD6",
    summary: "음식점",
    src: foodMarkers,
  },
  {
    code: "CE7",
    summary: "카페",
    src: cafeMarkers,
  },
  {
    code: "HP8",
    summary: "병원",
    src: hospitalMarkers,
  },
  {
    code: "PM9",
    summary: "약국",
    src: medicationMarkers,
  },
];

export default category;
