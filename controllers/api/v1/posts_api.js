
const Post = require('../../../models/post') ;
const Comment = require('../../../models/comment');



module.exports.index = async function(req ,res){

    let posts= await Post.find({})
    .sort('-createdAt')
    .populate('user')

    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
        
    });

    return res.json(200,{
        message : "List of posts",
        posts  : posts
    })
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);

         if (post.user == req.user.id) {
            post.deleteOne();
            // delete all the comments from Comment model posted on this post
            await Comment.deleteMany({ post: req.params.id });
           
          return res.json(200, {
            message:"Post ans associated comments  deleted successfully!"
          })
           
        
        } else {
            return res.json(401, {
                message:'You Can not delete this Post !'
            })
         }

    } catch (error) {
       
        console.log('******', error);
        return res.json(500, {
            message: "internal server Error"
        })
    } 
}