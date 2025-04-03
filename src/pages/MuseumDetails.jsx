"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
  Alert,
  Grid,
  Paper,
  Chip,
  Divider,
  Tabs,
  Tab,
  Skeleton,
  useMediaQuery,
  useTheme,
  IconButton,
  Snackbar,
} from "@mui/material"
import {
  LocationOn,
  Euro,
  Category,
  AccessTime,
  ArrowBack,
  ArrowForward,
  CalendarMonth,
  AccessibilityNew,
  Language,
  Share,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../firebase/config"
import { fetchPlaceById } from "../data/properties"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import axios from "axios"
import { getAuth } from "firebase/auth"
import { apiroute } from "../common/localvariable"
import { runTransaction, doc } from "firebase/firestore"
const MuseumDetail = () => {
  const { id } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()
  const auth = getAuth()

  const [museum, setMuseum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [tabValue, setTabValue] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [visitorCount, setVisitorCount] = useState(1)
  const [crowdPrediction, setCrowdPrediction] = useState(null)
  const [crowdLoading, setCrowdLoading] = useState(false)
  const [seasonPrediction, setSeasonPrediction] = useState(null)

  // Available time slots (would come from API in a real app)
  const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"]

  // Fetch museum data on mount
  useEffect(() => {
    const fetchMuseum = async () => {
      try {
        const data = await fetchPlaceById(id)
        if (data) {
          setMuseum(data)
        } else {
          setError("Museum not found")
        }
      } catch (err) {
        setError("An error occurred while fetching the museum data")
      } finally {
        setLoading(false)
      }
    }

    fetchMuseum()
  }, [id])

  // Handle booking submission
  const handleBooking = async () => {
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      navigate("/login"); // Redirect to login if no user is logged in
      return;
    }
  
    if (!selectedDate || !selectedTimeSlot || visitorCount <= 0) return;
  
    try {
      const bookingRef = await addDoc(collection(db, "bookings"), {
        userId: currentUser.uid,
        museumId: id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        visitors: visitorCount,
        username: currentUser.displayName,
      });
  
      // Get reference to the corresponding museum document
      const museumRef = doc(db, "places", id);
  
      await runTransaction(db, async (transaction) => {
        const museumDoc = await transaction.get(museumRef);
        if (!museumDoc.exists()) throw new Error("Museum not found");
  
        const currentData = museumDoc.data();
        const updatedBookings = (currentData.bookingsCount || 0) + 1;
  
        // Update daily stats
        const bookingDate = selectedDate.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
        const dailyStats = currentData.dailyStats || {};
        dailyStats[bookingDate] = (dailyStats[bookingDate] || 0) + visitorCount;
  
        const isToday = bookingDate === new Date().toISOString().split("T")[0];
        const updatedCrowd = isToday
          ? (Number(currentData.currentcrowd) || 0) + visitorCount
          : currentData.currentcrowd;
  
        transaction.update(museumRef, {
          currentcrowd: updatedCrowd,
          bookingsCount: updatedBookings,
          dailyStats,
        });
      });
  
      setBookingSuccess(true);
      setError(null);
  
      // Reset form after successful booking
      setTimeout(() => {
        setBookingSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Booking Error:", error);
      setError("Failed to book your visit, please try again.");
    }
  };
  
  const handleNextImage = () => {
    if (museum?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex === museum.images.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const handlePrevImage = () => {
    if (museum?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? museum.images.length - 1 : prevIndex - 1))
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setSelectedTimeSlot("")
    setCrowdPrediction(null) // Reset prediction when date changes
  }

  const handleTimeSlotSelection = (time) => {
    setSelectedTimeSlot(time)
    if (selectedDate) {
      fetchCrowdPrediction(selectedDate, time)
    }
  }

  const fetchCrowdPrediction = async (date, time) => {
    setCrowdLoading(true) // Start loading
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0
    const isHoliday = 0 
    const temperature = 30 
    const month = date.getMonth() + 1
    const hour = parseInt(time.split(":")[0])

    try {
      const crowdResponse = await axios.post(`${apiroute}/predict/crowd`, {
        day_of_week: dayOfWeek,
        is_weekend: isWeekend,
        is_holiday: isHoliday,
        temperature,
        month,
        hour,
      })
      setCrowdPrediction(crowdResponse.data.prediction)

      const seasonResponse = await axios.post(`${apiroute}/predict/season`, {
        month,
        temperature,
        is_holiday: isHoliday,
      })
      setSeasonPrediction(seasonResponse.data.prediction)
    } catch (error) {
      console.error("Error fetching predictions:", error)
    } finally {
      setCrowdLoading(false) // Stop loading
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: museum.name,
        text: `Check out ${museum.name} located in ${museum.location?.city}, ${museum.location?.country}.`,
        url: window.location.href,
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={30} sx={{ mb: 1 }} width="60%" />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{
            mb: 3,
            fontSize: "1.1rem",
            "& .MuiAlert-icon": { fontSize: "2rem" },
          }}
        >
          {error}
        </Alert>
        <Button variant="contained" color="primary" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Container>
    )
  }

  // Display museum details
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Image Gallery */}
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          mb: 4,
        }}
      >
        <Box sx={{ position: "relative", height: isMobile ? 250 : 450 }}>
          <CardMedia
            component="img"
            height={isMobile ? "250" : "450"}
            image={museum.images[currentImageIndex] || "https://via.placeholder.com/800x450"}
            alt={museum.name}
            sx={{ objectFit: "cover" }}
          />

          {museum.images?.length > 1 && (
            <>
              <IconButton
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.8)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <ArrowBack />
              </IconButton>
              <IconButton
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.8)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ArrowForward />
              </IconButton>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 1,
                  bgcolor: "rgba(0,0,0,0.5)",
                  borderRadius: 10,
                  px: 2,
                  py: 1,
                }}
              >
                {museum.images.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: index === currentImageIndex ? "primary.main" : "rgba(255,255,255,0.7)",
                      cursor: "pointer",
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </Box>
            </>
          )}

          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton
              sx={{ bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "rgba(255,255,255,0.9)" } }}
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <IconButton 
              sx={{ bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "rgba(255,255,255,0.9)" } }}
              onClick={handleShare}
              aria-label="Share"
            >
              <Share />
            </IconButton>
          </Box>
          
          {/* Image counter overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              bgcolor: "rgba(0,0,0,0.7)",
              color: "white",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontSize: "0.9rem",
            }}
          >
            {currentImageIndex + 1} / {museum.images?.length || 1}
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Museum Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="text.primary">
            {museum.name}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Chip
              icon={<LocationOn />}
              label={`${museum.location?.city}, ${museum.location?.country}`}
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.95rem", py: 0.5 }}
            />
            <Chip 
              icon={<Category />} 
              label={museum.type} 
              color="secondary" 
              variant="outlined" 
              sx={{ fontSize: "0.95rem", py: 0.5 }}
            />
            <Chip 
              icon={<Euro />} 
              label={museum.priceType} 
              variant="outlined" 
              sx={{ fontSize: "0.95rem", py: 0.5 }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{ 
                mb: 2,
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "1rem",
                },
                "& .Mui-selected": {
                  color: "primary.main",
                }
              }}
              aria-label="Museum information tabs"
            >
              <Tab label="Overview" id="tab-0" aria-controls="tabpanel-0" />
              <Tab label="Visitor Info" id="tab-1" aria-controls="tabpanel-1" />
            </Tabs>

            <Divider sx={{ mb: 3 }} />

            <Box role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" hidden={tabValue !== 0}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.7, color: "text.primary" }}>
                    {museum.description}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1" hidden={tabValue !== 1}>
              {tabValue === 1 && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom color="text.primary" fontWeight={600}>
                        Opening Hours
                      </Typography>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography color="text.primary" fontWeight={500}>Monday - Friday</Typography>
                            <Typography color="text.primary">9:00 AM - 6:00 PM</Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography color="text.primary" fontWeight={500}>Saturday - Sunday</Typography>
                            <Typography color="text.primary">10:00 AM - 8:00 PM</Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom color="text.primary" fontWeight={600}>
                        Facilities
                      </Typography>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          <Chip 
                            icon={<AccessibilityNew />} 
                            label="Wheelchair Access" 
                            sx={{ bgcolor: "primary.light", color: "primary.contrastText", fontWeight: 500 }}
                          />
                          <Chip 
                            icon={<Language />} 
                            label="Audio Guides" 
                            sx={{ bgcolor: "secondary.light", color: "secondary.contrastText", fontWeight: 500 }}
                          />
                          <Chip 
                            icon={<AccessTime />} 
                            label="Guided Tours" 
                            sx={{ bgcolor: "info.light", color: "info.contrastText", fontWeight: 500 }}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Booking Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}>
              <CalendarMonth color="primary" />
              Book Your Visit
            </Typography>

            <Divider sx={{ my: 2 }} />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  mb: 3,
                  "& .MuiTypography-root": {
                    color: "text.primary",
                  },
                }}
              >
                <DateCalendar
                  value={selectedDate}
                  onChange={handleDateChange}
                  disablePast
                  sx={{
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      fontWeight: "bold",
                    },
                    "& .MuiDayCalendar-weekDayLabel": {
                      color: "text.primary",
                      fontWeight: "bold",
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>

            {selectedDate && (
              <>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: "text.primary" }}>
                  Select Time Slot:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {timeSlots.map((time) => (
                    <Chip
                      key={time}
                      label={time}
                      onClick={() => handleTimeSlotSelection(time)}
                      color={selectedTimeSlot === time ? "primary" : "default"}
                      variant={selectedTimeSlot === time ? "filled" : "outlined"}
                      sx={{ 
                        cursor: "pointer", 
                        fontWeight: selectedTimeSlot === time ? 600 : 400,
                        fontSize: "0.95rem",
                        "& .MuiChip-label": {
                          color: selectedTimeSlot === time ? "primary.contrastText" : "text.primary"
                        }
                      }}
                    />
                  ))}
                </Box>

                {/* Crowd Prediction Graph */}
                {crowdLoading ? (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Loading predictions...
                  </Alert>
                ) : (
                  <>
                  {crowdPrediction !== null && (
                    <Card sx={{ mb: 3, p: 2, boxShadow: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="text.primary" fontWeight={600}>
                          Crowd Prediction
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Estimated crowd density at the selected time.
                        </Typography>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart
                            data={[{ name: "Selected Time", prediction: crowdPrediction }]}
                            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fill: theme.palette.text.primary }} />
                            <YAxis tick={{ fill: theme.palette.text.primary }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                              }}
                            />
                            <Bar dataKey="prediction" fill="#4CAF50" barSize={50} />
                          </BarChart>
                        </ResponsiveContainer>
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                          <Chip 
                            label={crowdPrediction < 30 ? "Low Crowd" : crowdPrediction < 70 ? "Moderate Crowd" : "High Crowd"} 
                            color={crowdPrediction < 30 ? "success" : crowdPrediction < 70 ? "warning" : "error"}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                  </>
                )}

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: "text.primary" }}>
                    Number of Visitors:
                  </Typography>
                  <Paper elevation={1} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setVisitorCount(Math.max(1, visitorCount - 1))}
                      aria-label="Decrease visitors"
                      sx={{ minWidth: 36, height: 36 }}
                    >
                      -
                    </Button>
                    <Typography variant="h6" color="text.primary" fontWeight={600}>{visitorCount}</Typography>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => setVisitorCount(visitorCount + 1)}
                      aria-label="Increase visitors"
                      sx={{ minWidth: 36, height: 36 }}
                    >
                      +
                    </Button>
                  </Paper>
                </Box>
              </>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTimeSlot}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: 3,
                "&:disabled": {
                  bgcolor: "action.disabledBackground",
                  color: "text.disabled",
                }
              }}
            >
              {selectedDate && selectedTimeSlot
                ? `Book for ${selectedDate.toLocaleDateString()} at ${selectedTimeSlot}`
                : "Select Date and Time"}
            </Button>

            {selectedDate && selectedTimeSlot && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1.5, 
                  textAlign: "center", 
                  color: "text.secondary",
                  backgroundColor: "action.hover",
                  p: 1,
                  borderRadius: 1
                }}
              >
                {visitorCount} {visitorCount === 1 ? "visitor" : "visitors"} • Cancellation available up to 24h before
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={bookingSuccess}
        autoHideDuration={5000}
        onClose={() => setBookingSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setBookingSuccess(false)} sx={{ width: "100%" }}>
          <Typography fontWeight={600}>Booking Confirmed!</Typography>
          <Typography variant="body2">
            Your visit is scheduled for {selectedDate?.toLocaleDateString()} at {selectedTimeSlot}
          </Typography>
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default MuseumDetail