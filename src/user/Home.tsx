import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  useTheme,
  useMediaQuery 
} from "@mui/material";
import { 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Car, 
  UserCircle2,
  Zap,
  Star,
  MapPin
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <Box sx={{ bgcolor: '#0f172a', overflow: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <Box 
        id="home"
        sx={{ 
          position: 'relative', 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center',
          pt: { xs: 12, md: 0 }
        }}
      >
        {/* Animated Background Mesh */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(79, 70, 229, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'url("https://grainy-gradients.vercel.app/noise.svg")',
              opacity: 0.05,
              pointerEvents: 'none'
            }
          }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '50vw',
              height: '50vw',
              background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 70%)',
              filter: 'blur(100px)',
              borderRadius: '50%'
            }}
          />
        </Box>

        {/* Floating Typography Watermark */}
        <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
           <motion.div style={{ y: y1 }}>
             <Typography 
                sx={{ 
                  position: 'absolute', left: '-5%', top: '20%', fontSize: '20vw', 
                  fontWeight: 900, color: 'rgba(255,255,255,0.015)', letterSpacing: '-0.05em',
                  whiteSpace: 'nowrap'
                }}
             >
                SARATHI
             </Typography>
           </motion.div>
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
          <Box sx={{ maxWidth: '800px' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 900, 
                  fontSize: { xs: '3.2rem', md: '5.5rem' }, 
                  color: 'white', 
                  mb: 2, 
                  letterSpacing: '-0.04em',
                  lineHeight: 1.05
                }}
              >
                Drive Your Way <br />
                <span style={{ 
                  background: 'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  With Sarathi
                </span>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  mb: 6, 
                  maxWidth: '600px',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.35rem' }
                }}
              >
                A revolutionary platform where vehicle owners find elite, 
                admin-verified drivers. Your car, our professional guidance.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login?type=user')}
                  sx={{
                    py: 2.2, px: 6, borderRadius: '14px', fontSize: '1.1rem', fontWeight: 800,
                    bgcolor: '#4f46e5', textTransform: 'none',
                    boxShadow: '0 10px 40px rgba(79, 70, 229, 0.4)',
                    '&:hover': { bgcolor: '#4338ca', transform: 'translateY(-3px)' },
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                  endIcon={<ArrowRight />}
                >
                  Get Started
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* 2. ABOUT SECTION (BENTO GRID) */}
      <Box id="about" sx={{ py: { xs: 15, md: 25 }, position: 'relative', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
         <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                 <motion.div
                   initial={{ opacity: 0, x: -30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8 }}
                 >
                    <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 900, letterSpacing: '0.3em' }}>
                      OUR MISSION
                    </Typography>
                    <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, mt: 2, mb: 4, lineHeight: 1.1 }}>
                      Revolutionizing the Ride Experience
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.15rem', lineHeight: 1.8, mb: 4 }}>
                      Sarathi is the first platform where <strong>transparency meets convenience</strong>. 
                      We believe that vehicle owners should have access to professional, vetted drivers 
                      without the overhead of traditional fleet services.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                       {[
                         { title: "User-Owned Vehicles", text: "You provide the car, we provide the expertise.", icon: <Car color="#818cf8" /> },
                         { title: "Admin-Approved Drivers", text: "Every driver undergoes rigorous document verification.", icon: <ShieldCheck color="#10b981" /> },
                         { title: "On-Demand Flexibility", text: "Book for a day, a week, or a specific trip.", icon: <Clock color="#f59e0b" /> }
                       ].map((item, i) => (
                         <Box key={i} sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                            <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                              {item.icon}
                            </Box>
                            <Box>
                               <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>{item.title}</Typography>
                               <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>{item.text}</Typography>
                            </Box>
                         </Box>
                       ))}
                    </Box>
                 </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                 <motion.div
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, ease: "easeOut" }}
                   style={{ position: 'relative' }}
                 >
                    {/* Decorative Element */}
                    <Box sx={{ 
                      position: 'absolute', inset: '-20px', 
                      background: 'linear-gradient(225deg, rgba(99, 102, 241, 0.2), transparent)', 
                      filter: 'blur(40px)', zIndex: -1, borderRadius: '40px' 
                    }} />
                    
                    <Box sx={{ 
                      p: 4, bgcolor: 'rgba(30, 41, 59, 0.5)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '40px', backdropFilter: 'blur(20px)',
                      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3
                    }}>
                       {[
                         { label: "Vetted Drivers", value: "100%", color: '#10b981' },
                         { label: "Active Users", value: "5k+", color: '#6366f1' },
                         { label: "Successful Rides", value: "25k+", color: '#f59e0b' },
                         { label: "Client Rating", value: "4.9/5", color: '#ec4899' }
                       ].map((stat, i) => (
                         <Box key={i} sx={{ p: 3, bgcolor: 'rgba(15, 23, 42, 0.5)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Typography sx={{ color: stat.color, fontWeight: 900, fontSize: '2rem' }}>{stat.value}</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>{stat.label}</Typography>
                         </Box>
                       ))}
                    </Box>
                 </motion.div>
              </Grid>
            </Grid>
         </Container>
      </Box>

      {/* 3. REGISTRATION GATEWAY */}
      <Box sx={{ py: 15, bgcolor: 'rgba(255,255,255,0.02)' }}>
         <Container maxWidth="lg">
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, textAlign: 'center', mb: 8 }}>
              Join the Community
            </Typography>
            <Grid container spacing={6}>
               <Grid item xs={12} md={6}>
                  <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.4 }}>
                     <Box 
                       onClick={() => navigate('/user')}
                       sx={{ 
                         p: 6, borderRadius: '32px', cursor: 'pointer',
                         background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
                         border: '2px solid rgba(79, 70, 229, 0.2)',
                         '&:hover': { borderColor: 'rgba(79, 70, 229, 0.5)', boxShadow: '0 20px 40px rgba(79, 70, 229, 0.15)' },
                         transition: 'all 0.4s'
                       }}
                     >
                        <UserCircle2 size={48} color="#818cf8" />
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, mt: 3, mb: 2 }}>Register as User</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, mb: 4 }}>
                          Looking for a driver for your personal vehicle? Sign up now and access our pool of verified professionals.
                        </Typography>
                        <Button variant="text" endIcon={<ArrowRight />} sx={{ color: '#818cf8', fontWeight: 700 }}>Learn More</Button>
                     </Box>
                  </motion.div>
               </Grid>
               <Grid item xs={12} md={6}>
                  <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.4 }}>
                     <Box 
                       onClick={() => navigate('/driverReg')}
                       sx={{ 
                         p: 6, borderRadius: '32px', cursor: 'pointer',
                         background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                         border: '2px solid rgba(245, 158, 11, 0.2)',
                         '&:hover': { borderColor: 'rgba(245, 158, 11, 0.5)', boxShadow: '0 20px 40px rgba(245, 158, 11, 0.15)' },
                         transition: 'all 0.4s'
                       }}
                     >
                        <Car size={48} color="#f59e0b" />
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, mt: 3, mb: 2 }}>Register as Driver</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, mb: 4 }}>
                          Professional driver? Join our network, get verified by admins, and start providing elite service to vehicle owners.
                        </Typography>
                        <Button variant="text" endIcon={<ArrowRight />} sx={{ color: '#f59e0b', fontWeight: 700 }}>Become a Partner</Button>
                     </Box>
                  </motion.div>
               </Grid>
            </Grid>
         </Container>
      </Box>

      {/* 4. SUPPORT SECTION */}
      <Box id="support" sx={{ py: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
         <Container maxWidth="lg">
            <Box 
              sx={{ 
                p: { xs: 5, md: 8 }, 
                borderRadius: '40px', 
                bgcolor: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center', gap: 6
              }}
            >
               <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mb: 3 }}>How can we help?</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                    Our dedicated support team is available 24/7 to assist with your bookings, 
                    technical issues, or driver verification status.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                     <Button variant="contained" sx={{ bgcolor: 'white', color: '#0f172a', fontWeight: 700, borderRadius: '12px', textTransform: 'none', px: 4 }}>
                       Contact Support
                     </Button>
                     <Button variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '12px', textTransform: 'none', px: 4 }}>
                       FAQs
                     </Button>
                  </Box>
               </Box>
               <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                  {[
                    { label: "Bookings", icon: <MapPin /> },
                    { label: "Payments", icon: <Zap /> },
                    { label: "Vetting", icon: <ShieldCheck /> },
                    { label: "Safety", icon: <Star /> }
                  ].map((topic, i) => (
                    <Box key={i} sx={{ p: 4, bgcolor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                        <Box sx={{ color: '#818cf8', mb: 2 }}>{topic.icon}</Box>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{topic.label}</Typography>
                    </Box>
                  ))}
               </Box>
            </Box>
         </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
