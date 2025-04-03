import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  CalendarMonth,
  LocationOn,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Link as RouterLink } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

const MyBookings = () => {
  const { user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [filter, setFilter] = useState("all"); // 'all', 'upcoming', 'past'

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredAndSortedBookings = bookings
    .filter((booking) => {
      if (filter === "upcoming") {
        return new Date(booking.checkIn) >= new Date();
      } else if (filter === "past") {
        return new Date(booking.checkIn) < new Date();
      }
      return true; // 'all'
    })
    .sort((a, b) => {
      const dateA = new Date(a.checkIn);
      const dateB = new Date(b.checkIn);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedBookings = await Promise.all(
          querySnapshot.docs.map(async (bookingDoc) => {
            const data = bookingDoc.data();
            const placeDoc = await getDoc(doc(db, "places", data.museumId));
            const placeData = placeDoc.exists() ? placeDoc.data() : {};

            return {
              id: bookingDoc.id,
              hotelName: placeData.name || "Unknown Museum",
              location: `${placeData.location?.city || "Unknown City"}, ${
                placeData.location?.country || "Unknown Country"
              }`,
              image: placeData.images?.[0] || "https://via.placeholder.com/280",
              checkIn: data.date.toDate().toISOString().split("T")[0],
              timeSlot: data.timeSlot,
              visitors: data.visitors,
            };
          })
        );

        setBookings(fetchedBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
        setError("Failed to fetch bookings");
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Invalid date format:", error);
      return dateString;
    }
  };

  return (
    <>
      {authLoading ? (
        <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Container>
      ) : (
        <Box
          sx={{
            backgroundColor: "rgba(245, 248, 255, 1)",
            minHeight: "100vh",
            pt: 2,
            pb: 6,
          }}
        >
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
            >
              My Bookings
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortOrder} onChange={handleSortChange}>
                  <MenuItem value="asc">Date (Ascending)</MenuItem>
                  <MenuItem value="desc">Date (Descending)</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Filter</InputLabel>
                <Select value={filter} onChange={handleFilterChange}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="past">Past</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredAndSortedBookings.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  bgcolor: "white",
                  borderRadius: 2,
                  p: 4,
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No upcoming bookings found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You don't have any upcoming bookings.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/"
                  sx={{ mt: 2 }}
                >
                  Find Museums
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredAndSortedBookings.map((booking) => (
                  <Grid item xs={12} key={booking.id}>
                    <Card
                      sx={{
                        display: "flex",
                        height: "100%",
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={booking.image}
                        alt={booking.hotelName}
                        sx={{ width: 280 }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <CardContent sx={{ flex: "1 0 auto", p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 2,
                            }}
                          >
                            <Typography variant="h5" component="h2">
                              {booking.hotelName}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <LocationOn
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                            <Typography
                              variant="body1"
                              color="text.secondary"
                            >
                              {booking.location}
                            </Typography>
                          </Box>

                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <CalendarMonth
                                  fontSize="small"
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                                <Typography variant="body1">
                                  {formatDate(booking.checkIn)}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Time Slot
                              </Typography>
                              <Typography variant="body1">
                                {booking.timeSlot}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", mb: 1 }}
                          >
                            Visitors: {booking.visitors}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      )}
    </>
  );
};

export default MyBookings;
