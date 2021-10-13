const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        required: true,
        trim: true
    },
    createdBy : {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        enum: ['Personal','Small','Large','Extra Large'],
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            type: Schema.Types.ObjectId,
            // ref tells which documents to search to find right comments
            ref: 'Comment'
        }
    ]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
}
);

// get total cont of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    // reduce(accumulator, currentValue). Reduce is use to keep track
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
})

// create the Pizza mode using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;