import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFileImport } from 'react-icons/fa';

export const AdminHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content w-24 h-24 rounded-full">
              <span className="text-3xl">{user?.name[0].toUpperCase()}</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mt-4">Admin Dashboard</h1>
          <p className="text-lg text-base-content/70 mt-2">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quick Start Guide */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Getting Started</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-primary">
                    <FaFileImport className="text-2xl mt-1" />
                  </div>
                  <div>
                    <h3 className="font-bold">Adding New POIs</h3>
                    <p className="text-sm text-base-content/70">
                      1. Navigate to the Upload section<br />
                      2. Fill in location details<br />
                      3. Verify coordinates<br />
                      4. Submit for encryption
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-secondary">
                    <FaUpload className="text-2xl mt-1" />
                  </div>
                  <div>
                    <h3 className="font-bold">Data Management</h3>
                    <p className="text-sm text-base-content/70">
                      • Batch upload capabilities<br />
                      • Geospatial validation<br />
                      • Encryption management<br />
                      • Data export options
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="space-y-4">
                <button 
                  className="btn btn-primary w-full"
                  onClick={() => navigate('/admin-upload')}
                >
                  <FaUpload className="text-xl mr-2" />
                  Upload New POI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Data Management Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Secure AES-256 encryption</li>
                <li>Geohash indexing system</li>
                <li>Coordinate validation</li>
                <li>Batch processing support</li>
                <li>Data version control</li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">System Operations</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Database health monitoring</li>
                <li>Encryption key rotation</li>
                <li>Backup scheduling</li>
                <li>Audit logging</li>
                <li>API security management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="card bg-base-100 shadow-xl mt-8">
          <div className="card-body">
            <h2 className="card-title">Data Management Best Practices</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Always verify coordinates before submission</li>
                  <li>Use standardized naming conventions</li>
                  <li>Include descriptive metadata for all entries</li>
                  <li>Regularly audit existing data entries</li>
                  <li>Maintain encryption key security protocols</li>
                  <li>Implement regular data backups</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;