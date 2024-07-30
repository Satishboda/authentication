// import { Outlet } from "react-router-dom";
// import { Box, Toolbar } from "@mui/material";
// import colorConfigs from "../../configs/colorConfigs";
// import sizeConfigs from "../../configs/sizeConfigs";
// import Sidebar from "../common/Sidebar";
// import Topbar from "../common/Topbar";

// const MainLayout = () => {
//   return (
//     <Box sx={{ display: "flex" }}>
//       <Topbar />
//       <Box
//         component="nav"
//         sx={{
//           width: sizeConfigs.sidebar.width,
//           flexShrink: 0
//         }}
//       >
//         <Sidebar />
//       </Box>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: `calc(100% - ${sizeConfigs.sidebar.width})`,
//           minHeight: "100vh",
//           backgroundColor: colorConfigs.mainBg
//         }}
//       >
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default MainLayout;
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Drawer, Toolbar } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import Sidebar from "../common/Sidebar";
import Topbar from "../common/Topbar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
     <>
     
    <Box sx={{ display: "flex" }}>
      <Topbar isSidebarOpen={isSidebarOpen} onToggleSidebar={handleToggleSidebar} />
      <Box
        component="nav"
        sx={{
          width: isSidebarOpen ? sizeConfigs.sidebar.width : 0,
          flexShrink: 0,
          transition: "width 0.3s",
        }}
      >
        <Sidebar isOpen={isSidebarOpen} />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: isSidebarOpen ? `calc(100% - ${sizeConfigs.sidebar.width})` : "100%",
          minHeight: "100vh",
          backgroundColor: colorConfigs.mainBg,
          transition: "width 0.3s",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box></>
  );
};

export default MainLayout;
