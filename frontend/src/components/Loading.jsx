import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

function Loading() {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <CircularProgress />
        </div >
    )
}

export default Loading