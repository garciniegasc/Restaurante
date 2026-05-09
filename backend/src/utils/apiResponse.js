class ApiResponse {
  static success(res, data, message = 'OK', statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static created(res, data, message = 'Recurso creado') {
    return this.success(res, data, message, 201);
  }

  static error(res, message = 'Error del servidor', statusCode = 500) {
    return res.status(statusCode).json({ success: false, message });
  }

  static notFound(res, message = 'Recurso no encontrado') {
    return this.error(res, message, 404);
  }
}

module.exports = ApiResponse;
