import React, { useState, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';

// Mock data for available slots
const availableSlots = [
  { time: '09:00 - 09:30', isBooked: false },
  { time: '09:30 - 10:00', isBooked: true },
  { time: '10:00 - 10:30', isBooked: false },
  { time: '10:30 - 11:00', isBooked: false },
  { time: '11:00 - 11:30', isBooked: true },
  { time: '11:30 - 12:00', isBooked: false },
  { time: '14:00 - 14:30', isBooked: false },
  { time: '14:30 - 15:00', isBooked: false },
];

interface CreateAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onBook: () => void;
}

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({ open, onClose, selectedDate, onBook }) => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const handleToggleSlot = (time: string) => {
    setSelectedSlots(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const formattedDate = useMemo(() => {
    return selectedDate ? dayjs(selectedDate).format('dddd, MMMM D, YYYY') : '';
  }, [selectedDate]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle sx={{ p: 2, bgcolor: '#f7f9fc', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#174a7c' }}>Create Appointment</Typography>
            <Typography variant="body1" sx={{ color: '#555' }}>{formattedDate}</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#555' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List sx={{ py: 1 }}>
          {availableSlots.map(slot => (
            <ListItem
              key={slot.time}
              button
              disabled={slot.isBooked}
              onClick={() => !slot.isBooked && handleToggleSlot(slot.time)}
              sx={{
                py: 1.5,
                px: 3,
                '&:hover': {
                  bgcolor: 'rgba(23, 74, 124, 0.04)',
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  bgcolor: '#f5f5f5',
                }
              }}
            >
              <ListItemText 
                primary={slot.time} 
                secondary={slot.isBooked ? 'Booked' : 'Available'}
                primaryTypographyProps={{ fontWeight: 500, color: slot.isBooked ? '#7f8c8d' : '#2c3e50' }}
                secondaryTypographyProps={{ color: slot.isBooked ? '#c0392b' : '#27ae60' }}
              />
              <Checkbox
                edge="end"
                checked={selectedSlots.includes(slot.time)}
                disabled={slot.isBooked}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} sx={{ color: '#555' }}>Cancel</Button>
        <Button 
          variant="contained"
          onClick={onBook}
          disabled={selectedSlots.length === 0}
          sx={{ bgcolor: '#174a7c', '&:hover': { bgcolor: '#103a61' }, minWidth: 150 }}
        >
          Book ({selectedSlots.length}) Slot(s)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAppointmentDialog; 