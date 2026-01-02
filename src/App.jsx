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
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/legal/TermsPage'))
const CookiePage = lazy(() => import('./pages/legal/CookiePage'))

// ---------------- Page Loader ----------------
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#111010]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#D3A188]/30 border-t-[#D3A188] rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
)

// ---------------- App ----------------
const App = () => {
  const [selectedCountry, setSelectedCountry] = useState('Dubai')

  const handleCountryChange = useCallback((country) => {
    setSelectedCountry(country)
  }, [])

  const countryValue = useMemo(() => selectedCountry, [selectedCountry])

  return (
    <Router>
      <div className="text-white min-h-screen flex flex-col">
        <Navbar
          selectedCountry={countryValue}
          setSelectedCountry={handleCountryChange}
        />

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

            {/* Property Routes */}
            <Route path="/en/properties" element={<PropertyPage />} />
            <Route path="/en/buy" element={<PropertyPage />} />
            <Route path="/en/rent" element={<PropertyPage />} />
            <Route path="/en/off-plan" element={<PropertyPage />} />
            <Route path="/en/catalogs" element={<PropertyPage />} />
            <Route path="/en/properties/:slug" element={<PropertyDetailsPage />} />

            {/* Agents */}
            <Route path="agents" element={<AgentsPage />} />
            <Route path="agents/:id" element={<AgentDetailsPage />} />

            {/* Legal & Contact */}
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="cookies" element={<CookiePage />} />

            {/* Fallback (404 → Home) */}
            <Route path="*" element={<Navigate to="/en" replace />} />
          </Routes>
        </Suspense>

        <Footer />
      </div>
    </Router>
  )
}

export default App
