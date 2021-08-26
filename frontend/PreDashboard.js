import React, { useState, useRef } from 'react';
import classNames from "classnames";
// material
import { Box, Grid, Container, Typography, CssBaseline, Button, AppBar, Toolbar
, IconButton, TextField, Snackbar ,
Menu,
MenuItem,
Drawer, List} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
  import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SyncIcon from '@material-ui/icons/Sync';
import HomeIcon from '@material-ui/icons/Home';
import { WeeklyRevenue } from './components/Revenue';
import { WeeklyExpense } from './components/Expense';
import { WeeklyChart } from './components/WeeklyChart';
import { WeeklyBonus } from './components/Bonus';
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from '@material-ui/icons/AccountCircle';
import { GetTransactions } from './GetTransactions';
import { SyncBank } from './SyncBank';
import Alert from '@material-ui/lab/Alert';
import { SplashView } from './Splash';
import Profile from './components/Profile';
const drawerWidth = 220;

const styles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    backgroundColor: "#15ab64",
    zIndex: theme.zIndex.drawer + 1
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonIconClosed: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    transform: "rotate(0deg)"
  },
  menuButtonIconOpen: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    transform: "rotate(180deg)"
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9 + 1
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing.unit,
    justifyContent: "flex-end",
    padding: "1 5px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2
  },
  grow: {
    flexGrow: 1
  },
  button: {
    backgroundColor: "#15ab64",
    color: "#ffffff",
    borderRadius: 50,
    '&:hover': {
        backgroundColor: '#0d8073',
        color: '#fff'
    },
},
}));

export function PreDashboard({revenue, expense, businessName, userEmail, access_token, base}) {
    const [anchorEl, setAnchorE1] = useState(null);
    const [open, setOpen] = useState(false);
    const isOpen = Boolean(anchorEl);

    const [isHome, setIsHome] = useState(true);
    const [isTrans, setIsTrans] = useState(false);
    const [isSync, setIsSync] = useState(false);
    const classes = styles();
    const [toProfile, setToProfile] = useState(false);
    const [isSnack, setIsSnack] = useState(false);
    const today = new Date();
    const default_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const [selectedDate, setSelectedDate] = useState(default_date);
    const [toSplash, setToSplash] = useState(false);
    const snackClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setIsSnack(false);
    };
    const valueRef = useRef("");
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleMenu = event => {
        setAnchorE1(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorE1(null);
    };
    const handleLogOut = () => {
        setToSplash(true);
    };
    const handleProfile = () => {
        setToProfile(true);
        setAnchorE1(null);
    };
    const setHome = () => {
        setIsHome(true);
        setIsTrans(false);
        setIsSync(false);
    };  
    const setTrans = () => {
        setIsHome(false);
        setIsTrans(true);
        setIsSync(false);
    };
    const setSync = () => {
        setIsHome(false);
        setIsTrans(false);
        setIsSync(true);
    };
    return toSplash? (<SplashView />) : (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
             position="fixed"
             className={classes.appBar}
             fooJon={classNames(classes.appBar, {
                [classes.appBarShift]: open
              })}>
                  <Toolbar disableGutters={true}>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={handleDrawerOpen}
                    spacing={0,2}
                    className={classes.menuButton}
                    >
                        <MenuIcon
                            classes={{root: open
                                        ? classes.menuButtonIconOpen
                                        : classes.menuButtonIconClosed}}
                        />
                    </IconButton>
                    <Typography
                        variant="h6"
                        color="inherit"
                        className={classes.grow}
                        noWrap>
                            BankSheet
                    </Typography>
                    <div>
                    <IconButton
                        aria-owns={isOpen ? "menu-appbar" : undefined}
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right"
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right"
                        }}
                        open={isOpen}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                    </Menu>
                    </div>
                  </Toolbar>
            </AppBar>
            
            <Drawer
                variant="permanent"
                className={classNames(classes.drawer, {
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open
                })}
                classes={{
                  paper: classNames({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open
                  })
                }}
                open={open}
            >
                
                <div className={classes.toolbar} />
                <List>
                    {["Dashboard", "Get Transactions", "Sync Bank Account"].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                        {index % 3 === 0 ? <HomeIcon onClick={setHome} /> : (index % 3 === 1 ? <AccountBalanceIcon onClick={setTrans} /> :  <SyncIcon onClick={setSync}/>)} 
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                    ))}
                </List>               
            </Drawer>
            {isSnack && <Snackbar
                            anchorOrigin={{ vertical: "top", horizontal: "right" }} 
                            open={isSnack} autoHideDuration={4000} onClose={snackClose}>
                        <Alert onClose={snackClose} severity="success">
                        Success!
                        </Alert>
                    </Snackbar>  }
            {toProfile && <Profile businessName={businessName} userEmail={userEmail} toProfile={toProfile} setToProfile={setToProfile} />}
            {isTrans && <main className={classes.content}>
                    <div className={classes.toolbar} /> 
                    <Container maxWidth="xl"> 
                        <Grid   
                        container 
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="center" 
                        spacing={3}>
                            
                                <Typography variant="h4">Get Transactions</Typography>
                                <Typography variant="subtitle2">Pick a fromdate to get transactions until now</Typography>
                            <br/>
                            <br/>
                            <br/>
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={4}>
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
                            </Grid>
                            <br/>


                            <Button className={classes.button} 
                                onClick={() => GetTransactions(formatDate(selectedDate), access_token, base, setIsSnack)}>
                                        Get
                            </Button> 
                        </Grid>
                    </Container>
                    </main>}
            {isHome && <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Container maxWidth="xl">
                    <Grid   
                    container 
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center" 
                    spacing={3}>
                        <Grid item xs={12} md={6} lg={8} alignItems="center">
                            <WeeklyChart revenue={revenue.current} expense={expense.current} />
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}>
                        <Grid item xs={6} sm={3} md={3}>
                            <WeeklyRevenue revenue = {revenue}/>    
                        </Grid>
                        <Grid item xs={6} sm={3} md={3}>
                            <WeeklyExpense expense = {expense} />
                        </Grid>
                        <Grid item xs={6} sm={3} md={3}>
                            <WeeklyBonus revenue = {revenue} expense = {expense} />
                        </Grid>
                        </Grid>
                    </Grid>
                </Container>
                </main>
            }
            {isSync && <main className={classes.content}>
                    <div className={classes.toolbar} /> 
                    <Container maxWidth="xl"> 
                        <Grid   
                        container 
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="center" 
                        spacing={3}>
                            
                                <Typography variant="h4">Sync Bank Account</Typography>
                                <Typography variant="subtitle2">Sync with new bank account has been connected to Casso.</Typography>
                            <br/>
                            <br/>
                            <br/>
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={4}>
                                   <TextField required id="standard-basic" label="Bank ID" inputRef={valueRef}/>
                            </Grid>
                            <br/>
    
                            <Button className={classes.button} 
                                onClick={() => SyncBank(formatDate(selectedDate), access_token, base, valueRef.current.value, setIsSnack)}>
                                        Sync
                            </Button> 
                        </Grid>
                    </Container>
                    </main>

            }
        </div>
    )
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