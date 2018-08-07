var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongodb = require('mongodb');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('apartment');

var service = {};

service.getAll = getAll;
// service.getById = getById;
service.create = create;
service.update = update;
service.changeStatus = changeStatus;
service.delete = _delete;

module.exports = service;

function getAll() {
  var deferred = Q.defer();

  db.apartment.find().toArray(function (err, apartments) {
      if (err) deferred.reject(err.name + ': ' + err.message);
      deferred.resolve(apartments);
  });

  return deferred.promise;
}

function create(unitParam) {
  var deferred = Q.defer();

  // validation
  db.apartment.findOne(
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
      db.apartment.insert(
        unitParam,
          function (err, doc) {
              if (err) deferred.reject(err.name + ': ' + err.message);
              console.log("Apartment successfully added.")
              deferred.resolve(unitParam);
          });
  }

  return deferred.promise;
}

function changeStatus(_id) {
    var deferred = Q.defer();
    var currentStatus;
    var unitResolution;
    // validation
    db.apartment.findById(mongo.helper.toObjectID(_id), function (err, unit) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        currentStatus = unit.occupied;
        console.log("currentStatus: " + currentStatus);
        newStatus = (currentStatus == "true" || currentStatus == true) ? false : true;
        console.log("new status: " + newStatus);
        unitResolution = unit;
        unitResolution.occupied = newStatus;
        updateUnit();
    });
  
    function updateUnit() {
        // fields to update
        var set = {
            occupied: newStatus
        };
  
        console.log("will update: " + mongo.helper.toObjectID(_id))

        db.apartment.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
  
                console.log("resolving change status")
                deferred.resolve(unitResolution);
            });
    }
  
    return deferred.promise;
  }

function update(_id, unitParam) {
  var deferred = Q.defer();

  // validation
  db.apartment.findById(mongo.helper.toObjectID(_id), function (err, unit) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      if (unit.name !== unitParam.name) {
          // username has changed so check if the new username is already taken
          db.apartment.findOne(
              { name: unitParam.name },
              function (err, unit) {
                  if (err) deferred.reject(err.name + ': ' + err.message);

                  if (unit) {
                      // username already exists
                      deferred.reject('Unit "' + unitParam.name + '" already exists')
                  } else {
                      updateUnit();
                  }
              });
      } else {
          updateUnit();
      }
  });

  function updateUnit() {
      // fields to update
      var set = {
          name: unitParam.name,
          rate: unitParam.rate,
          details: unitParam.details,
          occupied: unitParam.occupied,
          diplayPhotoLink: unitParam.diplayPhotoLink
      };

      db.apartment.update(
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

  db.apartment.remove(
      { _id: mongo.helper.toObjectID(_id) },
      function (err) {
          if (err) deferred.reject(err.name + ': ' + err.message);
          deferred.resolve();
      });

  return deferred.promise;
}