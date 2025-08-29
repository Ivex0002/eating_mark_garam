import { api } from "./api";

export async function deleteUserPlace(placeId: string) {
  try {
    const response = await api.delete(`/users/places/${placeId}`);
    console.log(response.data.message);
  } catch (error) {
    console.error("장소 추가/업데이트 실패:", error);
  }
}
