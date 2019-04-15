# Increment Integer as a Service

RESTful API written in Node.js

## cURL Commands

Register new user:
```
curl -d "email=<email>&password=<password>" -X POST https://thinkific-server.herokuapp.com/api/user/register
```
> Example: `curl -d "email=test@gmail.com&password=test123" -X POST https://thinkific-server.herokuapp.com/api/user/register`

Login user:
```
curl -d "email=<email>&password=<password>" -X POST https://thinkific-server.herokuapp.com/api/user/login
```
> Example: `curl -d "email=test@gmail.com&password=test123" -X POST https://thinkific-server.herokuapp.com/api/user/login`

A bearer token will return once login is successful

> Returned value example: {"auth": true, "Authorization": **"Bearer eyJhb******BrNlc"**

Please copy only the Bearer token (with the word Bearer) to your clipboard

To display current integer
```
curl https://thinkific-server.herokuapp.com/api/user/current -H "Authorization: paste copied Bearer token here"
```
> Example: `curl https://thinkific-server.herokuapp.com/api/user/current -H "Authorization: Bearer eyJhb******BrNlc"`

To increment current integer
```
curl https://thinkific-server.herokuapp.com/api/user/next -H "Authorization: paste copied Bearer token here"
```
> Example: `curl https://thinkific-server.herokuapp.com/api/user/next -H "Authorization: Bearer eyJhb******BrNlc"`

To reset integer
```
curl -X PUT https://thinkific-server.herokuapp.com/api/user/current -X "Authorization: paste copied Bearer token here" --data "current={integer}"
```
> Example: `curl -X "PUT" https://thinkific-server.herokuapp.com/api/user/current -H "Authorization: Bearer eyJhb******BrNlc" --data "current=1000"`

## Run Locally

Install node packages using

```
npm install
```

Then run
```
npm start
```

## Web Demo

https://increment-integer.herokuapp.com

### Technologies used

Frontend: [React](https://reactjs.org/)

Backend: [Node.js](https://nodejs.org/en/)

DB: [MongoDB](https://www.mongodb.com/)
