import React from 'react';
import { Container, Typography } from '@material-ui/core'

function Notfound() {
    return (
        <Container>
            <Typography variant="h2">你做訪的頁面並不存在 :'( ...</Typography>
        </Container>
    )
}

export default Notfound