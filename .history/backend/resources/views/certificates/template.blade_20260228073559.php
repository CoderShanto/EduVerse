<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Certificate – {{ $studentName }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page { size: A4 landscape; margin: 0; }

        html, body {
            width: 297mm;
            height: 210mm;
            overflow: hidden;
            background: #1a0e00;
        }

        .cert {
            width: 297mm;
            height: 210mm;
            position: relative;
            overflow: hidden;
            font-family: 'DejaVu Sans', Arial, sans-serif;
            background: radial-gradient(ellipse 90% 80% at 50% 50%, #fffdf0 0%, #fef5cc 50%, #f5e090 100%);
        }

        /* ─── Triple Border ─── */
        .b1 { position:absolute; inset:5mm;    border:3px solid #7a5400; }
        .b2 { position:absolute; inset:7.5mm;  border:1px solid #c49010; }
        .b3 { position:absolute; inset:9.5mm;  border:1px solid #e8c84a; }

        /* ─── Corner Ornaments ─── */
        .corner { position:absolute; width:26mm; height:26mm; z-index:5; }
        .c-tl { top:3.5mm; left:3.5mm; }
        .c-tr { top:3.5mm; right:3.5mm;  transform:scaleX(-1); }
        .c-bl { bottom:3.5mm; left:3.5mm;  transform:scaleY(-1); }
        .c-br { bottom:3.5mm; right:3.5mm;  transform:scale(-1,-1); }

        /* ─── Content body ─── */
        .body {
            position: absolute;
            top: 13mm; bottom: 13mm;
            left: 14mm; right: 14mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            text-align: center;
        }

        /* TOP */
        .top { width:100%; }

        .org-line {
            font-size: 7pt;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #7a5400;
            margin-bottom: 2.5mm;
        }

        .h-rule {
            display:flex; align-items:center; justify-content:center; gap:2mm;
            margin-bottom: 2.5mm;
        }
        .h-rule-line {
            height: 1px;
            background: linear-gradient(90deg, transparent, #a87800, transparent);
        }
        .diamond {
            width:5px; height:5px;
            background:#a87800; transform:rotate(45deg); flex-shrink:0;
        }

        .cert-title {
            font-family: 'DejaVu Serif', Georgia, serif;
            font-size: 34pt;
            font-weight: bold;
            color: #1c0e00;
            line-height: 1;
        }

        .cert-tagline {
            font-size: 7pt;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #8B6200;
            margin-top: 2mm;
        }

        /* MIDDLE */
        .middle { width:100%; }

        .label-text {
            font-size: 8pt;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #7a5400;
        }

        .name-wrap {
            display:flex; align-items:center;
            justify-content:center; gap:4mm;
            margin: 1.5mm 0;
        }
        .n-rule-l { width:28mm; height:1px; background:linear-gradient(90deg,transparent,#a87800); }
        .n-rule-r { width:28mm; height:1px; background:linear-gradient(90deg,#a87800,transparent); }

        .student-name {
            font-family: 'DejaVu Serif', Georgia, serif;
            font-size: 27pt;
            font-weight: bold;
            color: #1a3570;
            white-space: nowrap;
        }

        .course-title {
            font-family: 'DejaVu Serif', Georgia, serif;
            font-size: 16pt;
            font-weight: bold;
            color: #1c0e00;
            margin-top: 2mm;
            line-height: 1.3;
        }

        /* FOOTER */
        .footer {
            width: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
        }

        .f-left, .f-right { width: 68mm; }
        .f-center { width: 38mm; display:flex; flex-direction:column; align-items:center; }

        .f-left { text-align:left; }
        .f-right { text-align:center; }

        .meta-lbl {
            font-size: 6.5pt;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #8B6200;
            margin-bottom:0.5mm;
        }
        .meta-val {
            font-size: 9pt;
            font-weight: bold;
            color: #1c0e00;
            margin-bottom: 2.5mm;
        }

        .sig-bar {
            width: 54mm;
            height: 1px;
            background: #8B6200;
            margin: 0 auto 2mm;
        }
        .sig-name {
            font-family: 'DejaVu Serif', Georgia, serif;
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
<div class="cert">

    <!-- Triple border -->
    <div class="b1"></div>
    <div class="b2"></div>
    <div class="b3"></div>

    <!-- ── CORNER SVG ORNAMENTS (all 4) ── -->
    <div class="corner c-tl">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="5.5" fill="#8B6200"/>
            <path d="M100,0 Q0,0 0,100" fill="none" stroke="#8B6200" stroke-width="2"/>
            <path d="M75,0  Q0,0 0,75"  fill="none" stroke="#c49010" stroke-width="1.2"/>
            <path d="M52,0  Q0,0 0,52"  fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.8"/>
            <path d="M32,0  Q0,0 0,32"  fill="none" stroke="#e8c84a" stroke-width="0.5" opacity="0.5"/>
            <!-- rosette -->
            <circle cx="28" cy="28" r="6" fill="#c49010" opacity="0.6"/>
            <circle cx="28" cy="28" r="3" fill="#f0d060"/>
            <line x1="28" y1="18" x2="28" y2="38" stroke="#c49010" stroke-width="1.3" opacity="0.9"/>
            <line x1="18" y1="28" x2="38" y2="28" stroke="#c49010" stroke-width="1.3" opacity="0.9"/>
            <line x1="21" y1="21" x2="35" y2="35" stroke="#c49010" stroke-width="0.9" opacity="0.7"/>
            <line x1="35" y1="21" x2="21" y2="35" stroke="#c49010" stroke-width="0.9" opacity="0.7"/>
            <circle cx="28" cy="18" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="28" cy="38" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="18" cy="28" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="38" cy="28" r="2.2" fill="#c49010" opacity="0.5"/>
        </svg>
    </div>
    <div class="corner c-tr">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="5.5" fill="#8B6200"/>
            <path d="M100,0 Q0,0 0,100" fill="none" stroke="#8B6200" stroke-width="2"/>
            <path d="M75,0  Q0,0 0,75"  fill="none" stroke="#c49010" stroke-width="1.2"/>
            <path d="M52,0  Q0,0 0,52"  fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.8"/>
            <path d="M32,0  Q0,0 0,32"  fill="none" stroke="#e8c84a" stroke-width="0.5" opacity="0.5"/>
            <circle cx="28" cy="28" r="6" fill="#c49010" opacity="0.6"/>
            <circle cx="28" cy="28" r="3" fill="#f0d060"/>
            <line x1="28" y1="18" x2="28" y2="38" stroke="#c49010" stroke-width="1.3" opacity="0.9"/>
            <line x1="18" y1="28" x2="38" y2="28" stroke="#c49010" stroke-width="1.3" opacity="0.9"/>
            <line x1="21" y1="21" x2="35" y2="35" stroke="#c49010" stroke-width="0.9" opacity="0.7"/>
            <line x1="35" y1="21" x2="21" y2="35" stroke="#c49010" stroke-width="0.9" opacity="0.7"/>
            <circle cx="28" cy="18" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="28" cy="38" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="18" cy="28" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="38" cy="28" r="2.2" fill="#c49010" opacity="0.5"/>
        </svg>
    </div>
    <div class="corner c-bl">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="5.5" fill="#8B6200"/>
            <path d="M100,0 Q0,0 0,100" fill="none" stroke="#8B6200" stroke-width="2"/>
            <path d="M75,0  Q0,0 0,75"  fill="none" stroke="#c49010" stroke-width="1.2"/>
            <path d="M52,0  Q0,0 0,52"  fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.8"/>
            <path d="M32,0  Q0,0 0,32"  fill="none" stroke="#e8c84a" stroke-width="0.5" opacity="0.5"/>
            <circle cx="28" cy="28" r="6" fill="#c49010" opacity="0.6"/>
            <circle cx="28" cy="28" r="3" fill="#f0d060"/>
            <line x1="28" y1="18" x2="28" y2="38" stroke="#c49010" stroke-width="1.3" opacity="0.9"/>
            <line x1="18" y1="28" x2="38" y2="28" stroke="#c49010" stroke-width="1.3" opacity="0.9"/>
            <line x1="21" y1="21" x2="35" y2="35" stroke="#c49010" stroke-width="0.9" opacity="0.7"/>
            <line x1="35" y1="21" x2="21" y2="35" stroke="#c49010" stroke-width="0.9" opacity="0.7"/>
            <circle cx="28" cy="18" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="28" cy="38" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="18" cy="28" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="38" cy="28" r="2.2" fill="#c49010" opacity="0.5"/>
        </svg>
    </div>
    <div class="corner c-br">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="5.5" fill="#8B6200"/>
            <path d="M100,0 Q0,0 0,100" fill="none" stroke="#8B6200" stroke-width="2"/>
            <path d="M75,0  Q0,0 0,75"  fill="none" stroke="#c49010" stroke-width="1.2"/>
            <path d="M52,0  Q0,0 0,52"  fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.8"/>
            <path d="M32,0  Q0,0 0,32"  fill="none" stroke="#e8c84a" stroke-width="0.5" opacity="0.5"/>
            <circle cx="28" cy="28" r="6" fill="#c49010" opacity="0.6"/>
            <circle cx="28" cy="28" r="3" fill="#f0d060"/>
            <line x1="28" y1="18" x2="28" y2="38" stroke="#c49010" stroke-width="1.3" opacity="0.9"/>
            <line x1="18" y1="28" x2="38" y2="28" stroke="#c49010" stroke-width="1.3" opacity="0.9"/>
            <line x1="21" y1="21" x2="35" y2="35" stroke="#c49010" stroke-width="0.9" opacity="0.7"/>
            <line x1="35" y1="21" x2="21" y2="35" stroke="#c49010" stroke-width="0.9" opacity="0.7"/>
            <circle cx="28" cy="18" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="28" cy="38" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="18" cy="28" r="2.2" fill="#c49010" opacity="0.5"/>
            <circle cx="38" cy="28" r="2.2" fill="#c49010" opacity="0.5"/>
        </svg>
    </div>

    <!-- ════ MAIN CONTENT ════ -->
    <div class="body">

        <!-- TOP BLOCK -->
        <div class="top">
            <div class="org-line">LMS Platform &nbsp;·&nbsp; Excellence in Education</div>

            <div class="h-rule">
                <div class="h-rule-line" style="width:35mm;"></div>
                <div class="diamond"></div>
                <div class="h-rule-line" style="width:65mm;"></div>
                <div class="diamond"></div>
                <div class="h-rule-line" style="width:35mm;"></div>
            </div>

            <div class="cert-title">Certificate of Completion</div>

            <div class="h-rule" style="margin-top:2mm; margin-bottom:0;">
                <div class="h-rule-line" style="width:30mm;"></div>
                <div class="diamond"></div>
                <div class="h-rule-line" style="width:50mm;"></div>
                <div class="diamond"></div>
                <div class="h-rule-line" style="width:30mm;"></div>
            </div>
            <div class="cert-tagline">Awarded with Distinction</div>
        </div>

        <!-- MIDDLE BLOCK -->
        <div class="middle">
            <div class="label-text">This certificate is proudly presented to</div>

            <div class="name-wrap">
                <div class="n-rule-l"></div>
                <div class="student-name">{{ $studentName }}</div>
                <div class="n-rule-r"></div>
            </div>

            <div class="label-text" style="margin-bottom:2mm;">For successfully completing the course</div>

            <div class="h-rule" style="margin-bottom:1.5mm;">
                <div class="h-rule-line" style="width:18mm;"></div>
                <div class="diamond" style="width:4px;height:4px;"></div>
                <div class="h-rule-line" style="width:26mm;"></div>
                <div class="diamond" style="width:4px;height:4px;"></div>
                <div class="h-rule-line" style="width:18mm;"></div>
            </div>

            <div class="course-title">{{ $courseTitle }}</div>
        </div>

        <!-- FOOTER BLOCK -->
        <div class="footer">

            <!-- Left: metadata -->
            <div class="f-left">
                <div class="meta-lbl">Certificate No.</div>
                <div class="meta-val">{{ $certificateNo }}</div>
                <div class="meta-lbl">Date of Issue</div>
                <div class="meta-val">{{ $issueDate }}</div>
            </div>

            <!-- Centre: Medallion -->
            <div class="f-center">
                <svg width="38mm" height="38mm" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="sealFill" cx="50%" cy="40%" r="60%">
                            <stop offset="0%" stop-color="#fff9e0"/>
                            <stop offset="100%" stop-color="#f5e090"/>
                        </radialGradient>
                    </defs>
                    <!-- shadow/glow -->
                    <circle cx="80" cy="82" r="70" fill="rgba(0,0,0,0.08)"/>
                    <!-- fill -->
                    <circle cx="80" cy="80" r="70" fill="url(#sealFill)"/>
                    <!-- rings -->
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#8B6200" stroke-width="2.5"/>
                    <circle cx="80" cy="80" r="64" fill="none" stroke="#c49010" stroke-width="1.2"/>
                    <circle cx="80" cy="80" r="57" fill="none" stroke="#e8c84a" stroke-width="0.8"/>
                    <!-- outer dashes -->
                    <circle cx="80" cy="80" r="73" fill="none" stroke="#c49010" stroke-width="1" stroke-dasharray="4,3"/>
                    <!-- starburst 16pt -->
                    <polygon points="
                        80,12  83,32  96,18  92,38  110,28  101,46
                        121,44  107,58  128,62  112,71  130,82  113,86
                        128,98  111,97  121,114  105,108  110,127  95,117
                        94,136  82,122  80,142  78,122  66,136  65,117
                        50,127  55,108  39,114  49,97   32,98   47,86
                        30,82   48,71   32,62   53,58   39,44   59,46
                        50,28   68,38   64,18   77,32"
                        fill="#c49010" opacity="0.2"/>
                    <!-- 10-point star -->
                    <polygon points="80,24 84,44 104,44 88,56 94,76 80,64 66,76 72,56 56,44 76,44"
                             fill="#8B6200"/>
                    <polygon points="80,28 83,45 100,45 87,55 92,72 80,62 68,72 73,55 60,45 77,45"
                             fill="#f0c820"/>
                    <!-- label -->
                    <text x="80" y="96"  text-anchor="middle" font-size="10.5" font-family="DejaVu Sans" font-weight="bold" fill="#5a3a00" letter-spacing="2.5">CERTIFIED</text>
                    <text x="80" y="109" text-anchor="middle" font-size="7" font-family="DejaVu Sans" fill="#8B6200" letter-spacing="1.2">LMS PLATFORM</text>
                    <!-- compass dots -->
                    <circle cx="80"  cy="8"   r="2.5" fill="#c49010"/>
                    <circle cx="80"  cy="152" r="2.5" fill="#c49010"/>
                    <circle cx="8"   cy="80"  r="2.5" fill="#c49010"/>
                    <circle cx="152" cy="80"  r="2.5" fill="#c49010"/>
                </svg>
            </div>

            <!-- Right: signature -->
            <div class="f-right">
                <div class="sig-bar"></div>
                <div class="sig-name">Platform Director</div>
                <div class="sig-role">Authorised Signatory · LMS Platform</div>
            </div>

        </div>
    </div>

</div>
</body>
</html>