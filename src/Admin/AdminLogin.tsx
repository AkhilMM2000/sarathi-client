import React, { useState, FormEvent } from 'react';
import ApiService from '../Api/ApiService';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface LoginCredentials {
  email: string;
  password: string;
}

const SarathiAdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.info("Please fill in the credentials");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await ApiService.Login(credentials, 'admin');
  
      if (response?.accessToken && response?.role === 'admin') {
        localStorage.setItem(`${response.role}_accessToken`, response.accessToken);
        toast.success("Identity Verified. Access Granted.", { 
          autoClose: 1500,
          theme: "colored"
        });
        
        setTimeout(() => {
          navigate("/adminhome/users", { replace: true });
        }, 1500); 
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Verification failed!");
      } else {
        toast.error("Security encounter. Verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] left-[70%] w-[35%] h-[35%] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full flex flex-col md:flex-row">
        
        {/* Left Side: Branding & Info (Desktop only) */}
        <div className="hidden md:flex flex-1 flex-col justify-between p-12 bg-white/[0.02] border-r border-white/[0.05] backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
              <Shield className="text-white" size={28} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Sarathi</span>
          </motion.div>

          <div className="max-w-md">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-bold text-white mb-6 leading-tight"
            >
              Control Center <br />
              <span className="text-indigo-400 font-black">Portal</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg leading-relaxed"
            >
              Manage approvals, monitor system logs, and oversee the entire Sarathi ecosystem from this centralized administrative dashboard.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-4 text-slate-500 text-sm font-medium"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Secure Enterprise Environment</span>
          </motion.div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
          
          {/* Mobile-only Logo */}
          <div className="md:hidden absolute top-8 left-8 flex items-center space-x-2">
            <Shield className="text-indigo-500" size={24} />
            <span className="text-lg font-bold text-white uppercase tracking-wider">Sarathi</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] p-8 sm:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl"
          >
            <div className="mb-10">
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Login</h1>
              <p className="text-slate-400 font-medium tracking-wide">Enter your credentials to authenticate</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest ml-1">Email Identifier</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/40 focus:border-indigo-600/50 transition-all duration-200 hover:bg-white/[0.05]"
                    placeholder="name@sarathi.org"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest ml-1">Secure Passkey</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/40 focus:border-indigo-600/50 transition-all duration-200 hover:bg-white/[0.05]"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full relative group mt-8"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
                <div className="relative w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition duration-200 flex justify-center items-center space-x-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 font-black" />
                  ) : <UserCheck size={20} />}
                  <span className="tracking-tight text-lg">{loading ? 'Verifying Identity...' : 'Authorize Access'}</span>
                  {!loading && <ArrowRight size={18} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />}
                </div>
              </motion.button>
            </form>

            <div className="mt-12 text-center">
              <div className="flex items-center justify-center space-x-2 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                <Shield size={12} />
                <span>Encrypted Administration Session</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default SarathiAdminLogin;