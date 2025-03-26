import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Close,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";

const ProfileButton = styled(Button)(({ theme }) => ({
  borderRadius: "40px",
  border: "1px solid #DDDDDD",
  padding: theme.spacing(0.5, 1),
  color: theme.palette.text.primary,
  "&:hover": {
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: alpha(theme.palette.common.white, 0.95),
  },
}));

function Navbar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const mobileMenuItems = [
    ...(user
      ? [
          { text: "Profile", onClick: () => navigate("/profile") },
          { text: "My Bookings", onClick: () => navigate("/my-bookings") },
          // { text: "Wishlist", onClick: () => navigate("/wishlist") },
          { text: "Logout", onClick: logout },
        ]
      : [
          { text: "Login", onClick: () => navigate("/login") },
          { text: "Sign Up", onClick: () => navigate("/signup") },
        ]),
  ];

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: { xs: "56px", sm: "64px" },
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              cursor: "pointer",
              color: "primary.main",
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              flexShrink: 0,
            }}
            onClick={() => navigate("/")}
          >
            Book My Heritage
          </Typography>

          {/* Navigation Items - Desktop */}
          {!isMobile ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
              {/* <Button
                color="inherit"
                onClick={() => navigate("/become-host")}
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                Become a Host
              </Button> */}

              {user ? (
                <>
                  <IconButton
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ ml: { xs: 1, sm: 2 } }}
                  >
                    {user.photoURL ? (
                      <Avatar
                        src={user.photoURL}
                        alt={user.displayName}
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : (
                      <AccountCircle />
                    )}
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        width: 200,
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/my-bookings")}>
                      My Bookings
                    </MenuItem>
                    {/* <MenuItem onClick={() => navigate("/wishlist")}>
                      Wishlist
                    </MenuItem> */}
                    <Divider />
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/login")}
                    sx={{ display: { xs: "none", sm: "flex" } }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => navigate("/signup")}
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 0.5, sm: 0.75 },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          ) : (
            // Mobile menu button
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Container>
      </Toolbar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 300 } },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            HotelBooking
          </Typography>
          <IconButton onClick={toggleMobileMenu}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {mobileMenuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  item.onClick();
                  setMobileMenuOpen(false);
                }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
