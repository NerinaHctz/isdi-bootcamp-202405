import { User } from '../data/models.js'
import { validate, errors } from '../../com/index.js'

const { NotFoundError, SystemError } = errors

export default (userId, newEmail) => {
    validate.string(userId, 'userId')
    validate.string(newEmail, 'email')

    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return User.updateOne({ _id: userId }, { $set: { email: newEmail } })
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(() => { })
}