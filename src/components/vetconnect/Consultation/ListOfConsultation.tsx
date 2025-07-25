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
import dayjs from "dayjs";
import "dayjs/locale/en";
import ConsultationPopup from "./OnlineConsultationPopup";
import OfflineConsultationPopup from "./OfflineConsultationPopup";

interface ConsultationItem {
  petName: string;
  ownerName: string;
  timeRange: string;
  imageUrl?: string;
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

  const handleArrive = (index: number, consultation: ConsultationItem) => {
    setArrivedConsultations((prev) => new Set(prev).add(index));
    onArriveClick?.(consultation);
  };

  const handleConsultOnline = (consultation: ConsultationItem) => {
    setSelectedConsultation(consultation);
    setOpenOnlinePopup(true);
  };

  const handleConsultOffline = (consultation: ConsultationItem) => {
    setSelectedConsultation(consultation);
    setOpenOfflinePopup(true);
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
                    onClick={() => handleConsultOnline(consultation)}
                    sx={{
                      bgcolor: "#2196F3",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                      "&:hover": { bgcolor: "#1976D2" },
                    }}
                  >
                    CONSULT ONLINE
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleConsultOffline(consultation)}
                    sx={{
                      bgcolor: "#FFCA28",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                      "&:hover": { bgcolor: "#FFB300" },
                    }}
                  >
                    CONSULT OFFLINE
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handleArrive(index, consultation)}
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
                  }}
                >
                  ARRIVE
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
          {selectedConsultation && <ConsultationPopup consultation={selectedConsultation} />}
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
          {selectedConsultation && <OfflineConsultationPopup consultation={selectedConsultation} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ListOfConsultation;
