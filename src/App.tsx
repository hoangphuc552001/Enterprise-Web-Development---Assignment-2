import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/homePage";


const App = () => {
  return (
    <Routes>
      {/* PUBLIC routes */}
      <Route path="/" element={<HomePage />} />

      {/*  FALLBACK routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
