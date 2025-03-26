import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import HotelDetail from "./pages/HotelDetail";
import HotelList from "./pages/HotelList";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import "./i18n/config";
import MuseumDetail from "./pages/MuseumDetails";
import Museums from "./pages/Museums"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/hotels" element={<HotelList />} />
                <Route path="/hotel/:id" element={<HotelDetail />} /> */}
                {/* <Route path="/places/" element={<MuseumDetail />} /> Ensure this route is correctly defined */}
                {/* <Route path="/booking/:id" element={<Booking />} /> */}
                {/* <Route path="/my-bookings" element={<MyBookings />} /> */}
                <Route path="/place" element={<Museums />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
            {/* Footer is already included in Home page, so we'll conditionally render it on other pages */}
            <Routes>
              <Route path="/" element={null} />
              <Route path="*" element={<Footer />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
