import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { PhotoCamera, Edit, Save, Cancel } from "@mui/icons-material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

function Profile() {
  const { user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
    if (user) {
      setProfileData({
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user, authLoading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      // Upload image to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `profile_images/${user.uid}/${file.name}`
      );
      await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile
      await updateProfile(user, {
        photoURL: downloadURL,
      });

      setProfileData((prev) => ({
        ...prev,
        photoURL: downloadURL,
      }));
      setSuccess("Profile image updated successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      await updateProfile(user, {
        displayName: profileData.displayName,
      });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
            Profile
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
            <Avatar
              src={profileData.photoURL}
              alt={profileData.displayName}
              sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
            />
            <input
              accept="image/*"
              type="file"
              id="icon-button-file"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="icon-button-file">
              <IconButton
                color="primary"
                component="span"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: -8,
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>

          <Box sx={{ mb: 3 }}>
            {!isEditing ? (
              <>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {profileData.displayName || "No name set"}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {profileData.email}
                </Typography>
                <Button
                  startIcon={<Edit />}
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              <Box component="form" noValidate>
                <TextField
                  fullWidth
                  label="Display Name"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  margin="normal"
                  disabled
                />
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                  }}
                >
                  <Button
                    startIcon={<Save />}
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save
                  </Button>
                  <Button
                    startIcon={<Cancel />}
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData({
                        ...profileData,
                        displayName: user.displayName || "",
                      });
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
