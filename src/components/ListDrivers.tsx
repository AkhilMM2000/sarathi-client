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
import EnhancedPagination from "./Adwancepagination";
  type DriverWithDistance = DriverData & { distance: number };
const DriverList = () => {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(2);
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
        py: 4,
        backgroundColor: "#e6f2ff", // Light sky blue background
        borderRadius: 2,
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={3}
        color="primary"
      >
        Available Drivers
      </Typography>

      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mb: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 1,
          p: 0.5,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by  location"
          variant="outlined"
          onChange={(e) => debouncedFetchDrivers(e.target.value)}
        />
      </Box>

      <Grid container spacing={3}>
  {drivers.length > 0 ? (
    drivers.map((driver) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={driver._id}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.2s, box-shadow 0.2s",
            borderRadius: 3,
            overflow: "hidden",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: 6,
            },
          }}
        >
          <Box
            sx={{
              height: 80,
              bgcolor: "primary.light",
              position: "relative",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: -5,
            }}
          >
            <Avatar
              src={`${import.meta.env.VITE_IMAGEURL}/${driver.profileImage}`}
              sx={{
                width: 90,
                height: 90,
                border: "4px solid white",
                boxShadow: 2,
              }}
            />
          </Box>

          <CardContent
            sx={{
              pt: 2,
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
            >
              {driver.name}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <Rating
                value={driver?.averageRating||0}
                precision={0.1}
                readOnly
                size="small"
              />
              <Typography variant="body2" color="text.secondary" ml={0.5}>
                5
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ mt: 1 }}>
        
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOnIcon
                  fontSize="small"
                  color="action"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {driver.place}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DirectionsCarIcon
                  fontSize="small"
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Typography
                  variant="body2"
                  color="primary"
                  fontWeight="medium"
                >
                
                  {Math.floor(driver.distance!)} km away
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: "auto", pt: 2 }}>
              <Button
                component={Link}
                to={`/bookslot/${driver._id}`}
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  py: 1,
                  fontWeight: "bold",
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
          py: 6,
          px: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No drivers found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try modifying your search criteria
        </Typography>
      </Box>
    </Grid>
  )}
</Grid>
        <EnhancedPagination 
       count={totalPages} 
         page={page}  
        onChange={handlePageChange} 
        color="primary" 
      />
    </Container>
  );
};

export default DriverList;
