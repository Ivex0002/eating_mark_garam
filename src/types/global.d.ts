// 전역 스코프에 인터페이스 추가
declare global {
  interface Place {
    id: string;
    title: string;
    image: {
      src: string;
      alt: string;
    };
    lat: number;
    lon: number;
    description: string;
  }
}

// 이 파일을 모듈로 처리하기 위한 구문
export {};
