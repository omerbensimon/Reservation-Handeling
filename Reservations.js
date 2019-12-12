const { EventEmitter } = require('events');
const Moment = require('moment');
const logger = require('./log');


var IDcounter = 1;
const MAX_T = 10;
class Reservation {
  constructor(orderId, amountsOfTickets, buyersName) {
    this.date = new Moment().format('MMMM Do YYYY, h:mm:ss a');
    this.updateDate = new Moment().format('MMMM Do YYYY, h:mm:ss a');
    this.amountsOfTickets = amountsOfTickets;
    this.buyersName = buyersName;
    this.orderId = orderId;
  }
}
class ReservationManager extends EventEmitter {
  constructor() {
    super();
    this.orderList = [];
    this.stock = 0;
  }

  addNewReservation(amountsOfTickets, buyersName) {
    amountsOfTickets = parseInt(amountsOfTickets);
    for (var i = 0; i < this.orderList.length; i++) {
      if (this.orderList[i].buyersName === buyersName) {
        this.emit('DisplayError', "User already placed an order");
        return { "status": 404, "message": "User already placed an order" };
      }
    }
    if (this.stock + amountsOfTickets > MAX_T) {
      this.emit('DisplayError', "No tickets left");
      return { "status": 403, "message": "No tickets left" };
    }
    else {
      this.emit('newReservation', { amountsOfTickets: amountsOfTickets, buyersName: buyersName, orderId: IDcounter });
      IDcounter++;
      this.stock += amountsOfTickets;
      logger.log("Reservation added successfully!");
      return { "status": 200, "message": "Reservation added successfully!" };
    }
  }
  getAllReservations() {
    if (this.orderList.length == 0) {
      this.emit('DisplayError', "No reservations yet");
    }
    else {
      this.emit('getAllReservations');
    }
    return this.orderList;
  }
  updateSingleReservation(amountsOfTickets, buyersName) {
    var index;
    for (var i = 0; i < this.orderList.length; i++) {
      if (this.orderList[i].buyersName === buyersName) {
        index = i;
      }
    }
    if (index === undefined) {
      this.emit('DisplayError', "No such reservation");
      return { "status": 404, "message": "No reservations" };
    }
    if (this.stock + amountsOfTickets - this.orderList[index].amountsOfTickets > MAX_T) {
      this.emit('DisplayError', "Out of tickets");
      return { "status": 410, "message": "Out of tickets" };
    }
    else {
      var oldTicketsCount = this.orderList[index].amountsOfTickets;
      console.log(this.stock + amountsOfTickets - this.orderList[index].amountsOfTickets);
      this.emit('updateSingleReservation', { amountsOfTickets: amountsOfTickets, index: index });
      this.stock += amountsOfTickets - oldTicketsCount;
      logger.log('Order modified successfully!');
      return { "status": 200, "message": "Order modified successfully" };
    }
  }
  deleteSingleReservation(buyersName) {
    for (var i = 0; i < this.orderList.length; i++) {
      if (this.orderList[i].buyersName === buyersName) {
        var ticketsCount = this.orderList[i].amountsOfTickets;
        this.emit('deleteSingleReservation', i);
        this.stock -= ticketsCount;
        logger.log(`Order of ${ticketsCount} tickets deleted successfully`);
        return { "status": 200, "message": `Order of ${ticketsCount} tickets deleted successfully` };
      }
    }
    this.emit('DisplayError', "Order not found");
    return { "status": 404, "message": "Order not found" };
  }
  deleteAllReservations() {
    if (this.orderList.length == 0) {
      this.emit('DisplayError', "No reservations to delete");
      return { "status": 404, "message": "No reservations to delete" };
    }
    else {
      this.emit('deleteAllReservations');
      logger.log("Deleted all reservations");
      return { "status": 200, "message": "Deleted all reservations" };
    }
  }
}

var reservManager = new ReservationManager();

reservManager.on('DisplayError', (data) => {
  logger.log(data);
});

reservManager.on('updateSingleReservation', (data) => {
  var res = reservManager.orderList[data.index];
  res.updateDate = new Moment().format('MMMM Do YYYY, h:mm:ss a');
  res.amountsOfTickets = data.amountsOfTickets;
});
reservManager.on('getAllReservations', () => {
  logger.log(reservManager.orderList);
});
reservManager.on('deleteAllReservations', () => {
  reservManager.orderList = [];
  reservManager.stock = 0;
  IDcounter = 1;
});
reservManager.on('deleteSingleReservation', (index) => {
  let order = reservManager.orderList.splice(index, 1);
  logger.log(`Order ID ${order[0].orderId} was deleted`);
});
reservManager.on('newReservation', (data) => {
  var newRes = new Reservation(data.orderId, data.amountsOfTickets, data.buyersName);
  reservManager.orderList.push(newRes);
  logger.log(`added new reservation for ${data.buyersName}`);
});
module.exports = {
  reservManager
}
