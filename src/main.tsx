import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import App from "./App";

// Skill 18: server-state-caching — QueryClient configured at app root
// staleTime: 5 min means cached data is considered fresh for 5 minutes,
// avoiding redundant API calls when navigating between pages.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Skill 18: QueryClientProvider wraps entire app for server-state caching */}
    <QueryClientProvider client={queryClient}>
      {/* Skill 4: ThemeProvider applies MUI theme globally */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Skill 10: BrowserRouter enables client-side routing */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
