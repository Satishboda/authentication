import React, { useState, useEffect } from "react";
import {
  Modal,
  SpaceBetween,
  Input,
  Button,
  Box,
  Alert,
} from "@cloudscape-design/components";

import axios from "axios";
import BaseApi from "../../../BaseApi";

const EditUser = ({ user, handleClose, reload, setReload, onUserUpdated }) => {
  const userId = user.id;
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [modalAlert, setModalAlert] = useState({
    visible: false,
    message: "",
    type: "error",
  }); // Default type is 'error'

  const handleInputChange = (name, value) => {
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const checkExistenceOfEmail = async (email) => {
    if (!email) {
      return;
    }

    try {
      const response = await axios.get(
        `http://192.168.1.69:8000/check_user_email/${email}`,
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      );

      if (response.data.exists === "no") {
        return false;
      } else if (response.data.exists === "yes") {
        return true;
      } else {
        console.log("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error checking email availability:", error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
   

    try {
      
      const response = await BaseApi.put(`/users/${userId}`, updatedUser);
      console.log("User updated successfully:", response.data);
      onUserUpdated("User updated successfully!", "success"); // Trigger the alert in UsersList
      setReload((prev) => !prev); // Trigger reload to fetch updated data
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error.response.status);
      if(error.response.status=== 422)
      {
        setModalAlert({
          visible: true,
          message: "Valid Email is Required",
          type: "error",
        });
      }
      else if(error.response.status === 409)
      {
        setModalAlert({
          visible: true,
          message: "Unique Email is Required",
          type: "error",
        });
      }
      
    }
  };

  useEffect(() => {
    // Clear alert after 5 seconds for error alerts
    if (modalAlert.visible && modalAlert.type === "error") {
      const timer = setTimeout(() => {
        setModalAlert({ visible: false, message: "", type: "error" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [modalAlert]);

  const dismissModalAlert = () =>
    setModalAlert({ visible: false, message: "", type: "error" });

  return (
    <>
      {modalAlert.type == "success" && modalAlert.visible && (
        <Alert
          visible={modalAlert.visible}
          type={modalAlert.type} // Use alert type for styling
          dismissible
          onDismiss={dismissModalAlert}
          header={modalAlert.type === "success" ? "Success" : "Error"}
        >
          {modalAlert.message}
        </Alert>
      )}
      <Modal
        onDismiss={() => {
          handleClose();
          dismissModalAlert(); // Clear alert on modal close
        }}
        visible={true}
        closeAriaLabel="Close modal"
        size="medium"
        header="Edit User"
      >
        <SpaceBetween direction="vertical" size="s">
          {modalAlert.type == "error" && modalAlert.visible && (
            <Alert
              visible={modalAlert.visible}
              type={modalAlert.type} // Use alert type for styling
              dismissible
              onDismiss={dismissModalAlert}
              header={modalAlert.type === "success" ? "Success" : "Error"}
            >
              {modalAlert.message}
            </Alert>
          )}
          <Input
            value={updatedUser.email}
            onChange={({ detail }) => handleInputChange("email", detail.value)}
            placeholder="Email"
          />
          <Input
            value={updatedUser.firstName}
            onChange={({ detail }) =>
              handleInputChange("firstName", detail.value)
            }
            placeholder="Firstname"
          />
          <Input
            value={updatedUser.lastName}
            onChange={({ detail }) =>
              handleInputChange("lastName", detail.value)
            }
            placeholder="Lastname"
          />
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" disabled={updatedUser.email===""}onClick={handleSubmit}>
                Save
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Modal>
    </>
  );
};

export default EditUser;



