import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import { Menu } from "@mui/icons-material";
import ProtectedRoute from "./ProtectedRoute"; // Ensure correct path

const AdminLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex" }}>
        {/* Admin Top Bar */}
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setIsDrawerOpen(true)} sx={{ mr: 2, display: { md: "none" } }}>
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap>Admin Panel</Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar Navigation */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
            display: { xs: "none", md: "block" },
          }}
          open
        >
          <Toolbar />
          <List>
            <ListItem button component={Link} to="/admin/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/admin/manageplace">
              <ListItemText primary="Manage Places" />
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" >
          <Toolbar />
          <Outlet /> 
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default AdminLayout;
