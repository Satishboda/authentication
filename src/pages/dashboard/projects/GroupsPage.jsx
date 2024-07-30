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
import { Link } from 'react-router-dom';


const GroupsPage = ({projectId,setView}) => {
    const[groups,setGroups]=useState([])
    const[selectedItems,setSelectedItems]=useState([]);
    const [currentPage,setCurrentPage]=useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [searchQuery, setSearchQuery] = useState("");
    const [alertVisible, setAlertVisible] = useState({ visible: false, message: '', type: 'success' });
    const [visibleColumns, setVisibleColumns] = useState([
        { id: "groupname", visible: true },
       
      ]);
    const[loading,setLoading]=useState(true)
    useEffect(() => {
        const Fetch = async () => {
          try {
            const groupsResponse = await BaseApi.get(`/projects/${projectId}/groups`);
            console.log("response is............")
            console.log(groupsResponse)
            
            setGroups(groupsResponse.data);
            setLoading(false)
          } catch (error) {
            console.log(error);
          }
        };
    
        Fetch();
      }, [projectId]);


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

      const renderActions=()=>{

      }
      const filteredGroups= groups.filter(
        (group) =>
         
          (group.name &&
            group.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    
      const paginatedUsers = filteredGroups.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      const handleSearchChange = (event) => {
        setSearchQuery(event.detail.filteringText);
        setCurrentPage(1);
      };
      const goBack=()=>{
        setView("");
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
                    id: "groupname",
                    header: "Group Name",
                    cell: (item) => item.name,
                    sortingField: "groupname",
                    isRowHeader: true,
                    visible: visibleColumns.find((col) => col.id === "groupname")
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
                      <b>No groups found</b>
                    </SpaceBetween>
                  </Box>
                }
               
    
                filter={
                  <TextFilter
                    filteringPlaceholder="search groups Here"
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
                            ? `(${selectedItems.length}/${groups.length})`
                            : `(${groups.length})`
                        }
                      >
                        Groups
                      </Header>
                      {selectedItems.length > 0 && (
                        <span style={{ minWidth: "130px" }}>
                          <Button
                            variant="primary"
                            // onClick={handleDeleteMultipleUsersClick}
                          >
                            Delete
                          </Button>
                        </span>
                      )}
                      <Link to="/projects/list" onClick={goBack}>
                    <span className="back-icon">&#8592;</span> {/* Back icon */}
                  </Link>
                      {/* <span style={{ minWidth: "130px" }}>
                        <Button variant="primary" onClick={handleCreateUserClick}>
                          Create
                        </Button>
                      </span> */}
                    </div>
                    <br />
                  </>
                }
                pagination={
                  <Pagination
                    currentPageIndex={currentPage}
                    pagesCount={Math.ceil(filteredGroups.length / pageSize)}
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
                        { value: 6, label: "6 groups" },
                        { value: 7, label: "7 groups" },
                        { value: 14, label: "14 groups" },
                        { value: 21, label: "21 groups" },
                      ],
                    }}
                    onConfirm={handlePreferencesChange}
                  />
                }
              />
    
             
    
             
              {/* {showSingleDeleteConfirmation && (
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
              )} */}
    
             
    
              
            </div>
          )}
        </>
      );
}

export default GroupsPage
