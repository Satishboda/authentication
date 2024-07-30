
import React, { useState, useEffect } from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Header from "@cloudscape-design/components/header";
import TextFilter from "@cloudscape-design/components/text-filter";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import BaseApi from "../../../BaseApi";
import {
  Alert,
  Button,
  Link,
  Modal,
  SpaceBetween,
} from "@cloudscape-design/components";
import axios from "axios";
import Loader from "../../../components/Loader/Loader";


const GroupsPage = ({ role }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteringText, setFilteringText] = useState(""); // State for filtering text
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [alertVisible, setAlertVisible] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await BaseApi.get(`/${role.name}/groups`);
        if (response.data && Array.isArray(response.data.role_groups)) {
          setGroups(response.data.role_groups);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        setError("Error fetching groups");
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [role.name, temp]);

  const handleSelectionChange = ({ detail }) => {
    console.log(detail.selectedItems);
    setSelectedItems(detail.selectedItems);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filter groups based on the filtering text
  const filteredGroups = groups.filter((group) =>
    group.toLowerCase().includes(filteringText.toLowerCase())
  );

  const handleShowRemoveConfirmation = () => {
    setShowRemoveConfirmation(true);
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirmation(false);
  };

  const handleRemove = async () => {
    try {
      const response = await axios.delete(
        `http://192.168.1.192:8000/unassign_group/role/${role.id}`,
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
          data: selectedItems,
        }
      );
      setAlertVisible({
        visible: true,
        message: "Dissociation from role is successfull.",
        type: "success",
      });
      setShowRemoveConfirmation(false);
      // Hide alert after 1300 milliseconds
      setTemp(temp + 1);
      setTimeout(() => {
        setAlertVisible({ visible: false, message: "", type: "success" });
      }, 1300);
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
    }
    console.log(selectedItems);
  };
  return (
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
      <Box>
        <Header className="centered-header" variant="h1"></Header>
        <Table
          selectedItems={selectedItems}
          onSelectionChange={handleSelectionChange}
          columnDefinitions={[
            {
              id: "groupName",
              header: "Group Name",
              cell: (group) => <Link href="#">{group}</Link>,
              sortingField: "groupName",
            },
          ]}
          items={filteredGroups} // Use filtered groups
          loadingText="Loading groups"
          selectionType="multi"
          trackBy={(item) => item}
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No groups found</b>
              </SpaceBetween>
            </Box>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Find groups"
              filteringText={filteringText}
              onChange={({ detail }) => setFilteringText(detail.filteringText)} // Update filtering text state
            />
          }
          header={
            <Header
              counter={`(${selectedItems.length}/${filteredGroups.length})`} // Use filtered groups length
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
                    <span className="back-icon">&#8592;</span> {/* Back icon */}
                  </Link>
                </>
              }
            >
              <span>{role.name}</span>: Groups
            </Header>
          }
          pagination={
            <Pagination
              currentPageIndex={1}
              pagesCount={Math.ceil(filteredGroups.length / 10)}
            />
          } // Use filtered groups length
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={{
                pageSize: 10,
                contentDisplay: [{ id: "groupName", visible: true }],
              }}
              pageSizePreference={{
                title: "Page size",
                options: [
                  { value: 10, label: "10 groups" },
                  { value: 20, label: "20 groups" },
                ],
              }}
              wrapLinesPreference={{}}
              stripedRowsPreference={{}}
              contentDensityPreference={{}}
              contentDisplayPreference={{
                options: [{ id: "groupName", label: "Group Name" }],
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
          header="Remove Groups"
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
          Are you sure you want to remove {selectedItems.length} groups from the
          role?
        </Modal>
      )}
    </div>
  );
};

export default GroupsPage;