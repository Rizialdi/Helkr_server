import jwt from 'jsonwebtoken'
const APP_SECRET_CODE = 'HSfg5sdAkLS65DNlfsk4KL45qdSdf5DE'

const getUserId = (context) => {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET_CODE)
    return userId
  }

  throw new Error('Not authenticated')
}

export {
  APP_SECRET_CODE,
  getUserId
}
