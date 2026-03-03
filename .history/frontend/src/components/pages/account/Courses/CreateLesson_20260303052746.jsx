import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const CreateLesson = ({ course, showLessonModel, handleCloseLessonModel, chapters, onLessonCreated }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    await fetch(`${apiUrl}/lessons`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);

        if (result.status == 200) {
          toast.success(result.message);
          reset({ chapter: "", lesson: "", status: "1" });
          handleCloseLessonModel();

          // ✅ Tell the parent a new lesson was created so it can update instantly
          if (onLessonCreated) {
            onLessonCreated(result.data);
          }

        } else {
          toast.error(result.message || "Something went wrong");
        }
      });
  };

  return (
    <>
      <Modal size="lg" show={showLessonModel} onHide={handleCloseLessonModel}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Lesson</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Chapter</label>
              <select
                {...register("chapter", { required: "Please select a chapter" })}
                className={`form-select ${errors.chapter && "is-invalid"}`}
              >
                <option value="">Select Chapter</option>
                {chapters && chapters.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                ))}
              </select>
              {errors.chapter && (
                <p className="invalid-feedback text-danger">{errors.chapter.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Lesson</label>
              <input
                {...register("lesson", { required: "The Lesson field is required" })}
                type="text"
                className={`form-control ${errors.lesson && "is-invalid"}`}
                placeholder="Lesson"
              />
              {errors.lesson && (
                <p className="invalid-feedback text-danger">{errors.lesson.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Status</label>
              <select
                {...register("status", { required: "The Status field is required" })}
                className="form-select"
              >
                <option value="1">Active</option>
                <option value="0">Block</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button disabled={loading} className="btn btn-primary mt-3">
              {loading === false ? "Save" : "Please wait..."}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default CreateLesson;