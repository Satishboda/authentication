// import { AppBar, Toolbar, Typography } from "@mui/material";
// import colorConfigs from "../../configs/colorConfigs";
// import sizeConfigs from "../../configs/sizeConfigs";

// const Topbar = () => {
//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         width: `calc(100% - ${sizeConfigs.sidebar.width})`,
//         ml: sizeConfigs.sidebar.width,
//         boxShadow: "unset",
//         backgroundColor: colorConfigs.topbar.bg,
//         color: colorConfigs.topbar.color
//       }}
//     >
//       <Toolbar>
//         <Typography variant="h6">
//           React sidebar with dropdown
//         </Typography>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Topbar;


// import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import colorConfigs from "../../configs/colorConfigs";
// import sizeConfigs from "../../configs/sizeConfigs";

// interface TopbarProps {
//   isSidebarOpen: boolean;
//   onToggleSidebar: () => void;
// }

// const Topbar: React.FC<TopbarProps> = ({ isSidebarOpen, onToggleSidebar }) => {
//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         width: isSidebarOpen ? `calc(100% - ${sizeConfigs.sidebar.width})` : "100%",
//         ml: isSidebarOpen ? sizeConfigs.sidebar.width : 0,
//         boxShadow: "unset",
//         backgroundColor: colorConfigs.topbar.bg,
//         color: colorConfigs.topbar.color,
//         transition: "width 0.3s, margin-left 0.3s",
//       }}
//     >
//       <Toolbar>
//         <IconButton
//           color="inherit"
//           aria-label="open drawer"
//           edge="start"
//           onClick={onToggleSidebar}
//           sx={{ mr: 2 }}
//         >
//           <MenuIcon />
//         </IconButton>
//         {/* <Typography variant="h6" noWrap>
//           React sidebar with dropdown
//         </Typography> */}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Topbar;

//second best code

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate=useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogoutClick = () => {
   
    console.log('Logout clicked');
    localStorage.removeItem("expires_in");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("name");
    localStorage.removeItem("role")
    navigate("/login")
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: isSidebarOpen ? `calc(100% - ${sizeConfigs.sidebar.width})` : "100%",
        ml: isSidebarOpen ? sizeConfigs.sidebar.width : 0,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
        transition: "width 0.3s, margin-left 0.3s",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          
        </Typography>
        <div>
          <IconButton
            color="inherit"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            {/* <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" style={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem> */}
            <MenuItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <Logout fontSize="small" style={{ color: 'red' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;





