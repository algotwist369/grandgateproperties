import React, {
  Suspense,
  lazy,
  useMemo,
  useCallback,
  useState,
} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

// ---------------- Lazy Loaded Pages ----------------
const HomePage = lazy(() => import('./pages/homePage/HomePage'))
const PropertyDetailsPage = lazy(() => import('./pages/properties/PropertyDetailsPage'))
const PropertyPage = lazy(() => import('./pages/properties/PropertyPage'))
const AgentsPage = lazy(() => import('./pages/agents/AgentsPage'))
const AgentDetailsPage = lazy(() => import('./pages/agents/AgentDetailsPage'))
const ContactPage = lazy(() => import('./pages/contact/ContactPage'))
const AboutPage = lazy(() => import('./pages/about/AboutPage'))
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/legal/TermsPage'))
const CookiePage = lazy(() => import('./pages/legal/CookiePage'))
const Login = lazy(() => import('./commmon_pages/Login'))
const SignUp = lazy(() => import('./commmon_pages/SignUp'))

// ---------------- Admin Pages ----------------
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'))
const AgentLayout = lazy(() => import('./agent/layouts/AgentLayout'))
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'))
const AdminAgents = lazy(() => import('./admin/pages/AgentsList'))
const AddAgentPage = lazy(() => import('./admin/pages/AddAgentPage'))
const EditAgentPage = lazy(() => import('./admin/pages/EditAgentPage'))
const AdminProperties = lazy(() => import('./admin/pages/PropertiesList'))
const AdminUsers = lazy(() => import('./admin/pages/UsersList'))

// ---------------- Common Dashboard Pages (for Admin & Agent) ----------------
const AddProperty = lazy(() => import('./commmon_pages/AddProperties'))
const UpdateProperty = lazy(() => import('./commmon_pages/UpdateProperties'))
const Profile = lazy(() => import('./commmon_pages/Profile'))

// ---------------- Page Loader ----------------
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#111010]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#BD9B5F]/30 border-t-[#BD9B5F] rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
)

const ContentWrapper = ({ countryValue, handleCountryChange }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/agent') ||
    ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="text-white min-h-screen flex flex-col font-sans bg-[#111010]">
      {!isDashboard && (
        <Navbar
          selectedCountry={countryValue}
          setSelectedCountry={handleCountryChange}
        />
      )}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/en" replace />} />

          {/* Home */}
          <Route
            path="/en"
            element={
              <HomePage
                selectedCountry={countryValue}
                setSelectedCountry={handleCountryChange}
              />
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Property Routes */}
          <Route path="/en/properties" element={<PropertyPage />} />
          <Route path="/en/buy" element={<PropertyPage />} />
          <Route path="/en/rent" element={<PropertyPage />} />
          <Route path="/en/off-plan" element={<PropertyPage />} />
          <Route path="/en/catalogs" element={<PropertyPage />} />
          <Route path="/en/properties/:slug" element={<PropertyDetailsPage />} />

          {/* Agents */}
          <Route path="/en/agents" element={<AgentsPage />} />
          <Route path="/en/agents/:id" element={<AgentDetailsPage />} />

          {/* Legal & Contact */}
          <Route path="/en/contact" element={<ContactPage />} />
          <Route path="/en/about" element={<AboutPage />} />
          <Route path="/en/privacy" element={<PrivacyPage />} />
          <Route path="/en/terms" element={<TermsPage />} />
          <Route path="/en/cookies" element={<CookiePage />} />

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="agents" element={<AdminAgents />} />
            <Route path="agents/add" element={<AddAgentPage />} />
            <Route path="agents/edit/:slug" element={<EditAgentPage />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="update-property/:slug" element={<UpdateProperty />} />
          </Route>

          {/* Agent Dashboard Routes */}
          <Route path="/agent" element={<AgentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} /> {/* Assuming shared dashboard for now */}
            <Route path="profile" element={<Profile />} />
            <Route path="properties" element={<AdminProperties />} /> {/* Assuming shared properties view for now */}
            <Route path="add-property" element={<AddProperty />} />
            <Route path="update-property/:slug" element={<UpdateProperty />} />
          </Route>

          {/* Fallback (404 → Home) */}
          <Route path="*" element={<Navigate to="/en" replace />} />
        </Routes>
      </Suspense>

      {!isDashboard && <Footer />}
    </div>
  );
};

// ---------------- App ----------------
const App = () => {
  const [selectedCountry, setSelectedCountry] = useState('All')

  const handleCountryChange = useCallback((country) => {
    setSelectedCountry(country)
  }, [])

  const countryValue = useMemo(() => selectedCountry, [selectedCountry])

  return (
    <Router>
      <ContentWrapper
        countryValue={countryValue}
        handleCountryChange={handleCountryChange}
      />
    </Router>
  )
}

export default App
