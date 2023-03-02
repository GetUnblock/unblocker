import { Info } from '../../assets/Info';
import { Typography } from '@mui/material';

import * as S from './style';

export default function InfoDisclaimer(props: any) {
    return (
        <S.DisclaimerContainer>
        <S.InfoButton>
          <Info/>
        </S.InfoButton>
        <Typography variant="body1" gutterBottom>
            {props.text}
        </Typography>
      </S.DisclaimerContainer>
    );
}
