import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {

  const navigate = useNavigate();

  const { customer, logout } = useContext(AuthContext);

  const handleLogout = () => {

    logout();

    navigate("/");

  };

  return (

    <div className="min-h-screen bg-green-100 p-5">

      <div className="bg-white rounded-xl shadow-lg p-5">

        <h1 className="text-2xl font-bold text-green-700">

          Welcome

        </h1>

        <div className="mt-5 space-y-2">

          <p>

            <strong>Customer ID :</strong>

            {customer?.customer_id}

          </p>

          <p>

            <strong>Name :</strong>

            {customer?.full_name}

          </p>

          <p>

            <strong>Mobile :</strong>

            {customer?.mobile_number}

          </p>

          <p>

            <strong>Email :</strong>

            {customer?.email}

          </p>

          <p>

            <strong>Village :</strong>

            {customer?.village}

          </p>

        </div>

        <button

          onClick={handleLogout}

          className="mt-8 bg-red-600 text-white px-6 py-3 rounded-lg"

        >

          Logout

        </button>

      </div>

    </div>

  );

}

export default Dashboard;