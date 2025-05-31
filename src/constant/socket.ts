import { io, Socket } from "socket.io-client";

const BaseUrl = import.meta.env.VITE_BASE_MAIN_URL;
let socket: Socket;

export const CreatesocketConnection = (): Socket => {
  
  if (!socket) {
    socket = io(BaseUrl);
  }
  return socket;
};
