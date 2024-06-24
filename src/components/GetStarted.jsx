import React from 'react'
import { 
    Box,
    Grid,
    styled,
    Typography,
} from '@mui/material'
import Title from './Title'
// img
import imgDetail from '../assets/image_1.jpeg';
import imgDetail2 from '../assets/image_2.jpeg';


const GetStarted = () => {

    const CustomGridItem = styled(Grid) ({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    })
    
    const CustomTypography = styled(Typography) ({
        fontSize: '1.1rem',
        textAlign: 'start',
        lineHeight: '1.5',
        color: '#515151',
        marginTop: '1.5rem',
    })

    return (
            
        <Grid container spacing={{ xs: 4, sm: 4, md: 0 }}   
        sx={{
            py: 10,
            px: 2,
             
        }}
        >
            <CustomGridItem item xs={12} sm={8} md={6} 
            component = 'section'
           
            >
                <Box component='article'
                sx={{
                    px: 4,
                }}
                >
                    <Title
                    text={
                        'Book in a tap, travel with snap – your effortless ride awaits!'
                    }
                    textAlign={'start'}
                    />
                    <CustomTypography>
                    Easily plan your ride with a simple tap on our user-friendly platform.<br/>
                    Your stress-free journey begins with quick and effortless bookings, <br/>
                    ensuring a smooth and enjoyable travel experience with City Taxi (PVT) Ltd<br/>
                    </CustomTypography> 
                </Box>

            </CustomGridItem>
            
            <Grid item xs={12} sm={4} md={6}>
                <img src={imgDetail} alt="" 
                style={{
                    width: '100%',
                    
                }}
                />
            </Grid>

            <Grid item xs={12} sm={4} md={6}
            sx={{
                order: {xs: 4, sm: 4, md: 3}
            }}
            >
                <img src={imgDetail2} alt="" 
                style={{ 
                    width: "100%",
                }}
                />
            </Grid>

            <CustomGridItem item xs={12} sm={8} md={6}
            sx={{
                order: {xs: 3, sm: 3, md: 4}
            }}
            >
                <Box component='article'
                sx={{
                    px: 4,
                }}
                >
                    <Title
                    text={
                        'Ride into Tomorrow: Your Passport to Effortless and Futuristic Connectivity!'
                        
                    }
                    textAlign={'start'}
                    />
                    <CustomTypography>
                    Step into a world of seamless connectivity and futuristic service<br/>
                     with our cutting-edge system. As your reliable passport to the future of<br/>
                      transportation, we offer an efficient and hassle-free journey, connecting you<br/>
                       to the world with modern, innovative solutions. Experience tomorrow's travel today, <br/>
                       where every ride is a glimpse into the future of convenience and reliability.<br/>
                    </CustomTypography>
                </Box>
            </CustomGridItem>
            
        </Grid>
        
    )
}

export default GetStarted;