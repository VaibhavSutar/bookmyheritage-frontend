import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CircularProgress,
  responsiveFontSizes,
} from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetail from "./pages/HotelDetail";
import Booking from "./pages/Booking";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import BecomeHost from "./pages/BecomeHost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import "./App.css";
import MuseumDetail from "./pages/MuseumDetails";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PlacesPage from "./pages/ManagePlace";
import { Dashboard } from "@mui/icons-material";
import AdminLayout from "./pages/AdminLayout";
import Adminstats from "./pages/Dashboard";

let theme = createTheme({
  palette: {
    primary: {
      main: "#FF385C",
      light: "#FF5A5F",
      dark: "#D93B42",
      contrastText: "#fff",
    },
    secondary: {
      main: "#222222",
      light: "#484848",
      dark: "#000000",
      contrastText: "#fff",
    },
    booking: {
      main: "#4A90E2",
      light: "#68A5E9",
      dark: "#3A78C2",
      contrastText: "#fff",
    },
    background: {
      default: "#F7F7F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#222222",
      secondary: "#717171",
    },
  },
  typography: {
    fontFamily:
      'Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      "@media (min-width:600px)": {
        fontSize: "3rem",
      },
      "@media (min-width:960px)": {
        fontSize: "3.5rem",
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      "@media (min-width:600px)": {
        fontSize: "2.5rem",
      },
      "@media (min-width:960px)": {
        fontSize: "3rem",
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      "@media (min-width:600px)": {
        fontSize: "2rem",
      },
      "@media (min-width:960px)": {
        fontSize: "2.25rem",
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      "@media (min-width:600px)": {
        fontSize: "1.75rem",
      },
      "@media (min-width:960px)": {
        fontSize: "2rem",
      },
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
      "@media (min-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.1rem",
      "@media (min-width:600px)": {
        fontSize: "1.25rem",
      },
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
          "@media (min-width:600px)": {
            paddingLeft: "24px",
            paddingRight: "24px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: "hidden",
        },
      },
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetail />} />
              <Route path="/booking/:id" element={<Booking />} /> */}
              <Route path="/place/:id" element={<MuseumDetail />} />
              {/* <Route path="/wishlist" element={<Wishlist />} /> */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              {/* <Route path="/become-host" element={<BecomeHost />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              {/* <Route path="/admin/home" element={<AdminDashboard />} />
              <Route path="/admin/manageplace" element={<PlacesPage />} /> */}
              {/* <Route path="/admin/stats" element={<Dashboard />} /> */}
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route path="dashboard" element={<Adminstats />} />
                <Route path="manageplace" element={<PlacesPage />} />
              </Route>
            </Routes>
            {/* <PropertyList /> */}
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
