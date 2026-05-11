import { Stack } from "@mui/material";
import ActorCard from "./ActorCard";
import type { BaseActorProps } from "../types/interfaces";

interface ActorListProps {
    actors: BaseActorProps[];
}

const ActorList = ({ actors }: ActorListProps) => {
    return (
        <Stack spacing={2}>
            {actors.map((actor) => (
                <ActorCard key={actor.id} actor={actor} />
            ))}
        </Stack>
    );
};

export default ActorList;
