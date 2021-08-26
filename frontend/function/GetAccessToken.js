import React from 'react';
const access_token_endpoint = 'https://oauth.casso.vn';

export async function getAccessToken(apiKey, access_token) {  
    const data_raw = {'code': apiKey};
    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data_raw)
    };

    const response = await fetch(`${access_token_endpoint}/v1/token`, request); 
    const data_rep = await response.json();
    access_token.current = data_rep.access_token;
    await delayAsync(50);
}

function delayAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}