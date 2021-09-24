import React, { useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AppointmentContext } from './contexts/AppointmentContext'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Grid from '@material-ui/core/Grid'

function Checkout(props) {
    const [isHandling, setHandling] = useState(false)
    const { bookTimeslot } = useContext(AppointmentContext);
    const { roomId, serviceId } = useParams();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        setHandling(true)
        e.preventDefault();
        if (!stripe || !elements) return;

        const res = await stripe.confirmCardPayment(`${props.client_secret}`, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        })

        if (res.error) {
            enqueueSnackbar(`${res.error.message}`, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            setHandling(false)
        } else {
            if (res.paymentIntent.status === 'succeeded') {
                enqueueSnackbar('付款成功', { variant: 'success', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
                bookTimeslot(roomId, serviceId);
                history.push('/')
                setHandling(false)
            }
        }
    }

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <CardElement options={{ hidePostalCode: true }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" startIcon={<ShoppingCartIcon />}>付款</Button>
                    </Grid>
                </Grid>
            </form>
            <Backdrop open={isHandling} style={{color: "#fff", zIndex: "999"}}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    )
}

export default Checkout