<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateTaskRequest;
use App\Http\Requests\Admin\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Services\Admin\TaskService;
use App\Traits\ApiResponseTrait;
use App\Repositories\TaskRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected TaskService $taskService,
        protected TaskRepository $taskRepository
    ) {}

    /**
     * Get all tasks (Admin only)
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $tasks = $this->taskService->getAllTasks();

            return $this->successResponse(
                TaskResource::collection($tasks),
                'Tasks retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Failed to retrieve tasks: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Get user's assigned tasks (Available to all authenticated users)
     *
     * @return JsonResponse
     */
    public function getUserTasks(): JsonResponse
    {
        try {
            $userId = Auth::id();
            $tasks = $this->taskService->getUserTasks($userId);

            return $this->successResponse(
                TaskResource::collection($tasks),
                'User tasks retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Failed to retrieve user tasks: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Create a new task
     *
     * @param CreateTaskRequest $request
     * @return JsonResponse
     */
    public function store(CreateTaskRequest $request): JsonResponse
    {
        try {
            $task = $this->taskService->createTask(
                $request->validated(),
                Auth::user()
            );

            return $this->successResponse(
                new TaskResource($task),
                'Task created successfully. Email notification sent.',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Failed to create task: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Update a task
     *
     * @param UpdateTaskRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateTaskRequest $request, int $id): JsonResponse
    {
        try {
            $task = $this->taskRepository->findWithRelations($id);
            
            if (!$task) {
                return $this->errorResponse('Task not found', 404);
            }

            /** @var \App\Models\User $user */
            /** @var \App\Models\User $user */
            $user = Auth::user();
            
            // Check if user can update this task
            if (!$this->taskService->canUpdateTask($task, $user)) {
                return $this->errorResponse('You are not authorized to update this task', 403);
            }

            // For non-admin users, only allow status updates
            $data = $request->validated();
            if (!$user->isAdmin()) {
                $data = array_intersect_key($data, ['status' => '']);
            }

            $updatedTask = $this->taskService->updateTask($task, $data, $user);

            return $this->successResponse(
                new TaskResource($updatedTask),
                'Task updated successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Failed to update task: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Delete a task (Admin only)
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $task = $this->taskRepository->find($id);
            
            if (!$task) {
                return $this->errorResponse('Task not found', 404);
            }

            $user = Auth::user();
            
            // Check if user can delete this task
            if (!$this->taskService->canDeleteTask($task, $user)) {
                return $this->errorResponse('You are not authorized to delete this task', 403);
            }

            $this->taskService->deleteTask($task);

            return $this->successResponse(
                '',
                'Task deleted successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Failed to delete task: ' . $e->getMessage(),
                500
            );
        }
    }
}