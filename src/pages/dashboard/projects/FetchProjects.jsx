import React, { useEffect, useState, useCallback } from "react";
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
  Alert,
} from "@cloudscape-design/components";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// import "../../assets/css/groups/fetchgroups.css";
import { Link } from "react-router-dom";

import debounce from "lodash.debounce";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BaseApi from "../../../BaseApi";
import Loader from "../../../components/Loader/Loader";
import ProjectMapping from "./ProjectMapping";
import GroupsPage from "./GroupsPage";
import UsersPage from "./UsersPage";
 

const FetchProjects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [editProject, setEditProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [toast, setToast] = useState({ visible: false, type: "", message: "" });
  const [modalAlert, setModalAlert] = useState({ visible: false, message: "" });
  const [validationMessage, setValidationMessage] = useState("");
  const [flag, setFlag] = useState(false);
  const [editFlag,setEditFlag]=useState(false)
  const[loading,setLoading]=useState(true)
  const[handleAssignModal,setHandleAssignModal]=useState(false);
  const[view,setView]=useState("")
  const[projectId,setProjectId]=useState("");
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BaseApi.get("/projects");
        setProjects(response.data);
        setLoading(false)
        console.log(response);
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
  }, [toast, modalAlert]);

  const handleCreateProject = async () => {
    if (!name) {
      setValidationMessage("Field is required");
      return;
    }
    try {
      const response = await BaseApi.post("/projects", {
        name: name,
        description: description,
      });
      setProjects([...projects, response.data]);
      setIsCreateModalOpen(false);
      setToast({
        visible: true,
        type: "success",
        message: "Project Created successfully!",
      });
    } catch (error) {
      setModalAlert({
        visible: true,
        type: "error",
        message: "Project name already exists!",
      });
    }
    setName("");
    setDescription("");
  };

  const handleEditProject = async () => {
    
    try {
      const response = await BaseApi.put(`/projects/${editProject.id}`, {
        name: newProjectName,
        description: newProjectDescription,
      });
      const updatedProjects = projects.map((project) =>
        project.id === editProject.id ? response.data : project
      );
      setProjects(updatedProjects);
      setIsEditModalOpen(false);
      setToast({
        visible: true,
        type: "success",
        message: "changes are done!",
      });
      setNewProjectName("");
      setNewProjectDescription("");
      setEditProject(null);
    } catch (error) {
      setError(error);
      setModalAlert({ visible: true, message: "project name already exist's !" });
    }
  };

  const handleDeleteProject = async () => {
    try {
      console.log(deleteProject.id);
      await BaseApi.delete(`/projects/${deleteProject.id}`);
      const updatedGroups = projects.filter(
        (project) => project.id !== deleteProject.id
      );
      setProjects(updatedGroups);
      setIsDeleteModalOpen(false);
      setToast({
        visible: true,
        type: "success",
        message: "Project deleted successfully!",
      });
      setDeleteProject(null);
    } catch (error) {
      setError(error);
      setToast({
        visible: true,
        type: "error",
        message: "Error in deleting the selected project!",
      });
    }
  };

  const handleDeleteMultipleProjects = async () => {
    const payload = selectedItems.map((project) => project.id);

    try {
      for (const projectId of payload) {
        await BaseApi.delete(`/projects/${projectId}`);
      }
      const updatedProjects = projects.filter(
        (project) => !selectedItems.some((item) => item.id === project.id)
      );
      setProjects(updatedProjects);
      setSelectedItems([]);
      setShowDeleteConfirmation(false);
      setToast({
        visible: true,
        type: "success",
        message: "Projects deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting groups:", error);
      setError(error);
    }
  };

  const filteredGroups = projects.filter(
    (project) =>
      (project.name &&
        project.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.detail.filteringText);
    setCurrentPageIndex(1);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const MultipleProjectDeletion = () => {
    setShowDeleteConfirmation(true);
  };

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setCurrentProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentProject(null);
  };

  const handleMenuItemClick = (action, project) => {
    if (action === "edit") {
      setEditProject(project);
      setNewProjectName(project.name);
      setNewProjectDescription(project.description);
      setIsEditModalOpen(true);
    } else if (action === "delete") {
      setDeleteProject(project);
      setIsDeleteModalOpen(true);
    }
    handleMenuClose();
  };

  const renderActions = (project) => (
    <div>
      <IconButton onClick={(event) => handleMenuOpen(event, project)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && currentProject === project}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick("edit", project)}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("delete", project)}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );

  const totalPages = Math.ceil(filteredGroups.length / pageSize);
  const currentPageUsers = filteredGroups.slice(
    (currentPageIndex - 1) * pageSize,
    currentPageIndex * pageSize
  );

  const handlePreferencesChange = ({ detail }) => {
    setPageSize(detail.pageSize);
  };
  const checkProjectNameExists = async (projectName) => {
    try {
      const response = await BaseApi.get("/projects");
      const projectExists = response.data.some(
        (project) => project.name === projectName
      );
      if (projectExists ) {
        setFlag(true);
      } else {
        setFlag(false);
      }
    } catch (error) {
      setError(error);
    }
  };

  const dismissToast = () =>
    setToast({ visible: false, type: "", message: "" });
  const dismissModalAlert = () =>
    setModalAlert({ visible: false, message: "" });
  const debouncedCheckProjectNameExists = useCallback(
    debounce(checkProjectNameExists, 300),
    []
  );

  const handleNameChange = ({ detail }) => {
    setName(detail.value);
    if(detail.value==='')setFlag(true)
    setValidationMessage("");
    debouncedCheckProjectNameExists(detail.value);
  };
  const handleChanges = ({ detail }) => {
    if(detail.value===""){
      setEditFlag(true)
    }else{
      setEditFlag(false)
    }
    setNewProjectName(detail.value);
    setValidationMessage("");
    debouncedCheckProjectNameExists(detail.value);
  };
  const setChanges=()=>{
    setIsCreateModalOpen(false);
    setName("");
    setDescription("")
    setFlag(false)
    setValidationMessage("")
  }
  const handleCancel=()=>{
    setIsEditModalOpen(false);
    setEditFlag(false)
  }

  const handleModalDismiss=()=>{
    setHandleAssignModal(false);
  }

  const handleRoleAssigned = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 1300);
  };
  const handleOpenModal=()=>{
    setHandleAssignModal(true)
    
  }
  const handleUserCountClick=(id,type)=>{
    setView(type);
    setProjectId(id)
    

  }
  if(view==="users"){
  
    return <UsersPage projectId={projectId} setView={setView}/>

  }
  if(view==="groups"){
    return <GroupsPage projectId={projectId} setView={setView}/>

  }

  return (
    <>
    {
      loading ? (<Loader/>):(
    
   

   
    
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
            id: "projectname",
            header: "Project Name",
            cell: (item) => (
              <Link to={`/projects/${item.id}`}>{item.name}</Link>
            ),
            sortingField:"projectname"
          },
          {
            id: "description",
            header: "Description",
            cell: (item) => item.description,
            sortingField:"description"
          },
          {
            id: "groupcount",
            header: "Group Count",
            cell: (item) => (
      <span onClick={() => handleUserCountClick(item.id,'groups')} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
        {item.group_count}
      </span>
    ),
            sortingField:"groupcount"
          },
          
          {
    id: "userscount",
    header: "Users Count",
    cell: (item) => (
      <span onClick={() => handleUserCountClick(item.id,'users')} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
        {item.user_count}
      </span>
    ),
    sortingField: "userscount"
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
        filter={
          <TextFilter
            filteringPlaceholder="Search for Projects"
            onChange={handleSearchChange}
            filteringText={searchQuery}
          />
        }
        header={
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Header
                style={{ marginRight: "auto" }}
                counter={
                  selectedItems.length
                    ? `(${selectedItems.length}/${projects.length})`
                    : `(${projects.length})`
                }
              >
                Projects
              </Header>
              {selectedItems.length > 0 && (
                <span style={{ minWidth: "130px" }}>
                  <Button variant="primary" onClick={MultipleProjectDeletion}>
                    Delete
                  </Button>
                </span>
              )}
             
              <span style={{ minWidth: "200px", marginLeft: "-2rem" ,display:"flex",justifyContent:"space-between"}}>
               
              <Button
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create
                </Button>
                <Button
                  variant="primary"
                  onClick={handleOpenModal}
                >
                  Assign
                </Button>
              </span> 
            </div>
            <br />
          </>
        }
        pagination={
          <Pagination
            currentPageIndex={currentPageIndex}
            onChange={({ detail }) =>
              setCurrentPageIndex(detail.currentPageIndex)
            }
            pagesCount={totalPages}
          />
        }
        preferences={
          <CollectionPreferences
            title="Preferences"
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            pageSizePreference={{
              title: "Select page size",
              options: [
                { value: 5, label: "5 Projects" },
                { value: 10, label: "10 Projects" },
                { value: 15, label: "15 Projects" },
                { value: 20, label: "20 Projects" },
              ],
            }}
            preferences={{ pageSize: pageSize }}
            onConfirm={handlePreferencesChange}
          />
        }
      />

      <Modal
        visible={isCreateModalOpen}
        onDismiss={setChanges}
        header="Create Project"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
           
              <Button variant="primary" onClick={handleCreateProject} disabled={flag || name===""}>
                create
              </Button>
            
              <Button
                variant="link"
                onClick={setChanges}
              >
                Cancel
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween direction="vertical" size="xs">
          {modalAlert.visible && (
              <Alert
                visible={modalAlert.visible}
                type="error"
                dismissible
                onDismiss={dismissModalAlert}
              >
                {modalAlert.message}
              </Alert>
            )}
         
          <Input
            value={name}
            onChange={handleNameChange}
            placeholder="Enter project name"
          />
          {validationMessage && (
        <div
          style={{
            color: "red",
            marginBottom: "10px",
          }}
        >
          Project name is required
        </div>
      )}
          {name !== "" && (
        <>
          {flag ? (
              <div>
              <CancelIcon
                style={{ width: 'auto', height: '0.75em', marginRight: '0.1em',color:'red' }} 
              /><span>already exist's</span></div>
          ) : (
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon
                style={{ width: 'auto', height: '0.75em', marginRight: '0.1em',color:'green' }} 
              />
               Available
            </Box>
          )}
        </>
      )}
          
          <Input
            value={description}
            onChange={({ detail }) => setDescription(detail.value)}
            placeholder="Enter project description"
          />
        </SpaceBetween>
      </Modal>

      <Modal
        onDismiss={() => {
          setIsEditModalOpen(false);
          setModalAlert({ visible: false, message: "" })
          setEditFlag(false);
        }}
        visible={isEditModalOpen}
        closeAriaLabel="Close modal"
        size="medium"
        header="Edit Project"
      >
        <SpaceBetween direction="vertical" size="s">
          {modalAlert.visible && (
            <Alert
              visible={modalAlert.visible}
              type="error"
              dismissible
              onDismiss={dismissModalAlert}
              header="Error"
            >
              {modalAlert.message}
            </Alert>
          )}
          
          <Input
            value={newProjectName}
            onChange={handleChanges}
            placeholder="Project Name"
          />
          <Input
            value={newProjectDescription}
            onChange={({ detail }) => setNewProjectDescription(detail.value)}
            placeholder="Project Description"
          />
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={handleEditProject} disabled={editFlag}>
                Save
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Modal>

      <Modal
        onDismiss={() => setIsDeleteModalOpen(false)}
        visible={isDeleteModalOpen}
        closeAriaLabel="Close modal"
        size="medium"
        header="Delete Project"
      >
        <SpaceBetween direction="vertical" size="s">
          <p>Are you sure you want to delete this project?</p>
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={handleDeleteProject}>
                Delete
              </Button>
              <Button onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Modal>

      <Modal
        onDismiss={handleCancelDelete}
        visible={showDeleteConfirmation}
        closeAriaLabel="Close modal"
        size="medium"
        header="Delete Projects"
      >
        <SpaceBetween direction="vertical" size="s">
          {/* <Header variant="h4">Confirm Deletion</Header> */}
          <Box>
            Are you sure you want to delete the selected project(s)? This action
            cannot be undone.
          </Box>
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={handleDeleteMultipleProjects}>
                Confirm
              </Button>
              <Button onClick={handleCancelDelete}>Cancel</Button>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Modal>
      {handleAssignModal && (
        
          <ProjectMapping
            visible={true}
            onDismiss={handleModalDismiss}
            onRoleAssigned={handleRoleAssigned}
            setIsRoleAssignmentVisible={setHandleAssignModal}
            isRoleAssignmentVisible={handleAssignModal}
          />
          
        )}
    </div>)}
    
    
    
    </>
  );
  
  
};

export default FetchProjects;
