import {
    Box,
    CircularProgress,
    Container,
    Divider,
    Stack,
    Typography,
    Alert,
} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getActor} from "../api/tmdb-api";
import type {ActorDetailsProps} from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';

const PROFILE_BASE = "https://image.tmdb.org/t/p/w500";

const ActorDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const [actor, setActor] = useState<ActorDetailsProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const data = (await getActor(id!)) as ActorDetailsProps;
                setActor(data);
            } catch {
                setError("Failed to load actor details.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", py: 12}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error || !actor) {
        return (
            <Container maxWidth="lg" sx={{py: 4}}>
                <Alert severity="error">{error || "Actor not found."}</Alert>
            </Container>
        );
    }

    return (
        <Box sx={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Container>
                <Stack direction={{xs: "column", md: "row"}} spacing={4}>
                    {actor.profile_path ? (
                        <Box
                            component="img"
                            src={`${PROFILE_BASE}${actor.profile_path}`}
                            alt={actor.name}
                            sx={{
                                maxWidth: 300,
                                maxHeight: 450,
                                borderRadius: 2,
                            }}
                        />
                    ) : (
                        <></>
                    )}

                    <Stack spacing={2} sx={{ flex: 1 }}>
                        <PageHeader
                            title={actor.name ?? ""}
                            description={actor.known_for_department ? `Known for: ${actor.known_for_department}` : ""}
                        />

                        <Divider/>

                        <Stack direction="row" spacing={3} sx={{flexWrap: "wrap"}}>
                            {actor.birthday && (
                                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                    <CakeIcon fontSize="small" sx={{ mr: 0.5 }}/>
                                    {actor.birthday}
                                </Typography>
                            )}
                            {actor.place_of_birth && (
                                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }}/>
                                    {actor.place_of_birth}
                                </Typography>
                            )}
                            {actor.known_for_department && (
                                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                    <WorkIcon fontSize="small" sx={{ mr: 0.5 }}/>
                                    {actor.known_for_department}
                                </Typography>
                            )}
                        </Stack>

                        <Divider/>

                        <Typography variant="h6" gutterBottom>Biography</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            {actor.biography}
                        </Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default ActorDetailPage;
