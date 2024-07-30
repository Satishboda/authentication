

import React, { useEffect, useState } from "react";
// import "../../assets/css/users/UsersList.css";
import { Link } from "react-router-dom";
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
import BaseApi from "../../../BaseApi"
import EditUser from "./EditUser"; 
import UserCreationForm from "./UserCreationForm"; 
import Loader from "../../../components/Loader/Loader";
// import './userlist.css'


const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editUserShow, setEditUserShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [visibleColumns, setVisibleColumns] = useState([
    { id: "username", visible: true },
    { id: "email", visible: true },
    { id: "firstName", visible: true },
    { id: "lastName", visible: true },
  ]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSingleDeleteConfirmation, setShowSingleDeleteConfirmation] =
    useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false); // State for Create User Modal
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [alertVisible, setAlertVisible] = useState({ visible: false, message: '', type: 'success' });
  



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await BaseApi.get("/users");
        setUsers(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [reload]);

  const handleUserUpdated = (message, type) => {
    setAlertVisible({ visible: true, message, type });
    setTimeout(() => {
      setAlertVisible({ visible: false, message: '', type: 'success' });
    }, 1300);
  };
  const handleUserCreated = (message, type) => {
    setAlertVisible({ visible: true, message, type });
    setTimeout(() => {
      setAlertVisible({ visible: false, message: '', type: 'success' });
    }, 1300);
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

  const handleEdit = (user) => {
    console.log(user);
    setCurrentUser(user);
    setEditUserShow(true);
  };

  const handleCloseEdit = () => {
    console.log("I am Here to Close");
    setEditUserShow(false);
    setCurrentUser(null);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      const payload = [userToDelete.id];
      try {
        await BaseApi.delete("/users", { data: payload });
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        setUserToDelete(null);
        
        // Show alert on successful deletion
        setAlertVisible({ visible: true, message: 'User has been deleted successfully.', type: 'success' });
        setShowSingleDeleteConfirmation(false);
        // Hide alert after 1300 milliseconds
        setTimeout(() => {
          setAlertVisible({ visible: false, message: '', type: 'success' });
          
        }, 1300);
        
      } catch (error) {
        console.error("Error deleting user:", error);
        setAlertVisible({ visible: true, message: 'Error deleting user.', type: 'error' });
      }
    }
  }

  const handleDeleteMultipleUser = async () => {
    const payload = selectedItems.map((item) => item.id);
    try {
      await BaseApi.delete("/users", { data: payload });
      setUsers(users.filter((user) => !selectedItems.includes(user)));
      setSelectedItems([]);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  const handleDropdownClick = (user, detail) => {
    if (detail.id === "edit") {
      handleEdit(user);
    } else if (detail.id === "delete") {
      setUserToDelete(user);
      setShowSingleDeleteConfirmation(true);
    }
  };

  const renderActions = (user) => (
    <ButtonDropdown
      className="awsui_item-element_93a1u_1l8wd_97.awsui_highlighted_93a1u_1l8wd_119:not(#\9)"
      ariaLabel="Actions"
      variant="icon"
      iconName="ellipsis"
      items={[
        { id: "edit", text: "Edit" },
        { id: "delete", text: "Delete" },
      ]}
      onItemClick={(event) => handleDropdownClick(user, event.detail)}
    />
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

  const handleDeleteMultipleUsersClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleCancelSingleDelete = () => {
    setShowSingleDeleteConfirmation(false);
    setUserToDelete(null);
  };

  const handleCreateUserClick = () => {
    setShowCreateUserModal(true);
  };

  const handleCloseCreateUserModal = () => {
    setShowCreateUserModal(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.detail.filteringText);
    setCurrentPage(1);
  };
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
                        Delete
                      </Button>
                    </span>
                  )}
                  <span style={{ minWidth: "130px" }}>
                    <Button variant="primary" onClick={handleCreateUserClick}>
                      Create
                    </Button>
                  </span>
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

          {/* Create User Modal */}
          {showCreateUserModal && (
            <Modal
              visible={showCreateUserModal}
              // header="Create User"

              onDismiss={handleCloseCreateUserModal}
            >
              <UserCreationForm
                showCreateUserModal={showCreateUserModal}
                setShowCreateUserModal={setShowCreateUserModal}
                reload={reload}
                setReload={setReload}
                onUserCreated={handleUserCreated}
              />
            </Modal>
          )}

          {/* Confirmation Modals */}
          {showSingleDeleteConfirmation && (
            <Modal
              visible={showSingleDeleteConfirmation}
              
              header={
                <>
                  
                  <Header variant="h2">Delete User</Header>
                  
                </>
              }
              footer={
                <SpaceBetween direction="horizontal" size="xs">
                  
                  <Button onClick={handleCancelSingleDelete}>Cancel</Button>
                  <Button variant="primary" onClick={handleDeleteUser}>
                    Delete
                  </Button>
                </SpaceBetween>
              }
              onDismiss={handleCancelSingleDelete}
            >
              Are you sure you want to delete this user?
            </Modal>
          )}

          {showDeleteConfirmation && (
            <Modal
              visible={showDeleteConfirmation}
              header="Delete Users"
              footer={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={handleCancelDelete}>Cancel</Button>
                  <Button variant="primary" onClick={handleDeleteMultipleUser}>
                    Delete
                  </Button>
                </SpaceBetween>
              }
              onDismiss={handleCancelDelete}
            >
              Are you sure you want to delete {selectedItems.length} users?
            </Modal>
          )}

          {/* Edit User Modal */}
          {editUserShow && (
            <EditUser
              user={currentUser}
              handleClose={handleCloseEdit}
              reload={reload}
              setReload={setReload}
              onUserUpdated={handleUserUpdated}
            />
          )}
        </div>
      )}
    </>
  );
};

export default UsersList;


