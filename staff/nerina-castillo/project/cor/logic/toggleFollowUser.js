import { User } from '../data/models.js'
import { validate, errors } from '../../com/index.js'

const { NotFoundError, SystemError } = errors

export default (userId, targetUserId) => {
    validate.string(userId, 'userId')
    validate.string(targetUserId, 'targetUserId')

    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError('user not found')

            return User.findById(targetUserId).lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(targetUser => {
                    if (!targetUser) throw new NotFoundError('targetUser not found')

                    const { following } = user

                    const index = following.findIndex(userObjectId => userObjectId.toString() === targetUserId)

                    if (index < 0)
                        following.push(targetUserId)
                    else
                        following.splice(index, 1)

                    return User.updateOne({ _id: userId }, { $set: { following } })
                        .catch(error => { throw new SystemError(error.message) })
                })
        })
        .then(() => { })
}