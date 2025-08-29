import { useEffect, useState } from "react";
import Holder from "./Holder";
import PlaceCard from "./PlaceCard";
import { fetchPlaces } from "../api/callPalces";
import { DelOrAdd } from "../types/DelOrAdd";

export default function NearPlaces({}) {
  const [places, setPlaces] = useState<Place[] | null>(null);

  useEffect(() => {
    (async () => {
      const data = await fetchPlaces();
      setPlaces(data);
    })();
  }, []);

    
  return (
    <Holder>
      {places
        ? places.map((el) => (
            <PlaceCard place={el} delOrAdd={DelOrAdd.add} key={el.id}></PlaceCard>
          ))
        : "데이터를 받아오는 중입니다..."}
    </Holder>
  );
}
