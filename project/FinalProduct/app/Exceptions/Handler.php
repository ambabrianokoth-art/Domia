<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param Request $request
     * @param Throwable $e
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $e)
    {
        // Handle validation exceptions for API requests
        if ($request->expectsJson() && $e instanceof ValidationException) {
            return $this->convertValidationExceptionToResponse($e, $request);
        }

        return parent::render($request, $e);
    }

    /**
     * Convert a validation exception into a JSON response.
     *
     * @param ValidationException $e
     * @param Request $request
     * @return JsonResponse
     */
    protected function convertValidationExceptionToResponse(ValidationException $e, $request)
    {
        return response()->json([
            'result_code' => 0,
            'data' => $e->errors(),
            'message' => $this->getValidationErrorMessage($e->errors()),
        ], $e->status);
    }

    /**
     * Get a user-friendly validation error message
     *
     * @param array $errors
     * @return string
     */
    protected function getValidationErrorMessage(array $errors): string
    {
        $errorCount = count($errors);
        
        if ($errorCount === 1) {
            $field = array_keys($errors)[0];
            return "Validation failed for {$field}";
        }
        
        return "Validation failed for {$errorCount} fields";
    }
}