/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Tag,
  BookOpen,
  FileText,
  Download,
  AlertCircle,
} from "lucide-react";
import { useFetchMe } from "../../../hooks/useAuth";
import { useFetchAnnouncementData } from "../../../hooks/useAnnouncementData";
import Spinner from "../../../components/Spinner";
import {
  formatDate,
  getCategoryColor,
} from "../../../utils/announcementHelpers";

export const AnnouncementsDetails = () => {
  const { id } = useParams();

  const { data: userData, isPending: loading } = useFetchMe();
  const { data: announcements, isPending: loadingAnnouncement } =
    useFetchAnnouncementData(userData);

  if (loadingAnnouncement || loading) {
    return <Spinner />;
  }

  const data = announcements?.find((x: any) => x._id === id) || null;

  if (!data) {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading announcement...</p>
        </div>
      </div>
    );
  }

  const isExpired = data.expireAt && new Date(data.expireAt) < new Date();

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-6 sm:py-8 lg:py-10 overflow-x-hidden">
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div
        className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Announcement Details
          </h1>
        </div>

        <div
          className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-lg rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          {!data.isActive && (
            <div className="bg-red-500/10 border-l-4 border-red-500 px-6 py-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300 font-medium">
                This announcement is currently inactive
              </p>
            </div>
          )}

          {isExpired && (
            <div className="bg-orange-500/10 border-l-4 border-orange-500 px-6 py-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <p className="text-orange-300 font-medium">
                This announcement has expired
              </p>
            </div>
          )}

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 wrap-break-word">
                  {data.title}
                </h2>
              </div>
              <div
                className={`px-4 py-2 rounded-lg bg-linear-to-r ${getCategoryColor(data.category)} border flex items-center gap-2 shrink-0`}
              >
                <Tag className="w-4 h-4" />
                <span className="font-semibold">{data.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <div className="flex items-center gap-3 text-slate-300">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Published</p>
                    <p className="text-sm font-medium">
                      {formatDate(data.publishAt)}
                    </p>
                  </div>
                </div>
              </div>

              {data.expireAt && (
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Expires</p>
                      <p className="text-sm font-medium">
                        {formatDate(data.expireAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <div className="flex items-center gap-3 text-slate-300">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Academic Year</p>
                    <p className="text-sm font-medium">{data.academicYear}</p>
                  </div>
                </div>
              </div>
            </div>

            {data.classes && data.classes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  Target Classes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.classes.map((cls: number, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-linear-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-lg text-cyan-300 font-medium"
                    >
                      Class {cls}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Content
              </h3>
              <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/30">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap wrap-break-word">
                  {data.content}
                </p>
              </div>
            </div>

            {data.attachments && data.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-400" />
                  Attachments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.attachments.map((attachment: any, index: number) => (
                    <a
                      key={index}
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-linear-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-green-500/50 transition-all duration-300 flex items-center gap-3 group"
                    >
                      <div className="bg-green-500/20 rounded-lg p-3 group-hover:bg-green-500/30 transition-colors">
                        <FileText className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 font-medium truncate group-hover:text-green-300 transition-colors">
                          {attachment.fileName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Click to download
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-slate-500 group-hover:text-green-400 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-800/30 px-6 sm:px-8 lg:px-10 py-4 border-t border-slate-700/50">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span>Created: {formatDate(data.createdAt)}</span>
              {data.updatedAt && data.updatedAt !== data.createdAt && (
                <span>Last Updated: {formatDate(data.updatedAt)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.3);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.5);
        }
      `}</style>
    </div>
  );
};
