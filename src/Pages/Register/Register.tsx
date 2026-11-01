import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  registerSchema,
  type registerSchemaType,
} from '../../Schemas/auth.schema';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
  
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<registerSchemaType>({
    defaultValues: {
      name: '',
      email: '',
      dateOfBirth: '',
      password: '',
      rePassword: '',
      gender: 'male',
    },
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const navigate = useNavigate();

  const { register, handleSubmit, formState } = form;

  // console.log(formState);

  function handleRegister(values: registerSchemaType) {
    console.log(values);
    setIsLoading(true)
    axios
      .post('https://route-posts.routemisr.com/users/signup', values)
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          console.log(res.data)
          navigate('/login');
        // react alerts replace with toastify or sweetalert2

        }
      })
      .catch((err) => {
        alert(err.response.data.message);
        console.log(err.response.data)
        // react alerts replace with toastify or sweetalert2
      })
      .finally(()=>{
        setIsLoading(false);      })
  }

  // return (
  //   <>
  //     {/* <h1 className="text-center text-5xl  font-bold">Register Now</h1>

  //     <form
  //       onSubmit={handleSubmit(handleRegister)}
  //       className="max-w-md mx-auto"
  //     >
  //       <div className="relative z-0 w-full mb-5 group my-6">
  //         <input
  //           type="text"
  //           {...register('name')}
  //           id="name"
  //           className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
  //           placeholder=" "
  //           required
  //         />
  //         <label
  //           htmlFor="name"
  //           className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
  //         >
  //           Enter Your Name
  //         </label>
  //       </div>
  //       <div className="relative z-0 w-full mb-5 group my-6">
  //         <input
  //           type="email"
  //           {...register('email')}
  //           id="email"
  //           className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
  //           placeholder=" "
  //           required
  //         />
  //         <label
  //           htmlFor="email"
  //           className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
  //         >
  //           Enter Your Email
  //         </label>
  //       </div>
  //       <div className="relative z-0 w-full mb-5 group my-6">
  //         <input
  //           type="date"
  //           {...register('dateOfBirth')}
  //           id="date"
  //           className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
  //           placeholder=" "
  //           required
  //         />
  //         <label
  //           htmlFor="date"
  //           className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
  //         >
  //           Enter Your Birthday
  //         </label>
  //       </div>
  //       <div className="relative z-0 w-full mb-5 group my-6">
  //         <input
  //           type="password"
  //           {...register('password')}
  //           id="password"
  //           className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
  //           placeholder=" "
  //           required
  //         />
  //         <label
  //           htmlFor="password"
  //           className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
  //         >
  //           Enter Your Password
  //         </label>
  //       </div>
  //       <div className="relative z-0 w-full mb-5 group my-6">
  //         <input
  //           type="password"
  //           {...register('rePassword')}
  //           id="rePassword"
  //           className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
  //           placeholder=" "
  //           required
  //         />
  //         <label
  //           htmlFor="rePassword"
  //           className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
  //         >
  //           Confirm Your Password
  //         </label>
  //       </div>

  //       <div className="flex gap-3 items-center">
  //         <div className="flex items-center mb-4">
  //           <input
  //             id="gender-option-1"
  //             type="radio"
  //             {...register('gender')}
  //             defaultValue="male"
  //             className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
  //             defaultChecked
  //           />
  //           <label
  //             htmlFor="gender-option-1"
  //             className="select-none ms-2 text-sm font-medium text-heading"
  //           >
  //             Male
  //           </label>
  //         </div>
  //         <div className="flex items-center mb-4">
  //           <input
  //             id="gender-option-2"
  //             type="radio"
  //             {...register('gender')}
  //             defaultValue="female"
  //             className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
  //             defaultChecked
  //           />
  //           <label
  //             htmlFor="gender-option-2"
  //             className="select-none ms-2 text-sm font-medium text-heading"
  //           >
  //             Female
  //           </label>
  //         </div>
  //       </div>
  //       <button
  //         type="submit"
  //         className="text-white w-full bg-blue-500 rounded-lg m-auto cursor-pointer box-border border border-transparent hover:bg-blue-600 transition-all focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
  //       >
  //         Submit
  //       </button>
  //     </form> */}

  //   </>
  // );

  return (
    <div className="flex min-h-screen items-center justify-center  p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        {/* Side panel (visible on md screens and up) */}
        <div className="hidden flex-col justify-between bg-linear-to-br from-blue-600 to-indigo-700 p-10 text-white md:flex">
          <h2 className="text-2xl font-bold">Social App</h2>
          <div>
            <h3 className="mb-3 text-3xl font-bold leading-tight">
              Join the community today
            </h3>
            <p className="text-sm text-blue-100">
              Create your account and start sharing with your friends.
            </p>
          </div>
          <p className="text-xs text-blue-200">© 2026 Social App</p>
        </div>

        {/* Form section */}
        <div className="p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="mb-6 mt-1 text-sm text-gray-500">
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                {...register('name')}
              />
            </div>
            {formState.errors.name && formState.touchedFields.name && (
              <p className="font-bold text-red-500">
                {formState.errors.name.message}
              </p>
            )}
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                {...register('email')}
              />
            </div>
            {formState.errors.email && formState.touchedFields.email && (
              <p className="font-bold text-red-500">
                {formState.errors.email.message}
              </p>
            )}

            {/* Birthday */}
            <div>
              <label
                htmlFor="date"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Birthday
              </label>
              <input
                type="date"
                id="date"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                {...register('dateOfBirth')}
              />
            </div>
            {formState.errors.dateOfBirth &&
              formState.touchedFields.dateOfBirth && (
                <p className="font-bold text-red-500">
                  {formState.errors.dateOfBirth.message}
                </p>
              )}
            {/* Passwords side by side on larger screens */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    {...register('password')}
                  />
                </div>
                {formState.errors.password &&
                  formState.touchedFields.password && (
                    <p className="font-bold text-red-500">
                      {formState.errors.password.message}
                    </p>
                  )}
              </div>
              <div className="flex flex-col">
                <div>
                  <label
                    htmlFor="rePassword"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Confirm Your Password
                  </label>
                  <input
                    type="password"
                    id="rePassword"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    {...register('rePassword')}
                  />
                </div>
                {formState.errors.rePassword &&
                  formState.touchedFields.rePassword && (
                    <p className="font-bold text-red-500">
                      {formState.errors.rePassword.message}
                    </p>
                  )}
              </div>
            </div>

            {/* Gender (card-style radios) */}
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Gender
              </span>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="male"
                    className="peer sr-only"
                    {...register('gender')}
                  />
                  <div className="rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600">
                    Male
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="female"
                    className="peer sr-only"
                    {...register('gender')}
                  />
                  <div className="rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600">
                    Female
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
            disabled={isLoading}
              type="submit"
              className="w-full disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98]"
            >
              {isLoading? "Loading..." : "Create account"}
            </button>
          </form>
          <Link to="/login" className="mt-4 block text-center text-sm text-blue-500 font-bold underline">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
