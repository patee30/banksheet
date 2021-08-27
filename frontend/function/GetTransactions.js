import { Field, FieldType } from "@airtable/blocks/models";
import { useBase, useRecords } from "@airtable/blocks/ui";
import React from "react";

const MAX_RECORDS_PER_UPDATE = 50;

const access_token_endpoint = 'https://oauth.casso.vn';

const TRANSACTIONS_TABLE = 'TRANSACTIONS';
const ID_TRANS_FIELD = 'ID';
const DATE_FIELD = 'Date';
const AMOUNT_FIELD = 'Amount';
const DESCRIPTION_FIELD = 'Description';


export async function GetTransactions(fromDate, access_token, base, setIsSnack) {
    const trans_field = [
            {name: ID_TRANS_FIELD, type: FieldType.SINGLE_LINE_TEXT},
            {name: DATE_FIELD, type: FieldType.SINGLE_LINE_TEXT},
            {name: AMOUNT_FIELD, type: FieldType.SINGLE_LINE_TEXT},
            {name: DESCRIPTION_FIELD, type: FieldType.MULTILINE_TEXT}

    ]
    if(base.getTableByNameIfExists(TRANSACTIONS_TABLE) == null) {
        if (base.hasPermissionToCreateTable(TRANSACTIONS_TABLE, trans_field)) {
            await base.createTableAsync(TRANSACTIONS_TABLE, trans_field);
        }
    }
    const transactionsTable = base.getTableByName(TRANSACTIONS_TABLE);

    const query = await transactionsTable.selectRecordsAsync();
    const transIDRecords = query.recordIds;
    
    const recordUpdates = []
    const request = {
        method: 'GET',
        headers: { 'Authorization': access_token},
    };

    const tmp_response = await fetch(`${access_token_endpoint}/v1/transactions?fromDate=${fromDate}&sort=DESC`, request);

    const tmp_data_rep = await tmp_response.json();

    await delayAsync(100);
    if (tmp_data_rep == '401') alert("Warning");
    
    const pageSize = tmp_data_rep.data.totalRecords;

    const response = await fetch(`${access_token_endpoint}/v1/transactions?fromDate=${fromDate}&pageSize=${pageSize}&sort=DESC`, request);
    
    const data_rep = await response.json();

    if (transIDRecords.length == 0) 
    {
        for (const record of data_rep.data.records)
        {
            recordUpdates.push(
                {    
                    fields: 
                    {
                        [ID_TRANS_FIELD]: record.id.toString(),
                        [DATE_FIELD]: ChangeFormateDate(record.when.toString()),
                        [AMOUNT_FIELD]: numberWithCommas(record.amount.toString()),
                        [DESCRIPTION_FIELD]: record.description.toString()
                    }
                }
            )
        }
    }
    else {      
        for (const record of data_rep.data.records) {
            let flag = false;
            for (const rec_id_trans of query.recordIds) {
                const tmp_id_trans = query.getRecordByIdIfExists(rec_id_trans);
                if (tmp_id_trans.name == record.id) {
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                recordUpdates.push(
                    {    
                        fields: 
                        {
                            [ID_TRANS_FIELD]: record.id.toString(),
                            [DATE_FIELD]: ChangeFormateDate(record.when.toString()),
                            [AMOUNT_FIELD]: numberWithCommas(record.amount.toString()),
                            [DESCRIPTION_FIELD]: record.description.toString()
                        }
                    }
                )
            }
        }
    }

    await createRecords(transactionsTable, recordUpdates);

    
    query.unloadData();
    await delayAsync(50);
    setIsSnack(true);
}

async function createRecords(table, recordUpdates) {
    let i = 0;
    while (i < recordUpdates.length) {
        const updateBatch = recordUpdates.slice(i, i + MAX_RECORDS_PER_UPDATE);
        await table.createRecordsAsync(updateBatch);
        i += MAX_RECORDS_PER_UPDATE;
    }
}

function delayAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ChangeFormateDate(oldDate)
{
   return oldDate.toString().split("/").reverse().join("/");
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}