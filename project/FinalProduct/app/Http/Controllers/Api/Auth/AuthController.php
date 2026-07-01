<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\RegistrationService;
use App\Services\Auth\LoginService;
use App\Traits\ApiResponseTrait;
use App\Exceptions\Auth\InvalidCredentialsException;
use App\Exceptions\Auth\InactiveUserException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Exception;

class AuthController extends Controller
{
    use ApiResponseTrait;

    protected RegistrationService $registrationService;
    protected LoginService $loginService;

    public function __construct(
        RegistrationService $registrationService,
        LoginService $loginService
    ) {
        $this->registrationService = $registrationService;
        $this->loginService = $loginService;
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            $user = $this->registrationService->register($validatedData);

            $userData = $this->registrationService->prepareUserResponse($user);

            return $this->createdResponse(
                ['user' => $userData],
                'User registered successfully'
            );

        } catch (Exception $e) {
            Log::error('Registration error in controller', [
                'error' => $e->getMessage(),
                'email' => $request->email ?? 'unknown',
                'trace' => $e->getTraceAsString()
            ]);

            return $this->serverErrorResponse(
                'Registration failed. Please try again later.'
            );
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->validated();
            
            $authData = $this->loginService->authenticate($credentials);
            
            return $this->successResponse($authData, 'Login successful');
            
        } catch (InvalidCredentialsException $e) {
            return $this->unauthorizedResponse('Invalid credentials');
            
        } catch (InactiveUserException $e) {
            return $this->unauthorizedResponse('User account is inactive');
            
        } catch (Exception $e) {
            Log::error('Login error in controller', [
                'error' => $e->getMessage(),
                'email' => $request->email ?? 'unknown',
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->serverErrorResponse(
                'Login failed. Please try again later.'
            );
        }
    }
}