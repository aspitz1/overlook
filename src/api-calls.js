// http://localhost:3001/api/v1/customers <-- GET all customers
// http://localhost:3001/api/v1/customers/<id> <-- GET single customer
// http://localhost:3001/api/v1/rooms <-- GET all rooms
// http://localhost:3001/api/v1/bookings <-- GET all bookings
// http://localhost:3001/api/v1/bookings <-- POST booking ex: { "userID": 48, "date": "2019/09/23", "roomNumber": 4 }
// http://localhost:3001/api/v1/bookings/<id> <-- DELETE booking

const apiBase = 'http://localhost:3001/api/v1/';

const getFetch = (endpoint) => fetch(`${apiBase}${endpoint}`).then(response => response.json());

export default getFetch;