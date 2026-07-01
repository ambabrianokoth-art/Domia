<?php

namespace App\Services\Admin;

use App\Models\Task;
use App\Models\User;
use App\Repositories\TaskRepository;
use App\Notifications\TaskAssignedNotification;
use App\Notifications\TaskReassignedNotification;
use Illuminate\Support\Facades\Notification;

class TaskService
{
    public function __construct(
        protected TaskRepository $taskRepository
    ) {}

    /**
     * Create a new task
     *
     * @param array $data
     * @param User $assignedBy
     * @return Task
     */
    public function createTask(array $data, User $assignedBy): Task
    {
        // Add the assigned_by field
        $data['assigned_by'] = $assignedBy->id;
        
        // Create the task
        $task = $this->taskRepository->create($data);
        
        // Load the relationships
        $task = $this->taskRepository->findWithRelations($task->id);
        
        // Send email notification to assigned user
        $assignedUser = $task->user;
        if ($assignedUser) {
            Notification::send($assignedUser, new TaskAssignedNotification($task));
        }
        
        return $task;
    }

    /**
     * Update a task
     *
     * @param Task $task
     * @param array $data
     * @param User $user
     * @return Task
     */
    public function updateTask(Task $task, array $data, User $user): Task
    {
        // Store original assigned_to for comparison
        $originalAssignedTo = $task->assigned_to;
        
        // Update the task
        $updatedTask = $this->taskRepository->update($task, $data);
        
        // Check if task was reassigned by admin
        if ($user->isAdmin() && 
            isset($data['assigned_to']) && 
            $data['assigned_to'] != $originalAssignedTo) {
            
            // Send notification to new assigned user
            $newAssignedUser = User::find($data['assigned_to']);
            if ($newAssignedUser) {
                Notification::send($newAssignedUser, new TaskAssignedNotification($updatedTask));
            }
            
            // Send notification to original user if different
            if ($originalAssignedTo != $data['assigned_to']) {
                $originalUser = User::find($originalAssignedTo);
                if ($originalUser) {
                    $message = "The task '{$updatedTask->title}' has been reassigned to another user.";
                    Notification::send($originalUser, new TaskReassignedNotification($updatedTask, $message));
                }
            }
        }
        
        return $updatedTask;
    }

    /**
     * Delete a task
     *
     * @param Task $task
     * @return bool
     */
    public function deleteTask(Task $task): bool
    {
        return $this->taskRepository->delete($task);
    }

    /**
     * Get all tasks (for admin)
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllTasks()
    {
        return $this->taskRepository->getAllTasksWithRelations();
    }

    /**
     * Get tasks assigned to a specific user
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserTasks(int $userId)
    {
        return $this->taskRepository->getUserTasks($userId);
    }

    /**
     * Check if user can update task
     *
     * @param Task $task
     * @param User $user
     * @return bool
     */
    public function canUpdateTask(Task $task, User $user): bool
    {
        // Admin can update any task
        if ($user->isAdmin()) {
            return true;
        }
        
        // Regular user can only update their own assigned tasks
        return $task->assigned_to === $user->id;
    }

    /**
     * Check if user can delete task
     *
     * @param Task $task
     * @param User $user
     * @return bool
     */
    public function canDeleteTask(Task $task, User $user): bool
    {
        // Only admin can delete tasks
        return $user->isAdmin();
    }
}