/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react"
import { useFetchMe } from "../../../hooks/useAuth";
import Spinner from "../../../components/Spinner";
import { usePostAnnouncement } from "../../../hooks/useAnnouncementData";
import { AlertCircle, Calendar, CheckCircle2, FileText, Loader2, Megaphone, Tag, Upload, Users, X } from "lucide-react";
import type { Attachment } from "../../../types/announcement.types";
import { categories, getCategoryIcon, handleInputChange, type category } from "../../../utils/announcementHelpers";
import toast from "react-hot-toast";
import { returnUrl } from "../../../utils/cloudinaryHelper";

const allClasses = Array.from({ length: 10 }, (_, i) => i + 1);

export const Add = () => {
    
    
    const {data:userData,isPending:loading} = useFetchMe();
    
    const {mutate:addAnnouncement,isPending:isSubmitting} = usePostAnnouncement(userData)
    
    const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    classes: [] as number[],
    expireAt: "",
  });
  
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectAllClasses, setSelectAllClasses] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + attachments.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClassToggle = (cls: number) => {
    setFormData((prev) => ({
      ...prev,
      classes: prev.classes.includes(cls)
        ? prev.classes.filter((c) => c !== cls)
        : [...prev.classes, cls],
    }));
  };

  const handleSelectAllClasses = () => {
    setFormData((prev) => ({
      ...prev,
      classes: selectAllClasses ? [] : [...allClasses],
    }));
    setSelectAllClasses(!selectAllClasses);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    if (formData.classes.length === 0) {
      toast.error("Please select at least one class");
      return;
    }

    setUploading(true);

    try {
      let uploadedAttachments: Attachment[] = [];

      if (attachments.length) {
        uploadedAttachments = await Promise.all(
          attachments.map(async (file) => {
            const fileUrl = await returnUrl(file);
            return {
              fileName: file.name,
              fileUrl: fileUrl,
            };
          })
        );
      }

      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category as category,
        classes: formData.classes,
        attachments: uploadedAttachments,
        expireAt: formData.expireAt || "",
      };

      addAnnouncement(payload, {
        onSuccess: () => {
          setFormData({
            title: "",
            content: "",
            category: "General",
            classes: [],
            expireAt: "",
          });
          setAttachments([]);
          setSelectAllClasses(false);
        },
        onSettled: () => {
          setUploading(false);
        },
      });
    } catch (err) {
      toast.error("Failed to upload attachments");
      console.error(err);
      setUploading(false);
    }
  };

  const isLoading = uploading || isSubmitting;
  
    if(loading){
        return <Spinner/>
    }
    
    
    
    
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-8 sm:py-12 lg:py-16">
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12 text-center animate-fadeIn">
          <div className="inline-flex items-center justify-center p-3 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 mb-4">
            <Megaphone className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Create Announcement
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Broadcast important information to students and parents
          </p>
        </div>

        <div className="space-y-6">
          <div
            className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
              <FileText className="w-4 h-4 text-blue-400" />
              Announcement Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={(e) => handleInputChange(e,setFormData)}
              disabled={isLoading}
              placeholder="Enter a clear and concise title"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white border border-slate-700 hover:border-blue-500 focus:border-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div
            className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
              <FileText className="w-4 h-4 text-purple-400" />
              Announcement Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={(e) => handleInputChange(e as any,setFormData)}
              disabled={isLoading}
              rows={6}
              placeholder="Provide detailed information about the announcement"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white border border-slate-700 hover:border-purple-500 focus:border-purple-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-medium placeholder:text-slate-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div
            className="grid md:grid-cols-2 gap-6 animate-fadeIn"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <Tag className="w-4 h-4 text-emerald-400" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => handleInputChange(e as any,setFormData)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white border border-slate-700 hover:border-emerald-500 focus:border-emerald-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.icon} {c.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                name="expireAt"
                value={formData.expireAt}
                onChange={(e) => handleInputChange(e,setFormData)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white border border-slate-700 hover:border-cyan-500 focus:border-cyan-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div
            className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
              <Upload className="w-4 h-4 text-yellow-400" />
              Attachments (Max 5 files)
            </label>
            <div className="space-y-3">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isLoading || attachments.length >= 5}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-slate-300 border border-slate-700 hover:border-yellow-500 focus:border-yellow-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-500/20 file:text-yellow-400 hover:file:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-800/60 rounded-lg border border-slate-700/50"
                    >
                      <span className="text-slate-300 text-sm truncate flex-1">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeAttachment(index)}
                        disabled={isLoading}
                        className="ml-2 p-1 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 animate-fadeIn"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Users className="w-4 h-4 text-pink-400" />
                Target Classes
              </label>
              <button
                type="button"
                onClick={handleSelectAllClasses}
                disabled={isLoading}
                className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectAllClasses ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {allClasses.map((cls) => (
                <button
                  key={cls}
                  onClick={() => handleClassToggle(cls)}
                  disabled={isLoading}
                  className={`p-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                    formData.classes.includes(cls)
                      ? "bg-linear-to-br from-cyan-500 to-blue-500 text-white shadow-lg"
                      : "bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 border border-slate-700/50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {formData.classes.length > 0 && (
              <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {formData.classes.length} class
                  {formData.classes.length !== 1 ? "es" : ""} selected
                </p>
              </div>
            )}
          </div>

          {formData.category && (
            <div className="animate-fadeIn" style={{ animationDelay: "0.6s" }}>
              <div
                className={`p-4 rounded-xl bg-linear-to-r ${categories.find(c => c.value === formData.category)?.color || "from-slate-500 to-slate-600"} text-white font-bold text-center shadow-lg`}
              >
                <span className="text-2xl mr-2">{getCategoryIcon(formData.category as category)}</span>
                {formData.category} Announcement
              </div>
            </div>
          )}

          <div
            className="text-center animate-fadeIn"
            style={{ animationDelay: "0.7s" }}
          >
            <button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !formData.title.trim() ||
                !formData.content.trim() ||
                formData.classes.length === 0
              }
              className={`group relative px-10 py-4 rounded-xl bg-linear-to-r ${categories.find(c => c.value === formData.category)?.color || "from-slate-500 to-slate-600"} hover:shadow-2xl font-bold text-white text-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploading ? "Uploading Files..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Megaphone className="w-5 h-5" />
                    Create Announcement
                  </>
                )}
              </span>
            </button>

            {formData.classes.length === 0 && (
              <p className="text-sm text-amber-400 mt-3 flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Please select at least one class
              </p>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`bg-slate-800/90 border border-transparent bg-linear-to-r ${categories.find(c => c.value === formData.category)?.color || "from-slate-500 to-slate-600"} p-0.5 rounded-2xl`}
          >
            <div className="bg-slate-900 rounded-[14px] p-8 flex flex-col items-center gap-4 shadow-2xl">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              <p className="text-white font-bold text-xl">
                {uploading
                  ? "Uploading Attachments..."
                  : "Creating Announcement..."}
              </p>
              <p className="text-slate-400 text-sm text-center">
                {uploading
                  ? `Uploading ${attachments.length} file${attachments.length !== 1 ? "s" : ""} to cloud storage`
                  : `Broadcasting to ${formData.classes.length} class${formData.classes.length !== 1 ? "es" : ""}`}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  )
}