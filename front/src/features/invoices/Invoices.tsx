import React, { useEffect, useState } from 'react'
import axiosInstance from '../../services/axios'
import { Button, Input } from '@mui/material'

function Invoices() {

  useEffect(() => {
    const encodedCriteria = encodeURIComponent(JSON.stringify([]))
    axiosInstance.get('/api/invoice')
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  , [])

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axiosInstance.post('/api/invoice/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload File
      </Button>
    </div>
  );
}

export default Invoices