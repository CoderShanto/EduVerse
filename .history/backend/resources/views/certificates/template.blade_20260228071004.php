<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Certificate</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            text-align: center;
            background: #ffffff;
        }

        .certificate-container {
            border: 12px solid #1e293b;
            padding: 50px;
            margin: 30px;
        }

        .title {
            font-size: 40px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 20px;
        }

        .subtitle {
            font-size: 18px;
            margin-bottom: 30px;
        }

        .student-name {
            font-size: 30px;
            font-weight: bold;
            margin: 20px 0;
            color: #2563eb;
        }

        .course-title {
            font-size: 22px;
            font-weight: bold;
            margin: 20px 0;
        }

        .footer {
            margin-top: 40px;
            font-size: 14px;
            color: #555;
        }

        .signature {
            margin-top: 50px;
            font-weight: bold;
        }

    </style>
</head>
<body>

<div class="certificate-container">

    <div class="title">Certificate of Completion</div>

    <div class="subtitle">
        This is proudly presented to
    </div>

    <div class="student-name">
        {{ $studentName }}
    </div>

    <div class="subtitle">
        for successfully completing the course
    </div>

    <div class="course-title">
        {{ $courseTitle }}
    </div>

    <div class="footer">
        Certificate No: <b>{{ $certificateNo }}</b><br>
        Issued on: {{ $issueDate }}
    </div>

    <div class="signature">
        ___________________________<br>
        LMS Platform
    </div>

</div>

</body>
</html>