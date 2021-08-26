
import { Dialog, Text, Box, Icon, colors, useBase} from "@airtable/blocks/ui";
import {FieldType} from '@airtable/blocks/models';
import React, { useState, useRef } from "react";
import { Dashboard } from "./Dashboard";
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip,Button, Typography, Grow, Grid, TextField, Input} from '@material-ui/core';

import { Homepage } from "./Homepage";
const access_token_endpoint = 'https://oauth.casso.vn';


export function GetAPI({apiKey, getAPI, access_token, setAccessToken, base}) {
    let apiTable = base.getTableByNameIfExists("API");
    
    const today = new Date();
    const default_date = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [toDashboard, setToDashboard] = useState(false);
    const [checkDone, setCheckDone] = useState(false);
    const [business_name , getName] = useState("");
    const [email, getEmail] = useState("");

    const [revenue_data, setRevenueData] =  useState([]);
    const [expense_data, setExpenseData] = useState([]);
    check_access(access_token);

    async function check_access(access_token) {
        if (access_token != "") {
            await getInfo(access_token, getName, getEmail);
            
            await getAmount(access_token, formatDate(default_date), setRevenueData, setExpenseData, setToDashboard);
            
            // setToDashboard(true);
        }
    }
    
    const useStyles = makeStyles((theme) => ({
        link: {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          root: {
            padding: theme.spacing(3),
            backgroundColor: "#B9EFD4"
        },
        button: {
            backgroundColor: "#15ab64",
            borderRadius: 50
        },
    }));

    async function clicked( getAPI, valueRef) {
        
        await createAPI_Table(valueRef.current.value, getAPI, setAccessToken);

        await getInfo(access_token, getName, getEmail);
        await getAmount(access_token, formatDate(default_date), setRevenueData, setExpenseData, setToDashboard);

        // if (checkDone ==true) setToDashboard(true);
    }

    const ReApiBox = React.memo(ApiBox);
    function Re_ApiBox({getAPI}) {
        return (<ReApiBox getAPI = {getAPI}/>);
    };
    return toDashboard ? (<Homepage business_name = {business_name}
                                    email = {email}
                                    access_token = {access_token} 
                                    base = {base}
                                    revenue_data = {revenue_data}
                                    expense_data = {expense_data}/>):
    
    (<Re_ApiBox getAPI = {getAPI} />);
    
    
    function ApiBox({getAPI}) {
        const text = "An application from Casso Vietnam";
        const classes = useStyles();
        const valueRef = useRef("");

        return (
            <div className = {classes.root}
                style = {{height: '450px'}}
                adding = "10px">
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
                    <img width = "15%" height = "15%" padding = "5px"
                     src = 'https://my.casso.vn/assets/img/icon.png'/>
                    <img width = "21%" height = "21%" 
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
            
            <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center" >
                    <br/>
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
                        onClick = {() => clicked(getAPI, valueRef)} >
                        GO
                    </Button>
                    <br/>
                    <a href="https://developer.casso.vn/auth-code/tao-authorization-code-thu-cong">
                         Get instruction for getting api key here.
                    </a>
            </Grid>
            </div>
        )
        ;  
    }

    async function createAPI_Table(api, getAPI, setAccessToken) {
        getAPI(api);
        const API_TABLE = 'API';
        const API_FIELD = [{name: 'API Key', type: FieldType.SINGLE_LINE_TEXT}, 
                        ];
        const token_data = await getAccessToken(api.toString());

        if (token_data.error != null && token_data.error == "401") {alert("API Key is wrong!");}
        else {
            setAccessToken(token_data.access_token.toString());
            
            if (base.hasPermissionToCreateTable(API_TABLE, API_FIELD) && apiTable == null) {
                await base.createTableAsync(API_TABLE, API_FIELD);
                apiTable = base.getTableByName(API_TABLE);
                await apiTable.createRecordAsync({
                    'API Key': api.toString(),
                })
            }
            else {
                const query = await apiTable.selectRecordsAsync();
                await apiTable.updateRecordAsync(query.recordIds[0], {
                    'API Key': api.toString(),
                })
                query.unloadData();
            }      
        }
    }
}

async function getAccessToken(apiKey) {
    
    const data_raw = {'code': apiKey};
    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data_raw)
    };

    const response = await fetch(`${access_token_endpoint}/v1/token`, request); 
    const data_rep = await response.json();
    await delayAsync(50);
    
    return data_rep;
}

async function getInfo(access_token, getName, getEmail) {
    const request = {
        method: 'GET',
        headers: { 'Authorization': access_token },
    };
    
    const response = await fetch(`${access_token_endpoint}/v1/userInfo`, request);
    
    const data_rep = await response.json();
    await getUserInfo(getName, getEmail, data_rep);
    await delayAsync(50);
    
    
}
async function getUserInfo(getName, getEmail, data_rep) {
    getName(data_rep.data.business.name);
    getEmail(data_rep.data.user.email);
}
function delayAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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