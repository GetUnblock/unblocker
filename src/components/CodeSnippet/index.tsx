import { useState } from 'react';
import { ContentCopy, ContentPaste } from '@mui/icons-material/';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import * as S from './style';

export default function CodeSnippet(props: any) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <S.Container>
      <S.SnippetContainer>
        <SyntaxHighlighter language="json" style={dark}>
          {props.code}
        </SyntaxHighlighter>
      </S.SnippetContainer>
      <S.ClipboardContainer>
        <CopyToClipboard
          onCopy={() => setIsCopied(true)}
          text={props.code}
        >
          <S.IconClickableContainer>
            {isCopied ?
              <ContentPaste sx={{ color: '#000000' }} />
              : <ContentCopy sx={{ color: '#000000' }} />}
          </S.IconClickableContainer>
        </CopyToClipboard>
      </S.ClipboardContainer>
    </S.Container>
  );
}
