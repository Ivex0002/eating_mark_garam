import { api } from "./api";

export async function fetchPlaces() {
  try {
    const response = await api.get("/places");
    const places = response.data.places;
      console.log("모든 장소:", places);
      return places;
  } catch (error) {
    console.error("장소 조회 실패:", error);
  }
}

// userId: string
export async function fetchUserPlaces() {
  try {
    const response = await api.get("/users/places");
    const userPlaces = response.data.places;
      console.log("사용자 장소:", userPlaces);
      return userPlaces;
  } catch (error) {
    console.error("사용자 장소 조회 실패:", error);
  }
}
