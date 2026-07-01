<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

trait ApiResponseTrait
{
    /**
     * Success response
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function successResponse($data = null, string $message = 'Success', int $statusCode = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'result_code' => 1,
            'data' => $data,
            'message' => $message,
        ], $statusCode);
    }

    /**
     * Error response
     *
     * @param string $message
     * @param mixed $data
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function errorResponse(string $message = 'Error', $data = null, int $statusCode = Response::HTTP_BAD_REQUEST): JsonResponse
    {
        return response()->json([
            'result_code' => 0,
            'data' => $data,
            'message' => $message,
        ], $statusCode);
    }

    /**
     * Validation error response
     *
     * @param array $errors
     * @param string $message
     * @return JsonResponse
     */
    protected function validationErrorResponse(array $errors, string $message = 'Validation failed'): JsonResponse
    {
        return response()->json([
            'result_code' => 0,
            'data' => $errors,
            'message' => $message,
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Unauthorized response
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function unauthorizedResponse(string $message = 'Unauthorized'): JsonResponse
    {
        return response()->json([
            'result_code' => 0,
            'data' => null,
            'message' => $message,
        ], Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Server error response
     *
     * @param string $message
     * @param mixed $data
     * @return JsonResponse
     */
    protected function serverErrorResponse(string $message = 'Internal server error', $data = null): JsonResponse
    {
        return response()->json([
            'result_code' => 0,
            'data' => $data,
            'message' => $message,
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * Created response
     *
     * @param mixed $data
     * @param string $message
     * @return JsonResponse
     */
    protected function createdResponse($data = null, string $message = 'Created successfully'): JsonResponse
    {
        return $this->successResponse($data, $message, Response::HTTP_CREATED);
    }

    /**
     * No content response
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function noContentResponse(string $message = 'No content'): JsonResponse
    {
        return $this->successResponse(null, $message, Response::HTTP_NO_CONTENT);
    }
}