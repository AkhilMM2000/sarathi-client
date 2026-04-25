import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import { Eye, Car } from "lucide-react";
import moment from "moment";
import { AdminAPI } from "../Api/AxiosInterceptor";
import EnhancedPagination from "../components/Adwancepagination";
import RideDetailsModal from "../components/BookingData";

interface Booking {
  _id: string;
  username: string;
  userImage: string;
  drivername: string;
  fromLocation: string;
  driverImage: string;
  startDate: string;
  status: string;
  finalFare?: number;
  estimatedFare: number;
  bookingType: string;
  paymentStatus: string;
}

const AllRides: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchBookings = async () => {
    try {
      const response = await AdminAPI.get(`bookings?page=${page}&limit=5`);
      setBookings(response.data.bookings.data);
      setTotalPages(response.data.bookings.totalPages);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setOpenModal(true);
  };

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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Box p={1.5} bgcolor="#eef2ff" borderRadius="12px">
          <Car size={28} color="#4f46e5" />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="800" color="text.primary">
            Ride Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage all system bookings
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", fontSize: "0.75rem" }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", fontSize: "0.75rem" }}>Driver</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", fontSize: "0.75rem" }}>Ride Start</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", fontSize: "0.75rem" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", fontSize: "0.75rem" }}>Fare</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", fontSize: "0.75rem" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", fontSize: "0.75rem" }}>Payment</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", fontSize: "0.75rem" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: "all 0.2s" }}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar
                      src={`${import.meta.env.VITE_IMAGEURL}/${booking.userImage}`}
                      alt={booking.username}
                      sx={{ width: 36, height: 36 }}
                    />
                    <Typography variant="body2" fontWeight="500">{booking.username}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar
                      src={`${import.meta.env.VITE_IMAGEURL}/${booking.driverImage}`}
                      alt={booking.drivername}
                      sx={{ width: 36, height: 36 }}
                    />
                    <Typography variant="body2" fontWeight="500">{booking.drivername}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {moment(booking.startDate).format("MMM DD, YYYY")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {moment(booking.startDate).format("HH:mm")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={booking.status} 
                    size="small" 
                    color={getStatusColor(booking.status) as any}
                    sx={{ fontWeight: "600", borderRadius: "6px", textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="600">
                    ₹{booking.finalFare ?? booking.estimatedFare}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={booking.bookingType} 
                    size="small" 
                    variant="outlined"
                    sx={{ borderRadius: "6px", textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>
                   <Chip 
                    label={booking.paymentStatus} 
                    size="small" 
                    color={booking.paymentStatus.toLowerCase() === "completed" ? "success" : "default"}
                    sx={{ borderRadius: "6px", textTransform: "capitalize", fontWeight: "500" }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Eye size={16} />}
                    onClick={() => handleViewDetails(booking)}
                    sx={{ borderRadius: "8px", textTransform: "none", fontWeight: "600", color: "text.secondary", borderColor: "divider", '&:hover': { bgcolor: "action.hover" } }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">No rides found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box mt={4} display="flex" justifyContent="center">
        <EnhancedPagination 
          count={totalPages} 
          page={page}  
          onChange={handlePageChange} 
          color="primary" 
        />
      </Box>

      <RideDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        booking={selectedBooking}
      />
    </Box>
  );
};

export default AllRides;
