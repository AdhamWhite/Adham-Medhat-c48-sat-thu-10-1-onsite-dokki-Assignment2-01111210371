import { useContext, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FiAlignJustify } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
  const { userLogin, setuserLogin } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem('userToken');
    setuserLogin(null);
    navigate('/login');
  }
  return (
    <nav className='sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur'>
      <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 py-3'>
        <div>
          {/* Logo */}
          <Link to='/' className='text-xl font-bold text-blue-600'>
            Social App
          </Link>
        </div>

        {/* Desktop */}

        <div className='hidden md:flex items center space-x-8 '>
          <ul className='flex flex-col gap-1 md:flex-row md:items-center md:gap-6'>
            {userLogin ? (
              <>
                <li>
                  <Link
                    to='/'
                    className='block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 md:hover:bg-transparent'
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to='/profile'
                    className='block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 md:hover:bg-transparent'
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    className='block rounded-lg  px-4 py-2 text-center text-sm font-medium transition hover:bg-blue-800 bg-blue-600 text-white cursor-pointer'
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <Link
                    to='/change-password'
                    className='block rounded-lg  px-4 py-2 text-center text-sm font-medium transition hover:bg-blue-800 bg-blue-600 text-white cursor-pointer'
                  >
                    Change Password
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to='/register'
                    className='block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 md:hover:bg-transparent'
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to='/login'
                    className='rounded-lg px-4 py-2 text-center text-sm font-medium transition hover:bg-blue-800 bg-blue-600 text-white'
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile menu button */}
        <div className='md:hidden flex items-center'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-700 hover:bg-gray-100 cursor-pointer'
            aria-expanded={isOpen}
          >
            {!isOpen ? <FiAlignJustify /> : <IoIosClose />}
          </button>
        </div>
      </div>
      {/* Mobile */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <ul className='flex flex-col gap-3 items-center'>
          {userLogin ? (
            <>
              {' '}
              <li>
                <Link
                  to='/'
                  className=' block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 md:hover:bg-transparent'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to='/profile'
                  className='block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 md:hover:bg-transparent'
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  className='block rounded-lg my-2 px-4 py-2 text-center text-sm font-medium transition hover:bg-blue-800 bg-blue-600 text-white cursor-pointer'
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
              <li>
                <Link
                  to='/change-password'
                  className='block rounded-lg my-2 px-4 py-2 text-center text-sm font-medium transition hover:bg-blue-800 bg-blue-600 text-white cursor-pointer'
                >
                  Change Password
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to='/'
                  className='block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 md:hover:bg-transparent'
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to='/login'
                  className='block rounded-lg my-2 px-4 py-2 text-center text-sm font-medium transition hover:bg-blue-800 bg-blue-600 text-white'
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
