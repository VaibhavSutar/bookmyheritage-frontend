import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  LocationOn,
  Pool,
  Spa,
  Restaurant,
  Wifi,
  BeachAccess,
  Landscape,
} from "@mui/icons-material";
import { useState } from "react";
import { amenities as amenityTypes } from "../data/properties";

const amenityIcons = {
  [amenityTypes.POOL]: <Pool fontSize="small" />,
  [amenityTypes.SPA]: <Spa fontSize="small" />,
  [amenityTypes.RESTAURANT]: <Restaurant fontSize="small" />,
  [amenityTypes.WIFI]: <Wifi fontSize="small" />,
  [amenityTypes.BEACH_ACCESS]: <BeachAccess fontSize="small" />,
  [amenityTypes.MOUNTAIN_VIEW]: <Landscape fontSize="small" />,
};

// Map of amenity keys to display names
const amenityNames = {
  [amenityTypes.POOL]: "Pool",
  [amenityTypes.SPA]: "Spa",
  [amenityTypes.RESTAURANT]: "Restaurant",
  [amenityTypes.WIFI]: "WiFi",
  [amenityTypes.BEACH_ACCESS]: "Beach Access",
  [amenityTypes.MOUNTAIN_VIEW]: "Mountain View",
};

function PropertyCard({ property }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isExtraSmall = useMediaQuery("(max-width:400px)");
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    navigate(`/hotels/${property.id}`);
  };

  // Determine how many amenities to show based on screen size
  const amenityCount = isExtraSmall ? 2 : isMobile ? 3 : 4;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          transform: "translateY(-4px)",
        },
        transition: "all 0.3s ease",
        borderRadius: { xs: "12px", sm: "16px" },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height={{ xs: 180, sm: 200, md: 220, lg: 240 }}
          image={property.images[0]}
          alt={property.name}
          sx={{ objectFit: "cover" }}
        />
        <IconButton
          size={isMobile ? "small" : "medium"}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
            },
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
          }}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <Favorite
              color="primary"
              fontSize={isMobile ? "small" : "medium"}
            />
          ) : (
            <FavoriteBorder
              color="primary"
              fontSize={isMobile ? "small" : "medium"}
            />
          )}
        </IconButton>
        <Chip
          label={property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          size={isMobile ? "small" : "medium"}
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            fontWeight: "600",
            color: "booking.dark",
            borderColor: "booking.light",
            "& .MuiChip-label": { px: 1 },
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
          }}
        />
      </Box>
      <CardContent
        sx={{
          flexGrow: 1,
          pb: 2,
          px: { xs: 1.5, sm: 2 },
          pt: { xs: 1.5, sm: 2 },
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h6"
            component="div"
            noWrap
            sx={{
              fontWeight: "600",
              color: "booking.dark",
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            }}
          >
            {property.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOn
              sx={{
                fontSize: { xs: 14, sm: 16 },
                color: "primary.main",
                mr: 0.5,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                fontWeight: "500",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              {property.location.city}, {property.location.country}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", mb: { xs: 1, sm: 2 } }}
        >
          <Rating
            value={property.rating}
            precision={0.1}
            readOnly
            size={isMobile ? "small" : "small"}
            sx={{ color: "booking.main" }}
          />
          <Typography
            variant="body2"
            sx={{
              ml: 1,
              fontWeight: "500",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            ({property.reviews})
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: { xs: 0.5, sm: 1 },
            mb: { xs: 1, sm: 2 },
            flexWrap: "wrap",
          }}
        >
          {property.amenities.slice(0, amenityCount).map(
            (amenity) =>
              amenityIcons[amenity] && (
                <Chip
                  key={amenity}
                  icon={amenityIcons[amenity]}
                  label={amenityNames[amenity]}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "booking.light",
                    "& .MuiChip-icon": {
                      color: "booking.main",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                    fontWeight: "500",
                    height: { xs: 24, sm: 32 },
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    "& .MuiChip-label": {
                      px: { xs: 0.5, sm: 1 },
                    },
                  }}
                />
              )
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: "primary.main",
                fontWeight: "700",
                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              ${property.price.base}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
            >
              per night
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default PropertyCard;
