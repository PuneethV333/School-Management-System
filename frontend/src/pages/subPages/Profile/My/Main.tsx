import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Droplet,
  MapPin,
  Users,
  GraduationCap,
  Hash,
  CreditCard,
  Camera,
} from "lucide-react";
import { useFetchMe } from "../../../../hooks/useAuth";
import {
  InfoCard,
  SectionCard,
} from "../../../../components/StudentProfileHelperComponents";
import { formatDate } from "../../../../utils/DisplayMonthlyAttendanceHelpers";
import { useChangeProfilePic } from "../../../../hooks/useStudentData";
import ChangeProfilePic from "../../../../components/ChangeProfilePic";

export const Main = () => {
  const { data: userData } = useFetchMe();
  const [openChangeProfilePic, setOpenChangeProfilePic] =
    useState<boolean>(false);
  const { mutate: changeProfilePic } = useChangeProfilePic();

  const handleUpload = async (cloudinaryUrl: string) => {
    await changeProfilePic(cloudinaryUrl);
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-6 sm:py-8 lg:py-10 overflow-x-hidden">
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div
        className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl -z-10 pointer-events-none animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black bg-linear-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-slate-400 text-sm">
            Academic Year {userData?.academicYear}
          </p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 mb-6 hover:border-slate-600/50 transition-all">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img
                src={userData?.profilePicUrl}
                alt={userData?.name}
                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-slate-700 group-hover:border-blue-500 transition-all cursor-pointer"
                onDoubleClick={() => setOpenChangeProfilePic(true)}
                title="Double-click to change profile picture"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div
                className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-slate-800 ${
                  userData?.isActive ? "bg-green-500" : "bg-gray-500"
                }`}
              ></div>
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-100 mb-2">
                {userData?.name}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30">
                  Class {userData?.class} - {userData?.section}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                  Roll No. {userData?.rollNo}
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium border border-emerald-500/30">
                  {userData?.gender}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <InfoCard
                  icon={CreditCard}
                  label="Auth ID"
                  value={userData?.authId}
                />
                <InfoCard
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(userData?.dob)}
                />
                <InfoCard
                  icon={Droplet}
                  label="Blood Group"
                  value={userData?.bloodGroup}
                />
                <InfoCard icon={Phone} label="Phone" value={userData?.phone} />
                <InfoCard icon={Mail} label="Email" value={userData?.email} />
                <InfoCard
                  icon={Hash}
                  label="SATS No"
                  value={userData?.satsNo}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Father's Details">
            <InfoCard icon={User} label="Name" value={userData?.father?.name} />
            <InfoCard
              icon={Phone}
              label="Phone"
              value={userData?.father?.phone}
            />
            <InfoCard
              icon={GraduationCap}
              label="Occupation"
              value={userData?.father?.occupation}
            />
            <InfoCard
              icon={Mail}
              label="Email"
              value={userData?.father?.email}
            />
          </SectionCard>

          <SectionCard title="Mother's Details">
            <InfoCard icon={User} label="Name" value={userData?.mother?.name} />
            <InfoCard
              icon={Phone}
              label="Phone"
              value={userData?.mother?.phone}
            />
            <InfoCard
              icon={GraduationCap}
              label="Occupation"
              value={userData?.mother?.occupation}
            />
            <InfoCard
              icon={Mail}
              label="Email"
              value={userData?.mother?.email}
            />
          </SectionCard>

          <SectionCard title="Address">
            <InfoCard
              icon={MapPin}
              label="Street"
              value={userData?.address?.street}
            />
            <InfoCard
              icon={MapPin}
              label="City"
              value={userData?.address?.city}
            />
            <InfoCard
              icon={MapPin}
              label="State"
              value={userData?.address?.state}
            />
            <InfoCard
              icon={Hash}
              label="Pincode"
              value={userData?.address?.pincode}
            />
          </SectionCard>

          <SectionCard title="Academic Information">
            <InfoCard
              icon={Calendar}
              label="Admission Date"
              value={formatDate(userData?.admissionDate)}
            />
            <InfoCard
              icon={GraduationCap}
              label="Academic Year"
              value={userData?.academicYear}
            />
            <InfoCard
              icon={Users}
              label="Role"
              value={userData?.role?.toUpperCase()}
            />
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm border border-slate-700/50">
              <div className="mt-0.5">
                <div
                  className={`w-4 h-4 rounded-full ${userData?.isActive ? "bg-green-500" : "bg-gray-500"}`}
                ></div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">Status</p>
                <p className="text-sm text-slate-200 font-medium">
                  {userData?.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {openChangeProfilePic && (
        <ChangeProfilePic
          currentImage={userData?.profilePicUrl || ""}
          onClose={() => setOpenChangeProfilePic(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};
