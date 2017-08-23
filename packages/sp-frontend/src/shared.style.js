import styled from "styled-components";

const activeColor = "#00b8ff";

export const FlexContainer = styled.div`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  position: relative;

  flex-direction: ${props => (props.column ? "column" : "row")};
  ${props => (props.padded ? "padding: 1em;" : "")};
`;

export const NiceForm = styled.form`
  margin-left: 0.5em;
  border-left: 2px solid #ccc;
  padding-left: 0.5em;
`;

export const NiceLabel = styled.label`color: #222;`;

export const BigInput = styled.input`
  border: none;
  border-bottom: 2px solid #333;
  background-color: transparent;
  font-size: 1.5em;
  display: block;
  margin: 0.5em 0;
  font-weight: 200;

  &:focus,
  &:active {
    border-bottom-color: ${activeColor};
    outline: none;
  }
`;

export const NiceSubmit = styled.button`
  border: none;
  background-color: transparent;
  color: ${activeColor};
  cursor: pointer;
`;
