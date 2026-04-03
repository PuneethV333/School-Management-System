/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom"
import Spinner from "../../../components/Spinner"
import { useFetchAnnouncementData } from "../../../hooks/useAnnouncementData"
import { useFetchMe } from "../../../hooks/useAuth"
import { Calendar, Tag, ChevronRight } from "lucide-react"
import { formatDate, getCategoryColor, getCategoryIcon, truncateText } from "../../../utils/announcementHelpers"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"





export const Dashboard = () => {
  const { data: userData, isPending: loading } = useFetchMe()
  const { data: announcements, isPending: loadingAnnouncementData } = useFetchAnnouncementData(userData)

  if (loading || loadingAnnouncementData) {
    return <Spinner />
  }

  if (!announcements || announcements.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <p>No announcements available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="announcement-swiper-container">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          loop={announcements.length > 1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={announcements.length > 1}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: announcements.length === 1 ? 1 : 2,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView:
                announcements.length === 1
                  ? 1
                  : Math.min(2, announcements.length),
              spaceBetween: 20,
            },
          }}
          className="pb-10"
        >
          {announcements.map((item:any) => {
            const isExpired =
              item.expireAt && new Date(item.expireAt) < new Date()

            return (
              <SwiperSlide key={item._id}>
                <Link to={`/announcements/${item._id}`}>
                  <div className="group relative bg-gradient-to-br from-slate-800/60 via-slate-900/60 to-slate-950/50 backdrop-blur-sm border border-slate-700/30 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:border-slate-600/50 transition-all duration-300 h-full">
                    <div
                      className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getCategoryColor(item.category)} pointer-events-none`}
                    ></div>

                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none"></div>

                    <div className="relative p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xl shrink-0">
                            {getCategoryIcon(item.category)}
                          </span>
                          <div
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(item.category)} text-white shadow-sm shrink-0`}
                          >
                            {item.category}
                          </div>
                        </div>

                        {!item.isActive && (
                          <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/50 rounded text-xs font-medium text-red-300 shrink-0">
                            Inactive
                          </span>
                        )}

                        {isExpired && item.isActive && (
                          <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/50 rounded text-xs font-medium text-orange-300 shrink-0">
                            Expired
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                        {truncateText(item.content, 100)}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(item.publishAt)}</span>
                        </div>

                        {item.academicYear && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Tag className="w-3 h-3" />
                            <span>{item.academicYear}</span>
                          </div>
                        )}

                        {item.classes && item.classes.length > 0 && (
                          <div className="text-slate-400">
                            <span className="text-cyan-300 font-medium">
                              {item.classes.slice(0, 2).join(", ")}
                              {item.classes.length > 2 &&
                                ` +${item.classes.length - 2}`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                        <span className="text-xs text-slate-500">
                          {item.attachments && item.attachments.length > 0 && (
                            <span>📎 {item.attachments.length}</span>
                          )}
                        </span>
                        <div className="flex items-center gap-1 text-cyan-400 font-medium text-xs group-hover:gap-1.5 transition-all duration-300">
                          Read More
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </Link>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      <style>{`
        .announcement-swiper-container .swiper-pagination-bullet {
          background: rgba(148, 163, 184, 0.4);
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
          opacity: 0.6;
        }

        .announcement-swiper-container .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          width: 28px;
          border-radius: 5px;
          opacity: 1;
        }

        .announcement-swiper-container .swiper-button-next,
        .announcement-swiper-container .swiper-button-prev {
          color: #06b6d4;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(6, 182, 212, 0.3);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .announcement-swiper-container .swiper-button-next:hover,
        .announcement-swiper-container .swiper-button-prev:hover {
          background: rgba(6, 182, 212, 0.25);
          border-color: rgba(6, 182, 212, 0.6);
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
        }

        .announcement-swiper-container .swiper-button-next::after,
        .announcement-swiper-container .swiper-button-prev::after {
          font-size: 18px;
          font-weight: bold;
        }

        .announcement-swiper-container .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .announcement-swiper-container .swiper-button-next,
          .announcement-swiper-container .swiper-button-prev {
            display: none;
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}