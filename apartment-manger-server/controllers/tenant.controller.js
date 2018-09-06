var config = require('config.json');
var express = require('express');
var router = express.Router();
var tenantService = require('services/tenant.service');

// routes
router.post('/add', add);
router.get('/', getAll);
router.get('/id/:_id', getById);
router.put('/:_id', update);
router.get('/apartment/:_id', getByApartmentId)
router.delete('/:_id', _delete);

module.exports = router;

function add(req, res) {
  tenantService.create(req.body)
      .then(function (tenant) {
          res.status(200).send(tenant);
      })
      .catch(function (err) {
          var data = {
              "message":err.toString()
          };
          res.status(400).send(data);
      });
}

function getAll(req, res) {
  tenantService.getAll()
      .then(function (tenants) {
          res.send(tenants);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function getById(req, res) {
  tenantService.getById(req.params._id)
      .then(function (user) {
          if (user) {
              res.send(user);
          } else {
              res.sendStatus(404);
          }
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function getByApartmentId(req, res) {
    tenantService.getByApartmentId(req.params._id)
        .then(function (bills) {
            res.send(bills);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
  }

function update(req, res) {
  tenantService.update(req.params._id)
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function _delete(req, res) {
  tenantService.delete(req.params._id)
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}
