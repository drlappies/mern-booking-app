import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        height: "500px",
        width: "50%",
        overflowY: "scroll",
        backgroundColor: "white",
        boxShadow: theme.shadows[5],
        borderRadius: "20px",
        padding: theme.spacing(2, 4, 3),
    },
}));

function Popup(props) {
    const classes = useStyles();

    const body = (
        <div className={classes.paper}>
            {props.body}
        </div>
    );

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            {body}
        </Modal>
    );
}

export default Popup