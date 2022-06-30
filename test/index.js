// test/index.js
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { describe, it } = require('mocha');
const app = require('../server');
const agent = chai.request.agent(app);
const should = chai.should();

describe('Posts', function () {
	const newPost = {
		title: 'post title',
		url: 'https://www.google.com',
		summary: 'post summary',
	};
	const user = {
		username: 'poststest',
		password: 'testposts',
	};

	before(function (done) {
		agent
			.post('/sign-up')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send(user)
			.then(function (res) {
				done();
			})
			.catch(function (err) {
				done(err);
			});
	});
	it('should create with valid attributes at POST /posts/new', function (done) {
		Post.estimatedDocumentCount()
			.then(function (initialDocCount) {
				agent
					.post('/posts/new')
					// This line fakes a form post,
					// since we're not actually filling out a form
					.set('content-type', 'application/x-www-form-urlencoded')
					// Make a request to create another
					.send(newPost)
					.then(function (res) {
						Post.estimatedDocumentCount()
							.then(function (newDocCount) {
								// Check that the database has status 200
								res.should.have.status(200);
								// Check that the database has one more post in it
								newDocCount.should.equal(initialDocCount + 1);
								done();
							})
							.catch(function (err) {
								done(err);
							});
					})
					.catch(function (err) {
						done(err);
					});
			})
			.catch(function (err) {
				done(err);
			});
	});
	after(function (done) {
		Post.findOneAndDelete(newPost)
			.then(function () {
				agent.close();

				User.findOneAndDelete({
					username: user.username,
				})
					.then(function () {
						done();
					})
					.catch(function (err) {
						done(err);
					});
			})
			.catch(function (err) {
				done(err);
			});
	});
});
