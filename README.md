# 미션1

## 컴포넌트 및 레이어 설계

제가 이미 만들고 배포했던 npm 컴포넌트인 vive-floating-box를 재활용 하여 만들었습니다<br>
해당 링크 : https://www.npmjs.com/package/vive-floating-box <br>
해당 컴포넌트가 쓰인 예시 : Holder, PlaceCard

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

<br>
<br>

## 요청 로직

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

<br>
<br>

## 어려웠던 점

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

```tsx
<PlaceCard place={el} delOrAdd={DelOrAdd.del} />
```

이런식으로 간편하게 불러오기만 하면 되도록 구성했습니다.

처음엔 enum이나 글로벌 타입을 써보려고 여러가지 시도를 하였으나, erasableSyntaxOnly 옵션 오류에 막혀 이 방식을 채택하게 되었습니다.

## loading UI

```tsx
const [loading, setLoading] = useState<boolean>(true);
```

src\components\MyPlaces.tsx 에 해당 상태 변수를 추가했습니다
debugger 옵션으로 해당 코드가 작동됨을 확인했습니다
loading 상태가 true일때, myPlacesArr이 0일때, 유효한 myPlacesArr이 존재할때 각각 분기를 나누어 다른 content를 Holder안에 보여주어 코드 재활용성을 높였습니다

## 404 에러 처리
무조건 서버 데이터로 처리해야하는 
src\components\NearPlaces.tsx 에서 해당 로직을 작성했습니다

## 위치기반 정렬
src\components\NearPlaces.tsx
isSort 상태 변수를 두고 버튼을 눌렀을 때 이 변수가 토글되며, 토글 되었을 때 정렬 함수가 작동 하도록 useEffect에 isSort 변수를 구독해 작동하도록 만들었습니다
navigator.geolocation를 사용해 사용자의 latitude, longitude를 받아오도록 하고, 이를 제공된 sortPlacesByDistance 메서드를 통해 장소 소팅을 하도록 만들었습니다.

## 즐겨찾기 삭제 모달 창 추가
src\components\PlaceCard.tsx
showConfirm상태 변수를 추가해 모달창이 표시될지 여부를 관리하게 만들었습니다.
switch 문의 case DelOrAdd.del: 의 기존 로직은 confirmDelete으로 분리하고, 단순히 모달창(ConfirmBox)을 호출하는 기능만 수행하도록 만들었습니다.
ConfirmBox 내부 버튼에서 confirmDelete, cancelDelete 를 호출해 확인/취소 기능을 구현했습니다.
기존 디자인의 zindex가 999 였기에 오버레이 디자인은 z-index: 1000; 을 부여해 확실히 적용되도록 만들었습니다.
자꾸 img요소만 랜덤하게 ConfirmBox의 z-index: 1000;를 뚫고 나와서 createPortal로 상위요소로 이동시켜 적용했습니다.
ConfirmBox의 내부 p태그에서 이름을 유동적으로 적용시키기 위해 cox-postposition라이브러리를 적용했습니다.(을/를 처리)