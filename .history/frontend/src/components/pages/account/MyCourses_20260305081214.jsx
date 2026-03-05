import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserSidebar from "../../common/UserSidebar";
import EditCourse from "../../common/EditCourse";
import Layout from "../../common/Layout";
import { apiUrl } from "../../common/Config";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/Auth";

const MyCourses = () => {
  const { user } = useContext(AuthContext);
  const authToken = user?.token || user?.user?.token;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      if (!authToken) {
        toast.error("Please login again");
        setCourses([]);
        return;
      }

      const response = await fetch(`${apiUrl}/my-courses`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (result?.status === 200) {
        setCourses(result.courses || []);
      } else {
        toast.error(result?.message || "Failed to load courses");
        console.error("Fetch error:", result);
        setCourses([]);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Unable to connect to server");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    const originalCourses = [...courses];
    setCourses((prev) => prev.filter((course) => course.id !== id));

    try {
      if (!authToken) {
        toast.error("Please login again");
        setCourses(originalCourses);
        return;
      }

      const response = await fetch(`${apiUrl}/courses/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = { status: response.ok ? 200 : 400 };
      }

      if (response.ok && (result?.status === 200 || result?.status === 204 || result?.status === undefined)) {
        toast.success("Course deleted successfully");
      } else {
        setCourses(originalCourses);
        toast.error(result?.message || "Failed to delete course");
      }
    } catch (error) {
      setCourses(originalCourses);
      console.error("Delete error:", error);
      toast.error("Network error while deleting");
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <section className="section-4">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 mb-0 pb-0">My Courses</h2>

                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary" onClick={fetchCourses} disabled={loading}>
                    {loading ? "Loading..." : "↻ Refresh"}
                  </button>

                  <Link to="/account/courses/create" className="btn btn-primary">
                    + Create Course
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              {loading && courses.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-2 mb-0">Loading your courses...</p>
                </div>
              ) : !loading && courses.length === 0 ? (
                <div className="text-center py-5 border rounded-3 bg-light">
                  <h5 className="mb-2">No courses yet</h5>
                  <p className="text-muted mb-3">Start by creating your first course!</p>
                  <Link to="/account/courses/create" className="btn btn-primary">
                    + Create Course
                  </Link>
                </div>
              ) : (
                <div className="row gy-4">
                  {courses.map((course) => (
                    <EditCourse key={course.id} course={course} deleteCourse={deleteCourse} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyCourses;