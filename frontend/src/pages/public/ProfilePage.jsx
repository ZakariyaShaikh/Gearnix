import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/auth/AuthContext";
import {
  changePassword,
  deleteAccount,
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "@/api/users.api";
import { getMediaUrl } from "@/utils/media";

function ProfileField({ label, value }) {
  return (
    <div className="min-w-0 border-t border-white/10 py-4 first:border-t-0">
      <dt className="text-sm text-brand-text-muted">{label}</dt>
      <dd className="mt-1 break-words font-medium text-brand-text-primary">
        {value || "Not available"}
      </dd>
    </div>
  );
}

export function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user || {});
  const [username, setUsername] = useState(user?.username || "");
  const [newPassword, setNewPassword] = useState("");
  const [passwordValues, setPasswordValues] = useState({
    current_password: "",
    confirm_password: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setUsername(data.username || "");
        updateUser?.({
          username: data.username,
          profile_image: data.profile_image,
        });
      })
      .catch((error) => {
        if (active)
          setErrorMessage(error.message || "Unable to load your profile.");
      });
    return () => {
      active = false;
    };
  }, [updateUser]);

  function resetFeedback() {
    setNotice("");
    setErrorMessage("");
  }

  async function handleProfileSave(event) {
    event.preventDefault();
    resetFeedback();
    if (username.trim().length < 3)
      return setErrorMessage("Username must be at least 3 characters.");
    setBusy("profile");
    try {
      const updated = await updateProfile({ username: username.trim() });
      const nextUsername = updated.username || username.trim();
      setProfile((current) => ({
        ...current,
        ...updated,
        username: nextUsername,
      }));
      setUsername(nextUsername);
      updateUser?.({ username: nextUsername });
      setNotice("Profile updated.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to update your profile.");
    } finally {
      setBusy("");
    }
  }

  async function handleImageUpload(event) {
    event.preventDefault();
    const form = event.currentTarget;
    resetFeedback();
    if (!imageFile) return setErrorMessage("Choose an image to upload.");
    if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type))
      return setErrorMessage("Choose a JPEG, PNG, or WebP image.");
    if (imageFile.size > 2 * 1024 * 1024)
      return setErrorMessage("Image must be 2 MB or smaller.");
    setBusy("image");
    try {
      const updated = await uploadProfileImage(imageFile);
      setProfile((current) => ({ ...current, ...updated }));
      updateUser?.({ profile_image: updated.profile_image });
      setImageFile(null);
      form.reset();
      setNotice("Profile image updated.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to upload your profile image.");
    } finally {
      setBusy("");
    }
  }

  async function handlePasswordChange(event) {
    event.preventDefault();
    resetFeedback();
    if (newPassword.length < 8 || newPassword.length > 72)
      return setErrorMessage(
        "New password must be between 8 and 72 characters.",
      );
    if (newPassword !== passwordValues.confirm_password)
      return setErrorMessage("Passwords do not match.");
    setBusy("password");
    try {
      await changePassword({ ...passwordValues, new_password: newPassword });
      await logout();
      navigate("/login", {
        replace: true,
        state: { notice: "Password changed. Sign in with your new password." },
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to change your password.");
    } finally {
      setBusy("");
    }
  }

  async function handleAccountDelete(event) {
    event.preventDefault();
    resetFeedback();
    if (!deletePassword)
      return setErrorMessage("Enter your password to delete your account.");
    setBusy("delete");
    try {
      await deleteAccount({ password: deletePassword });
      await logout();
      navigate("/login", {
        replace: true,
        state: { notice: "Your account has been deleted." },
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to delete your account.");
    } finally {
      setBusy("");
    }
  }

  async function handleLogout() {
    resetFeedback();
    setBusy("logout");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Unable to sign out. Please try again.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">
          Account
        </p>
        <h1 className="mt-2 font-primary text-3xl font-bold text-brand-text-primary">
          My profile
        </h1>
        <p className="mt-2 text-brand-text-muted">
          Manage your account details, password and profile image.
        </p>
      </header>
      {(errorMessage || notice) && (
        <p
          className={`rounded-lg border p-3 text-sm ${errorMessage ? "border-red-400/40 bg-red-950/30 text-red-200" : "border-emerald-400/30 bg-emerald-950/20 text-emerald-200"}`}
          role={errorMessage ? "alert" : "status"}
        >
          {errorMessage || notice}
        </p>
      )}

      <Card className="border-brand-border-subtle bg-brand-black text-brand-text-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            {profile.profile_image && getMediaUrl(profile.profile_image) ? (
              <img
                src={getMediaUrl(profile.profile_image)}
                alt={`${profile.username || "Profile"} profile image`}
                className="size-11 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-11 items-center justify-center rounded-full bg-white/10 text-brand-accent-pink">
                <FiUser aria-hidden="true" size={22} />
              </span>
            )}
            <div>
              <CardTitle className="font-primary text-xl">
                Account details
              </CardTitle>
              <CardDescription className="mt-1 text-brand-text-muted">
                Your current account information.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl>
            <ProfileField label="Username" value={profile.username} />
            <ProfileField label="Email" value={profile.email} />
            <ProfileField label="Account role" value={profile.role_name} />
          </dl>
          <form
            onSubmit={handleProfileSave}
            className="mt-5 space-y-3 border-t border-white/10 pt-5"
          >
            <div className="space-y-2">
              <Label htmlFor="profile-username">Username</Label>
              <Input
                id="profile-username"
                autoComplete="username"
                minLength={3}
                maxLength={50}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="min-h-11 bg-white text-zinc-900"
              />
            </div>
            <Button
              type="submit"
              disabled={Boolean(busy)}
              className="min-h-11 bg-brand-accent-pink text-black hover:bg-brand-accent-magenta"
            >
              {busy === "profile" ? "Saving…" : "Save profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-brand-border-subtle bg-brand-black text-brand-text-primary">
        <CardHeader>
          <CardTitle className="font-primary text-xl">Profile image</CardTitle>
          <CardDescription className="text-brand-text-muted">
            JPEG, PNG or WebP, up to 2 MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleImageUpload} className="space-y-3">
            <Label htmlFor="profile-image">Choose image</Label>
            <Input
              id="profile-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] || null)
              }
              className="min-h-11 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-white"
            />
            <Button
              type="submit"
              disabled={Boolean(busy)}
              variant="outline"
              className="min-h-11 border-white/20 text-black hover:bg-white/10"
            >
              {busy === "image" ? "Uploading…" : "Upload image"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-brand-border-subtle bg-brand-black text-brand-text-primary">
        <CardHeader>
          <CardTitle className="font-primary text-xl">
            Change password
          </CardTitle>
          <CardDescription className="text-brand-text-muted">
            Changing your password signs you out on this and other devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                required
                value={passwordValues.current_password}
                onChange={(event) =>
                  setPasswordValues((current) => ({
                    ...current,
                    current_password: event.target.value,
                  }))
                }
                className="min-h-11 bg-white text-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="min-h-11 bg-white text-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm new password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                required
                value={passwordValues.confirm_password}
                onChange={(event) =>
                  setPasswordValues((current) => ({
                    ...current,
                    confirm_password: event.target.value,
                  }))
                }
                className="min-h-11 bg-white text-zinc-900"
              />
            </div>
            <Button
              type="submit"
              disabled={Boolean(busy)}
              className="min-h-11 bg-brand-accent-pink text-black hover:bg-brand-accent-magenta"
            >
              {busy === "password" ? "Updating…" : "Change password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-500/30 bg-brand-black text-brand-text-primary">
        <CardHeader>
          <CardTitle className="font-primary text-xl">Delete account</CardTitle>
          <CardDescription className="text-brand-text-muted">
            Your account will be deactivated. Your order records are kept.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAccountDelete} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="delete-account-password">
                Password to delete account
              </Label>
              <Input
                id="delete-account-password"
                type="password"
                autoComplete="current-password"
                required
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                className="min-h-11 bg-white text-zinc-900"
              />
            </div>
            <Button
              type="submit"
              disabled={Boolean(busy)}
              variant="destructive"
              className="min-h-11"
            >
              {busy === "delete" ? "Deleting…" : "Delete account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-brand-border-subtle bg-brand-black text-brand-text-primary">
        <CardHeader>
          <CardTitle className="font-primary text-xl">Sign out</CardTitle>
          <CardDescription className="text-brand-text-muted">
            End this session on this browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            disabled={Boolean(busy)}
            onClick={handleLogout}
            className="min-h-11 border-white/20 text-brand-text-dark hover:bg-white/10"
          >
            <FiLogOut aria-hidden="true" />
            {busy === "logout" ? "Signing out…" : "Log out"}
          </Button>
          <p className="text-sm text-brand-text-muted">
            <Button
              type="button"
              variant="outline"
              className="min-h-11 border-white/20 bg-white text-black hover:bg-white/10 hover:text-white"
              onClick={() => navigate("/orders")}
            >
              View order history
            </Button>{" "}
            <Link
              to="/addresses"
              className="text-brand-accent-pink underline-offset-4 hover:underline"
            >
              Manage saved addresses
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
