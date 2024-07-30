import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout";
import HomePage from "../pages/home/HomePage";
import { RouteType } from "./config";
import DefaultPage from "../pages/dashboard/DefaultPage";
import DashboardIndex from "../pages/dashboard/DashboardIndex";

import AnalyticsPage from "../pages/dashboard/AnalyticsPage";
import SaasPage from "../pages/dashboard/SaasPage";
import ComponentPageLayout from "../pages/component/ComponentPageLayout";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';


import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AlertPage from "../pages/component/AlertPage";
import ButtonPage from "../pages/component/ButtonPage";


import FetchGroups from "../pages/dashboard/groups/FetchGroups";
import FetchProjects from "../pages/dashboard/projects/FetchProjects";
import GroupDetails from "../pages/dashboard/groups/GroupDetails";
import ProjectDetails from "../pages/dashboard/projects/ProjectDetails";
import UsersList from "../pages/dashboard/users/UsersList";
import RoleBindings from "../pages/dashboard/rolebindings/RoleBindings";
import Content from "../components/Content";
import Loading from "../components/Loader/Loading";
import Dashboard from "../components/Dashboard";

// import DocumentationPage from "../pages/documentation/DocumentationPage";
// import { ArticleOutlinedIcon } from '@mui/icons-material/ArticleOutlined';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ShareIcon from '@mui/icons-material/Share';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Users from "../pages/dashboard/users/Users";
// import RoleBasedRoute from "./RoleBasedRoute";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <Dashboard />,
    state: "home"
  },
  {
    path: "/installation",
   
    element: <Dashboard/>,
    state: "installation",
    sidebarProps: {
      displayText: "Dashboard",
      icon: <DashboardOutlinedIcon />
    }
  },
 
  {
    path: "/projects",
    element: <DashboardPageLayout />,
    state: "projects",
    sidebarProps: {
      displayText: "Projects",
      icon: <AccountTreeIcon />
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "projects.index"
      },
      {
        path: "/projects/list",
        element: <FetchProjects />,
        state: "projects.list",
        sidebarProps: {
          displayText: "Manage"
        },
      },
     
      {
        path: "/projects/:id",
        element: <ProjectDetails />, 
        state: "projects.details"
      },
     
    ]
  },
  
  {
    path: "/users",
    element: <DashboardPageLayout />,
    // element:<RoleBasedRoute element={<DashboardPageLayout />} requiredRole="jboss-viewer" />,
    state: "users",
    sidebarProps: {
      displayText: "User Management",
      icon: <SupervisorAccountIcon  />
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "users.index"
      },
      {
        path: "/users/list",
        element: <UsersList/>,
        state: "users.list",
        sidebarProps: {
          displayText: "Users"
        },
      },
      {
        path: "/users/groups",
        // element: <FetchGroups />,
        element: <FetchGroups />,
        state: "users.groups",
        sidebarProps: {
          displayText: "Groups"
        }
      },
      {
        path: "/users/groups/:id",
        element: <GroupDetails />, 
        state: "users.groupDetail"
      },
      {
        path: "/users/rolebindings",
        element: <RoleBindings  />,
        state: "users.rolebindings",
        sidebarProps: {
          displayText: "Role bindings"
        }
      }
    ]
  },
  {
    path: "/component",
    element: <ComponentPageLayout />,
    state: "component",
    sidebarProps: {
      displayText: "Cluster Management",
      icon: <ShareIcon />
    },
    child: [
      {
        path: "/component/alert",
        element: <AlertPage />,
        state: "component.alert",
        sidebarProps: {
          displayText: "create"
        },
      },
      {
        path: "/component/button",
        element: <ButtonPage />,
        state: "component.button",
        sidebarProps: {
          displayText: "manage"
        }
      }
    ]
  },
  {
    path: "/dashboard",
    element: <DashboardPageLayout />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Administration",
      icon: <AdminPanelSettingsIcon />
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "dashboard.index"
      },
      {
        path: "/dashboard/default",
        element: <Users />,
        state: "dashboard.default",
        sidebarProps: {
          displayText: "Events"
        },
      },
      {
        path: "/dashboard/analytics",
        element: <AnalyticsPage />,
        state: "dashboard.analytics",
        sidebarProps: {
          displayText: "Deployments"
        }
      },
      {
        path: "/dashboard/saas",
        element: <Loading />,
        state: "dashboard.saas",
        sidebarProps: {
          displayText: "Server Groups"
        }
      }
    ]
  },
  // {
  //   path: "/documentation",
  //   element: <DocumentationPage />,
  //   state: "documentation",
  //   sidebarProps: {
  //     displayText: "Documentation",
  //     icon: <ArticleOutlinedIcon/>
  //   }
  // },
 
];

export default appRoutes;