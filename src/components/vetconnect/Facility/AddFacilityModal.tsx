import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Switch,
  Box,
  FormGroup
} from '@mui/material';

interface FacilityFormData {
  firstName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  area: string;
  pin: string;
  fees: string;
}

interface FacilityFormProps {
  open: boolean;
  handleClose: () => void;
  facilityType: string;
  initialData?: FacilityFormData;
  onSubmit: (data: FacilityFormData & {
    facilityType: string;
    isFeeVisible: boolean;
    isBillingEnabled: boolean;
  }) => void;
}

const AddFacility: React.FC<FacilityFormProps> = ({
  open,
  handleClose,
  facilityType,
  initialData,
  onSubmit,
}) => {
  const [isFeeVisible, setIsFeeVisible] = useState(false);
  const [isBillingEnabled, setIsBillingEnabled] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FacilityFormData>({
    defaultValues: initialData || {
      firstName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      area: '',
      pin: '',
      fees: '',
    },
    mode: 'onChange',
  });

  const handleFormSubmit = (data: FacilityFormData) => {
    onSubmit({
      ...data,
      facilityType,
      isFeeVisible,
      isBillingEnabled,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#0c3c69', color: 'white', py: 2, px: 3 }}>
        <Typography variant="h6">Add New Facility ({facilityType})</Typography>
      </DialogTitle>
      <DialogContent>
        <form id="facility-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Controller
                name="firstName"
                control={control}
                rules={{
                  required: 'First Name is required',
                  pattern: {
                    value: /^[A-Za-z\s]{2,}$/,
                    message:
                      'Only letters and spaces allowed, minimum 2 characters',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name *"
                    fullWidth
                    variant="outlined"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="addressLine1"
                control={control}
                rules={{
                  required: 'Address Line 1 is required',
                  pattern: {
                    value: /^[A-Za-z0-9\s,.-]{5,}$/,
                    message:
                      'Minimum 5 characters, letters, numbers, spaces, commas, periods, or hyphens',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address Line 1 *"
                    fullWidth
                    variant="outlined"
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="addressLine2"
                control={control}
                rules={{
                  pattern: {
                    value: /^[A-Za-z0-9\s,.-]*$/,
                    message:
                      'Letters, numbers, spaces, commas, periods, or hyphens only',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address Line 2"
                    fullWidth
                    variant="outlined"
                    error={!!errors.addressLine2}
                    helperText={errors.addressLine2?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="city"
                control={control}
                rules={{
                  required: 'City is required',
                  pattern: {
                    value: /^[A-Za-z\s]{2,}$/,
                    message:
                      'Only letters and spaces allowed, minimum 2 characters',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="City *"
                    fullWidth
                    variant="outlined"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="area"
                control={control}
                rules={{
                  required: 'Area is required',
                  pattern: {
                    value: /^[A-Za-z\s]{2,}$/,
                    message:
                      'Only letters and spaces allowed, minimum 2 characters',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Area *"
                    fullWidth
                    variant="outlined"
                    error={!!errors.area}
                    helperText={errors.area?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="pin"
                control={control}
                rules={{
                  required: 'PIN is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Must be exactly 6 digits',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="PIN *"
                    fullWidth
                    variant="outlined"
                    error={!!errors.pin}
                    helperText={errors.pin?.message || 'Enter 6-digit PIN'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="fees"
                control={control}
                rules={{
                  required: 'Fees is required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message:
                      'Must be a valid amount (e.g., 100 or 100.00)',
                  },
                  validate: (value) =>
                    parseFloat(value) > 0 || 'Fees must be greater than 0',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fees *"
                    fullWidth
                    variant="outlined"
                    error={!!errors.fees}
                    helperText={
                      errors.fees?.message ||
                      'Enter amount (e.g., 100 or 100.00)'
                    }
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Toggle switches */}
          <Box mt={4}>
            <FormGroup>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={{ mr: 2 }}>
                  This Fees will be displayed to be viewed by patients
                </Typography>
                <Box display="flex" alignItems="center" ml="auto">
                  <Typography>No</Typography>
                  <Switch
                    checked={isFeeVisible}
                    onChange={() => setIsFeeVisible(!isFeeVisible)}
                    color="error"
                    sx={{ mx: 1 }}
                  />
                  <Typography>Yes</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography sx={{ mr: 2 }}>
                  Would you also like to use it to generate and track bills?
                </Typography>
                <Box display="flex" alignItems="center" ml="auto">
                  <Typography>No</Typography>
                  <Switch
                    checked={isBillingEnabled}
                    onChange={() => setIsBillingEnabled(!isBillingEnabled)}
                    color="error"
                    sx={{ mx: 1 }}
                  />
                  <Typography>Yes</Typography>
                </Box>
              </Box>
            </FormGroup>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          type="submit"
          form="facility-form"
          color="primary"
          variant="contained"
          disabled={Object.keys(errors).length > 0}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFacility;
