import { useState } from "react";
import { calculateDistance } from "../components/loc";

export default function useListData(defaultArray, data ,currentLoc, mapCtx) {
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState(defaultArray);

  const updatedList = () => {
    setIsLoading(true);

    if (info.length > 0) {
      setInfo([]);
      setIsLoading(false);
    }

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
  };

  return {
    isLoading,
    info,
    updatedList,
  };

}
