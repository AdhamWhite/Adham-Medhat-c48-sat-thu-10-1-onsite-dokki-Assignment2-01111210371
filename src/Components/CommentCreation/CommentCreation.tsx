import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CiImageOn } from 'react-icons/ci';
import { FaArrowRight } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';

export default function CommentCreation({
  postId,
  queryKey,
}: {
  postId: string;
  queryKey: string[];
}) {
  const form = useForm({
    defaultValues: {
      content: '',
      image: '',
    },
  });

  const query = useQueryClient();

  const { register, handleSubmit, reset } = form;

  const formData = new FormData();
  function createComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: (res) => {
      toast.success(res.data.message);
      reset();
      query.invalidateQueries({ queryKey: queryKey });
    },
    onError: () => {
      // toast.error(err.data.message);
    },
    onSettled: () => {},
  });

  function handleComment(values: { content: string; image: string }) {
    if (!values.content && !values.image) return;

    if (values.content) {
      formData.append('content', values.content);
    }

    if (values.image) {
      formData.append('image', values.image[0]);
    }
    console.log(values);
    mutate();
  }

  return (
    <>
      {/* Comment creation box */}
      <div className='flex items-start gap-3 border-t border-gray-100 bg-white px-5 py-4'>
        <div className='flex-1'>
          <form onSubmit={handleSubmit(handleComment)}>
            {/* Input wrapper */}
            <div className='flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100'>
              <input
                {...register('content')}
                type='text'
                placeholder='Write a comment...'
                className='max-h-32 w-full resize-none bg-transparent py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none'
              />
              {/* Send button */}
              <button
                disabled={isPending}
                type='submit'
                className='mb-0.5 disabled:cursor-not-allowed  flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-95'
              >
                {isPending ? (
                  <FaSpinner className='animate-spin' />
                ) : (
                  <FaArrowRight />
                )}
              </button>
            </div>
            {/* Extra actions */}
            <div className='mt-2 flex items-center gap-1 px-1'>
              {/* Add image */}
              <label className='block cursor-pointer rounded-full  p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600'>
                <CiImageOn />
                <input hidden type='file' {...register('image')} />
              </label>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
