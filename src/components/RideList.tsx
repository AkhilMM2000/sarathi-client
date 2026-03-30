import React from 'react';
import { RideCard } from './RideHistoryCard';
import { RideHistory } from '../constant/types';
import EnhancedPagination from './Adwancepagination';
import { motion, AnimatePresence } from 'framer-motion';

interface RideListProps {
  rides: RideHistory[];
  role: 'user' | 'driver';
  page: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export const RideList: React.FC<RideListProps> = ({
  rides,
  role,
  page,
  totalPages,
  onPageChange,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <AnimatePresence mode="wait">
          {rides.map((ride, index) => (
            <RideCard key={`${ride.createdAt}-${index}`} ride={ride} role={role} />
          ))}
        </AnimatePresence>
      </motion.div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center py-6 border-t border-slate-100">
          <EnhancedPagination 
            count={totalPages} 
            page={page}  
            onChange={onPageChange} 
            color="standard" 
          />
        </div>
      )}
    </div>
  );
};
