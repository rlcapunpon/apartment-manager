var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongodb = require('mongodb');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('bills');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.getByApartmentId = getByApartmentId;
service.create = create;
service.update = update;
service.changeStatus = changeStatus;
service.delete = _delete;

module.exports = service;

function getAll() {
  var deferred = Q.defer();

  db.bills.find().toArray(function (err, bills) {
      if (err) deferred.reject(err.name + ': ' + err.message);
      deferred.resolve(bills);
  });

  return deferred.promise;
}

function getAllUnpaid() {
    var deferred = Q.defer();
  
    db.bills.find({ "paid": false }).toArray(function (err, bills) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(bills);
    });
  
    return deferred.promise;
  }

function getByApartmentId(apartmentId) {
    var deferred = Q.defer();
  
    db.bills.find({ "apartmentId": apartmentId }).toArray(function (err, bills) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(bills);
    });
  
    return deferred.promise;
  }

function getById(_id) {
    var deferred = Q.defer();

    db.bills.findById(_id, function (err, bill) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (bill) {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(unitParam) {
  var deferred = Q.defer();

  // validation
  db.bills.findOne(
      { name: unitParam.name },
      function (err, unit) {
          if (err) deferred.reject(err.name + ': ' + err.message);

          if (unit) {
              // username already exists
              deferred.reject('Unit "' + unitParam.name + '" already exists');
          } else {
              createUnit();
          }
      });

  function createUnit() {
      db.bills.insert(
        unitParam,
          function (err, doc) {
              if (err) deferred.reject(err.name + ': ' + err.message);
              console.log("Bill successfully added.")
              deferred.resolve(unitParam);
          });
  }

  return deferred.promise;
}

function changeStatus(_id) {
    var deferred = Q.defer();
    var currentStatus;
    var billResolution;
    // validation
    db.bills.findById(mongo.helper.toObjectID(_id), function (err, bill) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        currentStatus = bill.paid;
        console.log("currentStatus: " + currentStatus);
        newStatus = (currentStatus == "true" || currentStatus == true) ? false : true;
        console.log("new status: " + newStatus);
        billResolution = bill;
        billResolution.paid = newStatus;
        updateBill();
    });
  
    function updateBill() {
        // fields to update
        var set = {
            paid: newStatus
        };
  
        console.log("will update: " + mongo.helper.toObjectID(_id))

        db.bills.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
  
                console.log("resolving change status")
                deferred.resolve(billResolution);
            });
    }
  
    return deferred.promise;
}

function update(_id, unitParam) {
  var deferred = Q.defer();

  // validation
  db.bills.findById(mongo.helper.toObjectID(_id), function (err, unit) {
    if (err) deferred.reject(err.name + ': ' + err.message);
     updateBill();
  });

  function updateBill() {
      // fields to update
      var set = {
          type: unitParam.type,
          amount: unitParam.amount,
          remarks: unitParam.remarks
        };

      db.bills.update(
          { _id: mongo.helper.toObjectID(_id) },
          { $set: set },
          function (err, doc) {
              if (err) deferred.reject(err.name + ': ' + err.message);

              deferred.resolve();
          });
  }

  return deferred.promise;
}

function _delete(_id) {
  var deferred = Q.defer();

  db.bills.remove(
      { _id: mongo.helper.toObjectID(_id) },
      function (err) {
          if (err) deferred.reject(err.name + ': ' + err.message);
          deferred.resolve();
      });

  return deferred.promise;
}