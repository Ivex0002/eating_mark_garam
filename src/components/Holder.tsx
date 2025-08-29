import type { ReactNode } from "react";
import styled from "styled-components";
import { FloatingBox } from "vive-floating-box";

interface HolderProps {
  children: ReactNode;
}

export default function Holder({ children }: HolderProps) {
  return (
    <HolderSt>
      <FloatingBox onlyActiveHover={true} moveRate={0}>
        <div className="holder">{children}</div>
      </FloatingBox>
    </HolderSt>
  );
}

const HolderSt = styled.div`
  position: relative;
  z-index: 999;
  margin-top: 6rem;

  .box_move {
    .box_size {
      .holder {
        background-color: #cfcfcf55;
        width: 50rem;
        min-height: 10rem;
        border-radius: 1rem;
        border: 1px solid #0000004e;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content:space-evenly;
        gap:2rem;
        padding:2rem;
      }
    }
  }
`;
