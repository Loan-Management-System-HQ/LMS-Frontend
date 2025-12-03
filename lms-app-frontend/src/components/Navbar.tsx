import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Logo from "../assets/logo.png";
import "./Navbar.css";

import {
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
  Box,
} from "@mui/material";
import { Logout, Person, Settings } from "@mui/icons-material";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, clearEmail } = useContext(UserContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    clearEmail();
    navigate("/signin");
  };

  const handleProfile = () => {
    handleClose();
    navigate("/home/profile");
  };

  const hideLogin = location.pathname === "/signin" || location.pathname === "/";

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button
          className="navbar-logo-button"
          onClick={() => navigate(email ? "/home" : "/")}
        >
          <img src={Logo} alt="Logo" className="navbar-logo" />
        </button>

        <div className="navbar-right">
          {!email && !hideLogin && (
            <button
              className="login-button"
              onClick={() => navigate("/signin")}
            >
              Login
            </button>
          )}

          {email && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 40, height: 40, bgcolor: "#f5f5f5" }}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        alt="User"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">User</Typography>
                  <Typography variant="body2" color="text.secondary">{email}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
