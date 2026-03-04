<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Front controllers
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\HomeController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\ChapterController;
use App\Http\Controllers\front\LessonController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\RequirementController;
use App\Http\Controllers\front\DashboardController;

// API controllers
use App\Http\Controllers\Api\ProblemController;
use App\Http\Controllers\Api\InnovationController;
use App\Http\Controllers\Api\InnovationUserController;
use App\Http\Controllers\Api\IdeaWorkspaceController;
use App\Http\Controllers\Api\ShowcaseController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\InstructorDashboardController;
use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\AdminCourseController;
use App\Http\Controllers\Api\front\AdminCategoryController;
use Illuminate\Support\Facades\DB;

// Route::get('/ssl-check', function () {
//     return response()->json([
//         'php_version' => PHP_VERSION,
//         'curl_cainfo' => ini_get('curl.cainfo'),
//         'curl_cainfo_exists' => ini_get('curl.cainfo') ? file_exists(ini_get('curl.cainfo')) : null,
//         'openssl_cafile' => ini_get('openssl.cafile'),
//         'openssl_cafile_exists' => ini_get('openssl.cafile') ? file_exists(ini_get('openssl.cafile')) : null,
//         'openssl_loaded' => extension_loaded('openssl'),
//         'curl_loaded' => extension_loaded('curl'),
//     ]);
// });

Route::get('/debug-db', function () {
    return DB::connection()->getDatabaseName();
});
/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (No Auth)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);

Route::get('/home/stats', [HomeController::class, 'stats']);

Route::get('/fetch-categories', [HomeController::class, 'fetchCategories']);
Route::get('/fetch-levels', [HomeController::class, 'fetchLevels']);
Route::get('/fetch-languages', [HomeController::class, 'fetchLanguages']);
Route::get('/fetch-featured-courses', [HomeController::class, 'fetchFeaturedCourses']);
Route::get('/fetch-courses', [HomeController::class, 'courses']);
Route::get('/fetch-course/{id}', [HomeController::class, 'course']);

// portfolio public profile
Route::get('/portfolio/{userId}', [PortfolioController::class, 'show']);

// optional debug route (remove in production)
Route::get('/test-cloudinary', function () {
    return config('cloudinary');
});

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->group(function () {

    // quick check current logged user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD / GENERAL AUTH ROUTES (Student / Instructor / Admin)
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // enrollments + learning progress
    Route::get('/enrollments', [AccountController::class, 'enrollments']);
    Route::post('/enroll-course', [HomeController::class, 'enroll']);
    Route::get('/enroll/{id}', [AccountController::class, 'course']);

    Route::post('/save-activity', [AccountController::class, 'saveUserActivity']);
    Route::post('/mark-as-complete', [AccountController::class, 'markAsComplete']);
    Route::post('/leave-rating', [AccountController::class, 'saveRating']);

    // user profile
    Route::get('/fetch-user', [AccountController::class, 'fetchUser']);
    Route::post('/update-user', [AccountController::class, 'updateUser']);
    Route::post('/update-password', [AccountController::class, 'updatePassword']);

    // certificates
    Route::get('/certificates', [CertificateController::class, 'index']);
    Route::get('/certificates/{id}/download', [CertificateController::class, 'download']);

    /*
    |--------------------------------------------------------------------------
    | INNOVATION MODULE (Auth required)
    |--------------------------------------------------------------------------
    */
    Route::get('/problems', [ProblemController::class, 'index']);
    Route::post('/problems', [ProblemController::class, 'store']);

    // problem details + ideas
    Route::get('/problems/{id}', [InnovationController::class, 'problemDetails']);
    Route::post('/problems/{id}/ideas', [InnovationController::class, 'addIdea']);
    Route::post('/ideas/{id}/vote', [InnovationController::class, 'toggleVote']);
    Route::post('/ideas/{id}/select', [InnovationController::class, 'selectIdea']);

    // user innovation pages
    Route::get('/innovation/my-ideas', [InnovationUserController::class, 'myIdeas']);
    Route::get('/innovation/my-teams', [InnovationUserController::class, 'myTeams']);
    Route::post('/ideas/{id}/join', [InnovationUserController::class, 'joinIdea']);

    // idea workspace
    Route::get('/ideas/{id}', [IdeaWorkspaceController::class, 'show']);
    Route::post('/ideas/{id}/updates', [IdeaWorkspaceController::class, 'addUpdate']);
    Route::post('/updates/{id}/feedback', [IdeaWorkspaceController::class, 'addFeedback']);

    // showcases
    Route::get('/showcases', [ShowcaseController::class, 'index']);
    Route::get('/showcases/{id}', [ShowcaseController::class, 'show']);

    // leaderboard
    Route::get('/innovation/leaderboard', [LeaderboardController::class, 'index']);

    // portfolio (private "me")
    Route::get('/portfolio/me', [PortfolioController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | INSTRUCTOR / ADMIN ONLY
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:admin,instructor'])->group(function () {

        // instructor dashboard
        Route::get('/instructor/dashboard/stats', [InstructorDashboardController::class, 'stats']);

        // courses CRUD
        Route::post('/courses', [CourseController::class, 'store']);
        Route::get('/courses/meta-data', [CourseController::class, 'metaData']);
        Route::get('/courses/{id}', [CourseController::class, 'show']);
        Route::put('/courses/{id}', [CourseController::class, 'update']);
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

        // course actions
        Route::post('/save-course-image/{id}', [CourseController::class, 'saveCourseImage']);
        Route::post('/change-course-status/{id}', [CourseController::class, 'changeStatus']);
        Route::post('/change-course-featured/{id}', [CourseController::class, 'changeFeatured']);

        // outcomes
        Route::get('/outcomes', [OutcomeController::class, 'index']);
        Route::post('/outcomes', [OutcomeController::class, 'store']);
        Route::put('/outcomes/{id}', [OutcomeController::class, 'update']);
        Route::delete('/outcomes/{id}', [OutcomeController::class, 'destroy']);
        Route::post('/sort-outcomes', [OutcomeController::class, 'sortOutcomes']);

        // requirements
        Route::get('/requirements', [RequirementController::class, 'index']);
        Route::post('/requirements', [RequirementController::class, 'store']);
        Route::put('/requirements/{id}', [RequirementController::class, 'update']);
        Route::delete('/requirements/{id}', [RequirementController::class, 'destroy']);
        Route::post('/sort-requirements', [RequirementController::class, 'sortRequirements']);

        // chapters
        Route::get('/chapters', [ChapterController::class, 'index']);
        Route::post('/chapters', [ChapterController::class, 'store']);
        Route::put('/chapters/{id}', [ChapterController::class, 'update']);
        Route::delete('/chapters/{id}', [ChapterController::class, 'destroy']);
        Route::post('/sort-chapters', [ChapterController::class, 'sortChapters']);

        // lessons
        Route::post('/lessons', [LessonController::class, 'store']);
        Route::get('/lessons/{id}', [LessonController::class, 'show']);
        Route::put('/lessons/{id}', [LessonController::class, 'update']);
        Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
        Route::post('/sort-lessons', [LessonController::class, 'sortLessons']);

        // ✅ cloudinary lesson video upload
        Route::post('/save-lesson-video/{id}', [LessonController::class, 'saveVideo']);

        // instructor courses list
        Route::get('/my-courses', [AccountController::class, 'courses']);

        // publish showcase (you said admin/instructor only)
        Route::post('/ideas/{id}/publish-showcase', [ShowcaseController::class, 'publish']);
    });

    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY (Recommended)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:admin'])->group(function () {

        // admin analytics
        Route::get('/admin/analytics/overview', [AdminAnalyticsController::class, 'overview']);
        Route::get('/admin/analytics/enrollments-trend', [AdminAnalyticsController::class, 'enrollmentsTrend']); // ?days=30
        Route::get('/admin/analytics/revenue-trend', [AdminAnalyticsController::class, 'revenueTrend']);         // ?days=30
        Route::get('/admin/analytics/top-courses', [AdminAnalyticsController::class, 'topCourses']);           // ?limit=6
        Route::get('/admin/analytics/innovation', [AdminAnalyticsController::class, 'innovation']);

        // admin all courses
        Route::get('/admin/courses', [AdminCourseController::class, 'index']);

        // categories (admin)
        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::post('/categories', [AdminCategoryController::class, 'store']);
        Route::get('/categories/{id}', [AdminCategoryController::class, 'show']);
        Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
        Route::patch('/categories/{id}/status', [AdminCategoryController::class, 'toggleStatus']);
        Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);
    });
});