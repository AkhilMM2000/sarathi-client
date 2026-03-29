import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Car, 
  PhoneCall, 
  Mail, 
  MapPin 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const socialLinks = [
    { icon: <Facebook size={18} />, href: "#" },
    { icon: <Twitter size={18} />, href: "#" },
    { icon: <Instagram size={18} />, href: "#" },
    { icon: <Linkedin size={18} />, href: "#" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0f172a',
        color: 'rgba(255,255,255,0.6)',
        pt: 10,
        pb: 4,
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand section */}
          <Grid item xs={12} md={4}>
            <Box 
              onClick={() => navigate("/")}
              sx={{ display: "flex", alignItems: "center", mb: 3, cursor: 'pointer' }}
            >
              <Car
                size={28}
                style={{ marginRight: '12px', color: '#818cf8', flexShrink: 0 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "900", color: 'white', letterSpacing: '-0.02em' }}
              >
                Sarathi
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.8 }}>
              Modernizing the ride-booking landscape with premium service, 
              vetted drivers, and a focus on safety and reliability for every traveler.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, i) => (
                <IconButton 
                  key={i} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.03)', 
                    color: 'rgba(255,255,255,0.4)',
                    '&:hover': { bgcolor: '#4f46e5', color: 'white' },
                    transition: 'all 0.2s'
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Site links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700, color: 'white' }}>
              Company
            </Typography>
            {["About Us", "Fleet", "Pricing", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{ 
                  mb: 1.5, 
                  fontSize: "0.875rem", 
                  display: "block", 
                  color: 'inherit',
                  '&:hover': { color: 'white' } 
                }}
              >
                {item}
              </Link>
            ))}
          </Grid>

          {/* Legal */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700, color: 'white' }}>
              Legal
            </Typography>
            {["Terms of Service", "Privacy Policy", "Cookie Policy", "Safety"].map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{ 
                  mb: 1.5, 
                  fontSize: "0.875rem", 
                  display: "block", 
                  color: 'inherit',
                  '&:hover': { color: 'white' } 
                }}
              >
                {item}
              </Link>
            ))}
          </Grid>

          {/* Contact info */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 700, color: 'white' }}>
              Contact Us
            </Typography>
            <Box className="space-y-4">
              <Box sx={{ display: "flex", gap: 2 }}>
                <MapPin size={18} className="text-indigo-400 mt-1" />
                <Typography variant="body2">
                  123 Ride Street, Alpha Block <br />
                  Tech District, Bangalore 560001
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PhoneCall size={18} className="text-indigo-400" />
                <Typography variant="body2">+91 98765 43210</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Mail size={18} className="text-indigo-400" />
                <Typography variant="body2">hello@sarathi.com</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.05)' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption">
            © {new Date().getFullYear()} Sarathi Mobility Private Limited.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
            All rights reserved. Designed for excellence.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
