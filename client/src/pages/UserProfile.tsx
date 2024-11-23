import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LuCalendar, LuPenSquare, LuTrash2 } from "react-icons/lu";
import dayjs from "dayjs";
import User from "../types/user";
import { axios, ENDPOINTS } from "../api";
import { Loader } from "../components";
import { defaultUserAvatar } from "../assets/images";
import useAuth from "../hooks/useAuth";
import Article from "../types/article";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // get id from url params
  const { id } = useParams();
  // get user from context
  const { user } = useAuth();

  // fetch user
  useEffect(() => {
    // fetch user
    const fetchUser = async (id: any) => {
      setLoading(true);

      try {
        const response = await axios.get(ENDPOINTS.USERS.PROFILE(id), {
          withCredentials: true,
        });

        console.log(response.data);

        setUserInfo(response.data.user);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    // fetch user articles
    const fetchUserArticles = async () => {
      setLoading(true);

      try {
        const response = await axios.get(ENDPOINTS.USERS.ARTICLES, {
          withCredentials: true,
        });

        console.log(response.data);

        setUserArticles(response.data.articles);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser(id);
    fetchUserArticles();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-dvw h-full bg-gray-100">
      <div className="max-w-4xl mx-auto p-4 py-20">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-6">
                <div className="h-24 w-24 rounded-full border-2 border-gray-100 shadow overflow-hidden">
                  <img
                    src={
                      userInfo?.profileImg !== ""
                        ? `http://localhost:8000/${userInfo?.profileImg}`
                        : defaultUserAvatar
                    }
                    alt={`${userInfo?.name}'s avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      let target = e.target as HTMLImageElement;
                      target.src = defaultUserAvatar;
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{userInfo?.name}</h1>
                  <p className="text-gray-600">@{userInfo?.username}</p>
                  <div className="flex items-center gap-2 mt-3 text-gray-600 text-sm">
                    <LuCalendar className="stroke-2" />
                    <span>
                      Joined {dayjs(userInfo?.createdAt).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>
              </div>

              {/* show action buttons if user is authorized */}
              {user?._id === userInfo?._id && (
                <div className="flex gap-3">
                  <Link
                    to="/user/update"
                    className="text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    title="Edit Profile"
                  >
                    <LuPenSquare className="stroke-2" />
                  </Link>
                  <button
                    className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                    title="Delete Profile"
                  >
                    <LuTrash2 className="stroke-2" />
                  </button>
                </div>
              )}
            </div>

            {/* Articles Section */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Articles</h2>
                  <span className="text-gray-500">({userArticles.length})</span>
                </div>
              </div>

              {/* Articles List */}
              {userArticles.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No articles yet
                </p>
              ) : (
                <div className="space-y-4">
                  {userArticles.map((article) => (
                    <div
                      key={article._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {dayjs(article.createdAt).format("DD MMM YYYY")}
                          </p>
                        </div>
                      </div>

                      {/* show action buttons if user is authorized */}
                      {user?._id === userInfo?._id && (
                        <div className="flex gap-2">
                          <button
                            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            title="Edit Article"
                          >
                            <LuPenSquare />
                          </button>
                          <button
                            className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                            title="Delete Article"
                          >
                            <LuTrash2 />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      //{" "}
    </div>
  );
};

export default UserProfile;
