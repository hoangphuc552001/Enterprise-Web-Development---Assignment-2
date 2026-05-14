import { useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { getGenres } from "../api/tmdb-api";
import { useFantasyMovies } from "../hooks/useFantasyMovies";
import PageHeader from "../components/PageHeader";
import type { FantasyMovie } from "../types/interfaces";

interface FormValues {
  title: string;
  overview: string;
  genreIds: number[];
  releaseDate: string;
  runtime: number;
  productionCompanies: string[];
  posterPath: string;
  cast: { name: string; roleName: string; description: string }[];
}

const FantasyMovieFormPage = () => {
  const navigate = useNavigate();
  const { addMovie } = useFantasyMovies();
  const [companyInput, setCompanyInput] = useState("");

  const { data: genresData } = useQuery<
    { genres: Array<{ id: number; name: string }> },
    Error
  >({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
  });
  const allGenres = genresData?.genres ?? [];

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      overview: "",
      genreIds: [],
      releaseDate: "",
      runtime: 90,
      productionCompanies: [],
      posterPath: "",
      cast: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cast",
  });

  const companies =
    useWatch({
      control,
      name: "productionCompanies",
    }) ?? [];

  const addCompany = () => {
    const trimmed = companyInput.trim();
    if (!trimmed || companies.includes(trimmed)) return;
    setValue("productionCompanies", [...companies, trimmed]);
    setCompanyInput("");
  };

  const removeCompany = (name: string) => {
    setValue(
      "productionCompanies",
      companies.filter((c) => c !== name),
    );
  };

  const onSubmit = (values: FormValues) => {
    const selectedGenres = allGenres.filter((g) =>
      values.genreIds.includes(g.id),
    );
    const movie: Omit<FantasyMovie, "id"> = {
      title: values.title,
      overview: values.overview,
      genres: selectedGenres,
      releaseDate: values.releaseDate,
      runtime: Number(values.runtime),
      productionCompanies: values.productionCompanies,
      posterPath: values.posterPath,
      cast: values.cast,
    };
    addMovie(movie);
    navigate(`/fantasy`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Create Fantasy Movie"
          description="Design your own movie record."
        />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title", { required: "Title is required" })}
            />

            <TextField
              label="Overview"
              fullWidth
              multiline
              rows={4}
              error={!!errors.overview}
              helperText={errors.overview?.message}
              {...register("overview", { required: "Overview is required" })}
            />

            <Controller
              name="genreIds"
              control={control}
              rules={{
                validate: (v) => v.length > 0 || "Select at least one genre",
              }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.genreIds}>
                  <InputLabel>Genres</InputLabel>
                  <Select
                    multiple
                    {...field}
                    input={<OutlinedInput label="Genres" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as number[]).map((id) => {
                          const genre = allGenres.find((g) => g.id === id);
                          return (
                            <Chip
                              key={id}
                              label={genre?.name ?? id}
                              size="small"
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {allGenres.map((genre) => (
                      <MenuItem key={genre.id} value={genre.id}>
                        {genre.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.genreIds && (
                    <FormHelperText>{errors.genreIds.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <TextField
              label="Release Date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.releaseDate}
              helperText={errors.releaseDate?.message}
              {...register("releaseDate", {
                required: "Release date is required",
              })}
            />

            <TextField
              label="Runtime (minutes)"
              type="number"
              fullWidth
              slotProps={{ htmlInput: { min: 1 } }}
              error={!!errors.runtime}
              helperText={errors.runtime?.message}
              {...register("runtime", {
                required: "Runtime is required",
                min: { value: 1, message: "Must be at least 1 minute" },
              })}
            />

            <TextField
              label="Poster URL"
              fullWidth
              error={!!errors.posterPath}
              helperText={errors.posterPath?.message}
              {...register("posterPath")}
            />

            <Stack spacing={2}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Cast Members
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  style={{ marginLeft: "10px" }}
                  startIcon={<AddIcon />}
                  onClick={() =>
                    append({ name: "", roleName: "", description: "" })
                  }
                >
                  Add Cast
                </Button>
              </Stack>
              {fields.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1 }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      mb: 2,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2">
                      Cast Member {index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Stack spacing={2}>
                    <TextField
                      label="Actor Name"
                      size="small"
                      fullWidth
                      error={!!errors.cast?.[index]?.name}
                      helperText={errors.cast?.[index]?.name?.message}
                      {...register(`cast.${index}.name` as const, {
                        required: "Name is required",
                      })}
                    />
                    <TextField
                      label="Role Name"
                      size="small"
                      fullWidth
                      error={!!errors.cast?.[index]?.roleName}
                      helperText={errors.cast?.[index]?.roleName?.message}
                      {...register(`cast.${index}.roleName` as const, {
                        required: "Role Name is required",
                      })}
                    />
                    <TextField
                      label="Description"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      {...register(`cast.${index}.description` as const)}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Production Companies
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Add company..."
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCompany();
                    }
                  }}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={addCompany}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Stack>
              {companies.length > 0 && (
                <Stack spacing={0.5}>
                  {companies.map((c) => (
                    <Stack
                      key={c}
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {c}
                      </Typography>
                      <IconButton size="small" onClick={() => removeCompany(c)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button variant="outlined" onClick={() => navigate("/fantasy")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Create Movie
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default FantasyMovieFormPage;
