import { useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import type { MenuProps } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { Link } from "react-router-dom";
import type { BaseMovieProps } from "../types/interfaces";

import { usePlaylists } from "../hooks/usePlaylists";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  movie: BaseMovieProps;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const { playlists, addToPlaylist } = usePlaylists();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuClose: NonNullable<MenuProps["onClose"]> = () => {
    closeMenu();
  };

  const handleAddToPlaylist = (playlistId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToPlaylist(playlistId, movie.id);
    closeMenu();
  };

  return (
    <Card
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: { xs: "column", sm: "row" },
        position: "relative",
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: "rgba(255, 255, 255, 0.8)",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
        }}
        onClick={handleMenuClick}
      >
        <PlaylistAddIcon color="primary" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {playlists.length === 0 ? (
          <MenuItem disabled>No playlists available</MenuItem>
        ) : (
          playlists.map((p) => (
            <MenuItem
              key={p.id}
              onClick={(e) => handleAddToPlaylist(p.id, e)}
              disabled={p.movieIds.includes(movie.id)}
            >
              {p.name} {p.movieIds.includes(movie.id) && "(Added)"}
            </MenuItem>
          ))
        )}
      </Menu>

      <CardActionArea
        component={Link}
        to={`/movies/${movie.id}`}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "stretch",
        }}
      >
        {movie.poster_path ? (
          <CardMedia
            component="img"
            image={`${POSTER_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            sx={{ width: { sm: 180 }, objectFit: "cover" }}
          />
        ) : null}

        <CardContent sx={{ flex: 1 }}>
          <Stack spacing={1}>
            <Typography variant="h5" component="h2">
              {movie.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Release date: {movie.release_date}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rating: {movie.vote_average.toFixed(1)} / 10
            </Typography>
            <Typography variant="body1">{movie.overview}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
