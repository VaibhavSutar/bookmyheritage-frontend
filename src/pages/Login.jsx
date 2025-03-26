import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const navigate = useNavigate();
  const { login, signInWithGoogle, loading, error } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (formError) {
      setFormError("");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError("Please fill in all fields");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }

    try {
      console.log("Attempting login with:", { email: formData.email });
      await login(formData.email, formData.password);
      console.log("Login successful");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      // Handle specific Firebase error codes
      switch (err.code) {
        case "auth/user-not-found":
          setFormError("No account found with this email address");
          break;
        case "auth/wrong-password":
          setFormError("Incorrect password");
          break;
        case "auth/invalid-email":
          setFormError("Invalid email address format");
          break;
        case "auth/user-disabled":
          setFormError("This account has been disabled");
          break;
        case "auth/too-many-requests":
          setFormError("Too many failed attempts. Please try again later");
          break;
        default:
          setFormError(err.message || "Failed to login. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Attempting Google login");
      await signInWithGoogle();
      console.log("Google login successful");
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      switch (err.code) {
        case "auth/popup-closed-by-user":
          setFormError("Login cancelled. Please try again");
          break;
        case "auth/popup-blocked":
          setFormError("Popup blocked. Please allow popups for this site");
          break;
        default:
          setFormError(
            err.message || "Failed to login with Google. Please try again."
          );
      }
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
            Log in to Hotel Booking
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Please enter your details
          </Typography>
        </Box>

        {(formError || error) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError || error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            placeholder="Enter your email"
            disabled={loading}
            error={!!formError && formError.includes("email")}
            helperText={
              formError && formError.includes("email") ? formError : ""
            }
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            placeholder="Enter your password"
            disabled={loading}
            error={!!formError && formError.includes("password")}
            helperText={
              formError && formError.includes("password") ? formError : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 2,
            }}
          >
            <Typography
              variant="body2"
              component={Link}
              to="/forgot-password"
              sx={{ color: "primary.main", textDecoration: "none" }}
            >
              Forgot password?
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ py: 1.5, mb: 2, borderRadius: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Log in"
            )}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            sx={{ py: 1.5, borderRadius: 2 }}
            disabled={loading}
          >
            Continue with Google
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#FF385C",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
