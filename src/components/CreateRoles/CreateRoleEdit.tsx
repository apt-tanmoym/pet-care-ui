import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
} from '@mui/material';

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

interface CreateRoleEditProps {
  role: {
    roleGroupName: string;
    roleName: string;
    status: string;
  };
  onSubmit: (data: any) => void;
}

const CreateRoleEdit: React.FC<CreateRoleEditProps> = ({ role, onSubmit }) => {
  const [formValues, setFormValues] = useState({
    roleGroupName: role?.roleGroupName || '',
    roleName: role?.roleName || '',
    status: role?.status || 'Active',
  });

  const [errors, setErrors] = useState({
    roleGroupName: '',
    roleName: '',
    status: '',
  });

  useEffect(() => {
    if (role) {
      setFormValues({
        roleGroupName: role.roleGroupName,
        roleName: role.roleName,
        status: role.status,
      });
    }
  }, [role]);

  const validationRules = {
    roleGroupName: (value: string) => (value ? '' : 'Role Group Name is required'),
    roleName: (value: string) => (value ? '' : 'Role Name is required'),
    status: (value: string) => (value ? '' : 'Status is required'),
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: unknown } }
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 600,
        mx: 'auto',
        bgcolor: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledTextField
            label="Role Group Name"
            name="roleGroupName"
            value={formValues.roleGroupName}
            onChange={handleChange}
            required
            error={!!errors.roleGroupName}
            helperText={errors.roleGroupName}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledTextField
            label="Role Name"
            name="roleName"
            value={formValues.roleName}
            onChange={handleChange}
            required
            error={!!errors.roleName}
            helperText={errors.roleName}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!errors.status}>
            <InputLabel sx={{ color: '#0288d1' }}>Status</InputLabel>
            <Select
              name="status"
              value={formValues.status}
              onChange={handleChange}
              label="Status"
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
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            {errors.status && (
              <Typography variant="caption" color="error">
                {errors.status}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateRoleEdit;
