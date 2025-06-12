import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Typography,
  Button,
  OutlinedInput,
} from '@mui/material';

interface CreateRoleAssignProps {
  role: {
    roleGroupName: string;
    roleName: string;
  };
  onSubmit: (data: { roleName: string; roleGroupName: string; facilities: string[] }) => void;
  onCancel: () => void;
  onFacilitiesChange: (facilities: string[]) => void;
}

const CreateRoleAssign: React.FC<CreateRoleAssignProps> = ({ role, onSubmit, onCancel, onFacilitiesChange }) => {
  const [formValues, setFormValues] = useState<{ facilities: string[] }>({
    facilities: ['Test1'],
  });

  const [errors, setErrors] = useState<{ facilities: string }>({
    facilities: '',
  });

  const facilities: string[] = ['Test1', 'Test2', 'Test3'];

  const validationRules = {
    facilities: (value: string[]) =>
      value.length > 0 ? '' : 'At least one facility is required',
  };

  const validateForm = (): boolean => {
    const newErrors = {
      facilities: validationRules.facilities(formValues.facilities),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleChange = (event: any) => {
    const value = event.target.value as string[];
    setFormValues({ facilities: value });

    const errorMsg = validationRules.facilities(value);
    setErrors({ facilities: errorMsg });

    onFacilitiesChange(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        roleName: role.roleName,
        roleGroupName: role.roleGroupName,
        facilities: formValues.facilities,
      });
    }
  };

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

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 600,
        mx: 'auto',
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        border: '1px solid #ddd',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2, color: '#0288d1' }}>
          Facility management for {role.roleName} (Role Group: {role.roleGroupName})
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.facilities}>
              <InputLabel sx={{ color: '#0288d1' }}>Facilities</InputLabel>
              <Select
                multiple
                value={formValues.facilities}
                onChange={handleChange}
                input={<OutlinedInput label="Facilities" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} sx={{ bgcolor: '#0288d1', color: 'white' }} />
                    ))}
                  </Box>
                )}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0288d1',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#01579b',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#01579b',
                    boxShadow: '0 0 8px rgba(2, 136, 209, 0.3)',
                  },
                }}
              >
                {facilities.map((facility) => (
                  <MenuItem key={facility} value={facility}>
                    {facility}
                  </MenuItem>
                ))}
              </Select>
              {errors.facilities && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.facilities}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateRoleAssign;