import React, { useEffect, useState,useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Header,
  CollectionPreferences,
  TextFilter,
  Input,
  SpaceBetween,
  Box,
  Pagination,
  Alert
} from "@cloudscape-design/components";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BaseApi from "../../../BaseApi";
// import './fetchgroups.css'; 
import { Link } from "react-router-dom";
import debounce from 'lodash.debounce';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Loader from "../../../components/Loader/Loader";


const FetchGroups = () => {
 
  const [groups, setGroups] = useState([]);
  const [del, setDel] = useState(0);
  const [error, setError] = useState(null);
  const[pageSize,setPageSize]=useState(5)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [editGroup, setEditGroup] = useState(null);
  const [deleteGroup, setDeleteGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [toast, setToast] = useState({ visible: false, type: "", message: "" });
  const [modalAlert, setModalAlert] = useState({ visible: false, message: "" });
  const [validationMessage, setValidationMessage] = useState('');
  const [flag, setFlag] = useState(false);
  const[editFlag,setEditFlag]=useState(false)
  const [loading,setLoading]=useState(true);
  

 

  const handleCreateGroup = async () => {
    if (!newGroupName) {
      setValidationMessage('Field is required');
      return;
    }
   
    try {
      const response = await BaseApi.post("/group", { name: newGroupName });
      setGroups(prevGroups => [...prevGroups, response.data]);
      setIsCreateModalOpen(false);
      setNewGroupName("");
      setDel(del+1);
      setToast({ visible: true, type: "success", message: "Group created successfully!" });
    } catch (error) {
      setError(error);
      setModalAlert({ visible: true, message: "Group name already exists" });
    }
  };

  const handleEditGroup = async () => {
    try {
      const response = await BaseApi.put(`/update-group/${editGroup.id}`, { name: newGroupName });
      const updatedGroups = groups.map(group => group.id === editGroup.id ? response.data : group);
      setGroups(updatedGroups);
      setIsEditModalOpen(false);
      setNewGroupName("");
      setEditGroup(null);
      setDel(del+1);
      setToast({ visible: true, type: "success", message: "changes are done !" });
     
    } catch (error) {
      setError(error);
      setModalAlert({ visible: true, message: "Group name already exists !" });
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await BaseApi.delete(`/delete-group/${deleteGroup.id}`);
      const updatedGroups = groups.filter(group => group.id !== deleteGroup.id);
      setGroups(updatedGroups);
      setIsDeleteModalOpen(false);
      
      setToast({ visible: true, type: "success", message: `Group ${deleteGroup.name} deleted successfully!`});
        setDeleteGroup(null);
    } catch (error) {
      setError(error);
    }
  };

  const handleDeleteMultipleGroups = async () => {
    const payload = selectedItems.map(item => item.id);

    try {
      for (const groupId of payload) {
        await BaseApi.delete(`/delete-group/${groupId}`);
      }
      const updatedGroups = groups.filter(group => !selectedItems.some(item => item.id === group.id));
      setGroups(updatedGroups);
      
      setShowDeleteConfirmation(false);
      setToast({ visible: true, type: "success", message: `${selectedItems.length} groups deleted successfully!`});
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting groups:", error);
      setError(error);
    }
  };

  const filteredGroups = groups.filter(
    (group) =>
      (group.name &&
        group.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (group.id &&
        group.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.detail.filteringText);
    setCurrentPageIndex(1);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteMultipleGroupsClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleMenuOpen = (event, group) => {
    setAnchorEl(event.currentTarget);
    setCurrentGroup(group);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentGroup(null);
  };
  const handlePreferencesChange = ({ detail }) => {
    setPageSize(detail.pageSize);
  };

  const handleMenuItemClick = (action, group) => {
    if (action === "edit") {
      setEditGroup(group);
      setNewGroupName(group.name);
      setIsEditModalOpen(true);
    } else if (action === "delete") {
      setDeleteGroup(group);
      setIsDeleteModalOpen(true);
    }
    handleMenuClose();
  };

  const renderActions = (group) => (
    <div>
      <IconButton onClick={(event) => handleMenuOpen(event, group)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && currentGroup === group}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick("edit", group)}>Edit</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("delete", group)}>Delete</MenuItem>
      </Menu>
    </div>
  );

  const totalPages = Math.ceil(filteredGroups.length / pageSize);
  const currentPageUsers = filteredGroups.slice(
    (currentPageIndex - 1) * pageSize,
    currentPageIndex * pageSize
  );
  
  useEffect(() => {
    
    const fetchMembersCount = async (groupId) => {
      try {
        const response = await BaseApi.get(`/group-members/${groupId}`);
        return response.data.length;
      } catch (error) {
        console.error("Error fetching members count:", error);
        return 0;
      }
    };
    const fetchData = async () => {
      try {
        console.log("here access token is",`${BaseApi.defaults.access_token}`)
        const response = await BaseApi.get("/groups");
        const groups = response.data;
    
        const updatedGroups = await Promise.all(groups.map(async (group) => {
          const count = await fetchMembersCount(group.id);
          return { ...group, count };
        }));
    
        console.log(updatedGroups);
        setGroups(updatedGroups);
        setLoading(false)
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, type: "", message: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (modalAlert.visible) {
      const timer = setTimeout(() => {
        setModalAlert({ visible: false, message: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [del,toast,modalAlert]);
  const checkGroupNameExists = async (groupName) => {
    try {
      const response = await BaseApi.get("/groups");
      const groupExists = response.data.some(group => group.name === groupName);
      if (groupExists) {
       setFlag(true)
      } else {
       setFlag(false)
      }
    } catch (error) {
      setError(error);
    }
  };
  console.log("groups...")
  console.log(groups)
  const dismissToast = () => setToast({ visible: false, type: "", message: "" });
  const dismissModalAlert = () => setModalAlert({ visible: false, message: "" });
  const debouncedCheckGroupNameExists = useCallback(debounce(checkGroupNameExists, 300), []);
  const handleNameChange = ({ detail }) => {
   
    setNewGroupName(detail.value);
    setValidationMessage('');
    debouncedCheckGroupNameExists(detail.value);
  };
  const handleEditChange = ({ detail }) => {
    if(detail.value===''){
      setEditFlag(true)
    }else{
      setEditFlag(false)
    }
   
      setNewGroupName(detail.value);
     
    
    setValidationMessage('');
    debouncedCheckGroupNameExists(detail.value);
  };
  const handleChanges=()=>{
    setIsCreateModalOpen(false); 
    setModalAlert({ visible: false, message: "" });
    setValidationMessage("")
    setFlag(false)
    setNewGroupName("")
   
    
  }

  const cancelModal=()=>{
    setIsEditModalOpen(false);
    setEditFlag(false)
  }
 
 
  return (
    <>
    {loading ? (<Loader/>):(
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
      <div className="header"></div>
      <Table
        // renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
        //   `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
        // }
        ariaLabels={{
          selectionGroupLabel: "Items selection",
          allItemsSelectionLabel: ({ selectedItems }) =>
            `${selectedItems.length} ${
              selectedItems.length === 1 ? "item" : "items"
            } selected`,
          itemSelectionLabel: ({ selectedItems }, item) => item.name,
        }}
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) =>
          setSelectedItems(detail.selectedItems)
        }
        
       
        columnDefinitions={[
          {
            id: 'groupName',
            header: 'Group Name',
            cell: item => (<Link to={`/users/groups/${item.id}`} >{item.name}</Link>),
            sortingField:"groupName"
          },
          {
            id: 'count',
            header: 'Members Count',
            cell: item =>item.count,
            sortingField:"count"

          },
          {
            id: "actions",
            header: "Actions",
            cell: (item) => renderActions(item),
            visible: true,
          },
        ]}
        enableKeyboardNavigation
        items={currentPageUsers}
        loadingText="Loading resources"
        selectionType="multi"
        trackBy="name"
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>Search Results not found !!</b>
            </SpaceBetween>
          </Box>
        }
        filter={<TextFilter filteringPlaceholder="Search for Groups" onChange={handleSearchChange} filteringText={searchQuery} />}
        header={
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Header style={{ marginRight: 'auto' }}
                counter={
                  selectedItems.length ? `(${selectedItems.length}/${groups.length})` : `(${groups.length})`
                }
              >
                Groups
              </Header>
              {selectedItems.length > 0 && (
                <span style={{ minWidth: '130px' }}>
                  <Button variant="primary" onClick={handleDeleteMultipleGroupsClick}>Delete</Button>
                </span>
              )}
              <span style={{ minWidth: '130px',marginLeft: '-2rem' }} >
                <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>Create</Button>
              </span>
            </div>
            <br />
          </>
        }
        pagination={
          <Pagination
            currentPageIndex={currentPageIndex}
            pagesCount={totalPages}
            onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
            ariaLabels={{
              nextPageLabel: "Next page",
              previousPageLabel: "Previous page",
              pageLabel: (pageNumber) => `Page ${pageNumber} of ${totalPages}`,
            }}
          />
        }
        preferences={
          <CollectionPreferences
            title="Preferences"
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            preferences={{
              pageSize: pageSize,
              visibleContent: ["groupName", "actions"],
            }}
            pageSizePreference={{
              title: "Select page size",
              options: [
                { value: 5, label: "5 groups" },
                { value: 10, label: "10 groups" },
                { value: 15, label: "15 groups" },
                { value: 20, label: "20 groups" },
              ],
            }}
            onConfirm={handlePreferencesChange}
          />
        }
      />
      <Modal
        onDismiss={handleChanges}
        visible={isCreateModalOpen}
        closeAriaLabel="Close modal"
        size="medium"
        header="Create Group"
      >
        <SpaceBetween direction="vertical" size="xs">
       
          <Input
            value={newGroupName}
            onChange={handleNameChange}
            placeholder="Group name"
          />
          
        {validationMessage && (
        <div
          style={{
            color: "red",
            marginBottom: "10px",
          }}
        >
          Group name is required
        </div>
      )}
          
            {newGroupName !== "" && (
        <>
          {flag ? (
              <div>
              <CancelIcon
                style={{ width: 'auto', height: '0.75em', marginRight: '0.1em',color:'red' }} 
              /> <span>already exist's</span></div>
          ) : (
            <div>
              <CheckCircleIcon
                style={{ width: 'auto', height: '0.75em', marginRight: '0.1em',color:'green' }} 
              />
               <span>Available</span>
            </div>
          )}
        </>
      )}
            <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="primary" onClick={handleCreateGroup} disabled={flag || newGroupName===""}>
              Create
            </Button>
            <Button variant="link" onClick={handleChanges}>
              Cancel
            </Button>
          </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Modal>
      <Modal
        onDismiss={() => {setIsEditModalOpen(false); setModalAlert({ visible: false, message: "" });setEditFlag(false)}}
        visible={isEditModalOpen}
        closeAriaLabel="Close modal"
        size="medium"
        header="Edit Group"
      >
        <SpaceBetween size="xs">
        <Alert
              visible={modalAlert.visible}
              type="error"
              dismissible
              onDismiss={dismissModalAlert}
              header="Error"
            >
              {modalAlert.message}
            </Alert>
            {validationMessage && (
              <Alert
                visible={validationMessage !== ""}
                type="warning"
                onDismiss={() => setValidationMessage("")}
              >
                {validationMessage}
              </Alert>
              
              
            )}
          <Input
            value={newGroupName}
            onChange={handleEditChange}
            placeholder="Group Name"
          />
           <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="primary" onClick={handleEditGroup} disabled={editFlag} >
              Save
            </Button>
            <Button variant="link" onClick={cancelModal}>
              Cancel
            </Button>
          </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Modal>
      <Modal
        onDismiss={() => setIsDeleteModalOpen(false)}
        visible={isDeleteModalOpen}
        closeAriaLabel="Close modal"
        size="medium"
        header="Delete Group"
        footer={
          <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="primary" onClick={handleDeleteGroup}>
              Delete
            </Button>
            <Button variant="link" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </SpaceBetween>
          </Box>
        }
      >
        Are you sure you want to delete this group?
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
            <Button variant="primary" onClick={handleDeleteMultipleGroups}>
              Delete
            </Button>
            <Button variant="link" onClick={handleCancelDelete}>
              Cancel
            </Button>
          </SpaceBetween></Box>
        }
      >
        Are you sure you want to delete the selected groups?
      </Modal>
    </div>
  )}
    </>
  );
};

export default FetchGroups;

















