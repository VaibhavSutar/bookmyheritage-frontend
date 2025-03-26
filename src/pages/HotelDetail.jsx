import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Rating,
  ImageList,
  ImageListItem,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  Avatar,
  Stack,
  Card,
  CardMedia,
  CardContent,
  LinearProgress,
  Container,
  Menu,
  MenuItem,
  Select,
  FormControl,
  Link,
} from "@mui/material";
import {
  Pool,
  Spa,
  Restaurant,
  FitnessCenter,
  BeachAccess,
  Landscape,
  LocationOn,
  Star,
  Wifi,
  LocalParking,
  AcUnit,
  Room,
  Share,
  FavoriteBorder,
  Favorite,
  IosShare,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Close,
  Person,
  Verified,
  SupervisorAccount,
  Map,
  Instagram,
  Facebook,
  Twitter,
  Pinterest,
} from "@mui/icons-material";
import { getPropertyById } from "../data/properties";

const amenityIcons = {
  wifi: <Wifi sx={{ color: "booking.main" }} />,
  pool: <Pool sx={{ color: "booking.main" }} />,
  spa: <Spa sx={{ color: "booking.main" }} />,
  gym: <FitnessCenter sx={{ color: "booking.main" }} />,
  restaurant: <Restaurant sx={{ color: "booking.main" }} />,
  beachAccess: <BeachAccess sx={{ color: "booking.main" }} />,
  mountainView: <Landscape sx={{ color: "booking.main" }} />,
  parking: <LocalParking sx={{ color: "booking.main" }} />,
  roomService: <Room sx={{ color: "booking.main" }} />,
  airConditioning: <AcUnit sx={{ color: "booking.main" }} />,
};

// Mock reviews data
const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    date: "August 2023",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    comment:
      "This place was absolutely stunning! The views were incredible and the amenities were top-notch. The host was very responsive and provided great local recommendations. Would definitely stay here again!",
  },
  {
    id: 2,
    name: "Michael Chen",
    date: "July 2023",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    comment:
      "Beautiful property with amazing views. The location was perfect - close to restaurants and attractions. The only minor issue was that the WiFi was a bit slow at times, but overall a great stay.",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    date: "June 2023",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 5,
    comment:
      "We had a wonderful time at this property. The rooms were spacious and clean, and the pool was fantastic. The host was very accommodating and made sure we had everything we needed.",
  },
  {
    id: 4,
    name: "David Wilson",
    date: "May 2023",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 5,
    comment:
      "Exceptional service and beautiful accommodations. The property exceeded our expectations in every way. The attention to detail was impressive, and we felt very well taken care of during our stay.",
  },
  {
    id: 5,
    name: "Sophia Kim",
    date: "April 2023",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    rating: 4,
    comment:
      "Lovely place with great amenities. The location was perfect for exploring the area. The kitchen was well-equipped, and we enjoyed cooking meals during our stay. Would recommend!",
  },
  {
    id: 6,
    name: "James Thompson",
    date: "March 2023",
    avatar: "https://randomuser.me/api/portraits/men/64.jpg",
    rating: 5,
    comment:
      "One of the best places we've stayed! The property was immaculate and the views were breathtaking. The host provided excellent recommendations for local activities and restaurants.",
  },
];

// Mock similar properties data
const similarProperties = [
  {
    id: "similar1",
    name: "Luxury Beachfront Villa",
    location: "Bali, Indonesia",
    price: 320,
    rating: 4.9,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "similar2",
    name: "Mountain Retreat Cabin",
    location: "Aspen, Colorado",
    price: 275,
    rating: 4.8,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "similar3",
    name: "Modern City Apartment",
    location: "Barcelona, Spain",
    price: 180,
    rating: 4.7,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "similar4",
    name: "Seaside Cottage",
    location: "Santorini, Greece",
    price: 295,
    rating: 4.9,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
];

// Temporary function to replace i18n t function
const t = (key) => {
  // Extract the last part of the key after the dot
  const parts = key.split(".");
  const lastPart = parts[parts.length - 1];

  // Convert camelCase to Title Case with spaces
  return lastPart
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const checkInDate = searchParams.get("checkIn") || null;
  const checkOutDate = searchParams.get("checkOut") || null;
  const guestCount = searchParams.get("guests")
    ? parseInt(searchParams.get("guests"), 10)
    : 1;

  // Get hotel data based on id
  const hotel = getPropertyById(id);

  if (!hotel) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <Typography variant="h5" color="error">
          Property not found
        </Typography>
      </Box>
    );
  }

  const handleBooking = () => {
    navigate(`/booking/${hotel.id}`);
  };

  const handleGalleryOpen = () => {
    setGalleryOpen(true);
  };

  const handleGalleryClose = () => {
    setGalleryOpen(false);
  };

  const handleShareClick = () => {
    // Implement share functionality
    console.log("Share clicked");
  };

  const _toggleWishlist = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShowAllPhotos = () => {
    // Implement the logic to show all photos
    handleGalleryOpen();
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? hotel.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === hotel.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleShowAllReviews = () => {
    // Implement the logic to show all reviews
  };

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: 1100,
          py: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: "100%",
            mx: "auto",
            px: { xs: 2, sm: 4, md: 6, lg: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: "600", color: "primary.main" }}
            >
              {hotel.name}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Star sx={{ fontSize: 18, mr: 0.5, color: "booking.main" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "500", color: "booking.dark" }}
                >
                  {hotel.rating}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "underline",
                  fontWeight: "500",
                  color: "text.primary",
                }}
              >
                {hotel.reviews} reviews
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "underline",
                  fontWeight: "500",
                  color: "text.primary",
                }}
              >
                {hotel.location.city}, {hotel.location.country}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                aria-label="share"
                onClick={handleShareClick}
                sx={{ color: "text.secondary" }}
              >
                <Share />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Share
                </Typography>
              </IconButton>
              <IconButton
                aria-label="save"
                onClick={_toggleWishlist}
                sx={{ color: isFavorite ? "error.main" : "text.secondary" }}
              >
                {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Save
                </Typography>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Photo Grid */}
      <Box
        sx={{
          maxWidth: "100%",
          mx: "auto",
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          py: 3,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(2, 200px)",
            gap: 1,
            borderRadius: 3,
            overflow: "hidden",
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            },
          }}
        >
          <Box
            sx={{
              gridColumn: "1 / 3",
              gridRow: "1 / 3",
              position: "relative",
            }}
            onClick={handleGalleryOpen}
          >
            <img src={hotel.images[0]} alt={hotel.name} />
          </Box>
          {hotel.images.slice(1, 5).map((image, index) => (
            <Box
              key={index}
              onClick={handleGalleryOpen}
              sx={{
                position: "relative",
                "&:last-child": {
                  borderTopRightRadius: 12,
                },
              }}
            >
              <img src={image} alt={`${hotel.name} ${index + 1}`} />
            </Box>
          ))}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleShowAllPhotos}
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              backgroundColor: "white",
            }}
          >
            Show all photos
          </Button>
        </Box>

        {/* Main Content */}
        <Grid container spacing={12} sx={{ mt: 2 }}>
          {/* Left Column */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 6 }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {hotel.type.charAt(0).toUpperCase() + hotel.type.slice(1)}{" "}
                    hosted by {hotel.host ? hotel.host.name : "Host"}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    8 guests · 4 bedrooms · 6 beds · 3 baths
                  </Typography>
                </Box>
                <Avatar sx={{ width: 56, height: 56, bgcolor: "booking.main" }}>
                  <Person />
                </Avatar>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SupervisorAccount sx={{ color: "booking.main" }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "600", color: "booking.dark" }}
                    >
                      Superhost
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Experienced, highly rated host committed to providing
                      great stays
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ color: "booking.main" }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "600", color: "booking.dark" }}
                    >
                      Great Location
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      95% of recent guests rated the location 5-star
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{ py: 6, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-line",
                  mb: 4,
                  fontSize: "1.05rem",
                  color: "text.primary",
                  lineHeight: 1.6,
                }}
              >
                {hotel.description}
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer", mt: 1 }}
              >
                Show more →
              </Typography>
            </Box>
          </Grid>

          {/* Right Column - Booking Card */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                position: "sticky",
                top: 100,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "booking.light",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                bgcolor: "background.paper",
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Typography
                    variant="h4"
                    component="span"
                    sx={{ fontWeight: "700", color: "booking.dark" }}
                  >
                    ${hotel.price.base}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.primary" }}>
                    {t("common.perNight")}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Star sx={{ fontSize: 14, color: "booking.main" }} />
                  <Typography variant="body2">
                    <strong>{hotel.rating}</strong> · {hotel.reviews}{" "}
                    {t("common.reviews")}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "500" }}
                      >
                        {t("common.dates")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary" }}
                      >
                        {checkInDate && checkOutDate
                          ? `${new Date(
                              checkInDate
                            ).toLocaleDateString()} - ${new Date(
                              checkOutDate
                            ).toLocaleDateString()}`
                          : t("common.addDates")}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "500" }}
                      >
                        {t("common.guests")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary" }}
                      >
                        {guestCount}{" "}
                        {guestCount === 1
                          ? t("common.guest")
                          : t("common.guests")}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleBooking}
                sx={{ py: 1.5, fontWeight: "600", fontSize: "1rem" }}
              >
                {t("common.reserve")}
              </Button>

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                {t("common.noCharge")}
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: "underline", color: "text.primary" }}
                  >
                    ${hotel.price.base} x{" "}
                    {checkInDate && checkOutDate
                      ? Math.ceil(
                          (new Date(checkOutDate) - new Date(checkInDate)) /
                            (1000 * 60 * 60 * 24)
                        )
                      : 5}{" "}
                    {t("common.nights")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    $
                    {hotel.price.base *
                      (checkInDate && checkOutDate
                        ? Math.ceil(
                            (new Date(checkOutDate) - new Date(checkInDate)) /
                              (1000 * 60 * 60 * 24)
                          )
                        : 5)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: "underline", color: "text.primary" }}
                  >
                    {t("common.cleaningFee")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    $100
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: "underline", color: "text.primary" }}
                  >
                    {t("common.serviceFee")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    $80
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "600",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.primary" }}
                  >
                    {t("common.total")}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.primary" }}
                  >
                    $
                    {hotel.price.base *
                      (checkInDate && checkOutDate
                        ? Math.ceil(
                            (new Date(checkOutDate) - new Date(checkInDate)) /
                              (1000 * 60 * 60 * 24)
                          )
                        : 5) +
                      180}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

      </Box>

      {/* Gallery Dialog */}
      <Dialog fullScreen open={galleryOpen} onClose={handleGalleryClose}>
        <Box
          sx={{
            height: "100vh",
            bgcolor: "common.white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <IconButton
              onClick={handleGalleryClose}
              sx={{ mr: 2, color: "booking.dark" }}
            >
              <Close />
            </IconButton>
            <Typography sx={{ color: "text.primary", fontWeight: "500" }}>
              {currentImageIndex + 1} / {hotel.images.length}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              px: 8,
            }}
          >
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: "absolute",
                left: 16,
                bgcolor: "background.paper",
                color: "booking.dark",
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <img
              src={hotel.images[currentImageIndex]}
              alt={hotel.name}
              style={{
                maxWidth: "100%",
                maxHeight: "calc(100vh - 100px)",
                objectFit: "contain",
              }}
            />
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: "absolute",
                right: 16,
                bgcolor: "background.paper",
                color: "booking.dark",
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <KeyboardArrowRight />
            </IconButton>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export default HotelDetail;
