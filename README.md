# mern-booking-app

There are 2 types of end-users: Owner and Finder

What the owner is capable of:
- Create/Delete/Update room with the user-selected opening time and closing time, which day of the week to be closed on, to constrain the availability on the booking table.
- Create/Delete/Update services for each room with name, pricing, and description.
- Read booked timeslot of each service of the corresponding room on a calendar view.
- Search for a specific booking invoice to confirm booking upon appointment.
- Receive payments from Finders using Stripe Connect.

What the Finder is capable of:
- Select up to 5 timeslots (an hour interval) each time during the making of appointments.
- Make payment to owners using Stripe Connect.
- Read the record of transaction with details of invoice number, room, service, total amount, and purchased timeslots
- Create comments on rooms

Technologies used: 
React, Express, Node, Mongoose, MongoDB, Stripe SDK, JWT, multer/multer s3

To run this locally:

clone and run 'npm install', 'npm start' to run React in dev, 'npm run server' to run the server.
