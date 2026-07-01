<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Serve the Vue.js application for all routes
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');

// Alternative: If you want to be more specific about which routes should serve the Vue app
/*
Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return view('welcome');
});

Route::get('/signup', function () {
    return view('welcome');
});

Route::get('/forgot-password', function () {
    return view('welcome');
});

Route::get('/new-password', function () {
    return view('welcome');
});

Route::get('/reset-success', function () {
    return view('welcome');
});

Route::get('/admin/{any?}', function () {
    return view('welcome');
})->where('any', '.*');

Route::get('/dashboard', function () {
    return view('welcome');
});

Route::get('/tasks', function () {
    return view('welcome');
});
*/