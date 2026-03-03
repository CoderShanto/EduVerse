<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityEmailDomain;

class AccountController extends Controller
{
   public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|min:5',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 400,
            'errors' => $validator->errors()
        ], 400);
    }

    // ✅ Normalize email + extract domain
    $email = strtolower(trim($request->email));
    $domain = substr(strrchr($email, "@"), 1);

    // ✅ Find matching active university email domain
    $domainRow = UniversityEmailDomain::with('university')
        ->where('domain', $domain)
        ->where('is_active', true)
        ->first();

    if (!$domainRow || !$domainRow->university || !$domainRow->university->is_active) {
        return response()->json([
            'status' => 422,
            'message' => 'Please use a valid university email address.'
        ], 422);
    }

    // ✅ Save user
    $user = new User();
    $user->name = $request->name;
    $user->email = $email;
    $user->password = Hash::make($request->password);
    $user->role = 'student';
    $user->university_id = $domainRow->university_id;
    $user->save();

    return response()->json([
        'status' => 200,
        'message' => 'User registered successfully.'
    ], 200);
}
    public function authenticate(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 422,
            'errors' => $validator->errors()
        ], 422);
    }

    $email = strtolower(trim($request->email));

    $user = User::with('university')->where('email', $email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'status' => 401,
            'message' => 'Invalid email or password.'
        ], 401);
    }

    // Optional: remove old tokens (keeps only one active login)
    // $user->tokens()->delete();

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'status' => 200,
        'message' => 'Login successful.',
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'university_id' => $user->university_id,
            'university' => $user->university ? [
                'id' => $user->university->id,
                'name' => $user->university->name,
                'short_name' => $user->university->short_name,
            ] : null,
        ],
    ], 200);
}
    public function courses(Request $request)
{
    $user = $request->user();

    $query = Course::query()
        ->withCount('reviews')
        ->withCount('enrollments')
        ->withSum('reviews', 'rating')
        ->with('level');

    // ✅ Admin gets ALL courses, Instructor gets only own courses
    if ($user->role !== 'admin') {
        $query->where('user_id', $user->id);
    }

    $courses = $query->latest()->get();

    $courses->map(function ($course) {
        $course->rating = $course->reviews_count > 0
            ? number_format(($course->reviews_sum_rating / $course->reviews_count), 1)
            : "0.0";
        return $course;
    });

    return response()->json([
        'status' => 200,
        'courses' => $courses
    ], 200);
}

    public function enrollments(Request $request){  
        $enrollments = Enrollment::where('user_id', $request->user()->id)
        ->with(['course' => function ($query){
            $query->withCount('reviews');
            $query->withSum('reviews','rating');
            $query->withCount('enrollments');
        },'course.level'])
        ->get();

          $enrollments->map(function($enrollment){
            $enrollment->course->rating = $enrollment->course->reviews_count > 0 ?
              number_format(($enrollment->course->reviews_sum_rating/$enrollment->course->reviews_count),1) : "0.0";
        });


            return response()->json([
                    'status' => 200,
                    'data' => $enrollments
                ],200);
    }

   public function course($id, Request $request)
{
    $user = $request->user();

    // ✅ must be enrolled (student)
    // (optional: allow admin/instructor to view, but for now keep strict)
    $isEnrolled = Enrollment::where([
        'user_id' => $user->id,
        'course_id' => $id,
    ])->exists();

    if (!$isEnrolled) {
        return response()->json([
            'status' => 403,
            'message' => 'You are not enrolled in this course.'
        ], 403);
    }

    $course = Course::where('id', $id)
        ->withCount('chapters')
        ->with([
            'category',
            'level',
            'language',
            'chapters' => function ($query) {
                $query->withCount(['lessons' => function ($q) {
                    $q->where('status', 1)->whereNotNull('video');
                }]);
                $query->withSum(['lessons' => function ($q) {
                    $q->where('status', 1)->whereNotNull('video');
                }], 'duration');
            },
            'chapters.lessons' => function ($q) {
                $q->where('status', 1)->whereNotNull('video');
            }
        ])
        ->first();

    if (!$course) {
        return response()->json([
            'status' => 404,
            'message' => 'Course not found.'
        ], 404);
    }

    $totalLessons = $course->chapters->sum('lessons_count');

    // ✅ create default active lesson if no activity exists
    $activeLesson = null;

    $activityCount = Activity::where([
        'user_id' => $user->id,
        'course_id' => $id
    ])->count();

    if ($activityCount == 0) {
        $chapter = Chapter::where('course_id', $id)
            ->orderBy('sort_order', 'asc')
            ->first();

        if ($chapter) {
            $lesson = Lesson::where('chapter_id', $chapter->id)
                ->where('status', 1)
                ->whereNotNull('video')
                ->orderBy('sort_order', 'asc')
                ->first();

            if ($lesson) {
                Activity::create([
                    'course_id' => $id,
                    'user_id' => $user->id,
                    'chapter_id' => $chapter->id,
                    'lesson_id' => $lesson->id,
                    'is_last_watched' => 'yes',
                    'is_completed' => 'no'
                ]);

                $activeLesson = $lesson;
            }
        }
    } else {
        $activeLesson = Activity::where([
            'user_id' => $user->id,
            'course_id' => $id,
            'is_last_watched' => 'yes'
        ])->with('lesson')->latest()->first()?->lesson;
    }

    $completeLessons = Activity::where([
        'user_id' => $user->id,
        'course_id' => $id,
        'is_completed' => 'yes'
    ])->pluck('lesson_id')->toArray();

    $completeLessonsCount = count($completeLessons);

    // ✅ prevent divide by zero
    $progress = $totalLessons > 0
        ? round(($completeLessonsCount / $totalLessons) * 100)
        : 0;

    return response()->json([
        'status' => 200,
        'data' => $course,
        'progress' => $progress,
        'activeLesson' => $activeLesson,
        'completedLessons' => $completeLessons
    ], 200);
}
public function saveUserActivity(Request $request){

    Activity::where([
        'user_id' => $request->user()->id,
        'course_id' => $request->course_id
    ])->update(['is_last_watched' => 'no']);

    Activity::updateOrInsert(
        [
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'chapter_id' => $request->chapter_id,
            'lesson_id' => $request->lesson_id
        ],
        [
            'is_last_watched' => 'yes'
        ]
        );

        return response()->json([
            'status' => 200,
            'message' => "Activity saved successfully."
        ],200);
}


 public function markAsComplete(Request $request)
{
    try {
        $user = $request->user();

        // ✅ Basic validation (you can also move this to FormRequest)
        $request->validate([
            'course_id' => 'required|integer',
            'chapter_id' => 'required|integer',
            'lesson_id' => 'required|integer',
        ]);

        $courseId  = (int) $request->course_id;
        $chapterId = (int) $request->chapter_id;
        $lessonId  = (int) $request->lesson_id;

        // ✅ Anti-cheat #1: student must be enrolled in the course
        $enrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->exists();

        if (!$enrolled) {
            return response()->json([
                'status' => 403,
                'message' => 'You are not enrolled in this course.',
            ], 403);
        }

        // ✅ Anti-cheat #2: lesson must belong to this course (via chapter)
        // ✅ Anti-cheat #3: lesson must be eligible (published + has video)
        $lesson = Lesson::where('id', $lessonId)
            ->where('chapter_id', $chapterId)
            ->where('status', 1)
            ->whereNotNull('video')
            ->whereHas('chapter', function ($q) use ($courseId) {
                $q->where('course_id', $courseId);
            })
            ->first();

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid lesson (not in this course) or not eligible to complete.',
            ], 404);
        }

        // ✅ Mark as complete
        // If activity row might not exist, do updateOrCreate instead of update:
        Activity::updateOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $courseId,
                'chapter_id' => $chapterId,
                'lesson_id' => $lessonId,
            ],
            [
                'is_completed' => 'yes',
            ]
        );

        // ✅ Fetch completed lessons list (IDs)
        $completedLessons = Activity::where([
                'user_id' => $user->id,
                'course_id' => $courseId,
                'is_completed' => 'yes'
            ])
            ->pluck('lesson_id')
            ->toArray();

        // ✅ Count only eligible lessons completed (published + has video AND belongs to course)
        $completedLessonsCount = Activity::where([
                'user_id' => $user->id,
                'course_id' => $courseId,
                'is_completed' => 'yes'
            ])
            ->whereIn('lesson_id', function ($sub) use ($courseId) {
                $sub->select('lessons.id')
                    ->from('lessons')
                    ->join('chapters', 'chapters.id', '=', 'lessons.chapter_id')
                    ->where('chapters.course_id', $courseId)
                    ->where('lessons.status', 1)
                    ->whereNotNull('lessons.video');
            })
            ->count();

        // ✅ Total eligible lessons in course
        // (This is more efficient than loading full course->chapters->lessons)
        $totalLessons = Lesson::join('chapters', 'chapters.id', '=', 'lessons.chapter_id')
            ->where('chapters.course_id', $courseId)
            ->where('lessons.status', 1)
            ->whereNotNull('lessons.video')
            ->count();

        // ✅ Calculate progress safely
        $progress = 0;
        if ($totalLessons > 0) {
            $progress = (int) round(($completedLessonsCount / $totalLessons) * 100);
            if ($progress > 100) $progress = 100;
        }

        // ✅ Auto-issue certificate when progress hits 100 (only once)
        if ($progress >= 100) {
            $alreadyIssued = Certificate::where('user_id', $user->id)
                ->where('course_id', $courseId)
                ->exists();

            if (!$alreadyIssued) {
                $certNo = 'CERT-' . date('Y') . '-' . str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT);

                Certificate::create([
                    'user_id' => $user->id,
                    'course_id' => $courseId,
                    'certificate_no' => $certNo,
                    'issued_at' => Carbon::now(),
                    'status' => 'issued',
                    'pdf_path' => null, // generate later
                ]);
            }
        }

        return response()->json([
            'status' => 200,
            'completedLessons' => $completedLessons,
            'progress' => $progress,
            'message' => "Congratulations! Lesson marked as complete successfully."
        ], 200);

    } catch (\Throwable $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Server error marking lesson as complete.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

   public function saveRating(Request $request){
    
    $course = Course::find($request->course_id);

    if($course == null){
        return response()->json([
            'status' => 404,
            'message' => "Course not found."
        ],404);
    }

   $count = Review::where('course_id',$request->course_id)
    ->where('user_id',$request
    ->user()->id
)->count();

       if($count > 0){
        return response()->json([
            'status' => 200,
            'message' => "You have already rated this course."
        ],200);
    }

    $review = new Review();
    $review->comment = $request->comment;
    $review->rating = $request->rating;
    $review->user_id = $request->user()->id;
    $review->course_id = $request->course_id;
    $review->status = 1;
    $review->save();

    return response()->json([
        'status' => 200,
        'message' => "Thank you for your feedback."
    ],200);
   }

   public function fetchUser(Request $request){

    $user = User::find($request->user()->id);

    if($user == null){
        return response()->json([
            'status' => 404,
            'message' => "User not found."
        ],404);
    }

    return response()->json([
        'status' => 200,
        'data' => $user
    ],200);
   }

   public function updateUser(Request $request){

    $user = User::find($request->user()->id);

    if($user == null){
        return response()->json([
            'status' => 404,
            'message' => "User not found."
        ],404);
    }

    $validator = Validator::make($request->all(),[
        'name' => 'required|min:5',
        'email' => 'required|email|unique:users,email,'.$request->user()->id.',id',
        // 'password' => 'sometimes|required',
    ]);
    //This will return validation errors
    if($validator->fails()){
        return response()->json([
            'status' => 400,
            'errors' => $validator->errors()
        ],400);
    }
   
    $user->name = $request->name;
    $user->email = $request->email;
    $user->save();

    return response()->json([
        'status' => 200,
        'message' => "Profile updated successfully."
    ],200);

   }

   public function updatePassword(Request $request)
{
    $user = $request->user();

    $validator = Validator::make($request->all(), [
        'old_password' => 'required',
        'new_password' => 'required|min:5|confirmed', 
        // ✅ requires field: new_password_confirmation
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 400,
            'errors' => $validator->errors()
        ], 400);
    }

    if (!Hash::check($request->old_password, $user->password)) {
        return response()->json([
            'status' => 400,
            'errors' => ['old_password' => ['The old password is incorrect']]
        ], 400);
    }

    // ✅ prevent reuse
    if (Hash::check($request->new_password, $user->password)) {
        return response()->json([
            'status' => 400,
            'errors' => ['new_password' => ['New password cannot be same as old password']]
        ], 400);
    }

    $user->password = Hash::make($request->new_password);
    $user->save();

    return response()->json([
        'status' => 200,
        'message' => "Password updated successfully."
    ], 200);
}
   
}
