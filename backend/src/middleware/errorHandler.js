/* eslint-disable no-unused-vars */
module.exports = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  const isProd = process.env.NODE_ENV === 'production'

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(isProd ? {} : { stack: err.stack }),
  })
}
