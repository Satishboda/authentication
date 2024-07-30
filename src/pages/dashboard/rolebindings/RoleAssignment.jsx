
import React, { useState, useEffect } from "react";
import BaseApi from "../../../BaseApi";

import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import Select from "@cloudscape-design/components/select";
import Multiselect from "@cloudscape-design/components/multiselect";
import CloseIcon from "@mui/icons-material/Close";
import UsersPage from "./UsersPage";
import FetchRoles from "./FetchRoles";
// import '../../assets/css/roles/roleAssignement.css'

const RoleAssignment = ({
  visible,
  onDismiss,
  onRoleAssigned,
  setIsRoleAssignmentVisible,
  isRoleAssignmentVisible,
}) => {
  const [assignmentType, setAssignmentType] = useState(""); // State to track the selected assignment type
  const [data, setData] = useState([]); // State to hold fetched data (users or groups)
  const [selectedIds, setSelectedIds] = useState([]); // State to track selected user or group IDs
  const { roles } = FetchRoles();
  const [selectedRole, setSelectedRole] = useState(""); // State to track selected role ID
  const [selectedRoleName, setSelectedRoleName] = useState(""); // State to track selected role name
  const [dataFetched, setDataFetched] = useState(false); // State to track if data has been fetched
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State to control success modal visibility

  const finalRoles = ["jboss-super-admin", "jboss-admin", "jboss-viewer"];
  const filteredRoles = roles.filter((role) => finalRoles.includes(role.name));

  const [modalAlert, setModalAlert] = useState({
    visible: false,
    message: "",
    type: "error",
  }); // Default type is 'error'

  const [isRoleSelected, setIsRoleSelected] = useState(false);
  

  const fetchAllUsers = async () => {
    try {
      const response = await BaseApi.get("/users");
      console.log(response);
    } catch (error) {
      console.error(`Error fetching ${assignmentType}:`, error);
    }
  };

  // let filteredUsers=[];
  // let filteredGroups=[];
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const fetchActualData = async (roleid, rolename) => {
    // const endpoint = assignmentType === "users" ? "/users" : "/groups";
    console.log("yes");
    try {
      const roleAssociatedUsers = await BaseApi.get(
        `/role-members/${roleid}`
      );
      console.log(roleAssociatedUsers.data.role_members);
      const allUsers = await BaseApi.get("/users");
      console.log(allUsers.data);
      const filteredUsersValue = allUsers.data.filter(
        (user) =>
          !roleAssociatedUsers.data.role_members.some(
            (member) => member.id === user.id
          )
      );
      setFilteredUsers(filteredUsersValue);
      // console.log("ans",filteredUsers)

      const roleAssociatedGroups = await BaseApi.get(`/${rolename}/groups`);
      console.log("rolegroups:", roleAssociatedGroups.data.role_groups);
      const allGroups = await BaseApi.get("/groups");
      console.log("allgroups:", allGroups.data);
      const filteredGroupsValue = allGroups.data.filter(
        (group) =>
          !roleAssociatedGroups.data.role_groups.some(
            (member) => member === group.name
          )
      );
      setFilteredGroups(filteredGroupsValue);
      console.log(filteredGroups);
      if (assignmentType === "users") {
        setData(filteredUsersValue);
      } else {
        setData(filteredGroupsValue);
      }
    } catch (error) {
      console.error(`Error fetching ${assignmentType}:`, error);
    }
  };

  const fetchRoleAssociatedUsers = async (roleid) => {
    try {
      const response = await BaseApi.get(`/role-members/${roleid}`);
      console.log(response.data.role_members);
    } catch (error) {}
  };

  const handleSelectionChange = ({ detail }) => {
    setSelectedIds(detail.selectedOptions.map((option) => option.value));
  };

  const handleAssignRole = async () => {
    const apiToAssign =
      assignmentType === "users"
        ? `/assign-role/${selectedRole}`
        : `/add_role_to_group/${selectedRole}`;
    try {
      const response = await BaseApi.post(apiToAssign, selectedIds);
      console.log("Response:", response); // Log the response for debugging
      onRoleAssigned("User updated successfully!", "success"); // Trigger the alert in UsersList
      setIsRoleAssignmentVisible(!isRoleAssignmentVisible);
     
      return <UsersPage role={selectedRole} />;
    } catch (error) {
      console.error("Error assigning role:", error);
      console.error("Error response:", error.response); // Log the error response for more details
    }
  };

  const rough = () => {
    console.log("i am here");
    console.log(filteredUsers);
    setData(filteredGroups);
  };

  const handleCloseModal = () => {
    if (!showSuccessModal) { // Only allow close if success modal is not open
      onDismiss();
    }
  };

  return (
    <>
      <Modal
        onDismiss={onDismiss}
        visible={visible}
        closeOnBackdropClick={false}
        
        header="Assign Role"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={onDismiss}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={selectedIds.length === 0 || selectedRole === ""}
                onClick={handleAssignRole}
              >
                Assign Role
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <Box padding="s">
          <Box margin={{ vertical: "s" }}>
            <Select
              selectedOption={
                selectedRole
                  ? { label: selectedRoleName, value: selectedRole }
                  : null
              }
              onChange={({ detail }) => {
                setSelectedRole(detail.selectedOption.value);
                setSelectedRoleName(detail.selectedOption.label);
                setIsRoleSelected(true);
                // fetchRoleAssociatedUsers(detail.selectedOption.value);
                // fetchAllUsers();
                fetchActualData(
                  detail.selectedOption.value,
                  detail.selectedOption.label
                );
              }}
              options={filteredRoles.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
              placeholder={selectedRoleName || "Select Role"}
            />
          </Box>

          {isRoleSelected && (
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="users"
                  checked={assignmentType === "users"}
                  onChange={() => {
                    setSelectedIds([]);
                    // setSelectedRole('')
                    setAssignmentType("users");
                    // setData(filteredUsers);
                    setDataFetched(false);
                  }}
                  onClick={() => {
                    setData(filteredUsers);
                  }}
                />
                Users
              </label>
              <label style={{ marginLeft: "1rem" }}>
                <input
                  type="radio"
                  value="groups"
                  checked={assignmentType === "groups"}
                  onChange={() => {
                    setSelectedIds([]);
                    // setSelectedRole('')
                    setAssignmentType("groups");
                    // setData(filteredGroups);

                    setDataFetched(false);
                  }}
                  onClick={() => {
                    setData(filteredGroups);
                  }}
                />
                Groups
              </label>
            </div>
          )}

          {assignmentType && (
            <Box margin={{ vertical: "s" }}>
              <Multiselect
                selectedOptions={selectedIds.map((id) => ({
                  label: data.find((item) => item.id === id)[
                    assignmentType === "users" ? "username" : "name"
                  ],
                  value: id,
                }))}
                onChange={handleSelectionChange}
                options={
                  data.length > 0
                    ? data.map((item) => ({
                        label:
                          item[
                            assignmentType === "users" ? "username" : "name"
                          ],
                        value: item.id,
                      }))
                    : [
                        {
                          label: "No options available",
                          value: "",
                          disabled: true,
                        },
                      ]
                }
                placeholder={`Select ${assignmentType}`}
              />
            </Box>
          )}
        </Box>
      </Modal>

      <Modal
        onDismiss={() => setShowSuccessModal(false)}
        visible={showSuccessModal}
        header="Success"
        footer={
          <Box float="right">
            <Button
              variant="primary"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
          </Box>
        }
      >
        <Box padding="s">Role assigned successfully!</Box>
      </Modal>
    </>
  );
};

export default RoleAssignment;