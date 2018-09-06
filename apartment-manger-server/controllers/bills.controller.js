var config = require('config.json');
var express = require('express');
var router = express.Router();
var billsService = require('services/bills.service');

// routes
router.post('/add', add);
router.get('/', getAll);
router.get('/apartment/:_id', getByApartmentId)
router.put('/status/:_id', changeStatus);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function add(req, res) {
  billsService.create(req.body)
      .then(function (bill) {
          res.status(200).send(bill);
      })
      .catch(function (err) {
          var data = {
              "message":err.toString()
          };
          res.status(400).send(data);
      });
}

function getAll(req, res) {
  billsService.getAll()
      .then(function (bills) {
          res.send(bills);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function getById(req, res) {
  billsService.getById(req.params._id)
      .then(function (bill) {
          if (bill) {
              res.send(bill);
          } else {
              res.sendStatus(404);
          }
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function getByApartmentId(req, res) {
    billsService.getByApartmentId(req.params._id)
        .then(function (bills) {
            res.send(bills);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
  }

function update(req, res) {
  billsService.update(req.params._id)
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function changeStatus(req, res) {
    console.log("changing status of: " + req.params._id);
    billsService.changeStatus(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
  }

function _delete(req, res) {
  billsService.delete(req.params._id)
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}
