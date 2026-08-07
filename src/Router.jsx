import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "../src/Pages/ErrorPage";
import Home from "./Pages/Home/Home";
import Search from "./Pages/Search/Search";
import Detail from "./Pages/Detail/Detail";
import Nav from "./Components/Nav";

export default function Router() {
  return (
    <div className=" mx-auto max-w-md min-w-s min-h-screen bg-white">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/detail/:id" element={<Detail />}></Route>
          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
        <Nav />
      </HashRouter>
    </div>
  );
}
