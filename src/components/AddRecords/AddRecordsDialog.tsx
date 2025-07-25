import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface AddRecordsDialogProps {
  open: boolean;
  onClose: () => void;
}

const documentTypes = [
  { label: 'Image', value: 'image' },
  { label: 'Documents', value: 'documents' },
  { label: 'Audio', value: 'audio' },
  { label: 'Video', value: 'video' },
];

const recordTypes = [
  { label: 'Pathology', value: 'pathology' },
  { label: 'Prescription', value: 'prescription' },
  { label: 'Radiology', value: 'radiology' },
  { label: 'Referrals', value: 'referrals' },
];

const pets = [
  { label: 'Sheru', value: 'sheru' },
  { label: 'Tommy', value: 'tommy' },
];

const PRIMARY_COLOR = '#174a7c';

const AddRecordsDialog: React.FC<AddRecordsDialogProps> = ({ open, onClose }) => {
  const [documentType, setDocumentType] = useState('');
  const [recordType, setRecordType] = useState('');
  const [docName, setDocName] = useState('');
  const [docDate, setDocDate] = useState<Dayjs | null>(dayjs());
  const [pet, setPet] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    // TODO: handle form submission
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Paper elevation={0} sx={{ borderRadius: 3, m: 2, p: 0, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 3, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff' }}>
            <AddCircleOutlineIcon sx={{ color: PRIMARY_COLOR, fontSize: 32, mr: 2 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: PRIMARY_COLOR }}>
              Add New Record
            </Typography>
          </Box>
          <Box sx={{ p: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              <TextField
                select
                label="Select New Record"
                value={recordType}
                onChange={e => setRecordType(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton size="small" disabled>
                        <UploadFileIcon color="primary" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              >
                {recordTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Name Of The Document"
                value={docName}
                onChange={e => setDocName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton size="small" disabled>
                        <UploadFileIcon color="primary" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <DatePicker
                label="Date of Document"
                value={docDate}
                onChange={setDocDate}
                slotProps={{ textField: { fullWidth: true, InputProps: { startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon color="primary" />
                  </InputAdornment>
                ) } } }}
              />
              <TextField
                select
                label="My Pet"
                value={pet}
                onChange={e => setPet(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton size="small" disabled>
                        <UploadFileIcon color="primary" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              >
                {pets.map(p => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ borderRadius: 2, justifySelf: 'start', width: { xs: '100%', sm: 220 } }}
              >
                Upload File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {file && (
                <Typography variant="body2" color="text.secondary">Selected: {file.name}</Typography>
              )}
            </Box>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 5,
                py: 1.2,
                fontSize: 18,
                minWidth: 180,
                fontWeight: 700,
                bgcolor: PRIMARY_COLOR,
                color: '#fff',
                '&:hover': { bgcolor: '#103a61' }
              }}
              onClick={handleConfirm}
              startIcon={<AddCircleOutlineIcon sx={{ color: '#fff' }} />}
            >
              Confirm
            </Button>
          </Box>
        </Paper>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddRecordsDialog; 