
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import React, {useState} from 'react';
import { CreatingApiTable } from "../function/CreatingApiTable";
import { SplashView } from "../Splash";
export function DialogApi({openDialog, base}) {
    const [open, setOpen] = useState(openDialog);
    const handleClickOpen = async () => {
        await CreatingApiTable(base);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    return open?  (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"Your base hasn't had API Table. Create one?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    For the next time, if you don't have any change on your API key, BankSheet will store it in a table to make you easily get access to your Casso data.  
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Disagree
                </Button>
                <Button onClick={handleClickOpen} color="primary" autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    ) : (<SplashView />)
}