
const Post = require('../models/post');



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