import styled from '@emotion/styled';
import { Typography } from '@mui/material';

const Root = styled('div')({
   height: '100%',
   width: '100%',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   flexDirection: 'column',
   cursor: 'pointer',
});

const Fill = styled('div')({
   flex: 1,
});

const InfoContainer = styled('div')({
   display: 'flex',
   alignItems: 'center',
   flex: 1,
});

const TextAlignCenter = styled('div')({
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
});

export default function RequestUserInteractionView() {
   return (
      <Root>
         <Fill />
         <TextAlignCenter>
            <Typography variant="h3" align="center">
               Bitte tue etwas
            </Typography>
            <Typography variant="h6" align="center">
               Klicke irgendwo hin | Drücke eine Taste | Tippe irgendwo hin
            </Typography>
         </TextAlignCenter>
         <InfoContainer>
            <Typography variant="caption" color="textSecondary" align="center">
               Wir können aufgrund der Autoplay Policy deines Browsers keinen Ton abspielen, bevor du nicht mit der
               Website interagiert hast.
            </Typography>
         </InfoContainer>
      </Root>
   );
}
