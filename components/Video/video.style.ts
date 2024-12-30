'use client'
import styled from '@emotion/styled';

export const VideoComp = styled.video`
  background: #222;
  vertical-align: top;
  --width: 45%;
  width: var(--width);
  height: calc(var(--width) * 0.5625);
  margin: 0 16px
`;