import React, { useContext } from 'react';
import { useHistory, Link, useParams } from "react-router-dom";
import { AppointmentContext } from './contexts/AppointmentContext';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

function Confirmation() {
    const history = useHistory();
    const { roomId, serviceId } = useParams();
    const { selectedTimeslots } = useContext(AppointmentContext);

    return (
        <Container>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Button startIcon={<ArrowBackIosIcon />} onClick={() => history.goBack()}>返回</Button>
                </Grid>
                <Grid item>
                    <Button component={Link} to={`/room/${roomId}/service/${serviceId}/appointment/payment`} endIcon={<ArrowForwardIosIcon />}>確定並付款</Button>
                </Grid>
            </Grid>
            <Grid container justify="center" spacing={1}>
                <Grid item xs={12} sm={8} md={4} lg={4} xl={4}>
                    <Card>
                        <CardHeader title="確定已選擇時段" />
                        <CardContent>
                            <Table>
                                <TableBody>
                                    {selectedTimeslots.map((el, i) =>
                                        <TableRow key={i}>
                                            <TableCell>{el.year}年{el.month}月{el.date}日 {el.hour}:00 - {el.hour + 1}:00</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Confirmation