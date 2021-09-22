import React from 'react'
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';

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

    return (
        <Card raised>
            <CardHeader
                avatar={<Avatar />}
                title={props.author}
                subheader={printDate}
            />
            <CardContent>
                <Typography variant="subtitle2">
                    {props.body}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Review