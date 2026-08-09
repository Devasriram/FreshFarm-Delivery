import { useState } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Administrator",
    email: "admin@villagefarm.com",
    mobile: "9876543210",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      profile.password &&
      profile.password !== profile.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    alert("Profile updated successfully");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">
        Admin Profile
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Admin Name"
            className="w-full border rounded p-3"
          />

          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded p-3"
          />

          <input
            name="mobile"
            value={profile.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full border rounded p-3"
          />

          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full border rounded p-3"
          />

          <input
            type="password"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full border rounded p-3"
          />

          <button className="bg-green-600 text-white px-6 py-3 rounded">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;