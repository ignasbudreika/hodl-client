import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import BrokerService from '../../services/BrokerService';

import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton
} from "@material-ui/core";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset"
    }
  }
});

export const Brokers: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [incId, setIncId] = useState<string>('');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createName, setCreateName] = React.useState<string>('');
  const [createURL, setCreateURL] = React.useState<string>('');
  const [createDescription, setCreateDescription] = React.useState<string>('');
  const [editOpen, setEditOpen] = React.useState(false);
  const [editName, setEditName] = React.useState<string>('');
  const [editURL, setEditURL] = React.useState<string>('');
  const [editDescription, setEditDescription] = React.useState<string>('');
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedBrokerId, setSelectedBrokerId] = React.useState<string>('');
  const classes = useRowStyles();

  const history = useHistory();

  const getData = () => {
    var queryParams = new URLSearchParams(window.location.search)
    var icId = queryParams.get("icId")

    if (icId && icId.length > 0) {
      BrokerService.getBrokersByICId(icId).then((res) => {
        setData(res.data);
        setIncId((icId as string));
      })
    } else {
      BrokerService.getBrokers().then((res) => {
        setData(res.data);
    });
    }
  };

  useEffect(() => {
      console.log(localStorage.getItem("accessToken"))
        if (!localStorage.getItem("accessToken")) {
          console.log("redirectas")
            history.push("/")
            return;
        }

        getData();
  }, []);

  const openBrokerInvestments = (id: string) => { 
    history.push('/investments?brokerId=' + id);
  }

  const handleCreateClickOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
    setCreateName('');
    setCreateURL('');
    setCreateDescription('');
  };

  const handleCreate = () => {
    if (!createName) {
      return;
    }

    BrokerService.createBroker(incId, createName, createURL, createDescription).then((res) => {
      if (res.status === 200 && res.data) {
          getData();
          handleCreateClose();
      }
    });
  }

  const handleEditClickOpen = (id: string) => {
    const brokerToEdit = data.find(broker => {
      return broker.id === id;
    })

    if (!brokerToEdit) {
      return;
    }

    setEditName(brokerToEdit.name);
    setEditURL(brokerToEdit.url);
    setEditDescription(brokerToEdit.description);
    setSelectedBrokerId(id);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditName('');
    setEditURL('');
    setEditDescription('');
    setSelectedBrokerId('');
  };

  const handleEdit = () => {
    if (!editName) {
      return;
    }

    BrokerService.editBroker(selectedBrokerId, editName, editURL, editDescription).then((res) => {
      if (res.status === 200 && res.data) {
          getData();
          handleEditClose();
      }
    });
  }

  const handleDeleteClickOpen = (id: string) => {
    if (!id) {
      return;
    }

    setSelectedBrokerId(id);
    setDeleteOpen(true);
  }

  const handleDeleteClose = () => {
    setSelectedBrokerId('');
    setDeleteOpen(false);
  };

  const handleDelete = () => {
    if (!selectedBrokerId) {
      return;
    }

    BrokerService.deleteBroker(selectedBrokerId).then((res) => {
      if (res.status === 204) {
        getData();
        handleDeleteClose();
      }
    })
  }

  return (
    <Fragment>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>        
        <h4 style={{display: 'inline-block'}}>Your brokerages</h4>
        <IconButton size="medium" style={{display: 'inline-block', verticalAlign: 'center'}} disabled={!incId} onClick={handleCreateClickOpen}>
          <AddBoxIcon />
        </IconButton>
        </div>
       <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
          {data.map((broker) => (
            <>
            <TableRow className={classes.root}>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>
                <IconButton
                    size="small"
                    onClick={() => openBrokerInvestments(broker.id)}
                  >
                    <CurrencyBitcoinIcon />
                  </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                <a href={broker.url} target="_blank" rel="noopener noreferrer"><h6>{broker.name}</h6></a>
                  { broker.description &&
                    <hr/>
                  }
                {broker.description}
              </TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                <IconButton
                    size="small"
                    onClick={() => handleEditClickOpen(broker.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  </div>
              </TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>
                <IconButton
                    size="small"
                    onClick={() => handleDeleteClickOpen(broker.id)}
                    disabled={broker.investments.length != 0}
                  >
                    <DeleteIcon />
                  </IconButton>
              </TableCell>
            </TableRow></>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
      </div>

        {/* create dialog */}
        <Dialog open={createOpen} onClose={handleCreateClose}>
        <DialogTitle>Add a new broker</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Broker's name"
            type="text"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            onChange={nameField => setCreateName(nameField.target.value)}
            required={true}
            />
          <TextField
            margin="dense"
            id="url"
            label="URL"
            type="text"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            onChange={urlField => setCreateURL(urlField.target.value)}
            required={false}
            />
          <TextField
            margin="dense"
            id="description"
            label="Describe it briefly"
            type="text"
            fullWidth
            variant="standard"
            multiline
            maxRows={5}
            rows={4}
            inputProps={{ maxLength: 250 }}
            onChange={descriptionField => setCreateDescription(descriptionField.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Close</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* edit dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit a broker</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Broker's name"
            type="text"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            onChange={nameField => setEditName(nameField.target.value)}
            required={true}
            defaultValue={editName}
            />
          <TextField
            margin="dense"
            id="name"
            label="URL"
            type="text"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            onChange={urlField => setEditURL(urlField.target.value)}
            required={false}
            defaultValue={editURL}
            />
          <TextField
            margin="dense"
            id="description"
            label="Describe it briefly"
            type="text"
            fullWidth
            variant="standard"
            multiline
            maxRows={5}
            rows={4}
            inputProps={{ maxLength: 250 }}
            onChange={descriptionField => setEditDescription(descriptionField.target.value)}
            defaultValue={editDescription}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Close</Button>
          <Button onClick={handleEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* delete dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
      <DialogTitle>Delete a broker</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure about that?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteClose}>No</Button>
        <Button onClick={handleDelete}>Yes</Button>
      </DialogActions>
      </Dialog>
    </Fragment>
  );
}
