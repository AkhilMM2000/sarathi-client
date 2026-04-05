import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment, 
  IconButton
} from "@mui/material";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { 
  validateName, 
  validateEmail, 
  validateMobile, 
  validatePassword,
  getPasswordStrength 
} from "../utils/ValidationUtils";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export default function DriverRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem("driverRegisterData");
    return savedData ? JSON.parse(savedData) : {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const strengthData = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error on change
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const mobileError = validateMobile(formData.mobile);
    if (mobileError) newErrors.mobile = mobileError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
     
      return;
    }

    const { confirmPassword, ...dataToSend } = formData;
    localStorage.setItem("driverRegisterData", JSON.stringify(dataToSend));
    localStorage.setItem("Driveremail", formData.email); // Set for OTP later
    
    toast.success("Details saved! Let's set your location.");
    setTimeout(() => {
       navigate("/driver-location");
    }, 1000);
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "radial-gradient(circle at 20% 30%, #1e1b4b 0%, #0f172a 100%)",
        position: "relative",
        overflow: "hidden",
        p: 3
      }}
    >
      {/* Decorative Background Texture */}
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h1" sx={{ fontSize: '25vw', fontWeight: 900, color: 'white' }}>SARATHI</Typography>
      </Box>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="sm">
          <Box 
            sx={{ 
              bgcolor: "rgba(255, 255, 255, 0.03)", 
              backdropFilter: "blur(12px)", 
              borderRadius: "32px", 
              border: "1px solid rgba(255, 255, 255, 0.1)",
              p: { xs: 4, md: 6 },
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
          >
            {/* Step Indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, gap: 1.5 }}>
               <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#6366f1' }} />
               <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
               <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
               <Typography sx={{ ml: 1, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600 }}>
                 Step 1 of 3: Basic Details
               </Typography>
            </Box>

            <Typography variant="h4" sx={{ color: "white", fontWeight: 800, mb: 1, textAlign: "center" }}>
              Join the Fleet
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 4, textAlign: "center" }}>
              Reach more passengers and grow your earnings with Sarathi.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box className="space-y-5">
                <TextField
                  fullWidth
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><User size={20} color={errors.name ? "#f43f5e" : "#6366f1"} /></InputAdornment>,
                  }}
                  sx={fieldStyle}
                />

                <TextField
                  fullWidth
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Mail size={20} color={errors.email ? "#f43f5e" : "#6366f1"} /></InputAdornment>,
                  }}
                  sx={fieldStyle}
                />

                <TextField
                  fullWidth
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Phone size={20} color={errors.mobile ? "#f43f5e" : "#6366f1"} /></InputAdornment>,
                  }}
                  sx={fieldStyle}
                />

                <Box sx={{ position: 'relative' }}>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock size={20} color={errors.password ? "#f43f5e" : "#6366f1"} /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={fieldStyle}
                  />
                  {/* Strength Bar */}
                  <Box sx={{ height: 4, width: '100%', bgcolor: 'rgba(255,255,255,0.05)', mt: 1, borderRadius: 2, overflow: 'hidden' }}>
                     <Box 
                       sx={{ 
                         height: '100%', 
                         width: `${strengthData.percentage}%`, 
                         transition: 'all 0.3s ease',
                         bgcolor: strengthData.color
                       }} 
                     />
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock size={20} color={errors.confirmPassword ? "#f43f5e" : "#6366f1"} /></InputAdornment>,
                  }}
                  sx={fieldStyle}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  endIcon={<ChevronRight size={20} />}
                  sx={{
                    py: 2,
                    borderRadius: "16px",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "1.05rem",
                    bgcolor: "#6366f1",
                    mt: 2,
                    boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
                    "&:hover": { bgcolor: "#4f46e5", transform: "translateY(-1px)" },
                    transition: "all 0.2s"
                  }}
                >
                  Continue to Location
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
                Already have a driver account?{" "}
                <Button 
                  onClick={() => navigate('/login?type=driver')} 
                  sx={{ color: "#818cf8", fontWeight: 700, textTransform: "none", '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                >
                  Log In
                </Button>
              </Typography>
            </Box>
          </Box>
        </Container>
      </motion.div>
      <ToastContainer theme="dark" position="top-center" />
    </Box>
  );
}

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: "16px",
    bgcolor: "rgba(255, 255, 255, 0.03)",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
  },
  "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.3)", opacity: 1 },
  "& .MuiFormHelperText-root": { color: "#f43f5e", mx: 1 }
};
