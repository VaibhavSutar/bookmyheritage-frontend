import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

const AdminLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setIsDrawerOpen(true)} sx={{ mr: 2, display: { md: "none" } }}>
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap>Admin Panel</Typography>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" }, display: { xs: "none", md: "block" } }} open>
          <Toolbar />
          <List>
            <ListItem button component={Link} to="/admin/board"><ListItemText primary="Dashboard" /></ListItem>
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { md: 30 } }}>
          <Toolbar />
          <Outlet /> {/* This ensures that nested routes will render here */}
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

// Define Routes in App.js or a similar file
const AdminRoutes = () => (
  <Routes>
    <Route path="/admin/*" element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
