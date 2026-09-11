import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Membership from './pages/Membership.jsx'
import Gallery from './pages/Gallery.jsx'
import DietPlans from './pages/DietPlans.jsx'
import ExerciseGuide from './pages/ExerciseGuide.jsx'
import ExerciseDetail from './pages/ExerciseDetail.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

import AdminLogin from './pages/admin/Login.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminMembership from './pages/admin/Membership.jsx'
import AdminGallery from './pages/admin/Gallery.jsx'
import AdminDietPlans from './pages/admin/DietPlans.jsx'
import AdminExercises from './pages/admin/Exercises.jsx'
import AdminEnquiries from './pages/admin/Enquiries.jsx'
import AdminGymInfo from './pages/admin/GymInfo.jsx'
import AdminGymTimings from './pages/admin/GymTimings.jsx'
import AdminSettings from './pages/admin/Settings.jsx'

function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-obsidian">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/membership" element={<PublicLayout><Membership /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/diet-plans" element={<PublicLayout><DietPlans /></PublicLayout>} />
      <Route path="/exercise-guide" element={<PublicLayout><ExerciseGuide /></PublicLayout>} />
      <Route path="/exercise-guide/:id" element={<PublicLayout><ExerciseDetail /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Admin auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin panel (protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="membership" element={<AdminMembership />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="diet-plans" element={<AdminDietPlans />} />
        <Route path="exercises" element={<AdminExercises />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="gym-info" element={<AdminGymInfo />} />
        <Route path="gym-timings" element={<AdminGymTimings />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  )
}
