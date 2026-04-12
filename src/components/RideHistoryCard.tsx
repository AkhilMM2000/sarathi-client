import React from 'react';
import { RideHistory } from '../constant/types';
import moment from 'moment';
import { 
  MapPin, 
  ChevronRight, 
  Calendar, 
  Navigation, 
  CreditCard,
  Hash,
  MessageCircle,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RideCardProps {
  ride: RideHistory;
  role: 'user' | 'driver';
}

export const RideCard: React.FC<RideCardProps> = ({ ride, role }) => {
  const isCancelled = ride.status === 'CANCELLED' || ride.status === 'REJECTED';
  
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-50 text-rose-600 border-rose-100 ring-rose-500/10';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500/10';
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-600 border-blue-100 ring-blue-500/10';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100 ring-slate-500/10';
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      className={`group relative bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 ${isCancelled ? 'opacity-75 grayscale-[0.2]' : ''}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* User/Driver Profile Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={`${import.meta.env.VITE_IMAGEURL}/${ride.profile}`} 
              alt={ride.name} 
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-50 shadow-sm transition-transform group-hover:scale-105 duration-300"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isCancelled ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-indigo-500 tracking-wider uppercase">
              {role === 'user' ? 'Driver Details' : 'Passenger Details'}
            </p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {ride.name}
            </h3>
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <MapPin size={14} />
              <span className="font-medium text-slate-500">{ride.place}</span>
            </div>
          </div>
        </div>

        {/* Trip Activity Visual (Only for ONE_RIDE) */}
        {ride.bookingType === 'ONE_RIDE' && (
          <div className="flex-1 flex items-center justify-center px-4 max-w-sm hidden md:flex">
            <div className="flex-1 h-[2px] bg-slate-100 relative">
              <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-slate-300" />
              <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-indigo-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 flex items-center space-x-2">
                  <Navigation size={12} className="text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    {ride.estimatedKm} KM Trip
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status and Financials */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
          <div className={`px-4 py-1.5 rounded-full border ring-4 ring-opacity-10 text-xs font-black uppercase tracking-widest ${getStatusStyles(ride.status)}`}>
            {ride.status}
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-2xl font-black text-slate-900">
              <span className="text-base font-bold text-slate-400 mr-1 italic">₹</span>
              {ride.finalFare}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Final Fare</span>
          </div>
        </div>
      </div>

      {/* Ride Route and Details (Expanded) */}
      <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Locations (Simplified Vertical Plot) */}
        {ride.bookingType === 'ONE_RIDE' && (
          <div className="space-y-4">
            <div className="flex items-start space-x-4 group/loc relative">
              <div className="mt-1 p-2 bg-slate-100 text-slate-400 rounded-lg group-hover/loc:bg-emerald-50 group-hover/loc:text-emerald-500 transition-colors">
                <MapPin size={16} />
              </div>
              <div className="absolute left-6 top-10 w-0.5 h-6 bg-slate-100 border-l border-dashed border-slate-200" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">From</p>
                <p className="text-sm font-semibold text-slate-700 mt-1 line-clamp-1">{ride.fromLocation}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 group/loc">
              <div className="mt-1 p-2 bg-slate-100 text-slate-400 rounded-lg group-hover/loc:bg-indigo-50 group-hover/loc:text-indigo-500 transition-colors">
                <ChevronRight size={16} className="rotate-90" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">To</p>
                <p className="text-sm font-semibold text-slate-700 mt-1 line-clamp-1">{ride.toLocation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Date, Payment Type and Booking Mode */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50/50 rounded-2xl flex items-center space-x-3">
            <div className="p-2 bg-white text-indigo-500 rounded-xl shadow-sm border border-slate-100">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Date</p>
              <p className="text-sm font-bold text-slate-700">{moment(ride.createdAt).format('MMM DD, YYYY')}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 rounded-2xl flex items-center space-x-3">
            <div className="p-2 bg-white text-emerald-500 rounded-xl shadow-sm border border-slate-100">
              <CreditCard size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Paid via</p>
              <p className="text-sm font-bold text-slate-700 capitalize">{ride.paymentMode}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 rounded-2xl flex items-center space-x-3">
            <div className="p-2 bg-white text-rose-500 rounded-xl shadow-sm border border-slate-100">
              <Truck size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Type</p>
              <p className="text-sm font-bold text-slate-700 capitalize">{ride.bookingType.replace(/_/g, ' ')}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 rounded-2xl flex items-center space-x-3">
            <div className="p-2 bg-white text-slate-400 rounded-xl shadow-sm border border-slate-100">
              <Hash size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Ref ID</p>
              <p className="text-sm font-bold text-slate-700">#{ride.paymentIntentId?.slice(-6) || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Reason (Overlay/Warning Bar) */}
      {ride.reason && (
        <div className="mt-6 p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-start space-x-3">
          <div className="mt-0.5 text-rose-500">
            <MessageCircle size={18} />
          </div>
          <div>
            <p className="text-xs font-black text-rose-600 uppercase tracking-widest">Reason for cancellation</p>
            <p className="text-sm font-medium text-rose-500/80 mt-1">{ride.reason}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
