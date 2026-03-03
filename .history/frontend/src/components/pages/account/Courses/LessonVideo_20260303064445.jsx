import React, { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

const LessonVideo = ({ lesson, onUploaded }) => {
  const [files, setFiles] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");

  // ✅ Your DB column is "video" now, and it stores Cloudinary URL
  useEffect(() => {
    if (lesson) {
      setVideoUrl(lesson.video || "");
    }
  }, [lesson]);

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
        <div className="d-flex">
          <h4 className="h5 mb-4">Lesson Video</h4>
        </div>

        <FilePond
          acceptedFileTypes={["video/mp4", "video/mov", "video/webm", "video/avi", "video/x-matroska"]}
          credits={false}
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          maxFiles={1}
          server={{
            process: {
              url: `${apiUrl}/save-lesson-video/${lesson.id}`,
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
              onload: (response) => {
                const data = JSON.parse(response);

                if (data.status === 200) {
                  toast.success(data.message || "Video uploaded");

                  // ✅ support both response shapes:
                  // - data.video_url
                  // - data.data.video (lesson object)
                  const url = data.video_url || data?.data?.video || "";
                  setVideoUrl(url);

                  setFiles([]);

                  // refresh parent lesson data
                  if (onUploaded) onUploaded();
                } else {
                  toast.error(data.message || "Upload failed");
                }
              },
              onerror: (err) => {
                console.log(err);
                toast.error("Upload error");
              },
            },
          }}
          name="video"
          labelIdle='Drag & Drop video or <span class="filepond--label-action">Browse</span>'
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