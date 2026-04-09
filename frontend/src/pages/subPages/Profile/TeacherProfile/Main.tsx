/* eslint-disable react-hooks/rules-of-hooks */
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
} from "lucide-react";
import { useFetchMe } from "../../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { formatDate } from "../../../../utils/DisplayMonthlyAttendanceHelpers";
import {
  ErrorState,
  InfoCard,
  SectionCard,
} from "../../../../components/StudentProfileHelperComponents";
import Spinner from "../../../../components/Spinner";
import { useFetchTeacherById } from "../../../../hooks/useTeachersData";

export const Main = () => {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useFetchMe();
  
  const { id } = useParams();
  
  if(!id){
    return;
  }

  const {
    data: studentData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useFetchTeacherById(userData, id);

  
  if (!id) {
    return (
      <ErrorState
        title="Missing Student ID"
        message="No student ID provided in the URL"
      />
    );
  }

  if (userLoading || studentsLoading) {
    return <Spinner />;
  }

  if (userError) {
    return (
      <ErrorState
        title="User Error"
        message={userError.message || "Failed to load user data"}
      />
    );
  }

  if (studentsError) {
    return (
      <ErrorState
        title="Students Error"
        message={studentsError.message || "Failed to load students data"}
      />
    );
  }

  if (!studentData) {
    return (
      <ErrorState
        title="Student Not Found"
        message={`No student found with ID: ${id}`}
      />
    );
  }

  if (!studentData.name || !studentData.profilePicUrl) {
    return (
      <ErrorState
        title="Incomplete Data"
        message="Student profile is missing required information"
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Student Profile
          </h1>
          {studentData.academicYear && (
            <p className="text-slate-400 text-sm mt-2">
              Academic Year:{" "}
              <span className="text-slate-300 font-medium">
                {studentData.academicYear}
              </span>
            </p>
          )}
        </div>

        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 mb-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative shrink-0">
              <img
                src={studentData.profilePicUrl}
                alt={studentData.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-slate-700 shadow-lg"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/144?text=No+Image";
                }}
              />
              <div
                className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-slate-900 ${
                  studentData.isActive ? "bg-green-500" : "bg-gray-500"
                }`}
                title={studentData.isActive ? "Active" : "Inactive"}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold text-white mb-2 break-words">
                {studentData.name}
              </h2>

              <div className="flex gap-2 mb-4 flex-wrap">
                {studentData.class && studentData.section && (
                  <span className="badge bg-blue-900/40 text-blue-300 border border-blue-700/50 px-3 py-1 rounded-full text-xs font-medium">
                    Class {studentData.class}-{studentData.section}
                  </span>
                )}
                {studentData.rollNo && (
                  <span className="badge bg-purple-900/40 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-full text-xs font-medium">
                    Roll No {studentData.rollNo}
                  </span>
                )}
                {studentData.gender && (
                  <span className="badge bg-pink-900/40 text-pink-300 border border-pink-700/50 px-3 py-1 rounded-full text-xs font-medium">
                    {studentData.gender}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <InfoCard
                  icon={CreditCard}
                  label="Auth ID"
                  value={studentData.authId}
                  isEmpty={!studentData.authId}
                />
                <InfoCard
                  icon={Calendar}
                  label="DOB"
                  value={formatDate(studentData.dob)}
                  isEmpty={!studentData.dob}
                />
                <InfoCard
                  icon={Droplet}
                  label="Blood Group"
                  value={studentData.bloodGroup}
                  isEmpty={!studentData.bloodGroup}
                />
                <InfoCard
                  icon={Phone}
                  label="Phone"
                  value={studentData.phone}
                  isEmpty={!studentData.phone}
                />
                <InfoCard
                  icon={Mail}
                  label="Email"
                  value={studentData.email}
                  isEmpty={!studentData.email}
                />
                <InfoCard
                  icon={Hash}
                  label="SATS No"
                  value={studentData.satsNo}
                  isEmpty={!studentData.satsNo}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Father Details" icon={User}>
            <InfoCard
              icon={User}
              label="Name"
              value={studentData.father?.name}
              isEmpty={!studentData.father?.name}
            />
            <InfoCard
              icon={Phone}
              label="Phone"
              value={studentData.father?.phone}
              isEmpty={!studentData.father?.phone}
            />
            <InfoCard
              icon={GraduationCap}
              label="Occupation"
              value={studentData.father?.occupation}
              isEmpty={!studentData.father?.occupation}
            />
            <InfoCard
              icon={Mail}
              label="Email"
              value={studentData.father?.email}
              isEmpty={!studentData.father?.email}
            />
          </SectionCard>

          <SectionCard title="Mother Details" icon={User}>
            <InfoCard
              icon={User}
              label="Name"
              value={studentData.mother?.name}
              isEmpty={!studentData.mother?.name}
            />
            <InfoCard
              icon={Phone}
              label="Phone"
              value={studentData.mother?.phone}
              isEmpty={!studentData.mother?.phone}
            />
            <InfoCard
              icon={GraduationCap}
              label="Occupation"
              value={studentData.mother?.occupation}
              isEmpty={!studentData.mother?.occupation}
            />
            <InfoCard
              icon={Mail}
              label="Email"
              value={studentData.mother?.email}
              isEmpty={!studentData.mother?.email}
            />
          </SectionCard>

          <SectionCard title="Address" icon={MapPin}>
            <InfoCard
              icon={MapPin}
              label="Street"
              value={studentData.address?.street}
              isEmpty={!studentData.address?.street}
            />
            <InfoCard
              icon={MapPin}
              label="City"
              value={studentData.address?.city}
              isEmpty={!studentData.address?.city}
            />
            <InfoCard
              icon={MapPin}
              label="State"
              value={studentData.address?.state}
              isEmpty={!studentData.address?.state}
            />
            <InfoCard
              icon={Hash}
              label="Pincode"
              value={studentData.address?.pincode}
              isEmpty={!studentData.address?.pincode}
            />
          </SectionCard>

          <SectionCard title="Academic Info" icon={GraduationCap}>
            <InfoCard
              icon={Calendar}
              label="Admission Date"
              value={formatDate(studentData.admissionDate)}
              isEmpty={!studentData.admissionDate}
            />
            <InfoCard
              icon={Users}
              label="Role"
              value={studentData.role?.toUpperCase()}
              isEmpty={!studentData.role}
            />
            <InfoCard
              icon={Calendar}
              label="Status"
              value={studentData.isActive ? "Active" : "Inactive"}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};