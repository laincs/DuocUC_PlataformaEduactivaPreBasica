export function sendSuccess(res, data = null, message = 'Operación exitosa', status = 200) {
  return res.status(status).json({
    success: true,
    data,
    message,
    error: null
  })
}

export function sendError(res, message = 'Ocurrió un error', error = null, status = 400) {
  return res.status(status).json({
    success: false,
    data: null,
    message,
    error
  })
}