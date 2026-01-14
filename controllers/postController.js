const {userModel} = require('../schema');
const {postModel} = require('../schema');

//create post
export const createPost = async (req,res) =>{
    const {content,tags , imageUrl } = req.body;

    await postModel.create({
        content : content,
        tage : tags,
        imageUrl : imageUrl
    })

    res.json({
        message : "post added"
    })
}

//get posts / render posts public
export const renderPost = async (req,res) =>{
    const posts = await postModel.find();
    if(!posts){
        return res.json({
            error : "no posts by you"
        })
    }

    res.json({
        posts
    })
}

//get post by id 
export const renderbyId = async (req,res) =>{
    const postId = req.params.id;
    const posts  = await postModel.findById(postId);

    res.json({
        posts
    })
}

//update post
export const updatePost = async (req,res) =>{
    const postId = req.body.id;
    const userId = req.userId;

    //get post 
    const post = await findById(postId);
    if(!post){
        return res.json({
            error : 'post is not available'
        })
    }

    //check if post owner is same as userid
    if(post.owner.toString() !== userId){
        return res.json({
            error: 'only owner can update or modify the post'
        })
    }

    //get body for modifying existing post
    const {title,content , tags, imageUrl} = req.body;

    if(title) post.title = title;
    if(content) post.content = content;
    if(tags) post.tags = tags;
    if(imageUrl) post.imageUrl = imageUrl;

    await post.save();
    
    res.json({
        message : 'post updated',
        post : post
    })
}

//delete post
export const deletePost = async (req,res)=>{
    const postid = req.params.body;
    await postModel.findByIdAndDelete(id);
    res.json({
        message : 'post deleted successfully'
    })
}



