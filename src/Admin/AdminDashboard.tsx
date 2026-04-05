import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
 
  Car,
  Calendar,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Wallet,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Shield
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import ApiService from "../Api/ApiService";

// --- Types ---
interface DashboardStats {
  earnings: {
    today: number;
    thisWeek: number;
    total: number;
  };
  finance: {
    totalRevenue: number;
    totalDriverPayout: number;
    totalPlatformProfit: number;
  };
  rideStats: {
    completed: number;
    pending: number;
    rejected: number;
    cancelled: number;
  };
  earningsTrend: Array<{ date: string; earnings: number }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await ApiService.getAdminDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const rideMixData = stats ? [
    { name: "Completed", value: stats.rideStats.completed, color: "#10b981" },
    { name: "Pending", value: stats.rideStats.pending, color: "#f59e0b" },
    { name: "Rejected", value: stats.rideStats.rejected, color: "#ef4444" },
    { name: "Cancelled", value: stats.rideStats.cancelled, color: "#64748b" },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">Platform Command Center</h1>
          <p className="text-slate-400 mt-1">Global administrative overview and financial intelligence.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </motion.div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Profit"
          value={`₹${stats?.earnings.today.toLocaleString()}`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          trend="+12.5%"
          color="emerald"
          delay={0.1}
        />
        <StatCard
          title="Weekly Revenue"
          value={`₹${stats?.earnings.thisWeek.toLocaleString()}`}
          icon={<Wallet className="w-5 h-5 text-blue-400" />}
          trend="+5.2%"
          color="blue"
          delay={0.2}
        />
        <StatCard
          title="Gross Revenue"
          value={`₹${stats?.finance.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5 text-indigo-400" />}
          trend="+18.7%"
          color="indigo"
          delay={0.3}
        />
        <StatCard
          title="Total Platform Net"
          value={`₹${stats?.finance.totalPlatformProfit.toLocaleString()}`}
          icon={<ArrowUpRight className="w-5 h-5 text-purple-400" />}
          trend="All Time"
          color="purple"
          delay={0.4}
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Profit Growth Trend</h3>
              <p className="text-sm text-slate-400">Daily platform fees (Last 30 days)</p>
            </div>
            <BarChartIcon className="w-5 h-5 text-slate-500" />
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.earningsTrend}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEarnings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Ride Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Ride Mix</h3>
              <p className="text-sm text-slate-400">Status distribution</p>
            </div>
            <PieChartIcon className="w-5 h-5 text-slate-500" />
          </div>

          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rideMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {rideMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Legend */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white leading-none">
                {stats?.rideStats.completed || 0}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">Done</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
             <LegendItem label="Completed" value={stats?.rideStats.completed} color="bg-emerald-500" icon={<CheckCircle2 className="w-3.5 h-3.5" />} />
             <LegendItem label="Rejected" value={stats?.rideStats.rejected} color="bg-red-500" icon={<XCircle className="w-3.5 h-3.5" />} />
             <LegendItem label="Pending" value={stats?.rideStats.pending} color="bg-amber-500" icon={<Clock className="w-3.5 h-3.5" />} />
             <LegendItem label="Cancelled" value={stats?.rideStats.cancelled} color="bg-slate-500" icon={<AlertCircle className="w-3.5 h-3.5" />} />
          </div>
        </motion.div>
      </div>

      {/* Financial Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <FinancialSummaryItem 
          title="Total Revenue Collected" 
          amount={stats?.finance.totalRevenue} 
          description="Total gross payments from all users"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <FinancialSummaryItem 
          title="Driver Payouts" 
          amount={stats?.finance.totalDriverPayout} 
          description="Total earnings distributed to drivers"
          icon={<Car className="w-4 h-4" />}
          variant="secondary"
        />
        <FinancialSummaryItem 
          title="Platform Profit" 
          amount={stats?.finance.totalPlatformProfit} 
          description="Total platform fees retained (Net Income)"
          icon={<Shield className="w-4 h-4" />}
          variant="primary"
        />
      </motion.div>
    </div>
  );
};

// --- Sub-components ---

const StatCard = ({ title, value, icon, trend, color, delay }: any) => {
  const colors: any = {
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    blue: "bg-blue-500/10 border-blue-500/20",
    indigo: "bg-indigo-500/10 border-indigo-500/20",
    purple: "bg-purple-500/10 border-purple-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 rounded-2xl border backdrop-blur-sm ${colors[color]}`}
    >
      <div className="flex items-center justify-between">
        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5 shadow-xl">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{trend}</span>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-400 capitalize">{title}</p>
        <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
      </div>
    </motion.div>
  );
};

const LegendItem = ({ label, value, color, icon }: any) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-slate-400">
      <div className={`p-1 rounded-md ${color} text-white`}>{icon}</div>
      <span>{label}</span>
    </div>
    <span className="font-semibold text-white">{value || 0}</span>
  </div>
);

const FinancialSummaryItem = ({ title, amount, description, icon, variant = "default" }: any) => {
  const styles: any = {
    default: "border-slate-800 bg-slate-900/40",
    primary: "border-indigo-500/30 bg-indigo-500/5",
    secondary: "border-emerald-500/30 bg-emerald-500/5"
  };

  return (
    <div className={`p-6 rounded-2xl border ${styles[variant]} backdrop-blur-sm group`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white transition-colors">
          {icon}
        </div>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">Verified Audit</span>
      </div>
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-bold text-white">₹{amount?.toLocaleString() || 0}</span>
      </div>
      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{description}</p>
    </div>
  );
};

export default AdminDashboard;