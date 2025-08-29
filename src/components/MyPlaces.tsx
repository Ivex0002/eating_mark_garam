import { useEffect, useState } from "react";
import Holder from "./Holder";
import PlaceCard from "./PlaceCard";
import { fetchUserPlaces } from "../api/callPalces";
import { DelOrAdd } from "../types/DelOrAdd";
import { useUserPlacesStore } from "../store/MyplaceStore";

export default function MyPlaces({}) {
  const [myPlacesArr, setPlaces] = useState<Place[] | null>(null);
  const { places, initPlace } = useUserPlacesStore();

  // 초기화시 api에 요청함
  useEffect(() => {
    (async () => {
      const data = (await fetchUserPlaces()) as Place[];
      initPlace(data);
      setPlaces(data);
    })();
  }, []);

  // 추가/제거 될땐 클라상에서 즉시 추가/제거
  useEffect(() => {
    (() => {
      setPlaces(places);
    })();
  }, [places]);

  return (
    <Holder>
      {myPlacesArr
        ? myPlacesArr.map((el) => (
            <PlaceCard
              place={el}
              delOrAdd={DelOrAdd.del}
              key={el.id}
            ></PlaceCard>
          ))
        : "데이터를 받아오는 중입니다..."}
    </Holder>
  );
}
