
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  SpaceBetween,
  Checkbox,
  TextFilter,
  Header,
  Pagination,
  CollectionPreferences,
  Alert
} from "@cloudscape-design/components";
import BaseApi from "../../../BaseApi";

import { Link, useParams } from "react-router-dom";
import Box from "@cloudscape-design/components/box";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";


import Multiselect from "@cloudscape-design/components/multiselect";

const GroupDetails = () => {
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMember, setDeleteMember] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: "", message: "" });
  const [value,setValue]=useState(0)
  const[groupName,setGroupName]=useState("")
  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [noUsersAvailable, setNoUsersAvailable] = useState(false);

  useEffect(() => {
    fetchData();
    getGroupDetails(id);
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, type: "", message: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
    console.log("selected options",selectedOptions)
  }, [id,value,toast,selectedOptions]);
  const getGroupDetails = async (group_id) => {
    try {
      const response = await BaseApi.get(`group-details/${group_id}`);
      console.log(response)
      setGroupName(response.data.name);
    } catch (error) {
      console.log("Error fetching in group details");
    }
  };

  const fetchData = async () => {
    try {
      const membersResponse = await fetchGroupMembers(id);
      setMembers(membersResponse);
      const usersResponse = await fetchUsers();
      const filteredUsers = usersResponse.filter(
        (user) => !membersResponse.some((member) => member.id === user.id)
      );
      setUsers(filteredUsers);
    } catch (error) {
      setError(error);
      console.error("Error fetching group members:", error);
    }
  };

  const fetchUsers = async () => {
    const response = await BaseApi.get("/users");
    return response.data;
  };

  const fetchGroupMembers = async (id) => {
    const response = await BaseApi.get(`/group-members/${id}`);
    return response.data;
  };

  const handleAddMembers = async () => {
    try {
      const newMembers = [];

      for (const member of selectedOptions) {
        const response = await BaseApi.post(
          "/allocate-group",
          {},
          {
            params: {
              user_id: member.value,
              group_id: id,
            },
          }
        );
        console.log(`Added member ${member}, response:`, response.data);
        const addedUser = users.find((user) => user.id === member.id);
        if (addedUser) {
          newMembers.push(addedUser);
        }

        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== member.id)
        );
      }

      setMembers((prevMembers) => [...prevMembers, ...newMembers]);
      // setIsCreateModalOpen(false);
      console.log("random")
      
      setValue(value+1)
      setToast({ visible: true, type: "success", message: ` ${selectedOptions.length} users allocated to the group successfully!` });
      setSelectedOptions([])
    } catch (error) {
      console.error("Error adding members:", error);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      (member.username &&
        member.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.firstName &&
        member.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.lastName &&
        member.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (member.email &&
        member.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pageSize = 6;
  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  const currentPageUsers = filteredMembers.slice(
    (currentPageIndex - 1) * pageSize,
    currentPageIndex * pageSize
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.detail.filteringText);
    setCurrentPageIndex(1);
  };

  

  const handleDeleteMember = async (deleteMember) => {
    try {
      await BaseApi.delete("/deallocate-group", {
        params: {
          user_id: deleteMember.id,
          group_id: id,
        },
      });
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== deleteMember.id)
      );
      setIsDeleteModalOpen(false);
      setToast({ visible: true, type: "success", message: ` ${deleteMember.username} is deallocated from the group!` });
      setValue(value+1)
      setDeleteMember(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleDeleteMultipleMembers = async () => {
    console.log("items",selectedItems)
    
    try {
      for (const user of selectedItems) {
        const response=await BaseApi.delete("/deallocate-group", {
          params: {
            user_id: user.id,
            group_id: id,
          },
        });
        console.log(response)
      }
      setMembers((prevMembers) =>
        prevMembers.filter((member) => !selectedItems.includes(member.id))
      );
      setShowDeleteConfirmation(false);
     
      setToast({ visible: true, type: "success", message: "Members deallocated from the group successfully!" });
      setValue(value + 1);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting users:", error);
      setToast({ visible: true, type: "error", message: "Error deallocating members!" });
    }
  };
  

  const options = users.length===0 ? 
  [{ label: "No users ", value: "no-users" ,disabled: true}] : users.map((user) => ({
    label: user.username,
    value: user.id,
    
  }));
  
  
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };
  const handleDeleteMultipleMembersClick=()=>{
    setShowDeleteConfirmation(true)
  }
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (action,member) => {
    setDeleteMember(member)
    setIsDeleteModalOpen(true)
    handleMenuClose();

  };
  const handleMenuOpen = (event, member) => {
    setAnchorEl(event.currentTarget);
    setDeleteMember(member);
  };
  const renderAction = (member) => (
    <div>
      <IconButton onClick={(event) => handleMenuOpen( event,member)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && deleteMember === member}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick("delete",member)}>Deallocate</MenuItem>
      </Menu>
    </div>
  );
  const dismissToast = () => setToast({ visible: false, type: "", message: "" });
  const handleMultiSelect=({detail})=>{
    
    setSelectedOptions(detail.selectedOptions);
   
   
  }
 

 

  return (
    <div className="table-container">
     {toast.visible && (
        <Alert
          visible={toast.visible}
          type={toast.type}
          dismissible
          onDismiss={dismissToast}
          header={toast.type === "success" ? "Success" : "Error"}
        >
          {toast.message}
        </Alert>
      )}
      <div className="header">
       
      </div>

      {/* {error && <p>Error: {error.message}</p>} */}
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
          itemSelectionLabel: ({ selectedItems }, item) => item.username,
        }}
        columnDefinitions={[
          {
            id: "username",
            header: "UserName",
            cell: (item) => item.username,
          },
          {
            id: "firstname",
            header: "FirstName",
            cell: (item) => item.firstName,
          },
          {
            id: "lastname",
            header: "LastName",
            cell: (item) => item.lastName,
          },
          {
            id: "email",
            header: "Email",
            cell: (item) => item.email,
          },
          {
            id:"actions",
            header:"Action",
            cell:(item)=>renderAction(item),
            visible:true,

          },
        ]}
        enableKeyboardNavigation
        items={currentPageUsers}
        loadingText="Loading resources"
        selectionType="multi"
        trackBy="id"
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>Search Results not Found !!!</b>
            </SpaceBetween>
          </Box>
        }
        filter={
          <TextFilter
            filteringPlaceholder="search members here"
            onChange={handleSearchChange}
            filteringText={searchQuery}
          />
        }
        header={
         
          <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/users/groups">
            <h5 style={{ margin: 0,fontSize:"16px" }}>{groupName}</h5>
          </Link>
          <span style={{ marginLeft: "0.5rem",fontSize:"18px" }}>Members</span>
          <span style={{ marginLeft: "0.5rem" ,fontSize:"18px"}}>
            {selectedItems.length
              ? `(${selectedItems.length}/${selectedItems.length})`
              : `(${members.length})`}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {selectedItems.length > 0 && (
            <span style={{ minWidth: "130px" }}>
              <Button variant="primary" onClick={handleDeleteMultipleMembersClick}>Deallocate</Button>
            </span>
          )}
    <>
        <Multiselect
          selectedOptions={selectedOptions}
          onChange={handleMultiSelect}
          options={options}
          placeholder="Select members"
          hideTokens
        />
       
      
    </>
   
          <span style={{ minWidth: "130px", marginLeft: "1rem" }}>
            <Button
              variant="primary"
              onClick={handleAddMembers}
              disabled={selectedOptions.length ? false : true}
            >
              Assign
            </Button>
          </span>
          
        </div>
      </div>
      <br />
    </div>
        }
        pagination={
          <Pagination
            currentPageIndex={currentPageIndex}
            pagesCount={totalPages}
            onChange={({ detail }) =>
              setCurrentPageIndex(detail.currentPageIndex)}
          />
        }
        preferences={
          <CollectionPreferences
            title="Preferences"
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            preferences={{
              pageSize: 10,
              contentDisplay: [
                { id: "username", visible: true },
                { id: "firstname", visible: true },
                { id: "lastname", visible: true },
                { id: "email", visible: true },
                { id: "actions", visible: true },
              ],
            }}
            pageSizePreference={{
              title: "Page size",
              options: [
                { value: 10, label: "10 resources" },
                { value: 20, label: "20 resources" },
              ],
            }}
          />
        }
      />

     

      
      <Modal
        visible={isDeleteModalOpen}
        onDismiss={() => setIsDeleteModalOpen(false)}
        header="Deallocate Member"
        footer={
          <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={() => handleDeleteMember(deleteMember)} variant="primary">
              Deallocate
            </Button>
            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          </SpaceBetween>
          </Box>
        }
      >
        <p>Are you sure you want to deallocate {deleteMember?.username}?</p>
      </Modal>
      <Modal
        onDismiss={() => setShowDeleteConfirmation(false)}
        visible={showDeleteConfirmation}
        closeAriaLabel="Close modal"
        size="medium"
        header="Delete Selected Groups"
        footer={
          <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="primary" onClick={handleDeleteMultipleMembers}>
              Delete
            </Button>
            <Button variant="link" onClick={handleCancelDelete}>
              Cancel
            </Button>
          </SpaceBetween></Box>
        }
      >
        Are you sure you want to delete the selected members?
      </Modal>

    </div>
  );
};

export default GroupDetails;


