import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Search, Filter, Eye, CheckCircle, XCircle, Clock, User,
  ChevronLeft, ChevronRight, Shield, AlertCircle
} from "lucide-react";

const AdminVerificationPage = () => {
  const { logout }: any = useContext(AuthContext);
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    fetchVerifications();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await axios.get(
        `https://servixobackend.vercel.app/api/admin/verifications?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProviders(response.data.providers);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch verifications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      case "partial": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "not_started": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle size={16} />;
      case "rejected": return <XCircle size={16} />;
      case "partial": return <Clock size={16} />;
      case "not_started": return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getVerificationProgress = (verification: any) => {
    if (!verification) return 0;
    
    const sections = [
      verification.aadharCard,
      verification.panCard,
      verification.drivingLicense,
      verification.phone,
      verification.bankAccount,
      verification.profilePhoto
    ];
    
    const verifiedCount = sections.filter(s => s && s.status === "verified").length;
    return Math.round((verifiedCount / sections.length) * 100);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVerifications();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 fixed h-full hidden md:block flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-blue-600">
          Admin Panel
        </h2>

        <nav className="space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </Link>

          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <User size={20} />
            Manage Users
          </Link>

          <Link to="/admin/verifications" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
            <Shield size={20} />
            Verifications
          </Link>

          <Link to="/admin/services" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Manage Services
          </Link>

          <Link to="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Manage Bookings
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Provider Verifications
          </h1>
          <p className="text-gray-600">
            Review and manage provider verification requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                <Clock size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.pending || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Pending Review</h3>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <CheckCircle size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.verified || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Verified</h3>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-red-100 text-red-600">
                <XCircle size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.rejected || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <AlertCircle size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.notStarted || 0}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Not Started</h3>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="partial">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
                <option value="not_started">Not Started</option>
              </select>
            </div>
          </div>
        </div>

        {/* Providers List */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providers.map((provider) => (
                  <tr key={provider._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          {provider.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                          <div className="text-sm text-gray-500">Provider</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{provider.email}</div>
                      <div className="text-sm text-gray-500">{provider.phone || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(provider.overallVerificationStatus)}`}>
                        {getStatusIcon(provider.overallVerificationStatus)}
                        {provider.overallVerificationStatus?.replace("_", " ") || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${getVerificationProgress(provider.verification)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {getVerificationProgress(provider.verification)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(provider.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/admin/verification/${provider._id}`}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                      >
                        <Eye size={16} />
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {providers.length === 0 && (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No verification requests found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "No providers have submitted verification requests yet"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.current - 1) * 10) + 1} to {Math.min(pagination.current * 10, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(pagination.current - 1)}
                disabled={pagination.current <= 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="px-3 py-1 text-sm">
                Page {pagination.current} of {pagination.pages}
              </span>
              
              <button
                onClick={() => setCurrentPage(pagination.current + 1)}
                disabled={pagination.current >= pagination.pages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerificationPage;
