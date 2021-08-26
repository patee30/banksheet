import { Dialog, Text, Box, Icon, colors, useBase, useViewport} from "@airtable/blocks/ui";
import {FieldType} from '@airtable/blocks/models';
import React, { useState, useRef } from "react";
import { Dashboard } from "./Dashboard";
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip,Button, Typography, Grow, Grid, TextField, Input} from '@material-ui/core';
import { PreDashboard } from "./PreDashboard";
import { GetApiForm } from "./GetApiForm";

//------------------------------------------------------------------------------------------------------
const access_token_endpoint = 'https://oauth.casso.vn';
const AuthorPage = React.memo(Auth);
export function AuthPage ({base, access_token, apiKey}) {
    return <AuthorPage base = {base} access_token = {access_token} apiKey = {apiKey} />
}
export function Auth ({base, access_token, apiKey}) {
    if (access_token.current != "") setPreDashboard(true);
    
    const data_apiKey = useRef("");

    return (
        <GetApiForm valueRef = {data_apiKey} base = {base} 
        access_token = {access_token} apiKey = {apiKey}/>
    )
}