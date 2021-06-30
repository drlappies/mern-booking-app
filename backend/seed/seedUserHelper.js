const userHelper = [
    {
        username: 'roomfinder',
        password: 'roomfinder',
        contactNumber: '98765543',
        fullName: {
            firstName: 'Finder',
            lastName: 'Wong',
        },
        isRoomOwner: false,
        isAdmin: false,
    },
    {
        username: 'roomowner',
        password: 'roomowner',
        contactNumber: '12345678',
        fullName: {
            firstName: 'Onwer',
            lastName: 'Chan',
        },
        isRoomOwner: true,
        isAdmin: false,
        ownedRooms: []
    },
    {
        username: 'admin',
        password: 'admin',
        contactNumber: '34532534',
        fullName: {
            firstName: 'Admin',
            lastName: 'Admin',
        },
        isRoomOwner: false,
        isAdmin: true,
    }
]

module.exports = userHelper