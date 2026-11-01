import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import {
  changePasswordSchema,
  type changePasswordSchemaType,
} from '../../Schemas/auth.schema';

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<changePasswordSchemaType>({
    defaultValues: { password: '', newPassword: '', rePassword: '' },
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  function changePassword(body: { password: string; newPassword: string }) {
    return axios.patch(
      'https://route-posts.routemisr.com/users/change-password',
      body,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      console.log(res.data); // check the real field name of the new token

      const newToken = res.data.data?.token;
      if (newToken) {
        localStorage.setItem('userToken', newToken);
      }
      toast.success(res.data.message);
      reset();
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || err.message);
    },
  });

  function handleChangePassword(values: changePasswordSchemaType) {
    mutate({ password: values.password, newPassword: values.newPassword });
  }

  return (
    <div className='mx-auto my-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
      <h1 className='text-2xl font-bold text-gray-900'>Change password</h1>
      <p className='mb-6 mt-1 text-sm text-gray-500'>
        Enter your current password and choose a new one
      </p>

      <form onSubmit={handleSubmit(handleChangePassword)} className='space-y-4'>
        {/* Current password */}
        <div>
          <label
            htmlFor='password'
            className='mb-1.5 block text-sm font-medium text-gray-700'
          >
            Current password
          </label>
          <input
            id='password'
            type='password'
            placeholder='••••••••'
            className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100'
            {...register('password')}
          />
          {errors.password && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* New password */}
        <div>
          <label
            htmlFor='newPassword'
            className='mb-1.5 block text-sm font-medium text-gray-700'
          >
            New password
          </label>
          <input
            id='newPassword'
            type='password'
            placeholder='••••••••'
            className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100'
            {...register('newPassword')}
          />
          {errors.newPassword && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm new password */}
        <div>
          <label
            htmlFor='rePassword'
            className='mb-1.5 block text-sm font-medium text-gray-700'
          >
            Confirm new password
          </label>
          <input
            id='rePassword'
            type='password'
            placeholder='••••••••'
            className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100'
            {...register('rePassword')}
          />
          {errors.rePassword && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.rePassword.message}
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={isPending}
          className='flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isPending ? (
            <FaSpinner className='animate-spin' />
          ) : (
            'Change password'
          )}
        </button>
      </form>
    </div>
  );
}
