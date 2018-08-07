var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/:_id', getById);
router.get('/current', getCurrent);
router.get('/username/:_username', getByUsername);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function authenticate(req, res) {
    console.log("Received an authentication request: " + req.body.username + "/" + req.body.password)
    userService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                console.log("authentication successful")
                res.send(user);
            } else {
                // authentication failed
                console.log("authentication failed")
                var data = {
                    message:"Username or password is incorrect."
                };
                res.status(400).send(data);
            }
        })
        .catch(function (err) {
            var data = {
                "message":err.toString()
            };
            res.status(400).send(data);
        });
}

function register(req, res) {
    console.log("received registration request.");
    console.log("body:" + req.body.firstName)
    userService.create(req.body)
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
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    userService.getById(req.params._id)
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

function getCurrent(req, res) {
    userService.getById(req.user.sub)
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

function getByUsername(req, res) {
    userService.getByUsername(req.params._username)
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
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}