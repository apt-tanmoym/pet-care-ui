import React, { useState } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import AddRecordsDialog from '@/components/AddRecords/AddRecordsDialog';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

const recordTypes = [
  { label: 'Pathology' },
  { label: 'Prescription' },
  { label: 'Radiology' },
  { label: 'Referrals' },
];

const documentTypes = [
  { label: 'Image', value: 'image' },
  { label: 'Documents', value: 'documents' },
  { label: 'Audio', value: 'audio' },
  { label: 'Video', value: 'video' },
];

const uploadTimes = [
  'Recent', 'Last Visit', 'Today', 'Yesterday', 'Last Week', 'Last Month', 'Year', 'Others'
];
const fileTypes = [
  'JPG', 'PNG', 'DOCX', 'PDF', 'PPT', 'MP3', 'MP4', 'MOV', 'XYZ', 'TXT', 'SVG', 'TIFF'
];
const docTypes = [
  'PATHOLOGY', 'XRAY', 'RADIOLOGY', 'PRESCRIPTION', 'REFERRALS', 'OTHERS'
];
const uploadedBy = ['MY VET', 'PET (ME)'];

function PillButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Button
      variant={selected ? 'contained' : 'outlined'}
      onClick={onClick}
      sx={{
        borderRadius: 4,
        minWidth: 90,
        m: 0.5,
        bgcolor: selected ? '#e0e0e0' : undefined,
        color: '#222',
        fontWeight: 600,
        boxShadow: 'none',
        borderColor: '#bbb',
        '&.Mui-selected, &.MuiButton-contained': {
          bgcolor: '#bbb',
          color: '#222',
        },
      }}
    >
      {children}
    </Button>
  );
}

const FilterDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [selectedUploadTimes, setSelectedUploadTimes] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
  const [selectedUploadedBy, setSelectedUploadedBy] = useState<string[]>([]);

  const toggle = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };
  const resetAll = () => {
    setSelectedUploadTimes([]);
    setSelectedFileTypes([]);
    setSelectedDocTypes([]);
    setSelectedUploadedBy([]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ bgcolor: '#fff', borderRadius: 2, minHeight: 500, position: 'relative' }}>
        {/* Sticky Header */}
        <Box sx={{
          display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #eee',
          position: 'sticky', top: 0, bgcolor: '#fff', zIndex: 2
        }}>
          <IconButton onClick={onClose}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, ml: 1 }}>
            Filter
          </Typography>
          <Button onClick={resetAll} sx={{ color: '#555', textTransform: 'none', fontWeight: 600 }}>Reset</Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#174a7c',
              color: '#fff',
              borderRadius: 2,
              ml: 2,
              px: 3,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#103a61' },
            }}
            onClick={onClose}
          >
            Save
          </Button>
        </Box>
        {/* Content */}
        <Box sx={{ p: 3, pt: 2 }}>
          {/* Upload Time */}
          <Typography fontWeight={700} sx={{ mb: 1 }}>Upload Time</Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {uploadTimes.map(opt => (
              <Grid item xs={6} sm={4} key={opt}>
                <Chip
                  label={opt}
                  clickable
                  color={selectedUploadTimes.includes(opt) ? 'primary' : 'default'}
                  onClick={() => toggle(selectedUploadTimes, setSelectedUploadTimes, opt)}
                  sx={{ width: '100%', fontWeight: 600, borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 2 }} />
          {/* Type Of File */}
          <Typography fontWeight={700} sx={{ mb: 1 }}>Type Of File</Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {fileTypes.map(opt => (
              <Grid item xs={4} sm={3} key={opt}>
                <Chip
                  label={opt}
                  clickable
                  color={selectedFileTypes.includes(opt) ? 'primary' : 'default'}
                  onClick={() => toggle(selectedFileTypes, setSelectedFileTypes, opt)}
                  sx={{ width: '100%', fontWeight: 600, borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 2 }} />
          {/* Type Of Documents */}
          <Typography fontWeight={700} sx={{ mb: 1 }}>Type Of Documents</Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {docTypes.map(opt => (
              <Grid item xs={6} sm={4} key={opt}>
                <Chip
                  label={opt}
                  clickable
                  color={selectedDocTypes.includes(opt) ? 'primary' : 'default'}
                  onClick={() => toggle(selectedDocTypes, setSelectedDocTypes, opt)}
                  sx={{ width: '100%', fontWeight: 600, borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 2 }} />
          {/* Uploaded By */}
          <Typography fontWeight={700} sx={{ mb: 1 }}>Uploaded By</Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {uploadedBy.map(opt => (
              <Grid item xs={6} key={opt}>
                <Chip
                  label={opt}
                  clickable
                  color={selectedUploadedBy.includes(opt) ? 'primary' : 'default'}
                  onClick={() => toggle(selectedUploadedBy, setSelectedUploadedBy, opt)}
                  sx={{ width: '100%', fontWeight: 600, borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};

// ShareDialog component
function ShareDialog({ open, onClose, fileName, petName }: { open: boolean; onClose: () => void; fileName: string; petName: string }) {
  const [expanded, setExpanded] = React.useState(false);
  const [searchName, setSearchName] = React.useState('');
  const [searchMobile, setSearchMobile] = React.useState('');
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const dummyUsers = [
    { name: 'Deb Sarkar', category: 'Anatomical Pathology' },
    { name: 'Debashis Sharma', category: 'Equine' },
    { name: 'Debashis Das', category: 'Small Animal Surgery' },
    { name: 'Debashis Sarkar', category: 'Cardiology' },
  ];
  const handleUserToggle = (name: string) => {
    setSelectedUsers(selectedUsers.includes(name)
      ? selectedUsers.filter(u => u !== name)
      : [...selectedUsers, name]);
  };
  const handleShareClick = () => setExpanded(true);
  const handleShareDocuments = () => { setExpanded(false); onClose(); };
  const handleClose = () => { setExpanded(false); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <Box sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#fff', boxShadow: 3 }}>
        <Box sx={{ bgcolor: '#174a7c', p: 2, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', lineHeight: 1 }}>{fileName}</Typography>
          <Typography sx={{ color: '#fff', fontSize: 14 }}>{petName}</Typography>
        </Box>
        {!expanded ? (
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<DownloadIcon />}
              sx={{
                borderColor: '#174a7c',
                color: '#174a7c',
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 2,
                py: 1.1,
                mb: 1,
                '&:hover': { borderColor: '#103a61', color: '#103a61', bgcolor: '#f5faff' },
              }}
              onClick={handleClose}
            >
              Download
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShareOutlinedIcon sx={{ color: '#fff' }} />}
              sx={{
                bgcolor: '#174a7c',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 2,
                py: 1.1,
                '&:hover': { bgcolor: '#103a61' },
              }}
              onClick={handleShareClick}
            >
              Share Documents
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: 0, display: 'flex', flexDirection: 'column', height: 500 }}>
            <IconButton onClick={handleClose} sx={{ alignSelf: 'flex-start', m: 2, color: '#174a7c' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#174a7c', px: 3 }}>Share Documents</Typography>
            <Box sx={{ px: 3, mb: 2 }}>
              <TextField
                label="Name"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="By Mobile Number"
                value={searchMobile}
                onChange={e => setSearchMobile(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#174a7c', color: '#fff', fontWeight: 700, fontSize: 16, borderRadius: 2, py: 1, mb: 2, '&:hover': { bgcolor: '#103a61' } }}
              >
                Search
              </Button>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto', px: 3 }}>
              <TableContainer sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Select</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dummyUsers.map(user => (
                      <TableRow key={user.name}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.category}</TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={selectedUsers.includes(user.name)}
                            onChange={() => handleUserToggle(user.name)}
                            color="primary"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box sx={{ position: 'sticky', bottom: 0, left: 0, right: 0, bgcolor: '#fff', p: 3, boxShadow: '0 -2px 8px 0 rgba(23,74,124,0.07)' }}>
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#174a7c', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 2, py: 1.5, letterSpacing: 1, boxShadow: 'none', '&:hover': { bgcolor: '#103a61' } }}
                onClick={handleShareDocuments}
              >
                SHARE DOCUMENTS
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}

const petsList = [
  { label: 'Sheru', value: 'sheru' },
  { label: 'Tommy', value: 'tommy' },
  { label: 'Max', value: 'max' },
];

const RecordsPage: React.FC = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [documentType, setDocumentType] = useState(documentTypes[0].value);
  const [selectedCategory, setSelectedCategory] = useState(recordTypes[0].label);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState(petsList[0].value);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const handleDeleteClick = (recordId: string) => {
    setRecordToDelete(recordId);
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    setOpenDeleteDialog(false);
    setRecordToDelete(null);
    // Here you would remove the record from your list
  };
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setRecordToDelete(null);
  };

  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
          <Box sx={{ mb: 3, px: 2, textAlign: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
              Records
            </Typography>
            <Typography variant="body1" sx={{ color: '#555', mt: 1 }}>
              Look at your records from doctors
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '16px', position: 'relative' }}>
            {/* Top right action buttons */}
            <Box sx={{ position: 'absolute', top: 12, right: 16, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#555', mr: 0.5 }}>Filter:</Typography>
              <IconButton
                sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}
                onClick={() => setOpenFilterDialog(true)}
                aria-label="Filter"
              >
                <FilterListIcon />
              </IconButton>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#174a7c',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#103a61' },
                }}
                onClick={() => setOpenAddDialog(true)}
              >
                Add New Record
              </Button>
            </Box>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#34495e' }}>
                  Select Your Pet :
                </Typography>
                <TextField
                  select
                  value={selectedPet}
                  onChange={e => setSelectedPet(e.target.value)}
                  sx={{ minWidth: 140 }}
                  size="small"
                >
                  {petsList.map(pet => (
                    <MenuItem key={pet.value} value={pet.value}>{pet.label}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Divider sx={{ mb: 3 }} />
              {/* Document Type Dropdown */}
              <TextField
                select
                label="Document Type"
                value={documentType}
                onChange={e => setDocumentType(e.target.value)}
                sx={{ mb: 3, minWidth: 220 }}
              >
                {documentTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </TextField>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#34495e' }}>
                Category
              </Typography>
              <ToggleButtonGroup
                value={selectedCategory}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) setSelectedCategory(newValue);
                }}
                sx={{ mb: 4, display: 'flex', gap: 2 }}
                fullWidth
              >
                {recordTypes.map((type) => (
                  <ToggleButton
                    key={type.label}
                    value={type.label}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: 14,
                      px: 2,
                      py: 0.7,
                      border: '1px solid #e0e0e0',
                      color: selectedCategory === type.label ? '#fff' : '#174a7c',
                      bgcolor: selectedCategory === type.label ? '#174a7c' : '#f5f5f5',
                      boxShadow: selectedCategory === type.label ? '0 2px 8px 0 rgba(23,74,124,0.15)' : 'none',
                      outline: selectedCategory === type.label ? '2px solid #174a7c' : 'none',
                      '&:hover': {
                        bgcolor: selectedCategory === type.label ? '#103a61' : '#e0e0e0',
                      },
                      transition: 'all 0.2s',
                      flex: 1,
                      minWidth: 120,
                    }}
                  >
                    {type.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#34495e' }}>
                All Records
              </Typography>
              {/* Dummy Record List - each record is a full-width row, content side by side */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <Paper sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Typography sx={{ minWidth: 180, fontWeight: 600 }}>
                    Blood Test Report
                  </Typography>
                  <Typography sx={{ minWidth: 120 }}>2025-07-15</Typography>
                  <Typography sx={{ minWidth: 140 }}>Pathology (PDF)</Typography>
                  <Typography sx={{ minWidth: 100 }}>My Vet</Typography>
                  <Box sx={{ flex: 1 }} />
                  <IconButton aria-label="share" size="small" sx={{ color: '#174a7c', mr: 1 }} onClick={() => setOpenShareDialog(true)}>
                    <ShareOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="delete" size="small" sx={{ color: '#d32f2f' }} onClick={() => handleDeleteClick('dummy-id')}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Paper>
                {/* Add more dummy records here if needed */}
              </Box>
            </Box>
          </Paper>
          <AddRecordsDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} />
          <FilterDialog open={openFilterDialog} onClose={() => setOpenFilterDialog(false)} />
          <ShareDialog open={openShareDialog} onClose={() => setOpenShareDialog(false)} fileName="Ghg.jpg" petName="Sheru" />
          <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
            <DialogTitle>Are you sure you want to delete?</DialogTitle>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
              <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default RecordsPage; 