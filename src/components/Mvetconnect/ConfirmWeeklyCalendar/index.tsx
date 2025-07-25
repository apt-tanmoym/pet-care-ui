import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaclityServiceResponse } from '@/interfaces/facilityInterface';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const slotDurations = [5, 10, 15, 20, 30, 40, 45, 60];

const allHours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const morningHours = Array.from({ length: 13 }, (_, i) => i.toString().padStart(2, '0'));
const afternoonHours = Array.from({ length: 11 }, (_, i) => (i + 13).toString().padStart(2, '0'));
const allMinutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

interface Slot {
  fromHour: string;
  fromMin: string;
  toHour: string;
  toMin: string;
  patients: string;
}

interface ConfirmWeeklyCalendarProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (selectedDays: string[], slots: Slot[], appointmentType: string, slotDuration: string) => void;
  onBack: () => void;
  facility: FaclityServiceResponse | null;
  startDate: string;
  endDate: string;
  prefill?: any;
}

const ConfirmWeeklyCalendar: React.FC<ConfirmWeeklyCalendarProps> = ({ open, onCancel, onConfirm, onBack, facility, startDate, endDate, prefill }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([{ fromHour: '', fromMin: '', toHour: '', toMin: '', patients: '' }]);
  const [appointmentType, setAppointmentType] = useState('TIMESLOT');
  const [slotDuration, setSlotDuration] = useState('');
  const [slotErrors, setSlotErrors] = useState<string[]>([]);

  const handleDayToggle = (event: React.MouseEvent<HTMLElement>, newActiveDay: string | null) => {
    if (newActiveDay !== null) {
      setActiveDay(newActiveDay);
      setShowCreateNew(false);
      setSlots([{ fromHour: '', fromMin: '', toHour: '', toMin: '', patients: '' }]);
      setAppointmentType('TIMESLOT');
      setSlotDuration('');
      setSlotErrors([]);
      
      if (!selectedDays.includes(newActiveDay)) {
        setSelectedDays([...selectedDays, newActiveDay]);
      }
    }
  };

  const handleAddSlot = () => {
    if (slots.length < 2) {
      setSlots([...slots, { fromHour: '', fromMin: '', toHour: '', toMin: '', patients: '' }]);
      setSlotErrors([]);
    }
  };
  const handleDeleteSlot = (idx: number) => {
    setSlots(slots.filter((_, i) => i !== idx));
    setSlotErrors([]);
  };
  const handleSlotChange = (idx: number, field: keyof Slot, value: string) => {
    setSlots(slots.map((slot, i) => (i === idx ? { ...slot, [field]: value } : slot)));
    if (slotErrors.length) {
      setSlotErrors([]);
    }
  };

  const handleConfirmClick = () => {
    const errors = slots.map(slot => {
      const { fromHour, fromMin, toHour, toMin } = slot;
      if (!fromHour || !fromMin || !toHour || !toMin) {
        return 'All time fields must be filled.';
      }
      const fromTotalMinutes = parseInt(fromHour, 10) * 60 + parseInt(fromMin, 10);
      const toTotalMinutes = parseInt(toHour, 10) * 60 + parseInt(toMin, 10);
      if (fromTotalMinutes >= toTotalMinutes) {
        return "'To Time' must be after 'From Time'.";
      }
      return '';
    });
    
    setSlotErrors(errors);
    const hasErrors = errors.some(error => !!error);

    if (!hasErrors) {
      onConfirm(selectedDays, slots, appointmentType, slotDuration);
    }
  };

  const renderSlotCreator = () => (
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {slots.map((slot, idx) => (
        <Paper 
          key={idx} 
          variant="outlined" 
          sx={{ 
            p: 2, 
            position: 'relative', 
            borderRadius: '12px',
            borderColor: slotErrors[idx] ? 'error.main' : 'divider',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#34495e', mb: 2 }}>Slot {idx + 1}</Typography>
          {slots.length > 1 && (
            <IconButton size="small" onClick={() => handleDeleteSlot(idx)} sx={{ position: 'absolute', top: 8, right: 8, color: 'd32f2f' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>From Time</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControl fullWidth size="small">
                          <InputLabel>HH</InputLabel>
                          <Select
                              value={slot.fromHour}
                              label="HH"
                              onChange={(e) => handleSlotChange(idx, 'fromHour', e.target.value)}
                          >
                              {(idx === 0 ? morningHours : afternoonHours).map(hour => (
                                  <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                      <FormControl fullWidth size="small">
                          <InputLabel>MM</InputLabel>
                          <Select
                              value={slot.fromMin}
                              label="MM"
                              onChange={(e) => handleSlotChange(idx, 'fromMin', e.target.value)}
                          >
                              {allMinutes.map(min => (
                                  <MenuItem key={min} value={min}>{min}</MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                  </Box>
              </Box>
              <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>To Time</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControl fullWidth size="small">
                          <InputLabel>HH</InputLabel>
                          <Select
                              value={slot.toHour}
                              label="HH"
                              onChange={(e) => handleSlotChange(idx, 'toHour', e.target.value)}
                          >
                              {(idx === 0 ? morningHours : afternoonHours).map(hour => (
                                  <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                      <FormControl fullWidth size="small">
                          <InputLabel>MM</InputLabel>
                          <Select
                              value={slot.toMin}
                              label="MM"
                              onChange={(e) => handleSlotChange(idx, 'toMin', e.target.value)}
                          >
                              {allMinutes.map(min => (
                                  <MenuItem key={min} value={min}>{min}</MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                  </Box>
              </Box>
          </Box>
          {slotErrors[idx] && (
            <Typography color="error" variant="caption" sx={{ mt: 2, display: 'block' }}>
              {slotErrors[idx]}
            </Typography>
          )}
        </Paper>
      ))}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddSlot} sx={{ alignSelf: 'flex-start' }} disabled={slots.length >= 2}>
        Add Slot
      </Button>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#34495e' }}>Appointment Settings</Typography>
        <FormControl>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Book Appointment By:</Typography>
          <RadioGroup row value={appointmentType} onChange={e => setAppointmentType(e.target.value)}>
            <FormControlLabel value="TIMESLOT" control={<Radio />} label="Timeslot" />
            <FormControlLabel value="SEQUENCE" control={<Radio />} label="Sequence" />
          </RadioGroup>
        </FormControl>
        {appointmentType === 'TIMESLOT' ? (
          <FormControl fullWidth>
            <InputLabel>Slot Duration (Mins)</InputLabel>
            <Select value={slotDuration} label="Slot Duration (Mins)" onChange={(e: SelectChangeEvent) => setSlotDuration(e.target.value)}>
              {slotDurations.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>
        ) : (
          slots.map((slot, idx) => (
            <TextField key={idx} label={`Number of Patients (Slot ${idx + 1})`} value={slot.patients} onChange={e => handleSlotChange(idx, 'patients', e.target.value)} type="number" fullWidth />
          ))
        )}
      </Box>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ position: 'relative', p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <IconButton onClick={onBack} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ textAlign: 'center', fontWeight: 600, color: '#174a7c' }}>
          Create Your Weekly Calendar
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f7f9fc', borderRadius: '12px', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#174a7c', textAlign: 'center' }}>
            {facility?.facilityName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555', textAlign: 'center' }}>
            {facility?.contactPersonName}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{startDate}</Typography>
            <Typography sx={{ color: '#7f8c8d' }}>to</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{endDate}</Typography>
          </Box>
        </Paper>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: '#34495e' }}>Select a Day</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup value={activeDay} exclusive onChange={handleDayToggle} aria-label="day of the week">
            {daysOfWeek.map(day => (
              <ToggleButton key={day} value={day} aria-label={day} sx={{ textTransform: 'none' }}>
                {day}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {activeDay && !showCreateNew && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, my: 4 }}>
            <Button 
              variant="contained" 
              onClick={() => {
                setShowCreateNew(true)
                setSlotErrors([])
              }} 
              sx={{ 
                minWidth: 220,
                bgcolor: '#174a7c',
                '&:hover': { bgcolor: '#103a61' }
              }}>
                Create New Schedule
            </Button>
            <Typography sx={{ color: '#7f8c8d' }}>or</Typography>
            <Button 
              variant="outlined" 
              sx={{ 
                minWidth: 220,
                color: '#174a7c',
                borderColor: '#174a7c',
                '&:hover': {
                  borderColor: '#103a61',
                  bgcolor: 'rgba(23, 74, 124, 0.04)'
                } 
              }}>
                Copy from Other Days
            </Button>
          </Box>
        )}

        {activeDay && showCreateNew && renderSlotCreator()}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onCancel} sx={{ color: '#d32f2f' }}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleConfirmClick}
          sx={{
            bgcolor: '#174a7c',
            '&:hover': { bgcolor: '#103a61' }
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmWeeklyCalendar; 