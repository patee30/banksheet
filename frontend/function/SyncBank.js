import { GetTransactions } from "./GetTransactions";

const access_token_endpoint = 'https://oauth.casso.vn';
export async function SyncBank(fromDate, access_token, base, bank_id,setIsSnack) {
    const data_raw = {'bank_acc_id': bank_id.toString()};
    const request = {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', 
                    'Authorization': access_token }),
        body: JSON.stringify(data_raw)
    };
    
    
    const response = await fetch(`${access_token_endpoint}/v1/sync`, request); 
    const data_rep = await response.json();
    await delayAsync(50);

    if (data_rep.error == "401") {alert("Invalid Bank ID!")}
    else GetTransactions(fromDate, access_token, base,setIsSnack);
}

function delayAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}