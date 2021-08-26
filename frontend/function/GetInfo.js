

const access_token_endpoint = 'https://oauth.casso.vn';
export async function getInfo(access_token, businessName, userEmail) {
    const request = {
        method: 'GET',
        headers: { 'Authorization': access_token },
    };
    
    const response = await fetch(`${access_token_endpoint}/v1/userInfo`, request);
    
    const data_rep = await response.json();
    
    businessName.current = data_rep.data.business.name;
    userEmail.current = data_rep.data.user.email;
    await delayAsync(50);
}

function delayAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}