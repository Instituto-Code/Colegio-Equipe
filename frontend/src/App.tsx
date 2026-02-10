import { LandingPage } from "./pages/landing/Landing";

import { Route, Routes } from "react-router-dom";
import "./index.css";
import { LoginUser } from "./pages/Auth/login/Login";
import { SiginUser } from "./pages/Auth/register/Register";
import { ForgotPass } from "./pages/Auth/resetPass/ForgortPass";
import { ResetPass } from "./pages/Auth/resetPass/ResetPass";
import { AuthProvider, useAuth } from "./contexts/authContext";

import { CoordenadorPage } from "./pages/coordenador/CoordenadorPage";
import { PrivateRouter } from "./components/PrivateRoutes/PrivateRoutes";
import DashboardLayout from "./components/Dasboard/DashboardLayout";
import { UserGerence } from "./components/Coordenador/UserGerence/UserGerence";
import { Matriculas } from "./components/Coordenador/Registration/Matriculas";
import { ProfessorPage } from "./pages/professor/ProfessorPage";
import { GerenciarAlunos } from "./components/professor/Students/GerenceStudents";
import { GerenciarTurmas } from "./components/professor/ClassGerence/GerenceClass";
import { AcademicCalendar } from "./components/Coordenador/Calendar/Calendar";
import { CalendarAcademic } from "./components/professor/Calendar/AcademicCalendar";
import { ClassGerence } from "./components/Coordenador/ClassGerence/ClassGerence";
import { useNotifications } from "./components/NotificationReceived/useNotifications";
import { Configuracoes } from "./components/Configuration/Configuracoes";
import { ThemeProvider } from "./components/Theme/theme-provider";
import { Notes } from "./components/professor/Students/Notes";

function AppContent() {

  const { user } = useAuth();

  useNotifications(user?._id as string, user ? user.role : "");


  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginUser />} />
      <Route path="/register" element={<SiginUser />} />
      <Route path="/forgot" element={<ForgotPass />} />
      <Route path="/resetPass/:token" element={<ResetPass />} />
      <Route path="/settings" element={<Configuracoes />} />

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
        <Route path="gerenciar-turmas" element={<ClassGerence />} />
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

      {/* Rota protegida para gerenciamento de notas do professor*/}
      <Route
        path="/professor/notes/:studentId"
        element={
          <PrivateRouter roles={["professor"]}>
            <Notes />
          </PrivateRouter>
        }
      />

    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
