import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { setScreenContent } from '../../../services/screen';
import { ScreenInfo } from '../../../shared/Screen';

type Props = {
   screen: ScreenInfo;
   token: string;
};

const videos = [
   {
      title: 'Reddit vs Wallstreet - Der Gamestop Short Squeeze',
      url: 'https://www.youtube.com/watch?v=oBP-8f2VJfQ',
   },
   {
      title: 'Der Fall und Aufstieg von Cyberpunk 2077',
      url: 'https://www.youtube.com/watch?v=1rAseRVXNwY',
   },
   {
      title: 'Das Internet vs. Das Jugendwort des Jahres',
      url: 'https://www.youtube.com/watch?v=ZyClL4TG8uk',
   },
   {
      title: 'Uni Paderborn - Wer mag Brutalismus?',
      url: 'https://www.youtube.com/watch?v=IbFbXbfy0RE',
   },
];

export default function VideoGridContent({ screen, token }: Props) {
   const mutation = useMutation({
      mutationFn: setScreenContent,
   });

   const handleSetVideo = (url: string) => {
      mutation.mutate({
         token,
         screenName: screen.name,
         content: {
            paused: true,
            startPosition: 0,
            type: 'controlled-video',
            url,
         },
      });
   };

   if (screen.onlyScreenShareAllowed) return null;

   return (
      <Box width="100%" height="100%" alignItems="center" justifyContent="center" display="flex">
         <Grid container sx={{ maxWidth: 600 }} spacing={4}>
            {videos.map((x) => (
               <Grid item key={x.url} xs={6} height="100%" sx={{ height: 200 }}>
                  <Card sx={{ height: '100%' }}>
                     <CardActionArea sx={{ height: '100%' }} onClick={() => handleSetVideo(x.url)}>
                        <CardContent>
                           <Typography align="center">{x.title}</Typography>
                        </CardContent>
                     </CardActionArea>
                  </Card>
               </Grid>
            ))}
         </Grid>
      </Box>
   );
}
