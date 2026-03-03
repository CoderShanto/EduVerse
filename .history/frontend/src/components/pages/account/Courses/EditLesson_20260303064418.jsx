import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import { Link, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import LessonVideo from "./LessonVideo";

const EditLesson = ({ placeholder }) => {
  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [lesson, setLesson] = useState({}); // ✅ must be object
  const [content, setContent] = useState("");
  const [checked, setChecked] = useState(false);

  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
    }),
    [placeholder]
  );

  const fetchChapters = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/chapters?course_id=${params.courseId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      if (result.status === 200) {
        setChapters(result.data || []);
      } else {
        toast.error(result.message || "Failed to load chapters");
      }
    } catch (e) {
      console.log(e);
      toast.error("Server error loading chapters");
    }
  }, [params.courseId]);

  const fetchLesson = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/lessons/${params.id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.status === 200) {
        const data = result.data || {};
        setLesson(data);

        reset({
          title: data.title || "",
          chapter_id: data.chapter_id || "",
          status: String(data.status ?? "1"),
          duration: data.duration ?? "",
        });

        setContent(data.description || "");
        setChecked(String(data.is_free_preview).toLowerCase() === "yes");
      } else {
        toast.error(result.message || "Failed to load lesson");
      }
    } catch (e) {
      console.log(e);
      toast.error("Server error loading lesson");
    }
  }, [params.id, reset]);

  useEffect(() => {
    fetchChapters();
    fetchLesson();
  }, [fetchChapters, fetchLesson]);

  const onSubmit = async (data) => {
    setLoading(true);

    // ✅ match your backend field names
    const payload = {
      title: data.title,
      chapter_id: data.chapter_id,
      status: data.status,
      duration: data.duration,
      description: content,
      is_free_preview: checked ? "yes" : "no",
    };

    try {
      const res = await fetch(`${apiUrl}/lessons/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.status === 200) {
        toast.success(result.message || "Lesson updated");
        fetchLesson();
      } else if (result.status === 422 && result.errors) {
        Object.keys(result.errors).forEach((field) => {
          setError(field, { message: result.errors[field][0] });
        });
        toast.error("Fix validation errors");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (e) {
      console.log(e);
      toast.error("Network/Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 mb-0 pb-0">Edit Lesson</h2>
                <Link className="btn btn-primary" to={`/account/courses/edit/${params.courseId}`}>
                  Back
                </Link>
              </div>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              <div className="row">
                {/* LEFT */}
                <div className="col-md-8">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow-lg">
                      <div className="card-body p-4">
                        <h4 className="h5 border-bottom pb-3 mb-4">Basic Information</h4>

                        <div className="mb-3">
                          <label className="form-label">Title</label>
                          <input
                            {...register("title", { required: "The title field is required." })}
                            type="text"
                            className={`form-control ${errors.title ? "is-invalid" : ""}`}
                            placeholder="Title"
                          />
                          {errors.title && <p className="invalid-feedback">{errors.title.message}</p>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Chapter</label>
                          <select
                            {...register("chapter_id", { required: "Please Select a Chapter" })}
                            className={`form-select ${errors.chapter_id ? "is-invalid" : ""}`}
                          >
                            <option value="">Select Chapter</option>
                            {chapters.map((chapter) => (
                              <option key={chapter.id} value={chapter.id}>
                                {chapter.title}
                              </option>
                            ))}
                          </select>
                          {errors.chapter_id && <p className="invalid-feedback">{errors.chapter_id.message}</p>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Duration (Mins)</label>
                          <input
                            {...register("duration", { required: "The duration field is required." })}
                            type="number"
                            className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                            placeholder="Duration"
                          />
                          {errors.duration && <p className="invalid-feedback">{errors.duration.message}</p>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <JoditEditor
                            ref={editor}
                            value={content}
                            config={config}
                            tabIndex={1}
                            onBlur={(newContent) => setContent(newContent)}
                            onChange={() => {}}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Status</label>
                          <select
                            {...register("status", { required: "The status field is required." })}
                            className="form-select"
                          >
                            <option value="1">Active</option>
                            <option value="0">Block</option>
                          </select>
                        </div>

                        <div className="d-flex align-items-center">
                          <input
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                            className="form-check-input"
                            type="checkbox"
                            id="freeLesson"
                          />
                          <label className="form-check-label ms-2" htmlFor="freeLesson">
                            Free Lesson
                          </label>
                        </div>

                        <button disabled={loading} className="btn btn-primary mt-3">
                          {loading ? "Please wait..." : "Update"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* RIGHT */}
                <div className="col-md-4">
                  <LessonVideo lesson={lesson} onUploaded={fetchLesson} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditLesson;