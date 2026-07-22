import React from "react";

function AddressForm({ address, setAddress }) {

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Delivery Address
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-medium">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            placeholder="Enter Full Name"
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Mobile Number
          </label>

          <input
            type="text"
            name="mobile"
            value={address.mobile}
            onChange={handleChange}
            placeholder="Enter Mobile Number"
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={address.email}
            onChange={handleChange}
            placeholder="Enter Email"
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            House No
          </label>

          <input
            type="text"
            name="houseNo"
            value={address.houseNo}
            onChange={handleChange}
            placeholder="House / Door No"
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">
            Street
          </label>

          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleChange}
            placeholder="Street Name"
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Village
          </label>

          <input
            type="text"
            name="village"
            value={address.village}
            onChange={handleChange}
            placeholder="Village"
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            City
          </label>

          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            District
          </label>

          <input
            type="text"
            name="district"
            value={address.district}
            onChange={handleChange}
            placeholder="District"
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            State
          </label>

          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Pincode
          </label>

          <input
            type="text"
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full border rounded-xl p-3"
          />
        </div>

      </div>

    </div>
  );
}

export default AddressForm;