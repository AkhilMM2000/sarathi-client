import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Grid,
  Avatar,
  IconButton,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import {
  X,
  MapPin,
  Calendar,
  Wallet,
  Car,
  User,
  Activity,
  CreditCard,
  IndianRupee,
  Navigation,
} from "lucide-react";
import moment from "moment";

const RideDetailsModal = ({ open, onClose, booking }: any) => {
  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "success";
      case "cancelled": return "error";
      case "pending": return "warning";
      case "accepted": return "info";
      case "started": return "primary";
      default: return "default";
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          bgcolor: "background.paper",
        }
      }}
    >
      <DialogTitle sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        p: 3,
        borderBottom: "1px solid",
        borderColor: "divider"
      }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Car size={24} color="#6366f1" />
          <Typography variant="h5" fontWeight="800">Ride Overview</Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: "action.hover" }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f8fafc" }}>
        <Grid container spacing={3}>
          
          {/* Participants Card */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
              <Typography variant="subtitle2" color="text.secondary" mb={3} display="flex" alignItems="center" gap={1}>
                <User size={18} /> PARTICIPANTS
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      src={`${import.meta.env.VITE_IMAGEURL}/${booking.userImage}`} 
                      sx={{ width: 56, height: 56, border: "2px solid #e2e8f0" }}
                    />
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="600">Passenger</Typography>
                      <Typography variant="h6" fontWeight="700">{booking.username}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      src={`${import.meta.env.VITE_IMAGEURL}/${booking.driverImage}`} 
                      sx={{ width: 56, height: 56, border: "2px solid #e2e8f0" }}
                    />
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="600">Driver</Typography>
                      <Typography variant="h6" fontWeight="700">{booking.drivername}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Journey Details Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid", borderColor: "divider", height: "100%" }}>
               <Typography variant="subtitle2" color="text.secondary" mb={3} display="flex" alignItems="center" gap={1}>
                <Navigation size={18} /> JOURNEY DETAILS
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={3}>
                <Box display="flex" gap={2}>
                  <MapPin size={20} color="#10b981" style={{ marginTop: '2px' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Pickup Location</Typography>
                    <Typography variant="body1" fontWeight="600">{booking.fromLocation}</Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={2}>
                  <MapPin size={20} color="#ef4444" style={{ marginTop: '2px' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Dropoff Location</Typography>
                    <Typography variant="body1" fontWeight="600">{booking.toLocation}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Calendar size={16} className="text-gray-400" />
                      <Typography variant="body2" color="text.secondary">Start Date</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="600" mt={0.5}>{moment(booking.startDate).format("MMM DD, YYYY HH:mm")}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Navigation size={16} className="text-gray-400" />
                      <Typography variant="body2" color="text.secondary">Distance</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="600" mt={0.5}>{booking.estimatedKm} km</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Financial Breakdown Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid", borderColor: "divider", height: "100%", bgcolor: "#f1f5f9" }}>
               <Typography variant="subtitle2" color="text.secondary" mb={3} display="flex" alignItems="center" gap={1}>
                <Wallet size={18} /> FINANCIAL BREAKDOWN
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Estimated Fare</Typography>
                  <Typography variant="body1" fontWeight="600">₹{booking.estimatedFare}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Final Fare</Typography>
                  <Typography variant="body1" fontWeight="700" color="primary.main">
                    {booking.finalFare ? `₹${booking.finalFare}` : "Pending"}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Driver Fee</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {booking.driver_fee ? `₹${booking.driver_fee}` : "N/A"}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Platform Fee</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {booking.platform_fee ? `₹${booking.platform_fee}` : "N/A"}
                  </Typography>
                </Box>
                
                {booking.walletDeduction > 0 && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Wallet Deduction</Typography>
                    <Typography variant="body1" fontWeight="500" color="error.main">
                      -₹{booking.walletDeduction}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Metadata & Status Card */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1} mb={1}>
                    <Activity size={16} /> Status
                  </Typography>
                  <Chip 
                    label={booking.status} 
                    color={getStatusColor(booking.status) as any} 
                    size="small" 
                    sx={{ fontWeight: "600", borderRadius: "8px", textTransform: "capitalize" }} 
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1} mb={1}>
                    <Car size={16} /> Booking Type
                  </Typography>
                  <Chip 
                    label={booking.bookingType} 
                    variant="outlined" 
                    size="small" 
                    sx={{ fontWeight: "600", borderRadius: "8px", textTransform: "capitalize" }} 
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1} mb={1}>
                    <CreditCard size={16} /> Payment Mode
                  </Typography>
                  <Typography variant="body1" fontWeight="600">{booking.paymentMode}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1} mb={1}>
                    <IndianRupee size={16} /> Payment Status
                  </Typography>
                  <Chip 
                    label={booking.paymentStatus} 
                    color={booking.paymentStatus.toLowerCase() === "completed" ? "success" : "warning"}
                    variant="outlined"
                    size="small" 
                    sx={{ fontWeight: "600", borderRadius: "8px", textTransform: "capitalize" }} 
                  />
                </Grid>
                {booking.reason && (
                  <Grid item xs={12}>
                    <Box mt={1} p={2} bgcolor="#fee2e2" borderRadius="8px">
                      <Typography variant="body2" color="error.dark" fontWeight="600">Cancellation Reason:</Typography>
                      <Typography variant="body2" color="error.main">{booking.reason}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: "1px solid", borderColor: "divider" }}>
        <Button onClick={onClose} variant="contained" disableElevation sx={{ borderRadius: "10px", px: 4, textTransform: "none", fontWeight: "600" }}>
          Close Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RideDetailsModal;
