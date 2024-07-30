import React, { useState, useEffect } from 'react';
import BaseApi from '../../../BaseApi';
import Multiselect from "@cloudscape-design/components/multiselect";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [groups,setGroups]=useState([])
  const [error, setError] = useState(null);
  const[selectedOptions,setSelectedOptions]=useState([])

  const usersList =users.length===0 ?  [{ label: "No users ", value: "No users" ,disabled: true}]:
  users.map((user) => ({
    label: user.username,
    value: user.id,
    
  }));
  const groupsList =groups.length===0 ?  [{ label: "No groups available ", value: "No groups available" ,disabled: true}]:
  groups.map((group) => ({
    label: group.name,
    value: group.id,
    
  }));
  const handleMultiSelect=({detail})=>{
    
    setSelectedOptions(detail.selectedOptions);
   
   
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, groupsResponse] = await Promise.all([
          BaseApi.get('/users'),
          BaseApi.get('/groups')
        ]);
        console.log('Users:', usersResponse.data);
        console.log('Groups:', groupsResponse.data);
        setUsers(usersResponse.data);
        setGroups(groupsResponse.data);
      } catch (err) {
        setError('Failed to fetch users or groups');
        console.error(err);
      }
    };

    fetchData();
  }, []);
  return (
    // <div>
    //   {error && <p>{error}</p>}
    //   <ul>
    //     {users.map((user) => (
    //       <li key={user.id}>{user.username}</li>
    //     ))}
    //   </ul>
    // </div>
    <>
        <Multiselect
      selectedOptions={selectedOptions}
     
      onChange={handleMultiSelect}
    
      options={usersList}
      placeholder="select users"
      hideTokens
    />
    <Multiselect
      selectedOptions={selectedOptions}
     
      onChange={handleMultiSelect}
    
      options={groupsList}
      placeholder="select clusters"
      hideTokens
    />
    </>
  );
};

export default Users;

