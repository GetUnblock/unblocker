import { useState } from 'react';
import { ContentCopy, ContentPaste } from '@mui/icons-material/';
import { Snackbar } from '@mui/material'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import * as S from './style';

export default function CodeSnippet(props: any) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <S.Container>
      <S.SnippetContainer>
        <SyntaxHighlighter
          language={props.language}
          style={dark}
        >
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
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={isCopied}
        onClose={() => setIsCopied(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
    </S.Container>
  );
}
