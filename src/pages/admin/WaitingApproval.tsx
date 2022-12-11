import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminService from '../../services/AdminService';

import Button from '@mui/material/Button';
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

export const WaitingApproval: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [declineOpen, setDeclineOpen] = React.useState(false);
  const [selectedIcId, setSelectedIcId] = React.useState<string>('');
  const classes = useRowStyles();

  const history = useHistory();

  const getData = () => {
    AdminService.getPublishedInvestmentCategories().then((res: any) => {
        const unfiltered = res.data;
        setData((unfiltered as any).filter((ic: any) => {
            return !ic.approved;
        }));
    });
  };

  useEffect(() => {
      console.log(localStorage.getItem("accessToken"))
        if (!localStorage.getItem("accessToken")) {
            history.push("/")
            return;
        }

        getData();
  }, []);

  const handleDeclineClickOpen = (id: string) => {
    if (!id) {
      return;
    }

    setSelectedIcId(id);
    setDeclineOpen(true);
  }

  const handleDeclineClose = () => {
    setSelectedIcId('');
    setDeclineOpen(false);
  };

  const handleDecline = () => {
    const icToDecline = data.find(ic => {
      return ic.id === selectedIcId;
    })

    if (!icToDecline) {
      return;
    }

    if (!icToDecline.approved) {
      AdminService.declineInvestmentCategory(selectedIcId).then((res) => {
        if (res.status === 204) {
          getData();
          handleDeclineClose();
        }
      })
    }
  }

  const handleApproveClickOpen = (id: string) => {
    if (!id) {
      return;
    }

    setSelectedIcId(id);
    setApproveOpen(true);
  }

  const handleApproveClose = () => {
    setSelectedIcId('');
    setApproveOpen(false);
  };

  const handleApprove = () => {
    const icToApprove = data.find(ic => {
      return ic.id === selectedIcId;
    })

    if (!icToApprove) {
      return;
    }

    if (!icToApprove.approved) {
      AdminService.approveInvestmentCategory(selectedIcId).then((res) => {
        if (res.status === 204) {
          getData();
          handleApproveClose();
        }
      })
    }
  }

  return (
    <Fragment>
        <h4>Published portfolios</h4>
       <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
          {data.map((ic) => (
            <>
            <TableRow className={classes.root}>
              <TableCell component="th" scope="row">
                <h6>{ic.name}</h6>
                { ic.description &&
                  <hr/>
                }
                {ic.description}
              </TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>
                <IconButton
                    size="small"
                    onClick={() => handleApproveClickOpen(ic.id)}
                  >
                  <VerifiedIcon/>
                  </IconButton>
              </TableCell>
              <TableCell style={{whiteSpace: "nowrap", width: "1%"}}>
                <IconButton
                    size="small"
                    onClick={() => handleDeclineClickOpen(ic.id)}
                  >
                  <CancelIcon/>
                  </IconButton>
              </TableCell>
            </TableRow></>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* approve dialog */}
      <Dialog open={approveOpen} onClose={handleApproveClose}>
      <DialogTitle>Approve portfolio</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure that you want to approve the portfolio?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleApproveClose}>No</Button>
        <Button onClick={handleApprove}>Yes</Button>
      </DialogActions>
      </Dialog>

      {/* decline dialog */}
      <Dialog open={declineOpen} onClose={handleDeclineClose}>
      <DialogTitle>Decline portfolio</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure that you want to decline the portfolio?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeclineClose}>No</Button>
        <Button onClick={handleDecline}>Yes</Button>
      </DialogActions>
      </Dialog>
    </Fragment>
  );
}
