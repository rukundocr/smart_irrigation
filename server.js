
// define thhp server 
const http = require ("http");
//import app.js file 
const app = require ("./app")

// defining port 
const port = process.env.PORT || 4000; 
const server = http.createServer(app);

server.listen(port, () => console.log (`server listening on port ${port} as well`));