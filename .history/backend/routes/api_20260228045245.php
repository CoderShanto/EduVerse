<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\ChapterController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\HomeController;
use App\Http\Controllers\front\LessonController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\RequirementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\front\DashboardController;
use App\Http\Controllers\Api\ProblemController;
use App\Http\Controllers\Api\InnovationController;
use App\Http\Controllers\Api\InnovationUserController;
use App\Http\Controllers\Api\IdeaWorkspaceController;
use App\Http\Controllers\Api\ShowcaseController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\PortfolioController;

Route::post('/register',[AccountController::class,'register']);
Route::post('/login',[AccountController::class,'authenticate']);


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/problems', [ProblemController::class, 'index']);
    Route::post('/problems', [ProblemController::class, 'store']);

     Route::get('/problems/{id}', [InnovationController::class, 'problemDetails']);
    Route::post('/problems/{id}/ideas', [InnovationController::class, 'addIdea']);
    Route::post('/ideas/{id}/vote', [InnovationController::class, 'toggleVote']);
    Route::post('/ideas/{id}/select', [InnovationController::class, 'selectIdea']);

    Route::get('/innovation/my-ideas', [InnovationUserController::class, 'myIdeas']);
    Route::get('/innovation/my-teams', [InnovationUserController::class, 'myTeams']);
    Route::post('/ideas/{id}/join', [InnovationUserController::class, 'joinIdea']);

     Route::get('/ideas/{id}', [IdeaWorkspaceController::class, 'show']);
    Route::post('/ideas/{id}/updates', [IdeaWorkspaceController::class, 'addUpdate']);
    Route::post('/updates/{id}/feedback', [IdeaWorkspaceController::class, 'addFeedback']);
    
    //showcases here
    Route::get('/showcases', [ShowcaseController::class, 'index']);
    Route::get('/showcases/{id}', [ShowcaseController::class, 'show']);
    Route::post('/ideas/{id}/publish-showcase', [ShowcaseController::class, 'publish']); // admin/instructor only

    Route::get('/innovation/leaderboard', [LeaderboardController::class, 'index']);

    Route::get('/portfolio/me', [PortfolioController::class, 'me']);
// optional share link
    
});
Route::get('/portfolio/{userId}', [PortfolioController::class, 'show']); 

Route::get('/fetch-categories',[HomeController::class,'fetchCategories']);
Route::get('/fetch-levels',[HomeController::class,'fetchLevels']);
Route::get('/fetch-languages',[HomeController::class,'fetchLanguages']);
Route::get('/fetch-featured-courses',[HomeController::class,'fetchFeaturedCourses']);
Route::get('/fetch-courses',[HomeController::class,'courses']);
Route::get('/fetch-course/{id}',[HomeController::class,'course']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::group(['middleware' => ['auth:sanctum']], function () {

//     Route::post('/courses',[CourseController::class,'store']);
//     Route::get('/courses/meta-data',[CourseController::class,'metaData']);
//     Route::get('/courses/{id}',[CourseController::class,'show']);
//     Route::put('/courses/{id}',[CourseController::class,'update']);
//     Route::post('/save-course-image/{id}',[CourseController::class,'saveCourseImage']);
//     Route::post('/change-course-status/{id}',[CourseController::class,'changeStatus']);
//      Route::delete('/courses/{id}',[CourseController::class,'destroy']);

//     // Outcomes routes
//      Route::get('/outcomes',[OutcomeController::class,'index']);
//      Route::post('/outcomes',[OutcomeController::class,'store']);
//      Route::put('/outcomes/{id}',[OutcomeController::class,'update']);
//      Route::delete('/outcomes/{id}',[OutcomeController::class,'destroy']);
//       Route::post('/sort-outcomes',[OutcomeController::class,'sortOutcomes']);

//       // requirement routes
//      Route::get('/requirements',[RequirementController::class,'index']);
//      Route::post('/requirements',[RequirementController::class,'store']);
//      Route::put('/requirements/{id}',[RequirementController::class,'update']);
//      Route::delete('/requirements/{id}',[RequirementController::class,'destroy']);
//      Route::post('/sort-requirements',[RequirementController::class,'sortRequirements']);

//       // Chapters routes
//      Route::get('/chapters',[ChapterController::class,'index']);
//      Route::post('/chapters',[ChapterController::class,'store']);
//      Route::put('/chapters/{id}',[ChapterController::class,'update']);
//      Route::delete('/chapters/{id}',[ChapterController::class,'destroy']);
//       Route::post('/sort-chapters',[ChapterController::class,'sortChapters']);

//       // Lessons routes
//      Route::post('/lessons',[LessonController::class,'store']);
//       Route::get('/lessons/{id}',[LessonController::class,'show']);
//      Route::put('/lessons/{id}',[LessonController::class,'update']);
//       Route::delete('/lessons/{id}',[LessonController::class,'destroy']);
//       Route::post('/save-lesson-video/{id}',[LessonController::class,'saveVideo']);
//     Route::post('/sort-lessons',[LessonController::class,'sortLessons']);

//     //after login user details 
//     Route::get('/my-courses',[AccountController::class,'courses']);
//     Route::get('/enrollments',[AccountController::class,'enrollments']);
//     Route::post('/enroll-course',[HomeController::class,'enroll']);
//     Route::get('/enroll/{id}',[AccountController::class,'course']);
//     Route::post('/save-activity',[AccountController::class,'saveUserActivity']);
//     Route::post('/mark-as-complete',[AccountController::class,'markAsComplete']);
//     Route::post('/leave-rating',[AccountController::class,'saveRating']);
//     Route::get('/fetch-user',[AccountController::class,'fetchUser']);
//     Route::post('/update-user',[AccountController::class,'updateUser']);
//     Route::post('/update-password',[AccountController::class,'updatePassword']);

     
// });

Route::group(['middleware' => ['auth:sanctum']], function () {

    // ✅ Instructor/Admin only routes
    Route::group(['middleware' => ['role:admin,instructor']], function () {

        Route::post('/courses',[CourseController::class,'store']);
        Route::get('/courses/meta-data',[CourseController::class,'metaData']);
        Route::get('/courses/{id}',[CourseController::class,'show']);
        Route::put('/courses/{id}',[CourseController::class,'update']);
        Route::post('/save-course-image/{id}',[CourseController::class,'saveCourseImage']);
        Route::post('/change-course-status/{id}',[CourseController::class,'changeStatus']);
        Route::delete('/courses/{id}',[CourseController::class,'destroy']);

        Route::get('/outcomes',[OutcomeController::class,'index']);
        Route::post('/outcomes',[OutcomeController::class,'store']);
        Route::put('/outcomes/{id}',[OutcomeController::class,'update']);
        Route::delete('/outcomes/{id}',[OutcomeController::class,'destroy']);
        Route::post('/sort-outcomes',[OutcomeController::class,'sortOutcomes']);

        Route::get('/requirements',[RequirementController::class,'index']);
        Route::post('/requirements',[RequirementController::class,'store']);
        Route::put('/requirements/{id}',[RequirementController::class,'update']);
        Route::delete('/requirements/{id}',[RequirementController::class,'destroy']);
        Route::post('/sort-requirements',[RequirementController::class,'sortRequirements']);

        Route::get('/chapters',[ChapterController::class,'index']);
        Route::post('/chapters',[ChapterController::class,'store']);
        Route::put('/chapters/{id}',[ChapterController::class,'update']);
        Route::delete('/chapters/{id}',[ChapterController::class,'destroy']);
        Route::post('/sort-chapters',[ChapterController::class,'sortChapters']);

        Route::post('/lessons',[LessonController::class,'store']);
        Route::get('/lessons/{id}',[LessonController::class,'show']);
        Route::put('/lessons/{id}',[LessonController::class,'update']);
        Route::delete('/lessons/{id}',[LessonController::class,'destroy']);
        Route::post('/save-lesson-video/{id}',[LessonController::class,'saveVideo']);
        Route::post('/sort-lessons',[LessonController::class,'sortLessons']);

        Route::get('/my-courses',[AccountController::class,'courses']);
    });

    // ✅ Any logged in user routes (Student/Instructor/Admin)
    
    Route::get('/enrollments',[AccountController::class,'enrollments']);
    Route::post('/enroll-course',[HomeController::class,'enroll']);
    Route::get('/enroll/{id}',[AccountController::class,'course']);
    Route::post('/save-activity',[AccountController::class,'saveUserActivity']);
    Route::post('/mark-as-complete',[AccountController::class,'markAsComplete']);
    Route::post('/leave-rating',[AccountController::class,'saveRating']);
    Route::get('/fetch-user',[AccountController::class,'fetchUser']);
    Route::post('/update-user',[AccountController::class,'updateUser']);
    Route::post('/update-password',[AccountController::class,'updatePassword']);
});