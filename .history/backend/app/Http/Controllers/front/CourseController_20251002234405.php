<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Language;
use App\Models\Lesson;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class CourseController extends Controller
{
    //The method will return all course for a specific user
    public function index(){


    }
    
    //This method will store/save a course in database as a draft
    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'title' => 'required|min:5'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }
        //This will save course info in database
        $course = new Course();
        $course->title = $request->title;
        $course->status = 0; //0 means draft
        $course->user_id = $request->user()->id; //Assuming user is authenticated
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course has been created successfully.'
        ], 200);
    }
    public function show($id){
        //This method will return a specific course
        $course = Course::with(['chapters','chapters.lessons'])->find($id);
        if($course == null){
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $course
        ], 200);
    }
    //This method will return categories/levels/languages
    public function metaData(){
            $categories = Category::all();
            $levels = Level::all();
            $languages = Language::all();

               return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
           
        ], 200);


    }

    //This method will update a course basic data
    public function update( $id, Request $request){

        $course = Course::find($id);
        if($course == null){
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(),[
            'title' => 'required|min:5',
            'category' => 'required',
            'level' => 'required',
            'language' => 'required',
            'sell_price' => 'required',
            

        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }
        //This will update course info in database
        $course->title = $request->title;
        $course->category_id = $request->category;
        $course->level_id = $request->level;
        $course->language_id = $request->language;
        $course->price = $request->sell_price;
        $course->cross_price = $request->cross_price;
        $course->description = $request->description;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course updated successfully.'
        ], 200);
    }

    //This method will upload course image
    public function saveCourseImage($id, Request $request){

        $course = Course::find($id);
         
        if($course == null){
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(),[
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg'
        ]);
            if($validator->fails()){
                return response()->json([
                    'status' => 400,
                    'errors' => $validator->errors()
                ],400);
            }

            if($course->image != ""){
                if(File::exists(public_path('uploads/course/'.$course->image))){
                     File::delete(public_path('uploads/course/'.$course->image));
                }

                 if(File::exists(public_path('uploads/course/small/'.$course->image))){
                      File::delete(public_path('uploads/course/small/'.$course->image));
                }
               
            }

            $image = $request->image;
            $ext = $image->getClientOriginalExtension();
            $imageName = strtotime('now').'-'.$id.'.'.$ext;
            $image->move(public_path('uploads/course'), $imageName);

            //Create small Thumbnail
            $manager = new ImageManager(Driver::class);
                $img = $manager->read(public_path('uploads/course/'.$imageName));

                // crop the best fitting 5:3 (600x360) ratio and resize to 600x360 pixel
                $img->cover(750, 450);
                $img->save(public_path('uploads/course/small/'.$imageName));


            $course->image = $imageName;
            $course->save();

            return response()->json([
                'status' => 200,
                'data' => $course,
                'message' => 'Course image has been uploaded successfully.'
            ], 200);

    }

    //This method will publish/unpublish course
    public function changeStatus($id, Request $request){

        $course = Course::find($id);
         
        if($course == null){
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }
        //at least one chapter is required
        $chapters = Chapter::where('course_id',$id)->pluck('id')->toArray();
        if(count($chapters) == 0){
              return response()->json([
                'status' => 200,
                'course' => $course,
                'message' => 'At least one chapter is required to publish a course.'
            ], 200);
             
        }
        //At least one lesson with video is required to publish a course
        $lessonCount = Lesson::whereIn('chapter_id', $chapters)
        ->where('status', 1)
        ->whereNotNull('video')
        ->count();

        if( $lessonCount == 0){
              return response()->json([
                'status' => 200,
                'course' => $course,
                'message' => 'At least one lesson with video is required to publish this course.'
            ], 200);
             
        }

        $course->status = $request->status;
        $course->save();

        $message = ($course->status == 1) ? 'Course published successfully' : 'Course unpublished successfully';

         return response()->json([
            'status' => 200,
            'course' => $course,
            'message' => $message
        ], 200);

    }

    //This method will destroy the course
    public function destroy($id, Request $request){
        $course = Course::where('id',$id)
        ->where('user_id',$request->user()->id)->first();

        if($course == null){
             return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        //
        Chapter::where('course_id',$course->id)->get();

        if(!empty($chapters)){
            foreach($chapters as $chapter){
                $lessons = Lesson::where('chapter_id', $chapter->id)->get();
                if(!empty($lessons)){
                    foreach($lessons as $lesson){

                        if($lesson->video != ""){
                            
                                if(File::exists(public_path('uploads/course/videos'.$lesson->video))){
                                File::delete(public_path('uploads/course/videos'.$lesson->video));
                                    }
     
                        }

                    }
                }

            }

        }
                        if($course->image != ""){
                            
                                if(File::exists(public_path('uploads/course/'.$course->image))){
                                File::delete(public_path('uploads/course/'.$course->image));
                                    }
     
                        }
                        $course->delete();

                        return response()->json([
                'status' => 200,
                'message' => 'Course deleted successfully.'
            ], 200);
    }

}
