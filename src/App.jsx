import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./shared/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";
import { LoginPage } from "./pages/LoginPage";

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
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
