var config = require('config.json');
var express = require('express');
var router = express.Router();
var apartmentService = require('services/apartment.service');

// routes
router.post('/add', add);
router.get('/', getAll);
router.put('/status/:_id', changeStatus);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function add(req, res) {
  apartmentService.create(req.body)
      .then(function (user) {
          res.status(200).send(user);
      })
      .catch(function (err) {
          var data = {
              "message":err.toString()
          };
          res.status(400).send(data);
      });
}

function getAll(req, res) {
  apartmentService.getAll()
      .then(function (users) {
          res.send(users);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function getById(req, res) {
  apartmentService.getById(req.params._id)
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

function update(req, res) {
  apartmentService.update(req.params._id)
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function changeStatus(req, res) {
    console.log("changing status of: " + req.params._id);
    apartmentService.changeStatus(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
  }

function _delete(req, res) {
  apartmentService.delete(req.params._id)
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}
