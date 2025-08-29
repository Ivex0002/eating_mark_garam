import styled from "styled-components";

export default function Header({}) {
    return (
      <HearderSt>
        <div className="logo flex">
          <img src="src\assets\hamburger.png" alt="hamburger_img" />
          오늘 뭐 먹지?
        </div>
      </HearderSt>
    );
}

const HearderSt = styled.header`
    .logo{
        margin-top: 2rem;
        img{
            width: 4rem;
        }
        font-size:2rem;
    }
`;
