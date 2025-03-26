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
  Checkbox,
  FormControlLabel,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";

function Signup() {
  const navigate = useNavigate();
  const { signup, signInWithGoogle, loading, error } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "agreeToTerms" ? checked : value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await signup(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
        navigate("/");
      } catch (err) {
        console.error("Signup error:", err);
        setErrors({
          ...errors,
          submit: err.message || "Failed to sign up. Please try again.",
        });
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      console.error("Google signup error:", err);
      setErrors({
        ...errors,
        submit:
          err.message || "Failed to sign up with Google. Please try again.",
      });
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
            Sign up for Stay Hub
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create an account to start booking
          </Typography>
        </Box>

        {(errors.submit || error) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit || error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                variant="outlined"
                placeholder="Enter your first name"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                variant="outlined"
                placeholder="Enter your last name"
                disabled={loading}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            variant="outlined"
            placeholder="Enter your email"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            variant="outlined"
            placeholder="Create a password"
            disabled={loading}
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

          <FormControlLabel
            control={
              <Checkbox
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                color="primary"
                disabled={loading}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{" "}
                <Link
                  to="/terms"
                  style={{ color: "#FF385C", textDecoration: "none" }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  style={{ color: "#FF385C", textDecoration: "none" }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ mt: 2 }}
          />
          {errors.agreeToTerms && (
            <Typography variant="caption" color="error">
              {errors.agreeToTerms}
            </Typography>
          )}

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
              "Sign up"
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
            onClick={handleGoogleSignup}
            sx={{ py: 1.5, borderRadius: 2 }}
            disabled={loading}
          >
            Continue with Google
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#FF385C",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Log in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;
