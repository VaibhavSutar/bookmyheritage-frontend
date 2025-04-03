import React from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Typography, Button, Box, Grid, Paper
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatsDialog = ({ 
  open, 
  onClose, 
  statsData, 
  loadingStats, 
  selectedPlace 
}) => {
  if (!selectedPlace) return null;
  
  // Calculate the actual crowd percentage from Firestore data
  const currentCrowd = parseInt(selectedPlace.currentcrowd) || 0;
  const maxCrowd = parseInt(selectedPlace.maxcrowd) || 1; // Prevent division by zero
  const actualCrowdPercentage = (currentCrowd / maxCrowd) * 100;
  
  // Format the binary predictions for better readability
  const formatBinaryLabel = (value) => value === 1 || value > 0.5 ? "Yes" : "No";
  
  // Prepare data for weekly crowd predictions (mock data for now)
  const weeklyCrowdPredictions = statsData?.weeklyCrowdPredictions || [
    { day: "Monday", prediction: 0.6 },
    { day: "Tuesday", prediction: 0.7 },
    { day: "Wednesday", prediction: 0.5 },
    { day: "Thursday", prediction: 0.8 },
    { day: "Friday", prediction: 0.9 },
    { day: "Saturday", prediction: 1.0 },
    { day: "Sunday", prediction: 0.85 },
  ];

  // Prepare data for daily stats graph
  const dailyStatsData = {
    labels: Object.keys(selectedPlace.dailyStats || {}),
    datasets: [
      {
        label: "Daily Bookings",
        data: Object.values(selectedPlace.dailyStats || {}),
        backgroundColor: "#3f51b5",
      },
    ],
  };

  // Calculate the predicted crowd count based on crowdPrediction
  // crowdPrediction is a value between 0-1 representing the probability or percentage
  const predictedCrowdCount = Math.min(
    maxCrowd, 
    Math.round(statsData?.crowdPrediction  + currentCrowd)
  );
  
  const predictedCrowdPercentage = (predictedCrowdCount / maxCrowd) * 100;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Statistics for {selectedPlace.name}
      </DialogTitle>
      <DialogContent>
        {loadingStats ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Typography>Loading statistics...</Typography>
          </Box>
        ) : statsData ? (
          <Grid container spacing={3}>
            {/* Binary Predictions Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Current Predictions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: 300 }}>
                      <Bar
                        data={{
                          labels: ["Season", "Crowd", "Peak", "Anomaly"],
                          datasets: [
                            {
                              label: "Prediction Value",
                              data: [
                                statsData.seasonPrediction,
                                statsData.crowdPrediction,
                                statsData.peakPrediction,
                                statsData.anomalyPrediction,
                              ],
                              backgroundColor: ["#3f51b5", "#ff5722", "#4caf50", "#f44336"],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                            tooltip: { 
                              callbacks: { 
                                label: (context) => `Value: ${context.raw.toFixed(2)}` 
                              } 
                            },
                          },
                          scales: {
                            y: { beginAtZero: true, max: 1 },
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Prediction Results:
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {[
                          { label: "High Season", value: formatBinaryLabel(statsData.seasonPrediction) },
                          { label: "Crowded", value: formatBinaryLabel(statsData.crowdPrediction) },
                          { label: "Peak Time", value: formatBinaryLabel(statsData.peakPrediction) },
                          { label: "Anomaly Detected", value: formatBinaryLabel(statsData.anomalyPrediction) }
                        ].map((item, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              display: "flex", 
                              justifyContent: "space-between", 
                              mb: 2,
                              p: 1,
                              borderRadius: 1,
                              bgcolor: item.value === "Yes" ? "rgba(76, 175, 80, 0.1)" : "transparent",
                              border: 1,
                              borderColor: item.value === "Yes" ? "success.main" : "divider"
                            }}
                          >
                            <Typography variant="body1">{item.label}</Typography>
                            <Typography 
                              variant="body1" 
                              fontWeight="bold"
                              color={item.value === "Yes" ? "success.main" : "text.secondary"}
                            >
                              {item.value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Weekly Crowd Predictions Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Weekly Crowd Predictions
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={{
                      labels: weeklyCrowdPredictions.map((item) => item.day),
                      datasets: [
                        {
                          label: "Crowd Prediction (%)",
                          data: weeklyCrowdPredictions.map((item) => item.prediction * 100),
                          backgroundColor: "#ff5722",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: true },
                      },
                      scales: {
                        y: { 
                          beginAtZero: true, 
                          max: 100,
                          title: {
                            display: true,
                            text: "Percentage (%)",
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Crowd Comparison Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Crowd Analysis
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Current Occupancy 
                    </Typography>
                    <Box 
                      sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        mb: 1,
                        justifyContent: "space-between"
                      }}
                    >
                      <Typography variant="h5">
                        {currentCrowd}/{maxCrowd}
                      </Typography>
                      <Typography variant="h5" color={actualCrowdPercentage > 80 ? "error.main" : "text.primary"}>
                        {actualCrowdPercentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1, mb: 3 }}>
                      <Box sx={{ width: "100%", bgcolor: "grey.300", borderRadius: 1, height: 20 }}>
                        <Box
                          sx={{
                            width: `${Math.min(100, actualCrowdPercentage)}%`,
                            bgcolor: actualCrowdPercentage > 80 ? "error.main" : 
                                    actualCrowdPercentage > 60 ? "warning.main" : "success.main",
                            height: 20,
                            borderRadius: 1,
                            transition: "width 1s ease-in-out",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Predicted Crowd Level
                    </Typography>
                    <Box 
                      sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        mb: 1,
                        justifyContent: "space-between"
                      }}
                    >
                      <Typography variant="body1">
                        Predicted value
                      </Typography>
                      <Typography variant="h5" color={predictedCrowdPercentage > 70 ? "error.main" : "text.primary"}>
                        {predictedCrowdCount}/{maxCrowd} ({predictedCrowdPercentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ width: "100%", bgcolor: "grey.300", borderRadius: 1, height: 20 }}>
                        <Box
                          sx={{
                            width: `${Math.min(100, predictedCrowdPercentage)}%`,
                            bgcolor: predictedCrowdPercentage > 70 ? "error.main" : 
                                    predictedCrowdPercentage > 50 ? "warning.main" : "success.main",
                            height: 20,
                            borderRadius: 1,
                            transition: "width 1s ease-in-out",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Combined visualization */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Comparison: Actual vs Predicted
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <Bar
                      data={{
                        labels: ["Crowd Levels"],
                        datasets: [
                          {
                            label: "Actual Crowd (%)",
                            data: [actualCrowdPercentage],
                            backgroundColor: "#3f51b5",
                          },
                          {
                            label: "Predicted Crowd (%)",
                            data: [predictedCrowdPercentage],
                            backgroundColor: "#ff5722",
                          }
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: "top" },
                        },
                        scales: {
                          y: { 
                            beginAtZero: true, 
                            max: 100,
                            title: {
                              display: true,
                              text: 'Percentage (%)'
                            }
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Additional Statistics Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Additional Statistics
                </Typography>
                <Typography variant="body1">
                  <strong>Bookings Count:</strong> {selectedPlace.bookingsCount || 0}
                </Typography>
                <Typography variant="body1" className="mt-2">
                  <strong>Daily Stats:</strong>
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <Bar
                    data={dailyStatsData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: true },
                      },
                      scales: {
                        y: { 
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Bookings",
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Typography>Error fetching statistics. Please try again.</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Cancel />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatsDialog;