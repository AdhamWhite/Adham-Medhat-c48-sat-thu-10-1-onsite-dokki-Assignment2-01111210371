import axios from 'axios';
import Loading from '../../Components/Loading/Loading';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Post from '../../Components/Post/Post';


// import UpdatePost from '../../Components/UpdateComment/UpdatePost';

export default function PostDetails() {
  const { id } = useParams();

  function getPost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getSinglePost', id],
    queryFn: getPost,
    // enabled: false,
  });

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }
  return (
    <>
      <Post post={data?.data.data.post} isPostDetails={true} />;
     
        {/* <UpdatePost /> */}
     
    </>
  );
}
