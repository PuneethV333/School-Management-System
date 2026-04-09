/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Calendar,
  Tag,
  ChevronRight,
  Search,
  Filter,
  X,
  Sparkles,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { useFetchMe } from "../../../hooks/useAuth";
import { useFetchAnnouncementData } from "../../../hooks/useAnnouncementData";
import {
  formatDate,
  getCategoryColor,
  getCategoryIcon,
  truncateText,
  type category,
} from "../../../utils/announcementHelpers";

export const Page = () => {
  const { data: userData } = useFetchMe();
  const { data: announcements, isLoading } = useFetchAnnouncementData(userData);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<category | "All">(
    "General",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const isExpired = (expireAt: string) => {
    return expireAt && new Date(expireAt) < new Date();
  };

  const filteredAnnouncements = useMemo(() => {
    if (!announcements) return [];

    const filtered = announcements.filter((announcement:any) => {
      const matchesSearch =
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        announcement.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    filtered.sort((a:any, b:any) => {
      if (sortBy === "newest") {
        return new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.publishAt).getTime() - new Date(b.publishAt).getTime();
      } else if (sortBy === "expiring") {
        if (!a.expireAt) return 1;
        if (!b.expireAt) return -1;
        return new Date(a.expireAt).getTime() - new Date(b.expireAt).getTime();
      }
      return 0;
    });

    return filtered;
  }, [announcements, searchQuery, selectedCategory, sortBy]);

  const stats = useMemo(() => {
    if (!announcements)
      return { total: 0, active: 0, expired: 0, categories: {} };

    const active = announcements.filter(
      (a: any) => a.isActive && !isExpired(a.expireAt),
    ).length;
    const expired = announcements.filter((a: any) => isExpired(a.expireAt)).length;

    const categories = announcements.reduce((acc: any, a: any) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {});

    return {
      total: announcements.length,
      active,
      expired,
      categories,
    };
  }, [announcements]);

  const categories: Array<category | "All"> = [
    "All",
    "General",
    "Exam",
    "Holiday",
    "Event",
    "Fee",
    "Emergency",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
              <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Announcements
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Stay updated with latest news and events
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400">Total</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Active</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">
                {stats.active}
              </p>
            </div>

            <div className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-slate-400">Expired</span>
              </div>
              <p className="text-2xl font-bold text-orange-400">
                {stats.expired}
              </p>
            </div>

            <div className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">Categories</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">
                {Object.keys(stats.categories).length}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-4 sm:p-6">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 transition-all mb-4 sm:mb-0"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {(sortBy !== "newest" || selectedCategory !== "General") && (
                <span className="ml-1 px-2 py-0.5 bg-cyan-500 rounded-full text-xs text-white">
                  Active
                </span>
              )}
            </button>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedCategory === cat
                            ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                            : "bg-slate-700/30 text-slate-400 hover:bg-slate-700/50"
                        }`}
                      >
                        {cat}
                        {cat !== "All" && stats.categories[cat] && (
                          <span className="ml-1.5 text-xs opacity-75">
                            ({stats.categories[cat]})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sort By
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSortBy("newest")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        sortBy === "newest"
                          ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                          : "bg-slate-700/30 text-slate-400 hover:bg-slate-700/50"
                      }`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => setSortBy("oldest")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        sortBy === "oldest"
                          ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                          : "bg-slate-700/30 text-slate-400 hover:bg-slate-700/50"
                      }`}
                    >
                      Oldest First
                    </button>
                    <button
                      onClick={() => setSortBy("expiring")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        sortBy === "expiring"
                          ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                          : "bg-slate-700/30 text-slate-400 hover:bg-slate-700/50"
                      }`}
                    >
                      Expiring Soon
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 text-sm text-slate-400">
          Showing {filteredAnnouncements.length} of {announcements?.length || 0}{" "}
          announcements
        </div>

        {filteredAnnouncements.length === 0 ? (
          <div className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-slate-800/60 rounded-xl">
                <AlertCircle className="w-12 h-12 text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">
                  No announcements found
                </h3>
                <p className="text-slate-400">
                  Try adjusting your search or filters
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAnnouncements.map((announcement: any) => {
              const expired = isExpired(announcement.expireAt);

              return (
                <Link
                  key={announcement._id}
                  to={`/announcements/${announcement._id}`}
                  className="group"
                >
                  <div className="relative bg-linear-to-brrom-slate-800/60 via-slate-900/60 to-slate-950/50 backdrop-blur-sm border border-slate-700/30 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-slate-600/50 transition-all duration-300 h-full flex flex-col">
                    <div
                      className={`h-1 bg-linear-to-r ${getCategoryColor(
                        announcement.category,
                      )}`}
                    ></div>

                    <div className="absolute inset-0 bg-linear-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none"></div>

                    <div className="relative p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-2xl shrink-0">
                            {getCategoryIcon(announcement.category)}
                          </span>
                          <div
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${getCategoryColor(
                              announcement.category,
                            )} text-white shadow-sm shrink-0`}
                          >
                            {announcement.category}
                          </div>
                        </div>

                        {!announcement.isActive && (
                          <span className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs font-medium text-red-300 shrink-0">
                            Inactive
                          </span>
                        )}

                        {expired && announcement.isActive && (
                          <span className="px-2 py-1 bg-orange-500/20 border border-orange-500/50 rounded text-xs font-medium text-orange-300 shrink-0">
                            Expired
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
                        {announcement.title}
                      </h3>

                      <p className="text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed flex-1">
                        {truncateText(announcement.content, 120)}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            Published: {formatDate(announcement.publishAt)}
                          </span>
                        </div>

                        {announcement.expireAt && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              Expires: {formatDate(announcement.expireAt)}
                            </span>
                          </div>
                        )}

                        {announcement.academicYear && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Tag className="w-3.5 h-3.5" />
                            <span>{announcement.academicYear}</span>
                          </div>
                        )}

                        {announcement.classes &&
                          announcement.classes.length > 0 && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400">Classes:</span>
                              <span className="text-cyan-300 font-medium">
                                {announcement.classes.slice(0, 3).join(", ")}
                                {announcement.classes.length > 3 &&
                                  ` +${announcement.classes.length - 3} more`}
                              </span>
                            </div>
                          )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-700/30 mt-auto">
                        <span className="text-xs text-slate-500">
                          {announcement.attachments &&
                            announcement.attachments.length > 0 && (
                              <span className="flex items-center gap-1">
                                📎 {announcement.attachments.length} attachment
                                {announcement.attachments.length > 1 ? "s" : ""}
                              </span>
                            )}
                        </span>
                        <div className="flex items-center gap-1 text-cyan-400 font-medium text-sm group-hover:gap-1.5 transition-all duration-300">
                          Read More
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-linear-to-tl from-cyan-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};