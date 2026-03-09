import AddressManager from "../components/AddressManager";

function AddressPage() {
  return (
    <div className="min-h-screen px-6 py-10 pt-4 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-10">
        My Addresses
      </h1>

      {/* ADDRESS MANAGER SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <AddressManager />
      </div>
    </div>
  );
}

export default AddressPage;
