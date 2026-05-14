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
  Tooltip,
  Box,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { Link } from "react-router-dom";
import type { BaseMovieProps } from "../types/interfaces";
import { usePlaylists } from "../hooks/usePlaylists";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  movie: BaseMovieProps;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const { playlists, addMovieToPlaylist } = usePlaylists();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e: React.MouseEvent | React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleAddToPlaylist = (
    e: React.MouseEvent | React.SyntheticEvent,
    playlistId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    addMovieToPlaylist(playlistId, movie.id);
    setAnchorEl(null);
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
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
        <Tooltip title="Add to Playlist">
          <IconButton
            onClick={handleMenuClick}
            sx={{
              bgcolor: "background.paper",
              "&:hover": { bgcolor: "grey.200" },
            }}
          >
            <PlaylistAddIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {playlists.length === 0 ? (
            <MenuItem disabled>No playlists available</MenuItem>
          ) : (
            playlists.map((playlist) => (
              <MenuItem
                key={playlist.id}
                onClick={(e) => handleAddToPlaylist(e, playlist.id)}
              >
                {playlist.name}
              </MenuItem>
            ))
          )}
        </Menu>
      </Box>
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

        <CardContent sx={{ flex: 1, pr: 6 }}>
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
