import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'

import { makeStyles } from "@material-ui/core/styles";
import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset"
    }
  }
});

export const PubInvestmentCategories: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  const getData = () => {
    axios
      .get("http://localhost:8080/api/public/investment-categories")
      .then((res) => {
        setData(res.data)
        console.log(res.data);
      })
  };

  useEffect(() => {
      getData();
  }, []);

  return (
    <Fragment>
        <h4>Get ideas of where to invest from other peoples porfolios</h4>
        <br></br>
       <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableBody>
          {data.map((row) => (
            <><TableRow className={classes.root}>
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  disabled={row.investments.length == 0}
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                <h6>{row.name}</h6>
                <hr></hr>
                {row.description}
              </TableCell>
            </TableRow><TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={open && row.investments.length > 0} timeout="auto" unmountOnExit>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell key={'header'}>
                            Investments
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Percentage of portfolio, %</TableCell>
                        </TableRow>
                        {row.investments.map((investment: any) => (
                          <TableRow>
                            <TableCell>{investment.name}</TableCell>
                            <TableCell>{investment.percentage}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Collapse>
                </TableCell>
              </TableRow></>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}
