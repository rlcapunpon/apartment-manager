var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongodb = require('mongodb');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('tenant');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.getByApartmentId = getByApartmentId;
service.changeStatus = changeStatus;
service.delete = _delete;

module.exports = service;

function getAll() {
  var deferred = Q.defer();

  db.tenant.find().toArray(function (err, tenants) {
      if (err) deferred.reject(err.name + ': ' + err.message);
      deferred.resolve(tenants);
  });

  return deferred.promise;
}

function getByApartmentId(apartmentId) {
    var deferred = Q.defer();
  
    db.tenant.find({ "apartmentId": apartmentId }).toArray(function (err, tenants) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(tenants);
    });
  
    return deferred.promise;
  }

function getById(_id) {
    var deferred = Q.defer();

    db.tenant.findById(_id, function (err, tenant) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (tenant) {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(tenantParam) {
  var deferred = Q.defer();

  // validation
  db.tenant.findOne(
      { name: tenantParam.name },
      function (err, unit) {
          if (err) deferred.reject(err.name + ': ' + err.message);

          if (unit) {
              // username already exists
              deferred.reject('Tenant "' + tenantParam.name + '" already exists');
          } else {
              createUnit();
          }
      });

  function createUnit() {
      db.tenant.insert(
        tenantParam,
          function (err, doc) {
              if (err) deferred.reject(err.name + ': ' + err.message);
              console.log("Tenant successfully added.")
              deferred.resolve(tenantParam);
          });
  }

  return deferred.promise;
}

function changeStatus(_id) {
    var deferred = Q.defer();
    var currentStatus;
    var statusResolution;
    // validation
    db.tenant.findById(mongo.helper.toObjectID(_id), function (err, tenant) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        currentStatus = tenant.inhouse;
        console.log("currentStatus: " + currentStatus);
        newStatus = (currentStatus == "true" || currentStatus == true) ? false : true;
        console.log("new status: " + newStatus);
        statusResolution = tenant;
        statusResolution.inhouse = newStatus;
        updateUnit();
    });
  
    function updateUnit() {
        // fields to update
        var set = {
            inhouse: newStatus
        };
  
        console.log("will update: " + mongo.helper.toObjectID(_id))

        db.tenant.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
  
                console.log("resolving change status")
                deferred.resolve(statusResolution);
            });
    }
  
    return deferred.promise;
  }

function update(_id, tenantParam) {
  var deferred = Q.defer();

  // validation
  db.tenant.findById(mongo.helper.toObjectID(_id), function (err, unit) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      if (unit.name !== tenantParam.name) {
          // username has changed so check if the new username is already taken
          db.tenant.findOne(
              { name: tenantParam.name },
              function (err, unit) {
                  if (err) deferred.reject(err.name + ': ' + err.message);

                  if (unit) {
                      // username already exists
                      deferred.reject('Tenant "' + tenantParam.name + '" already exists')
                  } else {
                      updateTenant();
                  }
              });
      } else {
          updateTenant();
      }
  });

  function updateTenant() {
      // fields to update
      var set = {
          name: tenantParam.name,
          contact: tenantParam.contact,
          headcount: tenantParam.headcount,
          email: tenantParam.email,
          inhouse: tenantParam.inhouse
      };

      db.tenant.update(
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

  db.tenant.remove(
      { _id: mongo.helper.toObjectID(_id) },
      function (err) {
          if (err) deferred.reject(err.name + ': ' + err.message);
          deferred.resolve();
      });

  return deferred.promise;
}