import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs, { Dayjs } from 'dayjs';
import { FaclityServiceResponse } from '@/interfaces/facilityInterface';
import { temporaryAdjustCalendar, getSlotDates } from '@/services/manageCalendar';

interface TempAdjustmentProps {
  open: boolean;
  onClose: () => void;
  calendarData: any;
  facility: FaclityServiceResponse | null;
}

interface TimeSlot {
  fromHour: string;
  fromMin: string;
  toHour: string;
  toMin: string;
  notAvailable: boolean;
}

const TempAdjustment: React.FC<TempAdjustmentProps> = ({
  open,
  onClose,
  calendarData,
  facility
}) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { fromHour: '01', fromMin: '00', toHour: '05', toMin: '00', notAvailable: false }
  ]);
  const [slotDuration, setSlotDuration] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });
  const [slotDates, setSlotDates] = useState<{ available: string[]; notavailable: string[]; fullavailable: string[] }>({
    available: [],
    notavailable: [],
    fullavailable: []
  });
  const [isLoadingSlotDates, setIsLoadingSlotDates] = useState(false);

  const slotDurations = ['10', '15', '20', '30', '45', '60'];

  useEffect(() => {
    if (open && facility?.facilityId) {
      fetchSlotDates();
    }
  }, [open, facility?.facilityId]);

  const fetchSlotDates = async () => {
    if (!facility?.facilityId) return;
    
    setIsLoadingSlotDates(true);
    try {
      const response = await getSlotDates({
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: 'M',
        facilityId: facility.facilityId
      });

      if (response.status === 'ok') {
        const available = response.available ? response.available.split(',').map(date => date.trim()) : [];
        const notavailable = response.notavailable ? response.notavailable.split(',').map(date => date.trim()) : [];
        const fullavailable = response.fullavailable ? response.fullavailable.split(',').map(date => date.trim()) : [];
        
        setSlotDates({
          available,
          notavailable,
          fullavailable
        });
      }
    } catch (error) {
      console.error('Error fetching slot dates:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch available dates',
        severity: 'error'
      });
    } finally {
      setIsLoadingSlotDates(false);
    }
  };

  const handleAddSlot = () => {
    if (timeSlots.length < 2) {
      setTimeSlots([...timeSlots, { fromHour: '09', fromMin: '00', toHour: '10', toMin: '00', notAvailable: false }]);
    }
  };

  const handleRemoveSlot = (index: number) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const handleSlotChange = (index: number, field: keyof TimeSlot, value: string | boolean) => {
    const newSlots = [...timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setTimeSlots(newSlots);
  };

  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMonth(currentMonth.subtract(1, 'month'));
    } else {
      setCurrentMonth(currentMonth.add(1, 'month'));
    }
  };

  const getCalendarDays = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');
    
    const days = [];
    let day = startOfWeek;
    
    while (day.isBefore(endOfWeek) || day.isSame(endOfWeek, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }
    
    return days;
  };

  const isCurrentMonth = (date: Dayjs) => {
    return date.month() === currentMonth.month();
  };

  const isSelected = (date: Dayjs) => {
    return selectedDate && date.isSame(selectedDate, 'day');
  };

  const isDateAvailable = (date: Dayjs) => {
    const dateStr = date.format('DD/MM/YYYY');
    return slotDates.available.includes(dateStr);
  };

  const isDateFullAvailable = (date: Dayjs) => {
    const dateStr = date.format('DD/MM/YYYY');
    return slotDates.fullavailable.includes(dateStr);
  };

  const isDateNotAvailable = (date: Dayjs) => {
    const dateStr = date.format('DD/MM/YYYY');
    return slotDates.notavailable.includes(dateStr);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !facility || !calendarData) {
      setSnackbar({
        open: true,
        message: "Please select a date and ensure facility data is available",
        severity: "warning"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Format the selected date to DD/MM/YYYY
      const formattedDate = selectedDate.format('DD/MM/YYYY');
      
      // Build dayTime string from time slots
      const dayTime = timeSlots
        .filter(slot => !slot.notAvailable)
        .map(slot => {
          const fromTime = `${slot.fromHour}-${slot.fromMin}`;
          const toTime = `${slot.toHour}-${slot.toMin}`;
          return `${fromTime}-${toTime}`;
        })
        .join('~');

      // If no valid time slots, show warning
      if (!dayTime) {
        setSnackbar({
          open: true,
          message: "Please configure at least one time slot or mark slots as 'Not Available'",
          severity: "warning"
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare API payload
      const payload = {
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: 'M',
        startDate: formattedDate,
        orgId: localStorage.getItem('orgId') || undefined,
        facilityId: facility.facilityId,
        dayTime: dayTime,
        slotDuration: slotDuration,
        slotDuration2: '',
        bookAppType: 'timeslot',
        slotId: calendarData.slotId?.toString() || ''
      };

      console.log('Temporary adjustment payload:', payload);

      // Call the API
      const response = await temporaryAdjustCalendar(payload);

      if (response.status === "True") {
        setSnackbar({
          open: true,
          message: response.message || "Temporary adjustment applied successfully!",
          severity: "success"
        });
        
        // Close modal after showing success message
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: response.message || "Failed to apply temporary adjustment",
          severity: "error"
        });
      }
    } catch (error) {
      console.error('Error submitting temp adjustment:', error);
      setSnackbar({
        open: true,
        message: "Error applying temporary adjustment. Please try again.",
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setCurrentMonth(dayjs());
    setSelectedDate(null);
    setTimeSlots([{ fromHour: '01', fromMin: '00', toHour: '05', toMin: '00', notAvailable: false }]);
    setSlotDuration('10');
    setSlotDates({ available: [], notavailable: [], fullavailable: [] });
    onClose();
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          minHeight: '600px'
        }
      }}
    >
      <DialogTitle sx={{ 
        position: 'relative', 
        p: 3, 
        borderBottom: '1px solid #e0e0e0',
        bgcolor: '#f7f9fc'
      }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#666'
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: '#174a7c', pr: 4 }}>
          Temporary Calendar Adjustment
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
          Select a date and adjust time slots for temporary changes
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: '8px' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#34495e', mb: 1 }}>
              Current Calendar Details
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#666' }}>Facility</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {facility?.facilityName || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#666' }}>Schedule Period</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {calendarData?.scheduleStartDt || 'N/A'} - {calendarData?.scheduleStopDt || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {/* Left Side - Calendar */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#34495e' }}>
              Select Date
            </Typography>
            
            {isLoadingSlotDates && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: '8px', border: '1px solid #2196f3' }}>
                <Typography variant="body2" sx={{ color: '#1976d2', textAlign: 'center' }}>
                  Loading available dates...
                </Typography>
              </Box>
            )}
            
            {/* Calendar Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              mb: 2,
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <IconButton 
                onClick={() => handleMonthChange('prev')}
                size="small"
                sx={{ color: '#666' }}
              >
                <ChevronLeftIcon />
              </IconButton>
              
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#34495e' }}>
                {currentMonth.format('MMMM YYYY')}
              </Typography>
              
              <IconButton 
                onClick={() => handleMonthChange('next')}
                size="small"
                sx={{ color: '#666' }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>

            {/* Calendar Grid */}
            <Paper elevation={1} sx={{ p: 2, bgcolor: 'white' }}>
              {/* Week Days Header */}
              <Grid container sx={{ mb: 1 }}>
                {weekDays.map((day) => (
                  <Grid item xs={12/7} key={day} sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', py: 1 }}>
                      {day}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              {/* Calendar Days */}
              <Grid container>
                {calendarDays.map((date, index) => (
                  <Grid item xs={12/7} key={index}>
                    <Box
                      onClick={() => handleDateClick(date)}
                      sx={{
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        borderRadius: '50%',
                        mx: 0.5,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        ...(isCurrentMonth(date) && {
                          color: '#333',
                          '&:hover': {
                            bgcolor: '#e3f2fd',
                            transform: 'scale(1.1)'
                          }
                        }),
                        ...(!isCurrentMonth(date) && {
                          color: '#ccc'
                        }),
                        ...(isSelected(date) && {
                          bgcolor: '#2196f3',
                          color: 'white',
                          fontWeight: 600,
                          transform: 'scale(1.1)',
                          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
                        }),
                        ...(isDateAvailable(date) && !isSelected(date) && {
                          bgcolor: '#4caf50',
                          color: 'white',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: '#45a049',
                            transform: 'scale(1.1)'
                          }
                        }),
                        ...(isDateFullAvailable(date) && !isSelected(date) && {
                          bgcolor: '#ff9800',
                          color: 'white',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: '#f57c00',
                            transform: 'scale(1.1)'
                          }
                        }),
                        ...(isDateNotAvailable(date) && !isSelected(date) && {
                          bgcolor: '#f44336',
                          color: 'white',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: '#d32f2f',
                            transform: 'scale(1.1)'
                          }
                        })
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: isSelected(date) ? 600 : 400 }}>
                        {date.date()}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Calendar Legend */}
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#34495e', mb: 1 }}>
                Calendar Legend
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#4caf50' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#666' }}>
                    Available
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ff9800' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#666' }}>
                    Full Available
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#f44336' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#666' }}>
                    Not Available
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#2196f3' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#666' }}>
                    Selected
                  </Typography>
                </Box>
              </Box>
            </Box>
            
          </Box>

          {/* Right Side - Time Configuration (only show when date is selected) */}
          {selectedDate ? (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#34495e' }}>
                Time Configuration
              </Typography>
              
              {timeSlots.map((slot, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                      Slot {index + 1}
                    </Typography>
                    {timeSlots.length > 1 && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleRemoveSlot(index)}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                  
                  {!slot.notAvailable ? (
                    <>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                            From Time *
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <FormControl size="small" fullWidth>
                              <InputLabel>Hours(24)</InputLabel>
                              <Select
                                value={slot.fromHour}
                                label="Hours(24)"
                                onChange={(e) => handleSlotChange(index, 'fromHour', e.target.value)}
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl size="small" fullWidth>
                              <InputLabel>Mins</InputLabel>
                              <Select
                                value={slot.fromMin}
                                label="Mins"
                                onChange={(e) => handleSlotChange(index, 'fromMin', e.target.value)}
                              >
                                {Array.from({ length: 60 }, (_, i) => (
                                  <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                            To Time *
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <FormControl size="small" fullWidth>
                              <InputLabel>Hours(24)</InputLabel>
                              <Select
                                value={slot.toHour}
                                label="Hours(24)"
                                onChange={(e) => handleSlotChange(index, 'toHour', e.target.value)}
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl size="small" fullWidth>
                              <InputLabel>Mins</InputLabel>
                              <Select
                                value={slot.toMin}
                                label="Mins"
                                onChange={(e) => handleSlotChange(index, 'toMin', e.target.value)}
                              >
                                {Array.from({ length: 60 }, (_, i) => (
                                  <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0', borderRadius: '8px', border: '1px solid #ff9800' }}>
                      <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500 }}>
                        This slot is marked as "Not Available"
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={slot.notAvailable}
                          onChange={(e) => handleSlotChange(index, 'notAvailable', e.target.checked)}
                          sx={{
                            color: '#e67e22',
                            '&.Mui-checked': {
                              color: '#e67e22'
                            }
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#e67e22' }}>
                          Not Available
                        </Typography>
                      }
                    />
                  </Box>
                </Box>
              ))}
              
              {timeSlots.length < 2 && (
                <Button
                  variant="outlined"
                  onClick={handleAddSlot}
                  sx={{
                    color: '#174a7c',
                    borderColor: '#174a7c',
                    '&:hover': {
                      borderColor: '#103a61',
                      bgcolor: 'rgba(23, 74, 124, 0.04)'
                    }
                  }}
                >
                  + Add Another Slot
                </Button>
              )}
              
              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Slot Duration (Mins)</InputLabel>
                  <Select
                    value={slotDuration}
                    label="Slot Duration (Mins)"
                    onChange={(e) => setSlotDuration(e.target.value)}
                  >
                    {slotDurations.map(duration => (
                      <MenuItem key={duration} value={duration}>{duration}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '400px',
              bgcolor: '#f8f9fa',
              borderRadius: '8px',
              border: '2px dashed #ddd'
            }}>
              <Typography variant="body1" sx={{ color: '#999', textAlign: 'center' }}>
                Please select a date from the calendar<br />
                to configure time slots
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0', gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: '#666',
            borderColor: '#ddd',
            '&:hover': {
              borderColor: '#999',
              bgcolor: '#f5f5f5'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !selectedDate}
          sx={{
            bgcolor: '#e67e22',
            '&:hover': {
              bgcolor: '#d35400'
            },
            '&:disabled': {
              bgcolor: '#ccc'
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Adjustment'}
        </Button>
      </DialogActions>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default TempAdjustment;
