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
  const [crowdLoading, setCrowdLoading] = useState(false) // New state for loading
  const [seasonPrediction, setSeasonPrediction] = useState(null) // New state for seasonal prediction

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
    const currentUser = auth.currentUser

    if (!currentUser) {
      navigate("/login") // Redirect to login if no user is logged in
      return
    }

    if (!selectedDate || !selectedTimeSlot) return

    try {
      await addDoc(collection(db, "bookings"), {
        userId: currentUser.uid, // Save booking under the current user
        museumId: id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        visitors: visitorCount,
      })
      setBookingSuccess(true)
      setError(null)

      // Reset form after successful booking
      setTimeout(() => {
        setBookingSuccess(false)
      }, 5000)
    } catch (error) {
      setError("Failed to book your visit, please try again.")
    }
  }

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
      const crowdResponse = await axios.post("http://127.0.0.1:5000/predict/crowd", {
        day_of_week: dayOfWeek,
        is_weekend: isWeekend,
        is_holiday: isHoliday,
        temperature,
        month,
        hour,
      })
      setCrowdPrediction(crowdResponse.data.prediction)

      const seasonResponse = await axios.post("http://127.0.0.1:5000/predict/season", {
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
                }}
              >
                {museum.images.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: index === currentImageIndex ? "primary.main" : "rgba(255,255,255,0.7)",
                      cursor: "pointer",
                    }}
                    onClick={() => setCurrentImageIndex(index)}
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
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <IconButton sx={{ bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "rgba(255,255,255,0.9)" } }}>
              <Share />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Museum Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            {museum.name}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Chip
              icon={<LocationOn />}
              label={`${museum.location[0]?.city}, ${museum.location[0]?.country}`}
              color="primary"
              variant="outlined"
            />
            <Chip icon={<Category />} label={museum.type} color="secondary" variant="outlined" />
            <Chip icon={<Euro />} label={museum.priceType} variant="outlined" />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{ mb: 2 }}
            >
              <Tab label="Overview" />
              <Tab label="Exhibits" />
              <Tab label="Visitor Info" />
            </Tabs>

            <Divider sx={{ mb: 3 }} />

            {tabValue === 0 && (
              <Box>
                <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                  {museum.description}
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                  {museum.description} {/* Duplicated for demo purposes */}
                </Typography>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Current Exhibitions
                </Typography>
                <Grid container spacing={2}>
                  {[1, 2, 3].map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item}>
                      <Card sx={{ height: "100%" }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={`https://via.placeholder.com/300?text=Exhibit+${item}`}
                          alt={`Exhibit ${item}`}
                        />
                        <CardContent>
                          <Typography variant="h6">Exhibit Title {item}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            A fascinating exhibit showcasing the history and culture.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      Opening Hours
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography>Monday - Friday</Typography>
                        <Typography>9:00 AM - 6:00 PM</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography>Saturday - Sunday</Typography>
                        <Typography>10:00 AM - 8:00 PM</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      Facilities
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Chip icon={<AccessibilityNew />} label="Wheelchair Access" />
                      <Chip icon={<Language />} label="Audio Guides" />
                      <Chip icon={<AccessTime />} label="Guided Tours" />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Booking Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>

            {selectedDate && (
              <>
                <Typography variant="subtitle1" gutterBottom>
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
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Box>

                {/* Crowd Prediction Graph */}
                {crowdLoading ? (
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Loading predictions...
                  </Typography>
                ) : (
                  <>
                  {crowdPrediction !== null && (
  <Card sx={{ mb: 3, p: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Crowd Prediction
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Estimated crowd density at the selected time.
      </Typography>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={[{ name: "Selected Time", prediction: crowdPrediction }]}
          margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="prediction" fill="#4CAF50" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)}

{/* 
                    {seasonPrediction !== null && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Seasonal Prediction:
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart
                            data={[{ name: "Seasonal Impact", prediction: seasonPrediction }]}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="prediction" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    )} */}
                  </>
                )}

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Number of Visitors:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setVisitorCount(Math.max(1, visitorCount - 1))}
                    >
                      -
                    </Button>
                    <Typography variant="h6">{visitorCount}</Typography>
                    <Button variant="outlined" size="small" onClick={() => setVisitorCount(visitorCount + 1)}>
                      +
                    </Button>
                  </Box>
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
              }}
            >
              {selectedDate && selectedTimeSlot
                ? `Book for ${selectedDate.toLocaleDateString()} at ${selectedTimeSlot}`
                : "Select Date and Time"}
            </Button>

            {selectedDate && selectedTimeSlot && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
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
          Booking confirmed for {selectedDate?.toLocaleDateString()} at {selectedTimeSlot}!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default MuseumDetail

