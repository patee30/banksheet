import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SyncIcon from '@material-ui/icons/Sync';
import clsx from 'clsx';
import DateFnsUtils from '@date-io/date-fns';
import {Button, Divider, Grid, TextField} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import { GetTransactions } from './GetTransactions';
import {SyncBank} from './SyncBank';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    borderColor: "#B9EFD4",
    backgroundColor: "#B9EFD4",
    // width: 500,
  },
  bar: {
    backgroundColor: "#15ab64"
  },
  
  tabs: {
    backgroundColor: "#B9EFD4",
    borderColor: "#B9EFD4",
  },
  column: {
    flexBasis: '50%',
    },
    helper: {
        alignItems: 'center',
        borderRight: `2px solid ${theme.palette.divider}`,
        fontSize: theme.typography.pxToRem(17),
        padding: theme.spacing(5 , 2),
    },
    picker: {
        flexBasis: '50%',
        padding: theme.spacing(2, 2),
    },
    button: {
        display: "flex",
        justifyContent: 'flex-end',
    },
    getBut: {
        backgroundColor: "#15ab64",
        borderRadius: 50
    }
}));

export default function TabFunctions({access_token, base}) {
    const today = new Date();
    const default_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    const [selectedDate, setSelectedDate] = useState(default_date);
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const valueRef = useRef("");
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bar} style={{ borderRadius: "80px" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Transactions" icon={<AccountBalanceIcon />}  {...a11yProps(0)} />
          <Tab label="Sync"  icon={<SyncIcon />} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        className={classes.tabs}
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel className={classes.tabs} value={value} index={0} dir={theme.direction}>
            <Grid
                container
                direction="row">
            <div className={clsx(classes.column, classes.helper)}>
                <Typography variant="subtitle2">
                The default date is 7 days ago.
                </Typography>
            </div>
            <div className={classes.picker}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                    'aria-label': 'change date',
                    }}
                />
                </MuiPickersUtilsProvider>
            </div>
            </Grid>
            <br/>
            <Divider/>
            <br/>
            <div className={classes.button} >
                <Button variant="contained" className={classes.getBut} onClick = {() => GetTransactions(formatDate(selectedDate), access_token, base)}>
                        Get
                </Button>
            </div>
        </TabPanel>

        <TabPanel className={classes.tabs} value={value} index={1} dir={theme.direction}>
        <Grid
            container
            direction="row">
                
            <div className={clsx(classes.column, classes.helper)}>
                <Typography variant="subtitle2">
                    Sync with new bank account has been connected to Casso.
                </Typography>
            </div>
            <div className={classes.picker}>
                <TextField required id="standard-basic" label="Bank ID" inputRef={valueRef}/>
            </div>
            </Grid>
            <br/>
            <Divider/>
            <br/>
            <div className={classes.button} >
                <Button variant="contained" className={classes.getBut} 
                        onClick={() => {SyncBank(formatDate(selectedDate), access_token, base, valueRef.current.value) }}>
                        Sync
                </Button>
            </div>
        </TabPanel> 
      </SwipeableViews>
    </div>
  );
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
  }