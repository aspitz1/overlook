// http://localhost:3001/api/v1/customers <-- GET all customers
// http://localhost:3001/api/v1/customers/<id> <-- GET single customer
// http://localhost:3001/api/v1/rooms <-- GET all rooms
// http://localhost:3001/api/v1/bookings <-- GET all bookings
// http://localhost:3001/api/v1/bookings <-- POST booking ex: { "userID": 48, "date": "2019/09/23", "roomNumber": 4 }
// http://localhost:3001/api/v1/bookings/<id> <-- DELETE booking
/*
{
"Content-Type": "application/json"
}
 */

const apiBase = 'http://localhost:3001/api/v1/';

const getFetch = (endpoint) => fetch(`${apiBase}${endpoint}`).then(response => response.json());
const cancelBooking = (id) => fetch(`${apiBase}bookings/${id}`, {
    method: 'DELETE',
    headers: {
        "Content-Type": "application/json"
    }
});

const postBooking = (booking) => fetch(`${apiBase}bookings`, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(booking)
})
.then(response => {
    if (!response.ok) {
        throw 'Sorry, something went wrong. Looks like we where unable to make your booking.'
    }
    return response.json()
})

export { getFetch, cancelBooking, postBooking };