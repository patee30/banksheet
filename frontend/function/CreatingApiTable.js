import React from "react";
import {FieldType} from '@airtable/blocks/models';

export async function CreatingApiTable(base) {
    const API_TABLE = 'API';
    const API_FIELD = [{name: 'API Key', type: FieldType.SINGLE_LINE_TEXT}];
    if (base.hasPermissionToCreateTable(API_TABLE, API_FIELD)) {
        const apiTable = await base.createTableAsync(API_TABLE, API_FIELD);
        await apiTable.createRecordAsync({
            'API Key': "",
        })
    }
}