import { useEffect, useState } from "react";
import { fetchPlaces } from "../api/fetchPlaces"; // Adjust the path if needed
import PropertyCard from "./PropertyCard";
import { Grid, CircularProgress, Box } from "@mui/material";

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const places = await fetchPlaces();
        setProperties(places);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };

    getPlaces();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {properties.map((property) => (
        <Grid item xs={12} sm={6} md={4} key={property.id}>
          <PropertyCard property={property} />
        </Grid>
      ))}
    </Grid>
  );
}

export default PropertyList;
