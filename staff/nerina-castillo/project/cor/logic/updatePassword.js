import bcrypt from 'bcryptjs'
import { User } from '../data/models.js'
import { validate, errors } from '../../com/index.js'

const { NotFoundError, CredentialsError, SystemError } = errors

export default (userId, oldPassword, newPassword, newPasswordRepeat) => {
    validate.string(userId, 'userId')
    validate.password(oldPassword, 'oldPassword')
    validate.password(newPassword, 'newPassword')
    validate.password(newPasswordRepeat, 'newPasswordRepeat')

    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            if (newPassword !== newPasswordRepeat) throw new CredentialsError('passwords do not match')

            return bcrypt.compare(oldPassword, user.password)
                .catch(error => { throw new SystemError(error.message) })
                .then(match => {
                    if (!match) throw new CredentialsError('wrong password')

                    return bcrypt.hash(newPassword, 8)
                        .catch(error => { throw new SystemError(error.message) })
                        .then(hash => {
                            return User.updateOne({ _id: userId }, { $set: { password: hash } })
                                .catch(error => { throw new SystemError(error.message) })
                        })
                })
        })
}