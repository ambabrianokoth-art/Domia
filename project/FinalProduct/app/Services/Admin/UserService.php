<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Repositories\Admin\AdminUserRepository;
use App\Repositories\UserRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserService
{
    private UserRepository $userRepository;
    private AdminUserRepository $adminUserRepository;

    public function __construct(UserRepository $userRepository, AdminUserRepository $adminUserRepository)
    {
        $this->userRepository = $userRepository;
        $this->adminUserRepository = $adminUserRepository;
    }

    /**
     * Get all users
     *
     * @return Collection
     */
    public function getAllUsers(): Collection
    {
        return $this->userRepository->getAllUsers();
    }

    /**
     * Create a new user
     *
     * @param array $userData
     * @return User
     * @throws \Exception
     */
    public function createUser(array $userData): User
    {
        try {
            DB::beginTransaction();

            // Validate role
            if (!in_array($userData['role'], User::getRoles())) {
                throw new \InvalidArgumentException('Invalid role provided');
            }

            // Additional security check for email uniqueness
            if ($this->adminUserRepository->emailExists($userData['email'])) {
                throw new \InvalidArgumentException('Email already exists');
            }

            // Sanitize input data
            $sanitizedData = $this->sanitizeUserData($userData);

            // Create user
            $user = $this->adminUserRepository->create($sanitizedData);

            DB::commit();

            Log::info('User created successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role
            ]);

            return $user;

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('User creation failed', [
                'error' => $e->getMessage(),
                'email' => $userData['email'] ?? 'unknown'
            ]);
            
            throw $e;
        }
    }

    /**
     * Update existing user
     *
     * @param int $id
     * @param array $userData
     * @return User
     * @throws \Exception
     */
    public function updateUser(int $id, array $userData): User
    {
        $currentUser = Auth::user();
        
        try {
            DB::beginTransaction();

            // Check if user exists
            $existingUser = $this->adminUserRepository->findById($id);
            if (!$existingUser) {
                throw new \InvalidArgumentException('User not found');
            }

            // Validate role if provided
            if (isset($userData['role']) && !in_array($userData['role'], User::getRoles())) {
                throw new \InvalidArgumentException('Invalid role provided');
            }

            // Additional security check for email uniqueness (if email is being updated)
            if (isset($userData['email']) && $this->adminUserRepository->emailExists($userData['email'], $id)) {
                throw new \InvalidArgumentException('Email already exists');
            }

            // Sanitize input data
            $sanitizedData = $this->sanitizeUpdateUserData($userData);

            // Update user
            $user = $this->adminUserRepository->update($id, $sanitizedData);

            DB::commit();

            Log::info('User updated successfully', [
                'user_id' => $user->id,
                'updated_by' => $currentUser?->id,
                'updated_fields' => array_keys($sanitizedData)
            ]);

            return $user;

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('User update failed', [
                'error' => $e->getMessage(),
                'user_id' => $id,
                'updated_by' => $currentUser?->id
            ]);
            
            throw $e;
        }
    }

    /**
     * Delete user
     *
     * @param int $id
     * @return bool
     * @throws \Exception
     */
    public function deleteUser(int $id): bool
    {
        $currentUser = Auth::user();
        
        try {
            DB::beginTransaction();

            // Check if user exists
            $existingUser = $this->adminUserRepository->findById($id);
            if (!$existingUser) {
                throw new \InvalidArgumentException('User not found');
            }

            // Delete user
            $result = $this->adminUserRepository->delete($id);

            DB::commit();

            Log::info('User deleted successfully', [
                'user_id' => $id,
                'deleted_user_email' => $existingUser->email,
                'deleted_by' => $currentUser?->id
            ]);

            return $result;

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('User deletion failed', [
                'error' => $e->getMessage(),
                'user_id' => $id,
                'deleted_by' => $currentUser?->id
            ]);
            
            throw $e;
        }
    }

    /**
     * Sanitize user data for creation
     *
     * @param array $userData
     * @return array
     */
    private function sanitizeUserData(array $userData): array
    {
        return [
            'name' => strip_tags(trim($userData['name'])),
            'email' => filter_var(strtolower(trim($userData['email'])), FILTER_SANITIZE_EMAIL),
            'password' => $userData['password'], // Will be hashed in repository
            'role' => strtolower(trim($userData['role']))
        ];
    }

    /**
     * Sanitize user data for update
     *
     * @param array $userData
     * @return array
     */
    private function sanitizeUpdateUserData(array $userData): array
    {
        $sanitized = [];

        if (isset($userData['name'])) {
            $sanitized['name'] = strip_tags(trim($userData['name']));
        }

        if (isset($userData['email'])) {
            $sanitized['email'] = filter_var(strtolower(trim($userData['email'])), FILTER_SANITIZE_EMAIL);
        }

        if (isset($userData['role'])) {
            $sanitized['role'] = strtolower(trim($userData['role']));
        }

        if (isset($userData['is_active'])) {
            $sanitized['is_active'] = (bool) $userData['is_active'];
        }

        return $sanitized;
    }
}