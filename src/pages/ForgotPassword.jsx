import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Email } from "@mui/icons-material";

function ForgotPassword() {
  const { resetPassword, loading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      await resetPassword(email);
      setSuccessMessage(
        "Password reset link has been sent to your email address. Please check your inbox."
      );
    } catch (err) {
      console.error("Password reset error:", err);
      setError(
        err.message || "Failed to send password reset email. Please try again."
      );
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}
          >
            Reset Your Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your email address and we'll send you a link to reset your
            password
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
            placeholder="Enter your email address"
            disabled={loading}
            InputProps={{
              startAdornment: <Email sx={{ color: "text.secondary", mr: 1 }} />,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ py: 1.5, mt: 3, mb: 2, borderRadius: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">
            Remember your password?{" "}
            <Link
              to="/login"
              style={{
                color: "#FF385C",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Back to Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ForgotPassword;
