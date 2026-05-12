import React from "react";
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
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import PeopleIcon from "@mui/icons-material/People";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate, useLocation } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAuth } from "../contexts/useAuth";

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

export default function SiteNavigation({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, username } = useAuth();

  const menuItems = [
    { text: "Movies", icon: <MovieIcon />, path: "/" },
    { text: "Actors", icon: <PeopleIcon />, path: "/actors" },
    { text: "TV Series", icon: <LiveTvIcon />, path: "/tv" },
    { text: "Fantasy Movies", icon: <AutoAwesomeIcon />, path: "/fantasy" },
    {
      text: "Favorite Actors",
      icon: <FavoriteIcon />,
      path: "/fav-actors",
    },
    { text: "Favorite TV", icon: <FavoriteIcon />, path: "/fav-tv" },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: "bold", color: "primary.main", flexGrow: 1 }}
        >
          TMDB App
        </Typography>
      </Toolbar>
      {isAuthenticated && username && (
        <Typography
          variant="body2"
          sx={{ px: 2, pb: 2, color: "text.secondary" }}
        >
          Welcome, {username}
        </Typography>
      )}
      <List>
        {menuItems.map((item) => {
          const isSelected =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path)) ||
            (item.path === "/" && location.pathname.startsWith("/movies"));

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isSelected}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(123, 31, 162, 0.1)",
                    borderRight: "4px solid",
                    borderColor: "primary.main",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(123, 31, 162, 0.2)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: isSelected ? "primary.main" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: isSelected ? "primary.main" : "inherit" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <List sx={{ mt: "auto" }}>
        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton onClick={() => logout()}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/login")}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/signup")}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
}
