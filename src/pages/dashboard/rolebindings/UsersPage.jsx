

import React, { useState, useEffect } from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Header from "@cloudscape-design/components/header";
import TextFilter from "@cloudscape-design/components/text-filter";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import BaseApi from "../../../BaseApi";
// import "../../assets/css/roles/UsersPage.css";
import { Button, Link, Modal } from "@cloudscape-design/components";
import axios from "axios";
import { Alert } from "@cloudscape-design/components";
import Loader from "../../../components/Loader/Loader";



const UsersPage = ({ role, setSelectedRole }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteringText, setFilteringText] = useState(""); // State for filtering text
  const [currentPageIndex, setCurrentPageIndex] = useState(1); // State for pagination
  const [itemsToUnassign, setItemsToUnassign] = useState([]);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [alertVisible, setAlertVisible] = useState({ visible: false, message: '', type: 'success' });
  const [temp, setTemp] = useState(0);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await BaseApi.get(`/role-members/${role.id}`);
        if (response.data && Array.isArray(response.data.role_members)) {
          const usersWithGroups = await Promise.all(
            response.data.role_members.map(async (user) => {
              const groupsResponse = await BaseApi.get(
                `/user-groups/${user.id}`
              );
              return {
                ...user,
                groups: groupsResponse.data.map((group) => group.name),
              }; // Extract group names
            })
          );
          setUsers(usersWithGroups);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        setError("Error fetching users");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role.id, temp]);

  // useEffect(()=>{
  //   fetchUsers();
  // }, [users])

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filter users based on the filtering text
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(filteringText.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(filteringText.toLowerCase())) ||
      user.groups.some((group) =>
        group.toLowerCase().includes(filteringText.toLowerCase())
      )
  );

  const pageSize = 10;
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Get the users for the current page
  const currentPageUsers = filteredUsers.slice(
    (currentPageIndex - 1) * pageSize,
    currentPageIndex * pageSize
  );

  const handleShowRemoveConfirmation = () => {
    const list = selectedItems.map((item) => item.id);
    setItemsToUnassign(list);
    setShowRemoveConfirmation(true);
  };
  const handleCancelRemove = () => {
    setShowRemoveConfirmation(false);
    setItemsToUnassign([]);
  };

  const handleRemove = async () => {
    try {
      // const response = await BaseApi.delete("/user/" + userId);
      const response = await axios.delete(`http://192.168.1.192:8000/unassign-role/${role.id}`, {
        headers: {
          "access-token":localStorage.getItem("token")
        },
        data: itemsToUnassign
      })
      console.log(response)
      // setSelectedRole((prevState)=>prevState);
      setTemp(temp+1);
      setSelectedItems([]);
      setShowRemoveConfirmation(false);
      setAlertVisible({ visible: true, message: 'Dissociation from role is successfull.', type: 'success' });
      
      // Hide alert after 1300 milliseconds
      setTimeout(() => {
        setAlertVisible({ visible: false, message: '', type: 'success' });
        
      }, 1300);
      setItemsToUnassign([]);
    } catch (error) {
      setAlertVisible({ visible: true, message: 'Failed to Remove.', type: 'error' });
      setShowRemoveConfirmation(false);
      // Hide alert after 1300 milliseconds
      setTimeout(() => {
        setAlertVisible({ visible: false, message: '', type: 'success' });
      }, 1300);
      setItemsToUnassign([]);
      console.error("Error fetching users:", error);
    }
   
  };

 
  console.log(itemsToUnassign);

  return (
    <div >
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
                    <br/>
                    </div>
                  )}
      <Box>
        <Table
          ariaLabels={{
            selectionGroupLabel: "Items selection",
            allItemsSelectionLabel: ({ selectedItems }) =>
              `${selectedItems.length} ${
                selectedItems.length === 1 ? "item" : "items"
              } selected`,
            itemSelectionLabel: ({ selectedItems }, item) => item.username,
          }}
          selectedItems={selectedItems}
          onSelectionChange={({ detail }) => {
            setSelectedItems(detail.selectedItems);
          }}
          columnDefinitions={[
            {
              id: "username",
              header: "Username",
              cell: (user) => <Link href="#">{user.username}</Link>,
              sortingField: "username",
            },
            {
              id: "email",
              header: "Email",
              cell: (user) => user.email || "N/A",
              sortingField: "email",
            },
            {
              id: "groups",
              header: "Groups",
              cell: (user) => (
                <div className="groups-column">
                  {user.groups && user.groups.length > 0 ? (
                    user.groups.map((group, index) => (
                      <div key={index}>{group}</div>
                    ))
                  ) : (
                    <div>N/A</div>
                  )}
                </div>
              ),
            },
            {
              id: "createdTimestamp",
              header: "Created At",
              cell: (user) => formatTimestamp(user.createdTimestamp),
              sortingField: "createdTimestamp",
            },
          ]}
          items={currentPageUsers}
          loadingText="Loading users"
          selectionType="multi"
          trackBy="id"
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No users found</b>
              </SpaceBetween>
            </Box>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Find users"
              filteringText={filteringText}
              onChange={({ detail }) => {
                setFilteringText(detail.filteringText);
                setCurrentPageIndex(1); // Reset to first page when filtering
              }}
            />
          }
          header={
            <>
              <Header
                actions={
                  <>
                    {selectedItems.length > 0 && (
                      <span style={{ minWidth: "130px" }}>
                        <Button
                          variant="primary"
                          onClick={handleShowRemoveConfirmation}
                        >
                          Remove
                        </Button>
                      </span>
                    )}
                    <Link href="/users/rolebindings">
                      <span className="back-icon">&#8592;</span>{" "}
                      {/* Back icon */}
                    </Link>
                  </>
                }
                counter={`(${selectedItems.length}/${filteredUsers.length})`}
              >
                <span>{role.name}</span>: Users
              </Header>
            </>
          }
          pagination={
            <Pagination
              currentPageIndex={currentPageIndex}
              pagesCount={totalPages}
              onChange={({ detail }) =>
                setCurrentPageIndex(detail.currentPageIndex)
              }
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
                  { id: "userId", visible: true },
                  { id: "username", visible: true },
                  { id: "email", visible: true },
                  { id: "groups", visible: true },
                  { id: "createdTimestamp", visible: true },
                ],
              }}
              pageSizePreference={{
                title: "Page size",
                options: [
                  { value: 10, label: "10 users" },
                  { value: 20, label: "20 users" },
                ],
              }}
              wrapLinesPreference={{}}
              stripedRowsPreference={{}}
              contentDensityPreference={{}}
              contentDisplayPreference={{
                options: [
                  { id: "userId", label: "User ID" },
                  { id: "username", label: "Username" },
                  { id: "email", label: "Email" },
                  { id: "groups", label: "Groups" },
                  { id: "createdTimestamp", label: "Created At" },
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
      </Box>
      {showRemoveConfirmation && (
        <Modal
          visible={showRemoveConfirmation}
          header="Remove Users"
          footer={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={handleCancelRemove}>Cancel</Button>
              <Button variant="primary" onClick={handleRemove}>
                Delete
              </Button>
            </SpaceBetween>
          }
          onDismiss={handleCancelRemove}
        >
          Are you sure you want to Remove {selectedItems.length} users from the role?
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;