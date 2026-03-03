import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Courses from './components/pages/Courses'
import { Detail } from './components/pages/Detail'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import MyCourses from './components/pages/account/MyCourses'
import MyLearning from './components/pages/account/student/MyLearning'
import WatchCourse from './components/pages/account/WatchCourse'
import ChangePassword from './components/pages/account/ChangePassword'
import { Toaster } from 'react-hot-toast'
import Dashboard from './components/pages/account/Dashboard'
import { RequireAuth } from './components/common/RequireAuth'
import RequireRole from './components/common/RequireRole'
import CreateCourse from './components/pages/account/Courses/CreateCourse'
import EditCourse from './components/pages/account/Courses/EditCourse'
import EditLesson from './components/pages/account/Courses/EditLesson'
import LeaveRating from './components/pages/account/Courses/LeaveRating'
import Profile from './components/pages/account/Profile'
import StudentDashboard from "./components/pages/account/student/StudentDashboard";
import InstructorDashboard from "./components/pages/account/instructor/InstructorDashboard";
import AdminDashboard from "./components/pages/account/admin/AdminDashboard";
import ProblemHub from './components/pages/innovation/ProblemHub'
import ProblemDetails from './components/pages/innovation/ProblemDetails'
import MyIdeas from './components/pages/innovation/MyIdeas'
import MyTeams from './components/pages/innovation/MyTeams'
import IdeaWorkspace from './components/pages/innovation/IdeaWorkspace'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path='/' element={<Home />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/detail/:id' element={<Detail />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/register' element={<Register />} />

          {/* Auth only (any role) */}
          <Route path='/account/change-password' element={
            <RequireAuth>
              <ChangePassword />
            </RequireAuth>
          } />

          <Route path='/account/profile' element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />

          {/* Student only (recommended) */}
          <Route path='/account/student/my-learning' element={
            <RequireAuth>
              <RequireRole roles={['student']}>
                <MyLearning />
              </RequireRole>
            </RequireAuth>
          } />

            <Route path='/account/innovation/my-ideas' element={
            <RequireAuth>
              <RequireRole roles={['student','instructor','admin','mentor']}>
                <MyIdeas  />
              </RequireRole>
            </RequireAuth>
          } />

            <Route path='/account/innovation/my-teams' element={
            <RequireAuth>
              <RequireRole roles={['student','instructor','admin','mentor']}>
                <MyTeams  />
              </RequireRole>
            </RequireAuth>
          } />

                      <Route
              path="/account/innovation"
              element={
                <RequireAuth>
                  <RequireRole roles={['student','instructor','admin','mentor']}>
                    <ProblemHub />
                  </RequireRole>
                </RequireAuth>
              }
            />

            <Route path='/account/innovation/problem/:id' element={
            <RequireAuth>
              <RequireRole roles={['student','instructor','admin','mentor']}>
                <ProblemDetails  />
              </RequireRole>
            </RequireAuth>
          } />

                  <Route
          path="/account/innovation/idea/:id"
          element={
            <RequireAuth>
              <RequireRole roles={['student','instructor','admin']}>
                <IdeaWorkspace />
              </RequireRole>
            </RequireAuth>
          }
        />

         

          <Route path='/account/watch-course/:id' element={
            <RequireAuth>
              <RequireRole roles={['student']}>
                <WatchCourse />
              </RequireRole>
            </RequireAuth>
          } />

          <Route path='/account/leave-rating/:id' element={
            <RequireAuth>
              <RequireRole roles={['student']}>
                <LeaveRating />
              </RequireRole>
            </RequireAuth>
          } />

          {/* Instructor */}
          <Route path='/account/my-courses' element={
            <RequireAuth>
              <RequireRole roles={['instructor','admin']}>
                <MyCourses />
              </RequireRole>
            </RequireAuth>
          } />
           {/* Admin only */}
          <Route path='/account/courses/create' element={
            <RequireAuth>
              <RequireRole roles={['admin','instructor']}>
                <CreateCourse />
              </RequireRole>
            </RequireAuth>
          } />

          <Route path='/account/courses/edit/:id' element={
            <RequireAuth>
              <RequireRole roles={['instructor', 'admin']}>
                <EditCourse />
              </RequireRole>
            </RequireAuth>
          } />

          <Route path='/account/courses/edit-lesson/:id/:courseId' element={
            <RequireAuth>
              <RequireRole roles={['instructor', 'admin']}>
                <EditLesson />
              </RequireRole>
            </RequireAuth>
          } />

          {/* Dashboard (any role) */}
          {/* <Route path='/account/dashboard' element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } /> */}


                  <Route path="/account/student/dashboard" element={
          <RequireAuth>
            <RequireRole roles={["student"]}>
              <StudentDashboard />
            </RequireRole>
          </RequireAuth>
        }/>

        <Route path="/account/instructor/dashboard" element={
          <RequireAuth>
            <RequireRole roles={["instructor"]}>
              <InstructorDashboard />
            </RequireRole>
          </RequireAuth>
        }/>

        <Route path="/account/admin/dashboard" element={
          <RequireAuth>
            <RequireRole roles={["admin"]}>
              <AdminDashboard />
            </RequireRole>
          </RequireAuth>
        }/>





        </Routes>
      </BrowserRouter>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App