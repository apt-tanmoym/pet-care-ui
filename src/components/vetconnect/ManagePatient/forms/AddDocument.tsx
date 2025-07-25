import React, { useState } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Select,
  InputLabel,
  FormControl,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUpload } from '@mui/icons-material';



function AddDocument() {

  
    const [previewImage, setPreviewImage] = useState<string | null>(null);
      const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
  
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
       
        <Grid item xs={12} sm={12}>
        <FormControl fullWidth required>
            <InputLabel>Record Type</InputLabel>
            <Select
              label="Record Type"
            >
              <MenuItem value="prescription">Prescription</MenuItem>
              <MenuItem value="pathalogyReport">Pathalogy Report</MenuItem>
              <MenuItem value="radiologyReport">Radiology Report</MenuItem>
              <MenuItem value="referrals">Referrals</MenuItem>
              <MenuItem value="referrals">Others</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Name Of The Document"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      
      <DatePicker slotProps={{ textField: { fullWidth: true } }} label="DOB"  defaultValue={dayjs()} />
   
    </LocalizationProvider> 
        </Grid>

        <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="facility-image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="facility-image-upload">
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        '&:hover': {
                          backgroundColor: 'rgba(26, 54, 93, 0.04)',
                        },
                      }}
                    >
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Facility preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <CloudUpload sx={{ color: '#1a365d', fontSize: 24 }} />
                      )}
                    </Box>
                  </label>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                      Pet Document
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      Maximum size: 5mb
                    </Typography>
                  </Box>
                </Box>
              </Grid>
        
      </Grid>

    </Box>
  );
}

export default AddDocument;
