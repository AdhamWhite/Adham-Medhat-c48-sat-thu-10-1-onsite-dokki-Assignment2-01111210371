import axios from 'axios';
import Post from '../../Components/Post/Post';
import { type PostType } from './../../Types/Post.type';
import Loading from '../../Components/Loading/Loading';
import { useQuery } from '@tanstack/react-query';
import PostCreation from '../../Components/PostCreation/PostCreation';
import { Helmet } from 'react-helmet';

export default function Home() {
  // const [allPosts, setallPosts] = useState([]);
  // const [isLoading, setisLoading] = useState(true);
  // const [isError, setisError] = useState(false);

  function getAllPosts() {
    return axios.get('https://route-posts.routemisr.com/posts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
    // .then((res) => res.data.data.posts)
    // .catch((err) => {
    //   throw new Error(err.response.data.message);
    // })
    // .finally(() => setIsLoading(false));
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getAllPosts'],
    queryFn: getAllPosts,
    // enabled: false,
  });

  // useEffect(()=>{
  //   getAllPosts();
  // },[])

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <div className='my-8'>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <div>
          <PostCreation />
        </div>

        {data?.data.data.posts.map((post: PostType) => (
          <Post key={post.id} post={post} isPostDetails={false} />
        ))}
      </div>
    </>
  );
}
