import React, { useEffect, useState } from "react";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Alert from "@cloudscape-design/components/alert";

import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import BaseApi from "../../../BaseApi";

// import Tooltip from "@cloudscape-design/components/tooltip";
 
const UserCreationForm = ({
  showCreateUserModal,
  setShowCreateUserModal,
  reload,
  setReload,
  onUserCreated,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
 
  const [errors, setErrors] = useState({
    username: true,
    password: true,
    confirmPassword: true,
    email: true,
  });
 
  // const [alertVisible, setAlertVisible] = useState(false);
  // const [alertMessage, setAlertMessage] = useState("");
  // const [alertType, setAlertType] = useState("error");
 
  const [modalAlert, setModalAlert] = useState({
    visible: false,
    message: "",
    type: "error",
  });
 
  const [passwordMatchMessage, setPasswordMatchMessage] = useState({
    message: "",
    color: "",
    icon: null,
  });
  const [passwordLengthMessage, setPasswordLengthMessage] = useState({
    message: "must be 8",
    color: "red",
    icon: null,
  });
  const [usernameAvailabilityMessage, setUsernameAvailabilityMessage] =
    useState({ message: "", color: "", icon: null });
  const [emailAvailabilityMessage, setEmailAvailabilityMessage] = useState({
    message: "",
    color: "",
    icon: null,
  });
 
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
 
  useEffect(() => {
    const validateFields = async () => {
      const usernameError = validateUsername(formData.username);
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      );
 
      const emailError = validateEmail(formData.email);
      let emailExists = false;
 
      if (!emailError) {
        emailExists = await checkExistenceOfEmail(formData.email);
      }
      let usernameExists = false;
 
      if (!usernameError) {
        usernameExists = await checkExistenceOfUsername(formData.username);
      }
      console.log("username exists:", usernameExists);
 
      const isFormValid =
        !usernameError &&
        !passwordError &&
        !confirmPasswordError &&
        !emailError &&
        !usernameExists &&
        !emailExists && // Check if email exists
        formData.username !== "" &&
        formData.email !== "" &&
        formData.password !== "" &&
        formData.confirmPassword !== "";
 
      setIsFormValid(isFormValid);
    };
 
    validateFields();
  }, [formData]);
  console.log("validity:", isFormValid);
 
  const handleChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    if (fieldName === "username") {
      checkExistenceOfUsername(value);
    } else if (fieldName === "email") {
      const emailError = validateEmail(value);
      // console.log(emailError+' here')
      if (!emailError) {
        checkExistenceOfEmail(value);
      } else {
        setEmailAvailabilityMessage({
          message: "Invalid Email Address",
          color: "red",
          icon: <CancelIcon style={{ color: "red", fontSize: "1rem" }} />,
        });
        // setErrors((prevErrors) => ({ ...prevErrors, email: emailError }));
      }
    }
    // Update password match message for both fields
    else if (fieldName === "password" || fieldName === "confirmPassword") {
      const password = fieldName === "password" ? value : formData.password;
      const confirmPassword =
        fieldName === "confirmPassword" ? value : formData.confirmPassword;
      updatePasswordMatchMessage(password, confirmPassword);
    }
  };
  const checkExistenceOfEmail = async (email) => {
    if (!email) {
      setEmailAvailabilityMessage({ message: "", color: "", icon: null });
      return;
    }
 
    try {
      const response = await BaseApi.get(
        `/check_user_email/${email}`,
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      );
 
      if (response.data.exists === "no") {
        setEmailAvailabilityMessage({
          message: "Email is available",
          color: "green",
          icon: (
            <CheckCircleIcon style={{ color: "green", fontSize: "1rem" }} />
          ),
        });
        return false;
      } else if (response.data.exists === "yes") {
        setEmailAvailabilityMessage({
          message: "Email already exists.",
          color: "red",
          icon: <CancelIcon style={{ color: "red", fontSize: "1rem" }} />,
        });
        return true;
      } else {
        console.log("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error checking email availability:", error);
    }
  };
 
  const checkExistenceOfUsername = async (username) => {
    if (!username) {
      setUsernameAvailabilityMessage({ message: "", color: "", icon: null });
      return;
    }
 
    try {
      const response = await BaseApi.get(
        `/check_user/${username}`,
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      );
 
      if (response.data.exists === "no") {
        setUsernameAvailabilityMessage({
          message: "Username is available",
          color: "green",
          icon: (
            <CheckCircleIcon style={{ color: "green", fontSize: "1rem" }} />
          ),
        });
        return false;
      } else if (response.data.exists === "yes") {
        setUsernameAvailabilityMessage({
          message: "Username already exists.",
          color: "red",
          icon: <CancelIcon style={{ color: "red", fontSize: "1rem" }} />,
        });
        return true;
      } else {
        console.log("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
    }
  };
 
  const updatePasswordMatchMessage = (password, confirmPassword) => {
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    );
    if (!confirmPasswordError) {
      setPasswordMatchMessage({
        message: "Passwords match!",
        color: "green",
        icon: <CheckCircleIcon style={{ color: "green", fontSize: "1rem" }} />,
      });
    } else {
      setPasswordMatchMessage({
        message: "Passwords do not match.",
        color: "red",
        icon: <CancelIcon style={{ color: "red", fontSize: "1rem" }} />,
      });
    }
  };
 
  const validateUsername = (username) => {
    if (username.length < 3 || username.length > 255) {
      return "Username must be between 3 and 255 characters";
    }
    return "";
  };
 
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,}$/;
 
    if (!passwordRegex.test(password)) {
      console.log("I am here");
      return "Password must be at least 8 characters long and include at least one letter and one numeric character";
    }
    return "";
  };
 
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(email);
    if (!emailRegex.test(email)) {
      // console.log("email here");
      return "Email is not valid";
    }
    return "";
  };
 
  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };
 
  const handleSubmit = (event) => {
    event.preventDefault();
 
    const usernameError = validateUsername(formData.username);
    console.log("Username error:", usernameError);
    const passwordError = validatePassword(formData.password);
    console.log("password error:", passwordError);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    console.log("confirm error:", confirmPasswordError);
    const emailError = validateEmail(formData.email);
    console.log("email error:", emailError);
    // console.log(errors);
 
    // Check for password mismatch after validating other fields
    if (formData.password !== formData.confirmPassword) {
      setModalAlert({
        visible: true,
        message: "Passwords do not match.",
        type: "error",
      });
      setTimeout(() => {
        setModalAlert({ visible: false, message: "", type: "error" });
      }, 5000);
      return;
    }
    if (
      !usernameError &&
      !passwordError &&
      !confirmPasswordError &&
      !emailError
    ) {
      setShowSubmit(!showSubmit);
    }
 
    if (usernameError || passwordError || confirmPasswordError || emailError) {
      setErrors({
        username: usernameError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        email: emailError,
      });
      return;
    }   console.log("Inside", formData)
 
    BaseApi.post("/user", formData, {
       
    })
      .then((response) => {
     
        // setAlertMessage("User created successfully");
        // setAlertType("success");
        // setAlertVisible(true);
        // navigate("/users");
        // setTimeout(() => {
        //   setAlertVisible(false);
        //   setReload(!reload);
        //   setShowCreateUserModal(!showCreateUserModal);
        // }, 1300);
 
        // setModalAlert({
        //   visible: true,
        //   message: "User created successfully.",
        //   type: "success",
        // });
        setFormData({
          username: "",
          firstName: "",
          lastName: "",
          password: "",
          confirmPassword: "",
          email: "",
        });
        setShowCreateUserModal(!showCreateUserModal);
        onUserCreated("User Created successfully!", "success");
        setReload(!reload);
        // setTimeout(() => {
        //   setModalAlert({ visible: false, message: "", type: "success" });
        //   setShowCreateUserModal(false);
        // }, 5000);
      })
      .catch((error) => {
        // let message = "There was an error creating the user";
        // if (error.response && error.response.status === 409) {
        //   message = "User already exists with Username or Email";
        // }
        setModalAlert({
          visible: true,
          message: "Failed to create user. Please try again.",
          type: "error",
        });
        setTimeout(() => {
          setModalAlert({ visible: false, message: "", type: "error" });
        }, 5000);
      });
  };
 
  // const handleAlertDismiss = () => {
  //   setAlertVisible(false);
  // };
 
  console.log("submit:", showSubmit);
  return (
    <form onSubmit={handleSubmit}>
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!isFormValid}>
              Submit
            </Button>
          </SpaceBetween>
        }
      >
        <Container
          header={
            <>
              {modalAlert.visible && (
                <Alert
                  visible={modalAlert.visible}
                  type={modalAlert.type}
                  onDismiss={() =>
                    setModalAlert({ ...modalAlert, visible: false })
                  }
                >
                  {modalAlert.message}
                </Alert>
              )}
 
              <Header variant="h2">User Creation</Header>
            </>
          }
        >
          <SpaceBetween direction="vertical" size="l">
            <FormField
              label="First Name"
              error={errors.firstName}
              helperText={errors.firstName}
            >
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(event) =>
                  handleChange("firstName", event.detail.value)
                }
              />
            </FormField>
            <FormField
              label="Last Name"
              error={errors.lastName}
              helperText={errors.lastName}
            >
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(event) =>
                  handleChange("lastName", event.detail.value)
                }
              />
            </FormField>
            <FormField
              label="Username *"
              error={errors.username}
              helperText={errors.username}
            >
              <Input
                id="username"
                value={formData.username}
                onChange={(event) =>
                  handleChange("username", event.detail.value)
                }
              />
              {usernameAvailabilityMessage.message &&
                formData.username !== "" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "4px",
                      color: usernameAvailabilityMessage.color,
                    }}
                  >
                    {usernameAvailabilityMessage.icon}
                    <span style={{ marginLeft: "4px", fontSize: "0.9rem" }}>
                      {usernameAvailabilityMessage.message}
                    </span>
                  </div>
                )}
            </FormField>
            <FormField
              label="Email *"
              error={errors.email}
              helperText={errors.email}
            >
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) => handleChange("email", event.detail.value)}
              />
              {emailAvailabilityMessage.message && formData.email !== "" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "4px",
                    color: emailAvailabilityMessage.color,
                  }}
                >
                  {emailAvailabilityMessage.icon}
                  <span style={{ marginLeft: "4px", fontSize: "0.9rem" }}>
                    {emailAvailabilityMessage.message}
                  </span>
                </div>
              )}
            </FormField>
            <FormField
              label="Password *"
              error={errors.password}
              helperText={
                (formData.password.length < 8 &&
                  "Password must be at least 8 characters long. ") +
                (!/\d/.test(formData.password) &&
                  "Password must include at least one digit (0-9). ")
              }
            >
              <Input
                id="password"
                type="password"
                value={formData.password}
                onFocus={() => setShowPasswordTooltip(true)}
                onBlur={() => setShowPasswordTooltip(false)}
                onChange={(event) =>
                  handleChange("password", event.detail.value)
                }
              />
              {formData.password && (formData.password.length < 8 ||
                !/\d/.test(formData.password)) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "4px",
                    color: "red",
                  }}
                >
                  <CancelIcon style={{ color: "red", fontSize: "1rem" }} />
                  <span style={{ marginLeft: "4px", fontSize: "0.9rem" }}>
                    Password must be 8+ characters include a digit.
                  </span>
                </div>
              )}
              {/* {(formData.password.length < 8 ||
                !/\d/.test(formData.password)) &&
                showPasswordTooltip && (
                  <div
                    style={{
                      position: "absolute",
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "5px",
                      marginTop: "4px",
                      zIndex: 1,
                    }}
                  >
                    Password must be at least 8 characters long and include at
                    least one digit.
                  </div>
                )} */}
            </FormField>
            <FormField
              label="Confirm Password"
              error={errors.confirmPassword}
              helperText={errors.confirmPassword}
            >
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(event) =>
                  handleChange("confirmPassword", event.detail.value)
                }
              />
              {formData.confirmPassword !== "" &&
                passwordMatchMessage.message && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "4px",
                      color: passwordMatchMessage.color,
                    }}
                  >
                    {passwordMatchMessage.icon}
                    <span style={{ marginLeft: "4px", fontSize: "0.9rem" }}>
                      {passwordMatchMessage.message}
                    </span>
                  </div>
                )}
            </FormField>
          </SpaceBetween>
        </Container>
      </Form>
    </form>
  );
};
 
export default UserCreationForm;