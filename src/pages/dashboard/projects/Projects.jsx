import React, { useEffect, useState } from "react";
import BaseApi from "../../../BaseApi";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BaseApi.get("/projects");
       
       setProjects(response.data);
       console.log("projects fetched successfully")
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

 return {projects,error}
};

export default Projects;