import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Typography,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledTextField = ({ sx, ...props }: any) => (
  <TextField
    {...props}
    variant="outlined"
    fullWidth
    sx={{
      bgcolor: 'white',
      borderRadius: 2,
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#0288d1',
        },
        '&:hover fieldset': {
          borderColor: '#01579b',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#01579b',
          boxShadow: '0 0 8px rgba(2, 136, 209, 0.3)',
        },
      },
      ...sx,
    }}
  />
);

const StyledButton = ({ sx, ...props }: any) => (
  <Button
    {...props}
    sx={{
      borderRadius: 2,
      px: { xs: 2, sm: 3 },
      py: 1,
      fontSize: { xs: '0.75rem', sm: '0.875rem' },
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        transform: 'translateY(-2px)',
      },
      ...sx,
    }}
  />
);

interface ManageUsersEditProps {
  user: {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    area: string;
    country: string;
    state: string;
    pin: string;
    cellNo: string;
    username: string;
    image?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ManageUsersEdit: React.FC<ManageUsersEditProps> = ({ user, onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState({
    title: user.title || 'Mr.',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    addressLine1: user.addressLine1 || '',
    addressLine2: user.addressLine2 || '',
    city: user.city || '',
    area: user.area || '',
    country: user.country || '',
    state: user.state || '',
    pin: user.pin || '',
    cellNo: user.cellNo || '',
    username: user.username || '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.image || null);

  const [errors, setErrors] = useState({
    title: '',
    firstName: '',
    email: '',
    addressLine1: '',
    city: '',
    area: '',
    country: '',
    state: '',
    pin: '',
    cellNo: '',
    image: '',
  });

  const validationRules = {
    title: (value: string) => (value ? '' : 'Title is required'),
    firstName: (value: string) => (value ? '' : 'First Name is required'),
    email: (value: string) =>
      value
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ''
          : 'Invalid email format'
        : 'Email is required',
    addressLine1: (value: string) => (value ? '' : 'Address Line 1 is required'),
    city: (value: string) => (value ? '' : 'City is required'),
    area: (value: string) => (value ? '' : 'Area is required'),
    country: (value: string) => (value ? '' : 'Country is required'),
    state: (value: string) => (value ? '' : 'State is required'),
    pin: (value: string) =>
      value
        ? value.length === 6 && /^\d+$/.test(value)
          ? ''
          : 'PIN must be 6 digits'
        : 'PIN is required',
    cellNo: (value: string) =>
      value
        ? value.length === 10 && /^\d+$/.test(value)
          ? ''
          : 'Cell No. must be 10 digits'
        : 'Cell No. is required',
    image: (file: File | null, preview: string | null) => (file || preview ? '' : 'Image is required'),
  };

  // const validateForm = () => {
  //   const newErrors = Object.keys(validationRules).reduce((acc, key) => {
  //     if (key === 'image') {
  //       acc[key] = validationRules[key](image, imagePreview);
  //     } else {
  //       acc[key] = validationRules[key](formValues[key as keyof typeof formValues]);
  //     }
  //     return acc;
  //   }, {} as typeof errors);

  //   setErrors(newErrors);
  //   return !Object.values(newErrors).some((error) => error !== '');
  // };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: 'Only PNG, JPEG, or JPG files are allowed',
        }));
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          image: 'Image size must be less than 5MB',
        }));
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setImagePreview(null);
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 900,
        mx: 'auto',
        bgcolor: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        mt: 2,
        mb: 4,
      }}
    >
      <form>
        <Grid container spacing={3}>
          {/* Title, First Name, Last Name in a row */}
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth required error={!!errors.title}>
              <InputLabel sx={{ color: '#0288d1' }}>Title</InputLabel>
              <Select
                name="title"
                value={formValues.title}
                onChange={handleChange}
                label="Title"
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0288d1',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#01579b',
                  },
                }}
              >
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
                <MenuItem value="Mrs.">Mrs.</MenuItem>
              </Select>
              {errors.title && (
                <Typography variant="caption" color="error">
                  {errors.title}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={5}>
            <StyledTextField
              label="First Name"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={5}>
            <StyledTextField
              label="Last Name"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
            />
          </Grid>
          {/* Username, Email in a row */}
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              type="email"
              required
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          {/* Address Line 1, Address Line 2 in a row */}
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Address Line 1"
              name="addressLine1"
              value={formValues.addressLine1}
              onChange={handleChange}
              required
              error={!!errors.addressLine1}
              helperText={errors.addressLine1}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Address Line 2"
              name="addressLine2"
              value={formValues.addressLine2}
              onChange={handleChange}
            />
          </Grid>
          {/* City, Area in a row */}
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="City"
              name="city"
              value={formValues.city}
              onChange={handleChange}
              required
              error={!!errors.city}
              helperText={errors.city}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: '#0288d1' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Area"
              name="area"
              value={formValues.area}
              onChange={handleChange}
              required
              error={!!errors.area}
              helperText={errors.area}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: '#0288d1' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {/* Country, State in a row */}
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Country"
              name="country"
              value={formValues.country}
              onChange={handleChange}
              required
              error={!!errors.country}
              helperText={errors.country}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="State"
              name="state"
              value={formValues.state}
              onChange={handleChange}
              required
              error={!!errors.state}
              helperText={errors.state}
            />
          </Grid>
          {/* PIN, Cell No. in a row */}
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="PIN"
              name="pin"
              value={formValues.pin}
              onChange={handleChange}
              required
              error={!!errors.pin}
              helperText={errors.pin}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Cell No."
              name="cellNo"
              value={formValues.cellNo}
              onChange={handleChange}
              type="tel"
              required
              error={!!errors.cellNo}
              helperText={errors.cellNo}
            />
          </Grid>
          {/* Image Upload Section */}
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                bgcolor: '#f5f5f5',
                height: { xs: 80, sm: 90 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                border: errors.image ? '2px dashed #d32f2f' : '2px dashed #0288d1',
                '&:hover': {
                  borderColor: '#01579b',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Image Placeholder
                </Typography>
              )}
            </Box>
            {errors.image && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.image}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center' }}>
              <StyledButton
                variant="contained"
                color="primary"
                size="small"
                component="label"
                sx={{
                  bgcolor: '#0288d1',
                  '&:hover': { bgcolor: '#01579b' },
                }}
              >
                Attach Image
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  hidden
                  onChange={handleImageChange}
                />
              </StyledButton>
              {(image || imagePreview) && (
                <StyledButton
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={handleClearImage}
                  sx={{
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    '&:hover': {
                      borderColor: '#b71c1c',
                      color: '#b71c1c',
                    },
                  }}
                >
                  Clear
                </StyledButton>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ManageUsersEdit;