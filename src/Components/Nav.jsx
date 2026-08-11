import { LibraryBig, Search, UserPen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md h-[80px] flex items-center bg-[var(--black)] text-[var(--dark-gray)] z-10">
      <div className="w-full px-[50px] flex justify-between items-center pointer-events-auto">
        <Link to={"/"}>
          <div className="flex flex-col gap-1">
            <LibraryBig size={32} strokeWidth={1.5} />
            <h6 className=" ">Shelf</h6>
            {/* !붙이면 우선순위가 높아짐 */}
          </div>
        </Link>
        <Link to={"/search"}>
          <div className="flex flex-col gap-1">
            <Search size={32} strokeWidth={1.5} />
            <h6 className=" ">Search</h6>
          </div>
        </Link>
        <Link to={"/"}>
          <div className="flex flex-col gap-1">
            <UserPen size={32} strokeWidth={1.5} />
            <h6 className=" ">Profile</h6>
          </div>
        </Link>
      </div>
    </div>
  );
}
