const User = require('../dao/models/user.model');
const Products = require('../dao/models/products.model');
const Message = require('../dao/models/messages.model');

class ViewsStorage {
    findUserById(userId) {
        return User.findById(userId).lean();
    }

    findAllProducts() {
        return Products.find().lean();
    }

    findLastMessages() {
        return Message.find().sort({ createdAt: -1 }).limit(10).lean();
    }

    async countDocuments(match){
        return Products.countDocuments(match);
    }

    async find(match, options) {
        const { sort, skip, limit} = options;
        return Products.find(match)
            .sort({_id: sort})
            .skip(skip)
            .limit(limit)
            .lean()
    }
}

module.exports = { ViewsStorage };
