import React, { useContext } from 'react';
import { useHistory, Link, useParams } from "react-router-dom";
import { AppointmentContext } from './contexts/AppointmentContext';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const day = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
]

function Confirmation() {
    const history = useHistory();
    const { roomId, serviceId } = useParams();
    const { selectedTimeslots } = useContext(AppointmentContext);

    return (
        <Container>
            <Grid container direction="row" justify="space-between" alignItems="center">
                <Grid item>
                    <Button startIcon={<ArrowBackIosIcon />} onClick={() => history.goBack()}>返回</Button>
                </Grid>
                <Grid item>
                    <Button component={Link} to={`/room/${roomId}/service/${serviceId}/appointment/payment`} endIcon={<ArrowForwardIosIcon />}>確定並付款</Button>
                </Grid>
            </Grid>
            <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
                <Grid item>
                    <Typography variant="h5">確定已選擇時段</Typography>
                </Grid>
                <Grid item>
                    <List>
                        {selectedTimeslots.map((el, i) =>
                            <ListItem key={i}>
                                <ListItemText>{el.year}年{el.month}月{el.date}日 {day[el.day]} {el.hour}:00 到 {el.hour + 1}:00</ListItemText>
                            </ListItem>
                        )}
                    </List>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Confirmation