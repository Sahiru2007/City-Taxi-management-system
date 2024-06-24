import React from 'react';
import aSvg from '../assets/a_letter.svg';
import {
    AppBar,
    Toolbar,
    Box,
    List,
    ListItem,
    Typography,
    styled,
    ListItemButton,
    ListItemText,
} from '@mui/material';
// menu
import DrawerItem from './DrawerItem';
// rotas
import { Link } from 'react-router-dom';

// personalizacao
const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
});

const ListMenu = styled(List)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up('sm')]: {
        display: 'flex',
    },
}));

// rotas
const itemList = [
    {
        text: 'Home',
        to: '/',
    },
    {
        text: 'About',
        to: '/about',
    },
    {
        text: 'Contact',
        to: '/contact',
    },
    {
        text: 'Login',
        to: '/login',
    },
    {
        text: 'Signup',
        to: '/userType',
    },
];

const Navbar = () => {
    return (
        <AppBar
            component="nav"
            position="sticky"
            sx={{
                backgroundColor: 'orange',
            }}
            elevation={0}
        >
            <StyledToolbar>
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        fontFamily: "'Afacad', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '28px',
                        fontWeight: 'bold',
                    }}
                >
                    <span style={{ marginRight: '4px' }}>CITY T</span>
                    <img
                        src={aSvg}
                        alt="A"
                        width="24"
                        height="24"
                        style={{ verticalAlign: 'middle', marginLeft: '-7px' }}
                    />
                    XI
                </Typography>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                    <DrawerItem />
                </Box>
                <ListMenu>
                    {itemList.map((item) => {
                        const { text } = item;
                        return (
                            <ListItem key={text}>
                                <ListItemButton
                                    component={Link}
                                    to={item.to}
                                    sx={{
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: '#1e2a5a',
                                        },
                                    }}
                                >
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </ListMenu>
              
            </StyledToolbar>
        </AppBar>
    );
};

export default Navbar;

