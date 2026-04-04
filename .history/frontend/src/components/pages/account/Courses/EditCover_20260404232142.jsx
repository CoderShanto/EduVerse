import React, { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { apiUrl, getToken } from "../../../common/Config";
import toast from "react-hot-toast";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
);

const EditCover = ({ course, setCourse }) => {
  const [files, setFiles] = useState([]);

  return (
    <div className="card border-0 shadow-lg mt-4">
      <div className="card-body p-4">
        <div className="d-flex">
          <h4 className="h5 mb-4">Cover Image</h4>
        </div>

        <FilePond
          acceptedFileTypes={[
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ]}
          credits={false}
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          maxFiles={1}
          server={{
            process: (
              fieldName,
              file,
              metadata,
              load,
              error,
              progress,
              abort,
            ) => {
              const formData = new FormData();
              formData.append("image", file);

              const request = new XMLHttpRequest();
              const uploadUrl = `${apiUrl}/save-course-image/${course?.id}`;
              const token = getToken();

              console.log("UPLOAD URL =>", uploadUrl);
              console.log("UPLOAD TOKEN =>", token);
              console.log("COURSE ID =>", course?.id);
              console.log("FILE NAME =>", file?.name);

              request.open("POST", uploadUrl, true);
              request.responseType = "text";
              request.withCredentials = false;

              request.setRequestHeader("Accept", "application/json");
              request.setRequestHeader(
                "Authorization",
                `Bearer ${token || ""}`,
              );

              request.upload.onprogress = (e) => {
                progress(e.lengthComputable, e.loaded, e.total);
              };

              request.onload = () => {
                console.log("UPLOAD STATUS =>", request.status);
                console.log("UPLOAD RESPONSE =>", request.responseText);

                if (request.status >= 200 && request.status < 300) {
                  try {
                    const parsed = JSON.parse(request.responseText);

                    toast.success(parsed?.message || "Cover uploaded");

                    if (parsed?.data) {
                      setCourse(parsed.data);
                    }

                    setFiles([]);
                    load(request.responseText);
                  } catch (e) {
                    console.error(
                      "Invalid JSON from server:",
                      request.responseText,
                    );
                    toast.error("Upload succeeded but response invalid");
                    error("Invalid server response");
                  }
                } else {
                  console.error(
                    "Upload failed response:",
                    request.responseText,
                  );
                  toast.error("Upload failed");
                  error(request.responseText || "Upload failed");
                }
              };

              request.onerror = () => {
                console.error("XHR upload error:", request.responseText);
                toast.error("Upload failed");
                error(request.responseText || "Network error");
              };

              request.onabort = () => {
                console.warn("Upload aborted");
                abort();
              };

              request.send(formData);

              return {
                abort: () => {
                  request.abort();
                },
              };
            },
          }}
          name="image"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />

        {course?.image && (
          <img
            src={course.image}
            alt="Course cover"
            className="w-100 rounded mt-3"
          />
        )}

        {course?.image_url && !course?.image && (
          <img
            src={course.image_url}
            alt="Course cover"
            className="w-100 rounded mt-3"
          />
        )}
      </div>
    </div>
  );
};

export default EditCover;
