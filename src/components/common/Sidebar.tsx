import { Avatar, Drawer, List, Stack, Toolbar } from "@mui/material";
import assets from "../../assets"
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import appRoutes from "../../routes/appRoutes";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import "./rotate.css";
interface SidebarProps {
  isOpen: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      sx={{
        '& .MuiDrawer-paper': {
          width: sizeConfigs.sidebar.width,
          boxSizing: 'border-box',
          backgroundColor: colorConfigs.sidebar.bg,
          color: colorConfigs.sidebar.color,
        },
      }}
    >
      <List disablePadding>
        <Toolbar sx={{ marginBottom: "20px" }}>
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            // justifyContent="center"
          >
            {/* <Avatar src={assets.images.logo} className="rotate-logo" /> */}
            {/* <div >
            <SettingsSuggestIcon className="rotate-logo"/>Jboss Automation
            </div> */}
            
            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
    <SettingsSuggestIcon className="rotate-logo" fontSize="large" />
    <span style={{fontSize:"20px"}}>Jboss Automation</span>
</div> */}
 <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' ,marginTop:"1rem"}}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SettingsSuggestIcon className="rotate-logo" fontSize="large" />
        <span style={{ fontSize: "20px" }}>Jboss Automation</span>
      </div>
      <span style={{ fontSize: "15px",marginLeft:"9rem"}}>Platform</span>
    </div>

          </Stack>
        </Toolbar>
        {appRoutes.map((route, index) => (
          route.sidebarProps ? (
            route.child ? (
              <SidebarItemCollapse item={route} key={index} />
            ) : (
              <SidebarItem item={route} key={index} />
            )
          ) : null
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;