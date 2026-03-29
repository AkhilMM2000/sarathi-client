import { useState, useCallback, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  TextField, 
  Typography, 
  Button, 
  Box, 
  CircularProgress,
  IconButton,
  InputAdornment,
  LinearProgress
} from "@mui/material";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  Phone, 
  Lock, 
  Tag, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ApiService from '../Api/ApiService';
import GoogleAuthButton from "../components/Googlesign";
import { 
  validateName, 
  validateEmail, 
  validateMobile, 
  validatePassword,
  getPasswordStrength 
} from "../utils/ValidationUtils";

const RegisterUser = () => {
  const navigate = useNavigate();
  
  // States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    referralCode: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Memoized Password Strength
  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  // Field level validation
  const validateField = useCallback((name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name": error = validateName(value) || ""; break;
      case "email": error = validateEmail(value) || ""; break;
      case "mobile": error = validateMobile(value) || ""; break;
      case "password": error = validatePassword(value) || ""; break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error on change if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.name, e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final Sync Validation
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const mobileErr = validateMobile(formData.mobile);
    const passErr = validatePassword(formData.password);

    if (nameErr || emailErr || mobileErr || passErr) {
      setErrors({
        name: nameErr || "",
        email: emailErr || "",
        mobile: mobileErr || "",
        password: passErr || "",
      });
      return;
    }

    setLoading(true);
    try {
      await ApiService.registerUser(formData, "users");
      localStorage.setItem("email", formData.email);
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/otp-verification?role=users");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.toString().toLowerCase();
      
      // Inline Error Mapping for common backend conflicts
      if (errorMsg.includes("email")) {
        setErrors(prev => ({ ...prev, email: "This email is already registered." }));
      } else if (errorMsg.includes("mobile") || errorMsg.includes("phone")) {
        setErrors(prev => ({ ...prev, mobile: "This mobile number is already in use." }));
      } else {
        toast.error(error.toString(), { position: "top-center", autoClose: 3000 });
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <Box 
      className="flex justify-center items-center min-h-screen w-full p-4 overflow-hidden"
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        position: 'relative'
      }}
    >
      {/* Background Micro-interaction Elements */}
      <Box 
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />

      {/* Decorative Brand Watermark Layer */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        <motion.div
           animate={{ 
            y: [0, -20, 0],
            rotate: [-15, -14, -15]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{
            position: 'absolute',
            left: '-2%',
            top: '15%',
            fontSize: '14vw',
            fontWeight: 900,
            color: 'rgba(255, 255, 255, 0.015)',
            textShadow: '0 0 20px rgba(79, 70, 229, 0.1), 0 0 40px rgba(79, 70, 229, 0.05)',
            lineHeight: 1,
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          SARATHI
        </motion.div>

        <motion.div
           animate={{ 
            y: [0, 25, 0],
            rotate: [-15, -16, -15]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          style={{
            position: 'absolute',
            right: '-10%',
            bottom: '10%',
            fontSize: '18vw',
            fontWeight: 900,
            color: 'rgba(255, 255, 255, 0.02)',
            textShadow: '0 0 30px rgba(99, 102, 241, 0.15)',
            lineHeight: 1,
            userSelect: 'none',
            whiteSpace: 'nowrap'
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
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            color: 'white'
          }}
        >
          <CardContent className="p-8 md:p-10">
            <motion.div variants={itemVariants}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em', textAlign: 'center' }}>
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', mb: 4 }}>
                Join Sarathi for a premium travel experience
              </Typography>
            </motion.div>

            <form onSubmit={handleSubmit} noValidate>
              <Box className="space-y-4">
                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="FullName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={18} className={errors.name ? "text-red-400" : "text-blue-400"} />
                        </InputAdornment>
                      ),
                      sx: { color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }
                    }}
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                    sx={{ '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' } }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={18} className={errors.email ? "text-red-400" : "text-blue-400"} />
                        </InputAdornment>
                      ),
                      sx: { color: 'white' }
                    }}
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.mobile}
                    helperText={errors.mobile}
                    placeholder="6xxxxxxxxx"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone size={18} className={errors.mobile ? "text-red-400" : "text-blue-400"} />
                        </InputAdornment>
                      ),
                      sx: { color: 'white' }
                    }}
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Create Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={18} className={errors.password ? "text-red-400" : "text-blue-400"} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { color: 'white' }
                    }}
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                  />
                  {/* Strength Indicator */}
                  <Box sx={{ mt: 1, px: 0.5 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={strength.percentage} 
                      sx={{ 
                        height: 4, 
                        borderRadius: 2, 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': { bgcolor: strength.color }
                      }} 
                    />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5, display: 'block' }}>
                      Strength: <span style={{ color: strength.color }}>{strength.label}</span>
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Referral Code (Optional)"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tag size={18} className="text-blue-400" />
                        </InputAdornment>
                      ),
                      sx: { color: 'white' }
                    }}
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading || isSuccess}
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      background: isSuccess ? '#00c853' : 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
                      boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': { background: 'linear-gradient(90deg, #4338ca 0%, #4f46e5 100%)' },
                      '&:active': { transform: 'scale(0.98)' },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                          <CircularProgress size={16} color="inherit" thickness={6} />
                          <span>Creating account...</span>
                        </motion.div>
                      ) : isSuccess ? (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                          <CheckCircle2 size={20} />
                          <span>Finalizing...</span>
                        </motion.div>
                      ) : (
                        <motion.div key="default" className="flex items-center gap-2">
                          <span>Sign Up</span>
                          <ArrowRight size={18} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Box className="flex items-center my-2">
                    <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
                    <Typography variant="caption" sx={{ px: 2, color: 'rgba(255,255,255,0.3)' }}>or</Typography>
                    <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
                  </Box>
                  
                  <Box sx={{ scale: '0.95', mt: -1 }}>
                    <GoogleAuthButton role="user" />
                  </Box>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center pt-2">
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Already have an account?{" "}
                    <Button 
                      onClick={() => navigate('/login')}
                      sx={{ 
                        color: '#818cf8', 
                        fontWeight: 600, 
                        p: 0, 
                        minWidth: 'auto',
                        textTransform: 'none',
                        '&:hover': { color: '#a5b4fc', bgcolor: 'transparent', textDecoration: 'underline' }
                      }}
                    >
                      Login
                    </Button>
                  </Typography>
                </motion.div>
              </Box>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <ToastContainer theme="dark" position="top-center" />
    </Box>
  );
};

export default RegisterUser;
