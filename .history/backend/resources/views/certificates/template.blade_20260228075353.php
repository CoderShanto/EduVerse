<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Certificate of Completion</title>
    <style>
        * { margin: 0; padding: 0; }

        @page {
            size: A4 landscape;
            margin: 0;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            width: 297mm;
            height: 210mm;
            background-color: #fdf6dc;
            color: #1a0e00;
        }

        /* ── Outer page wrapper ── */
        .page {
            width: 297mm;
            height: 210mm;
            background-color: #fdf6dc;
            position: relative;
        }

        /* ══ BORDER FRAMES ══ */
        .border-1 {
            position: absolute;
            top: 5mm; left: 5mm; right: 5mm; bottom: 5mm;
            border: 3px solid #8B6200;
        }
        .border-2 {
            position: absolute;
            top: 7.5mm; left: 7.5mm; right: 7.5mm; bottom: 7.5mm;
            border: 1px solid #c49010;
        }
        .border-3 {
            position: absolute;
            top: 9.5mm; left: 9.5mm; right: 9.5mm; bottom: 9.5mm;
            border: 1px solid #e8c84a;
        }

        /* ══ CORNER ORNAMENTS ══ */
        .corner-tl { position: absolute; top: 3.5mm;  left: 3.5mm; }
        .corner-tr { position: absolute; top: 3.5mm;  right: 3.5mm; }
        .corner-bl { position: absolute; bottom: 3.5mm; left: 3.5mm; }
        .corner-br { position: absolute; bottom: 3.5mm; right: 3.5mm; }

        /* ══ DECORATIVE SIDE BARS ══ */
        .bar-left {
            position: absolute;
            top: 14mm; bottom: 14mm; left: 12.5mm;
            width: 3px;
            background-color: #c49010;
        }
        .bar-right {
            position: absolute;
            top: 14mm; bottom: 14mm; right: 12.5mm;
            width: 3px;
            background-color: #c49010;
        }

        /* ══ WATERMARK ══ */
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -35mm;
            margin-left: -35mm;
            width: 70mm;
            height: 70mm;
            opacity: 0.06;
        }

        /* ══ MAIN CONTENT TABLE ══ */
        .main {
            position: absolute;
            top: 13mm; bottom: 13mm;
            left: 16mm; right: 16mm;
            width: 265mm;
        }

        /* ── HEADER ── */
        .header {
            text-align: center;
            padding-top: 1mm;
        }

        .org-name {
            font-size: 7.5pt;
            letter-spacing: 5px;
            color: #8B6200;
            text-transform: uppercase;
        }

        .rule-table {
            width: 100%;
            margin: 2mm 0 2mm 0;
        }
        .rule-cell-line {
            height: 1px;
            background-color: #c49010;
        }
        .rule-cell-diamond {
            width: 8px;
            text-align: center;
            padding: 0 2mm;
        }
        .diamond-shape {
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #a87800;
            transform: rotate(45deg);
            font-size: 0;
        }

        .cert-title {
            font-family: DejaVu Serif, serif;
            font-size: 34pt;
            font-weight: bold;
            color: #1c0e00;
            line-height: 1;
        }

        .cert-tagline {
            font-size: 7pt;
            letter-spacing: 5px;
            color: #8B6200;
            text-transform: uppercase;
            margin-top: 1.5mm;
        }

        /* ── MIDDLE ── */
        .middle {
            text-align: center;
            margin-top: 4mm;
        }

        .presented-lbl {
            font-size: 8pt;
            letter-spacing: 4px;
            color: #7a5400;
            text-transform: uppercase;
        }

        .student-name {
            font-family: DejaVu Serif, serif;
            font-size: 28pt;
            font-weight: bold;
            color: #1a3570;
            letter-spacing: 0.5px;
            padding: 1mm 0 0.5mm;
        }

        .completing-lbl {
            font-size: 8pt;
            letter-spacing: 3px;
            color: #7a5400;
            text-transform: uppercase;
            margin-bottom: 1.5mm;
        }

        .course-title {
            font-family: DejaVu Serif, serif;
            font-size: 17pt;
            font-weight: bold;
            color: #1c0e00;
            line-height: 1.3;
        }

        /* ── FOOTER ── */
        .footer-table {
            width: 100%;
            margin-top: 5mm;
        }
        .footer-left-col  { width: 90mm; vertical-align: bottom; }
        .footer-mid-col   { width: 85mm; vertical-align: bottom; text-align: center; }
        .footer-right-col { width: 90mm; vertical-align: bottom; text-align: center; }

        .meta-lbl {
            font-size: 6.5pt;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #8B6200;
        }
        .meta-val {
            font-size: 9pt;
            font-weight: bold;
            color: #1c0e00;
            margin-bottom: 2.5mm;
        }

        .sig-line-table { width: 60mm; margin: 0 auto; }
        .sig-line-cell  {
            border-top: 1px solid #8B6200;
            padding-top: 2mm;
        }
        .sig-name {
            font-family: DejaVu Serif, serif;
            font-size: 10.5pt;
            font-weight: bold;
            color: #1c0e00;
        }
        .sig-role {
            font-size: 7pt;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #8B6200;
            margin-top: 1mm;
        }

    </style>
</head>
<body>
<div class="page">

    <!-- Borders -->
    <div class="border-1"></div>
    <div class="border-2"></div>
    <div class="border-3"></div>

    <!-- Side decorative bars -->
    <div class="bar-left"></div>
    <div class="bar-right"></div>

    <!-- ══ CORNER ORNAMENTS ══ -->
    <!-- Top Left -->
    <div class="corner-tl">
        <svg width="26mm" height="26mm" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="6" fill="#8B6200"/>
            <path d="M100,0 Q0,0 0,100" fill="none" stroke="#8B6200" stroke-width="2.2"/>
            <path d="M75,0  Q0,0 0,75"  fill="none" stroke="#c49010" stroke-width="1.3"/>
            <path d="M50,0  Q0,0 0,50"  fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.9"/>
            <path d="M28,0  Q0,0 0,28"  fill="none" stroke="#e8c84a" stroke-width="0.5" opacity="0.5"/>
            <circle cx="28" cy="28" r="7" fill="#c49010" opacity="0.55"/>
            <circle cx="28" cy="28" r="3.5" fill="#f5d840"/>
            <line x1="28" y1="17" x2="28" y2="39" stroke="#c49010" stroke-width="1.5" opacity="0.9"/>
            <line x1="17" y1="28" x2="39" y2="28" stroke="#c49010" stroke-width="1.5" opacity="0.9"/>
            <line x1="20" y1="20" x2="36" y2="36" stroke="#c49010" stroke-width="1" opacity="0.65"/>
            <line x1="36" y1="20" x2="20" y2="36" stroke="#c49010" stroke-width="1" opacity="0.65"/>
            <circle cx="28" cy="17" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="28" cy="39" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="17" cy="28" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="39" cy="28" r="2.5" fill="#c49010" opacity="0.55"/>
        </svg>
    </div>
    <!-- Top Right -->
    <div class="corner-tr">
        <svg width="26mm" height="26mm" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="0" r="6" fill="#8B6200"/>
            <path d="M0,0 Q100,0 100,100" fill="none" stroke="#8B6200" stroke-width="2.2"/>
            <path d="M25,0  Q100,0 100,75" fill="none" stroke="#c49010" stroke-width="1.3"/>
            <path d="M50,0  Q100,0 100,50" fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.9"/>
            <path d="M72,0  Q100,0 100,28" fill="none" stroke="#e8c84a" stroke-width="0.5" opacity="0.5"/>
            <circle cx="72" cy="28" r="7" fill="#c49010" opacity="0.55"/>
            <circle cx="72" cy="28" r="3.5" fill="#f5d840"/>
            <line x1="72" y1="17" x2="72" y2="39" stroke="#c49010" stroke-width="1.5" opacity="0.9"/>
            <line x1="61" y1="28" x2="83" y2="28" stroke="#c49010" stroke-width="1.5" opacity="0.9"/>
            <line x1="64" y1="20" x2="80" y2="36" stroke="#c49010" stroke-width="1" opacity="0.65"/>
            <line x1="80" y1="20" x2="64" y2="36" stroke="#c49010" stroke-width="1" opacity="0.65"/>
            <circle cx="72" cy="17" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="72" cy="39" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="61" cy="28" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="83" cy="28" r="2.5" fill="#c49010" opacity="0.55"/>
        </svg>
    </div>
    <!-- Bottom Left -->
    <div class="corner-bl">
        <svg width="26mm" height="26mm" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="100" r="6" fill="#8B6200"/>
            <path d="M100,100 Q0,100 0,0" fill="none" stroke="#8B6200" stroke-width="2.2"/>
            <path d="M75,100 Q0,100 0,25" fill="none" stroke="#c49010" stroke-width="1.3"/>
            <path d="M50,100 Q0,100 0,50" fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.9"/>
            <path d="M28,100 Q0,100 0,72" fill="none" stroke="#e8c84a" stroke-width="0.5" opacity="0.5"/>
            <circle cx="28" cy="72" r="7" fill="#c49010" opacity="0.55"/>
            <circle cx="28" cy="72" r="3.5" fill="#f5d840"/>
            <line x1="28" y1="61" x2="28" y2="83" stroke="#c49010" stroke-width="1.5" opacity="0.9"/>
            <line x1="17" y1="72" x2="39" y2="72" stroke="#c49010" stroke-width="1.5" opacity="0.9"/>
            <line x1="20" y1="64" x2="36" y2="80" stroke="#c49010" stroke-width="1" opacity="0.65"/>
            <line x1="36" y1="64" x2="20" y2="80" stroke="#c49010" stroke-width="1" opacity="0.65"/>
            <circle cx="28" cy="61" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="28" cy="83" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="17" cy="72" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="39" cy="72" r="2.5" fill="#c49010" opacity="0.55"/>
        </svg>
    </div>
    <!-- Bottom Right -->
    <div class="corner-br">
        <svg width="26mm" height="26mm" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="6" fill="#8B6200"/>
            <path d="M0,100 Q100,100 100,0" fill="none" stroke="#8B6200" stroke-width="2.2"/>
            <path d="M25,100 Q100,100 100,25" fill="none" stroke="#c49010" stroke-width="1.3"/>
            <path d="M50,100 Q100,100 100,50" fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.9"/>
            <path d="M72,100 Q100,100 100,72" fill="none" stroke="#e8c84a" stroke-width="0.5" opacity="0.5"/>
            <circle cx="72" cy="72" r="7" fill="#c49010" opacity="0.55"/>
            <circle cx="72" cy="72" r="3.5" fill="#f5d840"/>
            <line x1="72" y1="61" x2="72" y2="83" stroke="#c49010" stroke-width="1.5" opacity="0.9"/>
            <line x1="61" y1="72" x2="83" y2="72" stroke="#c49010" stroke-width="1.5" opacity="0.9"/>
            <line x1="64" y1="64" x2="80" y2="80" stroke="#c49010" stroke-width="1" opacity="0.65"/>
            <line x1="80" y1="64" x2="64" y2="80" stroke="#c49010" stroke-width="1" opacity="0.65"/>
            <circle cx="72" cy="61" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="72" cy="83" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="61" cy="72" r="2.5" fill="#c49010" opacity="0.55"/>
            <circle cx="83" cy="72" r="2.5" fill="#c49010" opacity="0.55"/>
        </svg>
    </div>

    <!-- ══ WATERMARK ══ -->
    <div class="watermark">
        <svg width="70mm" height="70mm" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" fill="none" stroke="#8B6200" stroke-width="3"/>
            <circle cx="100" cy="100" r="85" fill="none" stroke="#8B6200" stroke-width="1.5"/>
            <circle cx="100" cy="100" r="75" fill="none" stroke="#8B6200" stroke-width="1"/>
            <circle cx="100" cy="100" r="92" fill="none" stroke="#8B6200" stroke-width="1" stroke-dasharray="5,4"/>
            <polygon points="100,20 107,42 130,42 112,56 119,78 100,64 81,78 88,56 70,42 93,42" fill="#8B6200"/>
            <text x="100" y="115" text-anchor="middle" font-size="18" font-family="DejaVu Sans" font-weight="bold" fill="#8B6200" letter-spacing="3">CERTIFIED</text>
            <text x="100" y="135" text-anchor="middle" font-size="11" font-family="DejaVu Sans" fill="#8B6200" letter-spacing="2">OF COMPLETION</text>
        </svg>
    </div>

    <!-- ══ MAIN CONTENT ══ -->
    <div class="main">

        <!-- HEADER -->
        <div class="header">
            <div class="org-name">LMS Platform &nbsp;&middot;&nbsp; Excellence in Education</div>

            <!-- Rule with diamonds (using table for PDF compat) -->
            <table class="rule-table" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="rule-cell-line"></td>
                    <td class="rule-cell-diamond"><div style="width:6px;height:6px;background:#a87800;margin:auto;transform:rotate(45deg);"></div></td>
                    <td class="rule-cell-line" style="width:70mm;"></td>
                    <td class="rule-cell-diamond"><div style="width:6px;height:6px;background:#a87800;margin:auto;transform:rotate(45deg);"></div></td>
                    <td class="rule-cell-line"></td>
                </tr>
            </table>

            <div class="cert-title">Certificate of Completion</div>

            <table class="rule-table" style="margin-top:2mm;" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="rule-cell-line"></td>
                    <td class="rule-cell-diamond"><div style="width:5px;height:5px;background:#a87800;margin:auto;transform:rotate(45deg);"></div></td>
                    <td class="rule-cell-line" style="width:55mm;"></td>
                    <td class="rule-cell-diamond"><div style="width:5px;height:5px;background:#a87800;margin:auto;transform:rotate(45deg);"></div></td>
                    <td class="rule-cell-line"></td>
                </tr>
            </table>
            <div class="cert-tagline">Awarded with Distinction</div>
        </div>

        <!-- MIDDLE -->
        <div class="middle">
            <div class="presented-lbl">This certificate is proudly presented to</div>

            <!-- Name with side rules using table -->
            <table width="100%" cellspacing="0" cellpadding="0" style="margin:2mm 0;">
                <tr>
                    <td style="width:28mm; border-top:1px solid #a87800; vertical-align:middle;"></td>
                    <td style="text-align:center; padding:0 5mm; white-space:nowrap;">
                        <span class="student-name">{{ $studentName }}</span>
                    </td>
                    <td style="width:28mm; border-top:1px solid #a87800; vertical-align:middle;"></td>
                </tr>
            </table>

            <div class="completing-lbl">For successfully completing the course</div>

            <!-- Small divider -->
            <table class="rule-table" style="margin:1.5mm auto; width:80mm;" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="rule-cell-line"></td>
                    <td class="rule-cell-diamond"><div style="width:4px;height:4px;background:#a87800;margin:auto;transform:rotate(45deg);"></div></td>
                    <td class="rule-cell-line" style="width:20mm;"></td>
                    <td class="rule-cell-diamond"><div style="width:4px;height:4px;background:#a87800;margin:auto;transform:rotate(45deg);"></div></td>
                    <td class="rule-cell-line"></td>
                </tr>
            </table>

            <div class="course-title">{{ $courseTitle }}</div>
        </div>

        <!-- FOOTER -->
        <table class="footer-table" cellspacing="0" cellpadding="0">
            <tr>
                <!-- LEFT: cert info -->
                <td class="footer-left-col">
                    <div class="meta-lbl">Certificate No.</div>
                    <div class="meta-val">{{ $certificateNo }}</div>
                    <div class="meta-lbl">Date of Issue</div>
                    <div class="meta-val" style="margin-bottom:0;">{{ $issueDate }}</div>
                </td>

                <!-- CENTRE: medallion seal -->
                <td class="footer-mid-col">
                    <svg width="38mm" height="38mm" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                        <!-- background fill -->
                        <circle cx="80" cy="80" r="72" fill="#fdf0b0"/>
                        <!-- rings -->
                        <circle cx="80" cy="80" r="72" fill="none" stroke="#8B6200" stroke-width="2.5"/>
                        <circle cx="80" cy="80" r="65" fill="none" stroke="#c49010" stroke-width="1.2"/>
                        <circle cx="80" cy="80" r="58" fill="none" stroke="#e8c84a" stroke-width="0.8"/>
                        <circle cx="80" cy="80" r="75" fill="none" stroke="#c49010" stroke-width="1" stroke-dasharray="4,3"/>
                        <!-- starburst -->
                        <polygon points="
                            80,14 83,30 95,20 91,36 108,30 100,44
                            118,44 106,55 124,62 110,69 126,80 111,84
                            124,97 108,96 118,112 103,106 108,124 94,114
                            94,132 83,118 80,136 77,118 66,132 66,114
                            52,124 57,106 42,112 52,96 36,97 49,84
                            34,80 50,69 36,62 54,55 42,44 60,44
                            52,30 69,36 65,20 77,30"
                            fill="#c49010" opacity="0.22"/>
                        <!-- star -->
                        <polygon points="80,24 84,44 104,44 88,56 94,76 80,64 66,76 72,56 56,44 76,44" fill="#8B6200"/>
                        <polygon points="80,28 83,45 100,45 87,55 92,71 80,61 68,71 73,55 60,45 77,45" fill="#f5d020"/>
                        <!-- text -->
                        <text x="80" y="97"  text-anchor="middle" font-size="10.5" font-family="DejaVu Sans" font-weight="bold" fill="#5a3a00" letter-spacing="2.5">CERTIFIED</text>
                        <text x="80" y="111" text-anchor="middle" font-size="7"    font-family="DejaVu Sans" fill="#8B6200" letter-spacing="1.2">LMS PLATFORM</text>
                        <!-- compass dots -->
                        <circle cx="80"  cy="6"   r="3" fill="#c49010"/>
                        <circle cx="80"  cy="154" r="3" fill="#c49010"/>
                        <circle cx="6"   cy="80"  r="3" fill="#c49010"/>
                        <circle cx="154" cy="80"  r="3" fill="#c49010"/>
                    </svg>
                </td>

                <!-- RIGHT: signature -->
                <td class="footer-right-col">
                    <table class="sig-line-table" cellspacing="0" cellpadding="0">
                        <tr>
                            <td class="sig-line-cell" style="text-align:center;">
                                <div class="sig-name">Platform Director</div>
                                <div class="sig-role">Authorised Signatory &middot; EduVerse Platform</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

    </div><!-- /main -->

</div><!-- /page -->
</body>
</html>