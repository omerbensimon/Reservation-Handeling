const { reservManager } = require('./Reservations');
const logger = require('./log');

function allReservations(req, res) {
  if (req.urlObject.query.admin == 'true') {
    let reservations = reservManager.getAllReservations();
    if (reservations.length === 0) {
      res.writeHeader(403);
      res.end('No reservations');
    }
    else {
      res.writeHeader(200);
      res.end(JSON.stringify(reservations));
    }
  }
  else {
    logger.log("Access denied...");
    res.writeHeader(401);
    res.end("Access denied...");
  }
}

const allLogs = (req, res) => {
  if (req.urlObject.query.admin == 'true') {
    let logs = logger.getLogs();
    if (!logs) {
      res.writeHeader(403);
      res.end('\nNo logs');
    }
    else {
      res.writeHeader(200);
      res.end(JSON.stringify(logs));
    }
  }
  else {
    logger.log("Access denied...");
    res.writeHeader(401);
    res.end("Access denied...");
  }
}

function newReservation(req, res) {
  let body = [];
  req.on('data', chunk => { body += chunk });
  req.on('end', () => {
    const jsonData = JSON.parse(body);
    if (jsonData.name && jsonData.ticketAmount) {
      let result = reservManager.addNewReservation(jsonData.ticketAmount, jsonData.name);
      res.writeHeader(result.status);
      res.end(result.message);
    } else {
      logger.log("Bad input");
      res.writeHeader(400);
      res.end('Bad input');
    }
  })
}
const updateReservation = (req, res) => {
  let body = [];
  req.on('data', chunk => { body += chunk });
  req.on('end', () => {
    const jsonData = JSON.parse(body);
    if (jsonData.name && jsonData.ticketAmount) {
      let result = reservManager.updateSingleReservation(jsonData.ticketAmount, jsonData.name);
      res.writeHeader(result.status);
      res.end(result.message);
    } else {
      res.writeHeader(400);
      res.end('Bad input');
    }
  })
}
const deleteOneReservation = (req, res) => {
  let body = [];
  req.on('data', chunk => { body += chunk });
  req.on('end', () => {
    const jsonData = JSON.parse(body);
    if (jsonData.name && typeof jsonData.name === 'string') {
      let result = reservManager.deleteSingleReservation(jsonData.name);
      res.writeHeader(result.status);
      res.end(result.message);
    } else {
      logger.log('Bad input');
      res.writeHeader(400);
      res.end('Bad input');
    }
  })
}
const deleteReservations = (req, res) => {
  if (req.urlObject.query.admin == 'true') {
    let result = reservManager.deleteAllReservations();
    res.writeHeader(result.status);
    res.end(result.message);
  }
  else {
    logger.log("Access denied...");
    res.writeHeader(401);
    res.end("Access denied...");
  }
}
const errMsg = (req, res) => {
  logger.log('Bad input');
  res.writeHeader(400);
  res.end('Bad input');
}

module.exports = {
  allReservations,
  allLogs,
  newReservation,
  updateReservation,
  deleteOneReservation,
  deleteReservations,
  errMsg,
};