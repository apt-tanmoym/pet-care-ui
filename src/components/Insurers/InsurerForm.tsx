import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Grid, FormHelperText } from '@mui/material';

interface InsurerFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  contactNumber: string;
  email: string;
  status: string;
}

interface InsurerFormProps {
  initialData?: InsurerFormData;
  onSubmit: (data: InsurerFormData) => void;
}

const InsurerForm: React.FC<InsurerFormProps> = ({ initialData, onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<InsurerFormData>({
    defaultValues: initialData || {
      name: '',
      address: '',
      city: '',
      state: '',
      pin: '',
      country: '',
      contactNumber: '',
      email: '',
      status: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
  <Grid container spacing={2}>
    {/* Row 1: Name, Contact Number, Email, Status */}
    <Grid item xs={12} sm={3}>
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name *"
            fullWidth
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={3}>
      <Controller
        name="contactNumber"
        control={control}
        rules={{
          required: 'Contact number is required',
          pattern: {
            value: /^\d{10}$/,
            message: 'Contact number must be 10 digits',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Contact No. *"
            fullWidth
            variant="outlined"
            error={!!errors.contactNumber}
            helperText={errors.contactNumber?.message || 'Format: 10 digits'}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={3}>
      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: 'Invalid email address',
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email *"
            fullWidth
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={3}>
      <Controller
        name="status"
        control={control}
        rules={{ required: 'Status is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Status *"
            fullWidth
            variant="outlined"
            select
            error={!!errors.status}
            helperText={errors.status?.message}
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </TextField>
        )}
      />
    </Grid>

    {/* Row 2: City, State, PIN, Country */}
    <Grid item xs={12} sm={3}>
      <Controller
        name="city"
        control={control}
        rules={{ required: 'City is required' }}
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
    <Grid item xs={12} sm={3}>
      <Controller
        name="state"
        control={control}
        rules={{ required: 'State is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="State *"
            fullWidth
            variant="outlined"
            error={!!errors.state}
            helperText={errors.state?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={3}>
      <Controller
        name="pin"
        control={control}
        rules={{ required: 'PIN is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="PIN *"
            fullWidth
            variant="outlined"
            error={!!errors.pin}
            helperText={errors.pin?.message}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={3}>
      <Controller
        name="country"
        control={control}
        rules={{ required: 'Country is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Country *"
            fullWidth
            variant="outlined"
            error={!!errors.country}
            helperText={errors.country?.message}
          />
        )}
      />
    </Grid>

    {/* Row 3: Address (Full width) */}
    <Grid item xs={12}>
      <Controller
        name="address"
        control={control}
        rules={{ required: 'Address is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Address *"
            fullWidth
            variant="outlined"
            error={!!errors.address}
            helperText={errors.address?.message}
          />
        )}
      />
    </Grid>
  </Grid>
</form>

  );
};

export default InsurerForm;