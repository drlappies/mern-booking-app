import React, { useEffect, useCallback, useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function Transaction() {
    const [state, setState] = useState({
        isExpanded: [],
        invoices: [],
        appointments: [],
        amount: 0,
        serviceName: "",
        servicePricing: 0,
        serviceProvider: "",
        invoiceid: ""
    })

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get('/api/invoice', {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            })
            setState(prevState => {
                return {
                    ...prevState,
                    invoices: res.data.invoice,
                    isExpanded: Array(res.data.invoice.length).fill(false)
                }
            })
        } catch (err) {
            console.log(err)
        }
    }, [])

    const fetchInvoice = async (id, index) => {
        try {
            if (state.isExpanded[index]) {
                return setState(prevState => {
                    return {
                        ...prevState,
                        isExpanded: prevState.isExpanded.map((el, i) => i === index ? !el : false)
                    }
                })
            }

            const res = await axios.get(`/api/invoice/${id}`, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            })
            setState(prevState => {
                return {
                    ...prevState,
                    isOpen: true,
                    appointments: res.data.invoice.appointment,
                    amount: res.data.invoice.amount,
                    serviceName: res.data.invoice.service.name,
                    servicePricing: res.data.invoice.service.pricing,
                    serviceProvider: res.data.invoice.owner.title,
                    invoiceid: res.data.invoice._id,
                    isExpanded: prevState.isExpanded.map((el, i) => i === index ? !el : false)
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <Container>
            <Grid container spacing={1} justifyContent="center">
                {state.invoices.map((el, i) =>
                    <Grid item key={i} xs={12} sm={12} md={12} lg={10} xl={10}>
                        <Card raised>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item xs={12} sm={11} md={11}>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={12} md={3}>
                                                <Typography variant="subtitle1" color="textPrimary">訂單號碼</Typography>
                                                <Typography variant="subtitle2" color="textSecondary">{el._id}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={3} >
                                                <Typography variant="subtitle1" color="textPrimary">預訂服務</Typography>
                                                <Typography variant="subtitle2" color="textSecondary">{el.service.name}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={3}>
                                                <Typography variant="subtitle1" color="textPrimary">店家</Typography>
                                                <Typography variant="subtitle2" color="textSecondary">{el.owner.title}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={3}>
                                                <Typography variant="subtitle1" color="textPrimary">總計</Typography>
                                                <Typography variant="subtitle2" color="textSecondary">{el.amount}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Grid>
                                <Grid item xs={12} sm={1} md={1}>
                                    <CardActions>
                                        <IconButton onClick={() => fetchInvoice(el._id, i)}>
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    </CardActions>
                                </Grid>
                            </Grid>
                            <Collapse in={state.isExpanded[i]} timeout="auto" unmountOnExit>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>預訂時間</TableCell>
                                            <TableCell>小計</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {state.appointments.map((el, i) =>
                                            <TableRow key={i}>
                                                <TableCell>{el.year}年{el.month}月{el.date}日{el.hour}:00-{el.hour + 1}:00</TableCell>
                                                <TableCell>{state.servicePricing}</TableCell>
                                            </TableRow>
                                        )}
                                        <TableRow>
                                            <TableCell>總共</TableCell>
                                            <TableCell>{state.amount}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Collapse>
                        </Card>

                    </Grid>
                )}
            </Grid>
        </Container >
    )
}

export default Transaction