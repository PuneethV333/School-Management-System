import React, { useEffect, useRef, useState } from "react";
import { VscMenu } from "react-icons/vsc";
import { RiArrowDropDownLine, RiLockPasswordLine } from "react-icons/ri";
import gsap from "gsap";
import useUi from "../hooks/useUi";
import { useFetchMe, useLogout, useChangePassword } from "../hooks/useAuth";
import Spinner from "../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const { menuIsOpen, setMenuIsOpen } = useUi();
  const { data: userData, isLoading: userLoading } = useFetchMe();
  const { mutate: logout } = useLogout();
  const { mutateAsync: changePassword } = useChangePassword();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (dropdownOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current.querySelector(".dropdown-content"),
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
      );
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (showChangePass && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
      );
    }
  }, [showChangePass]);

  const handleChangePassword = async (oldPass: string, newPass: string) => {
    try {
      setLoading(true);
      await changePassword({ oldPass, newPass });
      setShowChangePass(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <Spinner />;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg shadow-black/20 text-white">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuIsOpen(!menuIsOpen)}
            className="p-2 rounded-md bg-white/5 hover:bg-white/15 backdrop-blur-md transition"
          >
            <VscMenu className="text-3xl" />
          </button>
          <Link to="/">
            <img
              src="https://res.cloudinary.com/deymewscv/image/upload/v1760798310/make_the_background_emesg0.png"
              alt="logo"
              className="h-10 cursor-pointer"
              loading="lazy"
            />
          </Link>
        </div>

        {userData && (
          <div className="relative z-50" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={userData.profilePicUrl}
                alt="profile"
                className="h-10 w-10 rounded-full border border-white/20 object-cover"
              />
              <span className="hidden sm:block font-medium">{userData.name}</span>
              <RiArrowDropDownLine
                size={32}
                className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {dropdownOpen && (
              <div className="dropdown-content absolute right-0 mt-3 w-72 backdrop-blur-xl bg-gray-800 rounded-xl shadow-xl shadow-black/30 border border-white/10 overflow-hidden">
                <div className="flex gap-4 p-4 border-b border-white/10">
                  <img
                    src={userData.profilePicUrl}
                    className="h-16 w-16 rounded-full border border-white/20"
                    alt="user"
                  />
                  <div>
                    <h1
                      className="font-semibold cursor-pointer"
                      onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                    >
                      {userData.name}
                    </h1>
                    <p className="text-sm text-gray-300">{userData.authId}</p>
                    <p className="text-sm text-gray-400">{userData.role}</p>
                    {userData.role === "student" && (
                      <p className="text-sm text-gray-400">Class: {userData.class}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => { setDropdownOpen(false); setShowChangePass(true); }}
                  className="w-full px-4 py-3 flex items-center gap-2 hover:bg-white/10 transition"
                >
                  <RiLockPasswordLine /> Change Password
                </button>

                <button
                  onClick={() => logout()}
                  className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/15 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {showChangePass && (
        <ChangePasswordModal
          ref={modalRef}
          loading={loading}
          onClose={() => setShowChangePass(false)}
          onSubmit={handleChangePassword}
        />
      )}
    </>
  );
};

export default Navbar;

type ChangePasswordModalProps = {
  onClose: () => void;
  onSubmit: (oldPass: string, newPass: string) => void;
  loading: boolean;
};

const ChangePasswordModal = React.forwardRef<HTMLDivElement, ChangePasswordModalProps>(
  ({ onClose, onSubmit, loading }, ref) => {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const submit = () => {
      if (!oldPass || !newPass || !confirmPass)
        return toast.error("All fields are required");
      if (newPass.length < 6)
        return toast.error("Password must be at least 6 characters");
      if (newPass !== confirmPass)
        return toast.error("Passwords do not match");

      onSubmit(oldPass, newPass);
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <div
          ref={ref}
          className="bg-[#0A0F1C] text-white w-full max-w-md rounded-xl shadow-xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-5">Change Password</h2>
          <input
            type="password"
            placeholder="Old password"
            value={oldPass}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPass(e.target.value)}
            className="w-full bg-[#020617] border border-white/10 rounded-md px-3 py-2 mb-3 outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPass}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPass(e.target.value)}
            className="w-full bg-[#020617] border border-white/10 rounded-md px-3 py-2 mb-3 outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPass}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPass(e.target.value)}
            className="w-full bg-[#020617] border border-white/10 rounded-md px-3 py-2 mb-5 outline-none focus:border-blue-500"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    );
  },
);