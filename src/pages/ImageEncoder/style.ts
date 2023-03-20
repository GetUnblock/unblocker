import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 10px;
  border-style: dotted;
  border-width: 4px;
  border-radius: 1;
  max-width: 75%;
  height: 150px;
  margin-bottom: 10px;
`;

export const Title = styled.p`
  align-self: center;
`;

export const FileTypeSizeText = styled.p`
  align-self: center;
  font-size: 14px;
`;
