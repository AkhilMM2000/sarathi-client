import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Modal,
  TextField,
  IconButton,
  Avatar,
  Snackbar,
  Alert,
  Container,
  alpha,
  useTheme,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import { 
  MessageSquare, 
  Video, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Navigation,
  Clock, 
  ArrowRight,
  TrendingUp,
  History,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../store/ReduxStore";
import { DriverAPI } from "../Api/AxiosInterceptor";
import EnhancedPagination from "../components/Adwancepagination";
import ChatModal from "../components/chat";
import { CreatesocketConnection } from "../constant/socket";
import { useCallRequest } from "../hooks/useCallRequest";
import EnhancedAlerts from "../components/Alert";

// --- Types ---
interface User {
  _id: string;  
  name: string;
}

interface Booking {
  _id: string;
  fromLocation?: string;
  toLocation?: string;
  startDate: string;
  endDate?: string;
  estimatedKm: number;
  estimatedFare: number;
  reason?: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  bookingType: string;
  name: string;
  place: string,
  email: string,
  profile: string,
  mobile: string
  userId?: User
  finalFare: number
}

// --- Styles ---
const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  p: 4,
  borderRadius: 4,
  outline: 'none',
  backdropFilter: 'blur(20px)', // High blur for the backdrop
};

const DriverBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<'CONFIRMED' | 'REJECTED' | 'COMPLETED' | null>(null);
  const [reason, setReason] = useState('');
  const [bookingId, setBookingId] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [finalKm, setFinalKm] = useState<string>('');
  const [openChat, setOpenChat] = useState(false);
  const [chatRideId, setChatRideId] = useState<string | null>(null);
  const [recieverId, setRecieverId] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const theme = useTheme();

  // --- Theme Colors ---
  const colors = {
    bgMain: "#f8fafc", // Very light slate/white
    bgCard: "#ffffff", // Pure white card
    accentPrimary: "#0284c7", // Slightly deeper Cyan for white bg contrast
    accentSecondary: "#4f46e5", // Deeper Indigo
    textPrimary: "#0f172a", // Deep slate for text
    textSecondary: "#64748b", // Slate 500
    statusSuccess: "#10b981", // Emerald
    statusWarning: "#f59e0b", // Amber
    statusError: "#ef4444", // Red
    border: "rgba(15, 23, 42, 0.08)", // Subtle dark border
  };

  const fetchBookings = async (currentPage: number) => {
    try {
      setLoading(true);
      const response = await DriverAPI.get(`/bookings?page=${currentPage}&limit=2`);
      setBookings(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page, refresh]);

  const authdriver = useSelector((state: RootState) => state.driverStore.driver);
  const { initiateCall, calling, setCallAlert } = useCallRequest();

  const handleCall = (fromId: string, toId: string, callerName: string, role: "user" | "driver") => {
    initiateCall({ fromId, toId, callerName, role });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const socket = CreatesocketConnection();

    socket.on("cancel:booking", ({ status, reason, bookingId }) => {
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status, reason } : b));
    });

    socket.on("walletRidepaymentSuccess", ({ rideId }) => {
      setBookings((prev) => prev.filter((b) => b._id !== rideId));
      setSnackbarMessage("Payment received successfully via Wallet!");
      setSnackbarOpen(true);
    });

    socket.on("cancelbookingSuccess", ({ message, rideId }) => {
      setBookings((prev) => prev.filter((b) => b._id !== rideId));
      setSnackbarMessage(message || "Ride has been cancelled.");
      setSnackbarOpen(true);
    });

    socket.on("ridePaymentSuccessAck", ({ message, rideId }) => {
      setBookings((prev) => prev.filter((b) => b._id !== rideId));
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    });

    socket.on('payment:status', ({ bookingId }) => {
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    });

    socket.on('booking:new', ({ newRide }: { newRide: Booking }) => {
      setBookings((prev) => [newRide, ...prev].slice(0, 2));
    });

    return () => {
      socket.off('booking:new');
      socket.off("cancel:booking");
      socket.off("walletRidepaymentSuccess");
      socket.off("cancelbookingSuccess");
      socket.off("ridePaymentSuccessAck");
      socket.off('payment:status');
    };
  }, []);

  const handleOpen = (id: string, type: 'CONFIRMED' | 'REJECTED' | 'COMPLETED') => {
    setActionType(type);
    setBookingId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActionType(null);
    setReason('');
    setBookingId('');
    setFinalKm('');
  };

  const handleSubmit = async () => {
    if (!bookingId || !actionType) return;
    if (actionType === 'REJECTED' && !reason.trim()) return;
    if (actionType === 'COMPLETED' && !finalKm.trim()) return;

    setLoading(true);
    try {
      await DriverAPI.patch(`/booking-status/${bookingId}`, {
        status: actionType,
        ...(actionType === 'REJECTED' && { reason: reason.trim() }),
        ...(actionType === 'COMPLETED' && { finalKm: Number(finalKm) }),
      });
      setSuccess(true);
      setRefresh((prev) => !prev);
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh" bgcolor={colors.bgMain}>
        <CircularProgress sx={{ color: colors.accentPrimary }} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: colors.bgMain, 
        color: colors.textPrimary,
        py: 6,
        px: { xs: 2, sm: 4, md: 8 }
      }}
    >
      <EnhancedAlerts
        success={success}
        error={error}
        setSuccess={setSuccess}
        setError={setError}
        successMessage="Status updated successfully!"
        autoHideDuration={4000}
      />

      <Container maxWidth="lg">
        {/* Header Section */}
        <Box mb={6} display="flex" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-1px', mb: 1 }}>
              Mission <span style={{ color: colors.accentPrimary }}>Control</span>
            </Typography>
            <Typography variant="body1" color={colors.textSecondary} display="flex" alignItems="center" gap={1}>
              <Clock size={16} /> Manage your active and upcoming rides
            </Typography>
          </Box>
          <Box display={{ xs: 'none', md: 'flex' }} gap={2}>
             <Box sx={{ bgcolor: alpha(colors.accentPrimary, 0.1), p: 2, borderRadius: 3, border: `1px solid ${alpha(colors.accentPrimary, 0.2)}` }}>
                <Typography variant="caption" color={colors.accentPrimary} fontWeight={700} textTransform="uppercase">Active Missions</Typography>
                <Typography variant="h5" fontWeight={700}>{bookings.filter(b => b.status === "CONFIRMED").length}</Typography>
             </Box>
             <Box sx={{ bgcolor: alpha(colors.statusWarning, 0.1), p: 2, borderRadius: 3, border: `1px solid ${alpha(colors.statusWarning, 0.2)}` }}>
                <Typography variant="caption" color={colors.statusWarning} fontWeight={700} textTransform="uppercase">Pending Approval</Typography>
                <Typography variant="h5" fontWeight={700}>{bookings.filter(b => b.status === "PENDING").length}</Typography>
             </Box>
          </Box>
        </Box>

        {bookings.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Box textAlign="center" py={12} sx={{ bgcolor: colors.bgCard, borderRadius: 8, border: `1px dashed ${colors.border}` }}>
              <History size={64} color={colors.textSecondary} style={{ marginBottom: '24px', opacity: 0.5 }} />
              <Typography variant="h5" fontWeight={600} mb={1}>No Missions Found</Typography>
              <Typography variant="body1" color={colors.textSecondary}>You don't have any current ride assignments.</Typography>
            </Box>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Grid container spacing={4}>
              <AnimatePresence>
                {bookings.map((booking) => (
                  <Grid item xs={12} lg={6} key={booking._id}>
                    <motion.div variants={cardVariants} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
                      <Card 
                        sx={{ 
                          bgcolor: colors.bgCard,
                          backdropFilter: 'blur(12px)',
                          borderRadius: 6,
                          border: `1px solid ${colors.border}`,
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          '&:hover': {
                            borderColor: alpha(colors.accentPrimary, 0.3),
                            boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 20px ${alpha(colors.accentPrimary, 0.05)}`,
                          }
                        }}
                      >
                        {/* Card Top Accent */}
                        <Box 
                          sx={{ 
                            height: 4, 
                            width: '100%', 
                            background: `linear-gradient(90deg, ${colors.accentPrimary}, ${colors.accentSecondary})`,
                            opacity: 0.8
                          }} 
                        />

                        <CardContent sx={{ p: 4 }}>
                          {/* Top Row: User & Quick Actions */}
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
                            <Box display="flex" alignItems="center" gap={2.5}>
                              <Box sx={{ position: 'relative' }}>
                                <Avatar 
                                  src={booking.profile ? `${import.meta.env.VITE_IMAGEURL}${booking.profile}` : ''}
                                  sx={{ width: 64, height: 64, border: `2px solid ${colors.accentPrimary}` }}
                                />
                                {booking.status === "PENDING" && (
                                  <Box 
                                    sx={{ 
                                      position: 'absolute', top: 0, right: 0, width: 16, height: 16, 
                                      bgcolor: colors.statusWarning, borderRadius: '50%', border: `2px solid ${colors.bgMain}`,
                                      animation: 'pulse 1.5s infinite'
                                    }} 
                                  />
                                )}
                              </Box>
                              <Box>
                                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>{booking.name}</Typography>
                                <Typography variant="body2" color={colors.textSecondary} display="flex" alignItems="center" gap={0.5}>
                                  <TrendingUp size={14} /> {booking.bookingType.replace('_', ' ')}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Box display="flex" gap={1.5}>
                              <Tooltip title="Start Chat">
                                <IconButton 
                                  onClick={() => {
                                    setChatRideId(booking._id);
                                    setRecieverId(booking.userId?._id || "");
                                    setOpenChat(true);
                                  }}
                                  sx={{ 
                                    bgcolor: alpha(colors.accentPrimary, 0.1), color: colors.accentPrimary,
                                    '&:hover': { bgcolor: colors.accentPrimary, color: colors.bgMain }
                                  }}
                                >
                                  <MessageSquare size={20} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Video Call">
                                <IconButton 
                                  disabled={calling}
                                  onClick={() => handleCall(authdriver?._id || "", booking.userId?._id || "", authdriver?.name || "Driver", "driver")}
                                  sx={{ 
                                    bgcolor: alpha(colors.accentSecondary, 0.1), color: colors.accentSecondary,
                                    '&:hover': { bgcolor: colors.accentSecondary, color: colors.bgMain }
                                  }}
                                >
                                  <Video size={20} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>

                          {/* Middle Section: Route Info */}
                          <Box 
                            sx={{ 
                              bgcolor: alpha(colors.textPrimary, 0.03), 
                              p: 3, 
                              borderRadius: 4, 
                              mb: 4,
                              border: `1px solid ${alpha(colors.textPrimary, 0.05)}`
                            }}
                          >
                            <Box display="flex" flexDirection="column" gap={2}>
                              <Box display="flex" gap={2}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colors.accentPrimary }} />
                                  <Box sx={{ width: 1, flexGrow: 1, borderLeft: `1px dashed ${colors.textSecondary}`, my: 0.5 }} />
                                  <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: colors.statusSuccess }} />
                                </Box>
                                <Box display="flex" flexDirection="column" gap={2} flexGrow={1}>
                                   <Box>
                                      <Typography variant="caption" color={colors.textSecondary} textTransform="uppercase" fontWeight={700}>Pickup</Typography>
                                      <Typography variant="body1" fontWeight={500} noWrap>{booking.fromLocation || "Not specified"}</Typography>
                                   </Box>
                                   <Box>
                                      <Typography variant="caption" color={colors.textSecondary} textTransform="uppercase" fontWeight={700}>Destination</Typography>
                                      <Typography variant="body1" fontWeight={500} noWrap>{booking.toLocation || "Not specified"}</Typography>
                                   </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          {/* Footer Info: Fare & Dates */}
                          <Grid container spacing={2} mb={4}>
                            <Grid item xs={6}>
                               <Box>
                                  <Typography variant="caption" color={colors.textSecondary} textTransform="uppercase" fontWeight={700} display="flex" alignItems="center" gap={0.5}>
                                    <Calendar size={12} /> Schedule
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600}>
                                    {moment(booking.startDate).format("MMM DD, YYYY")}
                                  </Typography>
                               </Box>
                            </Grid>
                            <Grid item xs={6}>
                               <Box textAlign="right">
                                  <Typography variant="caption" color={colors.textSecondary} textTransform="uppercase" fontWeight={700} display="flex" alignItems="center" gap={0.5} justifyContent="flex-end">
                                    <Navigation size={12} /> Fare
                                  </Typography>
                                  <Typography variant="h5" fontWeight={800} color={colors.accentPrimary}>
                                    ₹{booking.finalFare || booking.estimatedFare}
                                  </Typography>
                               </Box>
                            </Grid>
                          </Grid>

                          {/* Action Bar */}
                          <Box mt="auto" pt={2} borderTop={`1px solid ${colors.border}`}>
                             <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                   <Box 
                                      sx={{ 
                                        display: 'inline-flex', alignItems: 'center', gap: 1, 
                                        py: 0.5, px: 2, borderRadius: 2, 
                                        bgcolor: alpha(
                                          booking.status === "PENDING" ? colors.statusWarning : 
                                          booking.status === "CONFIRMED" ? colors.accentPrimary : 
                                          colors.statusSuccess, 0.1
                                        ),
                                        color: booking.status === "PENDING" ? colors.statusWarning : 
                                               booking.status === "CONFIRMED" ? colors.accentPrimary : 
                                               colors.statusSuccess,
                                      }}
                                   >
                                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
                                      <Typography variant="caption" fontWeight={800} textTransform="uppercase">{booking.status}</Typography>
                                   </Box>
                                </Box>

                                <Box display="flex" gap={2}>
                                  {booking.status === "PENDING" && (
                                    <>
                                      <Button 
                                        variant="contained" 
                                        size="small"
                                        onClick={() => handleOpen(booking._id, "CONFIRMED")}
                                        sx={{ 
                                          bgcolor: colors.statusSuccess, color: colors.bgMain, fontWeight: 700,
                                          '&:hover': { bgcolor: alpha(colors.statusSuccess, 0.8) }
                                        }}
                                      >
                                        Accept
                                      </Button>
                                      <Button 
                                        variant="outlined" 
                                        size="small"
                                        onClick={() => handleOpen(booking._id, "REJECTED")}
                                        sx={{ 
                                          borderColor: colors.statusError, color: colors.statusError,
                                          '&:hover': { bgcolor: alpha(colors.statusError, 0.1) }
                                        }}
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                  {booking.status === "CONFIRMED" && (
                                    <Button 
                                      variant="contained" 
                                      fullWidth
                                      onClick={() => handleOpen(booking._id, "COMPLETED")}
                                      sx={{ 
                                        bgcolor: colors.accentPrimary, color: colors.bgMain, fontWeight: 700,
                                        '&:hover': { bgcolor: alpha(colors.accentPrimary, 0.8) }
                                      }}
                                      endIcon={<ArrowRight size={16} />}
                                    >
                                      Complete Mission
                                    </Button>
                                  )}
                                </Box>
                             </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </motion.div>
        )}

        <Box display="flex" justifyContent="center" mt={8}>
          <EnhancedPagination 
            count={totalPages} 
            page={page}  
            onChange={handlePageChange} 
            color="primary" 
            sx={{
              '& .MuiPaginationItem-root': { color: colors.textSecondary, borderColor: colors.border },
              '& .Mui-selected': { bgcolor: alpha(colors.accentPrimary, 0.2), color: colors.accentPrimary, fontWeight: 800 }
            }}
          />
        </Box>
      </Container>

      {/* --- Action Modal --- */}
      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Box sx={modalStyle}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
             {actionType === 'REJECTED' ? <XCircle color={colors.statusError} size={32} /> : 
              actionType === 'CONFIRMED' ? <CheckCircle2 color={colors.statusSuccess} size={32} /> : 
              <Navigation color={colors.accentPrimary} size={32} />}
             <Typography variant="h5" fontWeight={800}>
                {actionType === 'CONFIRMED' && 'Approve Request'}
                {actionType === 'REJECTED' && 'Decline Request'}
                {actionType === 'COMPLETED' && 'Finalize Mission'}
             </Typography>
          </Box>

          {actionType === 'REJECTED' && (
            <TextField
              fullWidth
              placeholder="Reason for declining..."
              variant="outlined"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              rows={3}
              sx={{ 
                bgcolor: '#f8fafc', borderRadius: 2, mb: 3,
                '& .MuiOutlinedInput-root': { color: colors.textPrimary }
              }}
            />
          )}

          {actionType === 'COMPLETED' && (
            <Box mb={3}>
              <TextField
                fullWidth
                label="Extra Distance (KM)"
                variant="outlined"
                value={finalKm}
                onChange={(e) => setFinalKm(e.target.value)}
                type="number"
                sx={{ 
                  bgcolor: '#f8fafc', borderRadius: 2, mb: 2,
                  '& .MuiOutlinedInput-root': { color: colors.textPrimary }
                }}
              />
              <Alert 
                severity="info" 
                icon={<AlertCircle size={20} />}
                sx={{ bgcolor: alpha(colors.statusWarning, 0.05), color: colors.statusWarning, border: `1px solid ${alpha(colors.statusWarning, 0.2)}` }}
              >
                1 day = 200 KM standard. Add extra distance only if confirmed with user.
              </Alert>
            </Box>
          )}

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleClose} sx={{ color: colors.textSecondary }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || (actionType === 'REJECTED' && !reason.trim()) || (actionType === 'COMPLETED' && !finalKm.trim())}
              sx={{ 
                bgcolor: actionType === 'REJECTED' ? colors.statusError : colors.accentPrimary,
                color: colors.bgMain,
                fontWeight: 700,
                px: 4
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirm'}
            </Button>
          </Box>
        </Box>
      </Modal>

      <ChatModal 
        open={openChat}
        recieverId={recieverId}
        onClose={() => { setOpenChat(false); setChatRideId(null); setRecieverId(''); }}
        senderType="driver"
        roomId={chatRideId}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
        }
      `}</style>
    </Box>
  );
};

export default DriverBookings;
