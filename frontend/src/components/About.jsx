import React from 'react';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';

function About() {
    return (
        <Container>
            <Typography paragraph variant="h5">A demo room booking app written in MERN stack. Find the source code from: <a href="https://github.com/drlappies/mern-booking-app">Github</a></Typography>
            <Typography paragraph variant="h6">The payment gateway is powered by Stripe API - You can either use dummy cards provided by Stripe in <a href="https://stripe.com/docs/testing">here</a> or your real credit card. No charges will be made because the payment API is always on the test mode.</Typography>
        </Container>
    )
}

export default About