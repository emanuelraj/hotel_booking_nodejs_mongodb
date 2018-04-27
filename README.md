# hotel_booking_nodejs_mongodb

Endpoints

1. POST - /auth/register - To Register as User
{ name : "Allen", email_id : "raj@gmail.com", password : "password" }

2. POST - /auth/login - Login as user and perform search operation
{ email_id : "raj@gmail.com", password : "password" }

3. POST - /hotel/search - Search for hotels by Name, City, Price and Date Range
{ name: 'Rot', city: 'cai', price: '$50:$200', availability: '04-12-2020:20-12-2020' }

4. POST - /hotel/sort - Sort hotel by Name and Price, if the user is an Admin User
{ sort_by: 'name/price' }

5. GET - /user/getUserDetails - Get all user details, if the user is an Admin User 

6. POST - /user/makeAdmin - Add privilage to any user and make them Admin User.
{ to_be_updated_user_id: 'YOUSER_ID' }
