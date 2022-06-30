const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports = (app) => {
	app.get('/', (req, res) => {
		const currentUser = req.user;
		Post.find({})
			.lean()
			.populate('author')
			.then((posts) => res.render('posts-index', { posts, currentUser }))
			.catch((err) => {
				console.log(err.message);
			});
	});
	// Create
	app.get('/posts/new', (req, res) => {
		var currentUser = req.user;
		console.log('Loading posts-new');
		res.render('posts-new', { currentUser });
	});

	app.post('/posts/new', (req, res) => {
		if (req.user) {
			const post = new Post(req.body);
			console.log(post);
			const userId = req.user._id;
			console.log(userId);
			post.author = userId;
			post
				.save()
				.then(() => User.findById(userId))
				.then((user) => {
					user.posts.unshift(post);
					user.save();
					// REDIRECT TO THE NEW POST
					return res.redirect(`/posts/${post._id}`);
				})
				.catch((err) => {
					console.log(err.message);
				});
		} else {
			return res.status(401);
		}
	});

	app.get('/posts/:id', (req, res) => {
		const currentUser = req.user;
		Post.findById(req.params.id)
			.populate('comments')
			.lean()
			.then((post) => res.render('posts-show', { post, currentUser }))
			.catch((err) => {
				console.log(err.message);
			});
	});
	app.get('/n/:subreddit', (req, res) => {
		const currentUser = req.user;
		const { subreddit } = req.params;
		Post.find({ subreddit })
			.lean()
			.populate('author')
			.then((posts) => res.render('posts-index', { posts, currentUser }))
			.catch((err) => {
				console.log(err);
			});
	});
};

// -----
