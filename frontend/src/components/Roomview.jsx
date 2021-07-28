import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import Roominfo from './Roominfo';
import Roomaddress from './Roomaddress';
import Roomservice from './Roomservice';
import Roomweekday from './Roomweekday';
import Roomimage from './Roomimage';

const useStyles = makeStyles(() => ({
    root: {
        padding: '30px 30px 30px 30px'
    },
    img: {
        height: '150px',
        width: '300px'
    }
}))

function Roomview(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={6}>
                    <Roominfo id={props.id} />
                </Grid>
                <Grid item xs={6}>
                    <Roomweekday id={props.id} />
                </Grid>
                <Grid item xs={12}>
                    <Roomaddress id={props.id} />
                </Grid>
                <Grid item xs={12}>
                    <Roomservice id={props.id} />
                </Grid>
                <Grid item xs={12}>
                    <Roomimage id={props.id} />
                </Grid>
            </Grid>
        </div >
    )
}

export default Roomview