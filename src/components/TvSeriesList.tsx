import { Stack } from "@mui/material";
import TvSeriesCard from "./TvSeriesCard";
import type { BaseTvSeriesProps } from "../types/interfaces";

interface TvSeriesListProps {
    series: BaseTvSeriesProps[];
}

const TvSeriesList = ({ series }: TvSeriesListProps) => {
    return (
        <Stack spacing={2}>
            {series.map((show) => (
                <TvSeriesCard key={show.id} series={show} />
            ))}
        </Stack>
    );
};

export default TvSeriesList;
