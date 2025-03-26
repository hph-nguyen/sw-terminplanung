import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./shared/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";
import { LoginPage } from "./pages/LoginPage";
import GebuchtTermine from "./components/Terminplanung/GebuchtTermine";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
              errorElement={<ErrorPage />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/gebuchte-termine" element={<GebuchtTermine height="100vh" hideFullScreenButton={true} />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
