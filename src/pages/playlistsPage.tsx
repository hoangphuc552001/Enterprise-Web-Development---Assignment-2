import { useState } from "react";
import {
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../hooks/usePlaylists";
import PageHeader from "../components/PageHeader";

const PlaylistsPage = () => {
  const { playlists, createPlaylist, deletePlaylist } = usePlaylists();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (name.trim()) {
      createPlaylist(name, description);
      setOpen(false);
      setName("");
      setDescription("");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PageHeader
            title="My Playlists"
            description="Create and manage your custom movie playlists."
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Create Playlist
          </Button>
        </Box>

        {playlists.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center", py: 8 }}
          >
            You haven't created any playlists yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {playlists.map((playlist) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={playlist.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="div" gutterBottom>
                      {playlist.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {playlist.description || "No description provided."}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {playlist.movieIds.length} movie
                      {playlist.movieIds.length === 1 ? "" : "s"}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/playlists/${playlist.id}`)}
                    >
                      View Movies
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => deletePlaylist(playlist.id)}
                      aria-label="delete playlist"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Playlist Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              label="Description (optional)"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              variant="contained"
              disabled={!name.trim()}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
};

export default PlaylistsPage;
