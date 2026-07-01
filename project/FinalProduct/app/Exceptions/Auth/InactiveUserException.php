<?php

namespace App\Exceptions\Auth;

use Exception;

class InactiveUserException extends Exception
{
    public function __construct(string $message = 'User account is inactive')
    {
        parent::__construct($message);
    }
}