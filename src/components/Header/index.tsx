'use client'

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import styles from './styles.module.scss'; // Import the styles

interface HeaderProps {
  notificationCount: number;
}

const Header: React.FC<HeaderProps> = ({ notificationCount }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleBellClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      className={styles.appBar}
      sx={{ backgroundColor: 'white !important' }} // Ensure background color is white
    >
      <Toolbar className={styles.toolbar}>
        {/* Logo */}
        <Box className={styles.logoBox}>
          <img src={'/images/logo/parts_mojo_logo.png'} alt={'aptcarePetWeb  Logo'} className={styles.logo} />
        </Box>

        {/* Notification and Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={handleBellClick} sx={{ mr: 2 }}>
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsIcon sx={{ color: 'grey.500' }} />
            </Badge>
          </IconButton>
          <Avatar alt="User Avatar" src="/placeholder-avatar.jpg" />
        </Box>

        {/* Notification Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{ mt: 2 }}
        >
          <MenuItem onClick={handleClose}>Notification 1</MenuItem>
          <MenuItem onClick={handleClose}>Notification 2</MenuItem>
          <MenuItem onClick={handleClose}>Notification 3</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
