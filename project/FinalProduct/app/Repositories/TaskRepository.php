<?php

namespace App\Repositories;

use App\Models\Task;
use App\Models\User;

class TaskRepository
{
    /**
     * Create a new task
     *
     * @param array $data
     * @return Task
     */
    public function create(array $data): Task
    {
        return Task::create($data);
    }

    /**
     * Get task by ID with relationships
     *
     * @param int $id
     * @return Task|null
     */
    public function findWithRelations(int $id): ?Task
    {
        return Task::with(['user', 'assignedBy'])->find($id);
    }

    /**
     * Get task by ID
     *
     * @param int $id
     * @return Task|null
     */
    public function find(int $id): ?Task
    {
        return Task::find($id);
    }

    /**
     * Update a task
     *
     * @param Task $task
     * @param array $data
     * @return Task
     */
    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->fresh(['user', 'assignedBy']);
    }

    /**
     * Delete a task
     *
     * @param Task $task
     * @return bool
     */
    public function delete(Task $task): bool
    {
        return $task->delete();
    }

    /**
     * Check if user exists and is active
     *
     * @param int $userId
     * @return bool
     */
    public function userExistsAndActive(int $userId): bool
    {
        return User::where('id', $userId)->where('is_active', true)->exists();
    }

    /**
     * Get all tasks with relationships (for admin)
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllTasksWithRelations()
    {
        return Task::with(['user', 'assignedBy'])->get();
    }

    /**
     * Get tasks assigned to a specific user
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserTasks(int $userId)
    {
        return Task::with(['user', 'assignedBy'])
            ->where('assigned_to', $userId)
            ->get();
    }
}