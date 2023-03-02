import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 5px;
  padding-bottom: 10px;
`;

export const SnippetTitle = styled.span`
  font-size: 16px;
  font-family: 'Poppins_500Medium';
  margin-bottom: 10px;
`;

export const SnippetContainer = styled.div`
  flex-shrink: 1;
  width: 75%;
`;

export const ClipboardContainer = styled.div`
  height: 16px;
  width: 16px;
`;

export const IconClickableContainer = styled.button`
  height: 40px;
  width: 40px;
  background: transparent;
  border: transparent;
`;