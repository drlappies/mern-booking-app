import React, { useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AppointmentContext } from './contexts/AppointmentContext'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
    card: {
        marginTop: '30px'
    },
    button: {
        margin: '30px 0px 0px 350px'
    },
    backdrop: {
        color: '#fff',
        zIndex: 999
    },
}))

function Checkout(props) {
    const [isHandling, setHandling] = useState(false)
    const { bookTimeslot } = useContext(AppointmentContext);
    const { roomId, serviceId } = useParams();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
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
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <CardElement className={classes.card} options={{ hidePostalCode: true }} />
                <Button variant="contained" color="primary" className={classes.button} type="submit">付款</Button>
            </form>
            <Backdrop className={classes.backdrop} open={isHandling}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    )
}

export default Checkout