import { useEffect, useMemo, useState } from "react";
import "./App.css";

/* =========================
   ADMIN LOGIN
========================= */

const ADMIN_ID = "admin";
const ADMIN_PASSWORD = "admin123";

/* =========================
   SAMPLE STUDENTS
========================= */

const initialStudents = [
  {
    id: 1,
    name: "Charles Estacio",
    course: "BSIT",
    grade: 95.67,
  },
  {
    id: 2,
    name: "Zeus Laron",
    course: "BSIT",
    grade: 94.82,
  },
  {
    id: 3,
    name: "Ian Ballesteros",
    course: "BSIT",
    grade: 93.45,
  },
  {
    id: 4,
    name: "Clarisse Mendoza",
    course: "BSHM",
    grade: 91.2,
  },
  {
    id: 5,
    name: "Abigail Santos",
    course: "Tourism",
    grade: 89.75,
  },
  {
    id: 6,
    name: "Claire Reyes",
    course: "BSCRIM",
    grade: 88.9,
  },
  {
    id: 7,
    name: "Mark Anthony Cruz",
    course: "BSBA",
    grade: 87.8,
  },
  {
    id: 8,
    name: "Sofia Garcia",
    course: "BSED",
    grade: 86.95,
  },
];

/* =========================
   SAMPLE PROFESSORS
========================= */

const initialProfessors = [
  {
    id: 1,
    name: "Ivan Jade Surat",
    department: "Information Technology",
    courses: "BSIT",
    email: "ivanjade@school.edu",
  },
  {
    id: 2,
    name: "Prof. John Reyes",
    department: "Business Administration",
    courses: "BSBA",
    email: "john.reyes@school.edu",
  },
  {
    id: 3,
    name: "Prof. Angela Cruz",
    department: "Hospitality Management",
    courses: "BSHM",
    email: "angela.cruz@school.edu",
  },
  {
    id: 4,
    name: "Dr. Roberto Garcia",
    department: "Criminology",
    courses: "BSCRIM",
    email: "roberto.garcia@school.edu",
  },
  {
    id: 5,
    name: "Prof. Elena Torres",
    department: "Education",
    courses: "BSED",
    email: "elena.torres@school.edu",
  },
  {
    id: 6,
    name: "Prof. Daniel Mendoza",
    department: "Tourism Management",
    courses: "Tourism",
    email: "daniel.mendoza@school.edu",
  },
];

/* =========================
   HELPERS
========================= */

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatGrade(grade) {
  return Number(grade).toFixed(2);
}

/* =========================
   APP
========================= */

export default function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("rankingStudents");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialStudents;
      }
    }

    return initialStudents;
  });

  const [professors] = useState(() => {
    const saved = localStorage.getItem("rankingProfessors");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProfessors;
      }
    }

    return initialProfessors;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("rankingUser");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }

    return null;
  });

  const [loginMode, setLoginMode] = useState("student");

  const [loginForm, setLoginForm] = useState({
    name: "",
    adminId: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  const [activePage, setActivePage] = useState("rankings");

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [studentForm, setStudentForm] = useState({
    name: "",
    course: "",
    grade: "",
  });

  /* =========================
     SAVE STUDENTS
  ========================= */

  useEffect(() => {
    localStorage.setItem("rankingStudents", JSON.stringify(students));
  }, [students]);

  /* =========================
     SAVE PROFESSORS
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "rankingProfessors",
      JSON.stringify(professors)
    );
  }, [professors]);

  /* =========================
     COURSES
  ========================= */

  const courses = useMemo(() => {
    return [
      "All Courses",
      ...Array.from(new Set(students.map((student) => student.course))),
    ];
  }, [students]);

  /* =========================
     RANKING
  ========================= */

  const rankedStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch = student.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesCourse =
          courseFilter === "All Courses" ||
          student.course === courseFilter;

        return matchesSearch && matchesCourse;
      })
      .sort((a, b) => Number(b.grade) - Number(a.grade))
      .map((student, index) => ({
        ...student,
        rank: index + 1,
      }));
  }, [students, search, courseFilter]);

  const topThree = rankedStudents.slice(0, 3);
  const remainingStudents = rankedStudents.slice(3);

  /* =========================
     LOGIN
  ========================= */

  function handleLogin(e) {
    e.preventDefault();

    setLoginError("");

    if (loginMode === "admin") {
      if (
        loginForm.adminId.trim() === ADMIN_ID &&
        loginForm.password === ADMIN_PASSWORD
      ) {
        const adminUser = {
          role: "admin",
          name: "Administrator",
        };

        setUser(adminUser);
        localStorage.setItem("rankingUser", JSON.stringify(adminUser));
        setActivePage("rankings");
        return;
      }

      setLoginError("Incorrect admin ID or password.");
      return;
    }

    if (!loginForm.name.trim()) {
      setLoginError("Please enter your name.");
      return;
    }

    const studentUser = {
      role: "student",
      name: loginForm.name.trim(),
    };

    setUser(studentUser);
    localStorage.setItem("rankingUser", JSON.stringify(studentUser));
    setActivePage("rankings");
  }

  /* =========================
     LOGOUT
  ========================= */

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("rankingUser");

    setLoginForm({
      name: "",
      adminId: "",
      password: "",
    });

    setLoginError("");
    setSearch("");
    setCourseFilter("All Courses");
    setActivePage("rankings");
  }

  /* =========================
     OPEN ADD MODAL
  ========================= */

  function openAddStudent() {
    setEditingStudent(null);

    setStudentForm({
      name: "",
      course: "",
      grade: "",
    });

    setModalOpen(true);
  }

  /* =========================
     OPEN EDIT MODAL
  ========================= */

  function openEditStudent(student) {
    setEditingStudent(student);

    setStudentForm({
      name: student.name,
      course: student.course,
      grade: student.grade,
    });

    setModalOpen(true);
  }

  /* =========================
     SAVE STUDENT
  ========================= */

  function handleSaveStudent(e) {
    e.preventDefault();

    if (
      !studentForm.name.trim() ||
      !studentForm.course.trim() ||
      studentForm.grade === ""
    ) {
      return;
    }

    const grade = Number(studentForm.grade);

    if (grade < 0 || grade > 100) {
      alert("Grade must be between 0 and 100.");
      return;
    }

    if (editingStudent) {
      setStudents((current) =>
        current.map((student) =>
          student.id === editingStudent.id
            ? {
                ...student,
                name: studentForm.name.trim(),
                course: studentForm.course.trim(),
                grade,
              }
            : student
        )
      );
    } else {
      const newStudent = {
        id: Date.now(),
        name: studentForm.name.trim(),
        course: studentForm.course.trim(),
        grade,
      };

      setStudents((current) => [...current, newStudent]);
    }

    setModalOpen(false);
  }

  /* =========================
     DELETE STUDENT
  ========================= */

  function deleteStudent(id) {
    const student = students.find((item) => item.id === id);

    if (!student) return;

    const confirmed = window.confirm(
      `Delete ${student.name} from the rankings?`
    );

    if (!confirmed) return;

    setStudents((current) =>
      current.filter((student) => student.id !== id)
    );
  }

  /* =========================
     LOGIN SCREEN
  ========================= */

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-background-circle circle-one"></div>
        <div className="login-background-circle circle-two"></div>

        <div className="login-container">
          <div className="login-brand">
            <div className="brand-logo">
              <span>R</span>
            </div>

            <div>
              <h1>PCLU RANKINGS</h1>
              <p>Academic Ranking System</p>
            </div>
          </div>

          <div className="login-card">
            <div className="login-heading">
              <h2>Welcome Back</h2>
              <p>
                Sign in to access the academic ranking system.
              </p>
            </div>

            <div className="login-tabs">
              <button
                type="button"
                className={
                  loginMode === "student" ? "active" : ""
                }
                onClick={() => {
                  setLoginMode("student");
                  setLoginError("");
                }}
              >
                <span>🎓</span>
                Student
              </button>

              <button
                type="button"
                className={
                  loginMode === "admin" ? "active" : ""
                }
                onClick={() => {
                  setLoginMode("admin");
                  setLoginError("");
                }}
              >
                <span>🔐</span>
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin}>
              {loginMode === "student" ? (
                <>
                  <label>Your Name</label>

                  <div className="input-wrapper">
                    <span>👤</span>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={loginForm.name}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <label>Admin ID</label>

                  <div className="input-wrapper">
                    <span>👤</span>

                    <input
                      type="text"
                      placeholder="Enter admin ID"
                      value={loginForm.adminId}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          adminId: e.target.value,
                        })
                      }
                    />

                  </div>

                  <label>Password</label>

                  <div className="input-wrapper">
                    <span>🔒</span>

                    <input
                      type="password"
                      placeholder="Enter password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {loginError && (
                <div className="login-error">
                  ⚠ {loginError}
                </div>
              )}

              <button className="login-button" type="submit">
                Continue
                <span>→</span>
              </button>
            </form>

            <div className="login-footer">
              <span>🔒</span>
              Secure academic ranking access
            </div>
          </div>

          <p className="copyright">
            © 2026 PCLU • Academic Ranking System
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN APPLICATION
  ========================= */

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <div className="app-logo">
            <span>R</span>
          </div>

          <div>
            <h1>PCLU RANKINGS</h1>
            <p>Academic Ranking System</p>
          </div>
        </div>

        <div className="topbar-right">
          <div className="logged-user">
            <div className="avatar">
              {getInitials(user.name)}
            </div>

            <div className="logged-user-info">
              <strong>{user.name}</strong>
              <span>
                {user.role === "admin"
                  ? "Administrator"
                  : "Student"}
              </span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="page-navigation">
          <button
            className={
              activePage === "rankings"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("rankings")}
          >
            <span>🏆</span>
            Rankings
          </button>

          <button
            className={
              activePage === "professors"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("professors")}
          >
            <span>👨‍🏫</span>
            Professors
          </button>
        </div>

        {activePage === "rankings" ? (
          <>
            {/* =========================
                RANKING HEADER
            ========================= */}

            <section className="page-header">
              <div>
                <span className="section-label">
                  ACADEMIC PERFORMANCE
                </span>

                <h2>Overall Rankings</h2>

                <p>
                  View the highest-performing students based
                  on their overall grade.
                </p>
              </div>

              {user.role === "admin" && (
                <button
                  className="primary-button"
                  onClick={openAddStudent}
                >
                  <span>＋</span>
                  Add Student
                </button>
              )}
            </section>

            {/* =========================
                STAT CARDS
            ========================= */}

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon purple">👥</div>

                <div>
                  <span>Total Students</span>
                  <strong>{students.length}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon gold">🏆</div>

                <div>
                  <span>Highest Grade</span>
                  <strong>
                    {students.length
                      ? formatGrade(
                          Math.max(
                            ...students.map((s) =>
                              Number(s.grade)
                            )
                          )
                        )
                      : "0.00"}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">🎓</div>

                <div>
                  <span>Courses</span>
                  <strong>{courses.length - 1}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">⭐</div>

                <div>
                  <span>Top Student</span>
                  <strong className="small-stat">
                    {students.length
                      ? [...students].sort(
                          (a, b) =>
                            Number(b.grade) -
                            Number(a.grade)
                        )[0].name
                      : "None"}
                  </strong>
                </div>
              </div>
            </section>

            {/* =========================
                SEARCH / FILTER
            ========================= */}

            <section className="controls-card">
              <div className="search-box">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search student name..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              <select
                value={courseFilter}
                onChange={(e) =>
                  setCourseFilter(e.target.value)
                }
              >
                {courses.map((course) => (
                  <option key={course}>{course}</option>
                ))}
              </select>
            </section>

            {/* =========================
                PODIUM
            ========================= */}

            {topThree.length > 0 && (
              <section className="podium-section">
                <div className="section-title">
                  <div>
                    <span className="section-label">
                      LEADING PERFORMERS
                    </span>

                    <h3>Top Students</h3>
                  </div>
                </div>

                <div className="podium">
                  {topThree[1] && (
                    <PodiumCard
                      student={topThree[1]}
                      position={2}
                    />
                  )}

                  {topThree[0] && (
                    <PodiumCard
                      student={topThree[0]}
                      position={1}
                    />
                  )}

                  {topThree[2] && (
                    <PodiumCard
                      student={topThree[2]}
                      position={3}
                    />
                  )}
                </div>
              </section>
            )}

            {/* =========================
                RANKING TABLE
            ========================= */}

            <section className="ranking-card">
              <div className="ranking-card-header">
                <div>
                  <span className="section-label">
                    COMPLETE LIST
                  </span>

                  <h3>Student Rankings</h3>
                </div>

                <span className="result-count">
                  {rankedStudents.length} student
                  {rankedStudents.length !== 1 ? "s" : ""}
                </span>
              </div>

              {rankedStudents.length === 0 ? (
                <div className="empty-state">
                  <div>🔍</div>
                  <h3>No students found</h3>
                  <p>
                    Try changing your search or course filter.
                  </p>
                </div>
              ) : (
                <div className="ranking-list">
                  {remainingStudents.map((student) => (
                    <RankingRow
                      key={student.id}
                      student={student}
                      user={user}
                      onEdit={openEditStudent}
                      onDelete={deleteStudent}
                    />
                  ))}

                  {rankedStudents.length <= 3 &&
                    topThree.map((student) => (
                      <RankingRow
                        key={`top-${student.id}`}
                        student={student}
                        user={user}
                        onEdit={openEditStudent}
                        onDelete={deleteStudent}
                      />
                    ))}
                </div>
              )}
            </section>
          </>
        ) : (
          /* =========================
             PROFESSORS
          ========================= */

          <section className="professor-page">
            <div className="page-header">
              <div>
                <span className="section-label">
                  SCHOOL DIRECTORY
                </span>

                <h2>Our Professors</h2>

                <p>
                  View the professors and faculty members
                  from different courses.
                </p>
              </div>
            </div>

            <div className="professor-intro">
              <div className="professor-intro-icon">
                👨‍🏫
              </div>

              <div>
                <h3>Faculty Directory</h3>

                <p>
                  Meet the faculty members supporting our
                  students across different academic programs.
                </p>
              </div>
            </div>

            <div className="professor-grid">
              {professors.map((professor) => (
                <div
                  className="professor-card"
                  key={professor.id}
                >
                  <div className="professor-top">
                    <div className="professor-avatar">
                      {getInitials(professor.name)}
                    </div>

                    <span className="course-badge">
                      {professor.courses}
                    </span>
                  </div>

                  <h3>{professor.name}</h3>

                  <p className="professor-department">
                    {professor.department}
                  </p>

                  <div className="professor-email">
                    <span>✉</span>
                    {professor.email}
                  </div>

                  <div className="professor-course">
                    <span>🎓</span>
                    {professor.courses}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {modalOpen && user.role === "admin" && (
        <div
          className="modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="section-label">
                  {editingStudent ? "UPDATE" : "NEW ENTRY"}
                </span>

                <h2>
                  {editingStudent
                    ? "Edit Student"
                    : "Add Student"}
                </h2>
              </div>

              <button
                className="close-button"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveStudent}>
              <label>Student Name</label>

              <input
                type="text"
                placeholder="Enter student name"
                value={studentForm.name}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    name: e.target.value,
                  })
                }
              />

              <label>Course</label>

              <input
                type="text"
                placeholder="e.g. BSIT"
                value={studentForm.course}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    course: e.target.value,
                  })
                }
              />

              <label>Overall Grade</label>

              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Enter grade"
                value={studentForm.grade}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    grade: e.target.value,
                  })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingStudent
                    ? "Save Changes"
                    : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   PODIUM CARD
========================= */

function PodiumCard({ student, position }) {
  const positionClass =
    position === 1
      ? "first"
      : position === 2
      ? "second"
      : "third";

  const medal =
    position === 1
      ? "🥇"
      : position === 2
      ? "🥈"
      : "🥉";

  return (
    <div className={`podium-card ${positionClass}`}>
      <div className="medal">{medal}</div>

      <div className="podium-avatar">
        {getInitials(student.name)}
      </div>

      <h3>{student.name}</h3>

      <span className="podium-course">
        {student.course}
      </span>

      <strong className="podium-grade">
        {formatGrade(student.grade)}
      </strong>

      <span className="podium-label">
        Overall Grade
      </span>

      <div className="rank-number">
        #{position}
      </div>
    </div>
  );
}

/* =========================
   RANKING ROW
========================= */

function RankingRow({
  student,
  user,
  onEdit,
  onDelete,
}) {
  return (
    <div className="ranking-row">
      <div className="rank-number-small">
        #{student.rank}
      </div>

      <div className="student-avatar">
        {getInitials(student.name)}
      </div>

      <div className="student-info">
        <strong>{student.name}</strong>
        <span>{student.course}</span>
      </div>

      <div className="grade-area">
        <strong>{formatGrade(student.grade)}</strong>
        <span>Overall</span>
      </div>

      {user.role === "admin" && (
        <div className="row-actions">
          <button
            className="edit-button"
            onClick={() => onEdit(student)}
          >
            Edit
          </button>

          <button
            className="delete-button"
            onClick={() => onDelete(student.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}