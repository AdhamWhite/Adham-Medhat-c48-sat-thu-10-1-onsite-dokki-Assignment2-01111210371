import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { CiImageOn } from 'react-icons/ci';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IoIosClose } from 'react-icons/io';
import { FaSpinner } from 'react-icons/fa';
import { useState } from 'react';


export default function EditComment({
  onClose,
  postId,
  commentId,
  commentContent,
  commentImage,
  queryKey,
}: {
  onClose: () => void;
  postId: string;
  commentId: string;
  commentContent: string;
  commentImage?: string;
  queryKey: string[];
}) {



  const [isUploaded, setisUploaded] = useState<string>(commentImage || '');

  const query = useQueryClient();

  function updateComment(data: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
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

  const { register, handleSubmit } = useForm<{
    content: string;
    image: FileList;
  }>({
    defaultValues: {
      content: commentContent,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateComment,
    onSuccess: (res) => {
      toast.success(res.data.message);
      onClose();

      query.invalidateQueries({ queryKey: queryKey });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleComment(values: { content: string; image: FileList }) {
    const formData = new FormData();

    if (values.content) {
      formData.append('content', values.content);
    }
    // Only send the image if a NEW file was selected
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0]);
    }

    mutate(formData);
  }

  return (
    <form
      className='flex flex-col gap-3'
      onSubmit={handleSubmit(handleComment)}
    >
      {/* Textarea */}
      <textarea
        {...register('content')}
        rows={3}
        placeholder='Edit your comment...'
        className='w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100'
      />

      {/* Image preview */}
      {isUploaded && (
        <div className='relative'>
          <img
            src={isUploaded}
            alt='comment image'
            className='max-h-48 w-full rounded-xl object-cover'
          />
          {/* Remove preview button: onClick is on the button itself */}
          <button
            type='button'
            onClick={() => setisUploaded('')}
            className='absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80'
          >
            <IoIosClose className='h-6 w-6' />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className='flex items-center justify-between'>
        {/* Change image: onChange lives inside register's options */}
        <label className='flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-white hover:text-blue-600'>
          <CiImageOn />
          Photo
          <input
            type='file'
            accept='image/*'
            hidden
            {...register('image', { onChange: handleImage })}
          />
        </label>

        <div className='flex items-center gap-2'>
          {/* Cancel */}
          <button
            onClick={onClose}
            type='button'
            className='cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200'
          >
            Cancel
          </button>
          {/* Save */}
          <button
            type='submit'
            disabled={isPending}
            className='flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-5 py-1.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isPending ? <FaSpinner className='animate-spin' /> : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
}
