import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Calendar, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  XSquare, 
  Ban,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { motion } from "framer-motion";
import { DriverAPI } from "../Api/AxiosInterceptor";

interface DashboardStats {
  earnings: {
    today: number;
    thisWeek: number;
    total: number;
  };
  rideStats: {
    completed: number;
    pending: number;
    rejected: number;
    cancelled: number;
  };
}

const DriverStatusDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await DriverAPI.get("/dashboard");
        setStats(response.data);
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse bg-slate-50 min-h-screen">
        <div className="h-10 w-64 bg-slate-200 rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-white rounded-2xl shadow-sm border border-slate-100" />
          <div className="h-96 bg-white rounded-2xl shadow-sm border border-slate-100" />
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Completed', value: stats?.rideStats.completed || 0, color: '#10b981' },
    { name: 'Pending', value: stats?.rideStats.pending || 0, color: '#f59e0b' },
    { name: 'Rejected', value: stats?.rideStats.rejected || 0, color: '#ef4444' },
    { name: 'Cancelled', value: stats?.rideStats.cancelled || 0, color: '#64748b' }
  ].filter(item => item.value > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Driver Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time performance and earnings overview</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Updates</span>
        </div>
      </motion.div>

      {/* Earnings Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Today's Earnings */}
        <motion.div variants={itemVariants} className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-slate-500 font-medium">Today's Earnings</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold text-slate-900">₹{stats?.earnings.today.toLocaleString()}</span>
              <div className="flex items-center mt-1 text-emerald-600 text-sm font-semibold">
                <ArrowUpRight size={16} className="mr-1" />
                <span>Daily Revenue</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Earnings */}
        <motion.div variants={itemVariants} className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Calendar size={80} />
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar size={24} />
            </div>
            <span className="text-slate-500 font-medium">This Week</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold text-slate-900">₹{stats?.earnings.thisWeek.toLocaleString()}</span>
              <div className="flex items-center mt-1 text-blue-600 text-sm font-semibold">
                <Activity size={16} className="mr-1" />
                <span>Weekly Growth</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Earnings */}
        <motion.div variants={itemVariants} className="group relative bg-indigo-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet size={80} color="white" />
          </div>
          <div className="flex items-center space-x-4 mb-4 relative z-10">
            <div className="p-3 bg-white/10 text-white rounded-xl">
              <Wallet size={24} />
            </div>
            <span className="text-indigo-100 font-medium">Total Balance</span>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-bold text-white">₹{stats?.earnings.total.toLocaleString()}</span>
            <div className="text-indigo-200 text-sm font-medium mt-1">Life-time Earnings</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ride Status Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Ride Distribution</h2>
              <p className="text-slate-500 text-sm">Visual breakdown of your ride activities</p>
            </div>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
              <Activity size={20} />
            </div>
          </div>

          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <div className="p-4 bg-slate-50 rounded-full">
                  <XSquare size={40} />
                </div>
                <p>No ride data available yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Status Quick Count */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Completed</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.rideStats.completed || 0}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Pending</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.rideStats.pending || 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl w-fit">
              <Ban size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Rejected</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.rideStats.rejected || 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-xl w-fit">
              <XSquare size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Cancelled</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats?.rideStats.cancelled || 0}</h3>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DriverStatusDashboard;
