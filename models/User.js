
import mongoose from 'mongoose'
import { ObjectID } from 'mongodb'

const Schema = mongoose.Schema

ObjectID.prototype.valueOf = function () {
  return this.toString()
}

const UserSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  numero: {
    type: String,
    validate: {
      validator: async numero => await User.where({ numero }).countDocuments() === 0,
      message: ({ value }) => 'Le numero fourni existe deja. Utiliser authentification'
    },
    unique: true,
    required: true
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', UserSchema)
export default User
