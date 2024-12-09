import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

export default function MyEvents() {
  const columns = [
    { field: 'event_title', headerName: 'Event Title', width: 200 },
    { field: 'start_date', headerName: 'Start Date', width: 110 },
    { field: 'start_time', headerName: 'Start Time', width: 110 },
    {
      field: 'duration',
      headerName: 'Duration (in Hours)',
      width: 140,
      type: 'number',
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 170,
      renderCell: (params) => (
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Event Actions"
          sx={{
            '& .MuiButton-root': {
              backgroundColor: '#B666D2', // Purple theme
              color: 'white',
              '&:hover': {
                backgroundColor: '#9B4AB3', // Darker purple on hover
              },
            },
          }}
        >
          <Button onClick={() => handleEdit(params.row.id)}>Edit</Button>
          <Button
            onClick={() => handleDelete(params.row.id)}
            sx={{
              backgroundColor: '#FF6B6B', // Red for delete
              '&:hover': {
                backgroundColor: '#C93030', // Darker red on hover
              },
            }}
          >
            Delete
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  const [myEventsData, setMyEventsData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const history = useHistory();
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/api/events/${userId}`);
        setMyEventsData(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [userId]);

  const handleEdit = (id) => {
    history.push('/edit-events');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      setMyEventsData((prevData) => prevData.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="container">
      <Paper
        sx={{
          height: 670,
          width: '85%',
          padding: '20px',
          backgroundColor: '#F5E9FA', // Light purple background
          boxShadow: '0px 4px 8px rgba(137, 23, 172, 0.3)', // Subtle purple shadow
          borderRadius: '10px',
        }}
      >
        <>
          <div>
            <h1 style={{ color: '#B666D2', textAlign: 'center', marginBottom: '20px' }}>
              My Events 📆
            </h1>
          </div>
          <DataGrid
            rows={myEventsData}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
            pageSizeOptions={[5, 10]}
            sx={{
              '& .MuiDataGrid-root': {
                backgroundColor: 'white',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#B666D2', // Purple header
                color: 'white',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: '#F5E9FA', // Light purple hover effect
                },
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #B666D2', // Purple border between rows
              },
              border: 'none',
            }}
          />
        </>
      </Paper>
    </div>
  );
}
