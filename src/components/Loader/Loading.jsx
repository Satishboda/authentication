import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';

const Loading = () => {
    const[loading,setLoading]=useState(true);
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
  };

  const textStyle = {
    color: 'red',
  };

  return (
    <div style={containerStyle}>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} />
          <span style={{ ...textStyle, marginLeft: 8 }}>Please wait...</span>
        </div>
      ) : (
        <span style={textStyle}>Login</span>
      )}
    </div>
  );
};

export default Loading;
