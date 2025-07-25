import React, { useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { FaclityServiceResponse } from '@/interfaces/facilityInterface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppointmentDetails from "@/components/Mappointments/AppointmentDetails";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import AppointmentFacilitySelector from "@/components/Mappointments/AppointmentFacilitySelector";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import Divider from '@mui/material/Divider';
import styles from './CalendarDialog.module.scss';
import Paper from "@mui/material/Paper";
import FormHelperText from "@mui/material/FormHelperText";
import CreateAppointmentDialog from "@/components/Mappointments/CreateAppointmentDialog";
import PatientSearchDialog from "@/components/Mappointments/PatientSearchDialog";


const Appointments: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<FaclityServiceResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFacilityHelper, setShowFacilityHelper] = useState(false);
  const [showDateHelper, setShowDateHelper] = useState(false);
  const [openCalendarDialog, setOpenCalendarDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openPatientSearchDialog, setOpenPatientSearchDialog] = useState(false);

  // Derived state to check if appointments exist for the selected date
  const appointmentsAvailable = selectedDate && [14, 16, 17, 23].includes(selectedDate.getDate());

  // Check if selected date is in the past
  const isPastDate = selectedDate ? new Date(selectedDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) : false;
  const disableCreate = !selectedDate || isPastDate;

  const handleDateSelect = (date: Dayjs | null) => {
    const newDate = date ? date.toDate() : null;
    setSelectedDate(newDate);
    if (newDate) {
      setShowDateHelper(false);
    }
    setOpenCalendarDialog(false);
  };

  const handleOpenCalendar = () => {
    if (!selectedFacility) {
      setShowFacilityHelper(true);
    } else {
      setOpenCalendarDialog(true);
    }
  };

  const handleCloseCalendar = () => {
    setOpenCalendarDialog(false);
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleProceedToPatientSearch = () => {
    setOpenCreateDialog(false);
    setOpenPatientSearchDialog(true);
  };

  const handleClosePatientSearch = () => {
    setOpenPatientSearchDialog(false);
  };

  const handleViewAll = () => {
    if(!selectedDate) {
      setShowDateHelper(true);
    } else {
      // Add navigation or state change logic here
      console.log("Viewing all appointments...");
    }
  }

  const AppointmentDay = (props: PickersDayProps<Dayjs>) => {
    const { day, ...other } = props;
    const isFourteenth = day.date() === 14;
    const isSixteenth = day.date() === 16;
    const isSeventeenth = day.date() === 17;
    const isTwentyThird = day.date() === 23;

    let dayClassName = styles.default;
    if (isSeventeenth || isTwentyThird) {
      dayClassName = styles.available;
    } else if (isFourteenth || isSixteenth) {
      dayClassName = styles.partial;
    }
    return <PickersDay {...other} day={day} className={`${styles.appointmentDay} ${dayClassName}`} />;
  };

  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Box sx={{ mb: 3, px: 2, textAlign: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#2c3e50', mb: 0.5 }}>
              Appointments
            </Typography>
            <Typography variant="body1" sx={{ color: '#555' }}>
              Select a facility and date to manage your appointments.
            </Typography>
          </Box>

          <Paper elevation={0} sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            <Box sx={{ bgcolor: '#f7f9fc', p: { xs: 2, sm: 3 }, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#174a7c' }}>
                Schedule &amp; Appointments
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {/* Step 1: Facility & Date Selection */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 4 }, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, width: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: '#34495e' }}>1. Select Facility</Typography>
                  <AppointmentFacilitySelector
                    onFacilitySelect={setSelectedFacility}
                    selectedFacility={selectedFacility}
                    showHelper={showFacilityHelper}
                    setShowHelper={setShowFacilityHelper}
                  />
                </Box>
                <Box sx={{ flex: 1, width: '100%' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: selectedFacility ? '#34495e' : '#bdc3c7' }}>2. Select Date</Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleOpenCalendar}
                    disabled={!selectedFacility}
                    sx={{
                      justifyContent: 'space-between',
                      p: 2,
                      height: 58,
                      borderRadius: '12px',
                      textTransform: 'none',
                      color: selectedDate ? '#2c3e50' : '#7f8c8d',
                      borderColor: showDateHelper ? '#c0392b' : '#dde2e7',
                      bgcolor: '#ffffff',
                      '&:hover': {
                        borderColor: '#174a7c',
                        bgcolor: 'rgba(23, 74, 124, 0.04)',
                      }
                    }}
                  >
                    {selectedDate ? dayjs(selectedDate).format('MMMM D, YYYY') : 'Choose a date'}
                    <CalendarIcon sx={{ color: '#7f8c8d' }} />
                  </Button>
                  {showDateHelper && <FormHelperText sx={{ color: '#c0392b', fontWeight: 500, ml: 1 }}>Please select a date to view appointments.</FormHelperText>}
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Step 3: Appointment Details */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: selectedDate ? '#34495e' : '#bdc3c7' }}>3. Appointments for the day</Typography>
                <Box sx={{ minHeight: 100 }}>
                  {appointmentsAvailable ? (
                    <AppointmentDetails selectedDate={selectedDate} />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: '#f7f9fc', borderRadius: '12px' }}>
                      <Typography sx={{ color: '#7f8c8d', fontStyle: 'italic' }}>
                        {selectedDate ? "No appointments scheduled for this date." : "Appointments will be shown here once you select a date."}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Button variant="contained" onClick={handleViewAll} sx={{ bgcolor: '#174a7c', '&:hover': { bgcolor: '#103a61' } }}>View All</Button>
                <Button 
                  variant="contained" 
                  disabled={disableCreate}
                  onClick={handleOpenCreateDialog}
                  sx={{ 
                    bgcolor: disableCreate ? '#bdc3c7' : '#174a7c', 
                    '&:hover': { 
                      bgcolor: disableCreate ? '#bdc3c7' : '#103a61' 
                    },
                    '&:disabled': {
                      bgcolor: '#bdc3c7',
                      color: '#7f8c8d'
                    }
                  }}
                >
                  Create New
                </Button>
              </Box>
            </Box>
          </Paper>

          <Dialog open={openCalendarDialog} onClose={handleCloseCalendar} className={styles.calendarDialog}>
            <DialogTitle className={styles.dialogHeader}>
              <Typography className={styles.headerTitle}><CalendarIcon sx={{ fontSize: '1.5rem' }} /> Select Date</Typography>
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
              <div className={styles.calendarContainer}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    value={selectedDate ? dayjs(selectedDate) : null}
                    onChange={handleDateSelect}
                    slotProps={{ actionBar: { actions: [] } }}
                    slots={{ day: AppointmentDay }}
                  />
                </LocalizationProvider>
              </div>
              <div className={styles.legendContainer}>
                <div className={styles.legendItem}><div className={`${styles.legendIndicator} ${styles.available}`}></div><Typography className={styles.legendText}>Available</Typography></div>
                <div className={styles.legendItem}><div className={`${styles.legendIndicator} ${styles.partial}`}></div><Typography className={styles.legendText}>Partial</Typography></div>
                <div className={styles.legendItem}><div className={`${styles.legendIndicator} ${styles.booked}`}></div><Typography className={styles.legendText}>Booked</Typography></div>
              </div>
            </DialogContent>
          </Dialog>

          <CreateAppointmentDialog
            open={openCreateDialog}
            onClose={handleCloseCreateDialog}
            selectedDate={selectedDate}
            onBook={handleProceedToPatientSearch}
          />

          <PatientSearchDialog 
            open={openPatientSearchDialog}
            onClose={handleClosePatientSearch}
          />
        </Box>
      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default Appointments;
