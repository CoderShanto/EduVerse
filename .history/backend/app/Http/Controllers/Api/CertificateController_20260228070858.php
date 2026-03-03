<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificateController extends Controller
{
    // ✅ List certificates
    public function index(Request $request)
    {
        $user = $request->user();

        $items = Certificate::where('user_id', $user->id)
            ->with('course:id,title')
            ->orderByDesc('id')
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'certificate_no' => $c->certificate_no,
                    'status' => $c->status,
                    'issued_at' => optional($c->issued_at)->toDateTimeString(),
                    'course' => [
                        'id' => $c->course?->id,
                        'title' => $c->course?->title,
                    ],
                ];
            });

        return response()->json([
            'status' => 200,
            'data' => $items,
        ], 200);
    }

    // ✅ Generate & Download PDF
    public function download(Request $request, $id)
    {
        $user = $request->user();

        $certificate = Certificate::with('course')
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$certificate) {
            return response()->json([
                'status' => 404,
                'message' => 'Certificate not found'
            ], 404);
        }

        $pdf = Pdf::loadView('certificates.template', [
            'studentName' => $user->name,
            'courseTitle' => $certificate->course->title ?? 'Course',
            'certificateNo' => $certificate->certificate_no,
            'issueDate' => $certificate->issued_at->format('F d, Y'),
        ]);

        return $pdf->download('Certificate-' . $certificate->certificate_no . '.pdf');
    }
}