# Increment Integer as a Service

API for IIaaS

## CURL Commands

Register new user:
`curl -d "email=<email>&password=<password>" -X POST https://thinkific-server.herokuapp.com/api/user/register`

Login user:
`curl -d "email=<email>&password=<password>" -X POST https://thinkific-server.herokuapp.com/api/user/login`

A bearer token will return once login is successful
`"Bearer xxxxxxxxxx"`
Please copy this Bearer token (without quotes) to your clipboard

To display current integer
`curl https://thinkific-server.herokuapp.com/api/user/current -H "Authorization: {paste copied Bearer token here}"`
A successful response will be displayed as an object with a key of 'integer' and value of your current integer.

To increment current integer
`curl https://thinkific-server.herokuapp.com/api/user/next -H "Authorization: {paste copied Bearer token here}"`
A successful response will be a string of 'Incremented!'

To reset integer
`curl -X PUT https://thinkific-server.herokuapp.com/api/user/current -X "Authorization: {paste copied Bearer token here}" --data "current={integer}"`

## UI Access

Please go to
`pwrclaire.ca`

### Technologies use

Frontend: React
Backend: Node.js
DB: MongoDB
