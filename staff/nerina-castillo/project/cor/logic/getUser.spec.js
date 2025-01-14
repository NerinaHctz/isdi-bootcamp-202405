import 'dotenv/config'
import mongoose, { Types } from 'mongoose'
import { expect } from 'chai'
import getUser from './getUser.js'
import { User } from '../data/models.js'
import errors from '../../com/errors.js'

const { ObjectId } = Types

const { NotFoundError, ValidationError } = errors

describe('getUser', () => {
    before(() => mongoose.connect(process.env.MONGODB_URI))

    beforeEach(() => User.deleteMany())

    it('succeeds on existing user', () =>
        User.create({ name: 'gon', username: 'gonzalo', role: 'user', email: 'gon@zalo.com', password: '123123123' })
            .then(user =>
                User.create({ name: 'julito', username: 'julitocamelas', role: 'user', email: 'julito@camelas.com', password: '123123123' })
                    .then(targetUser =>
                        getUser(user.id, targetUser.id)
                            .then(() => {
                                expect(targetUser.name).to.equal('julito')
                                expect(targetUser.email).to.equal('julito@camelas.com')
                                expect(targetUser.role).to.equal('user')
                                expect(targetUser.username).to.equal('julitocamelas')
                            })
                    )
            )
    )

    it('fails on non-existing user', () => {
        let _error

        return getUser(new ObjectId().toString(), new ObjectId().toString())
            .catch(error => _error = error)
            .finally(() => {
                expect(_error).to.be.instanceOf(NotFoundError)
                expect(_error.message).to.equal('user not found')
            })
    })

    it('fails on non-existing targetUser', () => {
        let _error

        return User.create({ name: 'gon', username: 'gonzalo', role: 'user', email: 'gon@zalo.com', password: '123123123' })
            .then(user => getUser(user.id, new ObjectId().toString()))
            .catch(error => _error = error)
            .finally(() => {
                expect(_error).to.be.instanceOf(NotFoundError)
                expect(_error.message).to.equal('targetUser not found')
            })
    })

    it('fails on non-string userId', () => {
        let error

        try {
            getUser(123, new ObjectId().toString())
        } catch (_error) {
            error = _error
        } finally {
            expect(error).to.be.instanceOf(ValidationError)
            expect(error.message).to.equal('userId is not a string')
        }
    })

    it('fails on non-string targetUserId', () => {
        let error

        try {
            getUser(new ObjectId().toString(), 123)
        } catch (_error) {
            error = _error
        } finally {
            expect(error).to.be.instanceOf(ValidationError)
            expect(error.message).to.equal('targetUserId is not a string')
        }
    })

    afterEach(() => User.deleteMany())

    after(() => mongoose.disconnect())
})