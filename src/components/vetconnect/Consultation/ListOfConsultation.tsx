import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import dayjs from "dayjs";
import "dayjs/locale/en";
import ConsultationPopup from "./OnlineConsultationPopup";
import OfflineConsultationPopup from "./OfflineConsultationPopup";
import { updateStatusArrive, updateConsultationStarted, updateStatusComplete } from "@/services/manageCalendar";

interface ConsultationItem {
  petName: string;
  ownerName: string;
  timeRange: string;
  imageUrl?: string;
  // API fields for updatestatusarrive
  patientMrn?: number;
  petOwnerUid?: string;
  patientUid?: number;
  appointmentId?: number;
  facilityId?: number;
  encounterId?: string;
}

interface ListOfConsultationProps {
  selectedDate: Date | null;
  consultations: ConsultationItem[];
  onArriveClick: (consultation: ConsultationItem) => void;
}

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const ListOfConsultation: React.FC<ListOfConsultationProps> = ({
  selectedDate,
  consultations,
  onArriveClick,
}) => {
  if (!selectedDate || consultations.length === 0) {
    return null;
  }

  const day = dayjs(selectedDate).date();
  const month = dayjs(selectedDate).format("MMMM");
  const year = dayjs(selectedDate).year();
  const formattedDate = `${day}${getOrdinalSuffix(day)} ${month} ${year}`;

  const [arrivedConsultations, setArrivedConsultations] = useState<Set<number>>(new Set());
  const [openOnlinePopup, setOpenOnlinePopup] = useState(false);
  const [openOfflinePopup, setOpenOfflinePopup] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationItem | null>(null);
  const [loadingArrive, setLoadingArrive] = useState<Set<number>>(new Set());
  const [loadingConsultation, setLoadingConsultation] = useState<Set<number>>(new Set());
  const [consultationStarted, setConsultationStarted] = useState<Set<number>>(new Set());
  const [encounterIds, setEncounterIds] = useState<Map<number, string>>(new Map());
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleArrive = async (index: number, consultation: ConsultationItem) => {
    if (!consultation.patientMrn || !consultation.petOwnerUid || !consultation.patientUid || !consultation.appointmentId || !consultation.facilityId) {
      setSnackbar({
        open: true,
        message: 'Missing required patient information',
        severity: 'error'
      });
      return;
    }

    setLoadingArrive((prev) => new Set(prev).add(index));
    
    try {
      const response = await updateStatusArrive({
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: 'D',
        orgId: parseInt(localStorage.getItem('orgId') || '39'),
        facilityId: consultation.facilityId,
        patientMrn: consultation.patientMrn?.toString(),
        petOwnerUid: consultation.petOwnerUid,
        patientUid: consultation.patientUid?.toString(),
        appointmentId: consultation.appointmentId?.toString(),
        appointmentStatus: 'Scheduled',
        changeStatus: 'Arrive',
        meetingUrl: ''
      });

      if (response.status === 'Success') {
        setArrivedConsultations((prev) => new Set(prev).add(index));
        // Store encounterId for later use in updatestatuscomplete
        if (response.encounterId) {
          setEncounterIds((prev) => new Map(prev).set(index, response.encounterId));
        }
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'success'
        });
        onArriveClick?.(consultation);
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to update status',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update appointment status',
        severity: 'error'
      });
    } finally {
      setLoadingArrive((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleConsultationStarted = async (index: number, consultation: ConsultationItem, consultationType: 'online' | 'offline') => {
    if (!consultation.patientMrn || !consultation.petOwnerUid || !consultation.patientUid || !consultation.appointmentId || !consultation.facilityId) {
      setSnackbar({
        open: true,
        message: 'Missing required patient information',
        severity: 'error'
      });
      return;
    }

    setLoadingConsultation((prev) => new Set(prev).add(index));
    
    try {
      const response = await updateConsultationStarted({
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: 'D',
        orgId: parseInt(localStorage.getItem('orgId') || '39'),
        facilityId: consultation.facilityId,
        patientMrn: consultation.patientMrn?.toString(),
        petOwnerUid: consultation.petOwnerUid,
        patientUid: consultation.patientUid?.toString(),
        appointmentId: consultation.appointmentId?.toString(),
        appointmentStatus: 'Arrived',
        changeStatus: 'ConsultationStarted',
        consultationType: consultationType,
        meetingUrl: ''
      });

      if (response.status === 'Success') {
        setConsultationStarted((prev) => new Set(prev).add(index));
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'success'
        });
        
        // Open the appropriate consultation popup
        setSelectedConsultation(consultation);
        if (consultationType === 'online') {
          setOpenOnlinePopup(true);
        } else {
          setOpenOfflinePopup(true);
        }
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to start consultation',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error starting consultation:', error);
      setSnackbar({
        open: true,
        message: 'Failed to start consultation',
        severity: 'error'
      });
    } finally {
      setLoadingConsultation((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleConsultOnline = (index: number, consultation: ConsultationItem) => {
    handleConsultationStarted(index, consultation, 'online');
  };

  const handleConsultOffline = (index: number, consultation: ConsultationItem) => {
    handleConsultationStarted(index, consultation, 'offline');
  };

  const handleCompleteConsultation = async (index: number, consultation: ConsultationItem) => {
    if (!consultation.patientMrn || !consultation.petOwnerUid || !consultation.patientUid || !consultation.appointmentId || !consultation.facilityId) {
      setSnackbar({
        open: true,
        message: 'Missing required patient information',
        severity: 'error'
      });
      return;
    }

    const encounterId = encounterIds.get(index);
    if (!encounterId) {
      setSnackbar({
        open: true,
        message: 'Encounter ID not found. Please arrive first.',
        severity: 'error'
      });
      return;
    }

    setLoadingConsultation((prev) => new Set(prev).add(index));
    
    try {
      const response = await updateStatusComplete({
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: 'D',
        orgId: parseInt(localStorage.getItem('orgId') || '39'),
        facilityId: consultation.facilityId,
        patientMrn: consultation.patientMrn?.toString(),
        petOwnerUid: consultation.petOwnerUid,
        patientUid: consultation.patientUid?.toString(),
        appointmentId: consultation.appointmentId?.toString(),
        encounterId: encounterId,
        appointmentStatus: 'Scheduled',
        changeStatus: 'Arrive'
      });

      if (response.status === 'Success') {
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'success'
        });
        // Close consultation popups
        setOpenOnlinePopup(false);
        setOpenOfflinePopup(false);
        setSelectedConsultation(null);
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to complete consultation',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error completing consultation:', error);
      setSnackbar({
        open: true,
        message: 'Failed to complete consultation',
        severity: 'error'
      });
    } finally {
      setLoadingConsultation((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  return (
    <Card
      sx={{
        mt: 4,
        mb: 2,
        width: "80%",
        maxWidth: 800,
        mx: "auto",
        borderRadius: 4,
        boxShadow: 6,
        background: "#fff",
        border: "1px solid #e0e0e0",
        p: 0,
      }}
    >
      <Box
        sx={{
          background: "#174a7c",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: 700,
            flexGrow: 1,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          List Of Consultation
        </Typography>
      </Box>
      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#1976d2",
            fontWeight: 700,
            position: "absolute",
            top: 16,
            left: 16,
          }}
        >
          {formattedDate}
        </Typography>
        {consultations.map((consultation, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#e0f7fa",
              p: 2,
              borderRadius: 4,
              mb: index < consultations.length - 1 ? 2 : 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {consultation.imageUrl && (
                <Box
                  component="img"
                  src={consultation.imageUrl}
                  alt={`${consultation.petName} image`}
                  sx={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
                />
              )}
              <Box>
                <Typography variant="h6" sx={{ color: "#174a7c", fontWeight: 600 }}>
                  {consultation.petName} of {consultation.ownerName}
                </Typography>
                <Typography variant="body2" sx={{ color: "#78909c", fontWeight: 500 }}>
                  TIME: {consultation.timeRange}
                </Typography>
                <Typography variant="caption" sx={{ color: "#4CAF50", fontWeight: 500 }}>
                  SCHEDULED
                </Typography>
              </Box>
            </Box>
            <Box sx={{ ml: 2 }}>
              {arrivedConsultations.has(index) ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    flexWrap: "nowrap",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleConsultOnline(index, consultation)}
                    disabled={loadingConsultation.has(index)}
                    sx={{
                      bgcolor: "#2196F3",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                      "&:hover": { bgcolor: "#1976D2" },
                      "&:disabled": { bgcolor: "#ccc" },
                    }}
                  >
                    {loadingConsultation.has(index) ? (
                      <CircularProgress size={16} sx={{ color: "#fff" }} />
                    ) : (
                      "CONSULT ONLINE"
                    )}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleConsultOffline(index, consultation)}
                    disabled={loadingConsultation.has(index)}
                    sx={{
                      bgcolor: "#FFCA28",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                      "&:hover": { bgcolor: "#FFB300" },
                      "&:disabled": { bgcolor: "#ccc" },
                    }}
                  >
                    {loadingConsultation.has(index) ? (
                      <CircularProgress size={16} sx={{ color: "#fff" }} />
                    ) : (
                      "CONSULT OFFLINE"
                    )}
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handleArrive(index, consultation)}
                  disabled={loadingArrive.has(index)}
                  sx={{
                    bgcolor: "#4CAF50",
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 3,
                    py: 1,
                    px: 2,
                    whiteSpace: "nowrap",
                    "&:hover": {
                      bgcolor: "#45a049",
                    },
                    "&:disabled": {
                      bgcolor: "#ccc",
                    },
                  }}
                >
                  {loadingArrive.has(index) ? (
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                  ) : (
                    "ARRIVE"
                  )}
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </CardContent>

      {/* Online Consultation Dialog */}
      <Dialog open={openOnlinePopup} onClose={() => setOpenOnlinePopup(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Online Consultation
          </Typography>
          <IconButton onClick={() => setOpenOnlinePopup(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflowY: "auto", maxHeight: "80vh" }}>
          {selectedConsultation && (
            <ConsultationPopup 
              consultation={selectedConsultation} 
              onCompleteConsultation={(consultation) => {
                const index = consultations.findIndex(c => c.appointmentId === consultation.appointmentId);
                if (index !== -1) {
                  handleCompleteConsultation(index, consultation);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Offline Consultation Dialog */}
      <Dialog open={openOfflinePopup} onClose={() => setOpenOfflinePopup(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Offline Consultation
          </Typography>
          <IconButton onClick={() => setOpenOfflinePopup(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflowY: "auto", maxHeight: "80vh" }}>
          {selectedConsultation && (
            <OfflineConsultationPopup 
              consultation={selectedConsultation} 
              onCompleteConsultation={(consultation) => {
                const index = consultations.findIndex(c => c.appointmentId === consultation.appointmentId);
                if (index !== -1) {
                  handleCompleteConsultation(index, consultation);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>

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
    </Card>
  );
};

export default ListOfConsultation;
