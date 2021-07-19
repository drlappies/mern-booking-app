import React, { useState, useContext, memo } from 'react';
import { AppointmentContext } from './contexts/AppointmentContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    slot: {
        border: "1px solid #A9A9A9",
        width: "160px",
        height: "50px"
    }
})

function Timeslot(props) {
    console.log('timeslot rerenders')
    const { addTimeslot, removeTimeslot } = useContext(AppointmentContext);
    const classes = useStyles();
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        if (!props.isOpen) return;
        setSelected(!selected);
        if (!selected) {
            addTimeslot(props.year, props.month, props.date, props.hour)
        } else {
            removeTimeslot(props.year, props.month, props.date, props.hour)
        }
    }

    return (
        <div className={classes.slot} onClick={handleClick}
            style={{
                backgroundColor: (props.isOpen) ? (selected ? '#C0C0C0' : null) : '#808080',
                cursor: props.isOpen ? 'pointer' : null,
            }}>
        </div>
    )
}

export default memo(Timeslot)