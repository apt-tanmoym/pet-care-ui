import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
// import { sampleMedicalRecord } from "@/components/manageEncounter/sampleMedicalRecord";
import { uploadVoicePrescription, getVoicePrescriptions } from "@/services/manageCalendar";
// import { MedicalRecord } from "@/components/manageEncounter/types";

// Dynamically import ManageEncounter with SSR disabled to avoid Quill SSR issues
const ManageEncounter = dynamic(
  () => import("@/components/manageEncounter/ManageEncounter"),
  { ssr: false }
);

interface ConsultationItem {
  petName: string;
  ownerName: string;
  timeRange: string;
  imageUrl?: string;
  patientId?: number;
  appointmentId?: number;
  patientUid?: number;
  patientMrn?: number;
}

interface ConsultationPopupProps {
  consultation: ConsultationItem;
  onCompleteConsultation?: (consultation: ConsultationItem) => void;
}

const ConsultationPopup: React.FC<ConsultationPopupProps> = ({
  consultation,
  onCompleteConsultation,
}) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }); // e.g., "29/08/2025"
  const [startTime, endTime] = consultation.timeRange.split(" - ");
  const petImage = consultation.imageUrl;

  // Refs for hidden file inputs
  const docUploadRef = useRef<HTMLInputElement>(null);
  const addDocRef = useRef<HTMLInputElement>(null);
  const chatFileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // State for controlling popup visibility
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [openManualPrescriptionModal, setOpenManualPrescriptionModal] = useState(false);
  const [prescriptionMode, setPrescriptionMode] = useState<'selection' | 'textToSpeech' | 'attachDocument'>('selection');
  
  // State for comments functionality
  const [comment, setComment] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'warning' | 'info' 
  });
  const [comments, setComments] = useState<Array<{ id: number; text: string; date: string; time: string }>>([]);

  const router = useRouter();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setComment((prev) => {
            const newText = finalTranscript || interimTranscript;
            return prev + newText;
          });
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  // Fetch consultation history when modal opens
  useEffect(() => {
    const fetchConsultationHistory = async () => {
      if (openPrescriptionModal) {
        setIsLoadingComments(true);
        try {
          const payload = {
            userName: localStorage.getItem('userName') || '',
            userPass: localStorage.getItem('userPwd') || '',
            deviceStat: "M",
            appointmentId: consultation.appointmentId || 0
          };

          const response = await getVoicePrescriptions(payload);

          if (Array.isArray(response)) {
            // Helper function to strip HTML tags
            const stripHtmlTags = (html: string) => {
              if (typeof window === 'undefined') {
                // Server-side: use regex to strip HTML tags
                return html.replace(/<[^>]*>/g, '');
              }
              // Client-side: use DOM API
              const tmp = document.createElement("DIV");
              tmp.innerHTML = html;
              return tmp.textContent || tmp.innerText || "";
            };

            const formattedComments = response.map((item, index) => ({
              id: item.encounterPublicNoteId || index + 1,
              text: stripHtmlTags(item.publicNote),
              date: item.publicNoteDate,
              time: item.publicNoteTime
            }));

            setComments(formattedComments);
          }
        } catch (error) {
          console.error('Error fetching consultation history:', error);
          setSnackbar({
            open: true,
            message: "Failed to load consultation history",
            severity: "error"
          });
        } finally {
          setIsLoadingComments(false);
        }
      }
    };

    fetchConsultationHistory();
  }, [openPrescriptionModal]);

  const handleFileChange =
    (label: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        console.log(`File uploaded from [${label}]:`, file.name);
        // Handle file upload logic here
      }
    };

  const handleOpenPrescriptionModal = () => {
    setOpenPrescriptionModal(true);
    setPrescriptionMode('selection');
  };

  const handleClosePrescriptionModal = () => {
    setOpenPrescriptionModal(false);
    setPrescriptionMode('selection');
    setComment("");
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleOpenManualPrescription = () => {
    setOpenManualPrescriptionModal(true);
  };

  const handleCloseManualPrescription = () => {
    setOpenManualPrescriptionModal(false);
  };

  const handleModeSelect = (mode: 'textToSpeech' | 'attachDocument' | 'addManually') => {
    if (mode === 'addManually') {
      setOpenPrescriptionModal(false);
      setOpenManualPrescriptionModal(true);
    } else {
      setPrescriptionMode(mode);
    }
  };

  const handleBackToSelection = () => {
    setPrescriptionMode('selection');
    setComment("");
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setComment("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a comment",
        severity: "warning"
      });
      return;
    }

    if (!consultation.patientMrn || !consultation.appointmentId) {
      setSnackbar({
        open: true,
        message: "Missing patient or appointment information",
        severity: "error"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: "M",
        patientId: consultation.patientMrn,
        appointmentId: consultation.appointmentId,
        publicNote: comment.trim()
      };

      const response = await uploadVoicePrescription(payload);

      if (response.status === "True" || response.status === "success") {
        setComment("");
        
        setSnackbar({
          open: true,
          message: response.message || "Comment added successfully",
          severity: "success"
        });

        // Refresh consultation history
        try {
          const historyPayload = {
            userName: localStorage.getItem('userName') || '',
            userPass: localStorage.getItem('userPwd') || '',
            deviceStat: "M",
            appointmentId: consultation.appointmentId || 0
          };

          const historyResponse = await getVoicePrescriptions(historyPayload);

          if (Array.isArray(historyResponse)) {
            const stripHtmlTags = (html: string) => {
              if (typeof window === 'undefined') {
                // Server-side: use regex to strip HTML tags
                return html.replace(/<[^>]*>/g, '');
              }
              // Client-side: use DOM API
              const tmp = document.createElement("DIV");
              tmp.innerHTML = html;
              return tmp.textContent || tmp.innerText || "";
            };

            const formattedComments = historyResponse.map((item, index) => ({
              id: item.encounterPublicNoteId || index + 1,
              text: stripHtmlTags(item.publicNote),
              date: item.publicNoteDate,
              time: item.publicNoteTime
            }));

            setComments(formattedComments);
          }
        } catch (error) {
          console.error('Error refreshing consultation history:', error);
        }
      } else {
        setSnackbar({
          open: true,
          message: response.message || "Failed to add comment",
          severity: "error"
        });
      }
    } catch (error) {
      console.error('Error uploading voice prescription:', error);
      setSnackbar({
        open: true,
        message: "Error adding comment. Please try again.",
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChatFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File attached to comments:", file.name);
      const currentDate = new Date();
      const newComment = {
        id: comments.length + 1,
        text: `📎 Attached Document: ${file.name}`,
        date: currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setComments([...comments, newComment]);
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#F9FBFF", borderRadius: 4 }}>
      {/* Profile Section */}
      <Box
        sx={{ mb: 3, p: 2, bgcolor: "#ffffff", borderRadius: 4, boxShadow: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={petImage || "/placeholder-pet-image.jpg"}
            alt="Pet"
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
          <Box
            component="img"
            src={petImage || "/placeholder-pet-image.jpg"}
            alt="Pet Avatar"
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
              mt: -4,
              border: "3px solid #fff",
            }}
          />
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
            {consultation.petName}{" "}
            <Typography component="span" variant="body2">
              of {consultation.ownerName}
            </Typography>
          </Typography>
        </Box>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">CURRENT CONSULTATION :</Typography>
          <Box
            sx={{ mt: 1, p: 1.5, border: "2px solid #9e9e9e", borderRadius: 2 }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "#174a7c", mb: 0.5 }}
            >
              IN ONLINE
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">{formattedDate}</Typography>
              <Typography variant="body2">SLOT 2</Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {consultation.timeRange}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                mt: 2,
                gap: 1,
              }}
            >
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: "#174a7c",
                  '&:hover': {
                    bgcolor: '#0d3a5f',
                  },
                }}
              >
                ONLINE CONSULTATION
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleOpenPrescriptionModal}
                sx={{
                  borderColor: '#174a7c',
                  color: '#174a7c',
                  '&:hover': {
                    borderColor: '#0d3a5f',
                    bgcolor: '#e8f0f7',
                  },
                }}
              >
                Add Prescription
              </Button>
              <Button
                variant="outlined"
                onClick={() => addDocRef.current?.click()}
                sx={{
                  borderColor: '#174a7c',
                  color: '#174a7c',
                  '&:hover': {
                    borderColor: '#0d3a5f',
                    bgcolor: '#e8f0f7',
                  },
                }}
              >
                Add Documents
              </Button>
              <Button
                variant="contained"
                onClick={() => onCompleteConsultation?.(consultation)}
                sx={{
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#45a049',
                  },
                }}
              >
                Complete Consultation
              </Button>
              <input
                type="file"
                hidden
                ref={addDocRef}
                onChange={handleFileChange("Add Documents")}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* About Rocky */}
      <Box sx={{ mb: 3, p: 2, bgcolor: "#fff", borderRadius: 4, boxShadow: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#174a7c" }}
          gutterBottom
        >
          About Rocky
        </Typography>
        <Typography variant="body2">DOB : 19.01.2020</Typography>
        <Typography variant="body2">Dog | Dog | Male</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Diet : Rice, Kibble, Meat, Fish, Vegetables, Grains, Hay, Leafy
          Greens, Pellets, Seeds, Nuts, Fruits, Insects, Fish Flakes
        </Typography>
        <Typography variant="body2">Living Environment : Houserr</Typography>
        <Typography variant="body2">Training : Yes</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Gooddog Rocky
        </Typography>
      </Box>

      {/* Address and History */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Box
          sx={{ flex: 1, p: 2, bgcolor: "#fff", borderRadius: 4, boxShadow: 1 }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#174a7c" }}
            gutterBottom
          >
            Address
          </Typography>
          <Typography variant="body2">
            New Town, Kolkata, Cornaredo, Milan, 10125, West Bengal 2
          </Typography>
        </Box>
        <Box
          sx={{ flex: 1, p: 2, bgcolor: "#fff", borderRadius: 4, boxShadow: 1 }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#174a7c" }}
            gutterBottom
          >
            History
          </Typography>
          <Typography variant="body2">
            Injury, Eye, Leg, Diabetes, Cardiac Arrest, Ear, Allergy, Asthma,
            Flu, Arthritis, Heart Disease, Pneumonia
          </Typography>
        </Box>
      </Box>

      {/* Shared Documents */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#174a7c", mb: 1 }}
        >
          Shared Documents
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            p: 2,
            borderRadius: 4,
            boxShadow: 1,
          }}
        >
          {[
            "12.05.2025",
            "03.05.2025",
            "03.05.2025",
            "29.04.2025",
            "28.04.2025",
          ].map((date, idx) => (
            <Button
              key={idx}
              variant="outlined"
              sx={{ width: 112 }}
              startIcon={<CloudDownloadIcon />}
            >
              {date}
            </Button>
          ))}
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => docUploadRef.current?.click()}
            sx={{
              bgcolor: '#174a7c',
              color: 'white',
              '&:hover': {
                bgcolor: '#0d3a5f',
              },
            }}
          >
            Upload
          </Button>
          <input
            type="file"
            hidden
            ref={docUploadRef}
            onChange={handleFileChange("Shared Documents Upload")}
          />
        </Box>

        {/* My Prescriptions */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#174a7c", mt: 3, mb: 1 }}
        >
          My Prescriptions
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            p: 2,
            borderRadius: 4,
            boxShadow: 1,
          }}
        >
          {[
            "16.05.2025",
            "12.05.2025",
            "12.05.2025",
            "03.05.2025",
            "03.05.2025",
          ].map((date, idx) => (
            <Button
              key={idx}
              variant="outlined"
              sx={{ width: 112 }}
              startIcon={<CloudDownloadIcon />}
            >
              {date}
            </Button>
          ))}
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => docUploadRef.current?.click()}
            sx={{
              bgcolor: '#174a7c',
              color: 'white',
              '&:hover': {
                bgcolor: '#0d3a5f',
              },
            }}
          >
            Upload
          </Button>
          <input
            type="file"
            hidden
            ref={docUploadRef}
            onChange={handleFileChange("Prescription Upload")}
          />
        </Box>
      </Box>

      {/* Manual Prescription Modal - ManageEncounter */}
      <Dialog
        open={openManualPrescriptionModal}
        onClose={handleCloseManualPrescription}
        maxWidth={false}
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            width: '95vw',
            maxWidth: '1400px',
            height: '90vh',
            maxHeight: '1000px',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          },
        }}
      >
        <DialogTitle sx={{backgroundColor: '#174a7c', color:'white'}}>Add Prescription Manually</DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            flexGrow: 1,
            display: 'flex',
            overflow: 'hidden',
            position: 'relative', 
          }}
        >
          <ManageEncounter record={{
            patientInfo: {
              patientName: `${consultation.petName} of ${consultation.ownerName}`,
              doctorName: 'Doctor',
              userName: 'Doctor',
              date: formattedDate,
              time: startTime,
            },
            vitals: [],
            allergies: [],
            complaints: [],
            diagnoses: [],
            medicines: [],
            labOrders: [],
            procedureAdvices: [],
          }} />
        </DialogContent>
        <DialogActions 
        sx={{background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"}}>
          <Button variant="contained" onClick={handleCloseManualPrescription} sx={{ bgcolor: '#174a7c', '&:hover': { bgcolor: '#0d3a5f' } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Prescription Comments Modal */}
      <Dialog
        open={openPrescriptionModal}
        onClose={handleClosePrescriptionModal}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '85vh',
            maxHeight: '800px',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle 
          sx={{
            background: 'linear-gradient(135deg, #174a7c 0%, #0d2d4a 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            py: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Prescription Comments - {consultation.petName}
            </Typography>
          </Box>
          {isRecording && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
            >
              <FiberManualRecordIcon 
                sx={{ 
                  color: '#ff1744', 
                  fontSize: 20,
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                  },
                }} 
              />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Recording in progress... Speak now
              </Typography>
            </Box>
          )}
        </DialogTitle>
        
        <DialogContent 
          sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: '#f5f5f5',
            gap: 3,
          }}
        >
          {/* Mode Selection Screen */}
          {prescriptionMode === 'selection' && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '400px',
              gap: 3,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#174a7c', mb: 2 }}>
                Choose how to add prescription notes
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: '400px' }}>
                <Button
                  variant="contained"
                  onClick={() => handleModeSelect('textToSpeech')}
                  startIcon={<MicIcon />}
                  sx={{
                    bgcolor: '#174a7c',
                    color: 'white',
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: '#0d3a5f',
                    },
                  }}
                >
                  Voice Notes
                </Button>
                
                <Button
                  variant="contained"
                  onClick={() => handleModeSelect('attachDocument')}
                  startIcon={<AttachFileIcon />}
                  sx={{
                    bgcolor: '#174a7c',
                    color: 'white',
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: '#0d3a5f',
                    },
                  }}
                >
                  Attach Document
                </Button>
                
                <Button
                  variant="contained"
                  onClick={() => handleModeSelect('addManually')}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    bgcolor: '#174a7c',
                    color: 'white',
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: '#0d3a5f',
                    },
                  }}
                >
                  Add Manually
                </Button>
              </Box>
            </Box>
          )}

          {/* Voice Notes Mode */}
          {prescriptionMode === 'textToSpeech' && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handleBackToSelection} sx={{ mr: 1 }}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#174a7c' }}>
                  Voice Notes
                </Typography>
              </Box>
              
              {/* Comment Input Section */}
              <Box 
                sx={{ 
                  bgcolor: '#ffffff',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#174a7c',
                    mb: 2,
                  }}
                >
                  Add Comment
                </Typography>
                
                {/* Text Input with Mic and Send */}
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type your prescription notes or use voice recording..."
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#fafafa',
                        fontSize: '1rem',
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ alignSelf: 'flex-end', mb: 1 }}>
                          <IconButton
                            onClick={handleToggleRecording}
                            sx={{
                              color: isRecording ? '#ff1744' : '#174a7c',
                              bgcolor: isRecording ? '#ffebee' : '#e8f0f7',
                              '&:hover': {
                                bgcolor: isRecording ? '#ffcdd2' : '#d1e7f7',
                              },
                            }}
                          >
                            <MicIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddComment}
                    disabled={!comment.trim() || isSubmitting}
                    endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{
                      bgcolor: '#174a7c',
                      color: 'white',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      minWidth: '120px',
                      '&:hover': {
                        bgcolor: '#0d3a5f',
                      },
                      '&:disabled': {
                        bgcolor: '#e0e0e0',
                        color: '#9e9e9e',
                      },
                    }}
                  >
                    {isSubmitting ? 'Adding...' : 'Add'}
                  </Button>
                </Box>
              </Box>
              
              {/* Previous Comments List */}
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#174a7c',
                    mb: 2,
                    px: 1,
                  }}
                >
                  Consultation History
                </Typography>
                
                {isLoadingComments ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <CircularProgress size={40} sx={{ color: '#174a7c' }} />
                  </Box>
                ) : comments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                      No consultation history available. Add your first comment above.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {comments.map((commentItem) => (
                      <Box
                        key={commentItem.id}
                        sx={{
                          bgcolor: '#ffffff',
                          p: 2.5,
                          borderRadius: 2,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                          borderLeft: '4px solid #174a7c',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#174a7c',
                              fontWeight: 600,
                              bgcolor: '#e8f0f7',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            {commentItem.date}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ color: '#999' }}
                          >
                            {commentItem.time}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#333',
                            lineHeight: 1.6,
                          }}
                        >
                          {commentItem.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}

          {/* Attach Document Mode */}
          {prescriptionMode === 'attachDocument' && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handleBackToSelection} sx={{ mr: 1 }}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#174a7c' }}>
                  Attach Document
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  bgcolor: '#ffffff',
                  p: 4,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  minHeight: '300px',
                  justifyContent: 'center',
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 80, color: '#174a7c', opacity: 0.6 }} />
                <Typography variant="h6" sx={{ color: '#666', textAlign: 'center' }}>
                  Upload prescription documents
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AttachFileIcon />}
                  onClick={() => chatFileRef.current?.click()}
                  sx={{
                    bgcolor: '#174a7c',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      bgcolor: '#0d3a5f',
                    },
                  }}
                >
                  Choose File
                </Button>
                <input
                  type="file"
                  hidden
                  ref={chatFileRef}
                  onChange={handleChatFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Typography variant="caption" sx={{ color: '#666', textAlign: 'center' }}>
                  Supported formats: PDF, DOC, DOCX, JPG, PNG
                </Typography>
              </Box>
              
              {/* Show uploaded documents in history */}
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#174a7c',
                    mb: 2,
                    px: 1,
                  }}
                >
                  Uploaded Documents
                </Typography>
                
                {isLoadingComments ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <CircularProgress size={40} sx={{ color: '#174a7c' }} />
                  </Box>
                ) : comments.filter(c => c.text.includes('📎')).length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                      No documents uploaded yet.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {comments.filter(c => c.text.includes('📎')).map((commentItem) => (
                      <Box
                        key={commentItem.id}
                        sx={{
                          bgcolor: '#ffffff',
                          p: 2.5,
                          borderRadius: 2,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                          borderLeft: '4px solid #174a7c',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#174a7c',
                              fontWeight: 600,
                              bgcolor: '#e8f0f7',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            {commentItem.date}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ color: '#999' }}
                          >
                            {commentItem.time}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#333',
                            lineHeight: 1.6,
                          }}
                        >
                          {commentItem.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions 
          sx={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            px: 3,
            py: 2,
          }}
        >
          <Button 
            variant="outlined" 
            onClick={handleClosePrescriptionModal}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={handleClosePrescriptionModal}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              bgcolor: '#174a7c',
              '&:hover': {
                bgcolor: '#0d3a5f',
              },
            }}
          >
            Save & Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConsultationPopup; 
