const {
  APP_PORT = 4000,
  NODE_ENV = 'development'
} = process.env

const IN_PROD = NODE_ENV === 'production'

export {
  IN_PROD,
  APP_PORT
}
