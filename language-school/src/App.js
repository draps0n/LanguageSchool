import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import CoursesList from "./components/CoursesList";
import CourseDetails from "./components/CourseDetails";
import "./App.css";
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import { useAuthInterceptor } from "./api/axios";

function App() {
  useAuthInterceptor();

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<CoursesList />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            stacked
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            toastStyle={{ marginRight: "1rem", marginTop: "6rem" }}
            closeButton={false}
          />
        </main>
      </div>
    </Router>
  );
}

export default App;
