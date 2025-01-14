import 'dotenv/config'
import mongoose, { Types } from 'mongoose'
import { expect } from 'chai'
import { User, Post } from '../data/models.js'
import errors from '../../com/errors.js'
import deletePost from './deletePost.js'

const { ObjectId } = Types
const { NotFoundError, ValidationError, OwnershipError } = errors

describe('deletePost', () => {
    before(() => mongoose.connect(process.env.MONGODB_URI))

    beforeEach(() => Promise.all([User.deleteMany(), Post.deleteMany()]))

    it('succeeds on delete post', () => {
        return User.create({ name: 'gon', username: 'gonzalo', role: 'user', email: 'gon@zalo.com', password: 'gonzalo123' })
            .then(user =>
                Post.create({ author: user.id, image: 'https://media.giphy.com/media/ji6zzUZwNIuLS/giphy.gif', text: 'hello' })
                    .then(post1 =>
                        Post.create({ author: user.id, image: 'https://media.giphy.com/media/ji6zzUZwNIuLS/giphy.gif', text: 'hello' })
                            .then(post2 =>
                                deletePost(user.id, post1.id)
                                    .then(() => Post.find({}).lean())
                                    .then(posts => {
                                        expect(posts[0].author.toString()).to.equal(post2.author.toString())
                                    })
                            )
                    )
            )
    })

    it('fails on non-existing user', () => {
        let _error

        return Post.create({ author: new ObjectId().toString(), image: 'https://media.giphy.com/media/ji6zzUZwNIuLS/giphy.gif', text: 'hello' })
            .then(post => deletePost(new ObjectId().toString(), post.id))
            .catch(error => _error = error)
            .finally(() => {
                expect(_error).to.be.instanceOf(NotFoundError)
                expect(_error.message).to.equal('user not found')
            })
    })

    it('fails on existing user but non-existing post', () => {
        let _error

        return User.create({ name: 'gon', username: 'gonzalo', role: 'user', email: 'gon@zalo.com', password: 'gonzalo123' })
            .then(user => deletePost(user.id, new ObjectId().toString()))
            .catch(error => _error = error)
            .finally(() => {
                expect(_error).to.be.instanceOf(NotFoundError)
                expect(_error.message).to.equal('post not found')
            })
    })

    it('fails on existing user and post but post does not belong to user', () => {
        let _error

        return User.create({ name: 'gon', username: 'gonzalo', role: 'user', email: 'gon@zalo.com', password: 'gonzalo123' })
            .then(user => {
                return Post.create({ author: new ObjectId(), image: 'https://media.giphy.com/media/ji6zzUZwNIuLS/giphy.gif', text: 'hello' })
                    .then(post => deletePost(user.id, post.id))
                    .catch(error => _error = error)
                    .finally(() => {
                        expect(_error).to.be.instanceOf(OwnershipError)
                        expect(_error.message).to.equal('post does not belong to user')
                    })
            })
    })

    it('fails on non-string userId', () => {
        let error

        try {
            deletePost(123, new ObjectId().toString())
        } catch (_error) {
            error = _error
        } finally {
            expect(error).to.be.instanceOf(ValidationError)
            expect(error.message).to.equal('userId is not a string')
        }
    })

    it('fails on non-string postId', () => {
        let error

        try {
            deletePost(new ObjectId().toString(), 123)
        } catch (_error) {
            error = _error
        } finally {
            expect(error).to.be.instanceOf(ValidationError)
            expect(error.message).to.equal('postId is not a string')
        }
    })

    afterEach(() => Promise.all([User.deleteMany(), Post.deleteMany()]))

    after(() => mongoose.disconnect())
})