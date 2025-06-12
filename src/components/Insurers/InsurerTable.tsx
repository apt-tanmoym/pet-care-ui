import React, { useState } from 'react';
import CommonTable from '../common/table/Table';
import InsurerForm from './InsurerForm';
import EditIcon from "@mui/icons-material/Edit";
import TableLinkButton from '../common/buttons/TableLinkButton';
import rawInsurersData from '../../data/data.json';

interface Insurer {
  id: number;
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

const initialInsurers: Insurer[] = rawInsurersData.map((insurer, index) => ({
  ...insurer,
  id: index + 1,
}));

const InsurerTable: React.FC = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editData, setEditData] = useState<Insurer | null>(null);
  const [insurers, setInsurers] = useState<Insurer[]>(initialInsurers);

  const colHeaders = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'contactNumber', label: 'Contact Number' },
    { id: 'status', label: 'Status' },
    { id: 'action', label: 'Action' },
  ];

  const filters = [
    {
      name: 'status',
      options: ['Active', 'Inactive'],
      value: '',
    },
  ];

  const handleAddClick = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEditClick = (insurer: Insurer) => {
    setEditData(insurer);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditData(null);
  };

  const handleFormSubmit = (data: Omit<Insurer, 'id'>) => {
    if (editData) {
      setInsurers(insurers.map(insurer =>
        insurer.id === editData.id ? { ...insurer, ...data, id: editData.id } : insurer
      ));
    } else {
      const newId = insurers.length > 0
        ? Math.max(...insurers.map(i => i.id)) + 1
        : 1;
      setInsurers([...insurers, { ...data, id: newId }]);
    }
    handleClose();
  };

  return (
    <CommonTable
      heading="Main Insurer of Test11"
      showSearch={true}
      showAddButton={true}
      showFilterButton={false}
      addButtonLabel="Add New Insurer"
      filterButtonLabel="Filter"
      filters={filters}
      colHeaders={colHeaders}
      rowData={insurers.map(insurer => ({
        ...insurer,
        action: (
          <TableLinkButton
            text="Edit"
            icon={<EditIcon />}
            color="primary"
            onClick={() => handleEditClick(insurer)}
          />
        ),
      }))}
      rowsPerPageOptions={[10, 25, 50]}
      openDialog={openDialog}
      handleClose={handleClose}
      onAddButtonClick={handleAddClick}
      dialogWidth="md"
      title={editData ? "Edit Insurer Details" : "Add Insurer Details"}
    >
      <InsurerForm
        initialData={editData ?? undefined}
        onSubmit={handleFormSubmit}
      />
    </CommonTable>
  );
};

export default InsurerTable;