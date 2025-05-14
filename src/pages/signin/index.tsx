import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Snackbar,
  Alert,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Image from 'next/image';
import styles from './styles.module.scss';
import axiosInstance from "@/common/http";
import { useAuth } from "@/common/context/AuthContext";

const SignIn: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Loading overlay state
  const [isLoading, setIsLoading] = useState(false);

  // Sign-in form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Handle email verification on page load
  useEffect(() => {
    const { action, uid, token } = router.query as { action?: string; uid?: string; token?: string };

    if (action === "verifyEmail" && uid && token) {
      verifyEmail(uid, token);
    }
  }, [router.query]);

  // Verify email API call
  const verifyEmail = async (uid: string, token: string) => {
    setIsLoading(true); // Show loading overlay
    try {
      await axiosInstance.put(`traveler/${uid}/verifyEmail`, { userId: uid, token });
      setSnackbarMessage("Email verified successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Email verification failed. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setIsLoading(false); // Hide loading overlay
      setSnackbarOpen(true); // Show snackbar
    }
  };

  // Sign-in API call
  const handleSignIn = async () => {
    // Validate inputs
    let valid = true;
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (password.length < 6) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!valid) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/traveler/login", { email, password });
      
      // Update to match new response structure
      const { token, user } = response.data.data;
      
      if (!user._id) {
        throw new Error('User ID not found in response');
      }

      // Store user data
      localStorage.setItem('userId', user._id);
      localStorage.setItem('username', user.name);
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.roleType); // Store role type
      localStorage.setItem('userProject', user.project); // Store project
      
      setSnackbarMessage("Sign-in successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      
      // Pass user info to login context
      login(token, user.email);
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Sign-in failed. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close snackbar
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Side - Admin Theme */}
      <Box className={styles.leftSide}>
        <div className={styles.leftContent}>
          <div className={styles.logoWrapper}>
            <Image
              src="/images/logo/apts_logo.png"
              alt="aptcarePetWeb  Admin"
              width={300}
              height={100}
              className={styles.logo}
            />
          </div>
          <div className={styles.adminIllustration}>
            <Image
              src="/images/logo/dashboard.png"
              alt="Admin Dashboard"
              width={400}
              height={300}
              className={styles.illustration}
            />
          </div>
          <Typography variant="h4" className={styles.welcomeText}>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" className={styles.subText}>
            Manage bookings, track performance, and handle operations efficiently
          </Typography>
        </div>
      </Box>

      {/* Right Side - Keep existing form structure */}
      <Box className={styles.rightSide}>
        <div className={styles.formWrapper}>
          <Typography variant="h5" className={styles.formTitle}>
            Sign in
          </Typography>
          <Typography className={styles.formSubtitle}>
            Enter your credentials to access the dashboard
          </Typography>

          <Box component="form" className={styles.form}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? "Please enter a valid email address." : ""}
              className={styles.textField}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? "Password must be at least 6 characters." : ""}
              className={styles.textField}
            />
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleSignIn}
              className={styles.signInButton}
            >
              Sign In
            </Button>
          </Box>
        </div>
      </Box>

      {/* Keep existing Snackbar and Backdrop */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor: snackbarSeverity === "success" ? "#2e7d32" : "#d32f2f",
            color: "#fff",
            "& .MuiAlert-icon": { color: "#fff" },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default SignIn;
