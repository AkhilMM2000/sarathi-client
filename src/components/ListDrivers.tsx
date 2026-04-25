import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  TextField,
  Box,
  Button,
  Container,
  Rating,
  Divider,
} from "@mui/material";


import LocationOnIcon from "@mui/icons-material/LocationOn";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Link } from "react-router-dom";
import { GetDriverswithDistance } from "../Api/driverService";
import { DriverData } from "../constant/types";
import { useDebounce } from "../hooks/useDebounce";
import EnhancedPagination from "./common/Adwancepagination";
  type DriverWithDistance = DriverData & { distance: number };
const DriverList = () => {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(4);
const [drivers, setDrivers] = useState<Partial<DriverWithDistance>[]>([]);
  const fetchDrivers = async (search: string) => {
    try {
      const result = await GetDriverswithDistance(
    "user",
    page,
    limit,
    search
  );
      setDrivers(result.drivers.data)
      setTotalPages(result.drivers.totalPages)
console.log(result)
    } catch (error) {
console.log(error)
    }
  };
const debouncedFetchDrivers = useDebounce(fetchDrivers, 500);

  useEffect(() => {
debouncedFetchDrivers('')
  },[page]);
 const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 6,
        backgroundColor: "#F4F5F7", // Sophisticated pearl gray
        borderRadius: 3,
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="800"
        textAlign="center"
        mb={4}
        sx={{ color: '#09090b', letterSpacing: '-0.02em' }}
      >
        Select Your Driver
      </Typography>

      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mb: 5,
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          p: 0.5,
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <TextField
          fullWidth
          placeholder="Search for a location..."
          variant="outlined"
          onChange={(e) => debouncedFetchDrivers(e.target.value)}
          sx={{ '& fieldset': { border: 'none' } }}
        />
      </Box>

      <Grid container spacing={3}>
  {drivers.length > 0 ? (
    drivers.map((driver) => (
      <Grid item xs={12} md={6} lg={6} key={driver._id}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: 'none',
            overflow: "hidden",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
              borderColor: 'rgba(0,0,0,0.08)'
            },
          }}
        >
          <Box
            sx={{
              height: 100,
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              position: "relative",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: -6,
            }}
          >
            <Avatar
              src={`${import.meta.env.VITE_IMAGEURL}/${driver.profileImage}`}
              sx={{
                width: 100,
                height: 100,
                border: "4px solid white",
                boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                backgroundColor: 'white'
              }}
            />
          </Box>

          <CardContent
            sx={{
              pt: 3,
              px: { xs: 2, sm: 4 },
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="800"
              textAlign="center"
              sx={{ color: '#09090b', letterSpacing: '-0.01em' }}
              gutterBottom
            >
              {driver.name}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
              <Rating
                value={driver?.averageRating||0}
                precision={0.1}
                readOnly
                size="small"
                sx={{ color: '#f59e0b' }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#3f3f46', ml: 1 }}>
                ({driver.totalRatings || 0})
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5, opacity: 0.6 }} />

            <Box sx={{ mt: 1 }}>
        
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <LocationOnIcon
                  fontSize="small"
                  sx={{ color: '#71717a', mr: 1.5 }}
                />
                <Typography variant="body2" sx={{ color: '#52525b', fontWeight: 500 }}>
                  {driver.place}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DirectionsCarIcon
                  fontSize="small"
                  sx={{ color: '#10b981', mr: 1.5 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: '#10b981', fontWeight: 700 }}
                >
                  {Math.floor(driver.distance!)} km away
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: "auto", pt: 4 }}>
              <Button
                component={Link}
                to={`/bookslot/${driver._id}`}
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: 1.5,
                  textTransform: "uppercase",
                  py: 1.5,
                  fontWeight: "800",
                  letterSpacing: '0.05em',
                  backgroundColor: '#09090b',
                  color: 'white',
                  boxShadow: 'none',
                  "&:hover": {
                    backgroundColor: '#27272a',
                    boxShadow: 'none'
                  }
                }}
              >
                Book Now
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))
  ) : (
    <Grid item xs={12}>
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 2,
          backgroundColor: "white",
          borderRadius: 4,
          border: '1px solid rgba(0,0,0,0.04)',
          maxWidth: 600,
          mx: "auto",
          mt: 4
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#f4f4f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}
        >
          <DirectionsCarIcon sx={{ fontSize: 40, color: '#a1a1aa' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#09090b', letterSpacing: '-0.01em', mb: 1.5 }}>
          No Drivers Nearby
        </Typography>
        <Typography variant="body1" sx={{ color: '#52525b', lineHeight: 1.6, px: { xs: 2, sm: 6 } }}>
          There are currently no drivers registered close to your saved location. We are constantly expanding, so please check back soon or try searching a different area!
        </Typography>
      </Box>
    </Grid>
  )}
</Grid>
        {drivers.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <EnhancedPagination 
              count={totalPages} 
              page={page}  
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        )}
    </Container>
  );
};

export default DriverList;
