<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Requests\Admin\DeleteUserRequest;
use App\Http\Resources\UserResource;
use App\Services\Admin\UserService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    use ApiResponseTrait;

    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get all users (Admin only)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $users = $this->userService->getAllUsers();
            
            return $this->successResponse(
                UserResource::collection($users),
                'Users retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve users', [
                'error' => $e->getMessage()
            ]);
            
            return $this->serverErrorResponse('Failed to retrieve users');
        }
    }

    /**
     * Create a new user (Admin only)
     *
     * @param CreateUserRequest $request
     * @return JsonResponse
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->createUser($request->validated());
            
            return $this->createdResponse(
                new UserResource($user),
                'User created successfully'
            );
        } catch (\InvalidArgumentException $e) {
            Log::warning('User creation validation failed', [
                'error' => $e->getMessage(),
                'request_data' => $request->except('password')
            ]);
            
            return $this->errorResponse(
                $e->getMessage(),
                null,
                422
            );
        } catch (\Exception $e) {
            Log::error('User creation failed', [
                'error' => $e->getMessage(),
                'request_data' => $request->except('password')
            ]);
            
            return $this->serverErrorResponse('Failed to create user');
        }
    }

    /**
     * Update existing user (Admin only)
     *
     * @param UpdateUserRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        try {
            $user = $this->userService->updateUser($id, $request->validated());
            
            return $this->successResponse(
                new UserResource($user),
                'User updated successfully'
            );
        } catch (\InvalidArgumentException $e) {
            Log::warning('User update validation failed', [
                'error' => $e->getMessage(),
                'user_id' => $id,
                'request_data' => $request->validated()
            ]);
            
            return $this->errorResponse(
                $e->getMessage(),
                null,
                422
            );
        } catch (\Exception $e) {
            Log::error('User update failed', [
                'error' => $e->getMessage(),
                'user_id' => $id,
                'request_data' => $request->validated()
            ]);
            
            return $this->serverErrorResponse('Failed to update user');
        }
    }

    /**
     * Delete user (Admin only)
     *
     * @param DeleteUserRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(DeleteUserRequest $request, int $id): JsonResponse
    {
        try {
            $this->userService->deleteUser($id);
            
            return $this->successResponse(
                "",
                'User deleted successfully'
            );
        } catch (\InvalidArgumentException $e) {
            Log::warning('User deletion validation failed', [
                'error' => $e->getMessage(),
                'user_id' => $id
            ]);
            
            return $this->errorResponse(
                $e->getMessage(),
                null,
                422
            );
        } catch (\Exception $e) {
            Log::error('User deletion failed', [
                'error' => $e->getMessage(),
                'user_id' => $id
            ]);
            
            return $this->serverErrorResponse('Failed to delete user');
        }
    }
}