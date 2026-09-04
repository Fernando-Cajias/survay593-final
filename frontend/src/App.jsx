import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { OrganizationProvider } from './context/OrganizationContext';

import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

// Doer Pages
import { DoerDashboard } from './pages/doer/DoerDashboard';
import { DoerSurveys } from './pages/doer/DoerSurveys';
import { DoerSurveyAnswer } from './pages/doer/DoerSurveyAnswer';
import { DoerWallet } from './pages/doer/DoerWallet';
import { DoerProfile } from './pages/doer/DoerProfile';
import { DoerVerification } from './pages/doer/DoerVerification';

// Provider Pages (Institución Educativa / Empresa)
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { CreateSurveyWizard } from './pages/provider/CreateSurveyWizard';
import { SurveyResults } from './pages/provider/SurveyResults';
import { ProviderCampaigns } from './pages/provider/ProviderCampaigns';
import { ProviderBilling } from './pages/provider/ProviderBilling';
import { DashboardStudio } from './pages/provider/DashboardStudio';
import { CustomDashboardsList } from './pages/provider/CustomDashboardsList';
import { LiveDashboardView } from './pages/provider/LiveDashboardView';
import { OnboardingInstitution } from './pages/provider/OnboardingInstitution';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSurveys } from './pages/admin/AdminSurveys';
import { AdminQuality } from './pages/admin/AdminQuality';
import { AdminEcosystem } from './pages/admin/AdminEcosystem';

export const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DatabaseProvider>
            <OrganizationProvider>
              <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Doer Routes (Padre de Familia / Comunidad Educativa) */}
              <Route element={<Layout allowedRoles={['doer']} />}>
                <Route path="/doer" element={<DoerDashboard />} />
                <Route path="/doer/surveys" element={<DoerSurveys />} />
                <Route path="/doer/survey/:id" element={<DoerSurveyAnswer />} />
                <Route path="/doer/wallet" element={<DoerWallet />} />
                <Route path="/doer/profile" element={<DoerProfile />} />
                <Route path="/doer/verification" element={<DoerVerification />} />
              </Route>

              {/* Provider Routes (Institución Educativa / Empresa) */}
              <Route element={<Layout allowedRoles={['provider']} />}>
                <Route path="/provider" element={<ProviderDashboard />} />
                <Route path="/provider/onboarding" element={<OnboardingInstitution />} />
                <Route path="/provider/create" element={<CreateSurveyWizard />} />
                <Route path="/provider/results" element={<SurveyResults />} />
                <Route path="/provider/results/:id" element={<SurveyResults />} />
                <Route path="/provider/campaigns" element={<ProviderCampaigns />} />
                <Route path="/provider/billing" element={<ProviderBilling />} />
                <Route path="/provider/studio" element={<DashboardStudio />} />
                <Route path="/provider/studio/edit/:id" element={<DashboardStudio />} />
                <Route path="/provider/dashboards" element={<CustomDashboardsList />} />
                <Route path="/provider/dashboard/view/:id" element={<LiveDashboardView />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<Layout allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/surveys" element={<AdminSurveys />} />
                <Route path="/admin/quality" element={<AdminQuality />} />
                <Route path="/admin/ecosystem" element={<AdminEcosystem />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </OrganizationProvider>
      </DatabaseProvider>
    </AuthProvider>
  </LanguageProvider>
</ThemeProvider>
  );
};
