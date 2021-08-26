import { union } from "lodash";
import React from 'react';
export function weeklyData(revenue, expense) {
    const tmp = new Map();
    const days = union(revenue[0], expense[0]);
    
    for (const i of days) tmp.set(i, []);

        for (var j= 0; j < revenue[0].length; j++) {
            if (tmp.has(revenue[0][j])) {
                tmp.get(revenue[0][j]).push(revenue[1][j]);
            }
            else tmp.get(revenue[0][j]).push(0);
        }


        for (var j = 0; j < expense[0].length; j++) {
            if (tmp.has(expense[0][j])) tmp.get(expense[0][j]).push(expense[1][j]);
            else tmp.get(expense[0][j]).push(0);
        }

    return tmp;
}