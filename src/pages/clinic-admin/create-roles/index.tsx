'use client';

import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import TableLinkButton from "@/components/common/buttons/TableLinkButton";
import CommonTable from "@/components/common/table/Table";
import PrivateRoute from "@/components/PrivateRoute";
import EditIcon from "@mui/icons-material/Edit";
import SellIcon from '@mui/icons-material/Sell';
import { useState } from "react";
import CreateRoleAdd from "@/components/CreateRoles/CreateRollAdd";
import CreateRoleEdit from "@/components/CreateRoles/CreateRoleEdit";
import CreateRoleAssign from "@/components/CreateRoles/CreateRollAssign";

interface RoleData {
  roleGroupName: string;
  roleName: string;
  status: string;
  facilities: string[];
  editAction: JSX.Element;
}

export default function DemoPage() {
  const colHeaders = [
    { id: 'roleGroupName', label: 'Role Group Name' },
    { id: 'roleName', label: 'Role Name' },
    { id: 'status', label: 'Status' },
    { id: 'editAction', label: 'Action' },
  ];

  const initialRowData: RoleData[] = [
    {
      roleGroupName: 'Admin Staff',
      roleName: 'Admin Staff',
      status: 'Active',
      facilities: ['Facility A', 'Facility B'],
      editAction: <></>,
    },
    {
      roleGroupName: 'Administrator',
      roleName: 'Administrator',
      status: 'Active',
      facilities: ['Facility A', 'Facility C'],
      editAction: <></>,
    },
    {
      roleGroupName: 'Biller',
      roleName: 'Biller',
      status: 'Active',
      facilities: ['Facility B'],
      editAction: <></>,
    },
    {
      roleGroupName: 'Doctor',
      roleName: 'Doctor',
      status: 'Active',
      facilities: ['Facility C'],
      editAction: <></>,
    },
    {
      roleGroupName: 'Paramedic',
      roleName: 'Paramedic',
      status: 'Active',
      facilities: ['Facility A', 'Facility B', 'Facility C'],
      editAction: <></>,
    },
  ];

  const facilitiesList = ['Facility A', 'Facility B', 'Facility C'];
  const roleNamesOptions = ['Admin Staff', 'Administrator', 'Biller', 'Doctor', 'Paramedic'];

  const [filters, setFilters] = useState([
    { name: 'facility', options: [...facilitiesList], value: 'All Facilities' },
    { name: 'role', options: [...roleNamesOptions], value: 'All Roles' },
    { name: 'status', options: ['Active', 'Inactive'], value: 'All Status' },
  ]);

  const [rowData, setRowData] = useState<RoleData[]>(initialRowData.map(row => ({
    ...row,
    editAction: (
      <>
        <TableLinkButton
          text="Edit"
          icon={<EditIcon />}
          onClick={() => handleEditClick(row)}
        />
        <TableLinkButton
          text="Assign"
          icon={<SellIcon />}
          color="primary"
          onClick={() => handleAssignClick(row)}
        />
      </>
    ),
  })));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'assign' | null>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]); 

  const handleFilterChange = (filterName: string, value: string) => {
    const updatedFilters = filters.map(filter =>
      filter.name === filterName ? { ...filter, value } : filter
    );
    setFilters(updatedFilters);

    const filteredData = initialRowData.map(row => ({
      ...row,
      editAction: (
        <>
          <TableLinkButton
            text="Edit"
            icon={<EditIcon />}
            onClick={() => handleEditClick(row)}
          />
          <TableLinkButton
            text="Assign"
            icon={<SellIcon />}
            color="primary"
            onClick={() => handleAssignClick(row)}
          />
        </>
      ),
    })).filter(row => {
      const facilityMatch =
        updatedFilters[0].value === 'All Facilities' ||
        row.facilities.includes(updatedFilters[0].value);
      const roleMatch =
        updatedFilters[1].value === 'All Roles' ||
        `${row.roleGroupName} - ${row.roleName}` === updatedFilters[1].value;
      const statusMatch =
        updatedFilters[2].value === 'All Statuses' ||
        row.status === updatedFilters[2].value;
      return facilityMatch && roleMatch && statusMatch;
    });

    setRowData(filteredData);
  };

  const handleAddClick = () => {
    setDialogMode('add');
    setSelectedRole(null);
    setOpenDialog(true);
  };

  const handleEditClick = (role: RoleData) => {
    setSelectedRole(role);
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleAssignClick = (role: RoleData) => {
    setSelectedRole(role);
    setSelectedFacilities(role.facilities); 
    setDialogMode('assign');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedRole(null);
    setDialogMode(null);
    setSelectedFacilities([]);
  };

  const handleSubmit = (data: { roleName: string; roleGroupName: string; status?: string; facilities?: string[] }) => {
    console.log(`${dialogMode} role data:`, data);
    if (dialogMode === 'add') {
      const newRoleOption = `${data.roleGroupName} - ${data.roleName}`;
      const newRole: RoleData = {
        roleGroupName: data.roleGroupName,
        roleName: data.roleName,
        status: data.status || 'Active',
        facilities: [],
        editAction: (
          <>
            <TableLinkButton
              text="Edit"
              icon={<EditIcon />}
              onClick={() => handleEditClick({
                roleGroupName: data.roleGroupName,
                roleName: data.roleName,
                status: data.status || 'Active',
                facilities: [],
                editAction: <></>,
              })}
            />
            <TableLinkButton
              text="Assign"
              icon={<SellIcon />}
              color="primary"
              onClick={() => handleAssignClick({
                roleGroupName: data.roleGroupName,
                roleName: data.roleName,
                status: data.status || 'Active',
                facilities: [],
                editAction: <></>,
              })}
            />
          </>
        ),
      };
      setRowData([...rowData, newRole]);
      if (!roleNamesOptions.includes(newRoleOption)) {
        setFilters(filters.map(filter =>
          filter.name === 'role'
            ? { ...filter, options: ['All Roles', ...roleNamesOptions, newRoleOption] }
            : filter
        ));
      }
    } else if (dialogMode === 'assign' && selectedRole) {
      const updatedRowData = rowData.map(row =>
        row.roleName === selectedRole.roleName && row.roleGroupName === selectedRole.roleGroupName
          ? { ...row, facilities: selectedFacilities }
          : row
      );
      setRowData(updatedRowData);
    }
    handleClose();
  };

  const getDialogTitle = () => {
    switch (dialogMode) {
      case 'add':
        return 'Add New Role';
      case 'edit':
        return 'Edit Role';
      case 'assign':
        return 'Assign Facility';
      default:
        return '';
    }
  };

  const getDialogContent = () => {
    switch (dialogMode) {
      case 'add':
        return <CreateRoleAdd onSubmit={handleSubmit} />;
      case 'edit':
        return selectedRole ? <CreateRoleEdit role={selectedRole} onSubmit={handleSubmit} /> : null;
      case 'assign':
        return selectedRole ? (
          <CreateRoleAssign
            role={selectedRole}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            onFacilitiesChange={setSelectedFacilities} // Pass the handler to update facilities
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <CommonTable
          heading="Create Roles & Assign Facilities"
          showSearch={true}
          showAddButton={true}
          addButtonLabel="Add New Role"
          showFilterButton={false}
          filterButtonLabel="Filter Roles"
          filters={filters}
          onFilterChange={handleFilterChange}
          colHeaders={colHeaders}
          rowData={rowData}
          openDialog={openDialog}
          handleClose={handleClose}
          title={getDialogTitle()}
          children={getDialogContent()}
          rowsPerPageOptions={[5, 10]}
          hideDefaultButtons={false} 
          onAddButtonClick={handleAddClick}
          onSave={dialogMode === 'assign' ? () => handleSubmit({
            roleName: selectedRole?.roleName || '',
            roleGroupName: selectedRole?.roleGroupName || '',
            facilities: selectedFacilities,
          }) : undefined} 
        />
      </AuthenticatedLayout>
    </PrivateRoute>
  );
}