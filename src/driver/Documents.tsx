import React, { useState, ChangeEvent, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  UploadCloud,
  Fingerprint,
  CreditCard,
  FileText,
  X,
  ShieldCheck,
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import Api from "../Api/ApiService";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf",];

export default function DocumentsVerify() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const [form, setForm] = useState({
    aadhaarNumber: "",
    licenseNumber: "",
    aadhaarFile: null as File | null,
    licenseFile: null as File | null,
    aadhaarPreview: null as string | null,
    licensePreview: null as string | null,
  });



  const isFormValid = useMemo(() => {
    return (
      form.aadhaarNumber.length >= 12 &&
      form.licenseNumber.length >= 5 &&
      form.aadhaarFile !== null &&
      form.licenseFile !== null
    );
  }, [form]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'license') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please use JPG, PNG or PDF.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

    setForm(prev => ({
      ...prev,
      [`${type}File`]: file,
      [`${type}Preview`]: preview
    }));
  };

  const removeFile = (type: 'aadhaar' | 'license') => {
    setForm(prev => ({
      ...prev,
      [`${type}File`]: null,
      [`${type}Preview`]: null
    }));
  };

  const getDriverData = () => {
    const driverProfileImage = localStorage.getItem("driverProfileImage") || "";
    const driverLocation = JSON.parse(localStorage.getItem("driverLocation") || "{}");
    const driverRegisterData = JSON.parse(localStorage.getItem("driverRegisterData") || "{}");
    const place = localStorage.getItem('place');

    if (driverRegisterData.email) {
      localStorage.setItem("Driveremail", driverRegisterData.email);
    }

    return {
      ...driverRegisterData,
      profileImage: driverProfileImage,
      location: driverLocation,
      aadhaarNumber: form.aadhaarNumber,
      licenseNumber: form.licenseNumber,
      place
    };
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const uploadWithProgress = async (file: File, key: string, name: string) => {
        const response = await Api.getSignedUrls(file.type, name);
        if (!response || !response.signedUrl) throw new Error(`Failed to get signature for ${name}`);
        
        const signedData = response.signedUrl;
        return await Api.uploadFile(file, signedData, (percent) => {
          setUploadProgress(prev => ({ ...prev, [key]: percent }));
        });
      };

      // Concurrent Uploads with individual progress
      const [aadhaarUrl, licenseUrl] = await Promise.all([
        uploadWithProgress(form.aadhaarFile!, 'aadhaar', 'aadhaar'),
        uploadWithProgress(form.licenseFile!, 'license', 'license')
      ]);

      const driverData = {
        ...getDriverData(),
        aadhaarImage: aadhaarUrl,
        licenseImage: licenseUrl,
      };

      const response = await Api.registerUser(driverData, "drivers");

      if (response.success) {
        toast.success("Application submitted successfully!");
        localStorage.removeItem("driverProfileImage");
        localStorage.removeItem("driverLocation");
        localStorage.removeItem("driverRegisterData");
        localStorage.removeItem('place');

        setTimeout(() => navigate("/otp-verification?role=drivers"), 2000);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: any) {

      toast.error(error.message || "An error occurred during submission");
      setIsSubmitting(false);
    }
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
        p: { xs: 2, md: 4 }
      }}
    >
      {/* Background Watermark */}
      <Box sx={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h1" sx={{ fontSize: '25vw', fontWeight: 900, color: 'white' }}>SARATHI</Typography>
      </Box>

      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(24px)",
              borderRadius: "32px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              p: { xs: 4, md: 6 },
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
          >
            {/* Header Area */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, gap: 1.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#6366f1', boxShadow: '0 0 15px rgba(99, 102, 241, 0.6)' }} />
                <Typography sx={{ ml: 1, color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' }}>
                  STEP 3 OF 3: VERIFICATION CENTER
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 800, mb: 1.5 }}>
                Secure Document Upload
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", maxWidth: '500px', mx: 'auto' }}>
                Verify your identity to complete your driver profile. Your data is encrypted and used only for internal verification.
              </Typography>
            </Box>

            {/* Document Forms Container */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>

              {/* Aadhaar Section */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Fingerprint size={18} color="#6366f1" /> Aadhaar Verification
                </Typography>
                <TextField
                  fullWidth
                  placeholder="12-Digit Aadhaar Number"
                  value={form.aadhaarNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                  sx={fieldStyle}
                  inputProps={{ style: { letterSpacing: '2px', fontWeight: 700 } }}
                />

                <DocumentDropzone
                  file={form.aadhaarFile}
                  preview={form.aadhaarPreview}
                  progress={uploadProgress.aadhaar}
                  onFileSelect={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'aadhaar')}
                  onRemove={() => removeFile('aadhaar')}
                  label="Aadhaar Card (Front/Back)"
                />
              </Box>

              {/* License Section */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCard size={18} color="#6366f1" /> Driving License
                </Typography>
                <TextField
                  fullWidth
                  placeholder="License ID Number"
                  value={form.licenseNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, licenseNumber: e.target.value.toUpperCase() }))}
                  sx={fieldStyle}
                />

                <DocumentDropzone
                  file={form.licenseFile}
                  preview={form.licensePreview}
                  progress={uploadProgress.license}
                  onFileSelect={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'license')}
                  onRemove={() => removeFile('license')}
                  label="Driving License Copy"
                />
              </Box>
            </Box>

            {/* Privacy Trust Layer */}
            <Box
              sx={{
                mt: 6,
                p: 2,
                bgcolor: 'rgba(16, 185, 129, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <ShieldCheck size={24} color="#10b981" />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>🔒 Encrypted & Secure:</span> Your documents are securely encrypted and used strictly for identity verification. We never share your sensitive data with third parties.
              </Typography>
            </Box>

            {/* Action Area */}
            <Box sx={{ mt: 5 }}>
              <Button
                fullWidth
                variant="contained"
                disabled={!isFormValid || isSubmitting}
                onClick={handleSubmit}
                sx={{
                  py: 2,
                  borderRadius: "16px",
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  bgcolor: isFormValid ? "#6366f1" : "rgba(255,255,255,0.05)",
                  boxShadow: isFormValid ? "0 10px 30px -5px rgba(99, 102, 241, 0.5)" : "none",
                  "&:hover": { bgcolor: "#4f46e5", transform: isFormValid ? "translateY(-2px)" : "none" },
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={20} color="inherit" />
                    Uploading Details...
                  </Box>
                ) : (
                  "Complete Verification & Join Sarathi"
                )}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
      <ToastContainer theme="dark" position="top-center" />
    </Box>
  );
}

// Sub-component for Dropzone UI
const DocumentDropzone = ({ file, preview, progress, onFileSelect, onRemove, label }: any) => (
  <Box sx={{ mt: 2, position: 'relative' }}>
    <AnimatePresence mode="wait">
      {!file ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Box
            component="label"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              border: '2px dashed rgba(255,255,255,0.1)',
              borderRadius: '20px',
              cursor: 'pointer',
              bgcolor: 'rgba(255,255,255,0.02)',
              "&:hover": { borderColor: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.05)' },
              transition: 'all 0.2s'
            }}
          >
            <input type="file" hidden accept={ALLOWED_FILE_TYPES.join(',')} onChange={onFileSelect} />
            <UploadCloud size={32} color="rgba(255,255,255,0.3)" style={{ marginBottom: '12px' }} />
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{label}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>JPG, PNG or PDF (Max 5MB)</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, opacity: 0.5 }}>
              <Camera size={14} color="white" />
              <Typography variant="caption" sx={{ color: 'white' }}>Tap to capture or select</Typography>
            </Box>
          </Box>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Box sx={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(99, 102, 241, 0.3)', bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
            {preview ? (
              <Box component="img" src={preview} sx={{ width: '100%', height: '160px', objectFit: 'cover', opacity: progress !== undefined ? 0.3 : 1 }} />
            ) : (
              <Box sx={{ height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <FileText size={48} color="#6366f1" />
                <Typography variant="caption" sx={{ color: 'white' }}>{file.name}</Typography>
              </Box>
            )}

            {/* Overlay for Progress/Remove */}
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {progress !== undefined ? (
                <Box sx={{ textAlign: 'center', width: '80%' }}>
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', fontWeight: 900, mb: 1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                  >
                    {progress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      "& .MuiLinearProgress-bar": { bgcolor: '#6366f1' }
                    }}
                  />
                </Box>
              ) : (
                <IconButton
                  onClick={onRemove}
                  sx={{
                    position: 'absolute', top: 8, right: 8,
                    bgcolor: 'rgba(0,0,0,0.5)', color: 'white',
                    "&:hover": { bgcolor: '#f43f5e' }
                  }}
                >
                  <X size={16} />
                </IconButton>
              )}
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  </Box>
);

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
};

const CircularProgress = ({ size, sx }: any) => (
  <Box sx={{ display: 'inline-flex', ...sx }}>
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.1)',
        borderTopColor: 'white',
        animation: 'spin 1s linear infinite'
      }}
    />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </Box>
);
