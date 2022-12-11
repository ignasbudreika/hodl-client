import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import InvestmentService from '../../services/InvestmentService';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import InfoIcon from '@mui/icons-material/Info';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

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

const types = [
  {
    value: 'STOCK',
    label: 'Stock',
  },
  {
    value: 'CRYPTO',
    label: 'Cryptocurrency',
  },
  {
    
    value: 'OTHER',
    label: 'Other',
  },
];

export const Investments: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [brkrId, setBrkrId] = useState<string>('');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createName, setCreateName] = React.useState<string>('');
  const [createInvestedAmount, setCreateInvestedAmount] = React.useState('0');
  const [createQuantity, setCreateQuantity] = React.useState('0');
  const [createType, setCreateType] = React.useState<string>('');
  const [createCurrentAmount, setCreateCurrentAmount] = React.useState('0');
  const [createDescription, setCreateDescription] = React.useState<string>('');
  const [editOpen, setEditOpen] = React.useState(false);
  const [editName, setEditName] = React.useState<string>('');
  const [editInvestedAmount, setEditInvestedAmount] = React.useState('0');
  const [editQuantity, setEditQuantity] = React.useState('0');
  const [editType, setEditType] = React.useState<string>('');
  const [editCurrentAmount, setEditCurrentAmount] = React.useState('0');
  const [editDescription, setEditDescription] = React.useState<string>('');
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [infoOpen, setInfoOpen] = React.useState(false);
  const [info, setInfo] = React.useState({'name': '', 'description': 'description', 'invested_amount': 0, 'current_amount': 0, 'quantity': 0, 'roe': 0, 'type': ''});
  const [selectedInvestmentId, setSelectedInvestmentId] = React.useState<string>('');
  const classes = useRowStyles();

  const history = useHistory();

  const getData = () => {
    var queryParams = new URLSearchParams(window.location.search)
    var icId = queryParams.get("icId")
    var brokerId = queryParams.get("brokerId")

    if (icId && icId.length > 0) {
      InvestmentService.getInvestmentsByICId(icId).then((res) => {
        setData(res.data);
      })
    } else if (brokerId && brokerId.length > 0) {
      InvestmentService.getInvestmentsByBrokerId(brokerId).then((res) => {
        setData(res.data);
        setBrkrId((brokerId as string));
    });
    } else {
      InvestmentService.getInvestments().then((res) => {
        setData(res.data);
    });
    }
  };

  useEffect(() => {
      console.log(localStorage.getItem("accessToken"))
        if (!localStorage.getItem("accessToken")) {
            history.push("/")
            return;
        }

        getData();
  }, []);

  const handleCreateClickOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
    setCreateName('');
    setCreateInvestedAmount('0');
    setCreateQuantity('0');
    setCreateType('');
    setCreateCurrentAmount('0');
    setCreateDescription('');
  };

  const handleCreate = () => {
    if (!createName || !createInvestedAmount || !createQuantity || !createType) {
      return;
    }

    InvestmentService.createInvestment(brkrId, createName, parseFloat(createInvestedAmount), parseFloat(createQuantity), createType, parseFloat(createCurrentAmount), createDescription).then((res) => {
      if (res.status === 200 && res.data) {
          getData();
          handleCreateClose();
      }
    });
  }

  const handleEditClickOpen = (id: string) => {
    const investmentToEdit = data.find(investment => {
      return investment.id === id;
    })

    if (!investmentToEdit) {
      return;
    }

    setEditName(investmentToEdit.name);
    setEditInvestedAmount(investmentToEdit.invested_amount);
    setEditQuantity(investmentToEdit.quantity);
    setEditType(investmentToEdit.type);
    setEditCurrentAmount(investmentToEdit.current_amount);
    setEditDescription(investmentToEdit.description);
    setSelectedInvestmentId(id);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditName('');
    setEditInvestedAmount('0');
    setEditQuantity('0');
    setEditType('');
    setEditCurrentAmount('0');
    setEditDescription('');
    setSelectedInvestmentId('');
  };

  const handleEdit = () => {
    if (!editName || !editInvestedAmount || !editQuantity) {
      return;
    }

    InvestmentService.editInvestment(selectedInvestmentId, editName, parseFloat(editInvestedAmount), parseFloat(editQuantity), parseFloat(editCurrentAmount), editDescription).then((res) => {
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

    setSelectedInvestmentId(id);
    setDeleteOpen(true);
  }

  const handleDeleteClose = () => {
    setSelectedInvestmentId('');
    setDeleteOpen(false);
  };

  const handleDelete = () => {
    if (!selectedInvestmentId) {
      return;
    }

    InvestmentService.deleteInvestment(selectedInvestmentId).then((res) => {
      if (res.status === 204) {
        getData();
        handleDeleteClose();
      }
    })
  }
  
  const getInfo = (id: string) => {
    InvestmentService.getInvestmentById(id).then((res) => {
      if (res.status === 200) {
        setInfo(res.data);
      }
    })
  }

  const handleInfoClickOpen = (id: string) => {
    if (!id) {
      return;
    }

    setSelectedInvestmentId(id);
    getInfo(id);
    setInfoOpen(true);
  }

  const handleInfoClose = () => {
    setSelectedInvestmentId('');
    setInfo({'name': '', 'description': 'description', 'invested_amount': 0, 'current_amount': 0, 'quantity': 0, 'roe': 0, 'type': ''});
    setInfoOpen(false);
  }

  return (
    <Fragment>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>        
        <h4 style={{display: 'inline-block'}}>Your investments</h4>
        <IconButton size="medium" style={{display: 'inline-block', verticalAlign: 'center'}} disabled={!brkrId} onClick={handleCreateClickOpen}>
          <AddBoxIcon />
        </IconButton>
        </div>
       <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
          {data.map((investment) => (
            <>
            <TableRow className={classes.root}>
              <TableCell component="th" scope="row">
                <h6>{investment.name}</h6>
                { investment.description &&
                  <hr/>
                }
                {investment.description}
              </TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                <IconButton
                    size="small"
                    onClick={() => handleInfoClickOpen(investment.id)}
                  >
                    <QueryStatsIcon />
                  </IconButton>
                  </div>
              </TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                <IconButton
                    size="small"
                    onClick={() => handleEditClickOpen(investment.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  </div>
              </TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>
                <IconButton
                    size="small"
                    onClick={() => handleDeleteClickOpen(investment.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Invested amount</TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>Quantity</TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>Type</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{investment.invested_amount}</TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>{investment.quantity}</TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>{investment.type}</TableCell>
            </TableRow></>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

        {/* create dialog */}
        <Dialog open={createOpen} onClose={handleCreateClose}>
        <DialogTitle>Add a new investment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The more information you provide about your investments the more accurate statistics can be retrieved later.
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label="Investment's name"
            type="text"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            onChange={nameField => setCreateName(nameField.target.value)}
            required={true}
            rows={1}
            />
            
          <TextField
            margin="dense"
            id="investedAmount"
            label="Invested amount"
            type="number"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            onChange={investedAmountField => setCreateInvestedAmount(investedAmountField.target.value)}
            required={true}
            />
          <TextField
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            onChange={quantityField => setCreateQuantity(quantityField.target.value)}
            required={true}
            />
          <TextField
            margin="dense"
            id="currentAmount"
            label="Current amount"
            type="number"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            required={true}
            inputProps={{ maxLength: 30 }}
            onChange={currentAmountField => setCreateCurrentAmount(currentAmountField.target.value)}
            />
          <TextField
            margin="dense"
            id="type"
            label="Type"
            select
            fullWidth
            required={true}
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            variant="standard"
            onChange={typeField => setCreateType(typeField.target.value)}
          >
          {types.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
            </TextField>
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

      {/* info dialog */}
        <Dialog open={infoOpen} onClose={handleInfoClose}>
        <DialogTitle style={{display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline"}}>
          <p style={{display: "inline-flex"}} >Your investment statistics</p>
          <Tooltip style={{display: "inline-flex"}} title={"The statistics of each different asset is updated daily. There might be some inaccuracy between provided and real-time data."}>
            <InfoIcon />
          </Tooltip>
          </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Investment's name"
            type="text"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30, readOnly: true }}
            value={info.name}
            rows={1}
            />
          <TextField
            margin="dense"
            id="investedAmount"
            label="Invested amount"
            type="number"
            fullWidth
            variant="standard"
            multiline
            inputProps={
              { readOnly: true, }
            }
            maxRows={1}
            value={info.invested_amount}
            />
          <TextField
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            multiline
            inputProps={
              { readOnly: true, }
            }
            maxRows={1}
            value={info.quantity}
            />
          <TextField
            margin="dense"
            id="currentAmount"
            label="Current amount"
            type="number"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={
              { readOnly: true, }
            }
            value={info.current_amount}
            />
          <TextField
            margin="dense"
            id="roe"
            label="ROE"
            type="number"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={
              { readOnly: true}
            }
            value={info.roe}
            />
          <TextField
            margin="dense"
            id="type"
            label="Type"
            type="text"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={
              { readOnly: true, }
            }
            value={info.type}
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
            inputProps={
              { readOnly: true, }
            }
            value={info.description}
          />
        </DialogContent>
      </Dialog>

      {/* edit dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit an investment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Investment's name"
            type="text"
            fullWidth
            variant="standard"
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            onChange={nameField => setEditName(nameField.target.value)}
            required={true}
            defaultValue={editName}
            rows={1}
            />
          <TextField
            margin="dense"
            id="investedAmount"
            label="Invested amount"
            type="number"
            fullWidth
            variant="standard"
            onChange={investedAmountField => setEditInvestedAmount(investedAmountField.target.value)}
            required={true}
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            defaultValue={editInvestedAmount}
            />
          <TextField
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            onChange={quantityField => setEditQuantity(quantityField.target.value)}
            required={true}
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            defaultValue={editQuantity}
            />
          <TextField
            margin="dense"
            id="currentAmount"
            label="Current amount"
            type="number"
            fullWidth
            variant="standard"
            onChange={currentAmountField => setEditCurrentAmount(currentAmountField.target.value)}
            multiline
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            defaultValue={editCurrentAmount}
            />
          <TextField
            margin="dense"
            id="type"
            select
            type="text"
            fullWidth
            variant="standard"
            disabled={true}
            multiline
            value={editType}
            maxRows={1}
            inputProps={{ maxLength: 30 }}
            defaultValue={editType}
          >
          {types.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
            </TextField>
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
      <DialogTitle>Delete an investment</DialogTitle>
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
