import React from 'react'
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles({
    root: {
        margin: "10px 0 10px 0"
    },
    body: {
        padding: "0px 24px"
    }
})

function Review(props) {
    const getTime = (hour) => {
        let hourConvert = hour;
        let time = ['上午', '下午'];
        if (hour > 12) {
            hourConvert = hour - 12
            return `${time[1]}${hourConvert}`
        }
        return `${time[0]}${hourConvert}`
    }
    const date = new Date(props.createdAt);
    const printDate = `建立於 ${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日 ${getTime(date.getHours())}時${date.getMinutes()}分${date.getSeconds()}秒`
    const classes = useStyles();

    return (
        <Card classes={{ root: classes.root }}>
            <CardHeader
                avatar={<Avatar />}
                title={props.author}
                subheader={printDate}
            />
            <CardContent classes={{ root: classes.body }}>
                <Rating value={props.rating} max={5} readOnly={true} size='small' />
                <Typography variant="subtitle2">
                    {props.reviewBody}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Review