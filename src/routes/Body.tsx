import { Box } from "@mui/material";
import Header from '../user/Header'
import { Outlet } from 'react-router-dom'

const Body = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Body
