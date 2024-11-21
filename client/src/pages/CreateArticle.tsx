import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { ContentEditor, Loader } from "../components";
import { axios, ENDPOINTS } from "../api";

const CreateArticle = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  console.log(title, description, content);

  const handleCreateArticle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        ENDPOINTS.ARTICLES.CREATE,
        { title, description, content },
        { withCredentials: true }
      );

      console.log(response.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
      setTitle("");
      setDescription("");
      setContent("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16 sm:py-20 mt-16 sm:mt-0">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-4 sm:p-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4 sm:mb-6">
          Create Article
        </h2>

        <form onSubmit={handleCreateArticle} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              placeholder="Enter a brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Content
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <ContentEditor content={content} setContent={setContent} />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1 sm:px-6 sm:py-2 text-xs sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
            >
              {loading ? <Loader /> : "Publish Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
