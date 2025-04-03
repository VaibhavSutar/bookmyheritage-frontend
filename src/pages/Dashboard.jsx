import { useState } from "react";
import useSWR from "swr";
import { Link } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Card, CardContent, Grid, CircularProgress, Alert } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const fetcher = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const Adminstats = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: places, error: placesError } = useSWR("places", () => fetcher("places"));
  const { data: bookings, error: bookingsError } = useSWR("bookings", () => fetcher("bookings"));

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex" }}>

        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { md: 20 } }}>
          <Toolbar />
          <Typography variant="h4" color="black" gutterBottom>Admin Dashboard</Typography>
          <Typography variant="body1"  color="black">Welcome to the museum admin panel!</Typography>

          {placesError && <Alert severity="error">Failed to load places data.</Alert>}
          {bookingsError && <Alert severity="error">Failed to load bookings data.</Alert>}

          {!places || !bookings ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Museums</Typography>
                    <Typography variant="h4">{places.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Bookings</Typography>
                    <Typography variant="h4">{bookings.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Current Crowd</Typography>
                    <Typography variant="h4">{places.reduce((sum, place) => sum + parseInt(place.currentcrowd || "0"), 0)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Max Capacity</Typography>
                    <Typography variant="h4">{places.reduce((sum, place) => sum + parseInt(place.maxcrowd || "0"), 0)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default Adminstats;
