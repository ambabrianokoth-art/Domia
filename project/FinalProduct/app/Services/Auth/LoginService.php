<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Exceptions\Auth\InvalidCredentialsException;
use App\Exceptions\Auth\InactiveUserException;
use Exception;

class LoginService
{
    public function authenticate(array $credentials): array
    {
        try {
            $user = $this->findUserByEmail($credentials['email']);
            
            $this->validateCredentials($user, $credentials['password']);
            
            $this->validateUserStatus($user);
            
            $token = $this->generateToken($user);
            
            return [
                'user' => $this->prepareUserResponse($user),
                'token' => $token
            ];
        } catch (Exception $e) {
            Log::error('Authentication error', [
                'email' => $credentials['email'],
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }

    private function findUserByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    private function validateCredentials(?User $user, string $password): void
    {
        if (!$user || !Hash::check($password, $user->password)) {
            throw new InvalidCredentialsException('Invalid credentials');
        }
    }

    private function validateUserStatus(User $user): void
    {
        if (!$user->isActive()) {
            throw new InactiveUserException('User account is inactive');
        }
    }

    private function generateToken(User $user): string
    {
        $user->tokens()->delete();
        
        return $user->createToken('auth_token')->plainTextToken;
    }

    public function prepareUserResponse(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'created_at' => $user->created_at->toISOString(),
            'updated_at' => $user->updated_at->toISOString(),
        ];
    }
}