import { User } from '../../models'
import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'
import Joi from 'joi'
import { Enregistrement } from '../../joiSchemas'

export default {
  Query: {
    // TODO sanitization on provided id
    user: (parent, { _id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new UserInputError("L'utilisateur recherché n'existe pas")
      }

      return User.findOne({ _id }).exec()
    },
    // TODO check that the user is authenticated for seeing users list
    // TODO projection efficiently get the field asked for
    // TODO implement pagination
    users: async (parent, args, context, info) => {
      const users = await User.find({})
        .populate()
        .exec()

      return users.map(u => (
        {
          _id: u._id.toString(),
          nom: u.nom,
          prenom: u.prenom,
          numero: u.numero
        }
      ))
    }
  },
  Mutation: {
    enregistrement: async (parent, { nom, prenom, numero }, context, info) => {
      try {
        Joi.validate({ nom, prenom, numero }, Enregistrement, { abortEarly: false })
        const newUser = await new User({
          nom,
          prenom,
          numero
        })
        newUser.save()
        return newUser
      } catch (error) {
        console.log('je ne suis plus')
        return {}
      }
    }
  }
}
