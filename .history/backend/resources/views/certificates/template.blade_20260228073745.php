<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Certificate of Completion – {{ $studentName }}</title>
    <style>
        /* ── Reset & Page ─────────────────────────────────────────────── */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: DejaVu Sans, Georgia, serif;
            background: #1a1007;
            width: 297mm;
            height: 210mm;
            overflow: hidden;
        }
        /* ── Outer Shell ──────────────────────────────────────────────── */
        .cert-shell {
            width: 297mm;
            height: 210mm;
            position: relative;
            background: #fdf8ef;
            overflow: hidden;
        }
        /* ── Deep Gold Border System ─────────────────────────────────── */
        .border-outer {
            position: absolute;
            inset: 6mm;
            border: 2.5pt solid #8B6914;
        }
        .border-inner {
            position: absolute;
            inset: 9mm;
            border: 1pt solid #C9973A;
        }
        .border-accent {
            position: absolute;
            inset: 10.5mm;
            border: 0.5pt solid #E8C46A;
        }
        /* ── Corner Ornaments (Enhanced with more details) ───────────── */
        .corner {
            position: absolute;
            width: 24mm;
            height: 24mm;
        }
        .corner svg { width: 100%; height: 100%; }
        .corner-tl { top: 5mm; left: 5mm; }
        .corner-tr { top: 5mm; right: 5mm; transform: scaleX(-1); }
        .corner-bl { bottom: 5mm; left: 5mm; transform: scaleY(-1); }
        .corner-br { bottom: 5mm; right: 5mm; transform: scale(-1,-1); }
        /* ── Background Texture (Improved grain effect) ──────────────── */
        .bg-texture {
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,246,220,0.8) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 10% 10%, rgba(212,175,55,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 40% 40% at 90% 90%, rgba(212,175,55,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 50% 50% at 50% 80%, rgba(212,175,55,0.05) 0%, transparent 70%),
                linear-gradient(160deg, #fdf6e3 0%, #fdf0d5 50%, #fdf6e3 100%);
            pointer-events: none;
        }
        /* ── Watermark Seal (Enhanced with more intricate design) ────── */
        .watermark {
            position: absolute;
            bottom: 28mm;
            left: 50%;
            transform: translateX(-50%);
            width: 56mm;
            height: 56mm;
            opacity: 0.055;
        }
        .watermark svg { width: 100%; height: 100%; }
        /* ── Side Gold Bars (Added subtle shadow) ────────────────────── */
        .side-bar-left {
            position: absolute;
            left: 13mm;
            top: 14mm;
            bottom: 14mm;
            width: 3mm;
            background: linear-gradient(180deg, transparent, #C9973A 20%, #F0C040 50%, #C9973A 80%, transparent);
            border-radius: 2px;
            box-shadow: 0 0 2mm rgba(139,105,20,0.2);
        }
        .side-bar-right {
            position: absolute;
            right: 13mm;
            top: 14mm;
            bottom: 14mm;
            width: 3mm;
            background: linear-gradient(180deg, transparent, #C9973A 20%, #F0C040 50%, #C9973A 80%, transparent);
            border-radius: 2px;
            box-shadow: 0 0 2mm rgba(139,105,20,0.2);
        }
        /* ── Decorative Top/Bottom Dividers (Added mid divider enhancement) ──── */
        .divider-top {
            position: absolute;
            top: 19mm;
            left: 19mm;
            right: 19mm;
            height: 0.7pt;
            background: linear-gradient(90deg, transparent, #C9973A 15%, #F0C040 50%, #C9973A 85%, transparent);
        }
        .divider-bottom {
            position: absolute;
            bottom: 19mm;
            left: 19mm;
            right: 19mm;
            height: 0.7pt;
            background: linear-gradient(90deg, transparent, #C9973A 15%, #F0C040 50%, #C9973A 85%, transparent);
        }
        .divider-mid {
            display: inline-block;
            width: 80mm;
            height: 0.5pt;
            background: linear-gradient(90deg, transparent, #C9973A 30%, #C9973A 70%, transparent);
            vertical-align: middle;
            margin: 0 4mm;
        }
        /* ── Content Area ────────────────────────────────────────────── */
        .content {
            position: absolute;
            top: 22mm;
            left: 20mm;
            right: 20mm;
            bottom: 22mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            text-align: center;
        }
        /* ── Header Block (Improved spacing and shadow) ──────────────── */
        .header-block { width: 100%; }
        .org-name {
            font-size: 9pt;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #7a5c1e;
            font-family: DejaVu Sans, sans-serif;
            font-weight: normal;
            margin-bottom: 2mm;
        }
        .cert-title {
            font-size: 32pt;
            font-family: DejaVu Serif, Georgia, serif;
            font-weight: bold;
            color: #2c1a06;
            line-height: 1;
            letter-spacing: 1px;
            text-shadow: 0 1px 0 rgba(255,255,255,0.6), 0 0.5px 0 rgba(0,0,0,0.1);
        }
        .cert-subtitle {
            font-size: 8pt;
            letter-spacing: 6px;
            text-transform: uppercase;
            color: #9a7c30;
            font-family: DejaVu Sans, sans-serif;
            margin-top: 1.5mm;
        }
        /* ── Middle Block (Added course details section) ─────────────── */
        .middle-block { width: 100%; }
        .presented-to {
            font-size: 10pt;
            color: #6b4f1c;
            font-family: DejaVu Sans, sans-serif;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 2mm;
        }
        .student-name {
            font-size: 30pt;
            font-family: DejaVu Serif, Georgia, serif;
            font-weight: bold;
            color: #1a3a6e;
            line-height: 1.1;
            letter-spacing: 1px;
            padding: 1mm 0 2mm;
            position: relative;
        }
        .for-completing {
            font-size: 9.5pt;
            color: #6b4f1c;
            font-family: DejaVu Sans, sans-serif;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 1.5mm;
            margin-bottom: 1.5mm;
        }
        .course-title {
            font-size: 17pt;
            font-family: DejaVu Serif, Georgia, serif;
            font-weight: bold;
            color: #2c1a06;
            line-height: 1.3;
            max-width: 210mm;
            margin: 0 auto;
            padding: 1mm 0;
        }
        .course-details {
            font-size: 9pt;
            color: #7a5c1e;
            font-family: DejaVu Sans, sans-serif;
            margin-top: 2mm;
            line-height: 1.5;
        }
        /* ── Footer Block (Added QR code section) ────────────────────── */
        .footer-block {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .footer-col {
            text-align: center;
            width: 55mm;
        }
        .footer-col-center {
            text-align: center;
            width: 60mm;
        }
        .seal-circle {
            width: 22mm;
            height: 22mm;
            margin: 0 auto 1mm;
        }
        .seal-circle svg { width: 100%; height: 100%; }
        .sig-line {
            border-top: 0.8pt solid #8B6914;
            width: 44mm;
            margin: 0 auto 1.5mm;
        }
        .sig-name {
            font-size: 10pt;
            font-weight: bold;
            color: #2c1a06;
            font-family: DejaVu Serif, Georgia, serif;
        }
        .sig-role {
            font-size: 7.5pt;
            color: #9a7c30;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-family: DejaVu Sans, sans-serif;
        }
        .cert-meta {
            font-size: 7.5pt;
            color: #7a5c1e;
            font-family: DejaVu Sans, sans-serif;
            line-height: 1.8;
        }
        .cert-meta b {
            color: #4a3010;
            font-weight: bold;
        }
        .qr-code {
            width: 20mm;
            height: 20mm;
            margin-top: 2mm;
        }
        .qr-code img {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
<div class="cert-shell">
    <!-- Background -->
    <div class="bg-texture"></div>
    <!-- Borders -->
    <div class="border-outer"></div>
    <div class="border-inner"></div>
    <div class="border-accent"></div>
    <!-- Side Bars -->
    <div class="side-bar-left"></div>
    <div class="side-bar-right"></div>
    <!-- Dividers -->
    <div class="divider-top"></div>
    <div class="divider-bottom"></div>
    <!-- Corner Ornaments (Enhanced SVG) -->
    <div class="corner corner-tl">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M5,5 L40,5 L5,40 Z" fill="#C9973A" opacity="0.4"/>
            <path d="M5,5 L95,5 L5,95 Z" fill="none" stroke="#C9973A" stroke-width="1.5"/>
            <circle cx="5" cy="5" r="4" fill="#C9973A"/>
            <path d="M20,5 Q5,20 5,20" fill="none" stroke="#E8C46A" stroke-width="1"/>
            <path d="M40,5 Q5,40 5,40" fill="none" stroke="#C9973A" stroke-width="0.8" opacity="0.6"/>
            <path d="M60,5 Q5,60 5,60" fill="none" stroke="#C9973A" stroke-width="0.5" opacity="0.3"/>
            <path d="M80,5 Q5,80 5,80" fill="none" stroke="#C9973A" stroke-width="0.3" opacity="0.2"/>
            <!-- Enhanced fleur -->
            <circle cx="22" cy="22" r="3" fill="#C9973A" opacity="0.6"/>
            <circle cx="22" cy="22" r="1.5" fill="#E8C46A"/>
            <line x1="22" y1="15" x2="22" y2="29" stroke="#C9973A" stroke-width="0.8" opacity="0.7"/>
            <line x1="15" y1="22" x2="29" y2="22" stroke="#C9973A" stroke-width="0.8" opacity="0.7"/>
            <line x1="17" y1="17" x2="27" y2="27" stroke="#C9973A" stroke-width="0.8" opacity="0.5"/>
            <line x1="27" y1="17" x2="17" y2="27" stroke="#C9973A" stroke-width="0.8" opacity="0.5"/>
            <circle cx="22" cy="22" r="5" fill="none" stroke="#E8C46A" stroke-width="0.5" opacity="0.4"/>
        </svg>
    </div>
    <div class="corner corner-tr">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M5,5 L40,5 L5,40 Z" fill="#C9973A" opacity="0.4"/>
            <path d="M5,5 L95,5 L5,95 Z" fill="none" stroke="#C9973A" stroke-width="1.5"/>
            <circle cx="5" cy="5" r="4" fill="#C9973A"/>
            <path d="M20,5 Q5,20 5,20" fill="none" stroke="#E8C46A" stroke-width="1"/>
            <path d="M40,5 Q5,40 5,40" fill="none" stroke="#C9973A" stroke-width="0.8" opacity="0.6"/>
            <path d="M60,5 Q5,60 5,60" fill="none" stroke="#C9973A" stroke-width="0.5" opacity="0.3"/>
            <path d="M80,5 Q5,80 5,80" fill="none" stroke="#C9973A" stroke-width="0.3" opacity="0.2"/>
            <!-- Enhanced fleur -->
            <circle cx="22" cy="22" r="3" fill="#C9973A" opacity="0.6"/>
            <circle cx="22" cy="22" r="1.5" fill="#E8C46A"/>
            <line x1="22" y1="15" x2="22" y2="29" stroke="#C9973A" stroke-width="0.8" opacity="0.7"/>
            <line x1="15" y1="22" x2="29" y2="22" stroke="#C9973A" stroke-width="0.8" opacity="0.7"/>
            <line x1="17" y1="17" x2="27" y2="27" stroke="#C9973A" stroke-width="0.8" opacity="0.5"/>
            <line x1="27" y1="17" x2="17" y2="27" stroke="#C9973A" stroke-width="0.8" opacity="0.5"/>
            <circle cx="22" cy="22" r="5" fill="none" stroke="#E8C46A" stroke-width="0.5" opacity="0.4"/>
        </svg>
    </div>
    <div class="corner corner-bl">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M5,5 L40,5 L5,40 Z" fill="#C9973A" opacity="0.4"/>
            <path d="M5,5 L95,5 L5,95 Z" fill="none" stroke="#C9973A" stroke-width="1.5"/>
            <circle cx="5" cy="5" r="4" fill="#C9973A"/>
            <path d="M20,5 Q5,20 5,20" fill="none" stroke="#E8C46A" stroke-width="1"/>
            <path d="M40,5 Q5,40 5,40" fill="none" stroke="#C9973A" stroke-width="0.8" opacity="0.6"/>
            <path d="M60,5 Q5,60 5,60" fill="none" stroke="#C9973A" stroke-width="0.5" opacity="0.3"/>
            <path d="M80,5 Q5,80 5,80" fill="none" stroke="#C9973A" stroke-width="0.3" opacity="0.2"/>
            <!-- Enhanced fleur -->
            <circle cx="22" cy="22" r="3" fill="#C9973A" opacity="0.6"/>
            <circle cx="22" cy="22" r="1.5" fill="#E8C46A"/>
            <line x1="22" y1="15" x2="22" y2="29" stroke="#C9973A" stroke-width="0.8" opacity="0.7"/>
            <line x1="15" y1="22" x2="29" y2="22" stroke="#C9973A" stroke-width="0.8" opacity="0.7"/>
            <line x1="17" y1="17" x2="27" y2="27" stroke="#C9973A" stroke-width="0.8" opacity="0.5"/>
            <line x1="27" y1="17" x2="17" y2="27" stroke="#C9973A" stroke-width="0.8" opacity="0.5"/>
            <circle cx="22" cy="22" r="5" fill="none" stroke="#E8C46A" stroke-width="0.5" opacity="0.4"/>
        </svg>
    </div>
    <div class="corner corner-br">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M5,5 L40,5 L5,40 Z" fill="#C9973A" opacity="0.4"/>
            <path d="M5,5 L95,5 L5,95 Z" fill="none" stroke="#C9973A" stroke-width="1.5"/>
            <circle cx="5" cy="5" r="4" fill="#C9973A"/>
            <path d="M20,5 Q5,20 5,20" fill="none" stroke="#E8C46A" stroke-width="1"/>
            <path d="M40,5 Q5,40 5,40" fill="none" stroke="#C9973A" stroke-width="0.8" opacity="0.6"/>
            <path d="M60,5 Q5,60 5,60" fill="none" stroke="#C9973A" stroke-width="0.5" opacity="0.3"/>
            <path d="M80,5 Q5,80 5,80" fill="none" stroke="#C9973A" stroke-width="0.3" opacity="0.2"/>
            <!-- Enhanced fleur -->
            <circle cx="22" cy="22" r="3" fill="#C9973A" opacity="0.6"/>
            <circle cx="22" cy="22" r="1.5" fill="#E8C46A"/>
            <line x1="22" y1="15" x2="22" y2="29" stroke="#C9973A" stroke-width="0.8" opacity="0.7"/>
            <line x1="15" y1="22" x2="29" y2="22" stroke="#C9973A" stroke-width="0.8" opacity="0.7"/>
            <line x1="17" y1="17" x2="27" y2="27" stroke="#C9973A" stroke-width="0.8" opacity="0.5"/>
            <line x1="27" y1="17" x2="17" y2="27" stroke="#C9973A" stroke-width="0.8" opacity="0.5"/>
            <circle cx="22" cy="22" r="5" fill="none" stroke="#E8C46A" stroke-width="0.5" opacity="0.4"/>
        </svg>
    </div>
    <!-- Background Watermark Seal (Enhanced) -->
    <div class="watermark">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="92" fill="none" stroke="#8B6914" stroke-width="3"/>
            <circle cx="100" cy="100" r="82" fill="none" stroke="#8B6914" stroke-width="1.5"/>
            <circle cx="100" cy="100" r="72" fill="none" stroke="#8B6914" stroke-width="1"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#8B6914" stroke-width="0.5" opacity="0.5"/>
            <!-- Enhanced star points -->
            <polygon points="100,15 107,35 128,35 112,48 118,68 100,56 82,68 88,48 72,35 93,35"
                     fill="#8B6914" stroke="none"/>
            <polygon points="100,20 105,35 120,35 108,45 112,60 100,52 88,60 92,45 80,35 95,35"
                     fill="none" stroke="#8B6914" stroke-width="1" opacity="0.6"/>
            <text x="100" y="110" text-anchor="middle" font-size="14"
                  font-family="DejaVu Sans" font-weight="bold" fill="#8B6914"
                  letter-spacing="2">CERTIFIED</text>
            <text x="100" y="128" text-anchor="middle" font-size="9"
                  font-family="DejaVu Sans" fill="#8B6914" letter-spacing="1">OF COMPLETION</text>
            <!-- dashes around inner circle -->
            <circle cx="100" cy="100" r="88" fill="none" stroke="#8B6914"
                    stroke-width="1" stroke-dasharray="4 4"/>
            <circle cx="100" cy="100" r="78" fill="none" stroke="#8B6914"
                    stroke-width="0.8" stroke-dasharray="3 3" opacity="0.7"/>
        </svg>
    </div>
    <!-- Main Content -->
    <div class="content">
        <!-- ── Header ─────────────────────────────────────────────────── -->
        <div class="header-block">
            <div class="org-name">LMS Platform &nbsp;·&nbsp; Excellence in Education</div>
            <div class="cert-title">Certificate of Completion</div>
            <div class="cert-subtitle">&#9670; &nbsp; Awarded with Distinction &nbsp; &#9670;</div>
        </div>
        <!-- ── Middle ─────────────────────────────────────────────────── -->
        <div class="middle-block">
            <div class="presented-to">This is Proudly Presented To</div>
            <!-- name with flanking dividers -->
            <div style="display:flex; align-items:center; justify-content:center;">
                <span class="divider-mid"></span>
                <span class="student-name">{{ $studentName }}</span>
                <span class="divider-mid"></span>
            </div>
            <div class="for-completing">For Successfully Completing the Course</div>
            <div class="course-title">{{ $courseTitle }}</div>
            <!-- New: Course Details -->
            <div class="course-details">
                Course Duration: {{ $courseDuration }} <br>
                Instructor: {{ $instructorName }} <br>
                Grade Achieved: {{ $grade }}
            </div>
        </div>
        <!-- ── Footer ─────────────────────────────────────────────────── -->
        <div class="footer-block">
            <!-- Left: Certificate Info (Added more meta) -->
            <div class="footer-col">
                <div class="cert-meta">
                    Certificate No.<br>
                    <b>{{ $certificateNo }}</b>
                </div>
                <div class="cert-meta" style="margin-top:2mm;">
                    Date of Issue<br>
                    <b>{{ $issueDate }}</b>
                </div>
                <div class="cert-meta" style="margin-top:2mm;">
                    Verification Code<br>
                    <b>{{ $verificationCode }}</b>
                </div>
            </div>
            <!-- Centre: Seal -->
            <div class="footer-col-center">
                <div class="seal-circle">
                    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <!-- outer ring -->
                        <circle cx="60" cy="60" r="56" fill="none" stroke="#C9973A" stroke-width="2.5"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#E8C46A" stroke-width="1"/>
                        <circle cx="60" cy="60" r="44" fill="rgba(212,175,55,0.08)" stroke="#C9973A" stroke-width="0.8"/>
                        <!-- star -->
                        <polygon points="60,12 65,28 82,28 69,38 74,54 60,44 46,54 51,38 38,28 55,28"
                                 fill="#C9973A"/>
                        <!-- text -->
                        <text x="60" y="72" text-anchor="middle" font-size="8"
                              font-family="DejaVu Sans" font-weight="bold"
                              fill="#7a5c1e" letter-spacing="1.5">CERTIFIED</text>
                        <text x="60" y="84" text-anchor="middle" font-size="6"
                              font-family="DejaVu Sans" fill="#9a7c30" letter-spacing="1">LMS PLATFORM</text>
                        <!-- dash ring -->
                        <circle cx="60" cy="60" r="53" fill="none" stroke="#C9973A"
                                stroke-width="0.8" stroke-dasharray="3 3"/>
                    </svg>
                </div>
                <!-- New: QR Code for Verification -->
                <div class="qr-code">
                    <img src="{{ $qrCodeUrl }}" alt="Verification QR Code">
                </div>
            </div>
            <!-- Right: Signature (Added digital signature note) -->
            <div class="footer-col">
                <div class="sig-line"></div>
                <div class="sig-name">Platform Director</div>
                <div class="sig-role">Authorised Signatory</div>
                <div class="cert-meta" style="margin-top:1mm; font-size:6pt;">
                    Digitally Signed
                </div>
            </div>
        </div>
    </div><!-- /content -->
</div>
</body>
</html>