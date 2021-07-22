import React from 'react';
import RegisterType from './RegisterType';
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid';
import PublishIcon from '@material-ui/icons/Publish';
import DateRangeIcon from '@material-ui/icons/DateRange';
import PaymentIcon from '@material-ui/icons/Payment';
import RoomIcon from '@material-ui/icons/Room';
import TextsmsIcon from '@material-ui/icons/Textsms';

function Register() {
    return (
        <Container>
            <Grid container spacing={10}>
                <Grid item xs={6}>
                    <RegisterType
                        title={'建立店家帳號'}
                        subtitle={'成為店家用戶 你可以...'}
                        feature1icon={<PublishIcon />}
                        feature1={'上傳你的房間到平台並讓用戶可以找到你的服務'}
                        feature2icon={<DateRangeIcon />}
                        feature2={'在這裏提供你的房間的服務時間並讓用戶預約'}
                        feature3icon={<PaymentIcon />}
                        feature3={'在這裏處理所有有關房間預約的收款'}
                        buttonText={'註冊成為店家用戶'}
                        buttonGoto={'/register/roomowner'}
                    />
                </Grid>
                <Grid item xs={6}>
                    <RegisterType
                        title={'建立普通帳號'}
                        subtitle={'成為普通用戶 你可以...'}
                        feature1icon={<RoomIcon />}
                        feature1={'尋找不同類型的琴房及服務並一站式付款預約'}
                        feature2icon={<TextsmsIcon />}
                        feature2={'預約及使用後到房間頁面留下用後感'}
                        feature3icon={<DateRangeIcon />}
                        feature3={'查詢不同房間服務的有效預約時段'}
                        buttonText={'註冊成為普通用戶'}
                        buttonGoto={'/register/roomfinder'}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Register