import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const userName = user?.name || 'Unknown User';
  const userInitial = userName[0].toUpperCase();
  const userEmail = user?.email || 'No email associated';
  const userRole = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'Unknown Role';
  const memberSince = user?.createdAt ? formatDate(user.createdAt) : 'N/A';

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-full max-w-5xl">
        <div className="card w-full shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                <div className="avatar placeholder">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-4xl flex items-center justify-center">
                    <span>{userInitial}</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{userName}</h1>
                  <p className="text-base-content/70 mt-2">{userEmail}</p>
                </div>
              </div>

              {/* Right Column: Account Details */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-sm uppercase text-base-content/70">Account Details</h2>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🛡️</span>
                      <span className="font-medium">Role:</span>
                      <div className="badge badge-info">{userRole}</div>
                    </div>
                    <p className="text-base-content/70">
                      Member since: {memberSince}
                      {user?.createdAt && (
                        <span className="text-xs block mt-1">
                          ({new Date(user.createdAt).toLocaleTimeString()})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div> {/* end grid */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
