import React, { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
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
          acceptedFileTypes={["image/jpeg", "image/jpg", "image/png"]}
          credits={false}
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          maxFiles={1}
          server={{
            process: {
              url: `${apiUrl}/save-course-image/${course?.id}`,
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              onload: (response) => {
                try {
                  const parsed = JSON.parse(response);
                  toast.success(parsed?.message || "Cover uploaded");

                  // Backend should return updated course object in `data` with `image` as full URL
                  if (parsed?.data) {
                    setCourse(parsed.data);
                  }

                  setFiles([]);
                } catch (e) {
                  console.error("Invalid JSON from server:", response);
                  toast.error("Upload succeeded but response invalid");
                }
              },
              onerror: (errors) => {
                console.error("Upload error:", errors);
                toast.error("Upload failed");
              },
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
      </div>
    </div>
  );
};

export default EditCover;