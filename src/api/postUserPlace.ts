import { api } from "./api";

export async function postUserPlace(place:Place) {
  try {
    const response = await api.post("/users/places", { place });
    console.log(response.data.message);
  } catch (error) {
    console.error("장소 추가/업데이트 실패:", error);
  }
}
