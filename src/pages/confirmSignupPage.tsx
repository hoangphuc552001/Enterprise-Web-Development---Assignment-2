import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { confirmSignUp } from "../api/auth-api";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from "@mui/material";

const ConfirmSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(location.state?.username || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await confirmSignUp(username, code);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to confirm sign up",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Confirm Sign Up
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 3 }}
          align="center"
          color="text.secondary"
        >
          Please enter the confirmation code sent to your email address.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Account confirmed successfully! Redirecting to login...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={success || !!location.state?.username}
          />
          <TextField
            label="Confirmation Code"
            fullWidth
            margin="normal"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={success}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || success}
          >
            {isLoading ? "Confirming..." : "Confirm Account"}
          </Button>
        </Box>

        {!success && (
          <Typography align="center" sx={{ mt: 2 }}>
            Ready to sign in? <Link to="/login">Sign In</Link>
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ConfirmSignupPage;
