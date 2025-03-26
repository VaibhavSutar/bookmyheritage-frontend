import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
  IconButton,
  Button,
  Link,
  TextField,
  InputAdornment,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Instagram,
  Facebook,
  Twitter,
  Pinterest,
  Language,
  CurrencyExchange,
  YouTube,
  LinkedIn,
  Send,
  CreditCard,
  Security,
  Verified,
  LocationOn,
  Phone,
  Email,
  AccessTime,
} from "@mui/icons-material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Payment methods
  const paymentMethods = [
    "Visa",
    "MasterCard",
    "American Express",
    "PayPal",
    "Apple Pay",
    "Google Pay",
  ];

  // Interactive link style
  const interactiveLinkStyle = {
    transition: "all 0.2s ease",
    position: "relative",
    color: "#333",
    fontWeight: "500",
    "&:hover": {
      color: "primary.main",
      pl: 0.5,
    },
    "&::before": {
      content: '""',
      position: "absolute",
      width: "0",
      height: "2px",
      bottom: 0,
      left: 0,
      backgroundColor: "primary.main",
      transition: "width 0.3s ease",
    },
    "&:hover::before": {
      width: "100%",
    },
  };

  // Interactive social icon style
  const socialIconStyle = {
    transition: "all 0.3s ease",
    color: "primary.main",
    bgcolor: "rgba(74, 144, 226, 0.1)",
    "&:hover": {
      color: "white",
      bgcolor: "primary.main",
      transform: "translateY(-3px)",
    },
  };

  // Interactive chip style
  const interactiveChipStyle = {
    transition: "all 0.3s ease",
    borderColor: "primary.light",
    fontWeight: "500",
    bgcolor: "white",
    "&:hover": {
      bgcolor: "primary.light",
      color: "white",
      transform: "scale(1.05)",
      borderColor: "primary.main",
    },
  };

  // Interactive heading style
  const interactiveHeadingStyle = {
    fontWeight: "600",
    mb: 2,
    position: "relative",
    display: "inline-block",
    color: "primary.dark",
    "&::after": {
      content: '""',
      position: "absolute",
      width: "30%",
      height: "3px",
      bottom: "-4px",
      left: 0,
      backgroundColor: "primary.main",
      transition: "width 0.3s ease",
    },
    "&:hover::after": {
      width: "100%",
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#f5f5f5",
        borderTop: "1px solid",
        borderColor: "primary.light",
        py: 6,
        mt: "auto",
        color: "text.primary",
        boxShadow: "0px -2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Container maxWidth={false}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            bgcolor: "white",
            p: 2,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="primary.main"
              sx={{ fontWeight: "bold" }}
            >
              © {currentYear} BookMyHeritage, Inc. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
              <Link
                href="#"
                underline="hover"
                color="text.secondary"
                variant="body2"
                sx={interactiveLinkStyle}
              >
                Privacy
              </Link>
              <Link
                href="#"
                underline="hover"
                color="text.secondary"
                variant="body2"
                sx={interactiveLinkStyle}
              >
                Terms
              </Link>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, mt: { xs: 2, sm: 0 } }}>
            <Tooltip title="Instagram">
              <IconButton size="small" sx={socialIconStyle}>
                <Instagram />
              </IconButton>
            </Tooltip>
            <Tooltip title="Facebook">
              <IconButton size="small" sx={socialIconStyle}>
                <Facebook />
              </IconButton>
            </Tooltip>
            <Tooltip title="Twitter">
              <IconButton size="small" sx={socialIconStyle}>
                <Twitter />
              </IconButton>
            </Tooltip>
            <Tooltip title="Pinterest">
              <IconButton size="small" sx={socialIconStyle}>
                <Pinterest />
              </IconButton>
            </Tooltip>
            <Tooltip title="YouTube">
              <IconButton size="small" sx={socialIconStyle}>
                <YouTube />
              </IconButton>
            </Tooltip>
            <Tooltip title="LinkedIn">
              <IconButton size="small" sx={socialIconStyle}>
                <LinkedIn />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
