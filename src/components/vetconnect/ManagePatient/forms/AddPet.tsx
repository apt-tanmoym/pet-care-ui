import React, { useState } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



function AddPet() {

    const [checked, setChecked] = useState(true);
    const handleIsTrained = (_event: React.SyntheticEvent, checked: boolean) => {
        setChecked(checked);
      };
  
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
            <TextField
                required
                label="Pet Name"
                fullWidth
            />
        </Grid>

        <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      
      <DatePicker slotProps={{ textField: { fullWidth: true } }} label="DOB"  defaultValue={dayjs('2022-04-17')} />
   
    </LocalizationProvider> 
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Type Of Animal"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Living Enviorment"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="About"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12}>
        <FormControlLabel
          control={<Switch color="primary" />}
          label="Traning Done"
          labelPlacement="start"
          checked={checked} 
          onChange={handleIsTrained}
        />
        </Grid>
        {checked &&(
            <>
        <Grid item xs={12} sm={6}>
          <TextField label="Traning School" required fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Trainer Name" required fullWidth />
        </Grid>

        <Grid item xs={12} sm={12}>
          <TextField
            label="Traning Details"
            rows={4}
            multiline
            fullWidth
          />
        </Grid>
        </>
        )}
      </Grid>

    </Box>
  );
}

export default AddPet;
