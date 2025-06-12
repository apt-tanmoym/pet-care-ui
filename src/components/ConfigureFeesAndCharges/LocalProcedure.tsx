import React, { useState } from 'react';
import {
  Box, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, IconButton, InputAdornment
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import CommonTable from '../common/table/Table';
import CummonDialog from '../common/CummonDialog';


const Container = styled(Box)(({ theme }) => ({
  padding: theme?.spacing?.(2),
  [theme?.breakpoints?.down('sm')]: {
    padding: theme?.spacing?.(1),
  },
}));

const LocalProcedure: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [source, setSource] = useState('ICD10');
  const [procedureName, setProcedureName] = useState('');
  const [price, setPrice] = useState('0.0');
  const [errors, setErrors] = useState<{ procedureName?: string; price?: string }>({});

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!procedureName.trim()) newErrors.procedureName = 'Procedure name is required';
    if (!price || isNaN(+price) || +price <= 0) newErrors.price = 'Valid price required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log({ source, procedureName, price });
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSource('ICD10');
    setProcedureName('');
    setPrice('0.0');
    setErrors({});
  };

  return (
    <Container>
      <Typography variant="caption" color="textSecondary" mb={2} display="block">
        *Local Procedure fees will be collected at confirmation of encounter consultation data
      </Typography>
      <CommonTable
        heading=""
        showSearch
        showAddButton
        showFilterButton={false}
        addButtonLabel="Add New Procedure Item"
        filterButtonLabel="Filter Procedure Item"
        colHeaders={[
          { id: 'procedureName', label: 'Procedure Name' },
          { id: 'charge', label: 'Charge' },
          { id: 'action1', label: 'Action' },
        ]}
        rowData={[]}
        rowsPerPageOptions={[5, 10, 25]}
        onAddButtonClick={() => setDialogOpen(true)}
      />
      <CummonDialog
        open={dialogOpen}
        title="Procedure Item Details"
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Procedure Item</InputLabel>
            <Select value={source} onChange={(e) => setSource(e.target.value)}>
              <MenuItem value="ICD10">From ICD10</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Search for Procedure"
            value={procedureName}
            onChange={(e) => setProcedureName(e.target.value)}
            fullWidth
            error={!!errors.procedureName}
            helperText={errors.procedureName}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton><SearchIcon /></IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            error={!!errors.price}
            helperText={errors.price}
          />
        </Box>
      </CummonDialog>
    </Container>
  );
};

export default LocalProcedure;
