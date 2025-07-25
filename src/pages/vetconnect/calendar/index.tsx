import React, { useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import FacilityDropdown from "@/components/Mvetconnect/FacilityDropdown";
import CreateNewCalendar from "@/components/Mvetconnect/CreateNewCalendar";
import ConfirmWeeklyCalendar from "@/components/Mvetconnect/ConfirmWeeklyCalendar";
import { FaclityServiceResponse } from '@/interfaces/facilityInterface';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const Calendar: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<FaclityServiceResponse | null>(null);
  const [showFacilityHelper, setShowFacilityHelper] = useState(false);
  const [openCreateCalendar, setOpenCreateCalendar] = useState(false);
  const [openConfirmWeekly, setOpenConfirmWeekly] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' });
  const [showSlotAvailable, setShowSlotAvailable] = useState(false);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editPrefill, setEditPrefill] = useState<any | null>(null);

  const handleFacilitySelect = (facility: FaclityServiceResponse | null) => {
    setSelectedFacility(facility);
    if (facility) {
      setShowFacilityHelper(false);
    }
  };

  const handleCreateCalendarClick = () => {
    if (!selectedFacility) {
      setShowFacilityHelper(true);
    } else {
      setOpenCreateCalendar(true);
    }
  };

  const handleConfirm = (selectedDays: string[], slots: any[], appointmentType: string, slotDuration: string) => {
    const newEntry = {
      start: dateRange.start,
      end: dateRange.end,
      selectedDays,
      slots,
      appointmentType,
      slotDuration,
      facility: selectedFacility
    };
    if (editIndex !== null) {
      setCalendars(cals => cals.map((c, i) => i === editIndex ? newEntry : c));
      setEditIndex(null);
    } else {
      setCalendars(cals => [...cals, newEntry]);
    }
    setOpenConfirmWeekly(false);
    setEditPrefill(null);
  };

  const handleEdit = (idx: number) => {
    const cal = calendars[idx];
    setEditIndex(idx);
    setDateRange({ start: cal.start, end: cal.end });
    setEditPrefill(cal);
    setOpenConfirmWeekly(true);
  };

  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <Box sx={{ mb: 3, px: 2, textAlign: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
              Calendar Management
            </Typography>
            <Typography variant="body1" sx={{ color: '#555', mt: 1 }}>
              Select a facility to view or create your weekly calendars.
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '16px' }}>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, alignItems: 'flex-end' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: '#34495e' }}>1. Select Your Facility</Typography>
                  <FacilityDropdown
                    selectedFacility={selectedFacility}
                    onFacilitySelect={handleFacilitySelect}
                    showHelper={showFacilityHelper}
                  />
                </Box>
                <Button
                  variant="contained"
                  onClick={handleCreateCalendarClick}
                  disabled={!selectedFacility}
                  sx={{ 
                    py: 1.75,
                    bgcolor: '#174a7c',
                    '&:hover': { bgcolor: '#103a61' }
                  }}
                >
                  Create New Calendar
                </Button>
              </Box>

              {calendars.length > 0 && (
                <>
                  <Divider sx={{ my: 4 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#34495e' }}>
                    Your Created Calendars
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px' }}>
                    <Table>
                      <TableHead sx={{ bgcolor: '#f7f9fc' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Facility</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Active Days</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Slots</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {calendars.map((cal, idx) => (
                          <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">{cal.facility?.facilityName}</TableCell>
                            <TableCell>{cal.start}</TableCell>
                            <TableCell>{cal.end}</TableCell>
                            <TableCell>{cal.selectedDays?.join(', ')}</TableCell>
                            <TableCell>{cal.slots?.length}</TableCell>
                            <TableCell align="right">
                              <IconButton onClick={() => handleEdit(idx)} color="primary">
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Box>
          </Paper>
        </Box>

        <CreateNewCalendar
          open={openCreateCalendar}
          onCancel={() => setOpenCreateCalendar(false)}
          onOk={(start, end) => {
            setOpenCreateCalendar(false);
            setDateRange({
              start: start ? start.format('DD.MM.YY') : '',
              end: end ? end.format('DD.MM.YY') : ''
            });
            setShowSlotAvailable(true);
            setTimeout(() => setOpenConfirmWeekly(true), 1000);
          }}
          usedRanges={calendars.map(cal => ({ start: cal.start, end: cal.end }))}
        />
        <ConfirmWeeklyCalendar
          open={openConfirmWeekly}
          onCancel={() => {
            setOpenConfirmWeekly(false);
            setEditIndex(null);
            setEditPrefill(null);
          }}
          onBack={() => {
            setOpenConfirmWeekly(false);
            setOpenCreateCalendar(true);
            setEditIndex(null);
            setEditPrefill(null);
          }}
          onConfirm={(selectedDays, slots, appointmentType, slotDuration) => handleConfirm(selectedDays, slots, appointmentType, slotDuration)}
          facility={selectedFacility}
          startDate={dateRange.start}
          endDate={dateRange.end}
          prefill={editPrefill}
        />
        <Snackbar
          open={showSlotAvailable}
          autoHideDuration={1200}
          onClose={() => setShowSlotAvailable(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Slot is available
          </Alert>
        </Snackbar>
      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default Calendar;
