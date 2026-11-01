import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, type loginSchemaType } from '../../Schemas/auth.schema';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<loginSchemaType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const { userLogin, setuserLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = form;

  // console.log(formState);

  function handleLogin(values: loginSchemaType) {
    console.log(values);
    setIsLoading(true);
    axios
      .post('https://route-posts.routemisr.com/users/signin', values)
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          console.log(res.data);
          localStorage.setItem('userToken', res.data.data.token);
          setuserLogin(res.data.data.token);
          navigate('/home');
          // react alerts replace with toastify or sweetalert2
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
        console.log(err.response.data);
        // react alerts replace with toastify or sweetalert2
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className='flex my-12 items-center  p-4'>
      <div className='grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl'>
        {/* Form section */}
        <div className='p-8 sm:p-10'>
          <h1 className='text-3xl font-bold text-gray-900'>Login Now</h1>
          <p className='mb-6 mt-1 text-sm text-gray-500'>
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit(handleLogin)} className='space-y-4'>
            {/* Email */}
            <div>
              <label
                htmlFor='email'
                className='mb-1.5 block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                placeholder='name@example.com'
                className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100'
                {...register('email')}
              />
            </div>
            {formState.errors.email && formState.touchedFields.email && (
              <p className='font-bold text-red-500'>
                {formState.errors.email.message}
              </p>
            )}

            {/* Passwords side by side on larger screens */}

            <div>
              <label
                htmlFor='password'
                className='mb-1.5 block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                type='password'
                id='password'
                placeholder='••••••••'
                className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100'
                {...register('password')}
              />
            </div>
            {formState.errors.password && formState.touchedFields.password && (
              <p className='font-bold text-red-500'>
                {formState.errors.password.message}
              </p>
            )}

            {/* Submit */}
            <button
              disabled={isLoading}
              type='submit'
              className='w-full disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98]'
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <Link
            to='/register'
            className='mt-4 block text-center text-sm text-blue-500 font-bold underline'
          >
            Don't have an account? Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
