import {
  Box,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

interface SelectYourFacilityProps {
  selectedFacility: string;
  setSelectedFacility: (value: string) => void;
  generateBills: boolean;
  setGenerateBills: (value: boolean) => void;
}

const SelectYourFacility = ({
  selectedFacility,
  setSelectedFacility,
  generateBills,
  setGenerateBills,
}: SelectYourFacilityProps) => {
  const [fees, setFees] = useState('');
  const [displayFees, setDisplayFees] = useState(false);

  const handleFacilityChange = (event: SelectChangeEvent<string>) => {
    setSelectedFacility(event.target.value);
  };

  const handleFeesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFees(event.target.value);
  };

  return (
    <Box
    >
      <FormControl fullWidth variant="outlined">
        <InputLabel id="facility-label">Select Facility</InputLabel>
        <Select
          labelId="facility-label"
          id="facility-select"
          value={selectedFacility}
          onChange={handleFacilityChange}
          label="Select Facility"
        >
          <MenuItem value="Tele Medicine">Facility 1</MenuItem>
          <MenuItem value="Practice">Facility 2</MenuItem>
        </Select>
      </FormControl>

      {selectedFacility && (
        <Box sx={{ mt: 3, p: 3, bgcolor: '#f5fbff', borderRadius: 3 }}>
          {/* Question 1 */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Would you also like to use it to generate and track bills?
          </Typography>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography>No</Typography>
            <Switch
              checked={generateBills}
              onChange={(e) => setGenerateBills(e.target.checked)}
              color="error"
              sx={{
                mx: 1,
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#e50914',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#e50914',
                },
              }}
            />
            <Typography>Yes</Typography>
          </Box>

          {/* Fees + Question 2 */}
          {generateBills && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Fees
              </Typography>
              <TextField
                value={fees}
                onChange={handleFeesChange}
                variant="outlined"
                fullWidth
                type="number"
                placeholder="400"
                InputProps={{
                  sx: {
                    borderRadius: 5,
                    px: 2,
                    py: 1,
                    fontSize: '1.1rem',
                  },
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 5,
                  },
                }}
              />

              {/* Question 2 */}
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                This Fees will be displayed to be viewed by patients
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography>No</Typography>
                <Switch
                  checked={displayFees}
                  onChange={(e) => setDisplayFees(e.target.checked)}
                  color="error"
                  sx={{
                    mx: 1,
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#e50914',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#e50914',
                    },
                  }}
                />
                <Typography>Yes</Typography>
              </Box>
            </Box>
          )}

          {/* Buttons */}
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              onClick={() => setSelectedFacility('')}
              sx={{
                color: '#e50914',
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                // handle update logic here
              }}
              sx={{
                bgcolor: '#0c3c69',
                color: 'white',
                px: 4,
                py: 1,
                borderRadius: 5,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#0a2f52',
                },
              }}
              endIcon={<AddIcon />}
            >
              Update
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SelectYourFacility;
