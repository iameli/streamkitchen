import styled from "styled-components";
import { activeColor } from "./shared.style";

export const Column = styled.div`
  flex-basis: 0;
  flex-grow: 1;
  padding: 0 1em;
`;

export const Stack = styled.div`
  flex-grow: 2;
  flex-basis: 0;
  background-color: #ccc;
`;

export const StackTitle = styled.h4`
  text-align: center;
  position: relative;
`;

export const StackDragWrapper = styled.div`padding: 1em;`;

export const StackItem = styled.div`
  background-color: white;
  border: 1px solid #333;
  padding: 1em;
`;

export const OutputTitle = styled.strong``;

export const Output = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const OutputButton = styled.button`
  border: none;
  font-size: 1.5em;
  position: relative;
  cursor: pointer;

  background-color: ${props => (props.active ? activeColor : "#aaa")};

  border: 1px solid transparent;

  &:focus,
  &:active {
    border: 1px solid ${activeColor};
    outline: none;
  }

  &::before {
    display: block;
    content: "OFF";
    visibility: ${props => (props.active ? "hidden" : "visible")};
  }

  &::after {
    position: absolute;
    width: 100%;
    top: 2px;
    left: 0;
    display: block;
    text-align: center;
    visibility: ${props => (props.active ? "visible" : "hidden")};
    content: "ON";
  }
`;
