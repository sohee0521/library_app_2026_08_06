import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import Detail from "./pages/detail/Detail";
import Nav from "./components/Nav";
import AddBook from "./pages/home/AddBook";
import Log from "./pages/home/Log";

export default function Router() {
  return (
    <div className=" mx-auto max-w-md min-w-s min-h-screen bg-white shadow-xl">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/detail/:id" element={<Detail />}></Route>
          <Route path="/addBook" element={<AddBook />}></Route>
          <Route path="/log/:id" element={<Log />}></Route>
          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
        <Nav />
      </HashRouter>
    </div>
  );
}
