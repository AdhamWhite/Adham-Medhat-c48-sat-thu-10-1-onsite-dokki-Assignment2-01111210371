import { Link } from 'react-router-dom';
import type { CommentType } from '../../Types/Comment.type';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useContext, useState } from 'react';
import EditComment from '../EditComment/EditComment';
import { AuthContext } from '../../context/AuthContext';
import { FaPen, FaSpinner, FaTrashAlt } from 'react-icons/fa';
import { HiOutlineDotsVertical } from 'react-icons/hi';

export default function Comment({
  comment,
  queryKey,
}: {
  comment: CommentType;
  queryKey: string[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { userId } = useContext(AuthContext);

  const { _id, post } = comment;
  const query = useQueryClient();

  function handleDeleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${post}/comments/${_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleDeleteComment,
    onSuccess: (res) => {
      toast.success(res.data.message);
      setIsMenuOpen(false);
      query.invalidateQueries({ queryKey: queryKey });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // Only the comment owner can see the dots menu
  const isOwner = comment.commentCreator._id === userId;

  return (
    <div className='flex flex-col gap-3 bg-gray-100 p-5 m-3 rounded-md'>
      {/* Header: user info + dots menu */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <Link to={'/profile'}>
            <img
              src={comment?.commentCreator.photo}
              alt='user avatar'
              className='h-11 w-11 rounded-full object-cover ring-2 ring-blue-100'
            />
          </Link>
          <div className='flex flex-col ml-3'>
            <h3 className='text-sm font-semibold text-gray-900'>
              {comment?.commentCreator.name}
            </h3>
            <p className='text-xs text-gray-500'>{comment?.createdAt}</p>
          </div>
        </div>

        {isOwner && !isEditOpen && (
          <div className='relative'>
            <button
              type='button'
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className='cursor-pointer rounded-full p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600'
            >
              <HiOutlineDotsVertical className='text-xl' />
            </button>

            {isMenuOpen && (
              <div className='absolute inset-e-0 top-10 z-20 w-32 rounded-lg border border-slate-200 bg-white p-2 shadow-xl'>
                <ul className='flex flex-col gap-2'>
                  <li>
                    <button
                      type='button'
                      onClick={() => {
                        setIsEditOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-slate-100 p-2 text-sm hover:bg-slate-200'
                    >
                      Edit
                      <FaPen />
                    </button>
                  </li>
                  <li>
                    <button
                      type='button'
                      disabled={isPending}
                      onClick={() => mutate()}
                      className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-slate-100 p-2 text-sm hover:bg-slate-200 disabled:cursor-not-allowed'
                    >
                      {isPending ? (
                        <FaSpinner className='animate-spin' />
                      ) : (
                        <>
                          Delete <FaTrashAlt />
                        </>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content: either the comment itself or the edit form */}
      {isEditOpen ? (
        <EditComment
          onClose={() => setIsEditOpen(false)}
          postId={comment.post}
          commentId={comment._id}
          commentContent={comment.content}
          commentImage={comment.image}
          queryKey={queryKey}
        />
      ) : (
        <div>
          <p>{comment?.content}</p>
          {comment.image && (
            <img
              src={comment.image}
              alt='comment image'
              className='mt-2 w-full rounded-md'
            />
          )}
        </div>
      )}
    </div>
  );
}