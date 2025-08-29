# 미션1

### 컴포넌트 및 레이어 설계

제가 이미 만들고 배포했던 npm 컴포넌트인 vive-floating-box를 재활용 하여 만들었습니다
해당 링크 : https://www.npmjs.com/package/vive-floating-box
해당 컴포넌트가 쓰인 예시 : <Holder>, <PlaceCard>

```tsx
export default function Holder({ children }: HolderProps) {
  return (
    <HolderSt>
      <FloatingBox onlyActiveHover={true} moveRate={0}>
        <div className="holder">{children}</div>
      </FloatingBox>
    </HolderSt>
  );
}
```

```tsx
export default function PlaceCard({ place, delOrAdd }: PlaceCardProps) {
  const baseURL = api.defaults.baseURL;
  const { addPlace, delPlace, isAlreadyExist } = useUserPlacesStore();

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
```

해당 세부 컴포넌트들은 모두 전체 목록 / 유저의 찜목록에서 사용 되었습니다

```tsx
export default function MyPlaces({}) {
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
```

```tsx
export default function NearPlaces({}) {
  return (
    <Holder>
      {places
        ? places.map((el) => (
            <PlaceCard
              place={el}
              delOrAdd={DelOrAdd.add}
              key={el.id}
            ></PlaceCard>
          ))
        : "데이터를 받아오는 중입니다..."}
    </Holder>
  );
}
```

### 요청 로직

```ts
export const api = axios.create({
  baseURL: "http://localhost:3000", // 백엔드 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
});
```

위의 코드처럼 베이스 api를 만들고

```ts
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
```

이런 식으로 api를 불러와 데이터를 요청했습니다.

### 어려웠던 점

동일한 컴포넌트에서 메서드를 분리해서 사용하기 위해
src\types\DelOrAdd.ts 에

```ts
export type DoA = "add" | "del";
export const DelOrAdd = {
  add: "add",
  del: "del",
} as const;
```

이런 타입과 상수값을 선언하여

```tsx
interface PlaceCardProps {
  place: Place;
  delOrAdd: DoA;
}
```

프롭스의 타입을 선언하고

```tsx
export default function PlaceCard({ place, delOrAdd }: PlaceCardProps);
```

프롭스를 받아와

```tsx
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
```

이렇게 분기처리를 했습니다.

상위 컴포넌트에선
````tsx
<PlaceCard place={el} delOrAdd={DelOrAdd.del} />
````
이런식으로 간편하게 불러오기만 하면 되도록 구성했습니다.

처음엔 enum이나 글로벌 타입을 써보려고 여러가지 시도를 하였으나, erasableSyntaxOnly 옵션 오류에 막혀 이 방식을 채택하게 되었습니다.