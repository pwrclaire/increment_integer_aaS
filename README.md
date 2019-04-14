# Increment Integer as a Service

API for IIaaS

## CURL Commands
> *Note: If you are using Windows, please make sure you have curl installed.*

Register new user:
```
curl -d "email=<email>&password=<password>" -X POST https://thinkific-server.herokuapp.com/api/user/register
```

Login user:
```
curl -d "email=<email>&password=<password>" -X POST https://thinkific-server.herokuapp.com/api/user/login
```

A bearer token will return once login is successful

> auth: true, Authorization: **Bearer xxxxxxxxxx**

Please copy only the Bearer token (with the word Bearer) to your clipboard

To display current integer
```
curl https://thinkific-server.herokuapp.com/api/user/current -H "Authorization: paste copied Bearer token here"
```

To increment current integer
```
curl https://thinkific-server.herokuapp.com/api/user/next -H "Authorization: paste copied Bearer token here"
```

To reset integer
```
curl -X PUT https://thinkific-server.herokuapp.com/api/user/current -X "Authorization: paste copied Bearer token here" --data "current={integer}"
```

## IIaaS Webiste

https://increment-integer.herokuapp.com

### Technologies used

Frontend: React

Backend: Node.js

DB: MongoDB
