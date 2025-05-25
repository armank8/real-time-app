import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import type { RootState } from '../../store';

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">Chat App</h1>
      {user && (
        <button
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </nav>
  );
}
