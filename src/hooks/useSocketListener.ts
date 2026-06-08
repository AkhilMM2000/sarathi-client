// src/hooks/useSocketListener.ts
import {  useEffect, useState } from "react";
import { CreatesocketConnection } from "../constant/socket"; 
import { UserAPI } from "../Api/AxiosInterceptor";


import { RootState } from "../store/ReduxStore";
import { useSelector } from "react-redux";
import moment from "moment";


export const useSocketListener = () => {
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [expiredBookingId, setExpiredBookingId] = useState<string | null>(null);
  const userData = useSelector((state: RootState) => state.authUser.user);

  useEffect(() => {
    if(!userData?._id) return;

    const socket = CreatesocketConnection();

    if (userData?._id) {
      socket.emit("user:online", {userId:userData?._id});
    }

    socket.on("booking:confirmation", ({status,startDate}) => {
          const formattedDate = moment(startDate).format("MMMM D, dddd");
    console.log("Booking confirmation reach here okay:",status,startDate);
      setMessage(`Booking ${status} for a ride in ${formattedDate}`);
      setExpiredBookingId(null);
      setOpen(true);
    });

    socket.on("booking:reject", ({bookingId, status, startDate, reason}) => {
      const formattedDate = moment(startDate).format("MMMM D, dddd");
      console.log("Booking confirmation reach here okay:",status,startDate);
      if (status === "EXPIRED") {
        setMessage("Your ride request has expired because no drivers were available in your area.");
        setExpiredBookingId(bookingId);
      } else {
        setMessage(`Booking ${status} for a ride in ${formattedDate} due to ${reason}`);
        setExpiredBookingId(null);
      }
      setOpen(true);
    });


    return () => {
      socket.off("bookingStatus");
    };
  }, [userData]);

  const handleClose = async () => {
    setOpen(false);
    if (expiredBookingId) {
      try {
        console.log(`[useSocketListener] Acknowledging expired booking: ${expiredBookingId}`);
        await UserAPI.patch(`/booking/acknowledge/${expiredBookingId}`);
      } catch (error) {
        console.error("Failed to acknowledge expired booking:", error);
      } finally {
        setExpiredBookingId(null);
      }
    }
  };

  return { message, open, handleClose};
};
