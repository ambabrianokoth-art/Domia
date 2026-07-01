<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class RegistrationService
{
    /**
     * Register a new user
     *
     * @param array $userData
     * @return User
     * @throws Exception
     */
    public function register(array $userData): User
    {
        try {
            DB::beginTransaction();

            $user = $this->createUser($userData);

            DB::commit();

            Log::info('User registered successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role
            ]);

            return $user;

        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('User registration failed', [
                'error' => $e->getMessage(),
                'email' => $userData['email'] ?? 'unknown',
                'trace' => $e->getTraceAsString()
            ]);

            throw new Exception('Registration failed: ' . $e->getMessage());
        }
    }

    /**
     * Create a new user
     *
     * @param array $userData
     * @return User
     */
    private function createUser(array $userData): User
    {
        foreach (['name', 'email', 'password'] as $key) {
        if (!array_key_exists($key, $userData)) {
            throw new \InvalidArgumentException("Missing required field: {$key}");
        }
    }
        return User::create([
            'name' => $this->sanitizeName($userData['name']),
            'email' => $this->sanitizeEmail($userData['email']),
            'password' => Hash::make($userData['password']),
            'role' => $userData['role'] ?? User::ROLE_GUEST,
            'is_active' => true,
        ]);
    }

    /**
     * Sanitize user name
     *
     * @param string $name
     * @return string
     */
    private function sanitizeName(string $name): string
    {
        return trim(preg_replace('/\s+/', ' ', $name));
    }

    /**
     * Sanitize email
     *
     * @param string $email
     * @return string
     */
    private function sanitizeEmail(string $email): string
    {
        return strtolower(trim($email));
    }

    /**
     * Check if email is already taken
     *
     * @param string $email
     * @return bool
     */
    public function isEmailTaken(string $email): bool
    {
        return User::where('email', $this->sanitizeEmail($email))->exists();
    }

    /**
     * Prepare user data for response
     *
     * @param User $user
     * @return array
     */
    public function prepareUserResponse(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active,
            'created_at' => $user->created_at->toISOString(),
            'updated_at' => $user->updated_at->toISOString(),
        ];
    }
}