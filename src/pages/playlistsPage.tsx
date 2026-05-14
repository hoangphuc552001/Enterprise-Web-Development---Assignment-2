import { useState } from "react";
import {
  Container,
  Stack,
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { usePlaylists } from "../hooks/usePlaylists";
import PageHeader from "../components/PageHeader";

const PlaylistsPage = () => {
  const { playlists, isLoading, createPlaylist, deletePlaylist } =
    usePlaylists();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleCreate = () => {
    if (name.trim()) {
      createPlaylist(name, desc);
      setOpen(false);
      setName("");
      setDesc("");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <PageHeader
            title="My Playlists"
            description="Create and manage your custom themed playlists."
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            New Playlist
          </Button>
        </Stack>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : playlists.length === 0 ? (
          <Typography color="text.secondary">
            You haven't created any playlists yet.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {playlists.map((playlist) => (
              <Accordion key={playlist.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      pr: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6">{playlist.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {playlist.description}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        ml: 2,
                        px: 2,
                        py: 0.5,
                        bgcolor: "rgba(123, 31, 162, 0.1)",
                        color: "primary.main",
                        borderRadius: 4,
                      }}
                    >
                      {playlist.movieIds.length} movies
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {playlist.movieIds.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No movies in this playlist.
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Movie IDs in playlist: {playlist.movieIds.join(", ")}
                    </Typography>
                  )}
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => deletePlaylist(playlist.id)}
                    >
                      Delete Playlist
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Playlist Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!name.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PlaylistsPage;
