const roomHelper = [
    {
        title: 'Exit Studio',
        description: '本店環境豪華寬敞，氣氛舒適，免費借用吉他、Bass、鼓棍等樂器。',
        address: {
            street: '旺角花園街2-16號',
            floor: '26',
            flat: '2601',
            building: '好景商業中心',
            region: '九龍'
        },
        openWeekday: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true
        },
        openingTime: 9,
        closingTime: 23,
        images: [
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/brandon-hoogenboom-hI75N5JmpJE-unsplash.jpeg',
                key: 'brandon-hoogenboom-hI75N5JmpJE-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/jesus-hilario-h-5v69Vl62NCM-unsplash.jpeg',
                key: 'jesus-hilario-h-5v69Vl62NCM-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/john-hult-xxgkYSD-ekE-unsplash.jpeg',
                key: 'john-hult-xxgkYSD-ekE-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/lauren-mancke-rm5DbquteoY-unsplash.jpeg',
                key: 'lauren-mancke-rm5DbquteoY-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/luke-southern-OHQDb-l-g1w-unsplash.jpeg',
                key: 'luke-southern-OHQDb-l-g1w-unsplash.jpeg'
            }
        ]
    },
    {
        title: 'Studio before dawn',
        description: 'SBD為對音樂有熱誠的朋友提供一個與優質而舒適的練習環境。',
        address: {
            street: '六合街 25-27號',
            floor: '17',
            flat: 'A1',
            building: '嘉時工廠大廈',
            region: '新蒲崗'
        },
        openWeekday: {
            monday: true,
            tuesday: true,
            wednesday: false,
            thursday: true,
            friday: false,
            saturday: true,
            sunday: true
        },
        openingTime: 22,
        closingTime: 9,
        images: [
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/manuel-nageli-_r0fD1pDQ38-unsplash.jpeg',
                key: 'manuel-nageli-_r0fD1pDQ38-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/norbert-buduczki-BZO2k7sCsWk-unsplash.jpeg',
                key: 'norbert-buduczki-BZO2k7sCsWk-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/obi-onyeador-9FwrfeM2XIY-unsplash.jpeg',
                key: 'obi-onyeador-9FwrfeM2XIY-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/radek-grzybowski-YU6A5I_IjTw-unsplash.jpeg',
                key: 'radek-grzybowski-YU6A5I_IjTw-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/rodrigo-ruiz-rM5ZHrQvUCc-unsplash.jpeg',
                key: 'rodrigo-ruiz-rM5ZHrQvUCc-unsplash.jpeg'
            }
        ]
    },
    {
        title: 'Moon Studio',
        description: '本店誠意為熱愛音樂的人士提供 Band 房及鼓房租用服務，band房內設備專業齊全，地方豪華寬敞舒適，免費借用結他及低音結他等樂器，並提供咪套，乾淨衛生，歡迎親臨參觀比較。',
        address: {
            street: '太子道西141號',
            floor: '7',
            flat: 'C',
            building: '長榮大廈',
            region: '旺角'
        },
        openWeekday: {
            monday: false,
            tuesday: false,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true
        },
        openingTime: 3,
        closingTime: 9,
        images: [
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/thanos-pal-0i-pxhRRhDU-unsplash.jpeg',
                key: 'thanos-pal-0i-pxhRRhDU-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/the-creative-exchange-ai4lpAIt7EU-unsplash.jpeg',
                key: 'the-creative-exchange-ai4lpAIt7EU-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/wan-san-yip-uWBKWeuEwAE-unsplash.jpeg',
                key: 'wan-san-yip-uWBKWeuEwAE-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/wes-hicks-MEL-jJnm7RQ-unsplash.jpeg',
                key: 'wes-hicks-MEL-jJnm7RQ-unsplash.jpeg'
            },
            {
                url: 'https://practice-room-rental.s3.ap-northeast-1.amazonaws.com/yukko-tovarnajnyn-lfZzrFRcafg-unsplash.jpeg',
                key: 'yukko-tovarnajnyn-lfZzrFRcafg-unsplash.jpeg'
            }
        ]
    }
]

module.exports = roomHelper