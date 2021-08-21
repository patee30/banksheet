import {initializeBlock,useBase,useViewport} from '@airtable/blocks/ui';
import React,  {useState }  from 'react';
import { GetAPI } from './API';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Tooltip, Button, Typography, Grow, Box} from '@material-ui/core';
import { Homepage } from './Homepage';
const access_token_endpoint = 'https://oauth.casso.vn';
function Splash() {
    const viewport = useViewport();
    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(6),
            backgroundColor: "#B9EFD4"
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
            borderRadius: 50
        },
        caption: {
            color: "white"
        }
      }));
    
    const [isClick, setIsClick] = useState(false);
    const [apiKey, getApiKey] = useState("");
    const [access_token, setAccessToken] = useState("");
    const base = useBase();
    let apiTable = base.getTableByNameIfExists("API");

    if (apiTable != null) {
        check_api(getApiKey, base, setAccessToken, apiKey);
    }

    const [checked, setChecked] = useState(true);
    const classes = useStyles();
    const text = "An application from Casso Vietnam";

    async function clicked(event) {
        event.preventDefault();
        if (apiKey != "") {
            await getAccessToken(apiKey, setAccessToken);
        }
        setIsClick(true);
    }
    return isClick ? (
        <GetAPI apiKey = {apiKey} getAPI = {getApiKey} access_token = {access_token} setAccessToken = {setAccessToken} base = {base}/>
    ) : (
        
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
            <br/>
            <br/>
            
            <Grid
                container
                spacing= "5"
                direction="row"
                wrap='nowrap'
                justifyContent="space-between"
                alignItems="center" >
            <Grow
                in={checked}
                style={{ transformOrigin: '0 0 0' }}
                {...(checked ? { timeout: 1000 } : {})}>
            <img width = "60%" height = "60%" padding = "10px"
                     src = "https://i.imgur.com/KU9Q8a4.png"/>
            </Grow>
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
                <Button
                    variant="contained"
                    size='large'
                    className = {classes.button}
                    onClick = {clicked}>
                        Get Start
                </Button>
                
            </Grid>
            </Grid>

        </Box>
        
    );
}
async function check_api (getApiKey, base) {
    const api_tab = base.getTableByName("API");
    const tmp = api_tab.selectRecords();
    await tmp.loadDataAsync();
    const tmp_api = tmp.getRecordByIdIfExists(tmp.recordIds[0]);

    if (tmp_api != null && tmp_api.name != "") {
        getApiKey(tmp_api.name);
    }
    tmp.unloadData();
}
async function getAccessToken(apiKey, setAccessToken) {  
    const data_raw = {'code': apiKey};
    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data_raw)
    };

    const response = await fetch(`${access_token_endpoint}/v1/token`, request); 
    const data_rep = await response.json();
    setAccessToken(data_rep.access_token.toString());
    await delayAsync(50);
}

function delayAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

initializeBlock(() => <Splash />);
