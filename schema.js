const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : String,
    email : {type : String , unique : true},
    password : string,
    createdAt : {type: Date  , default :Date.now()}
});

const userModel = mongoose.model('userModel', userSchema);

const postSchema = new Schema({
    title : String,
    content : String,
    owner : {
        type:mongoose.Schema.Types.ObjectId,
        ref : "userModel"
    },
    tags : {
        type : [String],
        default : [],
    },
    imageUrl : String,
    likeCount : {type : Number ,default : 0},
    createdAt : {type: Date  , default :Date.now()},
    updatedAt : {type: Date  , default :Date.now()}
});

const postModel = mongoose.model('postModel',postSchema);

const commentSchema = new Schema({
    content : String,
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'postModel'
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userModel'
    },
    createdAt : {type: Date  , default :Date.now()}
})

const commentModel = mongoose.model('commentmModel', commentSchema);


const likeSchema = new Schema ({
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'postModel'
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userModel'
    },
    createdAt : {type: Date  , default :Date.now()}
})

const likeModel = mongoose.model('likeModel',likeSchema);

module.exports = {
    userModel,
    postModel,
    commentModel,
    likeModel
}