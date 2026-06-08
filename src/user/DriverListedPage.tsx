import { Suspense, lazy } from "react";
import { Container, Box, Grid, Card, CardContent, Skeleton } from "@mui/material";

const DriverList = lazy(() => import("../components/ListDrivers")); // Lazy import

const DriverListSkeleton = () => (
  <Container maxWidth="lg" sx={{ py: 6 }}>
    {/* Page Title & Button Skeletons */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Skeleton variant="text" width={220} height={40} />
      <Skeleton variant="rectangular" width={180} height={48} sx={{ borderRadius: 2 }} />
    </Box>
    
    {/* 4 Card Grid Skeletons */}
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} md={6} key={i}>
          <Card sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)', boxShadow: 'none' }}>
            <Box sx={{ height: 100, bgcolor: '#e2e8f0' }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: -6 }}>
              <Skeleton variant="circular" width={100} height={100} sx={{ border: '4px solid white' }} />
            </Box>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3 }}>
              <Skeleton variant="text" width={140} height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={90} height={20} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="100%" height={45} sx={{ borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

const DriverListedPage = () => {
  return (
    <Suspense fallback={<DriverListSkeleton />}>
      <DriverList />
    </Suspense>
  );
};

export default DriverListedPage;
