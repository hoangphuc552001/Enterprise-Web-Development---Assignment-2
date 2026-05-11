import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFantasyMovies } from "../hooks/useFantasyMovies";

const FantasyMoviePage = () => {
  const navigate = useNavigate();
  const { movies, deleteMovie } = useFantasyMovies();

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            My Fantasy Movies
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate("/fantasy/new")}
            sx={{ mt: 1 }}
          >
            Create Movie
          </Button>
        </Box>

        {movies.length === 0 ? null : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Genres</TableCell>
                  <TableCell>Release Date</TableCell>
                  <TableCell>Runtime</TableCell>
                  <TableCell>Overview</TableCell>
                  <TableCell>Production Companies</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movies.map((movie) => (
                  <TableRow key={movie.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {movie.title}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 600 }}>
                      <Box>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{ flexWrap: "wrap" }}
                          useFlexGap
                        >
                          {movie.genres.map((g) => (
                            <Chip
                              key={g.id}
                              label={g.name}
                              size="small"
                              color="primary"
                            />
                          ))}
                        </Stack>
                      </Box>
                    </TableCell>
                    <TableCell>{movie.releaseDate}</TableCell>
                    <TableCell>{movie.runtime} min</TableCell>
                    <TableCell sx={{ maxWidth: 600 }}>
                      <Box>
                        <Typography variant="body2">
                          {movie.overview}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {movie.productionCompanies.join(", ") || "-"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteMovie(movie.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Container>
  );
};

export default FantasyMoviePage;
