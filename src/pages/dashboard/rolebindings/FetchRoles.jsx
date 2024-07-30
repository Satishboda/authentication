import React, { useEffect, useState } from "react";
import BaseApi from "../../../BaseApi";
const FetchRoles = () => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BaseApi.get("/roles");
        // console.log(response)
       // console.log(response.data);
       setRoles(response.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);
 // console.log("entered");
 return {roles,error}
};

export default FetchRoles;