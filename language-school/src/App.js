import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import roles from "./constants/roles";
import RequireAuth from "./components/RequireAuth";
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import CoursesList from "./components/CoursesList";
import CourseDetails from "./components/CourseDetails";
import Body from "./components/Body";
import Forbidden from "./components/Forbidden";
import CourseForm from "./components/CourseForm";
import CourseApply from "./components/CourseApply";
import CourseDeleteConfirmation from "./components/CourseDeleteConfirmation";
import "./App.css";
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Body />}>
          {/* Ścieżki dostępne dla wszystkich */}
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Ścieżki dostępne po zalogowaniu */}
          <Route element={<RequireAuth />}>
            <Route path="courses" element={<CoursesList />} />
            <Route path="courses/:id" element={<CourseDetails />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Ścieżki dostępne dla studentów */}
          <Route element={<RequireAuth allowedRoles={[roles.STUDENT]} />}>
            <Route path="courses/:id/apply" element={<CourseApply />} />
          </Route>

          {/* Ścieżki dostępne dla pracowników */}
          <Route element={<RequireAuth allowedRoles={[roles.EMPLOYEE]} />}>
            <Route path="courses/:id/edit" element={<CourseForm />} />
            <Route
              path="courses/:id/delete"
              element={<CourseDeleteConfirmation />}
            />
            <Route path="courses/add" element={<CourseForm />} />
          </Route>

          {/* Ścieżki do błędów */}
          <Route path="forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        stacked
        closeOnClick={false}
        rtl={false}
        draggable
        toastStyle={{ marginRight: "1rem", marginTop: "6rem" }}
        closeButton={false}
      />
    </Router>
  );
}

export default App;
