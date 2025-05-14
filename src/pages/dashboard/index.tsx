import React, { useState, useEffect } from "react";
import axiosInstance from "@/common/http";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/common/context/AuthContext";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Paper,
  Checkbox,
  Avatar,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import styles from "./style.module.scss";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useRouter } from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  DirectionsCar,
  Hotel,
  FlightTakeoff,
  Today,
  Schedule,
  CheckCircle,
  Cancel,
  TrendingUp,
  Group,
  LocationOn,
  Reorder,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface DealsData {
  [key: string]: any[]; // Add proper type instead of any[] when you know the deal structure
  openDeals: any[];
  untouchedDeals: any[];
  callsToday: any[];
  leads: any[];
}


const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  


  return (
    <PrivateRoute>
      <Box className={styles.dashboardContainer}>
        {loading ? (
          <h1>Loading....</h1>
        ) : (
          <>
            
          <h1>Dashboard</h1>
          </>
        )}

        
      </Box>
    </PrivateRoute>
  );
};

export default Dashboard;
