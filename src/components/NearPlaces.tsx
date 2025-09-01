import { useEffect, useState } from "react";
import Holder from "./Holder";
import PlaceCard, { PlaceCardSt } from "./PlaceCard";
import { fetchPlaces } from "../api/callPalces";
import { DelOrAdd } from "../types/DelOrAdd";
import { sortPlacesByDistance } from "../utils/loc.js/loc";
import { FloatingBox } from "vive-floating-box";

export default function NearPlaces({}) {
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSort, setIsSort] = useState<boolean>(false);

  function toggleSort() {
    setIsSort(!isSort);
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPlaces();
        setPlaces(data);
        console.log({ data });
      } catch (e: any) {
        if (e.response) {
          // e는 기본적으로 Axios 객체(요청을 Axios로 했으므로)
          // 그러나 Axios만으로 narrowing을 진행하면 코드도 늘어나고 유동적 대응이 안됨
          // 따라서 e에 response가 있는지에 따라서 처리하고(대부분의 통신에는 res객체가 있으므로)
          // 그 외는 else문으로 묶어서 처리함
          if (e.response.status === 404) {
            setError("요청하신 데이터를 찾을 수 없습니다. (404)");
          } else {
            setError(
              `서버 에러가 발생했습니다. (status: ${e.response.status})`
            );
          }
        } else {
          setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (!isSort || !places) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setPlaces(sortPlacesByDistance(places, latitude, longitude));
        },
        (err: GeolocationPositionError) => {
          setError(`Error: ${err.message}`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [isSort]);

  let content = null;
  if (error !== null) {
    content = error;
  } else if (places) {
    content = [
      <PlaceCardSt>
        <FloatingBox onlyActiveHover={true}>
          <div className="card" onClick={() => toggleSort()}>
            <img src="src\assets\mapIcon.png" alt="mapIcon" />
            <span style={{ textAlign: "center" }}>내 위치 기반 정렬</span>
          </div>
        </FloatingBox>
      </PlaceCardSt>,
      places.map((el) => (
        <PlaceCard place={el} delOrAdd={DelOrAdd.add} key={el.id}></PlaceCard>
      )),
    ];
  }
  return <Holder>{content}</Holder>;
}
