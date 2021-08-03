import React, { useMemo } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    nav: {
        margin: '1px 0px 1px 0px',
        cursor: 'pointer'
    }
}))

function Roomnav(props) {
    const classes = useStyles()

    return (
        <Card className={classes.nav} onClick={props.onClick}>
            <CardContent>
                <Typography variant="subtitle1">{props.title}</Typography>
            </CardContent>
        </Card>
    )
}

export default Roomnav