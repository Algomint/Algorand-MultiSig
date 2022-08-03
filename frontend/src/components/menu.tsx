import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import useStyles from "../style";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { useWallet } from "../hooks/walletHook";
import CancelIcon from "@mui/icons-material/Cancel";
import AlgoSignerLogo from "../assets/AlgoSignerLarge-inverted.png";
import { useNavigate } from "react-router-dom";

type menuItem = {
  name: string;
  path: string;
};

const pages: menuItem[] = [
  { name: "Generate Multisign address", path: "/genMulti" },
  { name: "Generate RawTxn", path: "/rawTxn" },
  { name: "SignTxt", path: "/signTxn" },
];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const classes = useStyles();
  const auth = useWallet();
  const nav = useNavigate()

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (path:string) => (event: any) => {
    nav(path)
    console.log(path);
    setAnchorElNav(null);
  };

  function logout() {
    auth.signout(() => {});
  }

  return (
    <AppBar className={classes.navbar} position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { md: "flex", xs: "none" }, mr: 3 }}>
            <Logo />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu(page.path)}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Logo />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu(page.path)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          {auth.authStatus && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Close AloSigner Wallet">
                <IconButton onClick={logout} sx={{ p: 0, color: "white" }}>
                  <Box sx={{ ml: 2, color: "white" }}>
                    <img
                      src={AlgoSignerLogo}
                      alt="logo"
                      loading="lazy"
                      width="120px"
                    />
                  </Box>
                  <CancelIcon sx={{ ml: 2 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
