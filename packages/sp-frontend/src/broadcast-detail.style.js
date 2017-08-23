import styled from "styled-components";

export const Column = styled.div`
  flex-basis: 0;
  flex-grow: 1;
`;

export const Stack = styled.div`
  flex-grow: 2;
  flex-basis: 0;
  background-color: #ccc;
`;

export const StackDragWrapper = styled.div`padding: 1em;`;

export const StackItem = styled.div`
  background-color: white;
  border: 1px solid #333;
  padding: 1em;
`;
