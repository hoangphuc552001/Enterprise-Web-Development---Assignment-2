import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
    title: string;
    description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
    return (
        <Box>
            <Typography variant="h3" component="h1" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {description}
            </Typography>
        </Box>
    );
};

export default PageHeader;
