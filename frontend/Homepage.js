import { Button, Grid, Box, Tooltip, Typography, Menu, ClickAwayListener , Grow, Paper , Popper ,
    MenuItem , MenuList , Popover } from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { makeStyles } from '@material-ui/core/styles';
import React,  {useState }  from 'react';
import {useViewport} from '@airtable/blocks/ui';
import TabFunctions from "./Tab";
import clsx from 'clsx';
import { HomeChart } from "./HomeChart";
export function Homepage({business_name, email, access_token, base, revenue_data, expense_data}) {
    const viewport = useViewport();
    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(6),
            backgroundColor: "#B9EFD4"
        },
        button: {
            display: "flex",
            justifyContent: 'flex-end',
            padding: theme.spacing(0,2,2,0)
        },
        exit: {
            backgroundColor: "#15ab64",
            borderRadius: 50,
        },
        popover: {
            display: "flex",
            padding: theme.spacing(6)
        },
        info: {
            padding: theme.spacing(1,2)
        },
        
    }));

    const sum_revenue = getSum(revenue_data[1]);
    const sum_expense = getSum(expense_data[1]);

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
 

    return (
        <Box className = {classes.root}
            sizeHeight = {viewport.size.height}
            sizeWidth = {viewport.size.width}
            paddingBottom = "20">

            <Grid
                container
                direction="row"
                wrap='nowrap'
                justifyContent="space-between"
                alignItems="center"  >
                <Grid
                    container
                    direction="row"
                    spacing = "1"
                    justifyContent="flex-start"
                    alignItems="center">
                    <img width = "11%" height = "1%" padding = "5px"
                     src = 'https://my.casso.vn/assets/img/icon.png'/>
                    <img width = "13%" height = "13%" 
                     src = 'https://my.casso.vn/assets/img/casso-logo.png'/>
                </Grid>
                   
                      <div>
                        <Button
                        aria-describedby={id} variant="contained"
                        onClick={handleClick}
                        startIcon = {<AccountCircleIcon/>}
                        >
                        Profile
                        </Button>
                            <Popover
                                className = {classes.popover}
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >   
                                    <br/>
                                    <Typography variant="subtitle2" className = {classes.info} >Name: {business_name}</Typography>
                                    <Typography variant="subtitle2" className = {classes.info}>Email: {email}</Typography>
                                    <br/>
                                    <div className = {classes.button}>
                                        <Button className = {classes.exit}>Exit</Button>
                                    </div>  
                        
                        </Popover>
                    </div>
            </Grid>
            <br/>
            <br/>
            <Box
                display = "flex"
                alignContent= "center"
                justifyContent= "center">
                <HomeChart sum_revenue = {sum_revenue} sum_expense = {sum_expense} />
            </Box>
            <Grid>
                <TabFunctions access_token = {access_token} base = {base}/>
            </Grid>
        </Box>
    );
}

function getSum(data) {
    let sum = 0;
    for (const i of data) sum += i;
    return sum;
}