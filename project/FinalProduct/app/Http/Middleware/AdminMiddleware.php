<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponseTrait;

class AdminMiddleware
{
    use ApiResponseTrait;

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            return $this->errorResponse('Unauthorized', 401);
        }

        // Check if user is active
        if (!$user->isActive()) {
            return $this->errorResponse('Account is inactive', 401);
        }

        // Check if user is admin
        if (!$user->isAdmin()) {
            return $this->errorResponse('Access denied. Admin privileges required', 403);
        }

        return $next($request);
    }
}