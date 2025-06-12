import React, { useState } from 'react';
import CommonTable from '../common/table/Table';
import MaintainForm from './MaintainForm';
import EditIcon from "@mui/icons-material/Edit";
import TableLinkButton from '../common/buttons/TableLinkButton';
import rawMaintainData from '../../data/data.json';

interface Maintain {
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

const initialMaintain: Maintain[] = rawMaintainData.map((maintain, index) => ({
  ...maintain,
  id: index + 1,
}));

const MaintainTable: React.FC = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editData, setEditData] = useState<Maintain | null>(null);
  const [maintains, setMaintains] = useState<Maintain[]>(initialMaintain);

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

  const handleEditClick = (maintain: Maintain) => {
    setEditData(maintain);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditData(null);
  };

  const handleFormSubmit = (data: Omit<Maintain, 'id'>) => {
    if (editData) {
      setMaintains(maintains.map(maintain =>
        maintain.id === editData.id ? { ...maintain, ...data, id: editData.id } : maintain
      ));
    } else {
      const newId = maintains.length > 0
        ? Math.max(...maintains.map(m => m.id)) + 1
        : 1;
      setMaintains([...maintains, { ...data, id: newId }]);
    }
    handleClose();
  };

  return (
    <CommonTable
      heading="Maintain Corporate of Test11"
      showSearch={true}
      showAddButton={true}
      showFilterButton={false}
      addButtonLabel="Add New Corporate"
      filterButtonLabel="Filter"
      filters={filters}
      colHeaders={colHeaders}
      rowData={maintains.map(maintain => ({
        ...maintain,
        action: (
          <TableLinkButton
            text="Edit"
            icon={<EditIcon />}
            color="primary"
            onClick={() => handleEditClick(maintain)}
          />
        ),
      }))}
      rowsPerPageOptions={[10, 25, 50]}
      openDialog={openDialog}
      handleClose={handleClose}
      onAddButtonClick={handleAddClick}
      dialogWidth="md"
      title={editData ? "Edit Maintenance Record" : "Add Maintenance Record"}
    >
      <MaintainForm
        initialData={editData ?? undefined}
        onSubmit={handleFormSubmit}
      />
    </CommonTable>
  );
};

export default MaintainTable;