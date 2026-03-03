<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Auth;

class LessonController extends Controller
{

    // This method will save/store a lesson
      public function store(Request $request){

        $validator = Validator::make($request->all(),[
            'chapter' => 'required',
            'lesson' => 'required'
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => 404,
                'errors' => $validator->errors()
            ],404);
        }
        $lesson = new Lesson();
        $lesson->chapter_id = $request->chapter;
        $lesson->title = $request->lesson;
        $lesson->sort_order = 1000;
        $lesson->status = $request->status;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Lesson has been created successfully.'
        ], 200);
    }

    //This method will fetch lesson data
    public function show($id){

       $lesson = Lesson::find($id);
        if($lesson == null){
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found.'
            ], 404);
        }
        return response()->json([
                'status' => 200,
                'data' => $lesson,
            ],200);
    
    }


    // This method will update a lesson
      public function update($id, Request $request){

          // 🔒 Check authentication


        $lesson = Lesson::find($id);
        if($lesson == null){
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found.'
            ], 404);
        }
        
        $validator = Validator::make($request->all(),[
            'chapter_id' => 'required',
            'lesson' => 'required'
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }
       
        $lesson->chapter_id = $request->chapter_id;
        $lesson->title = $request->lesson;
        $lesson->is_free_preview = ($request->free_preview == false) ? 'no' : 'yes';
        $lesson->duration = $request->duration;
        $lesson->title = $request->lesson;
        $lesson->description = $request->description;
        $lesson->status = $request->status;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Lesson updated successfully.'
        ], 200);
    }

     //This method will delete a lesson video
      public function destroy($id){
        $lesson = Lesson::find($id);
          if($lesson == null){
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found.'
            ], 404);
        }
        $chapterId = $lesson->chapter_id;
        $lesson->delete();

        $chapter = Chapter::where('id',$chapterId)->with('lessons')->first();

        return response()->json([
            'status' => 200,
            'chapter' => $chapter,
            'message' => 'Lesson has been deleted successfully.'
        ], 200);
      
    }

     public function saveVideo($id, Request $request){

        $lesson = Lesson::find($id);
            
        if($lesson == null){
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(),[
            'video' => 'required|mimes:mp4|max:2048000'
        ]);
            if($validator->fails()){
                return response()->json([
                    'status' => 400,
                    'errors' => $validator->errors()
                ],400);
            }

            if($lesson->video != ""){
                if(File::exists(public_path('uploads/course/videos'.$lesson->video))){
                     File::delete(public_path('uploads/course/videos'.$lesson->video));
                }

            }

            $video = $request->video;
            $ext = $video->getClientOriginalExtension();
            $videoName = strtotime('now').'-'.$id.'.'.$ext;
            $video->move(public_path('uploads/course/videos'), $videoName);


            $lesson->video = $videoName;
            $lesson->save();

            return response()->json([
                'status' => 200,
                'data' => $lesson,
                'message' => 'Video has been uploaded successfully.'
            ], 200);

    }
        //This method will sort lessons
     public function sortLessons(Request $request){

        $chapterId='';

        if(!empty($request->lessons)){
            foreach($request->lessons as $key => $lesson){
                $chapterId = $lesson['chapter_id'];
                Lesson::where('id', $lesson['id'])->update(['sort_order' => $key]);
            }
            }
             $chapter = Chapter::where('id',$chapterId)->with('lessons')->first();

            return response()->json([
                'status' => 200,
                'chapter' => $chapter,
                'message' => 'Order updated successfully.'
            ], 200);
        }
}
