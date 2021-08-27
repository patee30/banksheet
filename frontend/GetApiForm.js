import {initializeBlock,useBase,useViewport, Loader} from '@airtable/blocks/ui';
import React,  {useState, useRef }  from 'react';
import {FieldType} from '@airtable/blocks/models';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Tooltip, Button, Typography, Grow, Box, TextField} from '@material-ui/core';
import { getAccessToken } from './function/GetAccessToken';
import { getInfo } from './function/GetInfo';
import { PreDashboard } from './PreDashboard';
import { GetTrans } from './function/GetTrans';

export function GetApiForm({valueRef, base, access_token, apiKey}) {
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

    const businessName = useRef("");
    const userEmail = useRef("");
    const setTime = useRef("");
    const revenue = useRef([]);
    const expense = useRef([]);
    const [isDash, setIsDash] = useState(false);
    const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
    async function setDash () {
        setIsDash(true);
    }
    async function onSubmitApiKey () {
        setIsUpdateInProgress(true);
        apiKey.current = valueRef.current.value;
        await createAPI_Table(valueRef.current.value, base);
        await delayAsync(500);
        await getAccessToken(valueRef.current.value, access_token, setTime);
        await getInfo(access_token.current, businessName, userEmail);
        await GetTrans(access_token.current, default_date, revenue, expense);
        setIsUpdateInProgress(false);
        setIsDash(true);
    }
    return isDash? (<PreDashboard setTime={setTime.current} revenue={revenue} expense={expense} businessName={businessName.current} userEmail={userEmail.current} access_token={access_token.current} base={base} noti={false}/>) : (
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
                alignItems="center">
                
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

            
            <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center" >
                    <br/>
                    <br/>
                    <Typography variant='h6'>Field your Casso API Key here</Typography>
                    <br/>
                    <TextField
                        type="password"
                        label="API Key"
                        variant="outlined"
                        color="secondary"
                        inputRef={valueRef}
                    />
                    <br/>
                    <Button
                        variant="contained"
                        className = {classes.button}
                        onClick = {onSubmitApiKey}
                         >
                        GO
                    </Button>
                    <br/>
                    <br/>
                    <br/>
                    {isUpdateInProgress && <Loader scale={0.5} />}
                    <br/>
                    <br/>
                    <br/>
                    <a href="https://developer.casso.vn/auth-code/tao-authorization-code-thu-cong">
                         Get instruction about getting api key here.
                    </a>
            </Grid>
            
        </Box>
    )
}

async function createAPI_Table(api, base) {
    let apiTable = base.getTableByNameIfExists("API");
    const query = await apiTable.selectRecordsAsync();
    await apiTable.updateRecordAsync(query.recordIds[0], {
        'API Key': api.toString(),
    })
    query.unloadData();    
}

function delayAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}