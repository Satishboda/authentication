
import React, { useEffect, useState } from "react";
import BaseApi from "../../../BaseApi.jsx";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Header,
  CollectionPreferences,
  TextFilter,
  Box,
  Pagination,
  Checkbox,
  SpaceBetween,
  Alert,

} from "@cloudscape-design/components";
import Multiselect from "@cloudscape-design/components/multiselect";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const ProjectDetails = () => {
  const { id } = useParams();
  const [clusters, setClusters] = useState([]);
  const [clustersAssigned, setClustersAssigned] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [toast, setToast] = useState({ visible: false, type: "", message: "" });
  const[projectName,setProjectName]=useState("")
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const[currentCluster,setCurrentCluster]=useState(null);
  const[modal,setModal]=useState(false);
  const[confirmation,setConfirmation]=useState(false);



  useEffect(() => {
    getProjectDetails(id)
    getClustersByProjectId(id);
    const fetchData = async () => {
      try {
        const response = await BaseApi.get(`/available_clusters`);
        setClusters(response.data);
      } catch (error) {
        console.log("Error fetching data");
      }
    };
    fetchData();
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, type: "", message: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [id,toast]);

  const getClustersByProjectId = async (projectId) => {
    try {
      const response = await BaseApi.get(`/projects/id/${projectId}/clusters`);
      setClustersAssigned(response.data);
    } catch (error) {
      console.log("Error fetching clusters for project ID:", projectId, error);
    }
  };
  const getProjectDetails = async (projectId) => {
    try {
      const response = await BaseApi.get(`/projects/${projectId}`);
      setProjectName(response.data.name);
    } catch (error) {
      console.log("Error fetching in project details");
    }
  };

  const filteredGroups = clustersAssigned.filter(
    (cluster) =>
      cluster.name &&
      cluster.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredGroups.length / pageSize);
  const currentPageUsers = filteredGroups.slice(
    (currentPageIndex - 1) * pageSize,
    currentPageIndex * pageSize
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.detail.filteringText);
    setCurrentPageIndex(1);
  };

  const handlePreferencesChange = ({ detail }) => {
    setPageSize(detail.pageSize);
  };

  const handleMapCluster = async () => {
    try {
      for (let cluster of selectedOptions) {
        await BaseApi.post(`/clusters/${cluster.value}/projects/${id}`);
      }

      setClustersAssigned((prevAssigned) => [
        ...prevAssigned,
        ...selectedOptions,
      ]);

      setClusters((prevClusters) =>
        prevClusters.filter(
          (cluster) =>
            !selectedOptions.some(
              (selectedCluster) => selectedCluster.value === cluster.id
            )
        )
      );

      setSelectedOptions([]);
      
      setToast({ visible: true, type: "success", message: "Clusters mapped successfully!" });
    } catch (error) {
      console.log("Error in mapping cluster:", error);
      setToast({ visible: true, type: "error", message: "Failed to map clusters!" });
    }
  };
  // const options = users.length===0 ? 
  // [{ label: "No users ", value: "no-users" ,disabled: true}] : users.map((user) => ({
  //   label: user.username,
  //   value: user.id,
    
  // }));
  const options =clusters.length===0 ?  [{ label: "No free clusters ", value: "No free clusters" ,disabled: true}]:
  clusters.map((cluster) => ({
    label: cluster.name,
    value: cluster.id,
    
  }));
  const handleMultiSelect=({detail})=>{
    
    setSelectedOptions(detail.selectedOptions);
   
   
  }
  const handleMenuOpen = (event, cluster) => {
    setAnchorEl(event.currentTarget);
    setCurrentCluster(cluster);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    // setCurrentCluster(null);
  };
  const handleMenuItemClick = (action, cluster) => {
    setCurrentCluster(cluster)
    setModal(true);
    
   
    
    handleMenuClose();
  };
  const handleCancelDelete = () => {
    setCurrentCluster(null)
    setModal(false);
  };

  const closeModal=()=>{
    setSelectedItems([]);
    setConfirmation(false);
  }
  const renderActions = (cluster) => (
    <div>
      <IconButton onClick={(event) => handleMenuOpen(event, cluster)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && currentCluster === cluster}
        onClose={handleMenuClose}
      >
        {/* <MenuItem onClick={() => handleMenuItemClick("edit", cluster)}>
          Edit
        </MenuItem> */}
        <MenuItem onClick={() => handleMenuItemClick("delete", cluster)}>
          Unmap
        </MenuItem>
      </Menu>
    </div>
  );
  const handleUnmapCluster=async ()=>{
    console.log("here",currentCluster)
   

    
    await BaseApi.put(`/clusters/${currentCluster.id}/projects/${id}`).then((res)=>{
      const id=res.data.id;
      const updated=clustersAssigned.filter((cluster)=>cluster.id!==id)
      setClustersAssigned(updated)
      setClusters([...clusters,currentCluster])
      setToast({ visible: true, type: "success", message: "Cluster unmapped successfully!" });
     
     
    }).catch((err)=>{
      console.log("inside error")
      console.log(err)
    })

  
    setModal(false)
    
    
  }
  // const handleMultipleUnmapping=()=>{
  //   console.log(selectedItems)
  // }
  const handleMultipleUnmapping = async () => {
    console.log(selectedItems);
    
    try {
      const unmapPromises = selectedItems.map(item => 
        BaseApi.put(`/clusters/${item.id}/projects/${id}`)
      );
  
      // Await all promises to resolve
      const responses = await Promise.all(unmapPromises);
  
      // Extract IDs of successfully unmapped clusters
      const unmappedClusterIds = responses.map(response => response.data.id);
  
      // Update clustersAssigned and clusters state
      const updatedClustersAssigned = clustersAssigned.filter(cluster => !unmappedClusterIds.includes(cluster.id));
      const updatedClusters = [...clusters, ...selectedItems.filter(item => unmappedClusterIds.includes(item.id))];
  
      setClustersAssigned(updatedClustersAssigned);
      setClusters(updatedClusters);
      setSelectedItems([]);
      setConfirmation(false)
  
      setToast({ visible: true, type: "success", message: "Clusters unmapped successfully!" });
    } catch (error) {
      console.log("inside error");
      console.log(error);
    }
  
    
  };
  const handleConfirmation=()=>{
    setConfirmation(true)
  }

  const dismissToast = () => setToast({ visible: false, type: "", message: "" });
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
      <div className="header"></div>
      {error && <p>Error: {error.message}</p>}
      <Table
        renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
          `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
        }
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
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
            id: "clustername",
            header: "Cluster Name",
            cell: (item) => item.name,
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
            <b>Search Results not found !!</b>
          </Box>
        }
        filter={
          <TextFilter
            filteringPlaceholder="Search for Clusters"
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
          <Link to="/projects/list">
            <h5 style={{ margin: 0,fontSize:"16px" }}>{projectName}</h5>
          </Link>
          <span style={{ marginLeft: "0.5rem",fontSize:"18px" }}>Clusters</span>
          <span style={{ marginLeft: "0.5rem" ,fontSize:"18px"}}>
            {selectedItems.length
              ? `(${selectedItems.length}/${clustersAssigned.length})`
              : `(${clustersAssigned.length})`}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {selectedItems.length > 0 && (
            <span style={{ minWidth: "130px" }}>
              <Button variant="primary" onClick={handleConfirmation}>Unmap</Button>
            </span>
          )}
          <Multiselect
      selectedOptions={selectedOptions}
     
      onChange={handleMultiSelect}
    
      options={options}
      placeholder="select clusters"
      hideTokens
    />
          <span style={{ minWidth: "130px", marginLeft: "1rem" }}>
            <Button
              variant="primary"
              onClick={handleMapCluster}
              disabled={selectedOptions.length?false:true}
            >
              Map Cluster
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
              setCurrentPageIndex(detail.currentPageIndex)
            }
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
              visibleContent: ["clustername"],
            }}
            onConfirm={handlePreferencesChange}
            pageSizePreference={{
              title: "Select page size",
              options: [
                { value: 5, label: "5 resources" },
                { value: 6, label: "6 resources" },
                { value: 7, label: "7 resources" },
                { value: 8, label: "8 resources" },
              ],
            }}
          />
        }
      />
      {/* <Modal
      
        visible={isCreateModalOpen}
        onDismiss={() => setIsCreateModalOpen(false)}
        header="Map Cluster"
        footer={
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleMapCluster} variant="primary" disabled={selectedClusters.length === 0}>
              Submit
            </Button>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          </SpaceBetween>
        }
      >
        {clusters.length > 0 ? (
          <div  style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <h4>Select a cluster:</h4>
            <Table
              columnDefinitions={[
                {
                  id: "select",
                  header: "Select",
                  cell: (cluster) => (
                    <Checkbox
                      checked={selectedClusters.some(
                        (selectedCluster) => selectedCluster.id === cluster.id
                      )}
                      onChange={() => {
                        if (
                          selectedClusters.some(
                            (selectedCluster) => selectedCluster.id === cluster.id
                          )
                        ) {
                          setSelectedClusters(
                            selectedClusters.filter(
                              (selectedCluster) =>
                                selectedCluster.id !== cluster.id
                            )
                          );
                        } else {
                          setSelectedClusters([...selectedClusters, cluster]);
                        }
                      }}
                    />
                  ),
                },
                {
                  id: "clustername",
                  header: "Cluster Name",
                  cell: (item) => item.name,
                },
              ]}
              items={clusters}
              trackBy="id"
              empty={
                <div>Available clusters are assigned to the selected project</div>
              }
            />
          </div>
        ) : (
          <div>No clusters available for mapping.</div>
        )}
      </Modal> */}
      <Modal
        onDismiss={handleCancelDelete}
        visible={modal}
        closeAriaLabel="Close modal"
        size="medium"
        header="Unmap Cluster"
      >
        <SpaceBetween direction="vertical" size="s">
          {/* <Header variant="h4">Confirm Deletion</Header> */}
          <Box>
            Are you sure you to unmap the cluster
          </Box>
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={handleUnmapCluster}>
                Confirm
              </Button>
              <Button onClick={handleCancelDelete}>Cancel</Button>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Modal>
      <Modal
        onDismiss={closeModal}
        visible={confirmation}
        closeAriaLabel="Close modal"
        size="medium"
        header="Unmap Clusters"
      >
        <SpaceBetween direction="vertical" size="s">
          {/* <Header variant="h4">Confirm Deletion</Header> */}
          <Box>
            Are you sure you to unmap the selected clusters
          </Box>
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={handleMultipleUnmapping}>
                Confirm
              </Button>
              <Button onClick={closeModal}>Cancel</Button>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Modal>
      

    </div>
    
  );
};

export default ProjectDetails;

