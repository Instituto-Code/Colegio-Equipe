import { LandingPage } from "./pages/landing/Landing";

import { Route, Routes } from "react-router-dom";
import "./index.css";
import { LoginUser } from "./pages/Auth/login/Login";
import { SiginUser } from "./pages/Auth/register/Register";
import { ForgotPass } from "./pages/Auth/resetPass/ForgortPass";
import { ResetPass } from "./pages/Auth/resetPass/ResetPass";
import { AuthProvider } from "./contexts/authContext";

import { CoordenadorPage } from "./pages/coordenador/CoordenadorPage";
import { PrivateRouter } from "./components/PrivateRoutes/PrivateRoutes";
import DashboardLayout from "./components/Dasboard/DashboardLayout";
import { UserGerence } from "./components/Coordenador/UserGerence/UserGerence";
import { Matriculas } from "./components/Coordenador/Matriculas";
import { ProfessorPage } from "./pages/professor/ProfessroPage";
import { GerenciarAlunos } from "./components/professor/GerenceStudents";
import { GerenciarTurmas } from "./components/professor/GerenceClass";
import { AcademicCalendar } from "./components/Coordenador/Calendar/Calendar";
import { CalendarAcademic } from "./components/professor/Calendar/AcademicCalendar";

function AppContent() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginUser />} />
      <Route path="/register" element={<SiginUser />} />
      <Route path="/forgot" element={<ForgotPass />} />
      <Route path="/resetPass/:token" element={<ResetPass />} />

      {/* Protegidas */}

      {/* Rotas de coordenador */}
      <Route
        path="/coordenador"
        element={
          <PrivateRouter roles={["coordenador"]}>
            <DashboardLayout />
          </PrivateRouter>
        }
      >
        {/* Rotas do coordenador */}
        <Route index element={<CoordenadorPage />} />
        <Route path="gerenciar" element={<UserGerence />} />
        <Route path="matriculas" element={<Matriculas />} />
        <Route path="calendar" element={<AcademicCalendar />} />
      </Route>

      {/* Rotas do professor */}
      <Route
        path="/professor"
        element={
          <PrivateRouter roles={["professor"]}>
            <DashboardLayout />
          </PrivateRouter>
        }
      >
        {/* Rotas do professor */}
        <Route index element={<ProfessorPage />} />
        <Route path="gerenciar-alunos" element={<GerenciarAlunos />} />
        <Route path="gerenciar-turmas" element={<GerenciarTurmas />} />
        <Route path="calendar" element={<CalendarAcademic />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
