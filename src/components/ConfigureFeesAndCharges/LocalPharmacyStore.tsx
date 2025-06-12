import React, { useState } from 'react';
import {
  Box, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, IconButton, InputAdornment
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CommonTable from '../common/table/Table';
import CummonDialog from '../common/CummonDialog';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const LocalPharmacyStore: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [source, setSource] = useState('TrueMD');
  const [genericName, setGenericName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [unit, setUnit] = useState('');
  const [rate, setRate] = useState('0.0');
  const [errors, setErrors] = useState<{ unit?: string; rate?: string }>({});

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!unit.trim()) newErrors.unit = 'Unit is required';
    if (!rate || isNaN(+rate) || +rate <= 0) newErrors.rate = 'Valid rate required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log({ source, genericName, brandName, unit, rate });
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSource('TrueMD');
    setGenericName('');
    setBrandName('');
    setUnit('');
    setRate('0.0');
    setErrors({});
  };

  return (
    <Container>
      <Typography variant="caption" color="textSecondary" mb={2} display="block">
        *Local Pharmacy fees will be collected at confirmation of encounter consultation data
      </Typography>
      <CommonTable
        heading=""
        showSearch
        showAddButton
        showFilterButton={false}
        addButtonLabel="Add New Pharmacy Item"
        filterButtonLabel="Filter Pharmacy Item"
        colHeaders={[
          { id: 'pharmacyItemName', label: 'Pharmacy Item Name (Unit)' },
          { id: 'charge', label: 'Charge' },
          { id: 'action1', label: 'Action' },
        ]}
        rowData={[]}
        rowsPerPageOptions={[5, 10, 25]}
        onAddButtonClick={() => setDialogOpen(true)}
      />
      <CummonDialog
        open={dialogOpen}
        title="Pharmacy Item Details"
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Pharmacy Item</InputLabel>
            <Select value={source} onChange={(e) => setSource(e.target.value)}>
              <MenuItem value="TrueMD">From TrueMD</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" gap={2}>
            <TextField
              label="Generic Name"
              value={genericName}
              onChange={(e) => setGenericName(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton><SearchIcon /></IconButton>
                    {genericName && <IconButton onClick={() => setGenericName('')}><ClearIcon /></IconButton>}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Brand Name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton><SearchIcon /></IconButton>
                    {brandName && <IconButton onClick={() => setBrandName('')}><ClearIcon /></IconButton>}
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TextField
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            fullWidth
            error={!!errors.unit}
            helperText={errors.unit}
          />

          <TextField
            label="Rate"
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            fullWidth
            error={!!errors.rate}
            helperText={errors.rate}
          />
        </Box>
      </CummonDialog>
    </Container>
  );
};

export default LocalPharmacyStore;
