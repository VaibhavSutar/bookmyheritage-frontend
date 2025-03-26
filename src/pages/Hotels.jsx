import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Rating,
  CardMedia,
  Alert,
  Drawer,
  IconButton,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { properties } from "../data/properties";
import Footer from "../components/Footer";
import { FilterList, Close } from "@mui/icons-material";

// Map category IDs to property amenities for filtering
const categoryToPropertyMap = {
  beach: "beachAccess",
  mountain: "mountainView",
  spa: "spa",
  pool: "pool",
  dining: "restaurant",
  fitness: "gym",
};

// Use the properties data from our data file instead of mock data
function Hotels() {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const amenitiesList = [
    "Pool",
    "Spa",
    "Beach Access",
    "Restaurant",
    "Fitness Center",
    "Wifi",
  ];

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    filterHotels(newValue, selectedAmenities);
  };

  const handleAmenityChange = (amenity) => {
    const newSelectedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(newSelectedAmenities);
    filterHotels(priceRange, newSelectedAmenities);
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const filterHotels = (price, amenities) => {
    // Get the search query, location, and category from URL parameters
    const searchQuery = searchParams.get("search")?.toLowerCase();
    const locationQuery = searchParams.get("location")?.toLowerCase();
    const categoryQuery = searchParams.get("category");
    const guestCount = searchParams.get("guests");

    let filtered = properties.filter((hotel) => {
      // Price filter
      const priceMatch =
        hotel.price.base >= price[0] && hotel.price.base <= price[1];

      // Amenities filter
      const amenitiesMatch =
        amenities.length === 0 ||
        amenities.every((a) => hotel.amenities.includes(a.toLowerCase()));

      // Search query filter
      const searchMatch =
        !searchQuery ||
        hotel.name.toLowerCase().includes(searchQuery) ||
        hotel.location.city.toLowerCase().includes(searchQuery) ||
        hotel.location.country.toLowerCase().includes(searchQuery) ||
        hotel.description.toLowerCase().includes(searchQuery);

      // Location filter
      const locationMatch =
        !locationQuery ||
        hotel.location.city.toLowerCase().includes(locationQuery) ||
        hotel.location.country.toLowerCase().includes(locationQuery);

      // Category filter
      const categoryMatch =
        !categoryQuery ||
        (categoryToPropertyMap[categoryQuery] &&
          hotel.amenities.includes(categoryToPropertyMap[categoryQuery]));

      // Guest count filter
      const guestMatch =
        !guestCount || hotel.maxGuests >= parseInt(guestCount, 10);

      return (
        priceMatch &&
        amenitiesMatch &&
        searchMatch &&
        locationMatch &&
        categoryMatch &&
        guestMatch
      );
    });

    setHotels(filtered);
  };

  useEffect(() => {
    setLoading(true);

    // Initialize with all properties
    const initialHotels = [...properties];

    // Set initial price range based on min and max prices in data
    const prices = properties.map((p) => p.price.base);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setPriceRange([minPrice, maxPrice]);

    // Apply filters based on URL parameters
    const searchQuery = searchParams.get("search");
    const locationQuery = searchParams.get("location");
    const categoryQuery = searchParams.get("category");
    const guestCount = searchParams.get("guests");

    if (searchQuery || locationQuery || categoryQuery || guestCount) {
      filterHotels([minPrice, maxPrice], []);
    } else {
      setHotels(initialHotels);
    }

    setLoading(false);
  }, [searchParams]);

  // Filters component to reuse in both desktop sidebar and mobile drawer
  const FiltersContent = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={2000}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Box>
      </Box>

      <Box>
        <Typography gutterBottom>Amenities</Typography>
        <FormGroup>
          {amenitiesList.map((amenity) => (
            <FormControlLabel
              key={amenity}
              control={
                <Checkbox
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
              }
              label={amenity}
            />
          ))}
        </FormGroup>
      </Box>
    </>
  );

  return (
    <>
      <Container maxWidth={false} sx={{ py: { xs: 2, sm: 4 } }}>
        {/* Search results header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box>
            {searchParams.get("location") && (
              <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                Hotels in {searchParams.get("location")}
              </Typography>
            )}

            {searchParams.get("search") && (
              <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                Search results for "{searchParams.get("search")}"
              </Typography>
            )}

            {searchParams.get("category") && (
              <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                {searchParams.get("category").charAt(0).toUpperCase() +
                  searchParams.get("category").slice(1)}{" "}
                Properties
              </Typography>
            )}

            {searchParams.get("checkIn") && searchParams.get("checkOut") && (
              <Typography variant="subtitle1" color="text.secondary">
                {new Date(searchParams.get("checkIn")).toLocaleDateString()} -{" "}
                {new Date(searchParams.get("checkOut")).toLocaleDateString()}
                {searchParams.get("guests") &&
                  ` · ${searchParams.get("guests")} guests`}
              </Typography>
            )}
          </Box>

          {/* Mobile filter button */}
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={toggleMobileFilters}
              sx={{ height: 40 }}
            >
              Filters
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Filters - Desktop */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, position: "sticky", top: 80 }}>
                <FiltersContent />
              </Paper>
            </Grid>
          )}

          {/* Hotel Listings */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <Typography>Loading...</Typography>
              </Box>
            ) : hotels.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                No hotels found matching your criteria. Try adjusting your
                filters.
              </Alert>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {hotels.map((hotel) => (
                  <Grid item key={hotel.id} xs={12} sm={6} lg={4}>
                    <Link
                      to={`/hotels/${hotel.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.02)",
                          },
                          borderRadius: { xs: "12px", sm: "16px" },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height={{ xs: 180, sm: 200 }}
                          image={hotel.images[0]}
                          alt={hotel.name}
                        />
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                          >
                            {hotel.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            {hotel.location.city}, {hotel.location.country}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Rating
                              value={hotel.rating}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              ({hotel.reviews})
                            </Typography>
                          </Box>
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                          >
                            ${hotel.price.base}{" "}
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                            >
                              / night
                            </Typography>
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFiltersOpen}
        onClose={toggleMobileFilters}
        PaperProps={{
          sx: {
            maxHeight: "80vh",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            px: 2,
            pb: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            pb: 1,
          }}
        >
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={toggleMobileFilters}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ overflow: "auto" }}>
          <FiltersContent />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" fullWidth onClick={toggleMobileFilters}>
            Apply
          </Button>
        </Box>
      </Drawer>

      <Footer />
    </>
  );
}

export default Hotels;
