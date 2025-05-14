'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Tooltip,
    
} from '@mui/material';
import {
    ExpandLess,
    ExpandMore,
    InsertChart,
    People,
    CalendarToday,
    GroupAdd,
    Hotel,
    LocalTaxi,
    Description,
    AccountBox,
    Edit,
    EditNote,
    TaskAlt,
    Toc,
    Receipt,
    BedroomParent,
    BedroomChild,
    Luggage,
    FlightTakeoff,
    Dashboard as DashboardIcon,
    Assignment as AssignmentIcon,
    People as PeopleIcon,
    ExitToApp as LogoutIcon,
    Settings as SettingsIcon,
    Mail as MailIcon,
    AddLocationAlt,
    Flight,
    AirplanemodeInactive,
    MonetizationOn,
    Payment,
    RequestQuote,
    AccountBalance
} from '@mui/icons-material';
import { useAuth } from "@/common/context/AuthContext";
import styles from './style.module.scss'; // Import the styles

interface SubMenuItem {
    text: string;
    icon: React.ReactElement;
    url: string;
}

interface MenuItem {
    text: string;
    icon: React.ReactElement;
    url: string;
    subItems?: SubMenuItem[];
}


const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <InsertChart />, url: '/dashboard' },
    { 
        text: 'Task Management', 
        icon: <AssignmentIcon />, 
        url: '/task',
        subItems: [
            { text: 'Create Task', icon: <TaskAlt/>, url: '/task/create-task' },
            { text: 'Edit Task', icon: <Edit/>, url: '/task/edit-task' },
            { text: 'My Task List', icon: <Toc />, url: '/task/my-task' },
        ], 
    },
    { 
        text: 'Leads', 
        icon: <People />, 
        url: '/dashboard',
        subItems: [
            { text: 'Follow-up List', icon: <Toc />, url: '/leads/follow-up' },
            { text: 'All Leads List', icon: <Description />, url: '/leads/all' },
        ],
    },
    { 
        text: 'Bookings', 
        icon: <CalendarToday />, 
        url: '/booking',
        subItems: [
            { text: 'Create Booking', icon: <EditNote />, url: '/booking/create' },
            { text: 'Booking List', icon: <Description />, url: '/booking/list' },
        ],
    },
    { text: 'Trip Budget Planner', icon: <FlightTakeoff />, url: '/trip-planner' },
    { text: 'Create Itinerary', icon: <Receipt />, url: '/itinerary' },
    { text: 'Hotel Management', icon: <Hotel />, url: '/hotels',
      subItems: [
            { text: 'Add Hotel', icon: <Luggage />, url: '/hotels/add-hotel' },
            { text: 'View Hotel List', icon: <BedroomParent />, url: '/hotels/view-hotel' },
            { text: 'Edit Hotel', icon: <BedroomChild />, url: '/hotels/edit-hotel' },
        ],
      },
    { text: 'Cab List', icon: <LocalTaxi />, url: '/dashboard' },
    {
        text: 'Content Management',
        icon: <AccountBox />,
        url: '/content',
        subItems: [
            { text: 'Static Content', icon: <PeopleIcon />, url: '/content/static' },
            { text: 'Add Holidays Packages', icon: <Flight />, url: '/content/holidayPackages' },
            { text: 'Edit/Delete Holidays Packages', icon: <AirplanemodeInactive />, url: '/content/editHolidayPackages' },
            { text: 'Hero Section', icon: <SettingsIcon />, url: '/content/hero' },
            { text: 'Add Destination', icon: <AddLocationAlt />, url: 'content/destination' },
        ],
    },
    {
        text: 'User Management',
        icon: <AccountBox />,
        url: '/users',
        subItems: [
            { text: 'Add User', icon: <PeopleIcon />, url: '/users/list' },
            { text: 'Edit user', icon: <SettingsIcon />, url: '/users/settings' },
            { text: 'Delete User', icon: <SettingsIcon />, url: '/users/settings' },
        ],
    },
    {
        text: 'Expense Management',
        icon: <MonetizationOn />,
        url: '/expense',
        subItems: [
            { text: 'Request Expense', icon: <Payment />, url: '/expense/request-expense' },
            { text: 'Approve Expense', icon: <AccountBalance />, url: '/expense/approve-expense' },
        ],
    },
];

const SideMenu: React.FC = () => {
    const [expanded, setExpanded] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<string>('Dashboard');
    const { logout } = useAuth();
    const router = useRouter();

    const handleMouseEnter = () => {
        setExpanded(true);
    };

    const handleMouseLeave = () => {
        setExpanded(false);
        setExpandedMenu(null);
    };

    const handleMenuClick = (item: MenuItem) => {
        setSelectedItem(item.text);
        if (item.subItems) {
            setExpandedMenu(expandedMenu === item.text ? null : item.text);
        } else {
            router.push(item.url);
        }
    };

    const handleSubItemClick = (subItem: SubMenuItem) => {
        setSelectedItem(subItem.text);
        router.push(subItem.url);
    };

    return (
        <Box
            className={styles.scrollContainer}
            sx={{
                position: 'fixed',
                left: 0,
                top: 65,
                bottom: 0,
                width: expanded ? 280 : 56,
                backgroundColor: '#1a2035', // Dark professional background
                transition: 'all 0.3s ease',
                overflowX: 'hidden',
                overflowY: 'auto',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                zIndex: 1200,
                '&:hover': {
                    width: 280,
                },
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <List sx={{ p: 0 }}>
                {menuItems.map((item) => (
                    <React.Fragment key={item.text}>
                        <ListItem
                            button
                            className={`${styles.menuItem} ${selectedItem === item.text ? styles.active : ''} ${!expanded ? styles.collapsed : ''}`}
                            onClick={() => handleMenuClick(item)}
                            sx={{
                                mb: 0.5,
                                px: 2,
                                py: 1,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    '& .MuiListItemText-primary': {
                                        color: '#000000 !important',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: '#000000 !important',
                                    },
                                    '& .expandIcon': {
                                        color: '#000000 !important',
                                    },
                                },
                                ...(selectedItem === item.text && {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        '& .MuiListItemText-primary': {
                                            color: '#000000 !important',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: '#000000 !important',
                                        },
                                        '& .expandIcon': {
                                            color: '#000000 !important',
                                        },
                                    },
                                }),
                            }}
                        >
                            <Tooltip title={!expanded ? item.text : ''} placement="right">
                                <ListItemIcon 
                                    sx={{
                                        minWidth: 40,
                                        justifyContent:'center',
                                        color: selectedItem === item.text ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                            </Tooltip>
                            {expanded && (
                                <>
                                    <ListItemText 
                                        primary={item.text}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '0.95rem',
                                                fontWeight: selectedItem === item.text ? 500 : 400,
                                                color: selectedItem === item.text ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                                            },
                                        }}
                                    />
                                    {item.subItems && (
                                        <Box 
                                            className="expandIcon"
                                            sx={{ 
                                                color: selectedItem === item.text ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                                                transition: 'all 0.2s',
                                                transform: expandedMenu === item.text ? 'rotate(-180deg)' : 'none',
                                            }}
                                        >
                                            {expandedMenu === item.text ? <ExpandLess /> : <ExpandMore />}
                                        </Box>
                                    )}
                                </>
                            )}
                        </ListItem>
                        {item.subItems && (
                            <Collapse in={expandedMenu === item.text && expanded} timeout="auto" unmountOnExit>
                                <List 
                                    component="div" 
                                    sx={{ 
                                        pl: 3,
                                        pb: 1,
                                    }}
                                >
                                    {item.subItems.map((subItem) => (
                                        <ListItem
                                            button
                                            key={subItem.text}
                                            onClick={() => handleSubItemClick(subItem)}
                                            sx={{
                                                mb: 0.5,
                                                py: 0.75,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                                    '& .MuiListItemText-primary': {
                                                        color: '#000000 !important',
                                                    },
                                                    '& .MuiListItemIcon-root': {
                                                        color: '#000000 !important',
                                                    },
                                                },
                                                ...(selectedItem === subItem.text && {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                        '& .MuiListItemText-primary': {
                                                            color: '#000000 !important',
                                                        },
                                                        '& .MuiListItemIcon-root': {
                                                            color: '#000000 !important',
                                                        },
                                                    },
                                                }),
                                            }}
                                        >
                                            <ListItemIcon 
                                                sx={{
                                                    minWidth: 36,
                                                    color: selectedItem === subItem.text ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                                                }}
                                            >
                                                {subItem.icon}
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={subItem.text}
                                                sx={{
                                                    '& .MuiListItemText-primary': {
                                                        fontSize: '0.875rem',
                                                        fontWeight: selectedItem === subItem.text ? 600 : 400,
                                                        color: selectedItem === subItem.text ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                                                    },
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}

                {/* Separator - only show when expanded */}
                {expanded && (
                    <Box
                        sx={{
                            mt: 2,
                            mb: 2,
                            height: '1px',
                            background: 'rgba(255, 255, 255, 0.12)',
                            mx: 2,
                        }}
                    />
                )}

                {/* Logout button with fixed alignment */}
                <ListItem
                    component="div"
                    onClick={logout}
                    sx={{
                        px: expanded ? 2 : 1.5,  // Removed mt: 2 since we have separator now
                        py: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: expanded ? 'flex-start' : 'center',
                        minHeight: 48,
                        '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.15)',
                        },
                    }}
                >
                    <Tooltip title={expanded ? '' : 'Logout'} placement="right" arrow>
                        <ListItemIcon
                            sx={{
                                minWidth: expanded ? 40 : 'auto',  // Remove minimum width when collapsed
                                color: '#f44336',
                                margin: expanded ? 'unset' : '0 auto',  // Center icon when collapsed
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <LogoutIcon />
                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText
                        primary="Logout"
                        sx={{
                            opacity: expanded ? 1 : 0,
                            transition: 'opacity 0.3s',
                            margin: 0,  // Remove default margin
                            '& .MuiListItemText-primary': {
                                color: '#f44336',
                                fontWeight: 500,
                            },
                        }}
                    />
                </ListItem>
            </List>
        </Box>
    );
};

export default SideMenu;

