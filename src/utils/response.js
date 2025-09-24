/**
 * Standard API response format
 */
class ApiResponse {
  /**
   * Success response
   * @param {object} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   */
  static success(data = null, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {array} errors - Validation errors
   */
  static error(message = 'Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString()
    };

    if (errors) {
      response.errors = errors;
    }

    if (process.env.NODE_ENV === 'development' && Error.captureStackTrace) {
      Error.captureStackTrace(response);
    }

    return response;
  }

  /**
   * Validation error response
   * @param {array} errors - Validation errors
   * @param {string} message - Error message
   */
  static validationError(errors, message = 'Validation failed') {
    return {
      success: false,
      statusCode: 400,
      message,
      errors,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Unauthorized response
   * @param {string} message - Error message
   */
  static unauthorized(message = 'Unauthorized access') {
    return {
      success: false,
      statusCode: 401,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Forbidden response
   * @param {string} message - Error message
   */
  static forbidden(message = 'Access forbidden') {
    return {
      success: false,
      statusCode: 403,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Not found response
   * @param {string} message - Error message
   */
  static notFound(message = 'Resource not found') {
    return {
      success: false,
      statusCode: 404,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Internal server error response
   * @param {string} message - Error message
   */
  static serverError(message = 'Internal server error') {
    return {
      success: false,
      statusCode: 500,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Paginated response
   * @param {array} data - Response data
   * @param {object} pagination - Pagination info
   * @param {string} message - Success message
   */
  static paginated(data, pagination, message = 'Success') {
    return {
      success: true,
      statusCode: 200,
      message,
      data,
      pagination: {
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPrevPage: pagination.page > 1
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Created response
   * @param {object} data - Created resource data
   * @param {string} message - Success message
   */
  static created(data, message = 'Resource created successfully') {
    return {
      success: true,
      statusCode: 201,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * No content response
   * @param {string} message - Success message
   */
  static noContent(message = 'Operation completed successfully') {
    return {
      success: true,
      statusCode: 204,
      message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Send formatted response
 * @param {object} res - Express response object
 * @param {object} response - Response object
 */
const sendResponse = (res, response) => {
  return res.status(response.statusCode).json(response);
};

/**
 * Express middleware for sending responses
 */
const responseMiddleware = (req, res, next) => {
  res.apiSuccess = (data, message, statusCode) => {
    return sendResponse(res, ApiResponse.success(data, message, statusCode));
  };

  res.apiError = (message, statusCode, errors) => {
    return sendResponse(res, ApiResponse.error(message, statusCode, errors));
  };

  res.apiValidationError = (errors, message) => {
    return sendResponse(res, ApiResponse.validationError(errors, message));
  };

  res.apiUnauthorized = (message) => {
    return sendResponse(res, ApiResponse.unauthorized(message));
  };

  res.apiForbidden = (message) => {
    return sendResponse(res, ApiResponse.forbidden(message));
  };

  res.apiNotFound = (message) => {
    return sendResponse(res, ApiResponse.notFound(message));
  };

  res.apiServerError = (message) => {
    return sendResponse(res, ApiResponse.serverError(message));
  };

  res.apiPaginated = (data, pagination, message) => {
    return sendResponse(res, ApiResponse.paginated(data, pagination, message));
  };

  res.apiCreated = (data, message) => {
    return sendResponse(res, ApiResponse.created(data, message));
  };

  res.apiNoContent = (message) => {
    return sendResponse(res, ApiResponse.noContent(message));
  };

  next();
};

module.exports = {
  ApiResponse,
  sendResponse,
  responseMiddleware
};