import React, { useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { FaclityServiceResponse } from '@/interfaces/facilityInterface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';
import ConsultationFacilitySelector from "@/components/vetconnect/Consultation/ConsultationFacilitySelector";
import AlertPopup from "@/components/vetconnect/Consultation/AlertPopup";
import ListOfConsultation from "@/components/vetconnect/Consultation/ListOfConsultation";

interface ConsultationItem {
  petName: string;
  ownerName: string;
  timeRange: string;
  imageUrl?: string;
  // API fields for updatestatusarrive
  patientMrn?: number;
  petOwnerUid?: string;
  patientUid?: number;
  appointmentId?: number;
  facilityId?: number;
  appointmentStatus?: string;
}

const Consultation: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<FaclityServiceResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [patientSlots, setPatientSlots] = useState<any[]>([]);
  const [showListOfConsultation, setShowListOfConsultation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  // Sample patient data for appointment booking
  const [selectedPatient, setSelectedPatient] = useState<{
    petOwnerUid: string;
    patientUid: string;
    patientId: number;
    petName: string;
    ownerName: string;
  } | null>(null);

  // Map API data to ConsultationItem format
  const mapPatientSlotsToConsultations = (slots: any[]): ConsultationItem[] => {
    return slots
      .filter(slot => slot.patientName) // Only include slots with actual patients
      .map(slot => ({
        petName: slot.patientName || 'Unknown Pet',
        ownerName: slot.petOwnerUid ? `Owner ${slot.petOwnerUid}` : 'Unknown Owner',
        timeRange: `${slot.startTime || '00:00'} - ${slot.stopTime || '00:00'}`,
        imageUrl: undefined, // No image URL in API response
        // API fields for updatestatusarrive
        patientMrn: parseInt(slot.patientMrn) || 1,
        petOwnerUid: slot.petOwnerUid?.toString() || '4',
        patientUid: parseInt(slot.patientUid) || 125,
        appointmentId: parseInt(slot.appointmentId) || 1174,
        facilityId: selectedFacility?.facilityId || 1,
        appointmentStatus: slot.appointmentStatus || 'Scheduled'
      }));
  };

  // Fallback dummy data
  const dummyConsultations: ConsultationItem[] = [
    {
      petName: "Buddy",
      ownerName: "John Doe",
      timeRange: "13:00 - 13:30",
      imageUrl: "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
      patientMrn: 1,
      petOwnerUid: "4",
      patientUid: 125,
      appointmentId: 1174,
      facilityId: selectedFacility?.facilityId || 1
    },
    {
      petName: "Luna",
      ownerName: "Jane Smith",
      timeRange: "14:00 - 14:30",
      imageUrl: "https://cdn.thewirecutter.com/wp-content/media/2021/03/dogharnesses-2048px-6907.webp?auto=webp&quality=75&crop=1.91:1&width=1200",
      patientMrn: 2,
      petOwnerUid: "5",
      patientUid: 126,
      appointmentId: 1175,
      facilityId: selectedFacility?.facilityId || 1
    },
  ];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  };

  const handleDateSelect = (date: Dayjs, slots?: any[]) => {
    const dateObj = date.toDate();
    setSelectedDate(dateObj);
    setPatientSlots(slots || []);
    if (isToday(dateObj)) {
      setShowListOfConsultation(true);
    } else {
      setShowListOfConsultation(false);
      setShowAlert(true);
    }
  };

  const handleArriveClick = (consultation: ConsultationItem) => {
    console.log(`${consultation.petName} has arrived!`);
    // Optionally trigger modal or update status here
  };

  const handleAppointmentSaved = (response: { message: string; status: string }) => {
    console.log('Appointment saved:', response.message);
    // You can show a success message or redirect here
    alert(`Appointment booked successfully! ${response.message}`);
  };

  // Sample function to set a patient for booking (you would get this from your patient selection component)
  const handleSelectPatient = () => {
    setSelectedPatient({
      petOwnerUid: "1",
      patientUid: "296", 
      patientId: 6,
      petName: "Buddy",
      ownerName: "John Doe"
    });
  };


  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#174a7c', mb: 3, textAlign: 'center' }}>
            Consultation
          </Typography>

          <ConsultationFacilitySelector
            onFacilitySelect={setSelectedFacility}
            onSelectConsultationDate={handleDateSelect}
            selectedFacility={selectedFacility}
            selectedPatient={selectedPatient}
            onAppointmentSaved={handleAppointmentSaved}
          />
          {showListOfConsultation && selectedDate && isToday(selectedDate) && (
            <ListOfConsultation
              selectedDate={selectedDate}
             consultations={patientSlots.length > 0 ? mapPatientSlotsToConsultations(patientSlots) : dummyConsultations}
              onArriveClick={handleArriveClick}
            />
          )}

          {showAlert && <AlertPopup onClose={() => setShowAlert(false)} />}
        </Box>
      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default Consultation;