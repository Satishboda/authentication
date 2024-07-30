// import React, { useEffect, useState } from 'react'

// const Dashboard = () => {
//     const[clustersCount,setClustersCount]=useState(0);
//     const[groupsCount,setGroupsCount]=useState(0);
//     const[usersCount,setUsersCount]=useState(0);
//     const[projectsCount,setProjectsCount]=useState(0);

//     useEffect(()=>{

//     })

//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Dashboard
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseApi from '../BaseApi';
import {
    FaCheckCircle,
    FaUserPlus,
    FaTimesCircle,
    FaHourglass,
  } from "react-icons/fa";
  import { MdGroups } from "react-icons/md";
  import { AiOutlineCluster } from "react-icons/ai";
  import { FiUsers } from "react-icons/fi";
  import { FaDiagramProject } from "react-icons/fa6";
  import './dashboard.css'

const Dashboard = () => {
  const [clustersCount, setClustersCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);

  useEffect(() => {
    // Define a function to fetch data from APIs
    const fetchData = async () => {
      try {
        // Replace these URLs with your actual API endpoints
        
        const clustersResponse = await BaseApi.get('/clusters');
        console.log(clustersResponse)
        const groupsResponse = await BaseApi.get('/groups');
        const usersResponse = await BaseApi.get('/users');
        const projectsResponse = await BaseApi.get('/projects');
        
        
        setClustersCount(clustersResponse.data.length);
        setGroupsCount(groupsResponse.data.length);
        setUsersCount(usersResponse.data.length);
        setProjectsCount(projectsResponse.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

   
    fetchData();
  }, []); 

  return (
    <div >
    <div className="row">
      <div className="col">
        <div className="status-container">
          <div className="status-card alert-success">
            <AiOutlineCluster className="icon" />
            <div className="count">
              <strong>Clusters:</strong> {clustersCount}
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="status-container">
          <div className="status-card alert-primary">
            <MdGroups className="icon" />
            <div className="count">
              <strong>Groups:</strong> {groupsCount}
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="status-container">
          <div className="status-card alert-danger">
            <FiUsers className="icon" />
            <div className="count">
              <strong>Users:</strong> {usersCount}
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="status-container">
          <div className="status-card alert-warning">
            <FaDiagramProject className="icon" />
            <div className="count">
              <strong>Projects:</strong> {projectsCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;

