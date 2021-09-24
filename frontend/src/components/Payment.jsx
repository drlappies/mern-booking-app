import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AppointmentContext } from './contexts/AppointmentContext';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Checkout from './Checkout';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useSnackbar } from 'notistack';
import axios from 'axios'

const useStyles = makeStyles(() => ({
    form: {
        padding: '20px 40px 20px 40px',
        width: '400px'
    },
    cardSection: {
        display: "flex",
        justifyContent: "center"
    }
}))

function Payment() {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const { serviceId } = useParams();
    const { selectedTimeslots } = useContext(AppointmentContext);
    const [state, setState] = useState({
        client_secret: '',
        connected_stripe_account_id: '',
        stripeObject: null,
        pricing: 0,
    })

    const fetchPaymentIntent = useCallback(async () => {
        try {
            const payload = {
                serviceId: serviceId,
                appointments: selectedTimeslots,
            }
            const res = await axios.post('/api/transaction', payload, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            })
            setState(prevState => {
                return {
                    ...prevState,
                    client_secret: res.data.client_secret,
                    connected_stripe_account_id: res.data.connected_stripe_account_id,
                    pricing: res.data.pricing
                }
            })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }, [enqueueSnackbar, selectedTimeslots, serviceId])

    const fetchStripeObject = useCallback(async () => {
        try {
            if (state.connected_stripe_account_id) {
                const res = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY, {
                    stripeAccount: state.connected_stripe_account_id
                })
                setState(prevState => { return { ...prevState, stripeObject: res } })
            };
        } catch (err) {
            console.log(err)
        }
    }, [state.connected_stripe_account_id])

    useEffect(() => {
        fetchStripeObject();
        fetchPaymentIntent();
    }, [fetchPaymentIntent, fetchStripeObject])

    return (
        <Container>
            <Grid container justifyContent="center">
                <Paper className={classes.form}>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>詳細</TableCell>
                                        <TableCell>價錢</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedTimeslots.map((el, i) =>
                                        <TableRow key={i}>
                                            <TableCell><Typography variant="button">{`${el.year}年 ${el.month}月 ${el.date}日 ${el.hour}:00 - ${el.hour + 1}:00`}</Typography></TableCell>
                                            <TableCell><Typography variant="button">$ {state.pricing}</Typography></TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                        <TableCell><Typography variant="button">總共</Typography></TableCell>
                                        <TableCell><Typography variant="button">$ {state.pricing * selectedTimeslots.length}</Typography></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.cardSection}>
                            {state.stripeObject ?
                                <Elements stripe={state.stripeObject}>
                                    <Checkout
                                        client_secret={state.client_secret}
                                    />
                                </Elements>
                                :
                                <CircularProgress />
                            }
                        </div>
                    </Grid>
                </Paper>
            </Grid>
        </Container>
    )
}

export default Payment