<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Certificate of Completion</title>
    <style>
        * { margin: 0; padding: 0; }
        @page { size: A4 landscape; margin: 0; }
        html, body {
            width: 297mm;
            height: 210mm;
            overflow: hidden;
            background: #fdf6dc;
        }
    </style>
</head>
<body>

<!--
    ENTIRE CERTIFICATE IS ONE SVG — no CSS layout, no flexbox, no absolute divs.
    This guarantees 100% correct rendering in Dompdf / wkhtmltopdf / any PDF engine.
    Canvas: 1122 x 794 px  (A4 landscape at 96dpi)
-->
<svg width="1122" height="794"
     viewBox="0 0 1122 794"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink">

    <!-- ══════════════════════════════════════════
         BACKGROUND
    ══════════════════════════════════════════ -->
    <rect width="1122" height="794" fill="#fdf6dc"/>

    <!-- ══════════════════════════════════════════
         BORDER SYSTEM
    ══════════════════════════════════════════ -->
    <!-- Outer thick border -->
    <rect x="19" y="19" width="1084" height="756" fill="none" stroke="#7a5400" stroke-width="4"/>
    <!-- Middle border -->
    <rect x="28" y="28" width="1066" height="738" fill="none" stroke="#c49010" stroke-width="1.5"/>
    <!-- Inner thin border -->
    <rect x="36" y="36" width="1050" height="722" fill="none" stroke="#e8c84a" stroke-width="1"/>

    <!-- ══════════════════════════════════════════
         SIDE GOLD BARS
    ══════════════════════════════════════════ -->
    <rect x="47" y="53"  width="4" height="688" fill="#c49010"/>
    <rect x="1071" y="53" width="4" height="688" fill="#c49010"/>

    <!-- ══════════════════════════════════════════
         CORNER ORNAMENTS
    ══════════════════════════════════════════ -->
    <!-- TOP-LEFT -->
    <g transform="translate(13,13)">
        <circle cx="0" cy="0" r="8" fill="#7a5400"/>
        <path d="M100,0 Q0,0 0,100" fill="none" stroke="#7a5400" stroke-width="3"/>
        <path d="M75,0 Q0,0 0,75"   fill="none" stroke="#c49010" stroke-width="1.8"/>
        <path d="M50,0 Q0,0 0,50"   fill="none" stroke="#e8c84a" stroke-width="1.2"/>
        <path d="M30,0 Q0,0 0,30"   fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.6"/>
        <circle cx="36" cy="36" r="9"   fill="#c49010" opacity="0.5"/>
        <circle cx="36" cy="36" r="4.5" fill="#f5d840"/>
        <line x1="36" y1="22" x2="36" y2="50" stroke="#c49010" stroke-width="2" opacity="0.9"/>
        <line x1="22" y1="36" x2="50" y2="36" stroke="#c49010" stroke-width="2" opacity="0.9"/>
        <line x1="26" y1="26" x2="46" y2="46" stroke="#c49010" stroke-width="1.3" opacity="0.6"/>
        <line x1="46" y1="26" x2="26" y2="46" stroke="#c49010" stroke-width="1.3" opacity="0.6"/>
        <circle cx="36" cy="22" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="36" cy="50" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="22" cy="36" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="50" cy="36" r="3" fill="#c49010" opacity="0.55"/>
    </g>
    <!-- TOP-RIGHT -->
    <g transform="translate(1109,13) scale(-1,1)">
        <circle cx="0" cy="0" r="8" fill="#7a5400"/>
        <path d="M100,0 Q0,0 0,100" fill="none" stroke="#7a5400" stroke-width="3"/>
        <path d="M75,0 Q0,0 0,75"   fill="none" stroke="#c49010" stroke-width="1.8"/>
        <path d="M50,0 Q0,0 0,50"   fill="none" stroke="#e8c84a" stroke-width="1.2"/>
        <path d="M30,0 Q0,0 0,30"   fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.6"/>
        <circle cx="36" cy="36" r="9"   fill="#c49010" opacity="0.5"/>
        <circle cx="36" cy="36" r="4.5" fill="#f5d840"/>
        <line x1="36" y1="22" x2="36" y2="50" stroke="#c49010" stroke-width="2" opacity="0.9"/>
        <line x1="22" y1="36" x2="50" y2="36" stroke="#c49010" stroke-width="2" opacity="0.9"/>
        <line x1="26" y1="26" x2="46" y2="46" stroke="#c49010" stroke-width="1.3" opacity="0.6"/>
        <line x1="46" y1="26" x2="26" y2="46" stroke="#c49010" stroke-width="1.3" opacity="0.6"/>
        <circle cx="36" cy="22" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="36" cy="50" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="22" cy="36" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="50" cy="36" r="3" fill="#c49010" opacity="0.55"/>
    </g>
    <!-- BOTTOM-LEFT -->
    <g transform="translate(13,781) scale(1,-1)">
        <circle cx="0" cy="0" r="8" fill="#7a5400"/>
        <path d="M100,0 Q0,0 0,100" fill="none" stroke="#7a5400" stroke-width="3"/>
        <path d="M75,0 Q0,0 0,75"   fill="none" stroke="#c49010" stroke-width="1.8"/>
        <path d="M50,0 Q0,0 0,50"   fill="none" stroke="#e8c84a" stroke-width="1.2"/>
        <path d="M30,0 Q0,0 0,30"   fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.6"/>
        <circle cx="36" cy="36" r="9"   fill="#c49010" opacity="0.5"/>
        <circle cx="36" cy="36" r="4.5" fill="#f5d840"/>
        <line x1="36" y1="22" x2="36" y2="50" stroke="#c49010" stroke-width="2" opacity="0.9"/>
        <line x1="22" y1="36" x2="50" y2="36" stroke="#c49010" stroke-width="2" opacity="0.9"/>
        <line x1="26" y1="26" x2="46" y2="46" stroke="#c49010" stroke-width="1.3" opacity="0.6"/>
        <line x1="46" y1="26" x2="26" y2="46" stroke="#c49010" stroke-width="1.3" opacity="0.6"/>
        <circle cx="36" cy="22" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="36" cy="50" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="22" cy="36" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="50" cy="36" r="3" fill="#c49010" opacity="0.55"/>
    </g>
    <!-- BOTTOM-RIGHT -->
    <g transform="translate(1109,781) scale(-1,-1)">
        <circle cx="0" cy="0" r="8" fill="#7a5400"/>
        <path d="M100,0 Q0,0 0,100" fill="none" stroke="#7a5400" stroke-width="3"/>
        <path d="M75,0 Q0,0 0,75"   fill="none" stroke="#c49010" stroke-width="1.8"/>
        <path d="M50,0 Q0,0 0,50"   fill="none" stroke="#e8c84a" stroke-width="1.2"/>
        <path d="M30,0 Q0,0 0,30"   fill="none" stroke="#e8c84a" stroke-width="0.8" opacity="0.6"/>
        <circle cx="36" cy="36" r="9"   fill="#c49010" opacity="0.5"/>
        <circle cx="36" cy="36" r="4.5" fill="#f5d840"/>
        <line x1="36" y1="22" x2="36" y2="50" stroke="#c49010" stroke-width="2" opacity="0.9"/>
        <line x1="22" y1="36" x2="50" y2="36" stroke="#c49010" stroke-width="2" opacity="0.9"/>
        <line x1="26" y1="26" x2="46" y2="46" stroke="#c49010" stroke-width="1.3" opacity="0.6"/>
        <line x1="46" y1="26" x2="26" y2="46" stroke="#c49010" stroke-width="1.3" opacity="0.6"/>
        <circle cx="36" cy="22" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="36" cy="50" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="22" cy="36" r="3" fill="#c49010" opacity="0.55"/>
        <circle cx="50" cy="36" r="3" fill="#c49010" opacity="0.55"/>
    </g>

    <!-- ══════════════════════════════════════════
         WATERMARK (centre, very faint)
    ══════════════════════════════════════════ -->
    <g transform="translate(561,397) " opacity="0.07">
        <circle cx="0" cy="0" r="140" fill="none" stroke="#7a5400" stroke-width="5"/>
        <circle cx="0" cy="0" r="125" fill="none" stroke="#7a5400" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="110" fill="none" stroke="#7a5400" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="136" fill="none" stroke="#7a5400" stroke-width="1.5" stroke-dasharray="7,5"/>
        <polygon points="0,-80 9,-52 38,-52 16,-34 25,-6 0,-24 -25,-6 -16,-34 -38,-52 -9,-52" fill="#7a5400"/>
        <text x="0" y="28" text-anchor="middle" font-size="26" font-family="DejaVu Sans" font-weight="bold" fill="#7a5400" letter-spacing="5">CERTIFIED</text>
        <text x="0" y="56" text-anchor="middle" font-size="16" font-family="DejaVu Sans" fill="#7a5400" letter-spacing="3">OF COMPLETION</text>
    </g>

    <!-- ══════════════════════════════════════════
         HEADER — ORG NAME
    ══════════════════════════════════════════ -->
    <text x="561" y="86" text-anchor="middle"
          font-size="13" font-family="DejaVu Sans" fill="#8B6200"
          letter-spacing="7">LMS PLATFORM  ·  EXCELLENCE IN EDUCATION</text>

    <!-- TOP DIVIDER WITH DIAMONDS -->
    <line x1="68" y1="102" x2="490" y2="102" stroke="#c49010" stroke-width="1.5"/>
    <rect x="506" y="96" width="11" height="11" fill="#a87800" transform="rotate(45,511,101)"/>
    <line x1="517" y1="102" x2="605" y2="102" stroke="#c49010" stroke-width="1.5"/>
    <rect x="621" y="96" width="11" height="11" fill="#a87800" transform="rotate(45,626,101)"/>
    <line x1="632" y1="102" x2="1054" y2="102" stroke="#c49010" stroke-width="1.5"/>

    <!-- ══════════════════════════════════════════
         MAIN TITLE
    ══════════════════════════════════════════ -->
    <text x="561" y="185" text-anchor="middle"
          font-size="72" font-family="DejaVu Serif" font-weight="bold" fill="#1c0e00">Certificate of Completion</text>

    <!-- SUBTITLE DIVIDER -->
    <line x1="68" y1="204" x2="470" y2="204" stroke="#c49010" stroke-width="1.5"/>
    <rect x="486" y="198" width="11" height="11" fill="#a87800" transform="rotate(45,491,203)"/>
    <line x1="497" y1="204" x2="625" y2="204" stroke="#c49010" stroke-width="1.5"/>
    <rect x="641" y="198" width="11" height="11" fill="#a87800" transform="rotate(45,646,203)"/>
    <line x1="652" y1="204" x2="1054" y2="204" stroke="#c49010" stroke-width="1.5"/>

    <text x="561" y="228" text-anchor="middle"
          font-size="13" font-family="DejaVu Sans" fill="#8B6200"
          letter-spacing="6">AWARDED WITH DISTINCTION</text>

    <!-- ══════════════════════════════════════════
         PRESENTED TO LABEL
    ══════════════════════════════════════════ -->
    <text x="561" y="268" text-anchor="middle"
          font-size="13" font-family="DejaVu Sans" fill="#7a5400"
          letter-spacing="5">THIS CERTIFICATE IS PROUDLY PRESENTED TO</text>

    <!-- NAME FLANKING RULES -->
    <line x1="68"  y1="308" x2="240" y2="308" stroke="#a87800" stroke-width="1.5"/>
    <line x1="882" y1="308" x2="1054" y2="308" stroke="#a87800" stroke-width="1.5"/>

    <!-- ══════════════════════════════════════════
         STUDENT NAME
    ══════════════════════════════════════════ -->
    <text x="561" y="314" text-anchor="middle"
          font-size="58" font-family="DejaVu Serif" font-weight="bold" fill="#1a3570">{{ $studentName }}</text>

    <!-- ══════════════════════════════════════════
         FOR COMPLETING
    ══════════════════════════════════════════ -->
    <text x="561" y="352" text-anchor="middle"
          font-size="13" font-family="DejaVu Sans" fill="#7a5400"
          letter-spacing="5">FOR SUCCESSFULLY COMPLETING THE COURSE</text>

    <!-- SMALL DIAMOND DIVIDER -->
    <line x1="400" y1="370" x2="510" y2="370" stroke="#c49010" stroke-width="1"/>
    <rect x="526" y="364" width="8" height="8" fill="#a87800" transform="rotate(45,530,368)"/>
    <line x1="534" y1="370" x2="588" y2="370" stroke="#c49010" stroke-width="1"/>
    <rect x="604" y="364" width="8" height="8" fill="#a87800" transform="rotate(45,608,368)"/>
    <line x1="612" y1="370" x2="722" y2="370" stroke="#c49010" stroke-width="1"/>

    <!-- ══════════════════════════════════════════
         COURSE TITLE
    ══════════════════════════════════════════ -->
    <text x="561" y="415" text-anchor="middle"
          font-size="36" font-family="DejaVu Serif" font-weight="bold" fill="#1c0e00">{{ $courseTitle }}</text>

    <!-- ══════════════════════════════════════════
         FOOTER SEPARATOR
    ══════════════════════════════════════════ -->
    <line x1="68" y1="460" x2="1054" y2="460" stroke="#e8c84a" stroke-width="0.8"/>

    <!-- ══════════════════════════════════════════
         FOOTER LEFT — CERT INFO
    ══════════════════════════════════════════ -->
    <text x="90" y="498" font-size="11" font-family="DejaVu Sans" fill="#8B6200" letter-spacing="2">CERTIFICATE NO.</text>
    <text x="90" y="520" font-size="15" font-family="DejaVu Sans" font-weight="bold" fill="#1c0e00">{{ $certificateNo }}</text>
    <text x="90" y="552" font-size="11" font-family="DejaVu Sans" fill="#8B6200" letter-spacing="2">DATE OF ISSUE</text>
    <text x="90" y="574" font-size="15" font-family="DejaVu Sans" font-weight="bold" fill="#1c0e00">{{ $issueDate }}</text>

    <!-- ══════════════════════════════════════════
         FOOTER CENTRE — GOLD MEDALLION
    ══════════════════════════════════════════ -->
    <g transform="translate(561,560)">
        <!-- outer dashes -->
        <circle cx="0" cy="0" r="118" fill="none" stroke="#c49010" stroke-width="1.5" stroke-dasharray="5,4"/>
        <!-- filled circle -->
        <circle cx="0" cy="0" r="110" fill="#fdf0b0"/>
        <!-- rings -->
        <circle cx="0" cy="0" r="110" fill="none" stroke="#7a5400" stroke-width="3.5"/>
        <circle cx="0" cy="0" r="100" fill="none" stroke="#c49010" stroke-width="1.8"/>
        <circle cx="0" cy="0" r="88"  fill="none" stroke="#e8c84a" stroke-width="1"/>
        <!-- starburst rays -->
        <polygon points="
            0,-82  4,-62  16,-74  12,-54  28,-60  20,-44
            38,-50 26,-36  44,-36  30,-24  48,-18  32,-10
            48,0   32,10   48,18   30,24   44,36   26,36
            38,50  20,44   28,60   12,54   16,74   4,62
            0,82  -4,62  -16,74  -12,54  -28,60  -20,44
            -38,50 -26,36 -44,36 -30,24 -48,18 -32,10
            -48,0  -32,-10 -48,-18 -30,-24 -44,-36 -26,-36
            -38,-50 -20,-44 -28,-60 -12,-54 -16,-74 -4,-62"
            fill="#c49010" opacity="0.25"/>
        <!-- star dark -->
        <polygon points="0,-62 7,-40 30,-40 13,-26 20,-4 0,-18 -20,-4 -13,-26 -30,-40 -7,-40"
                 fill="#7a5400"/>
        <!-- star gold -->
        <polygon points="0,-58 6,-38 27,-38 12,-24 18,-4 0,-16 -18,-4 -12,-24 -27,-38 -6,-38"
                 fill="#f5d020"/>
        <!-- CERTIFIED text -->
        <text x="0" y="28" text-anchor="middle"
              font-size="16" font-family="DejaVu Sans" font-weight="bold"
              fill="#5a3a00" letter-spacing="3">CERTIFIED</text>
        <text x="0" y="46" text-anchor="middle"
              font-size="10" font-family="DejaVu Sans"
              fill="#8B6200" letter-spacing="2">LMS PLATFORM</text>
        <!-- compass dots N S E W -->
        <circle cx="0"    cy="-114" r="4" fill="#c49010"/>
        <circle cx="0"    cy="114"  r="4" fill="#c49010"/>
        <circle cx="-114" cy="0"    r="4" fill="#c49010"/>
        <circle cx="114"  cy="0"    r="4" fill="#c49010"/>
    </g>

    <!-- ══════════════════════════════════════════
         FOOTER RIGHT — SIGNATURE + NAME
    ══════════════════════════════════════════ -->

    <!-- SHANTO HANDWRITTEN SIGNATURE -->
    <!-- Scaled and positioned in right column: centred around x=870, y=530 -->
    <g transform="translate(730, 480) scale(1.15)">
        <!-- S — bold reverse S-curl -->
        <path d="M 14,48 C 4,26 16,6 32,14 C 46,22 40,40 22,42 C 4,44 2,64 20,70 C 38,76 58,62 55,46"
              fill="none" stroke="#1a1050" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- h — tall ascending stem + arch -->
        <path d="M 62,4 L 60,72"
              fill="none" stroke="#1a1050" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M 60,44 C 72,26 88,28 88,46 L 86,72"
              fill="none" stroke="#1a1050" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- a — wide round loop -->
        <path d="M 88,42 C 96,22 118,26 116,46 C 114,62 96,70 89,61 C 84,54 90,46 98,48 C 106,50 112,64 110,76"
              fill="none" stroke="#1a1050" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- n first hump -->
        <path d="M 111,46 C 120,26 136,28 135,46 L 133,76"
              fill="none" stroke="#1a1050" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- n second hump -->
        <path d="M 135,46 C 144,26 160,28 158,46 L 156,74"
              fill="none" stroke="#1a1050" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- t tall stem with curl -->
        <path d="M 165,8 C 163,8 161,46 163,64 C 165,72 174,76 182,70"
              fill="none" stroke="#1a1050" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- t crossbar -->
        <path d="M 152,36 C 160,32 170,30 184,34"
              fill="none" stroke="#1a1050" stroke-width="2.8" stroke-linecap="round"/>
        <!-- o — wide fast oval -->
        <path d="M 194,32 C 206,12 238,16 236,40 C 234,64 206,72 194,56 C 188,46 194,32 206,28"
              fill="none" stroke="#1a1050" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- dramatic underline flourish -->
        <path d="M 8,84 C 60,96 150,98 220,88 C 244,84 260,74 266,62 C 270,54 264,44 256,50 C 248,56 252,68 260,66"
              fill="none" stroke="#1a1050" stroke-width="2.6" stroke-linecap="round"/>
    </g>

    <!-- Signature line rule -->
    <line x1="760" y1="660" x2="1040" y2="660" stroke="#8B6200" stroke-width="1.5"/>

    <!-- Name below line -->
    <text x="900" y="682" text-anchor="middle"
          font-size="18" font-family="DejaVu Serif" font-weight="bold" fill="#1c0e00">Shanto</text>
    <text x="900" y="700" text-anchor="middle"
          font-size="11" font-family="DejaVu Sans" fill="#8B6200" letter-spacing="2">PLATFORM DIRECTOR  ·  LMS PLATFORM</text>

    <!-- ══════════════════════════════════════════
         BOTTOM BORDER RULE
    ══════════════════════════════════════════ -->
    <line x1="68" y1="740" x2="1054" y2="740" stroke="#c49010" stroke-width="0.8"/>

</svg>

</body>
</html>