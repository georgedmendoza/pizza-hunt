const { Pizza } = require('../models');

const pizzaController = {
    // the functions will go in here as methods
    // get all pizzas
    getAllPizza(req,res) {
        Pizza.find({})
            // to get the actual comment and not just the id
            .populate({
                path: 'comments',
                // minus sign indicates to not be returned
                select: '-__v'
            })
            // doesn't include v field of pizza
            .select('-__v')
            // return by newest pizza
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one pizza by id
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                // minus sign indicates to not be returned
                select: '-__v'
            })
            // doesn't include v field of pizza
            .select('-__v')
            .then(dbPizzaData => {
                // If no pizza is found, send 404
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // createPizza
    createPizza({ body}, res) {
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
    },

    // updaate pizza by id
    updatePizza({ params, body }, res) {
        // new: true returns the new version of the document
        // runValidators: true when updatting data it validates the new info being entered
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = pizzaController;