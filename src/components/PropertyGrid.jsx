import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function PropertyGrid({ properties, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
        No properties found.
      </Typography>
    );
  }

  const featuredProperties = properties.filter((place) => place.featured);
  const nonFeaturedProperties = properties.filter((place) => !place.featured);

  return (
    <Box>
      {featuredProperties.length > 0 && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom sx={{ fontSize: "1.5rem", fontWeight: 600, color:"black" }}>
            Featured Properties
          </Typography>
          <Grid container spacing={3}>
            {featuredProperties.map((place) => (
              <Grid item xs={12} sm={6} md={4} key={place.id}>
                <Card
                  onClick={() => navigate(`/place/${place.id}`)}
                  sx={{
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={place.images?.[0] || "/default-image.jpg"}
                    alt={place.name || "Property Image"}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                      {place.name || "Unnamed Property"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        fontSize: "1rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {place.description || "No description available."}
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                        Location: {place.location?.city || "Unknown"},{" "}
                        {place.location?.country || "Unknown"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                        Type: {place.type || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                        Price: {place.priceType || "Contact for pricing"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {nonFeaturedProperties.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontSize: "1.5rem", fontWeight: 600 , color:"black"}}>
            Other Properties
          </Typography>
          <Grid container spacing={3}>
            {nonFeaturedProperties.map((place) => (
              <Grid item xs={12} sm={6} md={4} key={place.id}>
                <Card
                  onClick={() => navigate(`/place/${place.id}`)}
                  sx={{
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={place.images?.[0] || "/default-image.jpg"}
                    alt={place.name || "Property Image"}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                      {place.name || "Unnamed Property"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        fontSize: "1rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {place.description || "No description available."}
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                        Location: {place.location?.city || "Unknown"},{" "}
                        {place.location?.country || "Unknown"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                        Type: {place.type || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                        Price: {place.priceType || "Contact for pricing"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default PropertyGrid;
