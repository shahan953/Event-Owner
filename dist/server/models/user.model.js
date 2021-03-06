'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.userCrud = exports.userModel = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseUniqueValidator = require('mongoose-unique-validator');

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _bcryptjs = require('bcryptjs');

var _crud = require('../config/crud');

var _crud2 = _interopRequireDefault(_crud);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = new _mongoose2.default.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    personal_id: {
        type: String
    },
    acc_type: {
        type: String,
        default: 'ordinary'
    },
    profile_picture: {
        type: String
    },
    events: [{
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: 'eventModel'
    }],
    gifts: [{
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: 'paymentModel'
    }],
    categories: [{
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: 'categoriesModel'
    }],
    withdrawn: [{
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: 'withdrawalModel'
    }],
    social: {
        facebook: {
            id: String,
            token: String
        },
        google: {
            id: String,
            token: String
        },
        twitter: {
            id: String,
            token: String
        }
    },
    affiliate_event: [{
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: 'eventModel'
    }]
});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = this._hashPassword(this.password);
        return next();
    }
    return next();
});
userSchema.methods = {
    _hashPassword: function _hashPassword(password) {
        return (0, _bcryptjs.hashSync)(password);
    },
    isAuthenticated: function isAuthenticated(password) {
        return (0, _bcryptjs.compareSync)(password, this.password);
    },
    createToken: function createToken() {
        return _jsonwebtoken2.default.sign({
            _id: this._id,
            accType: this.acc_type,
            username: this.username || ''
        }, _config2.default.secret);
    },
    toAuthJSON: function toAuthJSON() {
        return {
            success: true,
            accType: this.acc_type,
            username: this.username,
            token: 'JWT ' + this.createToken()
        };
    },
    netBalance: function netBalance() {
        var total = 0;
        this.gifts.map(function (gift) {
            if (gift.gift_amount) {
                total += gift.gift_amount;
            }
        });
        return total;
    }

    // toJSON() {
    //     return {
    //         _id: this._id,
    //         username: this.username,
    //     }
    // }

};

userSchema.plugin(_mongooseUniqueValidator2.default);
userSchema.plugin(_mongooseTimestamp2.default);

var userModel = _mongoose2.default.model('userModel', userSchema);
var userCrud = new _crud2.default(userModel);

exports.userModel = userModel;
exports.userCrud = userCrud;