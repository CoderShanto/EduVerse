<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * For API apps: never redirect to login.
     */
    protected function redirectTo($request)
    {
        return null;
    }
}