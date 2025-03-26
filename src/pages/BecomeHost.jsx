import { useState, useRef } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Divider,
  Alert,
  CircularProgress,
  ImageList,
  ImageListItem,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  Home,
  LocationOn,
  PhotoCamera,
  Description,
  AttachMoney,
  Check,
  Upload,
  Delete,
} from "@mui/icons-material";
import { storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "../context/AuthContext";

const steps = ["Property Type", "Location", "Description", "Pricing", "Review"];

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "cabin", label: "Cabin" },
  { value: "condo", label: "Condominium" },
  { value: "hotel", label: "Boutique Hotel" },
];

const amenities = [
  "Wi-Fi",
  "Air conditioning",
  "Kitchen",
  "Washer",
  "Dryer",
  "TV",
  "Pool",
  "Hot tub",
  "Free parking",
  "Gym",
];

function BecomeHost() {
  const { user } = useAuthContext();
  const [activeStep, setActiveStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  const [propertyData, setPropertyData] = useState({
    type: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    photos: [],
    title: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    selectedAmenities: [],
    price: 100,
    cleaningFee: 50,
    serviceFee: 20,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({
      ...propertyData,
      [name]: value,
    });
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = [...propertyData.selectedAmenities];
    if (currentAmenities.includes(amenity)) {
      setPropertyData({
        ...propertyData,
        selectedAmenities: currentAmenities.filter((item) => item !== amenity),
      });
    } else {
      setPropertyData({
        ...propertyData,
        selectedAmenities: [...currentAmenities, amenity],
      });
    }
  };

  const handleSubmit = () => {
    // In a real app, you would submit the property data to the backend here
    console.log("Property data submitted:", propertyData);
    handleNext();
  };

  // Function to compress image before upload
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create a new file from the blob
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Canvas to Blob conversion failed"));
              }
            },
            "image/jpeg",
            0.7
          ); // 0.7 quality gives good compression
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");
    setUploadProgress(0);

    try {
      // Process files in batches of 3 for better performance
      const BATCH_SIZE = 3;
      const totalFiles = files.length;
      let processedFiles = 0;
      let allUploadedPhotos = [];

      // Process files in batches
      for (let i = 0; i < totalFiles; i += BATCH_SIZE) {
        const batch = Array.from(files).slice(i, i + BATCH_SIZE);

        // First compress all images in the batch
        const compressedBatch = await Promise.all(
          batch.map((file) => compressImage(file))
        );

        // Then upload the compressed batch
        const batchPromises = compressedBatch.map(async (file) => {
          // Create a unique file name
          const fileName = `${uuidv4()}-${file.name}`;
          const storageRef = ref(
            storage,
            `property_images/${user?.uid || "anonymous"}/${fileName}`
          );

          // Upload the file
          await uploadBytes(storageRef, file);

          // Get the download URL
          const downloadURL = await getDownloadURL(storageRef);

          // Update progress
          processedFiles++;
          setUploadProgress(Math.round((processedFiles / totalFiles) * 100));

          return {
            url: downloadURL,
            name: file.name,
            id: uuidv4(),
          };
        });

        const batchResults = await Promise.all(batchPromises);
        allUploadedPhotos = [...allUploadedPhotos, ...batchResults];
      }

      // Add new photos to existing ones
      setPropertyData({
        ...propertyData,
        photos: [...propertyData.photos, ...allUploadedPhotos],
      });
    } catch (error) {
      console.error("Error uploading photos:", error);
      setUploadError("Failed to upload photos. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = (photoId) => {
    setPropertyData({
      ...propertyData,
      photos: propertyData.photos.filter((photo) => photo.id !== photoId),
    });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              What type of property are you listing?
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Property Type</InputLabel>
              <Select
                name="type"
                value={propertyData.type}
                onChange={handleInputChange}
                label="Property Type"
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 4 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Property is for</FormLabel>
                <RadioGroup row defaultValue="entire">
                  <FormControlLabel
                    value="entire"
                    control={<Radio />}
                    label="Entire place"
                  />
                  <FormControlLabel
                    value="private"
                    control={<Radio />}
                    label="Private room"
                  />
                  <FormControlLabel
                    value="shared"
                    control={<Radio />}
                    label="Shared room"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Where is your property located?
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="address"
                  value={propertyData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={propertyData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={propertyData.state}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Zip/Postal Code"
                  name="zipCode"
                  value={propertyData.zipCode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={propertyData.country}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Tell guests about your place
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Listing Title"
                  name="title"
                  value={propertyData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Cozy apartment in the heart of the city"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={propertyData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  placeholder="Describe your place, highlight what makes it special..."
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Bedrooms</InputLabel>
                  <Select
                    name="bedrooms"
                    value={propertyData.bedrooms}
                    onChange={handleInputChange}
                    label="Bedrooms"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} {num === 1 ? "bedroom" : "bedrooms"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Bathrooms</InputLabel>
                  <Select
                    name="bathrooms"
                    value={propertyData.bathrooms}
                    onChange={handleInputChange}
                    label="Bathrooms"
                  >
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} {num === 1 ? "bathroom" : "bathrooms"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Max Guests</InputLabel>
                  <Select
                    name="maxGuests"
                    value={propertyData.maxGuests}
                    onChange={handleInputChange}
                    label="Max Guests"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} {num === 1 ? "guest" : "guests"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Amenities
                </Typography>
                <Grid container spacing={2}>
                  {amenities.map((amenity) => (
                    <Grid item xs={6} sm={4} key={amenity}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={propertyData.selectedAmenities.includes(
                              amenity
                            )}
                            onChange={() => handleAmenityToggle(amenity)}
                          />
                        }
                        label={amenity}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Set your price
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You can change your pricing anytime.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Base price (per night)"
                  name="price"
                  type="number"
                  InputProps={{ startAdornment: "$" }}
                  value={propertyData.price}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cleaning fee"
                  name="cleaningFee"
                  type="number"
                  InputProps={{ startAdornment: "$" }}
                  value={propertyData.cleaningFee}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service fee"
                  name="serviceFee"
                  type="number"
                  InputProps={{ startAdornment: "$" }}
                  value={propertyData.serviceFee}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Box
              sx={{ mt: 4, p: 3, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Price breakdown
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Base price</Typography>
                <Typography variant="body2">${propertyData.price}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Cleaning fee</Typography>
                <Typography variant="body2">
                  ${propertyData.cleaningFee}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Service fee</Typography>
                <Typography variant="body2">
                  ${propertyData.serviceFee}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2">
                  Total (before taxes)
                </Typography>
                <Typography variant="subtitle2">
                  $
                  {Number(propertyData.price) +
                    Number(propertyData.cleaningFee) +
                    Number(propertyData.serviceFee)}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review your listing
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review all the information you've provided before
              publishing your listing.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Property Details
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Property Type
                    </Typography>
                    <Typography variant="body1">
                      {propertyTypes.find(
                        (type) => type.value === propertyData.type
                      )?.label || "Not specified"}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {propertyData.address}, {propertyData.city},{" "}
                      {propertyData.state}, {propertyData.zipCode},{" "}
                      {propertyData.country}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Capacity
                    </Typography>
                    <Typography variant="body1">
                      {propertyData.bedrooms} bedroom(s),{" "}
                      {propertyData.bathrooms} bathroom(s),{" "}
                      {propertyData.maxGuests} guest(s)
                    </Typography>
                  </Box>
                  {propertyData.photos.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Photos
                      </Typography>
                      <Typography variant="body1">
                        {propertyData.photos.length} photo(s) uploaded
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={propertyData.photos[0].url}
                          alt="Property preview"
                          style={{
                            width: "100%",
                            borderRadius: 8,
                            maxHeight: 150,
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Pricing
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Base Price (per night)
                    </Typography>
                    <Typography variant="body1">
                      ${propertyData.price}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Cleaning Fee
                    </Typography>
                    <Typography variant="body1">
                      ${propertyData.cleaningFee}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Service Fee
                    </Typography>
                    <Typography variant="body1">
                      ${propertyData.serviceFee}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">
                      Total (before taxes)
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      $
                      {Number(propertyData.price) +
                        Number(propertyData.cleaningFee) +
                        Number(propertyData.serviceFee)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}
        >
          {activeStep === steps.length
            ? "Listing Published!"
            : "List Your Property"}
        </Typography>

        {activeStep === steps.length ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Check sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Congratulations!
            </Typography>
            <Typography variant="body1" paragraph>
              Your property has been successfully listed on our platform.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              onClick={() => (window.location.href = "/")}
            >
              Go to Homepage
            </Button>
          </Box>
        ) : (
          <>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 4, mb: 4 }}>{getStepContent(activeStep)}</Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={
                  activeStep === steps.length - 1 ? handleSubmit : handleNext
                }
              >
                {activeStep === steps.length - 1 ? "Publish Listing" : "Next"}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default BecomeHost;
