<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Certificate – {{ $studentName }}</title>

<style>
*{margin:0;padding:0;box-sizing:border-box;}

@page{
    size:A4 landscape;
    margin:0;
}

body{
    width:297mm;
    height:210mm;
    font-family:DejaVu Sans, Arial, sans-serif;
    background:#0f0f0f;
}

/* ==========================
   MAIN CONTAINER
========================== */

.certificate{
    width:297mm;
    height:210mm;
    background:linear-gradient(135deg,#faf7f2 0%,#fffdf9 50%,#f5efe6 100%);
    position:relative;
    overflow:hidden;
}

/* ==========================
   LUXURY BORDER SYSTEM
========================== */

.outer-border{
    position:absolute;
    inset:8mm;
    border:3pt solid #8b6b1f;
}

.inner-border{
    position:absolute;
    inset:12mm;
    border:1pt solid #c8a247;
}

.thin-border{
    position:absolute;
    inset:14mm;
    border:0.5pt solid #e5c97c;
}

/* ==========================
   HEADER
========================== */

.header{
    text-align:center;
    margin-top:28mm;
}

.org{
    font-size:9pt;
    letter-spacing:5px;
    text-transform:uppercase;
    color:#866a2c;
}

.title{
    font-family:DejaVu Serif, Georgia, serif;
    font-size:36pt;
    font-weight:bold;
    color:#2b1b08;
    margin-top:6mm;
}

.subtitle{
    margin-top:3mm;
    font-size:9pt;
    letter-spacing:4px;
    color:#a48235;
}

/* ==========================
   STUDENT SECTION
========================== */

.body-content{
    text-align:center;
    margin-top:18mm;
    padding:0 35mm;
}

.present{
    font-size:11pt;
    letter-spacing:2px;
    color:#6e5421;
    text-transform:uppercase;
}

.name{
    font-family:DejaVu Serif, Georgia, serif;
    font-size:34pt;
    color:#163a6b;
    font-weight:bold;
    margin:6mm 0;
}

.course{
    font-family:DejaVu Serif, Georgia, serif;
    font-size:20pt;
    color:#2b1b08;
    font-weight:bold;
    margin-top:4mm;
}

.description{
    margin-top:4mm;
    font-size:10pt;
    color:#4a3a1a;
}

/* ==========================
   FOOTER
========================== */

.footer{
    position:absolute;
    bottom:26mm;
    left:20mm;
    right:20mm;
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
}

.meta{
    font-size:8pt;
    color:#6c5221;
    line-height:1.8;
}

.meta b{
    color:#2b1b08;
}

/* Signature */
.signature{
    text-align:center;
}

.sig-line{
    width:55mm;
    border-top:1pt solid #8b6b1f;
    margin-bottom:2mm;
}

.sig-name{
    font-family:DejaVu Serif, Georgia, serif;
    font-weight:bold;
    font-size:10pt;
    color:#2b1b08;
}

.sig-role{
    font-size:8pt;
    letter-spacing:1px;
    color:#a48235;
    text-transform:uppercase;
}

/* QR / Verification Box */
.verify-box{
    text-align:right;
    font-size:7pt;
    color:#7a5d28;
}

.qr{
    width:24mm;
    height:24mm;
    border:1pt solid #c8a247;
    margin-bottom:2mm;
}

.watermark{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    font-size:90pt;
    color:rgba(180,140,60,0.04);
    font-family:DejaVu Serif, serif;
    font-weight:bold;
    pointer-events:none;
}
</style>
</head>

<body>

<div class="certificate">

    <div class="outer-border"></div>
    <div class="inner-border"></div>
    <div class="thin-border"></div>

    <div class="watermark">CERTIFIED</div>

    <!-- HEADER -->
    <div class="header">
        <div class="org">LMS PLATFORM · Excellence in Education</div>
        <div class="title">Certificate of Completion</div>
        <div class="subtitle">Awarded With Distinction</div>
    </div>

    <!-- BODY -->
    <div class="body-content">
        <div class="present">This Certificate is Proudly Presented To</div>

        <div class="name">{{ $studentName }}</div>

        <div class="description">
            For successfully completing the professional course
        </div>

        <div class="course">{{ $courseTitle }}</div>
    </div>

    <!-- FOOTER -->
    <div class="footer">

        <!-- Left Meta -->
        <div class="meta">
            Certificate No:<br>
            <b>{{ $certificateNo }}</b><br><br>
            Date of Issue:<br>
            <b>{{ $issueDate }}</b>
        </div>

        <!-- Signature -->
        <div class="signature">
            <div class="sig-line"></div>
            <div class="sig-name">Platform Director</div>
            <div class="sig-role">Authorised Signatory</div>
        </div>

        <!-- Verification -->
        <div class="verify-box">
            <div class="qr">
                <!-- Insert QR Image Here -->
                <!-- <img src="{{ $qrCode }}" width="100%" height="100%"> -->
            </div>
            Verify at:<br>
            <b>lmsplatform.com/verify</b>
        </div>

    </div>

</div>

</body>
</html>