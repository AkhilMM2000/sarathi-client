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
  ChevronDown,
  Phone,
  Info,
  Home as HomeIcon
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const location = useLocation();
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

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileAnchor(null);
  };

  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon size={18} /> },
    { label: "About", path: "/", icon: <Info size={18} /> },
    { label: "Support", path: "/", icon: <Phone size={18} /> },
  ];

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: isScrolled 
            ? "rgba(15, 23, 42, 0.8)" 
            : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          py: isScrolled ? 0.5 : 1.5,
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            
            {/* Logo Section */}
            <Box 
              onClick={() => navigate("/")}
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
                  background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
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
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Typography
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    '&:hover': { color: '#fff' },
                    transition: 'color 0.2s',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: location.pathname === item.path ? '100%' : '0%',
                      height: '2px',
                      background: '#6366f1',
                      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>

            {/* CTA Buttons Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
              
              {/* Login/Register Dropdown or Buttons */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1.5 }}>
                <Button
                  variant="text"
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    textTransform: 'none', 
                    fontWeight: 600,
                    '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                  }}
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  sx={{ 
                    bgcolor: '#4f46e5',
                    borderRadius: '12px',
                    textTransform: 'none',
                    px: 3,
                    fontWeight: 700,
                    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
                    '&:hover': { 
                      bgcolor: '#4338ca',
                      boxShadow: '0 12px 25px rgba(79, 70, 229, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onClick={() => navigate('/user')}
                >
                  Sign Up
                </Button>
              </Box>

              {/* Mobile Menu Icon */}
              <IconButton 
                sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
                onClick={(e) => setMobileAnchor(e.currentTarget)}
              >
                <MenuIcon />
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
                    minWidth: 200,
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                      gap: 2,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                    }
                  }
                }}
              >
                {navItems.map((item) => (
                  <MenuItem key={item.label} onClick={() => handleNavigation(item.path)}>
                    {item.icon}
                    {item.label}
                  </MenuItem>
                ))}
                <Box sx={{ p: 1, mt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                   <Button fullWidth onClick={() => handleNavigation('/login')} sx={{ color: 'white', textTransform: 'none' }}>Log In</Button>
                   <Button fullWidth variant="contained" onClick={() => handleNavigation('/user')} sx={{ mt: 1, bgcolor: '#4f46e5', textTransform: 'none' }}>Sign Up</Button>
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