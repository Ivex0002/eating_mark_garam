import styled from "styled-components";
import { FloatingBox } from "vive-floating-box";
import { api } from "../api/api";
import { postUserPlace } from "../api/postUserPlace";
import { deleteUserPlace } from "../api/deleteUserPlace";
import { DelOrAdd, type DoA } from "../types/DelOrAdd";
import { useUserPlacesStore } from "../store/MyplaceStore";

interface PlaceCardProps {
  place: Place;
  delOrAdd: DoA;
}

export default function PlaceCard({ place, delOrAdd }: PlaceCardProps) {
  const baseURL = api.defaults.baseURL;
  const { addPlace, delPlace, isAlreadyExist } = useUserPlacesStore();

  const handleClick = () => {
    switch (delOrAdd) {
      case DelOrAdd.add:
        if (isAlreadyExist(place)) {
          console.log("이미 즐겨찾기에 추가된 항목입니다");
          return;
        }
        postUserPlace(place);
        addPlace(place);
        break;
      case DelOrAdd.del:
        deleteUserPlace(place.id);
        delPlace(place);
        break;
      default:
        console.log("잘못된 요청입니다");
    }
  };
  return (
    <PlaceCardSt>
      <FloatingBox onlyActiveHover={true}>
        <div className="card" onClick={handleClick}>
          <img src={`${baseURL}/${place.image.src}`} alt={place.image.alt} />
          <span>{place.title}</span>
        </div>
      </FloatingBox>
    </PlaceCardSt>
  );
}

const PlaceCardSt = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  z-index: 999;
  .box_move {
    .box_size {
      .card {
        background-color: #00000067;
        width: 12rem;
        height: fit-content;
        padding: 1rem;
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        span {
        }
      }
    }
  }
`;
