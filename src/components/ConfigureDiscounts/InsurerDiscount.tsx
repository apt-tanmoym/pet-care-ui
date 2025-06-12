import React from 'react';
import { Box } from '@mui/material';
import CommonTable from '../common/table/Table';

export default function InsurerDiscount() {
  const insurerColumns = [
    { id: 'name', label: 'Name' },
    { id: 'action', label: 'Action' },
  ];

  const insurerData: any[] = [];

  return (
    <Box mt={3}>
      <CommonTable
        heading="Insurer Discount List"
        showSearch={false}
        showAddButton={false}
        showFilterButton={false}
        colHeaders={insurerColumns}
        rowData={insurerData}
      />
    </Box>
  );
}