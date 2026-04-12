import { useState, useEffect } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container, 
  Button, 
  IconButton,
  Menu,
  MenuItem,
  useScrollTrigger,
  Slide
} from "@mui/material";
import { 
  Car, 
  User, 
  Menu as MenuIcon, 
  Phone,
  Info,
  Home as HomeIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactElement;
}

// Hide header on scroll down, show on scroll up logic
function HideOnScroll(props: Props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileAnchor, setMobileAnchor] = useState<null | HTMLElement>(null);

  // Monitor scroll for glassmorph intensity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const navItems = [
    { label: "Home", id: "home", icon: <HomeIcon size={18} /> },
    { label: "About", id: "about", icon: <Info size={18} /> },
    { label: "Support", id: "support", icon: <Phone size={18} /> },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: id === 'home' ? 0 : offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileAnchor(null);
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: isScrolled 
            ? "rgba(15, 23, 42, 0.9)" 
            : "transparent",
          backdropFilter: isScrolled ? "blur(16px)" : "none",
          borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          py: isScrolled ? 0.5 : 1.5,
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            
            {/* Logo Section */}
            <Box 
              onClick={() => scrollToSection('home')}
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                cursor: "pointer",
                gap: 1.5 
              }}
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  padding: '8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
                }}
              >
                <Car size={24} color="white" />
              </motion.div>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 900, 
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(to right, #fff, #94a3b8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Sarathi
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 5, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Typography
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    '&:hover': { color: '#fff' },
                    transition: 'all 0.2s',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: '2px',
                      background: '#6366f1',
                      transition: 'width 0.3s ease'
                    },
                    '&:hover::after': {
                      width: '100%'
                    }
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>

            {/* CTA Buttons Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<User size={16} />}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    textTransform: 'none', 
                    fontWeight: 600,
                    px: 2,
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                  }}
                  onClick={() => navigate('/login?type=user')}
                >
                  User Login
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Car size={16} />}
                  sx={{ 
                    bgcolor: '#f59e0b',
                    color: '#000',
                    borderRadius: '10px',
                    textTransform: 'none',
                    px: 2.5,
                    fontWeight: 700,
                    boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)',
                    '&:hover': { 
                      bgcolor: '#fbbf24',
                      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.23)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s'
                  }}
                  onClick={() => navigate('/login?type=driver')}
                >
                  Driver Login
                </Button>
              </Box>

              {/* Mobile Menu Icon */}
              <IconButton 
                sx={{ display: { xs: 'flex', md: 'none' }, color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                onClick={(e) => setMobileAnchor(e.currentTarget)}
              >
                <MenuIcon size={20} />
              </IconButton>

              <Menu
                anchorEl={mobileAnchor}
                open={Boolean(mobileAnchor)}
                onClose={() => setMobileAnchor(null)}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    bgcolor: '#1e293b',
                    color: 'white',
                    minWidth: 240,
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)',
                    '& .MuiMenuItem-root': {
                      py: 2,
                      gap: 2,
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                    }
                  }
                }}
              >
                {navItems.map((item) => (
                  <MenuItem key={item.label} onClick={() => scrollToSection(item.id)}>
                    {item.icon}
                    {item.label}
                  </MenuItem>
                ))}
                <Box sx={{ p: 2, mt: 1, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                   <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/login?type=user')} 
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none', borderRadius: '10px' }}
                   >
                    User Login
                   </Button>
                   <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={() => navigate('/login?type=driver')} 
                    sx={{ bgcolor: '#f59e0b', color: '#000', textTransform: 'none', borderRadius: '10px', '&:hover': { bgcolor: '#fbbf24' } }}
                   >
                    Driver Login
                   </Button>
                </Box>
              </Menu>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;