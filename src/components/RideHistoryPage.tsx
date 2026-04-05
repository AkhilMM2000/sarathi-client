import React, { useEffect, useState } from 'react';
import { RideList } from './RideList';
import { DriverAPI, UserAPI } from '../Api/AxiosInterceptor';
import { motion } from 'framer-motion';
import { History, Activity, Info } from 'lucide-react';
import { RideHistory } from '../constant/types';

export const RideHistoryPage: React.FC<{ role: 'user' | 'driver'; userId: string }> = ({
  role,
  userId,
}) => {
  const [rides, setRides] = useState<RideHistory[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRideHistory = async (page: number) => {
    try {
      setLoading(true);
      let res;
      if (role === 'user') {
        res = await UserAPI.get('/ridehistory', {
          params: { id: userId, page, limit: 5 },
        });
      } else {
        res = await DriverAPI.get('/ridehistory', {
          params: { id: userId, page, limit: 5 },
        });
      }

      setRides(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching ride history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideHistory(page);
  }, [page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 mb-1">
              <History size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider">Activity Log</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Trip History</h1>
            <p className="text-slate-500 mt-1 italic">
              {role === 'driver' ? 'A detailed record of your driving service activities' : 'A summary of your booked rides and trips'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Activity size={18} />
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium uppercase">Role</p>
              <p className="text-sm font-bold text-slate-700 capitalize">{role}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-400 font-medium animate-pulse">Loading trips...</p>
          </div>
        ) : rides.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm"
          >
            <div className="p-4 bg-slate-50 text-slate-300 rounded-full mb-4">
              <Info size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No trips found</h3>
            <p className="text-slate-400">Your ride history will appear here once you complete a trip.</p>
          </motion.div>
        ) : (
          <RideList
            rides={rides}
            role={role}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </motion.div>
    </div>
  );
};
