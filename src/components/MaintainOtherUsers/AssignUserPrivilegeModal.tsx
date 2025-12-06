import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { 
  getAssignedFacilities, 
  AssignedFacility, 
  getAllRolesOfFacility,
  FacilityRole,
  getAllPrivsOfRoleInOrg,
  RolePrivilege,
  saveUserPrivileges
} from '@/services/userService';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  image?: string;
  isDoctor?: number; // 0 or 1
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (data: { facility: string; roles: string[]; privileges: string[] }) => void;
}

const AssignUserPrivilegeModal: React.FC<Props> = ({ open, onClose, user, onSubmit }) => {
  const [facilities, setFacilities] = useState<AssignedFacility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<AssignedFacility | null>(null);
  const [roles, setRoles] = useState<FacilityRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [privileges, setPrivileges] = useState<RolePrivilege[]>([]);
  const [loadingPrivileges, setLoadingPrivileges] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Fetch facilities when modal opens
  useEffect(() => {
    if (open && user.id) {
      const fetchFacilities = async () => {
        setLoadingFacilities(true);
        try {
          const response = await getAssignedFacilities(user.id.toString());
          // Ensure response is an array
          if (Array.isArray(response)) {
            setFacilities(response);
          } else {
            console.error('Invalid response format - expected array:', response);
            setFacilities([]);
          }
        } catch (error) {
          console.error('Error fetching assigned facilities:', error);
          setFacilities([]);
        } finally {
          setLoadingFacilities(false);
        }
      };
      fetchFacilities();
    } else {
      // Reset facilities when modal closes
      setFacilities([]);
    }
  }, [open, user.id]);

  // Fetch roles when facility is selected
  useEffect(() => {
    if (selectedFacility && user.id) {
      const fetchRoles = async () => {
        setLoadingRoles(true);
        setSelectedPrivileges([]);
        setPrivileges([]);
        
        try {
          // Fetch all roles for the facility based on user type (Doctor/Non-Doctor)
          // This API returns the saved/selected roles for this user and facility
          const isDoctor = user.isDoctor === 1;
          const facilityRoles = await getAllRolesOfFacility(
            selectedFacility.facilityId.toString(),
            isDoctor
          );
          setRoles(facilityRoles);
          
          // Auto-select the roles returned by the API (these are the saved roles)
          const savedRoleNames = facilityRoles.map(role => role.roleName);
          setSelectedRoles(savedRoleNames);
        } catch (error) {
          console.error('Error fetching facility roles:', error);
          setRoles([]);
          setSelectedRoles([]);
        } finally {
          setLoadingRoles(false);
        }
      };
      fetchRoles();
    } else {
      setRoles([]);
      setPrivileges([]);
      setSelectedRoles([]);
      setSelectedPrivileges([]);
    }
  }, [selectedFacility, user.id, user.isDoctor]);

  // Fetch privileges when roles are selected
  useEffect(() => {
    if (selectedFacility && selectedRoles.length > 0 && roles.length > 0) {
      const fetchPrivileges = async () => {
        setLoadingPrivileges(true);
        
        try {
          // Get orgRoleId for selected role names
          const selectedRoleIds = roles
            .filter(role => selectedRoles.includes(role.roleName))
            .map(role => role.orgRoleId);
          
          if (selectedRoleIds.length > 0) {
            // This API returns the saved/selected privileges for the selected roles
            const privilegesResponse = await getAllPrivsOfRoleInOrg(
              selectedFacility.facilityId.toString(),
              selectedRoleIds
            );
            setPrivileges(privilegesResponse);
            
            // Pre-select ALL privileges returned by the API (these are the saved privileges)
            const savedPrivilegeNames = privilegesResponse.map(priv => priv.menuName);
            setSelectedPrivileges(savedPrivilegeNames);
          } else {
            setPrivileges([]);
            setSelectedPrivileges([]);
          }
        } catch (error) {
          console.error('Error fetching privileges for selected roles:', error);
          setPrivileges([]);
          setSelectedPrivileges([]);
        } finally {
          setLoadingPrivileges(false);
        }
      };
      fetchPrivileges();
    } else if (selectedRoles.length === 0) {
      // Clear privileges when no roles are selected
      setPrivileges([]);
      setSelectedPrivileges([]);
    }
  }, [selectedRoles, selectedFacility, roles]);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handlePrivilegeToggle = (priv: string) => {
    setSelectedPrivileges((prev) =>
      prev.includes(priv) ? prev.filter((p) => p !== priv) : [...prev, priv]
    );
  };

  const handleFacilitySelect = (facility: AssignedFacility) => {
    setSelectedFacility(facility);
  };

  const handleSave = async () => {
    if (!selectedFacility) {
      setSnackbar({
        open: true,
        message: 'Please select a facility',
        severity: 'error'
      });
      return;
    }

    if (selectedRoles.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one role',
        severity: 'error'
      });
      return;
    }

    setIsSaving(true);
    try {
      // Map ONLY selected role names to role IDs (filter ensures only checked roles are included)
      const facilityRoleIds = roles
        .filter(role => selectedRoles.includes(role.roleName))
        .map(role => ({
          facilityId: selectedFacility.facilityId,
          roleId: role.orgRoleId
        }));

      // Map ONLY selected privilege menu names to privilege IDs (filter ensures only checked privileges are included)
      const facilityPrivIds = privileges
        .filter(priv => selectedPrivileges.includes(priv.menuName))
        .map(priv => ({
          facilityId: selectedFacility.facilityId,
          privilegeId: priv.privilegeId
        }));

      // Log for debugging - verify only selected items are being sent
      console.log('Saving user privileges:', {
        facilityId: selectedFacility.facilityId,
        selectedRolesCount: selectedRoles.length,
        selectedPrivilegesCount: selectedPrivileges.length,
        facilityRoleIds: facilityRoleIds.map(fr => `${fr.facilityId}_${fr.roleId}`).join(','),
        facilityPrivIds: facilityPrivIds.map(fp => `${fp.facilityId}_${fp.privilegeId}`).join(','),
      });

      // Call the API (using 'edit' mode as default - can handle both add and edit)
      const response = await saveUserPrivileges(
        user.id.toString(),
        [selectedFacility.facilityId],
        facilityRoleIds,
        facilityPrivIds,
        'edit' // Using 'edit' mode as default
      );

      setSnackbar({
        open: true,
        message: response.message || 'Role and Privilege Saved Successfully!',
        severity: 'success'
      });

      // Call the onSubmit callback if provided
      onSubmit({
        facility: selectedFacility.facilityName,
        roles: selectedRoles,
        privileges: selectedPrivileges,
      });

      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving user privileges:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save role and privilege. Please try again.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: '#174a7c', color: 'white', fontWeight: 'bold' }}>
        ASSIGN USER PRIVILEGE
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
          <Typography variant="subtitle1" sx={{ flex: 1 }}>
            Privilege management for {user.firstName} {user.lastName} [Employee Id: {user.id}]
          </Typography>
          <Avatar src={user.image} sx={{ width: 56, height: 56, bgcolor: '#e0e0e0' }} />
        </Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
          ** Please select only one facility at a time
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          {/* Facility List */}
          <Paper sx={{ flex: 1, minHeight: 300, p: 1, boxShadow: 3 }}>
            <Typography fontWeight="bold" mb={1}>Choose Facility :</Typography>
            {loadingFacilities ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress />
              </Box>
            ) : !Array.isArray(facilities) || facilities.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No facilities assigned to this user
                </Typography>
              </Box>
            ) : (
              <List>
                {facilities.map((facility) => (
                  <ListItem
                    key={facility.facilityId}
                    button
                    selected={selectedFacility?.facilityId === facility.facilityId}
                    onClick={() => handleFacilitySelect(facility)}
                  >
                    <ListItemText primary={facility.facilityName} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
          {/* Roles List */}
          <Paper sx={{ flex: 1, minHeight: 300, p: 1, boxShadow: 3 }}>
            <Typography fontWeight="bold" mb={1}>Roles in Facility :</Typography>
            {!selectedFacility ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Please select a facility first
                </Typography>
              </Box>
            ) : loadingRoles ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress />
              </Box>
            ) : roles.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No roles available for this facility
                </Typography>
              </Box>
            ) : (
              <List>
                {roles.map((role) => (
                  <ListItem key={role.orgRoleId} dense button onClick={() => handleRoleToggle(role.roleName)}>
                    <Checkbox
                      edge="start"
                      checked={selectedRoles.includes(role.roleName)}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText primary={role.roleName} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
          {/* Privileges List */}
          <Paper sx={{ flex: 1, minHeight: 300, p: 1, boxShadow: 3 }}>
            <Typography fontWeight="bold" mb={1}>Assign Privilege :</Typography>
            {!selectedFacility ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Please select a facility first
                </Typography>
              </Box>
            ) : selectedRoles.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Please select one or more roles first
                </Typography>
              </Box>
            ) : loadingPrivileges ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress />
              </Box>
            ) : privileges.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No privileges available for selected roles
                </Typography>
              </Box>
            ) : (
              <List>
                {privileges.map((privilege) => (
                  <ListItem key={privilege.privilegeId} dense button onClick={() => handlePrivilegeToggle(privilege.menuName)}>
                    <Checkbox
                      edge="start"
                      checked={selectedPrivileges.includes(privilege.menuName)}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText primary={privilege.menuName} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pr: 4, pb: 2 }}>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          sx={{ bgcolor: '#174a7c' }}
          disabled={isSaving || !selectedFacility || selectedRoles.length === 0}
          startIcon={isSaving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : null}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ bgcolor: '#174a7c' }}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </DialogActions>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AssignUserPrivilegeModal; 