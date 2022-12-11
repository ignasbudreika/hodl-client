import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import InvestmentCategoryService from '../../services/InvestmentCategoryService';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import ListIcon from '@mui/icons-material/List';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

export const InvestmentCategories: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createName, setCreateName] = React.useState<string>('');
  const [createDescription, setCreateDescription] = React.useState<string>('');
  const [editOpen, setEditOpen] = React.useState(false);
  const [editName, setEditName] = React.useState<string>('');
  const [editDescription, setEditDescription] = React.useState<string>('');
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [publishOpen, setPublishOpen] = React.useState(false);
  const [selectedIcId, setSelectedIcId] = React.useState<string>('');
  const classes = useRowStyles();

  const history = useHistory();

  const getData = () => {
    InvestmentCategoryService.getInvestmentCategories().then((res) => {
        setData(res.data);
    });
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

  const openICBrokers = (id: string) => { 
    history.push('/brokers?icId=' + id);
  }

  const openICInvestments = (id: string) => { 
    history.push('/investments?icId=' + id);
  }

  const handleCreateClickOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
    setCreateName('');
    setCreateDescription('');
  };

  const handleCreate = () => {
    if (!createName) {
      return;
    }

    InvestmentCategoryService.createInvestmentCategory(createName, createDescription).then((res) => {
      if (res.status === 200 && res.data) {
          getData();
          handleCreateClose();
      }
    });
  }

  const handleEditClickOpen = (id: string) => {
    const icToEdit = data.find(ic => {
      return ic.id === id;
    })

    if (!icToEdit) {
      return;
    }

    setEditName(icToEdit.name);
    setEditDescription(icToEdit.description);
    setSelectedIcId(id);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditName('');
    setEditDescription('');
    setSelectedIcId('');
  };

  const handleEdit = () => {
    if (!editName) {
      return;
    }

    InvestmentCategoryService.editInvestmentCategory(selectedIcId, editName, editDescription).then((res) => {
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

    setSelectedIcId(id);
    setDeleteOpen(true);
  }

  const handleDeleteClose = () => {
    setSelectedIcId('');
    setDeleteOpen(false);
  };

  const handleDelete = () => {
    if (!selectedIcId) {
      return;
    }

    InvestmentCategoryService.deleteInvestmentCategory(selectedIcId).then((res) => {
      if (res.status === 204) {
        getData();
        handleDeleteClose();
      }
    })
  }

  const handlePublishClickOpen = (id: string) => {
    if (!id) {
      return;
    }

    setSelectedIcId(id);
    setPublishOpen(true);
  }

  const handlePublishClose = () => {
    setSelectedIcId('');
    setPublishOpen(false);
  };

  const handlePublish = () => {
    const icToTogglePublish = data.find(ic => {
      return ic.id === selectedIcId;
    })

    if (!icToTogglePublish) {
      return;
    }

    if (icToTogglePublish.published) {
      InvestmentCategoryService.unpublishInvestmentCategory(selectedIcId).then((res) => {
        if (res.status === 204) {
          getData();
          handlePublishClose();
        }
      })
    } else {
      InvestmentCategoryService.publishInvestmentCategory(selectedIcId).then((res) => {
        if (res.status === 204) {
          getData();
          handlePublishClose();
        }
      })
    }
  }

  return (
    <Fragment>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>        
        <h4 style={{display: 'inline-block'}}>Your portfolios</h4>
        <IconButton size="medium" style={{display: 'inline-block', verticalAlign: 'center'}} onClick={handleCreateClickOpen}>
          <AddBoxIcon />
        </IconButton>
        </div>
       <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
          {data.map((ic) => (
            <>
            <TableRow className={classes.root}>
              <TableCell>
                <IconButton
                    size="small"
                    onClick={() => openICBrokers(ic.id)}
                  >
                    <ListIcon />
                  </IconButton>
              </TableCell>
              <TableCell>
                <IconButton
                    size="small"
                    disabled={ic.investments.length == 0}
                    onClick={() => openICInvestments(ic.id)}
                  >
                    <CurrencyBitcoinIcon />
                  </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                <h6>{ic.name}</h6>
                { ic.description &&
                  <hr/>
                }
                {ic.description}
              </TableCell>
              <TableCell>
                <IconButton
                    size="small"
                    onClick={() => handlePublishClickOpen(ic.id)}
                  >
                  {
                    ic.published ? <VisibilityOffIcon /> : <VisibilityIcon />
                  }
                  </IconButton>
              </TableCell>
              <TableCell>
                <IconButton
                    size="small"
                    onClick={() => handleEditClickOpen(ic.id)}
                  >
                    <EditIcon />
                  </IconButton>
              </TableCell>
              <TableCell>
                <IconButton
                    size="small"
                    onClick={() => handleDeleteClickOpen(ic.id)}
                    disabled={ic.brokers.length != 0 || ic.investments.length != 0}
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
        <DialogTitle>Add a new portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Name your portfolio and give it a brief description that concludes the purpose of the portfolio.
            This may later help people understand and filter out the portfolios that match their strategy the best.
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label="Portfolio's name"
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
        <DialogTitle>Edit a portfolio</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Portfolio's name"
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
      <DialogTitle>Delete a portfolio</DialogTitle>
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

      {/* publish/unpublish dialog */}
      <Dialog open={publishOpen} onClose={handlePublishClose}>
      <DialogTitle>Toggle portfolio's visibility</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure that you want to publish/unpublish the portfolio?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePublishClose}>No</Button>
        <Button onClick={handlePublish}>Yes</Button>
      </DialogActions>
      </Dialog>
    </Fragment>
  );
}
