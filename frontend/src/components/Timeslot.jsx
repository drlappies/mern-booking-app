import React, { useState, useContext, useEffect } from 'react';
import { AppointmentContext } from './contexts/AppointmentContext';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    slot: {
        border: "1px solid #A9A9A9",
        width: "160px",
        height: "50px"
    }
})

function Timeslot(props) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { selectedTimeslots, addTimeslot, removeTimeslot } = useContext(AppointmentContext);
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        if (!props.isOpen) return;
        if (props.isTaken) return;
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

    useEffect(() => {
        if (selectedTimeslots.some(el => el.hour === props.hour && el.year === props.year && el.month === props.month && el.date === props.date && el.day === props.day)) {
            setSelected(!selected);
        }    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={classes.slot} onClick={handleClick}
            style={{
                backgroundColor: props.isOpen ? (props.isTaken ? '#808080' : (selected ? '#C5C5C5' : null)) : '#3B3B3B',
                cursor: props.isOpen ? (props.isTaken ? null : 'pointer') : null,
            }}>
        </div>
    )
}

export default Timeslot