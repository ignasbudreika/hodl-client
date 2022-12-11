import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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

export const Approved: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [unpublishOpen, setUnpublishOpen] = React.useState(false);
  const [selectedIcId, setSelectedIcId] = React.useState<string>('');
  const classes = useRowStyles();

  const history = useHistory();

  const getData = () => {
    AdminService.getPublishedInvestmentCategories().then((res: any) => {
        const unfiltered = res.data;
        setData((unfiltered as any).filter((ic: any) => {
            return ic.approved;
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

  const handleUnpublishClickOpen = (id: string) => {
    if (!id) {
      return;
    }

    setSelectedIcId(id);
    setUnpublishOpen(true);
  }

  const handleUnpublishClose = () => {
    setSelectedIcId('');
    setUnpublishOpen(false);
  };

  const handleUnpublish = () => {
    const icToUnpublish = data.find(ic => {
      return ic.id === selectedIcId;
    })

    if (!icToUnpublish) {
      return;
    }

    AdminService.unpublishInvestmentCategory(selectedIcId).then((res) => {
        if (res.status === 204) {
          getData();
          handleUnpublishClose();
        }
    })
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
              <TableCell>
                <IconButton
                    size="small"
                    onClick={() => handleUnpublishClickOpen(ic.id)}
                  >
                  <VisibilityOffIcon/>
                  </IconButton>
              </TableCell>
            </TableRow></>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* unpublish dialog */}
      <Dialog open={unpublishOpen} onClose={handleUnpublishClose}>
      <DialogTitle>Unpublish the portfolio</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure that you want to unpublish the portfolio?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUnpublishClose}>No</Button>
        <Button onClick={handleUnpublish}>Yes</Button>
      </DialogActions>
      </Dialog>
    </Fragment>
  );
}
