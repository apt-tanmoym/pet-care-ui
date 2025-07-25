import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface AppointmentDetailsProps {
  selectedDate: Date | null;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  selectedDate,
}) => {
  if (!selectedDate) {
    return null;
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 0 }, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#f7f9fc',
        borderRadius: '10px',
        p: 2.5,
        border: '1px solid #eaf2f8',
        boxShadow: 'none',
        transition: 'box-shadow 0.3s, transform 0.3s, border-color 0.3s',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
          borderColor: 'transparent'
        }
      }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: 'rgba(23, 74, 124, 0.1)',
          color: '#103a61',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.2rem',
          fontWeight: 700,
          mr: 2,
          flexShrink: 0
        }}>
          DD
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography noWrap variant="subtitle1" sx={{ fontWeight: 600, color: '#34495e' }}>
            Princ... of Debashis Das...
          </Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
            Patient No : 1
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          sx={{
            color: '#174a7c',
            borderColor: '#b0c4de',
            fontWeight: 600,
            borderRadius: '8px',
            minWidth: 80,
            textTransform: 'none',
            fontSize: '0.8rem',
            px: 2,
            ml: 1,
            '&:hover': {
              bgcolor: 'rgba(23, 74, 124, 0.04)',
              borderColor: '#174a7c'
            },
          }}
        >
          Slot 2
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#174a7c',
            color: 'white',
            fontWeight: 600,
            borderRadius: '8px',
            minWidth: 100,
            textTransform: 'none',
            fontSize: '0.8rem',
            px: 2,
            ml: 1,
            '&:hover': {
              bgcolor: '#103a61'
            },
          }}
        >
          View Profile
        </Button>
      </Box>
    </Box>
  );
};

export default AppointmentDetails; 