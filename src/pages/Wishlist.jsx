import { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  FavoriteBorder,
  Favorite,
  LocationOn,
  Star,
} from "@mui/icons-material";

// Mock data - replace with actual API calls in production
const savedProperties = [
  {
    id: 1,
    name: "Luxury Beach Villa",
    location: "Maldives",
    price: 299,
    rating: 4.8,
    reviews: 125,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    superhost: true,
    category: "beachfront",
  },
  {
    id: 3,
    name: "Urban Loft Apartment",
    location: "New York",
    price: 249,
    rating: 4.6,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    superhost: true,
    category: "city",
  },
  {
    id: 7,
    name: "Historic Castle Suite",
    location: "Scotland",
    price: 450,
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310",
    superhost: true,
    category: "castles",
  },
  {
    id: 10,
    name: "Historic Suite",
    location: "US",
    price: 450,
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310",
    superhost: true,
    category: "castles",
  },
  {
    id: 9,
    name: "Castle Suite",
    location: "Japan",
    price: 450,
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310",
    superhost: true,
    category: "castles",
  },
  {
    id: 8,
    name: "Manatee Hotel",
    location: "Russia",
    price: 450,
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310",
    superhost: true,
    category: "castles",
  },
  {
    id: 6,
    name: "Taj Hotel",
    location: "India",
    price: 450,
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310",
    superhost: true,
    category: "castles",
  },
];

function Wishlist() {
  const [wishlist, setWishlist] = useState(savedProperties);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((property) => property.id !== id));
  };

  return (
    <Container maxWidth={false} sx={{ py: 6 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 1, fontWeight: "bold", color: "primary.main" }}
      >
        Wishlist
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your saved properties
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {wishlist.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Alert severity="info" sx={{ mb: 3, maxWidth: 500, mx: "auto" }}>
            You haven't saved any properties yet.
          </Alert>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Click the heart icon on any property to save it to your wishlist.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            sx={{ borderRadius: "40px", px: 3 }}
          >
            Explore Properties
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((property) => (
            <Grid item key={property.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                  borderRadius: 3,
                  boxShadow: "none",
                  position: "relative",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="260"
                    image={property.image}
                    alt={property.name}
                    sx={{
                      borderRadius: 3,
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      color: "primary.main",
                      "&:hover": { color: "primary.dark" },
                    }}
                    onClick={() => removeFromWishlist(property.id)}
                  >
                    <Favorite />
                  </IconButton>
                </Box>
                <CardContent sx={{ p: 1, pt: 2, pb: 0, flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Star sx={{ color: "#FF385C", fontSize: 18, mr: 0.5 }} />
                      <Typography
                        variant="body2"
                        component="span"
                        fontWeight="medium"
                      >
                        {property.rating}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                      >
                        ({property.reviews})
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: "medium", mb: 0.5 }}
                  >
                    {property.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn
                      sx={{ color: "text.secondary", fontSize: 16, mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {property.location}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", mt: 1 }}
                  >
                    ${property.price}{" "}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      night
                    </Typography>
                  </Typography>
                </CardContent>
                <Box sx={{ p: 1 }}>
                  <Button
                    component={Link}
                    to={`/hotels/${property.id}`}
                    variant="outlined"
                    fullWidth
                    sx={{
                      mt: 1,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        bgcolor: "rgba(255, 56, 92, 0.04)",
                      },
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Wishlist;
