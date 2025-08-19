
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import styles from './styles.module.scss';

const specialties = ['Select', 'General Medicine', 'Pediatrics', 'Surgery', 'Clinical Pathology'];

type Mode = 'short' | 'full';

interface Council {
  councilId: string;
  councilName: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  mode?: Mode;
  initialData?: any;
  councilList: Council[];
  onProceed?: (data: { councilId: string; yearOfReg: string; regNo: string }) => void;
  onSubmit?: (data: any) => void;
}

const DoctorDetailsModal: React.FC<Props> = ({ open, onClose, mode = 'short', initialData, councilList, onProceed, onSubmit }) => {
  // Shared fields
  const [councilId, setCouncilId] = useState('');
  const [yearOfReg, setYearOfReg] = useState('');
  const [regNo, setRegNo] = useState('');
  const [error, setError] = useState(false);
  const [councilError, setCouncilError] = useState('');
  const [yearError, setYearError] = useState('');
  const [regNoError, setRegNoError] = useState('');

  // Full form fields
  const [userTitle, setUserTitle] = useState('Dr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('Select');
  const [orgUserQlfn, setOrgUserQlfn] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [areaName, setAreaName] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');
  const [cellNumber, setCellNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [profileDetails, setProfileDetails] = useState('');
  const [imageFilePath, setImageFilePath] = useState<string | undefined>(undefined);
  const [activeInd, setActiveInd] = useState('Active');

  useEffect(() => {
    if (initialData) {
      // Shared fields for both modes
      setCouncilId(initialData.councilId || '');
      setYearOfReg(initialData.yearOfReg?.toString() || ''); // Convert number to string
      setRegNo(initialData.orgUserQlfn || '');

      // Full mode fields
      if (mode === 'full') {
        setUserTitle(initialData.userTitle || 'Dr.');
        setFirstName(initialData.firstName || '');
        setLastName(initialData.lastName || '');
        setEmail(initialData.email || '');
        setSpecialty(initialData.specialty || 'Select'); // Ensure specialty is set
        setOrgUserQlfn(initialData.orgUserQlfn || '');
        setAddressLine1(initialData.addressLine1 || '');
        setAddressLine2(initialData.addressLine2 || '');
        setCity(initialData.city || '');
        setAreaName(initialData.areaName || ''); // Ensure areaName is set
        setCountry(initialData.country || '');
        setState(initialData.state || '');
        setPin(initialData.pin || '');
        setCellNumber(initialData.cellNumber || ''); // Ensure cellNumber is set
        setUserName(initialData.userName || ''); // Ensure userName is set
        setProfileDetails(initialData.profileDetails || '');
        setImageFilePath(initialData.imageFilePath || undefined);
        setActiveInd(initialData.activeInd === 1 ? 'Active' : 'Inactive');
      }
    }
  }, [initialData, mode]);

  const handleProceed = () => {
    let valid = true;
    if (!councilId) {
      setCouncilError('Medical Council is required');
      valid = false;
    } else {
      setCouncilError('');
    }
    if (!yearOfReg) {
      setYearError('Year of Registration is required');
      valid = false;
    } else {
      setYearError('');
    }
    if (!regNo) {
      setRegNoError('Reg. No. is required');
      valid = false;
    } else {
      setRegNoError('');
    }
    if (!valid) {
      setError(true);
      return;
    }
    setError(false);
    if (mode === 'short' && onProceed) {
      onProceed({ councilId, yearOfReg, regNo });
    } else if (mode === 'full' && onSubmit) {
      onSubmit({
        councilId,
        yearOfReg,
        regNo,
        userTitle,
        firstName,
        lastName,
        email,
        specialty,
        orgUserQlfn,
        addressLine1,
        addressLine2,
        city,
        areaName,
        country,
        state,
        pin,
        cellNumber,
        userName,
        profileDetails,
        imageFilePath,
        activeInd: activeInd === 'Active' ? 1 : 0,
      });
    }
    onClose();
  };

  const handleCancel = () => {
    setError(false);
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth classes={{ paper: styles.modalPaper }}>
      <DialogTitle className={styles.title}>DOCTOR DETAILS</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ fontWeight: 'bold', mb: 2 }}>
            Please provide the following details!
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 3 }}>
          <FormControl fullWidth required error={!!councilError}>
            <InputLabel>Medical Council</InputLabel>
            <Select
              value={councilId}
              label="Medical Council"
              onChange={(e) => setCouncilId(e.target.value)}
            >
              <MenuItem value="">Select</MenuItem>
              {councilList.map((c) => (
                <MenuItem key={c.councilId} value={c.councilId}>
                  {c.councilName}
                </MenuItem>
              ))}
            </Select>
            {councilError && <Typography color="error" variant="caption">{councilError}</Typography>}
          </FormControl>
          <TextField
            label="Year of Registration"
            value={yearOfReg}
            onChange={(e) => setYearOfReg(e.target.value)}
            fullWidth
            required
            type="number"
            error={!!yearError}
            helperText={yearError}
          />
          <TextField
            label="Reg. No."
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            fullWidth
            required
            error={!!regNoError}
            helperText={regNoError}
          />
        </Box>
        {mode === 'full' && (
          <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 4, alignItems: 'flex-start', mb: 2 }}>
            {/* Left: Form fields */}
            <Box sx={{ flex: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Name"
                  value={userTitle}
                  onChange={(e) => setUserTitle(e.target.value)}
                  sx={{ width: 80 }}
                  required
                />
                <TextField
                  label="First"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ flex: 2 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel>Speciality</InputLabel>
                  <Select
                    value={specialty}
                    label="Speciality"
                    onChange={(e) => setSpecialty(e.target.value)}
                  >
                    {specialties.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Qualification"
                  value={orgUserQlfn}
                  onChange={(e) => setOrgUserQlfn(e.target.value)}
                  required
                  fullWidth
                />
              </Box>
              <TextField
                label="Address Line1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Address Line2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  sx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small">
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
                <TextField
                  label="Area"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  required
                  sx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small">
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  sx={{ flex: 1 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Cell No."
                  value={cellNumber}
                  onChange={(e) => setCellNumber(e.target.value)}
                  required
                  sx={{ flex: 1 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="User Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
            {/* Right: Image upload, Status, Profile Details */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', mt: { xs: 2, md: 0 } }}>
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  border: '2px dashed #bfc5cc',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  bgcolor: '#f5f5f5',
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: '#0288d1' },
                  mb: 2,
                }}
              >
                <Avatar
                  src={imageFilePath}
                  alt="Doctor"
                  sx={{ width: 134, height: 134, bgcolor: '#e0e0e0', fontSize: 40, borderRadius: 2 }}
                >
                  {!imageFilePath && userTitle?.[0]}
                </Avatar>
                {imageFilePath && (
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'white', p: 0.5 }}
                    onClick={() => setImageFilePath(undefined)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                <Tooltip title="Attach Image">
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      bgcolor: '#174a7c',
                      color: 'white',
                      '&:hover': { bgcolor: '#0288d1' },
                      boxShadow: 2,
                    }}
                  >
                    <CameraAltIcon />
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFilePath(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={activeInd}
                  label="Status"
                  onChange={(e) => setActiveInd(e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Profile Details"
                value={profileDetails}
                onChange={(e) => setProfileDetails(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
        <Button onClick={handleProceed} variant="contained" className={styles.proceedButton} sx={{ mr: 2 }}>
          {mode === 'short' ? 'Proceed' : 'Submit'}
        </Button>
        <Button onClick={handleCancel} variant="contained" className={styles.cancelButton}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoctorDetailsModal;