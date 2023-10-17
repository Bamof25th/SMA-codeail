const Comment = require('../models/comment');
const commentsMailer = require('../mailers/comments_mailer')
const commentEmailworker = require('../Workers/comment_email_worker')
const queue = require('../config/kue')
const Like = require('../models/like');
const Post = require('../models/post');

module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            
            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function (err) {
                if(err){
                    console.log('error in creatin the queue',err);
                    return;
                }else{
                    console.log( 'jobb enqueued', job.id);
                }
            })
            if (req.xhr){
                
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }
          

            req.flash('success', 'Comment published!');

            res.redirect('back');
        }
    }catch (error) {
        req.flash('error', "Error in Completing the Task in DB");
        console.log(error);
        return res.redirect('back');
    };
    
}



module.exports.destroy = async function(req, res){
    try {
        let comment = await Comment.findById(req.params.id).populate('post', 'id');
        //check if current user is the one who has created this comment or the creator of the post
        if (comment.user == req.user.id || req.user.id == comment.post.user) {
            let postID = comment.post;
            comment.deleteOne(); // delete the comment
            let post = await Post.findByIdAndUpdate(postID, { $pull: { comments: req.params.id } });

            
            
            //delete the likes asssociated with this commment
            await Like.deleteMany({likedModel: comment._id, onModel: 'Comment'});
           
           
           
           
            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment Removed !"
                });
            }
            req.flash('success', "Comment Removed!");
            return res.redirect('back'); // delete the comment from post's document and redirect back
        }
        else {
            req.flash('error', "Unauthorized Activity: Not allowed to delete the comment");
            return res.redirect('back'); // upon failure redirect back w/o doing anything
        }
    } catch (err) {
        req.flash('error', "Comment Removed!");
        
        return res.redirect('back');
    };
}