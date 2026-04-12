import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  CircularProgress,
  TextField 
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  ShieldCheck, 
  RefreshCcw, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

import ApiService from '../Api/ApiService';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = (params.get("role") as "users" | "drivers") || "users";

  // States
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  // Refs for input focus management
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize email from storage based on role
  useEffect(() => {
    const storedEmail = role === "drivers" 
      ? localStorage.getItem("Driveremail") 
      : localStorage.getItem("email");

    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("No registration session found. Please register again.", {
        position: "top-center",
        theme: "dark"
      });
      // Optionally redirect back to register if no email found
      // navigate('/register');
    }
  }, [role]);

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Handle OTP submission
  const handleSubmit = useCallback(async (finalOtp?: string) => {
    const otpValue = finalOtp || otp.join("");
    if (otpValue.length < 6) return;

    setLoading(true);
    try {
      const response = await ApiService.verifyOtp(otpValue, email, role);
      
      if (response.success) {
        setIsSuccess(true);
        
        setTimeout(() => {
          if (response.user.role === "driver") {
            localStorage.removeItem("Driveremail");
            toast.info("Registration complete! Please wait for admin approval.", {
              position: "top-center",
              theme: "dark"
            });
            navigate("/login?type=driver");
          } else {
            localStorage.removeItem("email");
            localStorage.setItem(`user_accessToken`, response.accessToken);
            toast.success("Welcome! Registration successful.", {
              position: "top-center",
              theme: "dark"
            });
            navigate("/userhome");
          }
        }, 1500);
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Invalid verification code.";
      toast.error(errorMsg, { position: "top-center", theme: "dark" });
      // Reset OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [otp, email, role, navigate]);

  // Handle input changes
  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all fields filled
    if (index === 5 && value) {
      const fullOtp = [...newOtp.slice(0, 5), value].join("");
      handleSubmit(fullOtp);
    }
  };

  // Handle backspace logic (MOVE BACK AND CLEAR)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Current empty, move to previous
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Just clear current
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle Paste Support
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    // Focus last field or submit
    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  // Handle Resend
  const handleResend = async () => {
    setResending(true);
    try {
      await ApiService.resendOTP(email, role === "drivers" ? "driver" : "user");
      setOtp(["", "", "", "", "", ""]);
      setTimer(60); // Longer reset window for luxury feel
      setCanResend(false);
      toast.success("Verification code resent successfully.", { position: "top-center", theme: "dark" });
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error("Failed to resend code. Please try again.", { theme: "dark" });
    } finally {
      setResending(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box 
      className="flex justify-center items-center min-h-screen w-full p-4 overflow-hidden"
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        position: 'relative'
      }}
    >
      {/* Background Decorative Layer (Same as Register for continuity) */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0
        }}
      >
        <motion.div
           animate={{ y: [0, -20, 0], rotate: [-15, -14, -15] }}
           transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
           style={{
             position: 'absolute', left: '-2%', top: '15%', fontSize: '14vw',
             fontWeight: 900, color: 'rgba(255, 255, 255, 0.015)',
             textShadow: '0 0 20px rgba(79, 70, 229, 0.1)', whiteSpace: 'nowrap'
           }}
        >
          SARATHI
        </motion.div>
        <motion.div
           animate={{ y: [0, 25, 0], rotate: [-15, -16, -15] }}
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
           style={{
             position: 'absolute', right: '-10%', bottom: '10%', fontSize: '18vw',
             fontWeight: 900, color: 'rgba(255, 255, 255, 0.02)',
             textShadow: '0 0 30px rgba(99, 102, 241, 0.15)', whiteSpace: 'nowrap'
           }}
        >
          SARATHI
        </motion.div>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ zIndex: 10, width: '100%', maxWidth: '440px' }}
      >
        <Card 
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            color: 'white'
          }}
        >
          <CardContent className="p-8 md:p-10">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <Box className="flex justify-center mb-4">
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: '20px', 
                    background: 'rgba(79, 70, 229, 0.2)',
                    color: '#818cf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ShieldCheck size={32} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                Verify OTP
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                We've sent a 6-digit code to <br />
                <span className="text-white font-semibold">{email || "your email"}</span>
              </Typography>
            </motion.div>

            {/* OTP Input Fields */}
            <div className="flex justify-between gap-2 mb-8">
              {otp.map((digit, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileFocus={{ scale: 1.05 }}
                  style={{ width: '100%' }}
                >
                  <TextField
                    inputRef={el => inputRefs.current[index] = el}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e: any) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    inputProps={{ 
                      maxLength: 1, 
                      className: "text-center text-xl md:text-2xl font-bold",
                      style: { padding: '12px 0' },
                      "aria-label": `Digit ${index + 1}`
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&.Mui-focused fieldset': { 
                          borderColor: '#6366f1',
                          boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
                        }
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="space-y-6">
              <Button
                fullWidth
                onClick={() => handleSubmit()}
                disabled={loading || isSuccess || otp.some(d => !d)}
                sx={{
                  py: 1.8,
                  borderRadius: '16px',
                  background: isSuccess ? '#059669' : 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
                  boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:disabled': { opacity: 0.6, color: 'rgba(255,255,255,0.5)' },
                  '&:active': { transform: 'scale(0.98)' }
                }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <CircularProgress size={16} color="inherit" thickness={6} />
                      <span>Verifying...</span>
                    </motion.div>
                  ) : isSuccess ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                      <CheckCircle2 size={20} />
                      <span>Verified!</span>
                    </motion.div>
                  ) : (
                    <span key="default">Verify Now</span>
                  )}
                </AnimatePresence>
              </Button>

              <Box className="flex flex-col items-center gap-4">
                {canResend ? (
                  <Button 
                    variant="text" 
                    onClick={handleResend}
                    disabled={resending}
                    startIcon={resending ? <CircularProgress size={14} /> : <RefreshCcw size={16} />}
                    sx={{ 
                      color: '#818cf8', 
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': { color: '#a5b4fc', bgcolor: 'rgba(99, 102, 241, 0.1)' }
                    }}
                  >
                    Resend Code
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-rgba(255,255,255,0.4)">
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      Resend code in <span className="text-white font-mono font-bold tracking-wider">{timer}s</span>
                    </Typography>
                  </div>
                )}

                <Button 
                  startIcon={<ArrowLeft size={16} />}
                  onClick={() => navigate(-1)}
                  sx={{ 
                    color: 'rgba(255,255,255,0.4)', 
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    '&:hover': { color: 'white', bgcolor: 'transparent' }
                  }}
                >
                  Back to Registration
                </Button>
              </Box>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
    </Box>
  );
};

export default OTPVerification;
