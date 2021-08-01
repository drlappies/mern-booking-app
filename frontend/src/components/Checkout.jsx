import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
    card: {
        marginTop: '30px'
    },
    button: {
        margin: '30px 0px 0px 350px'
    }
}))

function Checkout(props) {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const res = await stripe.confirmCardPayment(`${props.client_secret}`, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        })

        if (res.error) {
            enqueueSnackbar(`${res.error.message}`, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        } else {
            if (res.paymentIntent.status === 'succeeded') {
                enqueueSnackbar('付款成功', { variant: 'success', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
            }
        }

    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <CardElement className={classes.card} options={{ hidePostalCode: true }} />
            <Button variant="contained" color="primary" className={classes.button} type="submit">付款</Button>
        </form>
    )
}

export default Checkout