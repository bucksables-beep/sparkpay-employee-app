import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useSettings } from "../hooks/useSettings";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    form,
    user,
    isUploadingAvatar,
    handlePhoneNumberChange,
    handlePhoneNumberPaste,
    handlePictureChange,
    handleEditPictureClick,
    handleLogout,
  } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center justify-center p-4">
          <h1 className="text-lg font-bold text-text-light dark:text-text-dark">
            Profile
          </h1>
        </div>
      </header>
      <main className="flex-grow px-4 pb-8">
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="relative">
            {isUploadingAvatar ? (
              <div className="w-32 h-32 rounded-full border-4 border-background-light dark:border-background-dark bg-surface-light dark:bg-surface-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : user?.avatar ? (
              <img
                alt={`${user?.firstname} ${user?.lastname} profile picture`}
                className="w-32 h-32 rounded-full object-cover border-4 border-background-light dark:border-background-dark"
                src={user.avatar}
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-background-light dark:border-background-dark bg-surface-light dark:bg-surface-dark flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-subtext-light dark:text-subtext-dark">
                  account_circle
                </span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handlePictureChange(e, fileInputRef)}
              accept="image/*"
              className="sr-only"
              disabled={isUploadingAvatar}
            />
            <button
              onClick={() => handleEditPictureClick(fileInputRef)}
              disabled={isUploadingAvatar}
              className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2 flex items-center justify-center shadow-md interactive-scale disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Edit profile picture"
            >
              <span className="material-symbols-outlined text-base">edit</span>
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
              {user?.firstname} {user?.lastname}
            </h2>
            {/* <p className="text-base text-subtext-light dark:text-subtext-dark">
              Account Manager
            </p> */}
          </div>
        </div>
        <form onSubmit={form.handleSubmit}>
          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input
                id="firstname"
                name="firstname"
                label="First Name"
                type="text"
                value={form.values.firstname}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.firstname}
                touched={form.touched.firstname}
              />
              <Input
                id="lastname"
                name="lastname"
                label="Last Name"
                type="text"
                value={form.values.lastname}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.lastname}
                touched={form.touched.lastname}
              />
              <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                value={user?.email || ""}
                readonly
              />
              <Input
                id="phonenumber"
                name="phonenumber"
                label="Phone Number"
                type="tel"
                placeholder="+234 801 234 5678"
                value={form.values.phonenumber}
                onChange={handlePhoneNumberChange}
                onBlur={form.handleBlur}
                error={form.errors.phonenumber}
                touched={form.touched.phonenumber}
                onPaste={handlePhoneNumberPaste}
              />
            </div>
            <div className="space-y-2 pt-4 border-t border-border-light dark:border-border-dark">
              <div className="w-full flex items-center justify-between text-left p-3 rounded-lg">
                <span className="text-base font-medium text-text-light dark:text-text-dark">
                  Dark Mode
                </span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border-light peer-focus:outline-none rounded-full peer dark:bg-border-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
              <button
                onClick={() => navigate("/app/accounts")}
                className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-primary/10 dark:hover:bg-accent-blue/20 transition-colors interactive-scale"
              >
                <span className="text-base font-medium text-text-light dark:text-text-dark">
                  Bank Accounts
                </span>
                <span
                  className="material-symbols-outlined text-subtext-light dark:text-subtext-dark"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              </button>
              <button className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-primary/10 dark:hover:bg-accent-blue/20 transition-colors interactive-scale">
                <span className="text-base font-medium text-text-light dark:text-text-dark">
                  Change Password
                </span>
                <span
                  className="material-symbols-outlined text-subtext-light dark:text-subtext-dark"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              </button>
              <button className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-primary/10 dark:hover:bg-accent-blue/20 transition-colors interactive-scale">
                <span className="text-base font-medium text-text-light dark:text-text-dark">
                  Personal Preferences
                </span>
                <span
                  className="material-symbols-outlined text-subtext-light dark:text-subtext-dark"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors interactive-scale"
              >
                <span className="text-base font-medium text-red-600 dark:text-red-400">
                  Logout
                </span>
                <span
                  className="material-symbols-outlined text-red-600 dark:text-red-400"
                  aria-hidden="true"
                >
                  logout
                </span>
              </button>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <Button
              type="submit"
              isLoading={form.isSubmitting}
              disabled={!form.isValid || !form.dirty}
              className="w-full h-12 text-base"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Settings;
