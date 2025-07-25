'use client';

import FacilityList from '@/components/Facility/FacilityList';
import Message from '@/components/common/Message';
import { FaclityServicePayload, FaclityServiceResponse } from '@/interfaces/facilityInterface';
import { getOwnFacilites } from '@/services/faclilityService';
import React, { useEffect, useState } from 'react';
import PrivateRoute from "@/components/PrivateRoute";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export default function FacilityPage() {
  const [facilites, setFacilites] = useState<FaclityServiceResponse[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const facilityPayload:FaclityServicePayload = {
      userName: "jibons",
      userPass: "P@ssw0rd",
      deviceStat: "M",
      callingFrom: "web",
      orgId: "20",
      searchFacility: "",
      status: "All"
  }
  
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await getOwnFacilites(facilityPayload);
        const data: FaclityServiceResponse[] = await response;
        setFacilites(data);
      } catch (error: any) {
        setSnackbarMessage(error?.response?.data?.message || 'Server Error');
        setOpenSnackbar(true);
      }
    };

    fetchFacilities();
  }, []);

  // Add this function to refresh facilities
  const refreshFacilities = async () => {
    try {
      const response = await getOwnFacilites(facilityPayload);
      const data: FaclityServiceResponse[] = await response;
      setFacilites(data);
    } catch (error: any) {
      setSnackbarMessage(error?.response?.data?.message || 'Server Error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEdit = (facility: any) => {
    console.log('Edit clicked:', facility);
  };

  return (
    <PrivateRoute>
    <AuthenticatedLayout>
    <FacilityList facilities={facilites} onEdit={handleEdit} onAddSuccess={refreshFacilities} />
    <Message 
      openSnackbar={openSnackbar} 
      handleCloseSnackbar={handleCloseSnackbar} 
      snackbarSeverity="error" 
      snackbarMessage={snackbarMessage} 
    />
    </AuthenticatedLayout>
    </PrivateRoute>
  )
}
