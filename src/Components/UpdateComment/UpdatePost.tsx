import axios from 'axios';
import { useState } from 'react';

import { CiImageOn } from 'react-icons/ci';

import { TiDelete } from 'react-icons/ti';

import { IoIosClose } from 'react-icons/io';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

export default function UpdatePost({
  onClose,
  postId,
  postValue,
  postImage,
}: {
  onClose: () => void;
  postId: string;
  postValue: string;
  postImage?: string;
}) {
  const [isUploaded, setisUploaded] = useState<string>(postImage || '');

  const query = useQueryClient();

  function updatePost(data: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      },
    );
  }
  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setisUploaded(URL.createObjectURL(file));
  }

  const form = useForm({
    defaultValues: {
      body: postValue,
      image: postImage,
    },
  });
  const { register, handleSubmit } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: updatePost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      onClose();
      query.invalidateQueries({ queryKey: ['getSinglePost', postId] });
      console.log(res);
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {},
  });

  function handlePost(values: { body: string; image: string }) {
    const formData = new FormData();
    if (values.body) {
      formData.append('body', values.body);
    }
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0]);
    }

    console.log(values);
    mutate(formData);
  }

  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
        <div className='bg-white '>
          <form onSubmit={handleSubmit(handlePost)} className='w-full'>
            <div className='max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl'>
              {/* Header */}
              <div className='sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4'>
                <h2 className='text-lg font-bold text-gray-900'>Edit post</h2>
                {/* Close button */}
                <button
                  type='button'
                  className='flex h-10 w-10 font-bold cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600'
                >
                  <IoIosClose onClick={onClose} />
                </button>
              </div>
            </div>

            {/* Body textarea */}
            <div className='px-5 pt-4'>
              <textarea
                rows={4}
                placeholder="What's on your mind?"
                className='w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100'
                {...register('body')}
              />
            </div>
            {/* Image preview (show only when an image is selected) */}

            {isUploaded && (
              <div className='relative px-5 pt-3'>
                <img
                  src={isUploaded}
                  alt='selected image preview'
                  className='max-h-72 w-full rounded-xl object-cover'
                />

                <button
                  type='button'
                  className=' absolute right-8 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80'
                >
                  <TiDelete
                    className='w-6 h-6'
                    onClick={() => setisUploaded('')}
                  />
                </button>
              </div>
            )}

            {/* Footer: actions + submit */}
            <div className='mt-4 flex items-center justify-between border-t border-gray-100 px-5 py-3'>
              <div className='flex items-center gap-1'>
                {/* Add image */}
                <label className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-blue-600'>
                  <CiImageOn />
                  Photo
                  <input
                    {...register('image', { onChange: handleImage })}
                    type='file'
                    accept='image/*'
                    hidden
                  />
                </label>
              </div>
              {/* Submit */}
              {isPending ? (
                <FaSpinner className='animate-spin' />
              ) : (
                <button
                  type='submit'
                  className='cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
                >
                  Update Post
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
