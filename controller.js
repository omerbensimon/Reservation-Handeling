const url = require('url');
const logger = require('./log');
const { allReservations, allLogs, newReservation, updateReservation, deleteOneReservation, deleteReservations, errMsg } = require('./handlers');

module.exports = (req, res) => {
  logger.log(`Request ${req.method} came from ${req.url}`);
  const urlObject = url.parse(req.url, true, false);
  req.urlObject = urlObject;
  switch (req.method) {
    case 'GET'://admin only
      if (urlObject.path.startsWith('/allReservations')) {
        allReservations(req, res);
      }
      if (urlObject.path.startsWith('/allLogs')) {
        allLogs(req, res);
      }
      break;
    case 'POST':
      if (urlObject.path.startsWith('/newReservation')) {
        newReservation(req, res);
      }
      break;
    case 'PUT':
      if (urlObject.path.startsWith('/updateReservation')) {
        updateReservation(req, res);
      }
      break;
    case 'DELETE':
      if (urlObject.path.startsWith('/deleteOneReservation')) {
        deleteOneReservation(req, res);
      }
      if (urlObject.path.startsWith('/deleteReservations')) {//admin only
        deleteReservations(req, res);
      }
      break;
    default:
      errMsg(req, res);
  }
};
