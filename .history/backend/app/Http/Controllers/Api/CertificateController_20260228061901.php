<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    // ✅ list my certificates
    public function index(Request $request)
    {
        $user = $request->user();

        $items = Certificate::where('user_id', $user->id)
            ->with(['course:id,title,image'])
            ->orderByDesc('id')
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'certificate_no' => $c->certificate_no,
                    'status' => $c->status,
                    'issued_at' => optional($c->issued_at)->toDateTimeString(),
                    'pdf_url' => $c->pdf_path ? asset($c->pdf_path) : null,
                    'course' => [
                        'id' => $c->course?->id,
                        'title' => $c->course?->title,
                        'course_small_image' => $c->course?->course_small_image ?? '',
                    ],
                ];
            });

        return response()->json([
            'status' => 200,
            'data' => $items,
        ], 200);
    }

    // ✅ (optional) download if you store pdf in public path
    public function download(Request $request, $id)
    {
        $user = $request->user();

        $cert = Certificate::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$cert) {
            return response()->json(['status' => 404, 'message' => 'Certificate not found'], 404);
        }

        if (!$cert->pdf_path) {
            return response()->json(['status' => 404, 'message' => 'PDF not generated yet'], 404);
        }

        // if saved under public/ path, you can return URL directly
        return response()->json([
            'status' => 200,
            'data' => [
                'download_url' => asset($cert->pdf_path),
            ],
        ], 200);
    }
}