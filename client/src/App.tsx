import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/layouts/website/Header";
import "./index.css";
import Footer from "./components/layouts/website/Footer";
import HomePage from "./pages/website/HomePage";
import AboutPage from "./pages/website/AboutPage";
import Blog from "./pages/website/Blog";
import Lienhe from "./pages/website/Lienhe";
import Login from "./pages/website/Login";
import Register from "./pages/website/Register";
import ListRoom from "./pages/website/ListRoom";
import Detail from "./pages/website/Detail";
import Pay1 from "./pages/website/Pay1";
import Pay2 from "./pages/website/Pay2";
import History1 from "./pages/website/History1";
import History2 from "./pages/website/History2";
import PaymentConfirmation from "./pages/website/PaymentConfirmation";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/danhsach" element={<ListRoom />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/lienhe" element={<Lienhe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/paymentconfirmation" element={<PaymentConfirmation />} />
        <Route path="/pay1" element={<Pay1 />} />
        <Route path="/pay2" element={<Pay2 />} />
        <Route path="/history1" element={<History1 />} />
        <Route path="/history2" element={<History2 />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
