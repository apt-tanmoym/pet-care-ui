import React, { useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { FaclityServiceResponse } from '@/interfaces/facilityInterface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import ConsultationFacilitySelector from "@/components/vetconnect/Consultation/ConsultationFacilitySelector";
import ConsultationDetails from "@/components/vetconnect/Consultation/ConsultationDetails";
import AlertPopup from "@/components/vetconnect/Consultation/AlertPopup";
import ListOfConsultation from "@/components/vetconnect/Consultation/ListOfConsultation";

interface ConsultationItem {
  petName: string;
  ownerName: string;
  timeRange: string;
  imageUrl?: string;
}

const Consultation: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<FaclityServiceResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openCalendarDialog, setOpenCalendarDialog] = useState(false);
  const [showConsultationDetails, setShowConsultationDetails] = useState(false);
  const [showListOfConsultation, setShowListOfConsultation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const consultations: ConsultationItem[] = [
    {
      petName: "Buddy",
      ownerName: "John Doe",
      timeRange: "13:00 - 13:30",
      imageUrl: "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
    },
    {
      petName: "Luna",
      ownerName: "Jane Smith",
      timeRange: "14:00 - 14:30",
      imageUrl: "https://cdn.thewirecutter.com/wp-content/media/2021/03/dogharnesses-2048px-6907.webp?auto=webp&quality=75&crop=1.91:1&width=1200",
    },
  ];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    setOpenCalendarDialog(false);
    if (date && isToday(date)) {
      setShowConsultationDetails(true);
      setShowListOfConsultation(false);
    } else {
      setShowConsultationDetails(false);
      setShowListOfConsultation(false);
      if (date) {
        setShowAlert(true);
      }
    }
  };

  const handleStartConsultation = () => {
    setShowConsultationDetails(false);
    setShowListOfConsultation(true);
  };

  const handleArriveClick = (consultation: ConsultationItem) => {
    console.log(`${consultation.petName} has arrived!`);
    // Optionally trigger modal or update status here
  };

  const ConsultationDay = (props: PickersDayProps<Dayjs>) => {
    const { day, outsideCurrentMonth, selected, ...other } = props;
    const isSpecial = [14, 16, 17, 23].includes(day.date());

    let dayColor = 'transparent';
    let textColor = '#174a7c';

    if ([17, 23].includes(day.date())) {
      dayColor = '#4CAF50';
      textColor = '#fff';
    } else if ([14, 16].includes(day.date())) {
      dayColor = '#FFC107';
    }

    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          backgroundColor: selected ? '#174a7c' : dayColor,
          color: selected ? '#fff' : textColor,
          fontWeight: 600,
          '&:hover': {
            backgroundColor: selected ? '#174a7c' : (dayColor === 'transparent' ? '#e0e0e0' : dayColor),
            color: selected || dayColor !== 'transparent' ? textColor : '#174a7c',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
          border: selected ? '2px solid #174a7c' : 'none',
          boxShadow: selected ? '0 0 0 2px #174a7c, 0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
          borderRadius: '16px',
          margin: '3px',
          width: '40px',
          height: '40px',
          fontSize: '1.1rem',
        }}
      />
    );
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
            onSelectConsultationDate={() => setOpenCalendarDialog(true)}
            selectedFacility={selectedFacility}
          />

          <Dialog open={openCalendarDialog} onClose={() => setOpenCalendarDialog(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 0 }}>
              <span>Select Date</span>
              <IconButton onClick={() => setOpenCalendarDialog(false)} size="small" sx={{ ml: 2 }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 2, pt: 0 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate ? dayjs(selectedDate) : null}
                  onChange={(newValue) => handleDateSelect(newValue ? newValue.toDate() : null)}
                  slotProps={{ actionBar: { actions: [] } }}
                  slots={{ day: ConsultationDay }}
                />
              </LocalizationProvider>

              {/* Legend */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#4CAF50' }}></Box>
                  <Typography variant="body2">No booking</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#FFC107' }}></Box>
                  <Typography variant="body2">Booking started</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#F44336' }}></Box>
                  <Typography variant="body2">Fully booked</Typography>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>

          {showConsultationDetails && selectedDate && isToday(selectedDate) && (
            <ConsultationDetails
              selectedDate={selectedDate}
              onStartConsultation={handleStartConsultation}
            />
          )}

          {showListOfConsultation && selectedDate && isToday(selectedDate) && (
            <ListOfConsultation
              selectedDate={selectedDate}
              consultations={consultations}
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