import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function App() {
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });
  const [open, setOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  const handleOpen = (medication = null) => {
    if (medication) {
      setEditingMedication(medication);
      setFormData(medication);
    } else {
      setEditingMedication(null);
      setFormData({ name: '', quantity: '', location: '', notes: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMedication(null);
    setFormData({ name: '', quantity: '', location: '', notes: '' });
  };

  const handleSubmit = () => {
    if (editingMedication) {
      setMedications(medications.map(med => 
        med.id === editingMedication.id ? { ...formData, id: med.id } : med
      ));
    } else {
      setMedications([...medications, { ...formData, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Medication Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Your Medications
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Medication
          </Button>
        </Box>

        <Paper elevation={3}>
          <List>
            {medications.map((medication) => (
              <ListItem key={medication.id} divider>
                <ListItemText
                  primary={medication.name}
                  secondary={
                    <>
                      Quantity: {medication.quantity}
                      <br />
                      Location: {medication.location}
                      {medication.notes && (
                        <>
                          <br />
                          Notes: {medication.notes}
                        </>
                      )}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleOpen(medication)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(medication.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingMedication ? 'Edit Medication' : 'Add New Medication'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Medication Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Quantity"
              fullWidth
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Notes"
              fullWidth
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingMedication ? 'Save Changes' : 'Add Medication'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default App; 