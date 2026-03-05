import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProviderProfile() {
  const { id } = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`https://servixobackend.vercel.app/api/user/provider/${id}`)
      .then((res) => {
        setProvider(res.data.provider);
        setServices(res.data.services);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!provider) return <p>Loading...</p>;

  return (
    <div className="p-6 pt-20">
      {/* Provider Info */}
      <div className="border p-6 rounded shadow bg-white dark:bg-gray-800 mb-6">
        <h1 className="text-2xl font-bold">
          {provider.name}
          {provider.isVerified && (
            <span className="ml-2 text-green-600 text-lg">
              ✔ Verified
            </span>
          )}
        </h1>
        <p>Email: {provider.email}</p>
      </div>

      {/* Services */}
      <h2 className="text-xl font-semibold mb-4">
        Services Offered
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s._id}
            className="border p-4 rounded shadow bg-white dark:bg-gray-800"
          >
            <img
              src={s.image}
              className="w-full h-40 object-cover rounded mb-2"
            />

            <h3 className="font-semibold">{s.title}</h3>

            <div className="flex items-center gap-2">
              <span className="text-yellow-500">
                ⭐ {s.averageRating?.toFixed(1) || 0}
              </span>
              <span className="text-sm text-gray-500">
                ({s.totalReviews || 0})
              </span>
            </div>

            <p className="mt-1">₹ {s.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProviderProfile;