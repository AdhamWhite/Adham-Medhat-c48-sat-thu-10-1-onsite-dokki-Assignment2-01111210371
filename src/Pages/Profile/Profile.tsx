import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { UserType } from "../../Types/ProfileUser.type";
import {
  FaCamera,
  FaPen,
  FaEnvelope,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";
import Post from "../../Components/Post/Post";
import type { PostType } from "../../Types/Post.type";
import PostCreation from "../../Components/PostCreation/PostCreation";

export default function Profile() {
  function getMyProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
  });

  const user: UserType = data?.data.data.user;
  // console.log(user);

  function getMyPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${user._id}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data: myPosts } = useQuery({
    queryFn: getMyPosts,
    queryKey: ["getMyPosts"],
    enabled: !isLoading && !isError && !!data,
  });
  console.log(data?.data.posts);
  return (
    <>
      <div className="mx-auto w-full max-w-3xl pb-10">
        {user && (
          <>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Cover photo */}
              <div className="relative h-44 bg-linear-to-br from-blue-600 to-indigo-700 sm:h-56">
                <img
                  src={user?.cover}
                  alt="cover"
                  className="h-full w-full object-cover"
                />

                {/* Change cover button */}
                <button
                  type="button"
                  className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black/70"
                >
                  <FaCamera />
                  Edit cover
                </button>
              </div>

              {/* Avatar + main info */}
              <div className="px-5 pb-6 sm:px-8">
                <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={user?.photo}
                      alt="profile avatar"
                      className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md sm:h-32 sm:w-32"
                    />
                    <button
                      type="button"
                      className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-xs text-white shadow-md transition hover:bg-blue-700"
                    >
                      <FaCamera />
                    </button>
                  </div>

                  {/* Name + username */}
                  <div className="flex-1 text-center sm:pb-2 sm:text-start">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user?.name}
                    </h1>
                    <p className="text-sm text-gray-500">@{user?.username}</p>
                  </div>

                  {/* Edit profile button */}
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] sm:mb-2"
                  >
                    <FaPen />
                    Edit profile
                  </button>
                </div>

                {/* Details */}
                <ul className="mt-6 flex flex-col gap-3 text-sm text-gray-600">
                  <li className="flex items-center gap-3">
                    <FaEnvelope className="text-gray-400" />
                    {user?.email}
                  </li>
                  <li className="flex items-center gap-3">
                    <FaBirthdayCake className="text-gray-400" />
                    {user?.dateOfBirth}
                  </li>
                  <li className="flex items-center gap-3">
                    <FaVenusMars className="text-gray-400" />
                    {user?.gender}
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex gap-2 border-b border-gray-200 px-2">
              <button
                type="button"
                className="cursor-pointer border-b-2 border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600"
              >
                Posts
              </button>
              <button
                type="button"
                className="cursor-pointer border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 transition hover:text-gray-800"
              >
                Saved
              </button>
            </div>
            <div className="mt-4">
              <PostCreation refreshKeys={["getMyPosts"]} />
            </div>
          </>
        )}

        {/* Posts grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {myPosts?.data.data.posts.map((post: PostType) => (
            <Post
              key={post._id}
              post={post}
              redirectAfterDelete={false}
              queryKeysToRefresh={[["getMyPosts"], ["getAllPosts"]]}
            />
          ))}
        </div>
      </div>
    </>
  );
}
