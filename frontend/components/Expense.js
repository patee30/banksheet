import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import bxsArchiveOut from '@iconify/icons-bx/bxs-archive-out';
import { alpha } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';

import { fShortenNumber } from '../utils/fShortenNum';
//---------------------------------------------------------------------------------------

export function WeeklyExpense({expense}) {
    const useStyles = makeStyles ((theme) => ({
        root: {
            boxShadow: 'none',
            textAlign: 'center',
            padding: theme.spacing(2, 0),
            color: "#005249",
            backgroundColor: "#c8facd",
            borderRadius: '15%'   
        },
        icon: {
            margin: 'auto',
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            width: theme.spacing(5),
            height: theme.spacing(5),
            justifyContent: 'center',
            marginBottom: theme.spacing(3),
            color: "#005249",
            backgroundImage: `linear-gradient(135deg, ${alpha("#1976d2", 0)} 0%, ${alpha(
                "#1976d2",
                0.24
            )} 100%)`       
        }
    }));

    const classes = useStyles();

    const sum_expense = getSum(expense.current[1]);
    return (
        <Card className={classes.root}>
            <div className={classes.icon}>
            <Icon icon={bxsArchiveOut} width={25} height={25} />
            </div>
            <Typography variant="h5">{fShortenNumber(sum_expense)}</Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
            Expense
            </Typography>
        </Card>
    );
    }


function getSum(data) {
    let sum = 0;
    for (const i of data) sum += i;
    return sum;
}
