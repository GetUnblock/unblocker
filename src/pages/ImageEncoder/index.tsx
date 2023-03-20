import { useCallback, useState } from 'react';
import {
  Container,
  Box,
  Typography,
} from '@mui/material';
import CodeSnippet from '../../components/CodeSnippet';
import Dropzone from 'react-dropzone';

export default function ImageEncoder() {
  const [file, setFile] = useState(null as any);
  const [base64Img, setBase64Img] = useState('');

  const onDrop = useCallback((acceptedFile: any) => {
    setFile(null);
    setBase64Img('');
    const file = acceptedFile[0];

    console.log(acceptedFile);

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
      <Box
        sx={{ my: 2 }}
      >
        <Typography variant="body1">
          Upload your image:
        </Typography>
      </Box>
      <Dropzone
        multiple={false}
        onDrop={onDrop}
        accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps({ style: { borderStyle: 'dotted', borderWidth: 1, borderRadius: 1, maxWidth: '50%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' } })}>
              <input {...getInputProps()} />
              <p>Drag and drop or click to upload an image</p>
            </div>
          </section>
        )}
      </Dropzone>
      {file ?
        <Typography variant="body1">
          {`Uploaded file:  ${file.name}`}
        </Typography>
        :
        <Typography variant="body1">
          No file uploaded yet
        </Typography>
      }
      {base64Img &&
        <Box sx={{ my: 4 }}>
          <Typography component='div'>
            Copy the content below and use it on the endpoints with required base64 image strings
          </Typography>
          <CodeSnippet code={base64Img} language={"text"} />
        </Box>
      }
    </Container>
  );
}
