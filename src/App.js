import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [medications, setMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    location: '',
    expiryDate: '',
    notes: ''
  });

  useEffect(() => {
    const storedMedications = JSON.parse(localStorage.getItem('medications')) || [];
    setMedications(storedMedications);
  }, []);

  const handleOpen = (medication = null) => {
    if (medication) {
      setFormData(medication);
      setEditingId(medication.id);
    } else {
      setFormData({
        name: '',
        quantity: '',
        location: '',
        expiryDate: '',
        notes: ''
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMedication = {
      ...formData,
      id: editingId || Date.now()
    };

    let updatedMedications;
    if (editingId) {
      updatedMedications = medications.map(med => 
        med.id === editingId ? newMedication : med
      );
    } else {
      updatedMedications = [...medications, newMedication];
    }

    setMedications(updatedMedications);
    localStorage.setItem('medications', JSON.stringify(updatedMedications));
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      const updatedMedications = medications.filter(med => med.id !== id);
      setMedications(updatedMedications);
      localStorage.setItem('medications', JSON.stringify(updatedMedications));
    }
  };

  const filteredMedications = medications.filter(med => {
    const searchLower = searchTerm.toLowerCase();
    return (
      med.name.toLowerCase().includes(searchLower) ||
      med.location.toLowerCase().includes(searchLower) ||
      (med.expiryDate && new Date(med.expiryDate).toLocaleDateString().toLowerCase().includes(searchLower))
    );
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
        Medication Tracker
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search medications by name, location, or expiry date..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Add New Medication
      </Button>

      <List>
        {filteredMedications.map((medication) => (
          <ListItem
            key={medication.id}
            divider
            sx={{
              bgcolor: 'background.paper',
              mb: 1,
              borderRadius: 1,
              boxShadow: 1
            }}
          >
            <ListItemText
              primary={medication.name}
              secondary={
                <>
                  Quantity: {medication.quantity} pieces<br />
                  Location: {medication.location}
                  {medication.expiryDate && (
                    <><br />Expires: {new Date(medication.expiryDate).toLocaleDateString()}</>
                  )}
                  {medication.notes && (
                    <><br />Notes: {medication.notes}</>
                  )}
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleOpen(medication)} sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(medication.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Medication' : 'Add New Medication'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Medication Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              margin="normal"
              inputProps={{ min: 1 }}
            />
            <FormControl component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend">Location</FormLabel>
              <RadioGroup
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                {[1, 2, 3, 4].map((num) => (
                  <FormControlLabel
                    key={num}
                    value={`Box ${num}`}
                    control={<Radio />}
                    label={`Box ${num}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default App; 