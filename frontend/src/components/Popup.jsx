import React from 'react';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function Popup(props) {
    return (
        <Modal open={props.open} onClose={props.onClose} >
            <Grid container justifyContent="center" style={{marginTop: "200px"}}>
                <Grid item xs={11} sm={7} md={5} lg={4} xl={3}>
                    <Card>
                        <CardHeader title="預訂資訊" subheader={props.invoiceId} />
                        <CardContent>
                            <List>
                                <ListItem>
                                    <ListItemText primary="顧客" secondary={props.customer} />
                                </ListItem>
                                <ListItem>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>預訂時間</TableCell>
                                                <TableCell>小計</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {props.appointments.map((el, i) =>
                                                <TableRow key={i}>
                                                    <TableCell>{el.year}年{el.month}月{el.date}日 {el.hour}:00 {el.hour + 1}:00</TableCell>
                                                    <TableCell>{props.servicePricing}</TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow>
                                                <TableCell>總共</TableCell>
                                                <TableCell>{props.invoiceAmount}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Modal>
    );
}

export default Popup