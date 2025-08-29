import styled from "styled-components";
import type { ReactNode } from "react";

interface BackgroundProps {
  children: ReactNode;
}


export default function Background({ children }:BackgroundProps ) {
  return <BackgroundStyle>{children}</BackgroundStyle>;
}
const BackgroundStyle = styled.div`
  position: fixed;
  inset:0;
  overflow-y:auto;
  background: linear-gradient(135deg, #f3ca90c0, #4678b9c8);
  background-size: 150% 150%;
  animation: waveGradient 10s ease infinite;
  z-index: 1;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  @keyframes waveGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
