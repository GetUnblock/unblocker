import { useCallback, useState } from 'react';
import {
  Container,
  Box,
  Typography,
} from '@mui/material';
import CodeSnippet from '../../components/CodeSnippet';
import Dropzone from 'react-dropzone';

import * as S from './style';

export default function ImageEncoder() {
  const [file, setFile] = useState(null as any);
  const [base64Img, setBase64Img] = useState('');
  const fileSize = 500000;

  const onDropFile = useCallback((acceptedFile: any) => {
    setFile(null);
    setBase64Img('');
    const file = acceptedFile[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          setBase64Img(base64String);
        }
      };
      reader.readAsDataURL(file);
      setFile(file);
    } else {
      alert('Please upload a valid image with format: .png or .jpg or .jpeg');
    }
  }, []);

  return (
    <Container>
      <Box sx={{ my: 2 }}>
        <Typography variant="h4" component="h1" align="center">
          Upload and encode an image
        </Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        <Dropzone
          multiple={false}
          onDrop={onDropFile}
          accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
          maxSize={fileSize}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <S.Container {...getRootProps()}>
                <input {...getInputProps()} />
                <S.Title>Drag and drop or click to upload an image</S.Title>
                <S.FileTypeSizeText>Allowed formats: PNG, JPEG - Max size: 500Kb</S.FileTypeSizeText>
              </S.Container>
            </section>
          )}
        </Dropzone>
      </Box>
      <Box sx={{ my: 2 }}>
        {file ?
          <Typography variant="body1">
            {`Uploaded file:  ${file.name}`}
          </Typography>
          :
          <Typography variant="body1">
            No file uploaded yet
          </Typography>
        }
      </Box>
      {base64Img &&
        <Box sx={{ my: 4 }}>
          <Typography variant='body1'>
            Copy the content below and use it on the endpoints with required base64 image strings
          </Typography>
          <CodeSnippet code={base64Img} language={"text"} />
        </Box>
      }
    </Container>
  );
}
