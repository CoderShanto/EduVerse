import React, { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

const LessonVideo = ({ lesson, onUploaded }) => {
  const [files, setFiles] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");

  // DB column is "video" (Cloudinary URL)
  useEffect(() => {
    if (lesson && typeof lesson === "object") {
      setVideoUrl(lesson.video || "");
    }
  }, [lesson]);

  // prevent render crash before lesson loads
  if (!lesson?.id) {
    return (
      <div className="card border-0 shadow-lg">
        <div className="card-body p-4">Loading lesson video…</div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-lg">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="h5 mb-4">Lesson Video</h4>
        </div>

        <FilePond
          credits={false}
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          maxFiles={1}
          name="video"
          acceptedFileTypes={[
            "video/mp4",
            "video/quicktime", // mov
            "video/webm",
            "video/x-msvideo", // avi
            "video/x-matroska", // mkv
          ]}
          maxFileSize="200MB"
          labelIdle='Drag & Drop video or <span class="filepond--label-action">Browse</span>'
          server={{
            process: {
              url: `${apiUrl}/save-lesson-video/${lesson.id}`,
              method: "POST",
              withCredentials: false,
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
              },

              onload: (responseText) => {
                let res;
                try {
                  res = JSON.parse(responseText);
                } catch (e) {
                  console.log("Invalid JSON:", responseText);
                  toast.error("Server returned invalid response");
                  return;
                }

                if (res?.status === 200) {
                  toast.success(res.message || "Video uploaded");

                  // support all common response shapes
                  const url =
                    res.video_url ||
                    res?.data?.video_url ||
                    res?.data?.video ||
                    res?.video ||
                    "";

                  setVideoUrl(url);
                  setFiles([]);

                  if (onUploaded) onUploaded();
                  return;
                }

                toast.error(res?.message || "Upload failed");
              },

              onerror: (err) => {
                console.log("FilePond upload error:", err);
                toast.error("Upload error (check Laravel logs)");
              },
            },
          }}
        />

        {videoUrl ? (
          <div className="mt-3">
            <ReactPlayer width="100%" height="100%" controls url={videoUrl} />
          </div>
        ) : (
          <p className="text-muted mt-3 mb-0" style={{ fontSize: 13 }}>
            No video uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default LessonVideo;