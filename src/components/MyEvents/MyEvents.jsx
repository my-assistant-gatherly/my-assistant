import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
      field: 'duration', headerName: 'Duration(in Hours)', width: 140,
      type: 'number',
    },
    {
      field: 'description', headerName: 'Description', width: 300,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 170,
      renderCell: (params) => (
        <ButtonGroup disableElevation variant="contained" aria-label="Event Actions">
          <Button onClick={() => handleEdit(params.row.id)}>Edit</Button>
          <Button onClick={() => handleDelete(params.row.id)}>Delete</Button>
        </ButtonGroup>
      ),
    },
  ];

  const [myEventsData, setMyEventsData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const history = useHistory();
  const userId = useSelector(state => state.user.id);

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
    console.log(`Editing event with id: ${id}`);
    history.push('/edit-events');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      setMyEventsData((prevData) => prevData.filter((event) => event.id !== id));
      console.log(`Deleted event with id: ${id}`);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="container">
      <Paper sx={{ height: 670, width: '85%' }}>
        <>
          <div>
            <h1 >My Events 📆</h1>
          </div>
          <DataGrid
            rows={myEventsData}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
            pageSizeOptions={[5, 10]}
            //checkboxSelection
            sx={{ border: 0 }}
          />
        </>
      </Paper>
    </div>
  );
}