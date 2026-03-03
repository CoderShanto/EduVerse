import React, { useEffect, useState } from "react";
import Layout from "../../../common/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import EditCover from "./EditCover";
import ManageChapter from "./ManageChapter";

const EditCourse = () => {
  const [course, setCourse] = useState({});
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: async () => {
      await fetch(`${apiUrl}/courses/${params.id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status == 200) {
            reset({
              title: result.data.title,
              category: result.data.category_id,
              level: result.data.level_id,
              language: result.data.language_id,
              description: result.data.description,
              sell_price: result.data.price,
              cross_price: result.data.cross_price,
            });
            setCourse(result.data);
          }
        });
    },
  });

  const Navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);

  const onSubmit = async (data) => {
    setLoading(true);
    await fetch(`${apiUrl}/courses/${params.id}`, {
      method: "PUT",
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
        } else {
          const errors = result.errors;
          Object.keys(errors).forEach((field) => {
            setError(field, { message: errors[field][0] });
          });
        }
      });
  };

  const courseMetaData = async () => {
    await fetch(`${apiUrl}/courses/meta-data`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          setCategories(result.categories);
          setLevels(result.levels);
          setLanguages(result.languages);
        }
      });
  };

  // ✅ STEP 1: Change publish status
  // ✅ STEP 2: If publishing (status → 1), also mark as featured so it shows on homepage
  const changeStatus = async (course) => {
    const newStatus = course.status == 1 ? 0 : 1;
    setStatusLoading(true);

    try {
      // --- Publish/Unpublish ---
      const res = await fetch(`${apiUrl}/change-course-status/${course.id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();

      if (result.status == 200) {
        const actualStatus = result.course?.status;

        if (actualStatus === newStatus) {
          // Status truly changed
          toast.success(result.message);
          setCourse((prev) => ({ ...prev, status: actualStatus }));

          // ✅ If the course just got PUBLISHED, also mark it as featured
          // so it immediately appears in FeaturedCourses on the homepage
          if (newStatus === 1) {
            await markAsFeatured(course.id);
          }

        } else {
          // Backend blocked it — show the warning message (no chapters/lessons)
          toast.error(result.message);
        }

      } else {
        toast.error(result.message || "Something went wrong.");
      }

    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setStatusLoading(false);
    }
  };

  // ✅ Calls your course update endpoint to set is_featured = 'yes'
  const markAsFeatured = async (courseId) => {
    try {
      await fetch(`${apiUrl}/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_featured: "yes" }),
      });
      // Silently succeeds — no toast needed here
    } catch (err) {
      // Non-critical — don't block the user
      console.warn("Could not mark course as featured:", err);
    }
  };

  useEffect(() => {
    courseMetaData();
  }, []);

  const isPublished = course.status == 1;

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Edit Course
              </li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 mb-0 pb-0">Edit Course</h2>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => changeStatus(course)}
                    disabled={statusLoading || Object.keys(course).length === 0}
                    className={`btn ${isPublished ? "btn-warning" : "btn-success"}`}
                  >
                    {statusLoading
                      ? "Please wait..."
                      : isPublished
                      ? "⏸ Unpublish"
                      : "🚀 Publish"}
                  </button>
                  <Link to={`/account/my-courses`} className="btn btn-dark">
                    ← Back
                  </Link>
                </div>
              </div>

              {!isPublished && Object.keys(course).length > 0 && (
                <div className="alert alert-warning mt-3 mb-0 py-2 px-3" style={{ fontSize: 13 }}>
                  ⚠️ This course is <strong>unpublished</strong>. To publish, add at least{" "}
                  <strong>one chapter</strong> and <strong>one lesson with a video</strong>.
                </div>
              )}
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              <div className="row">
                <div className="col-md-7">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow-lg">
                      <div className="card-body p-4">
                        <h4 className="h5 border-bottom pb-3 mb-4">Course Details</h4>

                        <div className="mb-3">
                          <label className="form-label" htmlFor="title">Course Title</label>
                          <input
                            type="text"
                            {...register("title", { required: "The title field is required" })}
                            className={`form-control ${errors.title && "is-invalid"}`}
                            placeholder="Title"
                          />
                          {errors.title && <p className="invalid-feedback">{errors.title.message}</p>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label" htmlFor="category">Category</label>
                          <select
                            className={`form-select ${errors.category && "is-invalid"}`}
                            id="category"
                            {...register("category", { required: "The category field is required" })}
                          >
                            <option value="">Select a Category</option>
                            {categories && categories.map((category) => (
                              <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                          </select>
                          {errors.category && <p className="invalid-feedback">{errors.category.message}</p>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label" htmlFor="level">Level</label>
                          <select
                            className={`form-select ${errors.level && "is-invalid"}`}
                            id="level"
                            {...register("level", { required: "The level field is required" })}
                          >
                            <option value="">Select a level</option>
                            {levels && levels.map((level) => (
                              <option key={level.id} value={level.id}>{level.name}</option>
                            ))}
                          </select>
                          {errors.level && <p className="invalid-feedback">{errors.level.message}</p>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label" htmlFor="language">Language</label>
                          <select
                            className={`form-select ${errors.language && "is-invalid"}`}
                            id="language"
                            {...register("language", { required: "The language field is required" })}
                          >
                            <option value="">Select a language</option>
                            {languages && languages.map((language) => (
                              <option key={language.id} value={language.id}>{language.name}</option>
                            ))}
                          </select>
                          {errors.language && <p className="invalid-feedback">{errors.language.message}</p>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label" htmlFor="description">Description</label>
                          <textarea
                            {...register("description")}
                            id="description"
                            placeholder="Description"
                            rows={5}
                            className="form-control"
                          />
                        </div>

                        <h4 className="h5 border-bottom pb-3 mb-4">Pricing</h4>

                        <div className="mb-3">
                          <label className="form-label" htmlFor="sell-price">Sell Price</label>
                          <input
                            type="text"
                            {...register("sell_price", { required: "The sell price field is required" })}
                            className={`form-control ${errors.sell_price && "is-invalid"}`}
                            placeholder="Sell Price"
                            id="sell-price"
                          />
                          {errors.sell_price && <p className="invalid-feedback">{errors.sell_price.message}</p>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label" htmlFor="cross-price">Cross Price</label>
                          <input
                            type="text"
                            {...register("cross_price")}
                            className="form-control"
                            placeholder="Cross Price"
                            id="cross-price"
                          />
                        </div>

                        <button disabled={loading} className="btn btn-primary">
                          {loading ? "Please wait..." : "Update"}
                        </button>
                      </div>
                    </div>
                  </form>

                  <ManageChapter course={course} params={params} />
                </div>

                <div className="col-md-5">
                  <EditCover course={course} setCourse={setCourse} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditCourse;