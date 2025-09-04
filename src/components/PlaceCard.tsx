import styled from "styled-components";
import { FloatingBox } from "vive-floating-box";
import { api } from "../api/api";
import { postUserPlace } from "../api/postUserPlace";
import { deleteUserPlace } from "../api/deleteUserPlace";
import { DelOrAdd, type DoA } from "../types/DelOrAdd";
import { useUserPlacesStore } from "../store/MyplaceStore";
import { useState } from "react";
import { createPortal } from "react-dom";
import postposition from "cox-postposition";

interface PlaceCardProps {
  place: Place;
  delOrAdd: DoA;
}

export default function PlaceCard({ place, delOrAdd }: PlaceCardProps) {
  const baseURL = api.defaults.baseURL;
  const { addPlace, delPlace, isAlreadyExist } = useUserPlacesStore();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const confirmDelete = () => {
    deleteUserPlace(place.id);
    delPlace(place);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

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
        setShowConfirm(true);
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
      {/* 모달 */}
      {showConfirm &&
        createPortal(
          <ConfirmOverlay onClick={cancelDelete}>
            <FloatingBox onlyActiveHover={true} moveRate={0}>
              <ConfirmBox>
                <p>
                  정말 <span style={{ fontWeight: "700" }}>{place.title}</span>
                  {postposition.pick(place.title, "을")} 즐겨찾기에서
                  제거하시겠습니까?
                </p>
                <button onClick={confirmDelete}>확인</button>
                <button onClick={cancelDelete}>취소</button>
              </ConfirmBox>
            </FloatingBox>
          </ConfirmOverlay>,
          document.body
        )}
    </PlaceCardSt>
  );
}
const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.295);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ConfirmBox = styled.div`
  background-color: #ffffff99;
  backdrop-filter: blur(0.15rem);
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  z-index: 1001;

  p {
    font-size:1.2rem;
    margin-bottom: 1rem;
  }

  button {
    margin: 0 0.5rem;
  }
`;

export const PlaceCardSt = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  z-index: 999;
  .box_move {
    .box_size {
      .card {
        background-color: #0000001f;
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
