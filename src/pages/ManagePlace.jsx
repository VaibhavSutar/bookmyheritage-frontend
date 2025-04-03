import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { db } from "../firebase/config";
import { collection, addDoc, deleteDoc, doc, updateDoc,getDocs, query, where } from "firebase/firestore";
import { 
  Card, CardContent, Button, Input, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Select, MenuItem, 
  FormControl, InputLabel, Switch, FormControlLabel, Tabs, Tab, 
  Box, Typography, IconButton, Chip, Divider, Grid
} from "@mui/material";
import { 
  Delete, Edit, Visibility, Add, Save, Cancel, 
  Dashboard, ListAlt, BarChart, Place as PlaceIcon
} from "@mui/icons-material";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import StatsDialog from "./StatDialog";
import { apiroute } from "../common/localvariable";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"; // Import DatePicker for date filtering
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const fetcher = async () => {
    try {
      console.log("Fetching data from Firestore...");
      const querySnapshot = await getDocs(collection(db, "places"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching places:", error);
      return [];
    }
  };
export default function PlacesPage() {
  const { data: places = [], mutate } = useSWR("places", fetcher);
  const [viewMode, setViewMode] = useState("list"); // list, card, stats
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [newPlace, setNewPlace] = useState({
    name: "",
    description: "",
    currentcrowd: "",
    maxcrowd: "",
    location: { city: "Mumbai", country: "India" }, // Default structure
    priceType: "",
    type: "museum",
    featured: false,
    images: [],
    bookingsCount: 0, // New field
    dailyStats: {}, // New field
  });
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [bookingsDialogOpen, setBookingsDialogOpen] = useState(false);
  const [bookingsData, setBookingsData] = useState([]);
  const [filterDate, setFilterDate] = useState(null);

  const resetForm = () => {
    setNewPlace({
      name: "",
      description: "",
      currentcrowd: "",
      maxcrowd: "",
      location: { city: "", country: "" },
      priceType: "",
      type: "museum",
      featured: false,
      images: [],
      bookingsCount: 0, // New field
      dailyStats: {}, // New field
    });
    setSelectedPlace(null);
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updateValue = type === "checkbox" ? checked : value;

    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      if (editMode && selectedPlace) {
        setSelectedPlace({
          ...selectedPlace,
          location: {
            ...selectedPlace.location,
            [key]: updateValue,
          },
        });
      } else {
        setNewPlace({
          ...newPlace,
          location: {
            ...newPlace.location,
            [key]: updateValue,
          },
        });
      }
    } else {
      if (editMode && selectedPlace) {
        setSelectedPlace({
          ...selectedPlace,
          [name]: updateValue,
        });
      } else {
        setNewPlace({
          ...newPlace,
          [name]: updateValue,
        });
      }
    }
  };

  const addPlace = async () => {
    await addDoc(collection(db, "places"), {
      ...newPlace,
      bookingsCount: newPlace.bookingsCount || 0, // Ensure default value
      dailyStats: newPlace.dailyStats || {}, // Ensure default value
    });
    mutate();
    resetForm();
    setOpenDialog(false);
  };

  const deletePlace = async (id) => {
    await deleteDoc(doc(db, "places", id));
    mutate();
  };

  const updatePlace = async () => {
    if (selectedPlace && selectedPlace.id) {
      const { id, ...updateData } = selectedPlace;
      await updateDoc(doc(db, "places", id), updateData);
      mutate();
      resetForm();
      setOpenDialog(false);
    }
  };

  const openEditDialog = (place) => {
    setSelectedPlace(place);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  const fetchStats = async (place) => {
    setSelectedPlace(place); // Set the selected place for stats
    setLoadingStats(true);
  
    try {
      const { city, country } = place.location;
  
      // Validate city and country
      if (!city || !country) {
        console.error("Missing city or country for the place:", place);
        setStatsData(null);
        setLoadingStats(false);
        alert("Location details (city and country) are missing for this place.");
        return;
      }
      // Step 1: Convert City & Country to Latitude & Longitude using OpenStreetMap (Nominatim API)
      const geocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json`
      );
  
      if (!geocodeResponse.data || geocodeResponse.data.length === 0) {
        console.error("Geocoding failed for:", city, country);
        throw new Error("Failed to get coordinates for the location.");
      }
  
      const { lat, lon } = geocodeResponse.data[0]; // Extract latitude & longitude
      console.log(`Geocoded ${city}, ${country} -> Lat: ${lat}, Lon: ${lon}`);
  
      // Step 2: Fetch Weather Data using Open-Meteo API
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
  
      if (!weatherResponse.data?.current_weather) {
        console.error("Unexpected weather API response:", weatherResponse.data);
        throw new Error("Weather data is missing from API response.");
      }
  
      const temperature = weatherResponse.data.current_weather.temperature;
      console.log(`Fetched temperature for ${place.name}:`, temperature);
  
      // Step 3: Prepare Data for Prediction APIs
      const requestData = {
        day_of_week: new Date().getDay(),
        is_weekend: [0, 6].includes(new Date().getDay()) ? 1 : 0,
        is_holiday: 1, // Example holiday flag
        temperature,
        month: new Date().getMonth() + 1,
        hour: new Date().getHours(),
      };
  
      console.log("Request data for prediction API:", requestData);
  
      // Step 4: Fetch Predictions in Parallel
      const [seasonResponse, crowdResponse, peakResponse, anomalyResponse] = await Promise.all([
        axios.post(`${apiroute}/predict/season`, { month: 1, temperature, is_holiday: requestData.is_holiday }),
        axios.post(`${apiroute}/predict/crowd`, requestData),
        axios.post(`${apiroute}/predict/peak`, requestData),
        axios.post(`${apiroute}/predict/anomaly`, requestData),
      ]);
  
      console.log("Season prediction response:", seasonResponse.data);
      console.log("Crowd prediction response:", crowdResponse.data);
      console.log("Peak prediction response:", peakResponse.data);
      console.log("Anomaly prediction response:", anomalyResponse.data);
  
      setStatsData({
        seasonPrediction: seasonResponse.data.prediction,
        crowdPrediction: crowdResponse.data.prediction,
        peakPrediction: peakResponse.data.prediction,
        anomalyPrediction: anomalyResponse.data.prediction,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStatsData(null);
      alert("Failed to fetch statistics. Please try again.");
    } finally {
      setLoadingStats(false);
      setStatsDialogOpen(true);
    }
  };
  
  const fetchBookings = async (place) => {
    setSelectedPlace(place); // Set the selected place for bookings
    setBookingsDialogOpen(true);

    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("museumId", "==", place.id)
      );

      const querySnapshot = await getDocs(bookingsQuery);
      const bookings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter bookings by date if a filterDate is set
      const filteredBookings = filterDate
        ? bookings.filter((booking) => {
            const bookingDate = booking.date.toDate(); // Convert Firestore timestamp to JS Date
            return (
              bookingDate.toDateString() === filterDate.toDateString()
            );
          })
        : bookings;

      setBookingsData(filteredBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to fetch bookings. Please try again.");
    }
  };

  useEffect(() => {
    if (selectedPlace) {
      fetchBookings(selectedPlace); // Re-fetch bookings when filterDate changes
    }
  }, [filterDate]);

  const renderStatsDialog = () => (
    <StatsDialog
      open={statsDialogOpen}
      onClose={() => setStatsDialogOpen(false)}
      statsData={statsData}
      loadingStats={loadingStats}
      selectedPlace={selectedPlace}
    />
  );

  const renderBookingsDialog = () => (
    <Dialog open={bookingsDialogOpen} onClose={() => setBookingsDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Bookings for {selectedPlace?.name}</DialogTitle>
      <DialogContent>
        <Box className="mb-4">
          <DatePicker
            label="Filter by Date"
            value={filterDate}
            onChange={(newDate) => setFilterDate(newDate)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time Slot</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Visitors</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingsData.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.date.toDate().toLocaleDateString()}</TableCell>
                  <TableCell>{booking.timeSlot}</TableCell>
                  <TableCell>{booking.username}</TableCell>
                  <TableCell>{booking.visitors}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBookingsDialogOpen(false)} startIcon={<Cancel />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Calculate statistics
  const calculateStats = () => {
    if (!places || places.length === 0) return { totalPlaces: 0 };
    
    const totalPlaces = places.length;
    const byType = places.reduce((acc, place) => {
      acc[place.type] = (acc[place.type] || 0) + 1;
      return acc;
    }, {});
    
    const byCity = places.reduce((acc, place) => {
      acc[place.city] = (acc[place.city] || 0) + 1;
      return acc;
    }, {});

    const currentCrowdTotal = places.reduce((sum, place) => 
      sum + (parseInt(place.currentcrowd) || 0), 0);
    
    const maxCrowdTotal = places.reduce((sum, place) => 
      sum + (parseInt(place.maxcrowd) || 0), 0);
    
    const crowdPercentage = maxCrowdTotal > 0 
      ? Math.round((currentCrowdTotal / maxCrowdTotal) * 100) 
      : 0;

    return {
      totalPlaces,
      byType,
      byCity,
      currentCrowdTotal,
      maxCrowdTotal,
      crowdPercentage
    };
  };

  const stats = calculateStats();

  // JSX for different view modes
  const renderListView = () => (
    <TableContainer component={Paper} className="mt-4">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Crowd</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Images</TableCell>
            <TableCell>Bookings</TableCell>
            <TableCell>Daily Stats</TableCell>
            <TableCell align="center">Actions</TableCell>
            <TableCell align="center">Stats</TableCell>
            <TableCell align="center">Bookings</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {places.map((place) => (
            <TableRow key={place.id}>
              <TableCell>{place.name}</TableCell>
              <TableCell>{place.description}</TableCell>
              <TableCell>{place.location.city}, {place.location.country}</TableCell>
              <TableCell>
                {place.currentcrowd}/{place.maxcrowd}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (place.currentcrowd / place.maxcrowd) * 100)}%` }}
                  ></div>
                </div>
              </TableCell>
              <TableCell>{place.priceType}</TableCell>
              <TableCell>
                <Chip 
                  label={place.type} 
                  size="small" 
                  color={place.type === "museum" ? "primary" : "secondary"}
                />
              </TableCell>
              <TableCell>
                {place.images.map((img, index) => (
                  <img key={index} src={img} alt="place" style={{ width: 50, height: 50, marginRight: 5 }} />
                ))}
              </TableCell>
              <TableCell>{place.bookingsCount || 0}</TableCell>
              <TableCell>
                {Object.entries(place.dailyStats || {}).map(([date, count]) => (
                  <div key={date}>
                    {date}: {count}
                  </div>
                ))}
              </TableCell>
              <TableCell align="center">
                <IconButton size="small" onClick={() => openEditDialog(place)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => deletePlace(place.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fetchStats(place)}
                >
                  View Stats
                </Button>
              </TableCell>
              <TableCell align="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fetchBookings(place)}
                >
                  View Bookings
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {places.map((place) => (
        <Card key={place.id} className="shadow-lg">
          <CardContent>
            <div className="flex justify-between items-start">
              <Typography variant="h6" component="h2">{place.name}</Typography>
              <div>
                <IconButton size="small" onClick={() => openEditDialog(place)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => deletePlace(place.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            </div>
            <Typography variant="body2" color="textSecondary" className="mt-2">
              {place.description}
            </Typography>
            <Box className="mt-2">
              <Typography variant="body2">
                <strong>Crowd:</strong> {place.currentcrowd}/{place.maxcrowd}
              </Typography>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (place.currentcrowd / place.maxcrowd) * 100)}%` }}
                ></div>
              </div>
            </Box>
            <Typography variant="body2" className="mt-2">
              <PlaceIcon fontSize="small" /> {place.location.city}, {place.location.country}
            </Typography>
            <Box className="mt-2 flex items-center justify-between">
              <Chip 
                label={place.type} 
                size="small" 
                color={place.type === "museum" ? "primary" : "secondary"}
              />
              <Typography variant="body2">{place.priceType}</Typography>
            </Box>
            <Typography variant="body2" className="mt-2">
              <strong>Bookings:</strong> {place.bookingsCount || 0}
            </Typography>
            <Typography variant="body2" className="mt-2">
              <strong>Daily Stats:</strong>
              {Object.entries(place.dailyStats || {}).map(([date, count]) => (
                <div key={date}>
                  {date}: {count}
                </div>
              ))}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStatsView = () => (
    <div className="mt-4">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Places Overview</Typography>
              <Typography variant="h4" className="mt-2">{stats.totalPlaces}</Typography>
              <Typography variant="body2" color="textSecondary">Total places in database</Typography>
              
              <Divider className="my-4" />
              
              <Typography variant="subtitle1">By Type</Typography>
              <Box className="mt-2">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <Box key={type} className="flex justify-between mb-1">
                    <Typography variant="body2">{type}</Typography>
                    <Typography variant="body2" fontWeight="bold">{count}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Crowd Statistics</Typography>
              <Box className="flex justify-between items-center mt-2">
                <div>
                  <Typography variant="h4">{stats.currentCrowdTotal} / {stats.maxCrowdTotal}</Typography>
                  <Typography variant="body2" color="textSecondary">People</Typography>
                </div>
              </Box>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full" 
                  style={{ width: `${stats.crowdPercentage}%` }}
                ></div>
              </div>
              
              <Divider className="my-4" />
              
              <Typography variant="subtitle1">By City</Typography>
              <Box className="mt-2">
                {Object.entries(stats.byCity).map(([city, count]) => (
                  <Box key={city} className="flex justify-between mb-1">
                    <Typography variant="body2">{city}</Typography>
                    <Typography variant="body2" fontWeight="bold">{count}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="p-6">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h4" component="h1" fontWeight="bold"  color="black">
            Manage Museums & Monuments
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => {
              resetForm();
              setOpenDialog(true);
            }}
          >
            Add New Place
          </Button>
        </Box>

        <Paper className="mb-4">
          <Tabs 
            value={viewMode} 
            onChange={(e, newValue) => setViewMode(newValue)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab icon={<ListAlt />} label="List View" value="list" />
            <Tab icon={<Dashboard />} label="Card View" value="card" />
            <Tab icon={<BarChart />} label="Statistics" value="stats" />
          </Tabs>
        </Paper>

        {viewMode === "list" && renderListView()}
        {viewMode === "card" && renderCardView()}
        {viewMode === "stats" && renderStatsView()}

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editMode ? "Edit Place" : "Add New Place"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} className="mt-1">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={editMode ? selectedPlace?.name : newPlace.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={editMode ? selectedPlace?.type : newPlace.type}
                    onChange={handleChange}
                    label="Type"
                  >
                    <MenuItem value="museum">Museum</MenuItem>
                    <MenuItem value="monument">Monument</MenuItem>
                    <MenuItem value="gallery">Gallery</MenuItem>
                    <MenuItem value="landmark">Landmark</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={editMode ? selectedPlace?.description : newPlace.description}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="location.city"
                  value={editMode ? selectedPlace?.location?.city : newPlace.location.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="location.country"
                  value={editMode ? selectedPlace?.location?.country : newPlace.location.country}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Current Crowd"
                  name="currentcrowd"
                  type="number"
                  value={editMode ? selectedPlace?.currentcrowd : newPlace.currentcrowd}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Max Crowd"
                  name="maxcrowd"
                  type="number"
                  value={editMode ? selectedPlace?.maxcrowd : newPlace.maxcrowd}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Price Type</InputLabel>
                  <Select
                    name="priceType"
                    value={editMode ? selectedPlace?.priceType : newPlace.priceType}
                    onChange={handleChange}
                    label="Price Type"
                  >
                    <MenuItem value="Free">Free</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Donation">Donation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Images (comma-separated URLs)"
                  name="images"
                  value={editMode ? selectedPlace?.images.join(", ") : newPlace.images.join(", ")}
                  onChange={(e) => {
                    const value = e.target.value.split(",").map((url) => url.trim());
                    if (editMode) {
                      setSelectedPlace({ ...selectedPlace, images: value });
                    } else {
                      setNewPlace({ ...newPlace, images: value });
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editMode ? selectedPlace?.featured : newPlace.featured}
                      onChange={handleChange}
                      name="featured"
                    />
                  }
                  label="Featured Place"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button 
              onClick={editMode ? updatePlace : addPlace} 
              variant="contained" 
              color="primary"
              startIcon={<Save />}
            >
              {editMode ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
        {renderStatsDialog()}
        {renderBookingsDialog()}
      </div>
    </LocalizationProvider>
  );
}