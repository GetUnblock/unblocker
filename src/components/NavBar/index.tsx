import {
  Box,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Link, Outlet } from "react-router-dom";
import logo from '../../assets/UnblockLogo.png';

export default function NavBar() {
  return (
    <>
      <AppBar position="static" style={{ background: '#D3D3D3' }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link to="/">
            <Box
              component="img"
              sx={{
                height: 40,
                width: 200,
              }}
              src={logo}
            />
          </Link>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Link to={`image-encoder`}>
              <Button sx={{ color: 'black' }}>
                Base64 Converter
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}
