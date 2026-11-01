import { HiOutlineDotsVertical } from 'react-icons/hi';
import { type PostType } from './../../Types/Post.type';
import { AiOutlineLike } from 'react-icons/ai';
import { FaPen, FaRegCommentAlt, FaSpinner, FaTrashAlt } from 'react-icons/fa';
import { FaShare } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Comment from '../Comment/Comment';
import type { CommentType } from '../../Types/Comment.type';
import CommentCreation from '../CommentCreation/CommentCreation';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import UpdatePost from '../UpdateComment/UpdatePost';

// import PostDetails from '../../Pages/PostDetails/PostDetails';

export default function Post({
  post,
  isPostDetails = false,
  queryKeysToRefresh = [['getAllPosts']], 
  redirectAfterDelete = true,
}: {
  post: PostType;
  isPostDetails?: boolean;
  queryKeysToRefresh?: string[][]; 
  redirectAfterDelete?: boolean;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const { image, createdAt, body, user, topComment, _id } = post;
  const { photo, name, _id: userId } = user;

  const { userId: loginUserId } = useContext(AuthContext);

  const navigate = useNavigate();

  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      },
    );
  }

  const query = useQueryClient();
  const { data } = useQuery({
    queryFn: getPostComments,
    queryKey: ['getPostComments'],
    enabled: isPostDetails,
  });

  function handleDeletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
    });
  }

  const {
    data: deleteMutationData,
    isPending,
    mutate,
  } = useMutation({
    mutationFn: handleDeletePost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryKeysToRefresh.forEach((key) =>
    query.invalidateQueries({ queryKey: key }),
  );
      if (redirectAfterDelete) navigate('/');
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {},
  });
  return (
    <div className='mx-auto w-full max-w-xl my-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
      {/* Header: avatar, name, time, menu */}
      <div className='flex items-center justify-between px-5 pt-5'>
        {/* <User photo={photo} createdAt={createdAt} name={name} /> */}
        <div className='flex items-center gap-3'>
          <Link to={'/profile'}>
            <img
              src={photo}
              alt='user avatar'
              className='h-11 w-11 rounded-full object-cover ring-2 ring-blue-100'
            />
          </Link>
          <Link to={'/profile'}>
            <h3 className='text-sm font-semibold text-gray-900'>{name}</h3>
            <p className='text-xs text-gray-500'>{createdAt}</p>
          </Link>
        </div>
        {/* Edit Button */}
        <div className='relative'>
          {loginUserId === userId && (
            <HiOutlineDotsVertical
              onClick={() => setisOpen(!isOpen)}
              className='font-bold text-2xl cursor-pointer'
            />
          )}

          {isOpen && (
            <div className='bg-white rounded-lg p-2 absolute top-10 end-[-80%] shadow-2xl border-slate-200 border-2 transition'>
              <ul className='flex flex-col gap-3'>
                <li>
                  <button
                    onClick={() => setIsEditOpen((prev) => !prev)}
                    className='w-full flex items-center gap-2 bg-slate-100 p-2 cursor-pointer'
                  >
                    Edit
                    <FaPen />
                  </button>
                  {isEditOpen && (
                    <UpdatePost
                      onClose={() => setIsEditOpen(false)}
                      postId={_id}
                      postValue={body}
                      postImage={image}
                    />
                  )}
                </li>
                <li>
                  <button
                    disabled={isPending}
                    onClick={() => mutate()}
                    className='w-full flex items-center justify-center gap-2 bg-slate-100 p-2 cursor-pointer disabled:cursor-not-allowed'
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
      </div>
      <div>
        {/* Body text */}
        <p className='px-5 pt-4 text-sm leading-relaxed text-gray-700'>
          {body}
        </p>
        {/* Post image */}

        {image && (
          <img
            src={image}
            alt='post image'
            className='mt-4 max-h-96 w-full object-cover'
          />
        )}
      </div>
      {/* Counters */}
      <div className='flex items-center justify-between px-5 py-3 text-xs text-gray-500'>
        <span>{post.likesCount}</span>
        <span>{post.commentsCount}</span>
      </div>
      {/* Action buttons */}
      <div className='grid grid-cols-3 gap-1 border-t border-gray-100 px-3 py-1'>
        {/* Like */}
        <div className='cursor-pointer flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-blue-600'>
          <AiOutlineLike />
          Like
        </div>
        {/* Comment */}
        <Link to={`/postDetails/${_id}`}>
          <div className='cursor-pointer flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-blue-600'>
            Comment
            <FaRegCommentAlt />
          </div>
        </Link>

        {/* Share */}
        <div className='cursor-pointer flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-blue-600'>
          <FaShare />
          Share
        </div>
      </div>
      {/* Add comment */}
      <CommentCreation
        postId={_id}
        queryKey={isPostDetails ? ['getPostComments'] : ['getAllPosts']}
      />

      {/* Top Comment */}

      {topComment && <Comment comment={topComment} />}

      {/* All Comments */}
      {isPostDetails &&
        data?.data.data.comments &&
        data?.data.data.comments.map((comment: CommentType) => (
          <Comment key={comment._id} comment={comment} queryKey={isPostDetails ? ['getPostComments'] : ['getAllPosts']} />
        ))}
    </div>
  );
}
