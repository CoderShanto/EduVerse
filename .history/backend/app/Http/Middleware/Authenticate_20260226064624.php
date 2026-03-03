<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        // ✅ For API requests, do NOT redirect to route('login')
        if ($request->expectsJson()) {
            return null;
        }

        return route('login');
    }
}