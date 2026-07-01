<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\TaskController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('login', [AuthController::class, 'login'])->name('auth.login');
});

Route::middleware('auth:sanctum')->group(function () {
    // User tasks route (available to all authenticated users)
    Route::get('tasks/my-tasks', [TaskController::class, 'getUserTasks'])->name('tasks.my-tasks');
    
    // Task update route (available to all authenticated users - but with different permissions)
    Route::put('tasks/{id}', [TaskController::class, 'update'])->name('tasks.update');
    
    // Admin routes - using full class name instead of alias
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('admin.users.index');
        Route::post('users', [UserController::class, 'store'])->name('admin.users.store');
        Route::put('users/{id}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');
        
        // Task routes (admin only)
        Route::get('tasks', [TaskController::class, 'index'])->name('admin.tasks.index');
        Route::post('tasks', [TaskController::class, 'store'])->name('admin.tasks.store');
        Route::delete('tasks/{id}', [TaskController::class, 'destroy'])->name('admin.tasks.destroy');
    });
});