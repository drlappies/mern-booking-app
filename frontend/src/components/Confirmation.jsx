import React, { useContext } from 'react';
import { AppointmentContext } from './contexts/AppointmentContext';
import Container from '@material-ui/core/Container';

function Confirmation() {
    const { selectedTimeslots, addTimeslots, removeTimeslots } = useContext(AppointmentContext)
    return (
        <Container>
            <div>Confirmation</div>
        </Container>
    )
}

export default Confirmation