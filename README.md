# [Sxuan.ch](https://sxuan.ch)
Sxuanch is an online multiplayer Cards Against Humanity simulator created with Node.js, Express, React, and Socket.io.


## Setup
1. Download the full card database from [here](http://www.crhallberg.com/cah/), and place the JSON file in the resources folder.
2. Type `npm install` to install the necessary dependencies.
3. See [Running](#running)


## Running
Type `npm start` to launch the server on ports 80 (redirects to 443) and 443 (secure).


## Custom Configuration
### Custom API Routes

Routes to be added to the API (available at `/api/{route}`) can be either placed in the routes or secure routes folder, and must export an array formatted like this: `[function(req,res){},'get','/url']`. Additionally routes must also be listed in the accompanying map.js file to be required automatically. Routes in the secure routes folder will automatically ensure the user provides a valid session with their request.
