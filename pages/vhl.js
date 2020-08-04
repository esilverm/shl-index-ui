/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import styled from 'styled-components';
// import Link from 'next/link';

export default function VHL() {
  return (
    <>
      <BackgroundVideo autoPlay loop muted>
        <source src="/404.webm" type="video/webm" />
        <source src="/404.mp4" type="video/mp4" />
      </BackgroundVideo>
      {/* <Container>
        <Link href="/">
          <GoBack>Go Back to the Locker Room</GoBack>
        </Link>
      </Container> */}
    </>
  );
}

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  object-fit: fill;
`;

// const Container = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 90vh;
//   display: flex;
//   justify-content: center;
//   align-items: flex-end;
// `;

// const GoBack = styled.div`
//   position: relative;
//   width: 300px;
//   height: 50px;
//   text-align: center;
//   line-height: 44px;
//   border: 3px solid black;
//   font-weight: 700;
//   cursor: pointer;
//   background-color: ${({ theme }) => theme.colors.grey300};
//   border-radius: 5px;
//   transition: background 200ms;

//   &:hover {
//     background-color: ${({ theme }) => theme.colors.grey100};
//   }
// `;
