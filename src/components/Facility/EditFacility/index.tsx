import React, { useState, useRef, useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Select,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Paper
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { HexColorPicker } from 'react-colorful';
import { FaclityServiceResponse } from '@/interfaces/facilityInterface';

type Facility = {
  name: string;
  address: string;
  contact: string;
  pin: string;
  email: string;
  phone: string;
  plan?: string;
  status: string;
};

type EditFacilityProps = {
  facility: FaclityServiceResponse;
};

function EditFacility({ facility }: EditFacilityProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState('#1a365d');
  const [hexInput, setHexInput] = useState('#1a365d');
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    }

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

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

  const handleColorChange = (color: string) => {
    setThemeColor(color);
  };

  const handleHexInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHexInput(value);
    
    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(value)) {
      setThemeColor(value);
    }
  };

  const handleHexInputBlur = () => {
    // Reset to last valid color if input is invalid
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexInput)) {
      setHexInput(themeColor);
    }
  };

  // Update hexInput when themeColor changes from picker
  useEffect(() => {
    setHexInput(themeColor);
  }, [themeColor]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required disabled>
            <InputLabel>No of Doctors</InputLabel>
            <Select defaultValue="2-10" label="No of Doctors">
              <MenuItem value="1">Only 1 Doctor</MenuItem>
              <MenuItem value="2-10">From 2 to 10 Doctors</MenuItem>
              <MenuItem value="10+">More than 10 Doctors</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Name"
            disabled
            fullWidth
            defaultValue={facility.facilityName}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Address Line1"
            fullWidth
            defaultValue={facility.address1}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Address Line2" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Contact Phone(1)"
            fullWidth
            defaultValue={facility.firstContactNo}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Contact Email(1)"
            fullWidth
            defaultValue={facility.firstContactEmail}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Contact Phone(2)" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Contact Email(2)" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Contact Person"
            fullWidth
            defaultValue={facility.contactPersonName}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              defaultValue={facility?.status?.toLowerCase()}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField required label="City" fullWidth defaultValue="Kolkata" />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField required label="Area" fullWidth defaultValue="Salt Lake" />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField required label="PIN" fullWidth defaultValue={facility.pin} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField required label="State" fullWidth defaultValue="West Bengal" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField required label="Country" fullWidth defaultValue="India" />
        </Grid>

        {/* Image Upload and Color Picker in one row */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mt: 2, 
              border: '1px solid #e0e0e0',
              borderRadius: 2
            }}
          >
            <Grid container spacing={2} alignItems="center">
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
                      Facility Image
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      Recommended size: 200x200px
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ position: 'relative' }} ref={colorPickerRef}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      sx={{
                        width: 80,
                        height: 80,
                        minWidth: 80,
                        borderColor: themeColor,
                        color: themeColor,
                        p: 0,
                        '&:hover': {
                          borderColor: themeColor,
                          backgroundColor: `${themeColor}10`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: themeColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      />
                    </Button>
                    {showColorPicker && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          zIndex: 1000,
                          mt: 1,
                          p: 2,
                          backgroundColor: 'white',
                          borderRadius: 1,
                          boxShadow: 3,
                        }}
                      >
                        <HexColorPicker color={themeColor} onChange={handleColorChange} />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                      Select Color
                    </Typography>
                    <TextField
                      size="small"
                      value={hexInput}
                      onChange={handleHexInputChange}
                      onBlur={handleHexInputBlur}
                      placeholder="#000000"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: 32,
                          fontSize: '0.875rem',
                          '& input': {
                            padding: '4px 8px',
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EditFacility;
