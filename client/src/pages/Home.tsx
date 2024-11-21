import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { LuSearch, LuX } from "react-icons/lu";
import { axios, ENDPOINTS } from "../api";
import { ArticleCard, Loader } from "../components";

const Home = () => {
  const [articles, setArticles] = useState<[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // fetch articles
  const fetchArticles = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(ENDPOINTS.ARTICLES.FETCH_ALL, {
        withCredentials: true,
        params: {
          searchQuery: debouncedSearchQuery,
          page: currentPage,
        },
      });

      console.log(response.data);

      setArticles(response.data.articles);
      setTotalPages(Math.ceil(response.data.totalPages));
    } catch (err) {
      console.error(err);
      toast.error("Error fetching articles");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery]);

  // fetch articles on render
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // debounce search query
  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginationButtons = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`w-10 h-10 rounded-full 
        flex items-center justify-center 
        transition-all duration-300 
        ${
          currentPage === page
            ? "bg-blue-600 text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
        }`}
      >
        {page}
      </button>
    ));
  }, [totalPages, currentPage]);

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          transition-all duration-300"
            />
            <LuSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 
            text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LuX size={20} />
              </button>
            )}
          </div>
          {debouncedSearchQuery && (
            <p className="text-sm text-gray-600 mt-2 ml-4">
              Showing results for: "{debouncedSearchQuery}"
            </p>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10 text-center">
          {debouncedSearchQuery ? "Search Results" : "Latest Articles"}
        </h1>

        {loading ? (
          <Loader />
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-600 p-6 bg-gray-100 rounded-lg">
            No articles found. Try a different search term.
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center space-x-2">
                {paginationButtons}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
