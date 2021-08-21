import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFnsUtils from '@date-io/date-fns';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SyncIcon from '@material-ui/icons/Sync';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import {Text, Heading} from '@airtable/blocks/ui';
import clsx from 'clsx';
import AccordionActions from '@material-ui/core/AccordionActions';
import { GetTransactions } from './GetTransactions';
import { SyncBank } from './SyncBank';
import { Splash } from '.';
import { Charting, getAmount } from './Chart';
import { Box } from '@material-ui/core';
const access_token_endpoint = 'https://oauth.casso.vn';
export function Dashboard({apiKey, access_token, base, business_name, email}) {
    const today = new Date();
    const default_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const useStyles = makeStyles((theme) => ({
        root: {
          flexGrow: 1,
          backgroundColor: "#004643"
        },
        menuButton: {
          marginRight: theme.spacing(1),
        },
        title: {
          flexGrow: 1,

        },
        button: {
          margin: theme.spacing(1),
        },
      }));
    
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isLogOut, setIsLogOut] = useState(false);

    const [chart, getChart] = useState(false);

    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logOut = () => {
        setIsLogOut(true);
    }

    return isLogOut ? (<Splash/>) : (
        <div 
          className={classes.root} >
          <AppBar 
            
            position="static" style= {{backgroundColor: "#B9EFD4"}}>
            <Toolbar >
              <IconButton edge="start" className={classes.menuButton}  aria-label="menu">
                <MenuIcon style= {{color: "#15ab64"}}/>
              </IconButton>
              <Typography
                variant = "h5"
                className={classes.title} 
                style= {
                  {color: "#f9bc60"}
                  }>
                BANKSHEET
              </Typography>
              {auth && (
                <div>
                  <IconButton
                    size = "medium"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    
                  >
                    <AccountCircle size = "medium" style= {{color: "#15ab64"}}/>
                  </IconButton>
                  <Menu
                    padding = "10px"
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <Text size = "xlarge" padding = '10px'>Profile</Text>
                    <div>
                        <Text paddingLeft = "10px" paddingRight  = "10px">Business Name: {business_name}</Text>
                        <Text paddingLeft = "10px" paddingRight = "10px">Email: {email}</Text>
                        <br/>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick = {logOut}
                            startIcon={<ExitToAppIcon />}
                          >
                            Exit
                          </Button>
                    </div>

                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>
          <br/>
          <br/>
          <br/>

          <DetailedAccordion access_token = {access_token} base = {base} getChart = {getChart}/>
        </div>
      );
}

const useStyles_accor = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '75%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(17),
    color: "black"

  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: "white",
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {

    alignItems: 'center',
  },
  column: {
    flexBasis: '50%',
  },
  icon: {
    padding: theme.spacing(0,1),
  },
  helper: {
    borderRight: `2px solid ${theme.palette.divider}`,
    fontSize: theme.typography.pxToRem(13),
    padding: theme.spacing(0 , 1),
  },
  picker: {
    flexBasis: '50%',
    padding: theme.spacing(2, 1),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export function DetailedAccordion({access_token, base, getChart}) {
  const classes = useStyles_accor();
  const today = new Date();
  const default_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  const [selectedDate, setSelectedDate] = useState(default_date);
  const [chartDate, setChartDate] = useState(default_date);
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  
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

  const valueRef = useRef("");
  function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
  }
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  };

  function handleClose (){
    setOpen(false);
  };
  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          style = {{background: '#15ab64'}} 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.icon}>
            <AccountBalanceIcon style = {{color: '#000000'}} />
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>Get Transaction</Typography>
          </div>
          <div className={classes.column}>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
        <div className={clsx(classes.column, classes.helper)}>
            <Typography variant="caption">
              The default selected date is 7 days ago.
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
          
        </AccordionDetails>
        <Divider />
        <AccordionActions
          >
          <Button size="small" style = {{background: '#15ab64'}}  onClick={() => {GetTransactions(formatDate(selectedDate), access_token, base) }} >
            Get
          </Button>
        </AccordionActions>
      </Accordion>
      <Accordion>
          <AccordionSummary
            style = {{background: '#15ab64'}} 
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
          >
          <div className={classes.icon}>
            <SyncIcon style = {{color: '#000000'}} />
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>Sync Bank Account</Typography>
          </div>
          <div className={classes.column}>
          </div>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <div className={clsx(classes.column, classes.helper)}>
                <Typography variant="caption">
                  Sync with new bank account has been connected to Casso.
                </Typography>
              </div>
              <div className={classes.picker}>
              <TextField required id="standard-basic" label="Bank ID" inputRef={valueRef}/>
              </div>
              
          </AccordionDetails>
          <Divider />
        <AccordionActions
          >
          <Button size="small" style = {{background: '#15ab64'}} 
            onClick={() => {SyncBank(formatDate(selectedDate), access_token, base, valueRef.current.value) }}
            >
            Sync
          </Button>
        </AccordionActions>
      </Accordion>
      <Accordion>
        <AccordionSummary
          style = {{background: '#15ab64'}} 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.icon}>
            <AccountBalanceIcon style = {{color: '#000000'}} />
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>Get Charting</Typography>
          </div>
          <div className={classes.column}>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
        <div className={clsx(classes.column, classes.helper)}>
            <Typography variant="caption">
              The default selected date is 7 days ago.
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
                value={chartDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          
        </AccordionDetails>
        <Divider />
        <AccordionActions
          >
          <Button size="small" style = {{background: '#15ab64'}}  
            onClick={() => {handleClickOpen()}} >
            Get
          </Button>

          <Dialog
            scroll = "body"
            open={open}
            onClose={() => {handleClose()}}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              Revenue Chart
            </DialogTitle>
            <DialogContent
              style={{height:'550px'}, {width: '500px'}}>
             
              <Charting access_token = {access_token} fromDate = {chartDate} />
  
            </DialogContent>
            <DialogActions> 
              <Button onClick={() => {handleClose()}} color="primary">
                Okay
              </Button>
            </DialogActions>
          </Dialog>
        </AccordionActions>
      </Accordion>
    </div>
  );
}


function delayAsync(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}