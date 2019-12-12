const http = require('http');
const controller = require('./controller');
const port = process.env.PORT || 3000;
const server = http.createServer(controller);
server.listen(port, () => console.log(`listening on port ${port}`));
