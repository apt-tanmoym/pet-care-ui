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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  image?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (data: { facility: string; roles: string[]; privileges: string[] }) => void;
}

const mockFacilities = ['Test1', 'Test2'];
const mockRoles: Record<string, string[]> = {
  Test1: ['Administrator2', 'Admin Staff', 'Paramedic', 'Biller'],
  Test2: ['Doctor', 'Nurse'],
};
const mockPrivileges: Record<string, string[]> = {
  Test1: [
    'Billing & Collection',
    'Charge Event',
    'Discount',
    'Doctor Paramedic Association',
    'Fees & Charges',
    'Maintain Corporates',
    'Maintain Doctors',
    'Maintain Facilities',
  ],
  Test2: [
    'Patient Management',
    'Scheduling',
    'Reports',
  ],
};

const AssignUserPrivilegeModal: React.FC<Props> = ({ open, onClose, user, onSubmit }) => {
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);

  useEffect(() => {
    if (selectedFacility) {
      setSelectedRoles([]);
      setSelectedPrivileges([]);
    }
  }, [selectedFacility]);

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

  const handleFacilitySelect = (facility: string) => {
    setSelectedFacility(facility);
  };

  const handleSave = () => {
    if (selectedFacility) {
      onSubmit({
        facility: selectedFacility,
        roles: selectedRoles,
        privileges: selectedPrivileges,
      });
    }
    onClose();
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
            <List>
              {mockFacilities.map((facility) => (
                <ListItem
                  key={facility}
                  button
                  selected={selectedFacility === facility}
                  onClick={() => handleFacilitySelect(facility)}
                >
                  <ListItemText primary={facility} />
                </ListItem>
              ))}
            </List>
          </Paper>
          {/* Roles List */}
          <Paper sx={{ flex: 1, minHeight: 300, p: 1, boxShadow: 3 }}>
            <Typography fontWeight="bold" mb={1}>Roles in Facility :</Typography>
            <List>
              {(mockRoles[selectedFacility] || []).map((role: string) => (
                <ListItem key={role} dense button onClick={() => handleRoleToggle(role)}>
                  <Checkbox
                    edge="start"
                    checked={selectedRoles.includes(role)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={role} />
                </ListItem>
              ))}
            </List>
          </Paper>
          {/* Privileges List */}
          <Paper sx={{ flex: 1, minHeight: 300, p: 1, boxShadow: 3 }}>
            <Typography fontWeight="bold" mb={1}>Assign Privilege :</Typography>
            <List>
              {(mockPrivileges[selectedFacility] || []).map((priv: string) => (
                <ListItem key={priv} dense button onClick={() => handlePrivilegeToggle(priv)}>
                  <Checkbox
                    edge="start"
                    checked={selectedPrivileges.includes(priv)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={priv} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pr: 4, pb: 2 }}>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#174a7c' }}>Save</Button>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#174a7c' }}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUserPrivilegeModal; 