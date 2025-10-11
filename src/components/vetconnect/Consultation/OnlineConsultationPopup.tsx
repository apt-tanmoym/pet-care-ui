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
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import { sampleMedicalRecord } from "@/components/manageEncounter/sampleMedicalRecord";
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
}

interface ConsultationPopupProps {
  consultation: ConsultationItem;
}

const ConsultationPopup: React.FC<ConsultationPopupProps> = ({
  consultation,
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
  const [openPopup, setOpenPopup] = useState(false);
  const [openChatModal, setOpenChatModal] = useState(false);
  
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
      if (openChatModal) {
        setIsLoadingComments(true);
        try {
          const payload = {
            userName: "jibons",
            userPass: "P@ssw0rd",
            deviceStat: "M",
            appointmentId: 1428
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
  }, [openChatModal]);

  const handleFileChange =
    (label: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        console.log(`File uploaded from [${label}]:`, file.name);
        // Handle file upload logic here
      }
    };

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleOpenChatModal = () => {
    setOpenChatModal(true);
  };

  const handleCloseChatModal = () => {
    setOpenChatModal(false);
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

    setIsSubmitting(true);
    try {
      const payload = {
        userName: "jibons",
        userPass: "P@ssw0rd",
        deviceStat: "M",
        patientId: 9,
        appointmentId: 1428,
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
            userName: "jibons",
            userPass: "P@ssw0rd",
            deviceStat: "M",
            appointmentId: 1428
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
              sx={{ fontWeight: 500, color: "#2196F3", mb: 0.5 }}
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
                sx={{ bgcolor: "#2196F3" }}
                onClick={handleOpenChatModal}
              >
                ONLINE CONSULTATION
              </Button>
              <Button variant="outlined" onClick={handleOpenPopup}>
                Add Prescription
              </Button>
              <Button
                variant="outlined"
                onClick={() => addDocRef.current?.click()}
              >
                Add Documents
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
          sx={{ fontWeight: 700, color: "#2196F3" }}
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
            sx={{ fontWeight: 700, color: "#2196F3" }}
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
            sx={{ fontWeight: 700, color: "#2196F3" }}
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
          sx={{ fontWeight: 700, color: "#2196F3", mb: 1 }}
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
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={() => docUploadRef.current?.click()}
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
          sx={{ fontWeight: 700, color: "#2196F3", mt: 3, mb: 1 }}
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
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={() => docUploadRef.current?.click()}
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

      {/* Popup for ManageEncounter */}
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
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
        <DialogTitle sx={{backgroundColor: '#4B6CB7', color:'white'}}>Add Prescription</DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            flexGrow: 1,
            display: 'flex',
            overflow: 'hidden',
            position: 'relative', 
          }}
        >
          <ManageEncounter record={sampleMedicalRecord} />
        </DialogContent>
        <DialogActions 
        sx={{background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"}}>
          <Button variant="contained" onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Prescription Comments Modal */}
      <Dialog
        open={openChatModal}
        onClose={handleCloseChatModal}
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
                placeholder="Type your prescription comments or use voice input..."
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
                        color={isRecording ? 'error' : 'primary'}
                        sx={{
                          bgcolor: isRecording ? '#ffebee' : '#e3f2fd',
                          '&:hover': {
                            bgcolor: isRecording ? '#ffcdd2' : '#bbdefb',
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

            <Divider sx={{ my: 2 }} />

            {/* File Attachment */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                onClick={() => chatFileRef.current?.click()}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: '#174a7c',
                  color: '#174a7c',
                  px: 2.5,
                  py: 1,
                  '&:hover': {
                    borderColor: '#0d3a5f',
                    bgcolor: '#e8f0f7',
                  },
                }}
              >
                Attach Document
              </Button>
              <input
                type="file"
                hidden
                ref={chatFileRef}
                onChange={handleChatFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Typography variant="caption" sx={{ color: '#666' }}>
                Attach prescriptions, lab reports, or images
              </Typography>
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
            onClick={handleCloseChatModal}
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
            onClick={handleCloseChatModal}
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