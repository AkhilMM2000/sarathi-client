import { useEffect, useState } from "react";
import { Box, Grid, Typography, MenuItem, Select, FormControl, InputLabel, Paper } from "@mui/material";
import StatCard from "../components/StatCard";
import CustomPieChart from "../components/CustomPieChart";
import CustomGraph from "../components/CustomGraph";

import { DriverAPI } from "../Api/AxiosInterceptor";

const DriverStatusDashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | undefined>(undefined);

  const [statusSummary, setStatusSummary] = useState({});
  const [chartData, setChartData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalRides, setTotalRides] = useState(0);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusRes = await DriverAPI.get(`/dashboard/status-summary`, {
          params: { year, month }
        });

        const earningsRes = await DriverAPI.get(`/dashboard/earnings-summary`, {
          params: { year, month }
        });

        setStatusSummary(statusRes.data);
        setChartData(earningsRes.data.chartData);
        setTotalEarnings(earningsRes.data.totalEarnings);
        setTotalRides(earningsRes.data.totalRides);
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      }
    };

    fetchData();
  }, [year, month]);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Driver Dashboard</Typography>

      {/* Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid item>
          <FormControl>
            <InputLabel>Year</InputLabel>
            <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[2023, 2024, 2025].map((yr) => (
                <MenuItem key={yr} value={yr}>{yr}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <InputLabel>Month</InputLabel>
            <Select value={month ?? ""} onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : undefined)}>
              <MenuItem value="">All</MenuItem>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <MenuItem key={m} value={i + 1}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Top Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <StatCard title="Total Earnings" value={`₹${totalEarnings}`} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard title="Total Rides" value={totalRides} />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Ride Status</Typography>
            <CustomPieChart data={statusSummary} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Earnings</Typography>
            <CustomGraph data={chartData} month={month} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DriverStatusDashboard;
