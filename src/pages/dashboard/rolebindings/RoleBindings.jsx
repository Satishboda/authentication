

import React, { useState, useEffect } from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import BaseApi from "../../../BaseApi";
import UsersPage from "./UsersPage";
import GroupsPage from "./GroupsPage";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@cloudscape-design/components";
import RoleAssignment from "./RoleAssignment";
import { Link } from "@cloudscape-design/components";
import { Alert } from "@cloudscape-design/components";
import Loader from "../../../components/Loader/Loader";


const RoleBindings = () => {
  const [roles, setRoles] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [view, setView] = useState("roles");
  const [selectedRole, setSelectedRole] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [isRoleAssignmentVisible, setIsRoleAssignmentVisible] = useState(false);
  const [filteringText, setFilteringText] = useState(""); // State for filtering text
  const [alertVisible, setAlertVisible] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(true);


  const handleRoleAssigned = (message, type) => {
    setAlertVisible({ visible: true, message, type });
    setTimeout(() => {
      setAlertVisible({ visible: false, message: "", type: "success" });
    }, 1300);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await BaseApi.get("/roles");
        const filteredRoles = response.data.filter(
          (role) =>
            role.name === "jboss-admin" ||
            role.name === "jboss-super-admin" ||
            role.name === "jboss-viewer"
        );
        setRoles(filteredRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
      finally{
        setLoading(false)
      }
    };

    fetchRoles();
  }, []);
  if(loading)
  {
    return <Loader />
  }

  const handleMenuOpen = (event, role) => {
    setAnchorEl(event.currentTarget);
    setCurrentRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewChange = (view) => {
    setSelectedRole(currentRole);
    setView(view);
    handleMenuClose();
  };

  const handleAddRole = () => {
    setIsRoleAssignmentVisible(true);
  };

  const handleModalDismiss = () => {
    setIsRoleAssignmentVisible(false);
  };

  // Filter roles based on the filtering text
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(filteringText.toLowerCase())
  );

  if (view === "users" && selectedRole) {
    return <UsersPage role={selectedRole} setSelectedRole={setSelectedRole}/>;
  }

  if (view === "groups" && selectedRole) {
    return <GroupsPage role={selectedRole} />;
  }

  return (
    <>
      
      <div >
      {alertVisible.visible && (
        <div className="alert-container">
          <Alert
            visible={alertVisible.visible}
            type={alertVisible.type}
            dismissible
            onDismiss={() =>
              setAlertVisible({ ...alertVisible, visible: false })
            }
            header={alertVisible.type === "success" ? "Success" : "Error"}
          >
            {alertVisible.message}
          </Alert>
          <br/>
        </div>
      )}
        <Table
          renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
            `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
          }
          onSelectionChange={({ detail }) =>
            setSelectedItems(detail.selectedItems)
          }
          selectedItems={selectedItems}
          ariaLabels={{
            selectionGroupLabel: "Items selection",
            allItemsSelectionLabel: ({ selectedItems }) =>
              `${selectedItems.length} ${
                selectedItems.length === 1 ? "item" : "items"
              } selected`,
            itemSelectionLabel: ({ selectedItems }, item) => item.name,
          }}
          columnDefinitions={[
            {
              id: "id",
              header: "ID",
              cell: (item) => item.id,
              isRowHeader: true,
            },
            {
              id: "name",
              header: "Name",
              cell: (item) => <Link href="#">{item.name}</Link>,
              sortingField: "name",
              width: "450px",
            },
            {
              id: "actions",
              header: "Associations",
              cell: (item) => (
                <div>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuOpen(event, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleViewChange("users")}>
                      Users
                    </MenuItem>
                    <MenuItem onClick={() => handleViewChange("groups")}>
                      Groups
                    </MenuItem>
                  </Menu>
                </div>
              ),
            },
          ]}
          columnDisplay={[
            { id: "name", visible: true },
            { id: "actions", visible: true },
          ]}
          enableKeyboardNavigation
          items={filteredRoles} // Use filtered roles
          loadingText="Loading roles"
          selectionType="multi"
          trackBy="id"
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No roles found</b>
              </SpaceBetween>
            </Box>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Find roles"
              filteringText={filteringText}
              onChange={({ detail }) => setFilteringText(detail.filteringText)} // Update filtering text state
            />
          }
          header={
            <Header
              counter={
                selectedItems.length
                  ? `(${selectedItems.length}/${filteredRoles.length})` // Use filtered roles length
                  : `(${filteredRoles.length})` // Use filtered roles length
              }
              actions={
                <Button
                  variant="primary"
                  color="primary"
                  onClick={handleAddRole}
                >
                  Assign Role
                </Button>
              }
            >
              Roles
            </Header>
          }
          pagination={
            <Pagination
              currentPageIndex={1}
              pagesCount={Math.ceil(filteredRoles.length / 10)}
            />
          } // Use filtered roles length
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={{
                pageSize: 10,
                contentDisplay: [
                  { id: "id", visible: true },
                  { id: "name", visible: true },
                  { id: "actions", visible: true },
                ],
              }}
              pageSizePreference={{
                title: "Page size",
                options: [
                  { value: 10, label: "10 roles" },
                  { value: 20, label: "20 roles" },
                ],
              }}
              wrapLinesPreference={{}}
              stripedRowsPreference={{}}
              contentDensityPreference={{}}
              contentDisplayPreference={{
                options: [
                  { id: "id", label: "ID" },
                  { id: "name", label: "Name" },
                  { id: "actions", label: "Actions" },
                ],
              }}
              stickyColumnsPreference={{
                firstColumns: {
                  title: "Stick first column(s)",
                  description:
                    "Keep the first column(s) visible while horizontally scrolling the table content.",
                  options: [
                    { label: "None", value: 0 },
                    { label: "First column", value: 1 },
                    { label: "First two columns", value: 2 },
                  ],
                },
                lastColumns: {
                  title: "Stick last column",
                  description:
                    "Keep the last column visible while horizontally scrolling the table content.",
                  options: [
                    { label: "None", value: 0 },
                    { label: "Last column", value: 1 },
                  ],
                },
              }}
            />
          }
        />

        {/* RoleAssignment Modal */}
        {isRoleAssignmentVisible && (
          <RoleAssignment
            visible={true}
            onDismiss={handleModalDismiss}
            onRoleAssigned={handleRoleAssigned}
            setIsRoleAssignmentVisible={setIsRoleAssignmentVisible}
            isRoleAssignmentVisible={isRoleAssignmentVisible}
          />
        )}
      </div>
    </>
  );
};

export default RoleBindings;