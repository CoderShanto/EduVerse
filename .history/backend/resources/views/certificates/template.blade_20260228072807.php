<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Certificate of Completion</title>
    <!-- Importing Premium Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    
    <style>
        /* Reset and Base Settings */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            /* Simulating paper texture */
            background-color: #fdfbf7; 
            font-family: 'Playfair Display', serif;
            color: #2c3e50;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        /* Main Container - The Paper */
        .certificate-container {
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px;
            position: relative;
            background: #fff;
            /* Complex Border Design */
            border: 5px solid #1a3c5e;
            outline: 10px solid #fdfbf7; /* Gap between borders */
            outline-offset: -15px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        /* Inner decorative border line */
        .certificate-container::before {
            content: "";
            position: absolute;
            top: 15px; left: 15px; right: 15px; bottom: 15px;
            border: 2px solid #c5a059; /* Gold color */
            pointer-events: none;
        }

        /* Background Watermark Pattern */
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 300px;
            color: rgba(26, 60, 94, 0.03);
            font-family: 'Cinzel', serif;
            z-index: 0;
            pointer-events: none;
        }

        /* Content Wrapper to sit above watermark */
        .content-wrapper {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 40px 20px;
        }

        /* Header Section */
        .header-logo {
            font-size: 14px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #c5a059;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .title {
            font-family: 'Great Vibes', cursive;
            font-size: 70px;
            color: #1a3c5e;
            margin-bottom: 10px;
            line-height: 1.2;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .subtitle {
            font-family: 'Cinzel', serif;
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #555;
            margin-bottom: 30px;
        }

        /* Student Name Styling */
        .student-name {
            font-family: 'Playfair Display', serif;
            font-size: 42px;
            font-weight: 700;
            color: #000;
            border-bottom: 2px solid #c5a059;
            display: inline-block;
            padding: 0 40px 10px 40px;
            margin: 20px 0 40px 0;
            min-width: 400px;
        }

        /* Course Description */
        .course-text {
            font-size: 18px;
            font-style: italic;
            color: #444;
            margin-bottom: 10px;
        }

        .course-title {
            font-size: 24px;
            font-weight: bold;
            color: #1a3c5e;
            margin-bottom: 50px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Footer Section */
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 60px;
            padding: 0 50px;
            border-top: 1px solid #eee;
            padding-top: 30px;
        }

        .date-box, .id-box {
            text-align: left;
            font-size: 14px;
            color: #666;
        }
        
        .id-box {
            text-align: right;
        }

        .signature-area {
            text-align: center;
        }

        .signature-line {
            width: 200px;
            border-top: 1px solid #333;
            margin: 0 auto 10px auto;
        }

        .signature-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            color: #1a3c5e;
        }

        /* CSS Gold Seal */
        .seal {
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, #ffd700 0%, #b8860b 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 4px dashed #fff;
            margin: 0 auto;
            color: #5c4003;
            font-weight: bold;
            font-size: 12px;
            text-align: center;
            line-height: 1.2;
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
        }

    </style>
</head>
<body>

<div class="certificate-container">
    
    <!-- Subtle Background Watermark -->
    <div class="watermark">CERTIFICATE</div>

    <div class="content-wrapper">
        
        <div class="header-logo">Official Document of Achievement</div>

        <div class="title">Certificate of Completion</div>

        <div class="subtitle">
            This certificate is proudly presented to
        </div>

        <div class="student-name">
            {{ $studentName }}
        </div>

        <div class="course-text">
            For the successful completion of the course
        </div>

        <div class="course-title">
            {{ $courseTitle }}
        </div>

        <!-- Footer with Date, ID, and Signature -->
        <div class="footer">
            <div class="date-box">
                <strong>Issued On:</strong><br>
                {{ $issueDate }}
            </div>

            <div class="signature-area">
                <!-- You can replace this text with an <img> tag for a real signature -->
                <div style="font-family: 'Great Vibes', cursive; font-size: 24px; margin-bottom: -10px;">Director Signature</div>
                <div class="signature-line"></div>
                <div class="signature-title">Authorized Signature</div>
            </div>

            <div class="id-box">
                <strong>Certificate ID:</strong><br>
                {{ $certificateNo }}
            </div>
        </div>

        <!-- Decorative Gold Seal -->
        <div class="seal">
            OFFICIAL<br>SEAL
        </div>

    </div>
</div>

</body>
</html>