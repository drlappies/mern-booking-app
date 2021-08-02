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
import axios from 'axios'

const useStyles = makeStyles(() => ({
    form: {
        padding: '20px 40px 20px 40px',
        width: '400px'
    },
    cardSection: {
        marginTop: '30px'
    }
}))

function Payment() {
    const classes = useStyles();
    const { serviceId } = useParams();
    const { selectedTimeslots } = useContext(AppointmentContext);
    const [state, setState] = useState({
        client_secret: '',
        connected_stripe_account_id: '',
        stripeObject: null,
        pricing: 0
    })

    const fetchPaymentIntent = useCallback(async () => {
        try {
            const payload = {
                serviceId: serviceId,
                appointments: selectedTimeslots,
            }
            const res = await axios.post('/transaction/intent', payload, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
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
            console.log(err)
        }
    }, [selectedTimeslots, serviceId])

    const fetchStripeObject = useCallback(async () => {
        if (state.connected_stripe_account_id) {
            const res = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY, {
                stripeAccount: state.connected_stripe_account_id
            })
            setState(prevState => {
                return {
                    ...prevState,
                    stripeObject: res
                }
            })
        };
    }, [state.connected_stripe_account_id])

    useEffect(() => {
        fetchStripeObject();
        fetchPaymentIntent();
    }, [fetchPaymentIntent, fetchStripeObject])

    return (
        <Container>
            <Grid container justifyContent="center">
                <Paper className={classes.form}>
                    <Typography variant="h6">詳細</Typography>
                    <Grid container spacing={3}>
                        {selectedTimeslots.map((el, i) =>
                            <React.Fragment key={i}>
                                <Grid item xs={9}>
                                    <Typography variant="body1">{`${el.year}年 ${el.month}月 ${el.date}日 ${el.hour}：00 星期 ${el.day}`}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>$ {state.pricing}</Typography>
                                </Grid>
                            </React.Fragment>
                        )}
                        <Grid item xs={9}>總共</Grid>
                        <Grid item xs={3}>$ {selectedTimeslots.length * state.pricing}</Grid>
                    </Grid>
                    <div className={classes.cardSection}>
                        {state.stripeObject ?
                            <Elements stripe={state.stripeObject}>
                                <Checkout
                                    client_secret={state.client_secret}
                                />
                            </Elements>
                            :
                            null
                        }
                    </div>
                </Paper>
            </Grid>
        </Container>
    )
}

export default Payment