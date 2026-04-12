import { useState, useRef, useEffect } from "react";
import { 
  Button, 
  Typography, 
  Box, 
  Container, 
  TextField, 
  InputAdornment,
  CircularProgress 
} from "@mui/material";
import { 
  Search, 
  ChevronRight, 
  Navigation,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Premium Silver/Dark Map Style
const MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#1d2c4d" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] },
  { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] },
  { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] },
  { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "color": "#334e7f" }] },
  { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#023e58" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#283d6a" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#6f9ba5" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#304a7d" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0e1626" }] }
];

const ProfileLocation = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [address, setAddress] = useState("");
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!window.google) {
      const checkInterval = setInterval(() => {
        if (window.google) {
          setIsApiLoaded(true);
          clearInterval(checkInterval);
        }
      }, 500);
      return () => clearInterval(checkInterval);
    } else {
      setIsApiLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isApiLoaded) return;

    const input = document.getElementById("autocomplete") as HTMLInputElement;
    if (!input) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ["geocode"],
      componentRestrictions: { country: "IN" },
      fields: ["geometry", "formatted_address", "name"]
    });

    autocompleteRef.current = autocomplete;

    autocomplete.addListener("place_changed", () => {
      setIsSearching(true);
      const place = autocomplete.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        toast.error("Invalid location selected");
        setIsSearching(false);
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const placeName = place.name || place.formatted_address || "Service Area";

      const newPos = { lat, lng };
      setLocation(newPos);
      setAddress(place.formatted_address || "");
      
      localStorage.setItem("driverLocation", JSON.stringify({ latitude: lat, longitude: lng }));
      localStorage.setItem('place', placeName);
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo(newPos);
        mapInstanceRef.current.setZoom(15);
        if (markerRef.current) markerRef.current.setPosition(newPos);
      }
      
      setIsSearching(false);
    });
  }, [isApiLoaded]);

  useEffect(() => {
    if (isApiLoaded && mapRef.current && !mapInstanceRef.current) {
      const initialPos = { lat: 20.5937, lng: 78.9629 }; // India Center
      const map = new google.maps.Map(mapRef.current, {
        center: initialPos,
        zoom: 5,
        styles: MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      });
      mapInstanceRef.current = map;
      markerRef.current = new google.maps.Marker({ map, position: initialPos, animation: google.maps.Animation.DROP });
    }
  }, [isApiLoaded]);

  const handleContinue = () => {
    if (!location) return;
    toast.success("Location locked!");
    setTimeout(() => {
      navigate("/verify-documents");
    }, 800);
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "radial-gradient(circle at 20% 30%, #1e1b4b 0%, #0f172a 100%)",
        position: "relative",
        overflow: "hidden",
        p: 3
      }}
    >
      {/* Background Watermark */}
      <Box sx={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h1" sx={{ fontSize: '25vw', fontWeight: 900, color: 'white' }}>SARATHI</Typography>
      </Box>

      <Container maxWidth="md">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", md: "row" },
              bgcolor: "rgba(255, 255, 255, 0.03)", 
              backdropFilter: "blur(20px)", 
              borderRadius: "32px", 
              border: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              minHeight: "600px"
            }}
          >
            {/* Left Column: Controls */}
            <Box sx={{ p: { xs: 4, md: 5 }, width: { xs: '100%', md: '45%' }, display: 'flex', flexDirection: 'column' }}>
               {/* Step Indicator */}
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#6366f1', boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' }} />
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
                  <Typography sx={{ ml: 1, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 700 }}>
                    STEP 2 OF 3
                  </Typography>
               </Box>

               <Typography variant="h4" sx={{ color: "white", fontWeight: 800, mb: 1 }}>
                 Service Area
               </Typography>
               <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 5 }}>
                 Where will you be driving? Enter your primary city or region.
               </Typography>

               <Box sx={{ flexGrow: 1 }}>
                  <TextField
                    id="autocomplete"
                    fullWidth
                    placeholder="Search your city..."
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={20} color="#6366f1" />
                        </InputAdornment>
                      ),
                      endAdornment: isSearching && <CircularProgress size={20} sx={{ mr: 1 }} />
                    }}
                    sx={fieldStyle}
                  />

                  <AnimatePresence>
                    {address && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{ marginTop: '24px' }}
                      >
                         <Box sx={{ p: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', gap: 2 }}>
                            <CheckCircle2 color="#10b981" />
                            <Box>
                               <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, display: 'block', mb: 0.5 }}>ACTIVE SERVICE REGION</Typography>
                               <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{address}</Typography>
                            </Box>
                         </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </Box>

               {/* State-Based Action Button */}
               <Box sx={{ mt: 4 }}>
                  <motion.div
                    animate={location ? { scale: [1, 1.02, 1], transition: { duration: 0.3 } } : {}}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleContinue}
                      disabled={!location}
                      endIcon={<ChevronRight size={20} />}
                      sx={{
                        py: 2,
                        borderRadius: "16px",
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "1rem",
                        bgcolor: location ? "#6366f1" : "rgba(255,255,255,0.05)",
                        color: location ? "white" : "rgba(255,255,255,0.1)",
                        boxShadow: location ? "0 10px 25px -5px rgba(99, 102, 241, 0.4)" : "none",
                        "&:hover": { 
                          bgcolor: location ? "#4f46e5" : "rgba(255,255,255,0.05)",
                          transform: location ? "translateY(-2px)" : "none"
                        },
                        "&.Mui-disabled": {
                           bgcolor: "rgba(255,255,255,0.05)",
                           color: "rgba(255,255,255,0.1)"
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                    >
                      Lock Location & Continue
                    </Button>
                  </motion.div>
               </Box>
            </Box>

            {/* Right Column: Immersive Map */}
            <Box 
              sx={{ 
                width: { xs: '100%', md: '55%' }, 
                position: 'relative',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                minHeight: { xs: '300px', md: 'auto' }
              }}
            >
               <Box ref={mapRef} sx={{ height: '100%', width: '100%' }} />
               {/* Map Overlay Badge */}
               <Box 
                 sx={{ 
                   position: 'absolute', 
                   top: 20, 
                   right: 20, 
                   bgcolor: 'rgba(15, 23, 42, 0.6)', 
                   backdropFilter: 'blur(8px)',
                   px: 2, py: 1, borderRadius: '12px',
                   border: '1px solid rgba(255,255,255,0.1)',
                   display: 'flex', alignItems: 'center', gap: 1
                 }}
               >
                  <Navigation size={14} color="#6366f1" />
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>LIVE MAP VIEW</Typography>
               </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
      <ToastContainer theme="dark" position="top-center" />
    </Box>
  );
};

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: "16px",
    bgcolor: "rgba(255, 255, 255, 0.03)",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
  },
  "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.3)", opacity: 1 },
};

export default ProfileLocation;