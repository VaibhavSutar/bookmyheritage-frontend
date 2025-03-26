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
      <Typography variant="body1" align="center">
        No properties found.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {properties.map((place) => (
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
              image={place.images?.[0] || "/default-image.jpg"} // Replace with your actual default image
              alt={place.name || "Property Image"}
            />
            <CardContent>
              <Typography variant="h6">{place.name || "Unnamed Property"}</Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {place.description || "No description available."}
              </Typography>
              <Box mt={1}>
                <Typography variant="body2">
                  Location: {place.location?.[0]?.city || "Unknown"},{" "}
                  {place.location?.[0]?.country || "Unknown"}
                </Typography>
                <Typography variant="body2">
                  Type: {place.type || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Price: {place.priceType || "Contact for pricing"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default PropertyGrid;
