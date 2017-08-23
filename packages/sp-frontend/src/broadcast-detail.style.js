import styled from "styled-components";

export const Column = styled.div`flex-grow: 1;`;

export const Stack = styled.div`border: 1px dotted #333;`;

export const StackItem = styled.div`
  border-bottom: 1px dotted #333;
  &:last-child {
    border-bottom: none;
  }
  padding: 1em;
`;
