import Joi from 'joi'

export default Joi.object().keys({
  nom: Joi.string().alphanum().min(3).max(15).required().label('nom').error(errors => {
    errors.forEach(err => {
      switch (err.type) {
        case 'any.empty':
          err.message = 'La valeur ne peut etre vide'
          break
        case 'string.min':
          err.message = `La valeur doit avoir au moins ${err.context.limit} caracteres`
          break
        case 'string.max':
          err.message = `La valeur doit avoir au plus ${err.context.limit} caracteres`
          break
        default:
          break
      }
    })
    return errors
  }),
  prenom: Joi.string().alphanum().min(3).max(15).required().label('prenom').error(errors => {
    errors.forEach(err => {
      switch (err.type) {
        case 'any.empty':
          err.message = 'La valeur ne peut etre vide'
          break
        case 'string.min':
          err.message = `La valeur doit avoir au moins ${err.context.limit} caracteres`
          break
        case 'string.max':
          err.message = `La valeur doit avoir au plus ${err.context.limit} caracteres`
          break
        default:
          break
      }
    })
    return errors
  }),
  numero: Joi.string().alphanum().required().label('numero')
  // TODO see apollo-client
  // Joi.number().integer().min(1000000000).max(9999999999)
})
