import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import CommonTable from '../common/table/Table';
import CummonDialog from '../common/CummonDialog';

const Container = styled(Box)(({ theme }) => ({
  padding: theme?.spacing?.(2) || '16px',
  [theme?.breakpoints?.down('sm') || '600px']: {
    padding: theme?.spacing?.(1) || '8px',
  },
}));

interface RowData {
  doctorName: string;
  consultationFee: string | number;
}

const LocalOrders: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [source, setSource] = useState('LOINC');
  const [labOrderName, setLabOrderName] = useState('');
  const [price, setPrice] = useState('0.0');
  const [errors, setErrors] = useState<{ labOrderName?: string; price?: string }>({});

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSource('LOINC');
    setLabOrderName('');
    setPrice('0.0');
    setErrors({});
  };

  const handleSubmit = () => {
    const newErrors: { labOrderName?: string; price?: string } = {};
    if (!labOrderName) {
      newErrors.labOrderName = 'Lab Order Name is required';
    }
    if (!price || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Add logic to handle form submission (e.g., save the lab order)
    handleCloseDialog();
  };

  const colHeaders = [
    { id: 'orderName', label: 'Order Name' },
    { id: 'charge', label: 'Charge' },
    { id: 'action1', label: 'Action' },
  ];

  const rowData: RowData[] = [];

  return (
    <Container>
      <Typography variant="caption" color="textSecondary" mb={2} display="block">
        *Local Order fees will be collected at confirmation of encounter consultation data
      </Typography>
      <CommonTable
        heading=""
        showSearch={true}
        showAddButton={true}
        showFilterButton={false}
        addButtonLabel="Add New Lab Order Item"
        filterButtonLabel="Filter Lab Order Item"
        colHeaders={colHeaders}
        rowData={rowData}
        rowsPerPageOptions={[5, 10, 25]}
        onAddButtonClick={handleOpenDialog}
      />
      <CummonDialog
        open={dialogOpen}
        title="Lab Order Item Details"
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        maxWidth="sm"
        submitLabel="Save"
        cancelLabel="Cancel"
        showActions={true}
      >
        <Box p={2} display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Procedure Item</InputLabel>
            <Select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              label="Procedure Item"
            >
              <MenuItem value="LOINC">From LOINC</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Search for Lab Order"
            value={labOrderName}
            onChange={(e) => setLabOrderName(e.target.value)}
            fullWidth
            required
            error={!!errors.labOrderName}
            helperText={errors.labOrderName}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
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
            required
            error={!!errors.price}
            helperText={errors.price}
          />
        </Box>
      </CummonDialog>
    </Container>
  );
};

export default LocalOrders;