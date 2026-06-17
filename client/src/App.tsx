import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/config/constants";
import { PublicSiteShell } from "@/components/seo/PublicSiteShell";
import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { SkillsPage } from "@/pages/SkillsPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { GhostProtocolDetail } from "@/pages/GhostProtocolDetail";
import { EducationPage } from "@/pages/EducationPage";
import { ContactPage } from "@/pages/ContactPage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminProjectsPage } from "@/pages/admin/AdminProjectsPage";
import { AdminAboutPage } from "@/pages/admin/AdminAboutPage";
import { AdminEducationPage } from "@/pages/admin/AdminEducationPage";
import { AdminNowPage } from "@/pages/admin/AdminNowPage";
import { AdminContactPage } from "@/pages/admin/AdminContactPage";
import { AdminMessagesPage } from "@/pages/admin/AdminMessagesPage";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicSiteShell />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.SKILLS} element={<SkillsPage />} />
        <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
        <Route path={`${ROUTES.PROJECTS}/ghost-protocol`} element={<GhostProtocolDetail />} />
        <Route path={`${ROUTES.PROJECTS}/:slug`} element={<ProjectDetailPage />} />
        <Route path={ROUTES.EDUCATION} element={<EducationPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      </Route>
      <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
        <Route index element={<Navigate to={`${ROUTES.ADMIN}/dashboard`} replace />} />
        <Route path="giris" element={<AdminLoginPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="about" element={<AdminAboutPage />} />
        <Route path="education" element={<AdminEducationPage />} />
        <Route path="now" element={<AdminNowPage />} />
        <Route path="contact" element={<AdminContactPage />} />
        <Route path="mesajlar" element={<AdminMessagesPage />} />
        <Route path="icerik" element={<Navigate to={ROUTES.ADMIN_PROJECTS} replace />} />
        <Route path="ayarlar" element={<Navigate to={ROUTES.ADMIN_ABOUT} replace />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
