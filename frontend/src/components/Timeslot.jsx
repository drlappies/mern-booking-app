import React, { useState, useContext, useEffect } from 'react';
import { AppointmentContext } from './contexts/AppointmentContext';
import { useSnackbar } from 'notistack';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Popup from './Popup'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

const useStyles = makeStyles({
    slot: {
        height: "40px",
    }
})

function Timeslot(props) {
    const currentTime = new Date();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { selectedTimeslots, addTimeslot, removeTimeslot } = useContext(AppointmentContext);
    const [selected, setSelected] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [booking, setBooking] = useState({
        invoiceId: "",
        invoiceAmount: 0,
        serviceName: "",
        servicePricing: 0,
        appointments: [],
        customer: "",
        bookedAt: ""
    })

    const handleClick = () => {
        if (props.isViewOnly || !props.isOpen || props.isTaken) return;
        if (currentTime.getFullYear() >= props.year && currentTime.getMonth() + 1 >= props.month && currentTime.getDate() >= props.date && currentTime.getHours() >= props.hour) {
            enqueueSnackbar('不能加入已過時段', { variant: 'warning', autoHideDuration: 3000 })
            return;
        }
        setSelected(!selected);
        if (!selected) {
            if (selectedTimeslots.length >= 5) {
                enqueueSnackbar('只可以加入5個時段', { variant: 'warning', autoHideDuration: 3000 })
                setSelected(false);
                return;
            }
            addTimeslot(props.year, props.month, props.date, props.hour, props.day)
        } else {
            removeTimeslot(props.year, props.month, props.date, props.hour, props.day)
        }
    }

    const fetchDetails = async () => {
        try {
            if (!props.id) return
            setIsViewing(true)
            const res = await axios.get(`/api/appointment/${props.id}`)
            setBooking({
                invoiceId: res.data.invoice._id,
                invoiceAmount: res.data.invoice.amount,
                serviceName: res.data.service.name,
                servicePricing: res.data.service.pricing,
                appointments: res.data.invoice.appointment,
                customer: res.data.invoice.finder.name,
                bookedAt: res.data.invoice.createdAt
            })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const isSelected = selectedTimeslots.some(el => el.hour === props.hour && el.year === props.year && el.month === props.month && el.date === props.date && el.day === props.day)
        setSelected(isSelected)
    }, [props.date, props.day, props.hour, props.month, props.year, selectedTimeslots])

    return (
        <React.Fragment>
            {props.isViewOnly && props.isTaken ?
                <HtmlTooltip
                    title={
                        <React.Fragment>
                            {props.year}年{props.month}月{props.date}日 {props.hour}:00 - {props.hour + 1}:00
                        </React.Fragment>
                    }
                >
                    <div className={classes.slot} onClick={fetchDetails}
                        style={{
                            backgroundColor: props.isOpen ? (props.isTaken ? '#808080' : (selected ? '#5dd5fc' : null)) : '#3B3B3B',
                            cursor: props.isTaken ? 'pointer' : null,
                        }}>
                    </div>
                </HtmlTooltip>
                :
                <div className={classes.slot} onClick={handleClick}
                    style={{
                        backgroundColor: props.isOpen ? (props.isTaken ? '#808080' : (selected ? '#5dd5fc' : null)) : '#3B3B3B',
                        cursor: props.isOpen ? (props.isTaken ? null : 'pointer') : null,
                    }}>
                </div>}
            <Popup
                open={isViewing}
                onClose={() => setIsViewing(false)}
                body={
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography paragraph variant="h6">預訂資訊</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="subtitle1">訂單號碼</Typography>
                            <Typography variant="subtitle2">{booking.invoiceId}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="subtitle1">客戶別稱</Typography>
                            <Typography variant="subtitle2">{booking.customer}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="subtitle1">預訂時間</Typography>
                            <Typography variant="subtitle2">{new Date(booking.bookedAt).getFullYear()}年{new Date(booking.bookedAt).getMonth()}月{new Date(booking.bookedAt).getDate()}日</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="subtitle1">預訂服務</Typography>
                            <Typography variant="subtitle2">{booking.serviceName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>時段</TableCell>
                                        <TableCell>小計</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {booking.appointments.map((el, i) =>
                                        <TableRow key={i}>
                                            <TableCell>{el.year}年{el.month}月{el.date}日 {el.hour}:00 - {el.hour + 1}:00</TableCell>
                                            <TableCell>{booking.servicePricing}</TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                        <TableCell>總共</TableCell>
                                        <TableCell>{booking.invoiceAmount}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>


                }
            />
        </React.Fragment >
    )
}

export default Timeslot