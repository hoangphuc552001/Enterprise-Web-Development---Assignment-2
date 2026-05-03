import { createTheme } from "@mui/material/styles";

// Skill 4: material-ui-basics — centralised MUI theme
// Provides consistent colours, typography, and component defaults across the entire app
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7B1FA2", // deep purple
    },
    secondary: {
      main: "#FF6D00", // vibrant orange
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(123, 31, 162, 0.3)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
