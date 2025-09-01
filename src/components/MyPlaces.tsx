import { useEffect, useState } from "react";
import Holder from "./Holder";
import PlaceCard from "./PlaceCard";
import { fetchUserPlaces } from "../api/callPalces";
import { DelOrAdd } from "../types/DelOrAdd";
import { useUserPlacesStore } from "../store/MyplaceStore";
import styled from "styled-components";

export default function MyPlaces({}) {
  const [myPlacesArr, setPlaces] = useState<Place[] | null>(null);
  const { places, initPlace } = useUserPlacesStore();
  const [loading, setLoading] = useState<boolean>(true);

  // 초기화시 api에 요청함
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = (await fetchUserPlaces()) as Place[];
        // debugger;
        initPlace(data);
        setPlaces(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 추가/제거 될땐 클라상에서 즉시 추가/제거
  useEffect(() => {
    (() => {
      setPlaces(places);
    })();
  }, [places]);

  let content = null;

  if (loading) {
    content = <CenterDiv>데이터 불러오는 중...</CenterDiv>;
  } else if (myPlacesArr?.length === 0) {
    content = <CenterDiv>저장된 장소가 없습니다.</CenterDiv>;
  } else {
    content = myPlacesArr?.map((el) => (
      <PlaceCard place={el} delOrAdd={DelOrAdd.del} key={el.id} />
    ));
  }

  return <Holder>{content}</Holder>;
}

const CenterDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
`;
