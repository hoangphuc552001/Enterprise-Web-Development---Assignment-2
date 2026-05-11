import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import type { BaseActorProps } from "../types/interfaces";

const PROFILE_BASE_URL = "https://image.tmdb.org/t/p/w185";

interface ActorCardProps {
    actor: BaseActorProps;
}

const ActorCard = ({ actor }: ActorCardProps) => {
    return (
        <Card>
            <CardActionArea 
                component={Link} 
                to={`/actors/${actor.id}`} 
                sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", justifyContent: "flex-start" }}
            >
            <Avatar
                src={actor.profile_path ? `${PROFILE_BASE_URL}${actor.profile_path}` : ""}
                alt={actor.name ?? ""}
                sx={{ width: 120, height: 120, m: 2, fontSize: 40 }}
            />

            <CardContent sx={{ flex: 1 }}>
                <Stack spacing={1}>
                    <Typography variant="h5" component="h2">
                        {actor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Known for: {actor.known_for_department ?? ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Popularity: {actor.popularity.toFixed(1)}
                    </Typography>

                    {actor.known_for && actor.known_for.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                            Notable works: {actor.known_for.map((w) => w.title || w.original_title).filter(Boolean).join(", ")}
                        </Typography>
                    )}
                </Stack>
            </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ActorCard;
