import { LibraryBig, Search, UserPen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const activeColor = "var(--main-blue)"; // 활성화 시 색상 (기본값 파란색 예시)
  const inactiveColor = "var(--dark-gray)";

  return (
    <div className="fixd bottom-0 left-0 right-0 mx-auto max-w-md h-[70px] flex items-center bg-[var(--black)] text-[var(--dark-gray)] z-10 border-t-[1px] border-[var(--dark-gray)]">
      <div className="w-full px-[50px] flex justify-between items-center pointer-events-auto">
        {/* Shelf (메인)*/}
        <Link to="/">
          <div
            className="flex flex-col items-center gap-1 transition-colors duration-200"
            style={{
              color: currentPath === "/" ? activeColor : inactiveColor,
            }}
          >
            <LibraryBig
              size={25}
              strokeWidth={1.5}
              color={currentPath === "/" ? activeColor : inactiveColor}
            />
            <h6 className="text-xs font-medium">Shelf</h6>
          </div>
        </Link>

        {/* Search\ */}
        <Link to="/search">
          <div
            className="flex flex-col items-center gap-1 transition-colors duration-200"
            style={{
              color: currentPath.startsWith("/search")
                ? activeColor
                : inactiveColor,
            }}
          >
            <Search
              size={25}
              strokeWidth={1.5}
              color={
                currentPath.startsWith("/search") ? activeColor : inactiveColor
              }
            />
            <h6 className="text-xs font-medium">Search</h6>
          </div>
        </Link>

        {/* Profile \ */}
        <Link to="/profile">
          <div
            className="flex flex-col items-center gap-1 transition-colors duration-200"
            style={{
              color: currentPath.startsWith("/profile")
                ? activeColor
                : inactiveColor,
            }}
          >
            <UserPen
              size={25}
              strokeWidth={1.5}
              color={
                currentPath.startsWith("/profile") ? activeColor : inactiveColor
              }
            />
            <h6 className="text-xs font-medium">Profile</h6>
          </div>
        </Link>
      </div>
    </div>
  );
}
