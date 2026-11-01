import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CiImageOn } from 'react-icons/ci';
import { FaSpinner } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

type PostFormValues = {
  body: string;
  image: FileList | null;
};

type PostCreationProps = {
  refreshKeys?: string[];
};

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'followers', label: 'Followers' },
  { value: 'only_me', label: 'Only me' },
];

export default function PostCreation({
  refreshKeys = ['getAllPosts'],
}: PostCreationProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue } = useForm<PostFormValues>({
    defaultValues: { body: '', image: null },
  });

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  function clearImage() {
    setPreviewUrl('');
    setValue('image', null);
  }

  function sendPost(payload: FormData) {
    return axios.post('https://route-posts.routemisr.com/posts', payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
    });
  }

  const { isPending: isPosting, mutate: publishPost } = useMutation({
    mutationFn: sendPost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      reset();
      setPreviewUrl('');
      queryClient.invalidateQueries({ queryKey: refreshKeys });
    },
  });

  function onSubmitPost({ body, image }: PostFormValues) {
    const hasImage = !!image && image.length > 0;
    if (!body && !hasImage) return;

    const payload = new FormData();
    if (body) payload.append('body', body);
    if (hasImage) payload.append('image', image[0]);

    publishPost(payload);
  }

  return (
    <div className='mx-auto my-5 w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
      <form onSubmit={handleSubmit(onSubmitPost)}>
        {/* Visibility selector */}
        <div className='flex items-center gap-3 px-5 pt-5'>
          <select className='mt-0.5 cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100'>
            {VISIBILITY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Text area */}
        <div className='px-5 pt-4'>
          <textarea
            {...register('body')}
            rows={4}
            placeholder="What's on your mind?"
            className='w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100'
          />
        </div>

        {/* Image preview */}
        {previewUrl && (
          <div className='relative px-5 pt-3'>
            <img
              src={previewUrl}
              alt='selected image preview'
              className='max-h-72 w-full rounded-xl object-cover'
            />
            <button
              type='button'
              onClick={clearImage}
              className='absolute right-8 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80'
            >
              <TiDelete className='h-6 w-6' />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className='mt-4 flex items-center justify-between border-t border-gray-100 px-5 py-3'>
          <label className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-blue-600'>
            <CiImageOn />
            Photo
            <input
              type='file'
              accept='image/*'
              hidden
              {...register('image', { onChange: onImageChange })}
            />
          </label>

          {isPosting ? (
            <FaSpinner className='animate-spin' />
          ) : (
            <button
              type='submit'
              className='cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98]'
            >
              Add Post
            </button>
          )}
        </div>
      </form>
    </div>
  );
}