import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { differenceInDays } from "date-fns";

// Mock data - replace with actual API calls in production
const hotelData = {
  id: 1,
  name: "Luxury Beach Resort",
  location: "Maldives",
  price: 299,
  image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
};

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [error, setError] = useState("");

  // In a real application, fetch hotel data based on id
  const hotel = hotelData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = differenceInDays(checkOut, checkIn);
    return nights * hotel.price;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates");
      return;
    }

    // Here you would typically make an API call to process the booking
    console.log("Booking submitted:", {
      hotelId: id,
      checkIn,
      checkOut,
      guests,
      ...formData,
    });

    // Navigate to confirmation page or show success message
    alert("Booking successful!");
    navigate("/");
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Booking Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Complete your booking
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Dates and Guests */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Dates and Guests
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Check-in"
                          value={checkIn}
                          onChange={setCheckIn}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                          minDate={new Date()}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Check-out"
                          value={checkOut}
                          onChange={setCheckOut}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                          minDate={checkIn || new Date()}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Guests</InputLabel>
                        <Select
                          value={guests}
                          label="Guests"
                          onChange={(e) => setGuests(e.target.value)}
                        >
                          {[1, 2, 3, 4].map((num) => (
                            <MenuItem key={num} value={num}>
                              {num} Guest{num > 1 ? "s" : ""}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Payment Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Payment Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Expiry Date (MM/YY)"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="CVV"
                    name="cvv"
                    type="password"
                    value={formData.cvv}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Confirm Booking
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Booking Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>

            <Box sx={{ mb: 3 }}>
              <img
                src={hotel.image}
                alt={hotel.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              {hotel.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {hotel.location}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                ${hotel.price} x{" "}
                {checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0}{" "}
                nights
              </Typography>
              <Typography variant="h6">Total: ${calculateTotal()}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Booking;
