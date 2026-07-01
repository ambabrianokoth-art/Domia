<?php

namespace App\Repositories\Admin;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminUserRepository
{
    /**
     * Create a new user
     *
     * @param array $userData
     * @return User
     */
    public function create(array $userData): User
    {
        $userData['password'] = Hash::make($userData['password']);
        $userData['is_active'] = true; // Default to active
        
        return User::create($userData);
    }

    /**
     * Update existing user
     *
     * @param int $id
     * @param array $userData
     * @return User
     * @throws \Exception
     */
    public function update(int $id, array $userData): User
    {
        $currentUser = Auth::user();
        
        $user = $this->findById($id);
        
        if (!$user) {
            throw new \Exception('User not found');
        }
        
        // Prevent admin from deactivating themselves
        if ($id === $currentUser?->id && isset($userData['is_active']) && !$userData['is_active']) {
            throw new \Exception('Cannot deactivate your own account');
        }
        
        $user->update($userData);
        
        return $user->fresh();
    }

    /**
     * Delete user by ID
     *
     * @param int $id
     * @return bool
     * @throws \Exception
     */
    public function delete(int $id): bool
    {
        $currentUser = Auth::user();
        
        $user = $this->findById($id);
        
        if (!$user) {
            throw new \Exception('User not found');
        }
        
        // Prevent admin from deleting themselves
        if ($id === $currentUser?->id) {
            throw new \Exception('Cannot delete your own account');
        }
        
        return $user->delete();
    }

    /**
     * Check if email exists (excluding specific user ID)
     *
     * @param string $email
     * @param int|null $excludeId
     * @return bool
     */
    public function emailExists(string $email, ?int $excludeId = null): bool
    {
        $query = User::where('email', $email);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return $query->exists();
    }

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