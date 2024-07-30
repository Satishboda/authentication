import React, { useEffect, useState } from 'react'
import BaseApi from '../../../BaseApi';
import Loader from '../../../components/Loader/Loader';
import {
    Table,
    Box,
    SpaceBetween,
    Button,
    Header,
    Pagination,
    CollectionPreferences,
    ButtonDropdown,
    Modal,
    TextFilter,
  } from "@cloudscape-design/components";
  import { Alert } from "@cloudscape-design/components";
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
const UsersPage = ({projectId,setView}) => {
    const[users,setUsers]=useState([]);
    const [loading,setLoading]=useState(true);
    const [selectedItems,setSelectedItems]=useState([])
    const [alertVisible, setAlertVisible] = useState({ visible: false, message: '', type: 'success' });
    const [visibleColumns, setVisibleColumns] = useState([
        { id: "username", visible: true },
        { id: "email", visible: true },
        { id: "firstName", visible: true },
        { id: "lastName", visible: true },
      ]);
      const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
 
  const[deleteModal,setDeleteModal]=useState(false);
  const navigate=useNavigate();


    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const usersResponse = await BaseApi.get(`/projects/${projectId}/users`);
            console.log("usersResponse is", usersResponse);
            setUsers(usersResponse.data);
            setLoading(false)
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchUsers();
      }, [projectId]);

      const handleSearchChange = (event) => {
        setSearchQuery(event.detail.filteringText);
        setCurrentPage(1);
      };

      const filteredUsers = users.filter(
        (user) =>
          (user.username &&
            user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.firstName &&
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.lastName &&
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    
      const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setCurrentUser(user);
      };
    
      const handleMenuClose = () => {
        setAnchorEl(null);
        // setCurrentUser(null);
      };
      const handleMenuItemClick = (action, user) => {
        if (action === "edit") {
        
        } else if (action === "delete") {
        setSelectedItems([currentUser]);
          setDeleteModal(true);
        }
        handleMenuClose();
      };
    

      const renderActions = (user) => (
        <div>
          <IconButton onClick={(event) => handleMenuOpen(event, user)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && currentUser === user}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuItemClick("delete", user)}>
              Unassign
            </MenuItem>
          </Menu>
        </div>
      );
      const handlePageChange = ({ detail }) => {
        setCurrentPage(detail.currentPageIndex);
      };
      const handlePreferencesChange = ({ detail }) => {
        if (detail.pageSize !== pageSize) {
          setPageSize(detail.pageSize);
          setCurrentPage(1);
        }
        if (detail.contentDisplay) {
          setVisibleColumns(detail.contentDisplay);
        }
      };

      const cancelModal =()=>{
        setDeleteModal(false);
        setCurrentUser(null)
      }

    //   const handleUnAssignUser=()=>{
    //    console.log(currentUser);
    //    console.log(deleteUser)
    //   }

    const handleDeleteMultipleUsersClick = async () => {
        const selectedIds = selectedItems.map(item => item.id);
        console.log("selected ids are", selectedIds);

        try {
            
            await BaseApi.delete(`/projects/${projectId}/users/`,  {data:selectedIds} );
            setAlertVisible({ visible: true, message: 'Users successfully unassigned', type: 'success' });

            const updatedUsers = users.filter(user => !selectedIds.includes(user.id));
            setUsers(updatedUsers);
            setSelectedItems([]);
            setDeleteModal(false);
        } catch (error) {
            setAlertVisible({ visible: true, message: 'Failed to unassign users', type: 'error' });
            console.error(error);
        }
    };
    const goBack=()=>{
        setView("")
        
    }
      return (
        <>
          {loading ? (
            <Loader />
          ) : (
            <div className="table-container">
              {alertVisible.visible && (
                        <div className="alert-container">
                        <Alert
                          visible={alertVisible.visible}
                          type={alertVisible.type}
                          dismissible
                          onDismiss={() => setAlertVisible({ ...alertVisible, visible: false })}
                          header={alertVisible.type === 'success' ? 'Success' : 'Error'}
                        >
                          {alertVisible.message}
                        </Alert>
                        </div>
                      )}
                      {/* <br /> */}
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
                    header: "Username",
                    cell: (item) => (
                      <Link to={`/users/${item.id}`}>{item.username}</Link>
                    ),
                    sortingField: "username",
                    isRowHeader: true,
                    visible: visibleColumns.find((col) => col.id === "username")
                      .visible,
                  },
                  {
                    id: "email",
                    header: "Email",
                    cell: (item) => item.email || "N/A",
                    sortingField: "email",
                    visible: visibleColumns.find((col) => col.id === "email")
                      .visible,
                  },
                  {
                    id: "firstName",
                    header: "Firstname",
                    cell: (item) => item.firstName || "N/A",
                    sortingField: "firstName",
                    visible: visibleColumns.find((col) => col.id === "firstName")
                      .visible,
                  },
                  {
                    id: "lastName",
                    header: "Lastname",
                    cell: (item) => item.lastName || "N/A",
                    sortingField: "lastName",
                    visible: visibleColumns.find((col) => col.id === "lastName")
                      .visible,
                  },
                  {
                    id: "actions",
                    header: "Actions",
                    cell: (item) => renderActions(item),
                    visible: true,
                  },
                ]}
                items={paginatedUsers}
                loadingText="Loading users..."
                selectionType="multi"
                trackBy="id"
                wrapLines
                empty={
                  <Box
                    margin={{ vertical: "xs" }}
                    textAlign="center"
                    color="inherit"
                  >
                    <SpaceBetween size="m">
                      <b>No users found</b>
                    </SpaceBetween>
                  </Box>
                }
               
    
                filter={
                  <TextFilter
                    filteringPlaceholder="search Users Here"
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
                            ? `(${selectedItems.length}/${users.length})`
                            : `(${users.length})`
                        }
                      >
                        Users
                      </Header>
                      {selectedItems.length > 0 && (
                        <span style={{ minWidth: "130px" }}>
                          <Button
                            variant="primary"
                            onClick={handleDeleteMultipleUsersClick}
                          >
                            Remove
                          </Button>
                        </span>
                      )}
                      {/* <span style={{ minWidth: "130px" }}>
                        <Button variant="primary" onClick={handleCreateUserClick}>
                          Create
                        </Button>
                      </span> */}

                      <Link to="/projects/list" onClick={goBack}>
                    <span className="back-icon">&#8592;</span> {/* Back icon */}
                  </Link>
                  
                    </div>
                    <br />
                  </>
                }
                pagination={
                  <Pagination
                    currentPageIndex={currentPage}
                    pagesCount={Math.ceil(filteredUsers.length / pageSize)}
                    onChange={handlePageChange}
                  />
                }
                preferences={
                  <CollectionPreferences
                    title="Preferences"
                    confirmLabel="Confirm"
                    cancelLabel="Cancel"
                    preferences={{
                      pageSize: pageSize,
                      contentDisplay: visibleColumns,
                    }}
                    pageSizePreference={{
                      title: "Page size",
                      options: [
                        { value: 6, label: "6 users" },
                        { value: 7, label: "7 users" },
                        { value: 14, label: "14 users" },
                        { value: 21, label: "21 users" },
                      ],
                    }}
                    onConfirm={handlePreferencesChange}
                  />
                }
              />
    
             
    
             
              {deleteModal && (
                <Modal
                  visible={deleteModal}
                  
                  header={
                    <>
                      
                      <Header variant="h2">Unassign User</Header>
                      
                    </>
                  }
                  footer={
                    <Box float='right'>
                    <SpaceBetween direction="horizontal" size="xs">
                      
                     
                      
                      <Button variant="primary" onClick={handleDeleteMultipleUsersClick}>
                        unAssign
                      </Button>
                      <Button onClick={cancelModal}>Cancel</Button>
                    </SpaceBetween>
                    </Box>
                  }
                  onDismiss={cancelModal}
                 
                >
                  Are you sure you to unAssign users?
                </Modal>
              )}
    
             
    
              
            </div>
          )}
        </>
      );
}

export default UsersPage
