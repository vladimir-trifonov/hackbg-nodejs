/*global db*/
'use strict';

function setupRoutes(app) {

    app.get('/db/:id', function(req, res, next) {
        var id = req.params.id;

        db.getById(id, function(err, item) {
            if (err) {
                if (err === 'Item not found') {
                    res.status(404).send({
                        Error: err
                    });
                } else {
                    next(err);
                }
            } else {
                res.status(200).send({
                    Result: item
                });
            }
        });
    });

    app.get('/db', function(req, res, next) {
        db.getAll(function(err, items) {
            if (err) {
                next(err);
            } else {
                res.status(200).send({
                    Result: items
                });
            }
        });
    });

    app.post('/db', function(req, res, next) {
        var item = req.body;
        db.addItem(item, function(err, createdItem) {

            if (err) {
                if (err === 'Item with the same id already exists') {
                    res.status(400).send({
                        Error: err
                    });
                } else {
                    next(err);
                }
            } else {
                res.status(201).send({
                    Result: createdItem
                });
            }
        });
    });

    app.post('/db/:id', function(req, res, next) {
        var id = req.params.id;
        var item = req.body;

        db.updateById(id, item, function(err, updatedItem) {
            if (err) {
                if (err === 'Item not found') {
                    res.status(404).send({
                        Error: err
                    });
                } else {
                    next(err);
                }
            } else {
                res.status(200).send({
                    Result: updatedItem
                });
            }
        });
    });

    app.delete('/db', function(req, res, next) {
        db.deleteAll(function(deletedItemsCount) {
            res.status(200).send({
                Result: deletedItemsCount
            });
        });
    });

    app.delete('/db/:id', function(req, res, next) {
        var id = req.params.id;

        db.deleteById(id, function(err, deletedItem) {
            if (err) {
                if (err === 'Item not found') {
                    res.status(404).send({
                        Error: err
                    });
                } else {
                    next(err);
                }
            } else {
                res.status(200).send({
                    Result: deletedItem
                });
            }
        });
    });
};

module.exports = {
    setup: setupRoutes
};