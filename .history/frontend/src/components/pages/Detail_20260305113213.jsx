import React, { useEffect, useMemo, useState } from "react";
import Layout from "../common/Layout";
import { Rating } from "react-simple-star-rating";
import { Accordion } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl, convertMinutesToHours, token } from "../common/Config";
import { LuMonitorPlay } from "react-icons/lu";
import Loading from "../common/Loading";
import FreePreview from "../common/FreePreview";
import toast from "react-hot-toast";

const backendBase = apiUrl.replace(/\/api\/?$/, "");

const buildImgCandidates = (raw, title) => {
  const placeholder = `https://placehold.co/900x500?text=${encodeURIComponent(title || "Course")}`;

  if (!raw) return { candidates: [placeholder], placeholder };

  const s = String(raw).trim();

  if (/^https?:\/\//i.test(s)) return { candidates: [s, placeholder], placeholder };

  if (s.startsWith("/uploads") || s.startsWith("/storage")) {
    return { candidates: [`${backendBase}${s}`, placeholder], placeholder };
  }

  if (s.startsWith("uploads/") || s.startsWith("storage/")) {
    return { candidates: [`${backendBase}/${s}`, placeholder], placeholder };
  }

  const candidates = [
    `${backendBase}/uploads/course/small/${s}`,
    `${backendBase}/uploads/course/${s}`,
    `${backendBase}/uploads/courses/small/${s}`,
    `${backendBase}/uploads/courses/${s}`,
    `${backendBase}/storage/${s}`,
    placeholder,
  ];

  return { candidates, placeholder };
};

const SmartImg = ({ raw, title, className = "", alt = "", style = {} }) => {
  const { candidates } = useMemo(() => buildImgCandidates(raw, title), [raw, title]);
  const [idx, setIdx] = useState(0);

  useEffect(() => setIdx(0), [raw, title]);

  return (
    <img
      src={candidates[idx]}
      alt={alt || title || "Image"}
      className={className}
      style={style}
      onError={() => {
        setIdx((prev) => {
          const next = prev + 1;
          return next < candidates.length ? next : prev;
        });
      }}
    />
  );
};

export const Detail = () => {
  const [show, setShow] = useState(false);
  const [freeLesson, setFreeLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  const handleShow = (lesson) => {
    setShow(true);
    setFreeLesson(lesson);
  };

  const fetchCourse = () => {
    setLoading(true);

    fetch(`${apiUrl}/fetch-course/${params.id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);

        if (result.status == 200) {
          setCourse(result.data);
        }
      });
  };

  const enrollCourse = async () => {
    await fetch(`${apiUrl}/enroll-course`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        course_id: course.id,
      }),
    })
      .then(async (res) => ({
        status: res.status,
        data: await res.json(),
      }))
      .then(({ status, data }) => {
        if (status == 200) {
          toast.success(data.message);
        } else if (status == 401) {
          toast.error("Please login to enroll this course");
          navigate("/account/login");
        } else {
          toast.error(data.message);
        }
      });
  };

  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  const discountPct =
    course?.cross_price && course?.price
      ? Math.round((1 - course.price / course.cross_price) * 100)
      : null;

  return (
    <Layout>
      {freeLesson && (
        <FreePreview
          show={show}
          handleClose={handleClose}
          freeLesson={freeLesson}
        />
      )}

      <div className="container mt-5">

        {loading && <Loading />}

        {!loading && course && (
          <div className="row">

            {/* LEFT */}
            <div className="col-lg-8">

              <h2 className="mb-3">{course.title}</h2>

              <SmartImg
                raw={course.course_small_image || course.image}
                title={course.title}
                className="img-fluid rounded mb-4"
              />

              <p>{course.description}</p>

              {course.outcomes?.length > 0 && (
                <>
                  <h4 className="mt-4">What You Will Learn</h4>
                  <ul>
                    {course.outcomes.map((o, i) => (
                      <li key={i}>{o.text}</li>
                    ))}
                  </ul>
                </>
              )}

              {course.requirements?.length > 0 && (
                <>
                  <h4 className="mt-4">Requirements</h4>
                  <ul>
                    {course.requirements.map((r, i) => (
                      <li key={i}>{r.text}</li>
                    ))}
                  </ul>
                </>
              )}

              {course.chapters?.length > 0 && (
                <>
                  <h4 className="mt-4">Course Curriculum</h4>

                  <Accordion defaultActiveKey="0">

                    {course.chapters.map((chapter, index) => (

                      <Accordion.Item
                        eventKey={String(index)}
                        key={chapter.id}
                      >

                        <Accordion.Header>
                          {chapter.title} ({chapter.lessons_count} lessons)
                        </Accordion.Header>

                        <Accordion.Body>

                          {chapter.lessons.map((lesson) => (

                            <div
                              key={lesson.id}
                              className="d-flex justify-content-between align-items-center mb-2"
                            >

                              <div className="d-flex align-items-center gap-2">
                                <LuMonitorPlay />
                                {lesson.title}
                              </div>

                              <div className="d-flex align-items-center gap-2">

                                {lesson.is_free_preview === "yes" && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleShow(lesson)}
                                  >
                                    Preview
                                  </button>
                                )}

                                <span>
                                  {convertMinutesToHours(lesson.duration)}
                                </span>

                              </div>

                            </div>

                          ))}

                        </Accordion.Body>

                      </Accordion.Item>

                    ))}

                  </Accordion>
                </>
              )}

            </div>

            {/* RIGHT SIDEBAR */}

            <div className="col-lg-4">

              <div className="card shadow">

                <SmartImg
                  raw={course.course_small_image || course.image}
                  title={course.title}
                  className="card-img-top"
                />

                <div className="card-body">

                  <div className="mb-2">

                    <span className="h4">${course.price}</span>

                    {course.cross_price && (
                      <span className="text-muted text-decoration-line-through ms-2">
                        ${course.cross_price}
                      </span>
                    )}

                  </div>

                  {discountPct && (
                    <div className="mb-2 text-success">
                      {discountPct}% Discount
                    </div>
                  )}

                  <button
                    className="btn btn-primary w-100"
                    onClick={enrollCourse}
                  >
                    Enroll Now
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </Layout>
  );
};