import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserSidebar from "../../common/UserSidebar";
import EditCourse from "../../common/EditCourse";
import Layout from "../../common/Layout";
import { apiUrl } from "../../common/Config";
import toast from "react-hot-toast";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const authToken = localStorage.getItem("token"); // ✅ dynamic token
      const res = await fetch(`${apiUrl}/my-courses`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await res.json();

      if (result.status === 200) {
        setCourses(result.courses || result.data || []);
      } else {
        toast.error(result.message || "Failed to load courses");
      }
    } catch (e) {
      console.log(e);
      toast.error("Server error loading courses");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      const authToken = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/courses/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await res.json();

      if (result.status === 200) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
        toast.success("Course deleted");
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (e) {
      console.log(e);
      toast.error("Server error deleting course");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Layout>
      <section className="section-4">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">My Courses</h2>
                <Link to="/account/courses/create" className="btn btn-primary">
                  Create
                </Link>
              </div>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              {loading ? (
                <div className="p-3 text-muted">Loading…</div>
              ) : (
                <div className="row gy-4">
                  {courses.map((course) => (
                    <EditCourse
                      key={course.id} // ✅ key fix
                      course={course}
                      deleteCourse={deleteCourse}
                    />
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