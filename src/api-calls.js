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
const cancelBooking = (endpoint) => fetch(`${apiBase}${endpoint}`, {
    method: 'DELETE',
    headers: {
        "Content-Type": "application/json"
    }
})

export { getFetch, cancelBooking };