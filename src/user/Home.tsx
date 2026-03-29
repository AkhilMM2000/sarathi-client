import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  useMediaQuery 
} from "@mui/material";
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Car, 
  UserCircle2,
  Zap,
  Star
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  const features = [
    {
      title: "Reliable Rides",
      description: "Get a ride in minutes from our community of top-rated, local drivers.",
      icon: <Car size={32} className="text-indigo-400" />,
      delay: 0.1
    },
    {
      title: "Safe & Secure",
      description: "Every driver is vetted and every trip is tracked for your peace of mind.",
      icon: <ShieldCheck size={32} className="text-emerald-400" />,
      delay: 0.2
    },
    {
      title: "Transparent Pricing",
      description: "Know your fare upfront. No hidden costs or surprise surcharges.",
      icon: <Zap size={32} className="text-amber-400" />,
      delay: 0.3
    }
  ];

  return (
    <Box sx={{ bgcolor: '#0f172a', overflow: 'hidden' }}>
      
      {/* 1. HERO SECTION WITH ANIMATED MESH GRADIENT */}
      <Box 
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
          <Box maxWidth="800px">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 900, 
                  fontSize: { xs: '3rem', md: '5rem' }, 
                  color: 'white', 
                  mb: 2, 
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1 
                }}
              >
                The Smartest Way to <br />
                <span style={{ 
                  background: 'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Book Your Ride
                </span>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  mb: 6, 
                  maxWidth: '600px',
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Sarathi connects you with safe, vetted, and professional drivers 
                for a premium travel experience. No surges, no stress.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                variant="contained"
                onClick={() => navigate('/user')}
                sx={{
                  py: 2, px: 5, borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700,
                  bgcolor: '#4f46e5', textTransform: 'none',
                  boxShadow: '0 10px 30px rgba(79, 70, 229, 0.4)',
                  '&:hover': { bgcolor: '#4338ca', transform: 'translateY(-2px)' },
                  transition: 'all 0.3s'
                }}
                endIcon={<ArrowRight />}
              >
                Book a Ride
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/login?type=driver')}
                sx={{
                  py: 2, px: 5, borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700,
                  borderColor: 'rgba(255,255,255,0.2)', color: 'white', textTransform: 'none',
                  backdropFilter: 'blur(5px)',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
                  transition: 'all 0.3s'
                }}
              >
                Drive with Us
              </Button>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* 2. FEATURES BENTO-GRID SECTION */}
      <Box sx={{ py: 20, position: 'relative' }}>
         <Container maxWidth="lg">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="text-center mb-16"
            >
               <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 800, letterSpacing: '0.2em' }}>
                 WHY CHOOSE SARATHI
               </Typography>
               <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mt: 2 }}>
                 Experience the Premium Difference
               </Typography>
            </motion.div>

            <Grid container spacing={4}>
               {features.map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: feature.delay }}
                    >
                       <Card 
                         sx={{ 
                           bgcolor: 'rgba(255,255,255,0.03)', 
                           border: '1px solid rgba(255,255,255,0.1)',
                           borderRadius: '24px',
                           p: 2,
                           height: '100%',
                           transition: 'all 0.3s',
                           '&:hover': { 
                             transform: 'translateY(-10px)',
                             bgcolor: 'rgba(255,255,255,0.05)',
                             borderColor: 'rgba(99, 102, 241, 0.3)'
                           }
                         }}
                       >
                         <CardContent>
                            <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1.5 }}>
                              {feature.title}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                              {feature.description}
                            </Typography>
                         </CardContent>
                       </Card>
                    </motion.div>
                  </Grid>
               ))}
            </Grid>
         </Container>
      </Box>

      {/* 3. CTA SECTION */}
      <Box sx={{ py: 15 }}>
         <Container maxWidth="lg">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
            >
               <Box 
                 sx={{ 
                   p: { xs: 5, md: 10 }, 
                   borderRadius: '40px',
                   textAlign: 'center',
                   position: 'relative',
                   overflow: 'hidden',
                   background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                   border: '1px solid rgba(255,255,255,0.1)'
                 }}
               >
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 3 }}>
                    Ready to Start Your Journey?
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6, maxWidth: '600px', mx: 'auto' }}>
                    Join thousands of users who trust Sarathi for their daily 
                    commute and special events.
                  </Typography>
                  <Box className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="contained" 
                      onClick={() => navigate('/user')}
                      sx={{ py: 2, px: 6, borderRadius: '14px', bgcolor: 'white', color: '#1e1b4b', fontWeight: 800, textTransform: 'none', '&:hover': { bgcolor: '#f1f5f9' } }}
                    >
                      Get Started Now
                    </Button>
                  </Box>
               </Box>
            </motion.div>
         </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
