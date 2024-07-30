// import React, { useState } from "react";
// // import "bootstrap/dist/css/bootstrap.min.css";
// import { useNavigate, Link } from "react-router-dom";
// import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import { ToastContainer, toast, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BaseApi from "../../BaseApi";
// // import image1 from "../../assets/css/authentication/final_logo.jpeg";
// // import "../../assets/css/authentication/signin.css";
// // import api from "../env/BaseApi";
// import axios from 'axios'

// const SignIn = () => {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(`${BaseApi.defaults.baseURL}/login_user`, {
//         username: name,
//         password: password,
//       });

//       console.log(response);
//       localStorage.setItem("access_token", response.data.access_token);
//       localStorage.setItem("expiration_time", response.data.expiration_time);
//       localStorage.setItem("refresh_token", response.data.refresh_token);

//       if (
//         localStorage.getItem("access_token") !== undefined &&
//         localStorage.getItem("access_token") !== null
//       ) {
       
//         toast.success("login successful", {
//           position: "top-center",
//           transition: Slide,
//         });
//         setTimeout(() => {
//           navigate("/");
//           // window.location.reload();
//         }, 500);
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error(err.response.data.detail, {
//         position: "top-center",
//         transition: Slide,
//       });
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const isFormValid = name.trim() !== "" && password.trim() !== "";

//   return (
//     <div
//       className="d-flex align-items-center mt-3 ml-5"
//     //   style={{
//     //     backgroundImage: `url(${image1})`,
//     //     backgroundSize: "cover",
//     //     backgroundPosition: "center",
//     //     minHeight: "100vh",
//     //   }}
//     >
//       <div className="gap card p-5" style={{ width: "25rem" }}>
//         <h2 className="card-title mb-4">Login</h2>
//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <label htmlFor="username" className="form-label">
//               Username
//             </label>
//             <div className="input-group">
//               <span className="input-group-text">
//                 <FaUser />
//               </span>
//               <input
//                 type="text"
//                 id="username"
//                 className="form-control"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <div className="input-group">
//               <span className="input-group-text">
//                 <FaLock />
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 className="form-control"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 className="btn btn-outline-secondary"
//                 type="button"
//                 onClick={togglePasswordVisibility}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>
//           <button
//             className="btn btn-primary w-100 mb-3"
//             disabled={!isFormValid}
//             type="submit"
//           >
//             Login
//           </button>
//         </form>
//         {/* <p>
//           <Link to="/reset-password">Forgot password?</Link>
//         </p> */}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default SignIn;

//chat gpt code 

//best code

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import { ToastContainer, toast, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BaseApi from "../../BaseApi";
// import axios from "axios";
// import './login.css'  // Import the CSS file
// import jboss_logo from '../../assets/images/final_logo.jpeg';

// const SignIn = () => {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     console.log("name is ",name);
//     console.log("password is",password)
//     try {
//       const response = await axios.post(`${BaseApi.defaults.baseURL}/login_user`, {
//         username: name,
//         password: password,
//       });

//       console.log(response);
//       localStorage.setItem("access_token", response.data.access_token);
//       localStorage.setItem("expiration_time", response.data.expiration_time);
//       localStorage.setItem("refresh_token", response.data.refresh_token);

//       if (localStorage.getItem("access_token")) {
//         setName("");setPassword("");
//         toast.success("Login successful", {
//           position: "top-center",
//           transition: Slide,
//         });
//         setTimeout(() => {
//           navigate("/");
//         }, 500);
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error(err.response.data.detail, {
//         position: "top-center",
//         transition: Slide,
//       });
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const isFormValid = name.trim() !== "" && password.trim() !== "";

//   return (
//     <div className="bg-image"
//     style={{
//       backgroundImage: `url(${jboss_logo})`,
//        backgroundSize: "cover",
//       backgroundPosition: "center",
//       // minHeight: "100vh",
//       // height:"100%"


//     }}
//     >
//     <div className="container">
//       <div className="card">
//         <h2 className="title">Login</h2>
//         <form className="form" onSubmit={handleLogin}>
//           <div className="form-group">
//             <label className="label" htmlFor="username">Username</label>
//             <div className="input-group">
//               <span className="input-icon">
//                 <FaUser />
//               </span>
//               <input
//                 type="text"
//                 id="username"
//                 className="input"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="form-group">
//             <label className="label" htmlFor="password">Password</label>
//             <div className="input-group">
//               <span className="input-icon">
//                 <FaLock />
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 className="input"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 className="password-toggle"
//                 type="button"
//                 onClick={togglePasswordVisibility}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>
//           <button
//             className="button"
//             disabled={!isFormValid}
//             type="submit"
//           >
//             Login
//           </button>
//         </form>
//         <ToastContainer />
//       </div>
//     </div>
//     </div>
//   );
// };

// export default SignIn;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseApi from "../../BaseApi";
import axios from "axios";
import './login.css'; 
import jboss_logo from '../../assets/images/final_logo.jpeg';

const SignIn = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading to true when login starts
    console.log("name is ", name);
    console.log("password is", password);
    try {
      const response = await axios.post(`${BaseApi.defaults.baseURL}/login_user`, {
        username: name,
        password: password,
      });

      console.log(response);
      const expiresIn = response.data.expires_in;
      localStorage.setItem("access_token", response.data.access_token);
      // localStorage.setItem("expiration_time", response.data.expiration_time);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem('expires_in', expiresIn);
      localStorage.setItem("role",response.data.role)

      if (localStorage.getItem("access_token")) {
        setName("");
        setPassword("");
        toast.success("Login successful", {
          position: "top-center",
          transition: Slide,
        });
        setTimeout(() => {
          navigate("/");
        }, 500);
        setTimeout(refreshToken, (expiresIn - 60) * 1000);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.detail, {
        position: "top-center",
        transition: Slide,
      });
    } finally {
      setIsLoading(false); // Set loading to false when login finishes
    }
  };

  const refreshToken = async () => {
    try {
      console.log("inside refresh token");
      const refresh_token = localStorage.getItem('refresh_token');
      const response = await axios.post(`${BaseApi.defaults.baseURL}/refresh_token`,null, 
        {
          params:{
            refresh_token: refresh_token,

          }
       
      });

      console.log("after refresh response is",response);

      const expiresIn = response.data.expires_in; // in seconds
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('expires_in', expiresIn);
      localStorage.setItem("name","adithya");

      // Set a timer to refresh the token again before it expires
      setTimeout(refreshToken, (expiresIn - 60) * 1000); // refresh 1 minute before expiration
    } catch (err) {
      console.log(err);
      // handle error, possibly log out the user
      console.log("error in refreshing the token");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = name.trim() !== "" && password.trim() !== "";

  return (
    <div className="bg-image"
      style={{
        backgroundImage: `url(${jboss_logo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-form">
        <div className="card">
          <h2 className="title">Login</h2>
          <form className="form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="label" htmlFor="username">Username</label>
              <div className="input-group">
                <span className="input-icon">
                  <FaUser />
                </span>
                <input
                  type="text"
                  id="username"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="label" htmlFor="password">Password</label>
              <div className="input-group">
                <span className="input-icon">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              className="button"
              disabled={!isFormValid || isLoading} // Disable button when form is invalid or loading
              type="submit"
            >
              {isLoading ? "Please wait..." : "Login"} {/* Show loading text when loading */}
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default SignIn;

