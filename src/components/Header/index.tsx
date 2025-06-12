'use client'

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import styles from './styles.module.scss';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
  notificationCount: number;
}

const Header: React.FC<HeaderProps> = ({ notificationCount }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('isAuthenticated');
    router.push('/signin');
    handleClose();
  };

  return (
    <AppBar position="fixed" className={styles.appBar}>
      <Toolbar>
        <Box display="flex" alignItems="center">
          <Image
            src="/images/logo/apple-icon-57x57.png"
            alt="Aptcare Logo"
            width={40}
            height={40}
            style={{ marginRight: '10px' }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: 'black',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Aptcare Pet
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <IconButton color="inherit">
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsIcon sx={{ color: 'grey.500' }} />
          </Badge>
        </IconButton>

        <IconButton onClick={handleProfileClick}>
          <Avatar alt={userData?.firstName || 'User'} src="/images/avatar.png" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem>
            <Typography>
              {userData?.firstName} {userData?.lastName}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
