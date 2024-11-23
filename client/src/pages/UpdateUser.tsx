import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { LuUpload, LuUser2 } from "react-icons/lu";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { axios, ENDPOINTS } from "../api";
import { Loader } from "../components";

const UpdateUser = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [profileImgPreview, setProfileImgPreview] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const { user, setUser } = useAuth();

  const profileImgRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // fetch user
    const fetchUser = async (id: any) => {
      setLoading(true);

      try {
        const response = await axios.get(ENDPOINTS.USERS.PROFILE(id), {
          withCredentials: true,
        });

        console.log(response.data);

        setUsername(response.data.user.username);
        setName(response.data.user.name);
        setProfileImg(response.data.user.profileImg);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser(user?._id);
  }, []);

  const triggerProfileImgInput = () => {
    profileImgRef.current?.click();
  };

  const handleProfileImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setProfileImg(file);
    }

    const url = URL.createObjectURL(file as Blob);
    setProfileImgPreview(url);
  };

  const handleUpdateUser = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // append user info as form data when working with files
      formData.append("avatar", profileImg as File);
      formData.append("username", username);
      formData.append("name", name);

      const response = await axios.put(ENDPOINTS.USERS.UPDATE, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      // update user in context
      setUser(response.data.user);
      // update user in localstorage
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(response.data.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  //   if (loading) {
  //     return <Loader />;
  //   }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Update Profile</h1>
        </div>

        <form onSubmit={handleUpdateUser} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div
              onClick={triggerProfileImgInput}
              className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer group"
            >
              {profileImg ? (
                <img
                  src={
                    profileImgPreview
                      ? profileImgPreview
                      : `http://localhost:8000/${profileImg}`
                  }
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <LuUser2 size={64} />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
            </div>
            <input
              ref={profileImgRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImgChange}
              className="hidden"
              id="avatar"
            />
            <button
              type="button"
              onClick={triggerProfileImgInput}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LuUpload /> Upload Avatar
            </button>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? <Loader /> : "Update profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
