"use client";
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import TableLinkButton from '@/components/common/buttons/TableLinkButton';
import CommonTable from '@/components/common/table/Table';
import PrivateRoute from '@/components/PrivateRoute';
import React, { useState } from 'react';
import EditIcon from "@mui/icons-material/Edit";
import SellIcon from '@mui/icons-material/Sell';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import UserDetailsForm from '@/components/UserDetailsForm/UserDetails';
import ManageUsersEdit from '@/components/UserDetailsForm/ManageUsersEdit';
import AssignUserPrivilegeModal from '@/components/MaintainOtherUsers/AssignUserPrivilegeModal';
import DoctorDetailsModal from '@/components/MaintainDoctors/DoctorDetailsModal';
import DoctorSelfConfirmModal from '@/components/MaintainDoctors/DoctorSelfConfirmModal';
import { Box, Button, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const ManageUsersPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'assign' | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [privilegeModalOpen, setPrivilegeModalOpen] = useState(false);
  const [privilegeUser, setPrivilegeUser] = useState<any>(null);
  
  // Doctor modal states
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selfConfirmOpen, setSelfConfirmOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingDoctor, setPendingDoctor] = useState<any>(null);
  const [showFullDoctorForm, setShowFullDoctorForm] = useState(false);
  const [fullDoctorData, setFullDoctorData] = useState<any>(null);
  
  // Doctor edit modal states
  const [editDoctorModalOpen, setEditDoctorModalOpen] = useState(false);
  const [editDoctorData, setEditDoctorData] = useState<any>(null);

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
            text="Assign User Privilege"
            icon={<SellIcon />}
            color="primary"
            customColor="#174a7c"
            onClick={() => handleAssignClick({
              id: 1,
              firstName: 'Partha',
              lastName: 'Test1',
              image: 'https://via.placeholder.com/50',
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
            text="Assign User Privilege"
            icon={<SellIcon />}
            color="primary"
            customColor="#174a7c"
            onClick={() => handleAssignClick({
              id: 2,
              firstName: 'Test',
              lastName: 'User2',
              image: 'https://via.placeholder.com/50',
            })}
          />
        </>
      ),
    },
    {
      image: 'https://via.placeholder.com/50',
      name: 'Dr. Sarah Johnson',
      phone: '9876543210',
      email: 'sarah.johnson@example.com',
      status: 'Active',
      facility: 'Test One',
      role: 'Doctor',
      editAction: (
        <>
          <TableLinkButton
            text="Edit"
            icon={<EditIcon />}
            onClick={() => handleEditClick({
              title: 'Dr.',
              firstName: 'Sarah',
              lastName: 'Johnson',
              email: 'sarah.johnson@example.com',
              phone: '9876543210',
              addressLine1: '789 Medical Center Dr',
              addressLine2: 'Suite 101',
              city: 'Bangalore',
              area: 'Koramangala',
              country: 'India',
              state: 'Karnataka',
              pin: '560034',
              cellNo: '9876543210',
              username: 'dr.sarah',
              image: 'https://via.placeholder.com/50',
              status: 'Active',
              facility: 'Test One',
              role: 'Doctor',
            })}
          />
          <TableLinkButton
            text="Assign User Privilege"
            icon={<SellIcon />}
            color="primary"
            customColor="#174a7c"
            onClick={() => handleAssignClick({
              id: 3,
              firstName: 'Sarah',
              lastName: 'Johnson',
              image: 'https://via.placeholder.com/50',
            })}
          />
        </>
      ),
    },
  ];

  const filters = [
    { name: 'status', options: ['Active', 'Inactive'], value: '' },
    { name: 'facility', options: ['Test One', 'Test Two'], value: '' },
    { name: 'role', options: ['Paramedic', 'Admin Staff', 'Administrator', 'Doctor'], value: '' },
  ];

  const handleEditClick = (user: any) => {
    // Check if the user role is Doctor
    if (user.role === 'Doctor') {
      setEditDoctorData(user);
      setEditDoctorModalOpen(true);
    } else {
      setSelectedUser(user);
      setDialogMode('edit');
      setOpenDialog(true);
    }
  };

  const handleAssignClick = (user: any) => {
    setPrivilegeUser(user);
    setPrivilegeModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setDialogMode('add');
    setOpenDialog(true);
  };

  const handleAddDoctorClick = () => {
    setDetailsOpen(true);
    setSelfConfirmOpen(true);
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
    console.log(`Assigning privileges to ${privilegeUser?.firstName} ${privilegeUser?.lastName}:`, data);
    setPrivilegeModalOpen(false);
  };

  const getDialogTitle = () => {
    switch (dialogMode) {
      case 'add':
        return 'Add New User';
      case 'edit':
        return 'Edit User';
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
      default:
        return null;
    }
  };

  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 1, 
              fontWeight: 600, 
              color: '#174a7c'
            }}
          >
            Manage User Accounts & Permission
          </Typography>
        </Box>
        
        {/* Action Buttons */}
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs={12} md={9}>
            {/* Search and filters will be handled by CommonTable */}
          </Grid>
          <Grid item xs={12} md={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                sx={{ 
                  bgcolor: '#174a7c', 
                  minWidth: '220px', 
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(23, 74, 124, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#0a3761',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(23, 74, 124, 0.4)',
                  }
                }}
                startIcon={<LocalHospitalIcon />}
                onClick={handleAddDoctorClick}
              >
                Add New Doctor
              </Button>
              <Button
                variant="contained"
                sx={{ 
                  bgcolor: '#174a7c', 
                  minWidth: '220px', 
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(23, 74, 124, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#0a3761',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(23, 74, 124, 0.4)',
                  }
                }}
                startIcon={<PersonAddIcon />}
                onClick={handleAddClick}
              >
                Add New User
              </Button>
            </Grid>
          </Grid>

        {/* Enhanced Table Container */}
        <Box 
          sx={{ 
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(23, 74, 124, 0.1)',
            border: '1px solid rgba(23, 74, 124, 0.08)',
            overflow: 'hidden'
          }}
        >
          <CommonTable
            heading=""
            showSearch={true}
            showFilterButton={false}
            showAddButton={false}
            filterButtonLabel="Filter User"
            addButtonLabel="Add New User"
            colHeaders={colHeaders}
            rowData={rowData}
            rowsPerPageOptions={[5, 10]}
            filters={filters}
            openDialog={openDialog}
            handleClose={handleClose}
            title={getDialogTitle()}
            dialogWidth="md"
            onAddButtonClick={handleAddClick}
            hideDefaultButtons={false}
          >
            {renderDialogContent()}
          </CommonTable>
        </Box>

        {/* Assign User Privilege Modal */}
        {privilegeModalOpen && privilegeUser && (
          <AssignUserPrivilegeModal
            open={privilegeModalOpen}
            onClose={() => setPrivilegeModalOpen(false)}
            user={{
              id: privilegeUser.id,
              firstName: privilegeUser.firstName,
              lastName: privilegeUser.lastName,
              image: privilegeUser.image,
            }}
            onSubmit={handleAssignSubmit}
          />
        )}

        {/* Doctor Edit Modal */}
        {editDoctorModalOpen && (
          <DoctorDetailsModal
            open={editDoctorModalOpen}
            onClose={() => setEditDoctorModalOpen(false)}
            mode="full"
            initialData={editDoctorData}
            onSubmit={(data) => {
              setEditDoctorModalOpen(false);
              // TODO: handle update logic
              console.log('Updated doctor data:', data);
            }}
          />
        )}

        {/* Doctor Modals */}
        <DoctorDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          onProceed={(doctorData) => {
            // Simulate not found logic
            setPendingDoctor(doctorData);
            setShowConfirmDialog(true);
            setDetailsOpen(false);
          }}
        />
        <DoctorSelfConfirmModal
          open={selfConfirmOpen}
          onYes={() => setSelfConfirmOpen(false)}
          onNo={() => { setSelfConfirmOpen(false); setDetailsOpen(false); }}
        />
        <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
          <DialogTitle sx={{ bgcolor: '#174a7c', color: 'white', fontWeight: 'bold' }}>
            Doctor Details
          </DialogTitle>
          <DialogContent sx={{ minWidth: 400, textAlign: 'center', py: 4 }}>
            <div>Hi! your entered medical details are not found in our database. Do you want to change or proceed with it ?</div>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button variant="contained" sx={{ bgcolor: '#174a7c', mr: 2 }} onClick={() => setShowConfirmDialog(false)}>
              Yes, Change
            </Button>
            <Button variant="contained" sx={{ bgcolor: '#174a7c' }} onClick={() => {
              setShowConfirmDialog(false);
              setFullDoctorData(pendingDoctor);
              setShowFullDoctorForm(true);
            }}>
              Proceed anyway
            </Button>
          </DialogActions>
        </Dialog>
        {showFullDoctorForm && (
          <DoctorDetailsModal
            open={showFullDoctorForm}
            onClose={() => setShowFullDoctorForm(false)}
            mode="full"
            initialData={fullDoctorData}
            onSubmit={(data) => {
              setShowFullDoctorForm(false);
              // TODO: handle save
              console.log('Full doctor data:', data);
            }}
          />
        )}
      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default ManageUsersPage;