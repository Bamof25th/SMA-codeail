
const Post = require('../models/post');
const Comment = require('../models/comment');



// get the Data of the Post and Store it in postSchema
module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        // on ajax req send the data to views on client side if no error
        if(req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name');
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created !" //with this message
            });
        }
        
        return res.redirect('back'); // upon success redirect back
    } catch (error) {
       
        console.log(error);
        return res.redirect('back');
    }
}



// get the post id from url and delete the post and its comments if the current user is post's creator
module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id) { //check if current user is the one who has created this post
            //delete all the likes associated with this post and also to the comments of this post
            // await Like.deleteMany({likedModel: post, onModel: 'Post'});
            // await Like.deleteMany({_id: {$in: post.comments}});
            post.deleteOne();
            // delete all the comments from Comment model posted on this post
            await Comment.deleteMany({ post: req.params.id });
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted !"
                });
            }
            req.flash('success', "Post and it's comments deleted!");
            return res.redirect('back'); // delete all the comments on the post and redirect back
        }
        else {
            req.flash('error', "Unauthorized Activity: Not allowed to delete the post");
            return res.redirect('back'); // upon failure redirect back w/o doing anything
        }

    } catch (error) {
        req.flash('error', "Error in Deleteing the Comment in DB");
        console.log(error);
        return res.redirect('back');
    } 
}