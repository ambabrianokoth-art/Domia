<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    /**
     * Get all users ordered by creation date
     *
     * @return Collection
     */
    public function getAllUsers(): Collection
    {
        return User::select(['id', 'name', 'email', 'role', 'is_active', 'created_at', 'updated_at'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Find user by ID
     *
     * @param int $id
     * @return User|null
     */
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    /**
     * Get users by role
     *
     * @param string $role
     * @return Collection
     */
    public function getUsersByRole(string $role): Collection
    {
        return User::byRole($role)
            ->select(['id', 'name', 'email', 'role', 'is_active', 'created_at', 'updated_at'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get only active users
     *
     * @return Collection
     */
    public function getActiveUsers(): Collection
    {
        return User::active()
            ->select(['id', 'name', 'email', 'role', 'is_active', 'created_at', 'updated_at'])
            ->orderBy('created_at', 'desc')
            ->get();
    }
}