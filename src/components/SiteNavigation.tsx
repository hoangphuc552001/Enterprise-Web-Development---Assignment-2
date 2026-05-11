import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import PeopleIcon from '@mui/icons-material/People';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import {useNavigate, useLocation} from 'react-router-dom';

const drawerWidth = 240;

interface Props {
    children: React.ReactNode;
}

export default function SiteNavigation({children}: Props) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {text: 'Movies', icon: <MovieIcon/>, path: '/'},
        {text: 'Actors', icon: <PeopleIcon/>, path: '/actors'},
        {text: 'TV Series', icon: <LiveTvIcon/>, path: '/tv'},
    ];

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{fontWeight: 'bold', color: 'primary.main'}}>
                    TMDB App
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((item) => {
                    const isSelected =
                        location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path)) ||
                        (item.path === '/' && location.pathname.startsWith('/movies'));

                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                selected={isSelected}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(123, 31, 162, 0.1)',
                                        borderRight: '4px solid',
                                        borderColor: 'primary.main',
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: 'rgba(123, 31, 162, 0.2)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{color: isSelected ? 'primary.main' : 'inherit'}}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text}
                                              sx={{color: isSelected ? 'primary.main' : 'inherit'}}/>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    return (
        <Box sx={{display: 'flex'}}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: '1px solid rgba(255, 255, 255, 0.12)'
                    },
                }}
            >
                {drawer}
            </Drawer>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                {children}
            </Box>
        </Box>
    );
}
