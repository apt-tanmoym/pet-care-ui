"use client";
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import TableLinkButton from '@/components/common/buttons/TableLinkButton';
import CommonTable from '@/components/common/table/Table';
import PrivateRoute from '@/components/PrivateRoute';
import React, { useState } from 'react';
import EditIcon from "@mui/icons-material/Edit";
import SellIcon from '@mui/icons-material/Sell';
import UserDetailsForm from '@/components/UserDetailsForm/UserDetails';
import ManageUsersEdit from '@/components/UserDetailsForm/ManageUsersEdit';
import ManageUsersAssign from '@/components/UserDetailsForm/ManageUsersAssign';

const ManageUsersPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'assign' | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const colHeaders = [
    { id: 'image', label: 'Image' },
    { id: 'name', label: 'Name' },
    { id: 'phone', label: 'Phone' },
    { id: 'email', label: 'Email' },
    { id: 'status', label: 'Status' },
    { id: 'facility', label: 'Facility' },
    { id: 'role', label: 'Role' },
    { id: 'editAction', label: 'Action' },
  ];

  const rowData = [
    {
      image: 'https://via.placeholder.com/50',
      name: 'Partha Test1',
      phone: '9932123125',
      email: 'namosiva6@gmail.com',
      status: 'Active',
      facility: 'Test One',
      role: 'Paramedic',
      editAction: (
        <>
          <TableLinkButton
            text="Edit"
            icon={<EditIcon />}
            onClick={() => handleEditClick({
              title: 'Mr.',
              firstName: 'Partha',
              lastName: 'Test1',
              email: 'namosiva6@gmail.com',
              phone: '9932123125',
              addressLine1: '123 Main St',
              addressLine2: '',
              city: 'Mumbai',
              area: 'Andheri',
              country: 'India',
              state: 'Maharashtra',
              pin: '400001',
              cellNo: '9932123125',
              username: 'partha1',
              image: 'https://via.placeholder.com/50',
              status: 'Active',
              facility: 'Test One',
              role: 'Paramedic',
            })}
          />
          <TableLinkButton
            text="Assign"
            icon={<SellIcon />}
            color="primary"
            onClick={() => handleAssignClick({
              name: 'Partha Test1',
              role: 'Paramedic',
            })}
          />
        </>
      ),
    },
    {
      image: 'https://via.placeholder.com/50',
      name: 'Test User2',
      phone: '1234567890',
      email: 'test2@gmail.com',
      status: 'Inactive',
      facility: 'Test Two',
      role: 'Admin Staff',
      editAction: (
        <>
          <TableLinkButton
            text="Edit"
            icon={<EditIcon />}
            onClick={() => handleEditClick({
              title: 'Ms.',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@gmail.com',
              phone: '1234567890',
              addressLine1: '456 Oak St',
              addressLine2: '',
              city: 'Delhi',
              area: 'Connaught Place',
              country: 'India',
              state: 'Delhi',
              pin: '110001',
              cellNo: '1234567890',
              username: 'testuser2',
              image: 'https://via.placeholder.com/50',
              status: 'Inactive',
              facility: 'Test One',
              role: 'Admin Staff',
            })}
          />
          <TableLinkButton
            text="Assign"
            icon={<SellIcon />}
            color="primary"
            onClick={() => handleAssignClick({
              name: 'Test User2',
              role: 'Admin Staff',
            })}
          />
        </>
      ),
    },
  ];

  const filters = [
    { name: 'status', options: ['Active', 'Inactive'], value: '' },
    { name: 'facility', options: ['Test One', 'Test Two'], value: '' },
    { name: 'role', options: ['Paramedic', 'Admin Staff', 'Administrator'], value: '' },
  ];

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleAssignClick = (user: any) => {
    setSelectedUser(user);
    setDialogMode('assign');
    setOpenDialog(true);
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setDialogMode('add');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setDialogMode(null);
    setSelectedUser(null);
  };

  const handleAddSubmit = (data: any) => {
    console.log('Adding new user:', data);
    handleClose();
  };

  const handleEditSubmit = (data: any) => {
    console.log('Updating user:', data);
    handleClose();
  };

  const handleAssignSubmit = (data: any) => {
    console.log(`Assigning role to ${selectedUser?.name}:`, data);
    handleClose();
  };

  const getDialogTitle = () => {
    switch (dialogMode) {
      case 'add':
        return 'Add New User';
      case 'edit':
        return 'Edit User';
      case 'assign':
        return `Assign Role to ${selectedUser?.name}`;
      default:
        return '';
    }
  };

  const renderDialogContent = () => {
    switch (dialogMode) {
      case 'add':
        return <UserDetailsForm onSubmit={handleAddSubmit} />;
      case 'edit':
        return <ManageUsersEdit user={selectedUser} onSubmit={handleEditSubmit} onCancel={handleClose} />;
      case 'assign':
        return <ManageUsersAssign user={selectedUser} onSubmit={handleAssignSubmit} onCancel={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <CommonTable
          heading="Manage User Accounts & Permission"
          showSearch={true}
          showFilterButton={false}
          showAddButton={true}
          filterButtonLabel="Filter User"
          addButtonLabel="Add New User"
          colHeaders={colHeaders}
          rowData={rowData}
          rowsPerPageOptions={[5, 10]}
          filters={filters}
          openDialog={openDialog}
          handleClose={handleClose}
          title={getDialogTitle()}
          dialogWidth={dialogMode === 'assign' ? 'sm' : 'md'}
          onAddButtonClick={handleAddClick}
          hideDefaultButtons={false}
        >
          {renderDialogContent()}
        </CommonTable>
      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default ManageUsersPage;