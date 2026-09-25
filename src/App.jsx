import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AddFaculty from "./pages/AddFaculty";
import AddStudent from "./pages/AddStudent";
import CreateCourseClass from "./pages/CreateCourseClass";
import CourseClasses from "./pages/CourseClasses";
import Advising from "./pages/Advising";
import SystemConfig from "./pages/SystemConfig";
import AdminDashboard from "./pages/AdminDashboard";


import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/add-faculty"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <AddFaculty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/course-classes"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <CourseClasses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/advising"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Advising />
            </ProtectedRoute>
          }
        />
    

        <Route
          path="/staff/create-class"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <CreateCourseClass />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/course-classes"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <CourseClasses />
            </ProtectedRoute>
          }
        />


        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/add-student"
          element={
          <ProtectedRoute allowedRoles={["staff"]}>
              <AddStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/config"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <SystemConfig />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
