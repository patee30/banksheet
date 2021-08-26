import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import walletIcon from '@iconify/icons-fontisto/wallet';
import { alpha } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';

import { fShortenNumber } from '../utils/fShortenNum';
//---------------------------------------------------------------------------------------

export function WeeklyBonus({revenue, expense}) {
    const useStyles = makeStyles ((theme) => ({
        root: {
            boxShadow: 'none',
            textAlign: 'center',
            padding: theme.spacing(2, 0),
            color: "#7a4f01",
            backgroundColor: "#fff7cd",
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
            color: "#7a4f01",
            backgroundImage: `linear-gradient(135deg, ${alpha("#f4e5ae", 0)} 0%, ${alpha(
                "#f4e5ae",
                0.24
            )} 100%)`       
        }
    }));

    const classes = useStyles();

    const sum_revenue = getSum(revenue.current[1]);
    const sum_expense = getSum(expense.current[1]);
    const bonus = sum_revenue - sum_expense;
    return (
        <Card className={classes.root}>
            <div className={classes.icon}>
            <Icon icon={walletIcon} width={25} height={25} />
            </div>
            <Typography variant="h5">{fShortenNumber(bonus)}</Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
            Income
            </Typography>
        </Card>
    );
    }


function getSum(data) {
    let sum = 0;
    for (const i of data) sum += i;
    return sum;
}
