import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';


const columns = [
  { field: 'event_title', headerName: 'Event Title',  width: 300 },
  { field: 'start_date',  headerName: 'Start Date',   width: 110 },
  { field: 'start_time',  headerName: 'Start Time',   width: 110 },
  { field: 'duration',    headerName: 'Duration(in Hours)',  width: 140,
    type: 'number',  },
  { field: 'description', headerName: 'Description',  width: 400,
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    valueGetter: (value, row) => `${row.description || ''}`,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 170,
    renderCell: (params) => (
      <ButtonGroup disableElevation variant="contained" aria-label="Event Actions">
        <Button>Edit</Button>
        <Button>Delete</Button>
      </ButtonGroup>
    ),
  }, 
];

//Dummy Data for now
const rows = [
  { id: 1, event_title: 'KF Group Meet', start_date: '11/29/2024', start_time: '5:00 PM', duration: 2, description: 'Discuss project updates and concerns' },
  { id: 2, event_title: 'KF Group Meet', start_date: '11/30/2024', start_time: '5:00 PM', duration: 2, description: 'Discuss project updates and concerns' },
  { id: 3, event_title: 'KF Group Meet', start_date: '12/01/2024', start_time: '5:00 PM', duration: 2, description: 'Discuss project updates and concerns' },
  { id: 4, event_title: 'KF Group Meet', start_date: '12/03/2024', start_time: '5:30 PM', duration: 4, description: 'Practice Presentation' },
  { id: 5, event_title: 'KF Group Meet', start_date: '12/04/2024', start_time: '5:30 PM', duration: 4, description: 'Practice Presentation and Professional Development' },
  { id: 6, event_title: 'KF Group Meet', start_date: '12/10/2024', start_time: '12:00 PM', duration: 1, description: 'Project Presentation' },
  { id: 7, event_title: 'KF Group Meet', start_date: '12/10/2024', start_time: '5:30 PM', duration: 1, description: 'Project Handoff' },
  { id: 8, event_title: 'KF Group Meet', start_date: '12/11/2024', start_time: '5:30 PM', duration: 1, description: 'Graduation' },
];

const paginationModel = { pduration: 0, pdurationSize: 5 };

export default function MyEvents() {
  return (
    <div className="container">
    <Paper sx={{ height: 600, width: '85%' }}>
      <>
      <div>
        <h1 >My Events 📆</h1>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pdurationSizeOptions={[5, 10]}
        //checkboxSelection
        sx={{ border: 0 }}
      />
      </>
    </Paper>
    </div>
  );
}