import * as zod from 'zod';

export const registerSchema = zod
  .object({
    name: zod
      .string()
      .nonempty('Name Is Required')
      .min(3, 'Name Must Be At Least 3 Characters')
      .max(20, "Max Length Can't Be More Than 12 Characters"),
    email: zod
      .email()
      .nonempty('Email Is Required')
      .regex(
        /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm,
        'Email Is Not Valid',
      ),

    dateOfBirth: zod
      .string()
      .nonempty('Date  Is Required')
      .refine((date) => {
        const userDate = new Date(date).getFullYear(); // user year
        const nowDate = new Date().getFullYear(); // current year
        return nowDate - userDate >= 18 ? true : false; // check if user is at least 18 years old
      }, 'You Must Be At Least 18 Years Old'),

    gender: zod.enum(['male', 'female']),

    password: zod
      .string()
      .nonempty('Password Is Required')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password Must Contain At Least 8 Characters, One Uppercase, One Lowercase, One Number And One Special Case Character',
      ),
    rePassword: zod.string().nonempty('Password Confirmation Is Required'),
  })
  .refine(
    (obj) => {
      if (obj.password === obj.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    { path: ['rePassword'], message: 'Password Does Not Match' },
  );

export type registerSchemaType = zod.infer<typeof registerSchema>;


// //////////////////////////////////////////

export const loginSchema = zod
  .object({
    email: zod
      .email()
      .nonempty('Email Is Required')
      .regex(
        /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm,
        'Email Is Not Valid',
      ),
    password: zod
      .string()
      .nonempty('Password Is Required')
      .min(6, 'Password Must Be At Least 6 Characters')
      .max(100, "Max Length Can't Be More Than 100 Characters"),
 


    }
  );

  export type loginSchemaType = zod.infer<typeof loginSchema>;




  ///////////////////////


  export const changePasswordSchema = zod
  .object({
    password: zod.string().min(1, 'Current password is required'),
    newPassword: zod.string().min(8, 'Password must be at least 8 characters'),
    rePassword: zod.string().min(1, 'Please confirm the new password'),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: "Passwords don't match",
    path: ['rePassword'],
  });

export type changePasswordSchemaType = zod.infer<typeof changePasswordSchema>;
