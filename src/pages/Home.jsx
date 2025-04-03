import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Tabs,
  Tab,
  Paper,
  InputBase,
  IconButton,
  Chip,
  Stack,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
  Popover,
  TextField,
  MenuItem,
  Menu,
  ClickAwayListener,
  Popper,
  Grow,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocationOn,
  CalendarMonth,
  Person,
  Pool,
  Spa,
  BeachAccess,
  Landscape,
  Restaurant,
  FitnessCenter,
  KeyboardArrowDown,
  Add,
  Remove,
} from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { properties, fetchPlaces } from "../data/properties";
import PropertyGrid from "../components/PropertyGrid";
import Footer from "../components/Footer";
import Carousel from "react-material-ui-carousel";

// Category icons
const categories = [
  { id: "all", label: "All", icon: null },
  { id: "heritage", label: "Heritage Sites", icon: <Landscape /> },
  { id: "museum", label: "Museums", icon: <Spa /> },
];

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationQuery, setLocationQuery] = useState("");

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "all") {
      setSelectedCategory("all");
    } else {
      navigate(`/hotels?category=${categoryId}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlaces = await fetchPlaces();
        setPlaces(fetchedPlaces);
        setLoading(false);
        console.log("Places", fetchedPlaces);
      } catch (error) {
        console.error("Error fetching places:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []); 

  const heroImages = [
    "https://maharashtratourism.gov.in/wp-content/uploads/2023/10/Bhau-Daji-Lad-Museum.jpg",
    "https://www.tusktravel.com/blog/wp-content/uploads/2023/06/Jehangir-Art-Gallery-Mumbai-Maharashtra.jpg",
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "60vh", sm: "70vh", md: "85vh" },
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Carousel
          indicators={true} // Enable indicators for better navigation
          // navButtonsAlwaysVisible={true} // Ensure navigation buttons are always visible
          animation="fade"
          autoPlay={true} // Enable auto-play for smooth transitions
          interval={5000} // Set interval for auto-play (5 seconds)
          sx={{ height: "100%" }}
        >
          {heroImages.map((image, index) => (
            <Box
              key={index}
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black",
              }}
            >
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.7)",
                }}
                onError={(e) => {
                  console.error(`Failed to load image: ${image}`);
                  e.target.style.display = "none";
                }}
              />
            </Box>
          ))}
        </Carousel>
        <Container
          maxWidth={false}
          sx={{ height: "100%", position: "absolute", top: 0, zIndex: 1 }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: "white",
              textAlign: { xs: "center", md: "left" },
              maxWidth: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
              px: { xs: 2, sm: 0 },
            }}
          >
          </Box>
        </Container>
      </Box>

      {/* Categories */}
      <Container maxWidth={false} sx={{ mt: { xs: 2, sm: 4 } }}>
        <Box sx={{ mb: { xs: 4, sm: 8 } }}>
          <PropertyGrid properties={places} loading={loading} />
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Home;