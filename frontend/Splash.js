import { Dialog, Text, Box, Icon, useRecords, useBase, useViewport, Loader} from "@airtable/blocks/ui";
import {FieldType} from '@airtable/blocks/models';
import React, { useState, useRef } from "react";

import { makeStyles } from '@material-ui/core/styles';
import { Tooltip,Button, Typography, Grow, Grid, TextField, Input} from '@material-ui/core';
import { Auth, AuthPage } from "./Auth";
import { getAccessToken } from "./function/GetAccessToken";
import { PreDashboard } from "./PreDashboard";
import { getInfo } from "./function/GetInfo";
import { GetTrans } from './function/GetTrans';
import { DialogApi } from "./components/DialogApi";
import { GetTransactions } from "./function/GetTransactions";
//------------------------------------------------------------------------------------------------------
const access_token_endpoint = 'https://oauth.casso.vn';
export function SplashView ({}) {
    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(6),
            backgroundColor: "#ffffff"
        },
        paper: {
          padding: theme.spacing(2),
          textAlign: 'center',
          color: theme.palette.text.secondary,
        },
        box: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
        caption: {
            color: "white"
        }
      }));

    const classes = useStyles();
    const viewport = useViewport();
    const text = "An application from Casso Vietnam";
    
    const today = new Date();
    const default_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    const revenue = useRef([]);
    const expense = useRef([]);

    const apiKey = useRef("");
    const access_token = useRef("");
    const setTime = useRef("");
    const [isClick, setIsClick] = useState(false);
    const [isPreDash, setIsPreDash] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
    const [isSnack, setIsSnack] = useState(false);
    const base = useBase();
    const businessName = useRef("");
    const userEmail = useRef("");
    async function cur_api(apiKey) {
        const api_tab = base.getTableByName("API");
        const tmp = api_tab.selectRecords();

        await tmp.loadDataAsync();
        
        const tmp_api = tmp.getRecordByIdIfExists(tmp.recordIds[0]);
        apiKey.current = tmp_api.name;
        tmp.unloadData();
    };
    
    let apiTable = base.getTableByNameIfExists('API');
    if (apiTable != null) {
        cur_api(apiKey);
    }
    else apiKey.current = "";
    async function clicked() {
        
        if (apiTable == null) setOpenDialog(true);
        else {   
            if (apiKey.current != "") {
                setIsUpdateInProgress(true);
                await getAccessToken(apiKey.current, access_token, setTime);
                await getInfo(access_token.current, businessName, userEmail);
                await GetTrans(access_token.current, default_date, revenue, expense);
                await GetTransactions(formatDate(default_date), access_token.current, base, setIsSnack);
                setIsUpdateInProgress(false);
                setIsPreDash(true);
        }
        }

        setIsClick(true);
        
    }   
    return isClick? (
        isPreDash? (<PreDashboard setTime={setTime.current} revenue = {revenue} expense = {expense} businessName={businessName.current} userEmail={userEmail.current} access_token={access_token.current} base={base} noti={isSnack} />) : (
        openDialog?   (<DialogApi openDialog = {openDialog} base = {base}/>) :
        (<AuthPage base={base} access_token={access_token} apiKey = {apiKey}/>))
    ) : 
    (
    <Box 
        className = {classes.root}
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
            <img width = "17%" height = "17%" padding = "5px"
                src = 'https://my.casso.vn/assets/img/icon.png'/>
            <img width = "25%" height = "25%" 
                src = 'https://my.casso.vn/assets/img/casso-logo.png'/>
        </Grid>
            
        <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center">
            <Tooltip title={text}>
                
                <Button style = {{fontWeight: 'bold'}}
                    >About</Button>
                
            </Tooltip>
            
            <Tooltip 
                style = {{textDecoration: 'none'}}
                title="Casso VN">
                    <a href="https://casso.vn/">
                <Button style = {{fontWeight: 'bold'}}>Contact</Button>
                </a>
            </Tooltip>
            
        </Grid>

    </Grid>
    <br/>
    <br/>
    <br/>
    <Grid
        container
        spacing= "5"
        direction="row"
        wrap='nowrap'
        justifyContent="space-between"
        alignItems="center" >
    <Grid
        container
        direction="column"
        wrap='nowrap'
        justifyContent="space-around"
        alignItems="center"
        >
        <Typography
            align= "center"
            variant="h4"
            style = {{fontWeight: 'bold'}}>
            BankSheet
        </Typography>
        <br/>
        <Typography   
            align="center" variant="subtitle2">
            The {<b>BankSheet</b>} helps you connect your bank's data into the sheet.   
        </Typography>
        <br/>
        <br/>
        <br/>
        {isUpdateInProgress && <Loader scale={0.5} />}
        <br/>
        <br/>
        <br/>
        <Button
            variant="contained"
            size='large'
            className = {classes.button}
            onClick = {() => clicked()}>
                Get Start
        </Button>
        
    </Grid>
    </Grid>

</Box>

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
