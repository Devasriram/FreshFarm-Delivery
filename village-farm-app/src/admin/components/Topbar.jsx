function Topbar() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold">
            Admin
          </p>

          <p className="text-sm text-gray-500">
            Welcome Back
          </p>
        </div>

        <img
          src="https://ui-avatars.com/api/?name=Admin"
          alt="admin"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
}

export default Topbar;