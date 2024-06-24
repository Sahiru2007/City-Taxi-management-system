import React from 'react';
import {
  Stack,
  Typography,
} from '@mui/material';

const GetInTouch = () => {
  const phoneNumbers = ['+94 77 123 4567', '+94 76 987 6543', '+94 71 555 7890']; // Add your own random Sri Lanka phone numbers

  return (
    <Stack
      component='section'
      direction="column"
      justifyContent='center'
      alignItems='center'
      sx={{
        py: 10,
        mx: 6,
      }}
    >
      <Typography variant="h4" textAlign={'center'} fontWeight="bold">
        Want to book a ride without registering? Contact Us.
      </Typography>
      <Typography
        variant="body1"
        paragraph
        textAlign={'center'}
        sx={{
          maxWidth: 'sm',
          mx: 0,
        }}
      >
       
      </Typography>
      <Stack spacing={1} sx={{ fontSize: '2rem', textAlign: 'center' }}>
        {phoneNumbers.map((phoneNumber, index) => (
          <Typography key={index} fontWeight="bold" color="darkgray">
            {phoneNumber}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
};

export default GetInTouch;
