<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        // ✅ Never redirect for API
        if ($request->is('api/*') || $request->expectsJson()) {
            return null;
        }

        return null; // no login route redirect
    }
}