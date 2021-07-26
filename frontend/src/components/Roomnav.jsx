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

function toDate(str) {
    const time = new Date(str)
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    return { year: year, month: month, date: date, hour: hour, minute: minute, second: second }
}

function Roomnav(props) {
    const classes = useStyles()
    const createdAt = useMemo(() => toDate(props.createdAt), [props.createdAt]);
    const updatedAt = useMemo(() => toDate(props.updatedAt), [props.updatedAt]);

    return (
        <Card className={classes.nav} onClick={props.onClick}>
            <CardContent>
                <Typography variant="subtitle1">{props.title}</Typography>
                <Typography variant="subtitle2">{props.id}</Typography>
                <Typography variant="subtitle2">建立於：{createdAt.year}/{createdAt.month}/{createdAt.date} {createdAt.hour}:{createdAt.minute}:{createdAt.second}</Typography>
                <Typography variant="subtitle2">最後更新：{updatedAt.year}/{updatedAt.month}/{updatedAt.date} {updatedAt.hour}:{updatedAt.minute}:{updatedAt.second}</Typography>
            </CardContent>
        </Card>
    )
}

export default Roomnav