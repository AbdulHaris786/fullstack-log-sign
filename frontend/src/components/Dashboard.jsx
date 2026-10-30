import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { userAPI } from '../api';
import {
  LogOut,
  Users,
  User,
  GraduationCap,
  Home,
  Menu,
  X,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  if (
    user?.role === 'student' &&
    (activeTab === 'students' || activeTab === 'faculty')
  ) {
    setActiveTab('dashboard');
    return;
  }

  if (user?.role === 'faculty') {
    fetchFaculty();
  }

  if (activeTab === 'students') {
    fetchStudents();
  }
}, [activeTab, user?.role]);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await userAPI.getAllStudents();
      setStudents(response.data.students || []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied: Only faculty can view students');
      } else {
        setError('Failed to fetch students');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await userAPI.getAllFaculty();
      setFaculty(response.data.faculties || []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied: Only faculty can view faculty list');
      } else {
        setError('Failed to fetch faculty');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await userAPI.deleteStudent(id);
      setStudents((currentStudents) =>
        currentStudents.filter((student) => student._id !== id)
      );
    } catch (err) {
      setError('Failed to delete student');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 650) {
      setSidebarOpen(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['student', 'faculty'] },
    { id: 'profile', label: 'My Profile', icon: User, roles: ['student', 'faculty'] },
    { id: 'students', label: 'Students', icon: GraduationCap, roles: ['faculty'] },
    { id: 'faculty', label: 'Faculty', icon: Users, roles: ['faculty'] },
  ];

  const pageTitle = {
    dashboard: 'Dashboard Overview',
    profile: 'My Profile',
    students: 'Students',
    faculty: 'Faculty',
  };

  return (
    <div className="dashboard-layout">
      {sidebarOpen && window.innerWidth <= 650 && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <BookOpen size={21} />
            </div>
            <h2>DoodleBlue</h2>
          </div>

          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        <div className="sidebar-section-label">MAIN MENU</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            if (!item.roles.includes(user?.role)) return null;

            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleTabChange(item.id)}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <ChevronRight className="nav-arrow" size={16} />
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User size={19} />
            </div>
            <div className="user-text">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-link">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1>{pageTitle[activeTab] || 'Dashboard'}</h1>
              <p className="header-subtitle">
                Welcome back, {user?.name || 'User'}
              </p>
            </div>
          </div>

          <div className="header-profile">
            <div className="header-avatar">
              <User size={19} />
            </div>
          </div>
        </header>

        <main className="content-area">
          {error && <div className="error-message">{error}</div>}

          {activeTab === 'dashboard' && (
            <>
              <div className="welcome-banner">
                <div>
                  <span className="welcome-label">WELCOME BACK</span>
                  <h2>Hello, {user?.name}!</h2>
                  <p>
                    Here's what's happening in your dashboard today.
                  </p>
                </div>
                <div className="welcome-icon">
                  <GraduationCap size={58} />
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Overview</h2>
                  <p>Your account summary</p>
                </div>
              </div>

              <div className="stats-grid">
                {user?.role === 'faculty' ? (
                  <>
                    <div className="stat-card">
                      <div className="stat-icon students-icon">
                        <Users size={25} />
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Total Students</p>
                        <p className="stat-value">{students.length}</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon faculty-icon">
                        <GraduationCap size={25} />
                      </div>
                      <div className="stat-info">
                        <p className="stat-label">Total Faculty</p>
                        <p className="stat-value">{faculty.length}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="stat-card student-welcome-card">
                    <div className="stat-icon students-icon">
                      <User size={25} />
                    </div>
                    <div className="stat-info">
                      <p className="stat-label">Account Type</p>
                      <p className="student-role-value">Student</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'profile' && (
            <div className="content-card">
              <div className="card-heading">
                <div>
                  <h2>Personal Information</h2>
                  <p>Your registered account details</p>
                </div>
                <div className="profile-large-avatar">
                  <User size={30} />
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-row">
                  <label>Full Name</label>
                  <span>{user?.name}</span>
                </div>
                <div className="detail-row">
                  <label>Email Address</label>
                  <span>{user?.email}</span>
                </div>
                <div className="detail-row">
                  <label>Account Role</label>
                  <span className="role-badge">{user?.role}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="content-card">
              <div className="card-heading">
                <div>
                  <h2>Students Directory</h2>
                  <p>Manage registered student accounts</p>
                </div>
                <span className="count-badge">{students.length} Students</span>
              </div>

              {loading ? (
                <div className="loading">Loading students...</div>
              ) : students.length === 0 ? (
                <div className="empty-state">
                  <GraduationCap size={38} />
                  <h3>No students found</h3>
                  <p>There are no registered students to display.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>
                            <span className="role-badge">{student.role}</span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteStudent(student._id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'faculty' && (
            <div className="content-card">
              <div className="card-heading">
                <div>
                  <h2>Faculty Directory</h2>
                  <p>View registered faculty accounts</p>
                </div>
                <span className="count-badge">{faculty.length} Faculty</span>
              </div>

              {loading ? (
                <div className="loading">Loading faculty...</div>
              ) : faculty.length === 0 ? (
                <div className="empty-state">
                  <Users size={38} />
                  <h3>No faculty found</h3>
                  <p>There are no registered faculty members to display.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faculty.map((fac) => (
                        <tr key={fac._id}>
                          <td>{fac.name}</td>
                          <td>{fac.email}</td>
                          <td>
                            <span className="role-badge">{fac.role}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;