import { useEffect, useMemo, useState } from "react";
import "./App.css";

const ADMIN_ID = "admin";
const ADMIN_PASSWORD = "admin123";

const initialStudents = [
  {
    id: 1,
    name: "Charles Estacio",
    course: "BSIT",
    photo: "",
    subjects: [
      { name: "Web Development", grade: 96.2 },
      { name: "Database Management", grade: 95.14 },
    ],
  },
  {
    id: 2,
    name: "Zeus Laron",
    course: "BSIT",
    photo: "",
    subjects: [
      { name: "Web Development", grade: 95.1 },
      { name: "Database Management", grade: 94.54 },
    ],
  },
  {
    id: 3,
    name: "Ian Ballesteros",
    course: "BSIT",
    photo: "",
    subjects: [
      { name: "Programming", grade: 93.9 },
      { name: "Networking", grade: 93 },
    ],
  },
  {
    id: 4,
    name: "Clarisse Mendoza",
    course: "BSHM",
    photo: "",
    subjects: [
      { name: "Food Service Management", grade: 92 },
      { name: "Hospitality Operations", grade: 90.4 },
    ],
  },
  {
    id: 5,
    name: "Abigail Santos",
    course: "Tourism",
    photo: "",
    subjects: [
      { name: "Tourism Management", grade: 90.25 },
      { name: "Travel Operations", grade: 89.25 },
    ],
  },
  {
    id: 6,
    name: "Clara Reyes",
    course: "BSCRIM",
    photo: "",
    subjects: [
      { name: "Criminal Law", grade: 89.3 },
      { name: "Criminology", grade: 88.5 },
    ],
  },
  {
    id: 7,
    name: "Mark Anthony Cruz",
    course: "BSBA",
    photo: "",
    subjects: [
      { name: "Business Management", grade: 88.2 },
      { name: "Marketing", grade: 87.4 },
    ],
  },
  {
    id: 8,
    name: "Sofia Garcia",
    course: "BSED",
    photo: "",
    subjects: [
      { name: "Teaching Profession", grade: 87.6 },
      { name: "Educational Psychology", grade: 86.3 },
    ],
  },
];

const initialProfessors = [
  {
    id: 1,
    name: "Dr. Maria Santos",
    department: "Information Technology",
    course: "BSIT",
    email: "maria.santos@school.edu",
  },
  {
    id: 2,
    name: "Prof. John Reyes",
    department: "Business Administration",
    course: "BSBA",
    email: "john.reyes@school.edu",
  },
  {
    id: 3,
    name: "Prof. Angela Cruz",
    department: "Hospitality Management",
    course: "BSHM",
    email: "angela.cruz@school.edu",
  },
  {
    id: 4,
    name: "Dr. Roberto Garcia",
    department: "Criminology",
    course: "BSCRIM",
    email: "roberto.garcia@school.edu",
  },
  {
    id: 5,
    name: "Prof. Elena Torres",
    department: "Education",
    course: "BSED",
    email: "elena.torres@school.edu",
  },
  {
    id: 6,
    name: "Prof. Daniel Mendoza",
    department: "Tourism Management",
    course: "Tourism",
    email: "daniel.mendoza@school.edu",
  },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function calculateAverage(subjects = []) {
  const validSubjects = subjects.filter(
    (subject) =>
      subject.name?.trim() !== "" &&
      subject.grade !== "" &&
      !Number.isNaN(Number(subject.grade))
  );

  if (!validSubjects.length) return 0;

  const total = validSubjects.reduce(
    (sum, subject) => sum + Number(subject.grade),
    0
  );

  return total / validSubjects.length;
}

function formatGrade(value) {
  return Number(value || 0).toFixed(2);
}

function normalizeStudent(student) {
  if (Array.isArray(student.subjects)) {
    return {
      ...student,
      subjects: student.subjects.map((subject) => ({
        name: subject.name || "",
        grade:
          subject.grade === "" || subject.grade === undefined
            ? ""
            : Number(subject.grade),
      })),
    };
  }

  // Supports students from the previous version of the app.
  return {
    ...student,
    photo: student.photo || "",
    subjects: [],
  };
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const maxSize = 500;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width / height) * maxSize;
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };

      img.onerror = reject;
      img.src = event.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Avatar({ student, size = "medium" }) {
  return (
    <div className={`avatar avatar-${size}`}>
      {student.photo ? (
        <img src={student.photo} alt={student.name} />
      ) : (
        <span>{getInitials(student.name)}</span>
      )}
    </div>
  );
}

function PodiumCard({ student, position, onClick }) {
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <button
      className={`podium-card podium-${position}`}
      onClick={() => onClick(student)}
    >
      <div className="podium-medal">{medals[position - 1]}</div>

      <Avatar student={student} size="large" />

      <div className="podium-rank">#{position}</div>

      <h3>{student.name}</h3>
      <span>{student.course}</span>

      <strong>{formatGrade(calculateAverage(student.subjects))}</strong>

      <small>Click to view grades</small>
    </button>
  );
}

function RankingRow({
  student,
  onClick,
  isAdmin,
  onEdit,
  onDelete,
}) {
  const average = calculateAverage(student.subjects);

  return (
    <div
      className="ranking-row"
      onClick={() => onClick(student)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") onClick(student);
      }}
    >
      <div className="rank-number">#{student.rank}</div>

      <Avatar student={student} />

      <div className="student-info">
        <strong>{student.name}</strong>
        <span>{student.course}</span>
      </div>

      <div className="subject-count">
        <span>{student.subjects.length}</span>
        <small>Subjects</small>
      </div>

      <div className="average-score">
        <strong>{formatGrade(average)}</strong>
        <span>Overall</span>
      </div>

      {isAdmin && (
        <div
          className="row-actions"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            className="icon-button edit"
            onClick={() => onEdit(student)}
            title="Edit student"
          >
            ✏️
          </button>

          <button
            className="icon-button delete"
            onClick={() => onDelete(student.id)}
            title="Delete student"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("rankingStudentsV2");

    if (saved) {
      try {
        return JSON.parse(saved).map(normalizeStudent);
      } catch {
        return initialStudents;
      }
    }

    return initialStudents;
  });

  const [professors, setProfessors] = useState(() => {
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
  const [courseFilter, setCourseFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [detailsStudent, setDetailsStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const [studentForm, setStudentForm] = useState({
    name: "",
    course: "",
    photo: "",
    subjects: [{ name: "", grade: "" }],
  });

  useEffect(() => {
    localStorage.setItem("rankingStudentsV2", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("rankingProfessors", JSON.stringify(professors));
  }, [professors]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("rankingUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("rankingUser");
    }
  }, [user]);

  const courses = useMemo(() => {
    return [...new Set(students.map((student) => student.course))].sort();
  }, [students]);

  const rankedStudents = useMemo(() => {
    return students
      .filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter(
        (student) =>
          courseFilter === "All" || student.course === courseFilter
      )
      .sort(
        (a, b) =>
          calculateAverage(b.subjects) - calculateAverage(a.subjects)
      )
      .map((student, index) => ({
        ...student,
        rank: index + 1,
      }));
  }, [students, search, courseFilter]);

  const topThree = rankedStudents.slice(0, 3);

  const remainingStudents = rankedStudents.slice(3);

  const overallAverage = useMemo(() => {
    if (!students.length) return 0;

    const total = students.reduce(
      (sum, student) => sum + calculateAverage(student.subjects),
      0
    );

    return total / students.length;
  }, [students]);

  function handleLogin(event) {
    event.preventDefault();
    setLoginError("");

    if (loginMode === "admin") {
      if (
        loginForm.adminId === ADMIN_ID &&
        loginForm.password === ADMIN_PASSWORD
      ) {
        setUser({
          role: "admin",
          name: "Administrator",
        });
        return;
      }

      setLoginError("Invalid administrator ID or password.");
      return;
    }

    if (!loginForm.name.trim()) {
      setLoginError("Please enter your name.");
      return;
    }

    setUser({
      role: "student",
      name: loginForm.name.trim(),
    });
  }

  function handleLogout() {
    setUser(null);
    setActivePage("rankings");
    setLoginForm({
      name: "",
      adminId: "",
      password: "",
    });
  }

  function openAddStudent() {
    setEditingStudent(null);

    setStudentForm({
      name: "",
      course: "",
      photo: "",
      subjects: [{ name: "", grade: "" }],
    });

    setModalOpen(true);
  }

  function openEditStudent(student) {
    setEditingStudent(student);

    setStudentForm({
      name: student.name,
      course: student.course,
      photo: student.photo || "",
      subjects:
        student.subjects.length > 0
          ? student.subjects.map((subject) => ({
              name: subject.name,
              grade: subject.grade,
            }))
          : [{ name: "", grade: "" }],
    });

    setModalOpen(true);
  }

  function closeStudentModal() {
    setModalOpen(false);
    setEditingStudent(null);
  }

  function addSubject() {
    setStudentForm((previous) => ({
      ...previous,
      subjects: [
        ...previous.subjects,
        {
          name: "",
          grade: "",
        },
      ],
    }));
  }

  function removeSubject(index) {
    setStudentForm((previous) => {
      if (previous.subjects.length === 1) return previous;

      return {
        ...previous,
        subjects: previous.subjects.filter((_, subjectIndex) => {
          return subjectIndex !== index;
        }),
      };
    });
  }

  function updateSubject(index, field, value) {
    setStudentForm((previous) => ({
      ...previous,
      subjects: previous.subjects.map((subject, subjectIndex) =>
        subjectIndex === index
          ? {
              ...subject,
              [field]: value,
            }
          : subject
      ),
    }));
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    try {
      const compressed = await compressImage(file);

      setStudentForm((previous) => ({
        ...previous,
        photo: compressed,
      }));
    } catch {
      alert("Unable to process the selected image.");
    }
  }

  function handleSaveStudent(event) {
    event.preventDefault();

    const name = studentForm.name.trim();
    const course = studentForm.course.trim();

    const cleanedSubjects = studentForm.subjects
      .map((subject) => ({
        name: subject.name.trim(),
        grade: Number(subject.grade),
      }))
      .filter((subject) => subject.name !== "");

    if (!name || !course) {
      alert("Please enter the student's name and course.");
      return;
    }

    if (!cleanedSubjects.length) {
      alert("Please add at least one subject.");
      return;
    }

    const invalidGrade = cleanedSubjects.some(
      (subject) =>
        Number.isNaN(subject.grade) ||
        subject.grade < 0 ||
        subject.grade > 100
    );

    if (invalidGrade) {
      alert("Grades must be between 0 and 100.");
      return;
    }

    const studentData = {
      name,
      course,
      photo: studentForm.photo,
      subjects: cleanedSubjects,
    };

    if (editingStudent) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === editingStudent.id
            ? {
                ...student,
                ...studentData,
              }
            : student
        )
      );
    } else {
      setStudents((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...studentData,
        },
      ]);
    }

    closeStudentModal();
  }

  function deleteStudent(id) {
    const student = students.find((item) => item.id === id);

    if (!student) return;

    const confirmed = window.confirm(
      `Delete ${student.name} from the ranking?`
    );

    if (!confirmed) return;

    setStudents((previous) =>
      previous.filter((studentItem) => studentItem.id !== id)
    );

    if (detailsStudent?.id === id) {
      setDetailsStudent(null);
    }
  }

  function resetSampleData() {
    const confirmed = window.confirm(
      "Reset the ranking to the sample student data?"
    );

    if (!confirmed) return;

    setStudents(initialStudents);
    setSearch("");
    setCourseFilter("All");
  }

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-decoration decoration-one"></div>
        <div className="login-decoration decoration-two"></div>

        <div className="login-card">
          <div className="brand-logo">
            <div className="brand-icon">R</div>
            <span>Rankly</span>
          </div>

          <div className="login-heading">
            <p className="eyebrow">OVERALL RANKING SYSTEM</p>
            <h1>Welcome back.</h1>
            <p>
              View student rankings, subject performance, and academic
              standings in one place.
            </p>
          </div>

          <div className="login-tabs">
            <button
              className={loginMode === "student" ? "active" : ""}
              onClick={() => {
                setLoginMode("student");
                setLoginError("");
              }}
            >
              Student
            </button>

            <button
              className={loginMode === "admin" ? "active" : ""}
              onClick={() => {
                setLoginMode("admin");
                setLoginError("");
              }}
            >
              Administrator
            </button>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {loginMode === "student" ? (
              <>
                <label>Your name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={loginForm.name}
                  onChange={(event) =>
                    setLoginForm({
                      ...loginForm,
                      name: event.target.value,
                    })
                  }
                />
              </>
            ) : (
              <>
                <label>Administrator ID</label>
                <input
                  type="text"
                  placeholder="Enter admin ID"
                  value={loginForm.adminId}
                  onChange={(event) =>
                    setLoginForm({
                      ...loginForm,
                      adminId: event.target.value,
                    })
                  }
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm({
                      ...loginForm,
                      password: event.target.value,
                    })
                  }
                />
              </>
            )}

            {loginError && <div className="login-error">{loginError}</div>}

            <button className="login-button" type="submit">
              Continue
              <span>→</span>
            </button>
          </form>

          {loginMode === "admin" && (
            <div className="login-hint">
              Demo administrator: <strong>admin</strong> /{" "}
              <strong>admin123</strong>
            </div>
          )}

          <div className="login-footer">
            <span>Academic Ranking Platform</span>
            <span>•</span>
            <span>School Presentation</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-icon">R</div>
            <div>
              <strong>Rankly</strong>
              <span>Overall Ranking System</span>
            </div>
          </div>

          <div className="user-area">
            <div className="user-avatar">
              {getInitials(user.name)}
            </div>

            <div className="user-text">
              <strong>{user.name}</strong>
              <span>
                {user.role === "admin" ? "Administrator" : "Student"}
              </span>
            </div>

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="navigation">
        <div className="navigation-inner">
          <button
            className={activePage === "rankings" ? "active" : ""}
            onClick={() => setActivePage("rankings")}
          >
            <span>🏆</span>
            Rankings
          </button>

          <button
            className={activePage === "professors" ? "active" : ""}
            onClick={() => setActivePage("professors")}
          >
            <span>👨‍🏫</span>
            Professors
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activePage === "rankings" ? (
          <>
            <section className="page-header">
              <div>
                <p className="eyebrow">ACADEMIC PERFORMANCE</p>
                <h1>Overall Student Rankings</h1>
                <p>
                  Rankings are automatically calculated from each student's
                  subject grades.
                </p>
              </div>

              {user.role === "admin" && (
                <div className="header-actions">
                  <button
                    className="secondary-button"
                    onClick={resetSampleData}
                  >
                    Reset Sample
                  </button>

                  <button
                    className="primary-button"
                    onClick={openAddStudent}
                  >
                    <span>＋</span>
                    Add Student
                  </button>
                </div>
              )}
            </section>

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
                  <span>Highest Average</span>
                  <strong>
                    {students.length
                      ? formatGrade(
                          Math.max(
                            ...students.map((student) =>
                              calculateAverage(student.subjects)
                            )
                          )
                        )
                      : "0.00"}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">📚</div>
                <div>
                  <span>Courses</span>
                  <strong>{courses.length}</strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">📈</div>
                <div>
                  <span>School Average</span>
                  <strong>{formatGrade(overallAverage)}</strong>
                </div>
              </div>
            </section>

            <section className="ranking-section">
              <div className="section-header">
                <div>
                  <h2>Student Performance</h2>
                  <p>Click a student to view their subject breakdown.</p>
                </div>

                <div className="ranking-controls">
                  <div className="search-box">
                    <span>⌕</span>
                    <input
                      type="text"
                      placeholder="Search student..."
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>

                  <select
                    value={courseFilter}
                    onChange={(event) => setCourseFilter(event.target.value)}
                  >
                    <option value="All">All Courses</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {topThree.length > 0 ? (
                <div className="podium">
                  {topThree[1] && (
                    <PodiumCard
                      student={topThree[1]}
                      position={2}
                      onClick={setDetailsStudent}
                    />
                  )}

                  {topThree[0] && (
                    <PodiumCard
                      student={topThree[0]}
                      position={1}
                      onClick={setDetailsStudent}
                    />
                  )}

                  {topThree[2] && (
                    <PodiumCard
                      student={topThree[2]}
                      position={3}
                      onClick={setDetailsStudent}
                    />
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <div>🔎</div>
                  <h3>No students found</h3>
                  <p>Try changing your search or course filter.</p>
                </div>
              )}

              {remainingStudents.length > 0 && (
                <div className="ranking-list">
                  <div className="list-heading">
                    <span>RANK</span>
                    <span>STUDENT</span>
                    <span>SUBJECTS</span>
                    <span>OVERALL</span>
                    {user.role === "admin" && <span>ACTIONS</span>}
                  </div>

                  {remainingStudents.map((student) => (
                    <RankingRow
                      key={student.id}
                      student={student}
                      onClick={setDetailsStudent}
                      isAdmin={user.role === "admin"}
                      onEdit={openEditStudent}
                      onDelete={deleteStudent}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="professor-page">
            <div className="page-header">
              <div>
                <p className="eyebrow">FACULTY DIRECTORY</p>
                <h1>Professors</h1>
                <p>
                  View the professors associated with each academic program.
                </p>
              </div>
            </div>

            <div className="professor-grid">
              {professors.map((professor) => (
                <article className="professor-card" key={professor.id}>
                  <div className="professor-avatar">
                    {getInitials(professor.name)}
                  </div>

                  <div className="professor-info">
                    <span className="professor-course">
                      {professor.course}
                    </span>

                    <h3>{professor.name}</h3>

                    <p>{professor.department}</p>

                    <a href={`mailto:${professor.email}`}>
                      ✉ {professor.email}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {detailsStudent && (
        <div
          className="modal-overlay"
          onClick={() => setDetailsStudent(null)}
        >
          <div
            className="details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setDetailsStudent(null)}
            >
              ×
            </button>

            <div className="profile-header">
              <Avatar student={detailsStudent} size="profile" />

              <div>
                <span className="profile-course">
                  {detailsStudent.course}
                </span>
                <h2>{detailsStudent.name}</h2>
                <p>Student Academic Profile</p>
              </div>
            </div>

            <div className="overall-card">
              <div>
                <span>Overall Average</span>
                <small>
                  Based on {detailsStudent.subjects.length} subject
                  {detailsStudent.subjects.length !== 1 ? "s" : ""}
                </small>
              </div>

              <strong>
                {formatGrade(
                  calculateAverage(detailsStudent.subjects)
                )}
              </strong>
            </div>

            {detailsStudent.subjects.length > 0 ? (
              <>
                <div className="modal-section-title">
                  <div>
                    <h3>Subject Breakdown</h3>
                    <p>Individual subject grades used to calculate the average.</p>
                  </div>
                </div>

                <div className="subject-list">
                  {detailsStudent.subjects.map((subject, index) => (
                    <div className="subject-row" key={`${subject.name}-${index}`}>
                      <div className="subject-number">
                        {index + 1}
                      </div>

                      <div className="subject-name">
                        <strong>{subject.name}</strong>
                        <span>Subject Grade</span>
                      </div>

                      <strong className="subject-grade">
                        {formatGrade(subject.grade)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="calculation-box">
                  <span>CALCULATION</span>

                  <p>
                    (
                    {detailsStudent.subjects
                      .map((subject) => formatGrade(subject.grade))
                      .join(" + ")}
                    ) ÷ {detailsStudent.subjects.length} ={" "}
                    <strong>
                      {formatGrade(
                        calculateAverage(detailsStudent.subjects)
                      )}
                    </strong>
                  </p>
                </div>
              </>
            ) : (
              <div className="legacy-message">
                <div>ℹ️</div>
                <div>
                  <strong>Subject breakdown unavailable</strong>
                  <p>
                    This student came from an older version of the system
                    where the overall grade was entered directly. An
                    administrator can edit the student and add subjects.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={closeStudentModal}>
          <div
            className="student-form-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={closeStudentModal}>
              ×
            </button>

            <div className="modal-heading">
              <p className="eyebrow">
                {editingStudent ? "EDIT STUDENT" : "NEW STUDENT"}
              </p>

              <h2>
                {editingStudent
                  ? "Update Student Profile"
                  : "Add Student"}
              </h2>

              <p>
                Add the student's subjects and grades. The overall average
                will be calculated automatically.
              </p>
            </div>

            <form onSubmit={handleSaveStudent}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Student Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Juan Dela Cruz"
                    value={studentForm.name}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
                        name: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Course</label>
                  <input
                    type="text"
                    placeholder="e.g. BSIT"
                    value={studentForm.course}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
                        course: event.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="photo-upload">
                <div className="photo-preview">
                  {studentForm.photo ? (
                    <img
                      src={studentForm.photo}
                      alt="Student preview"
                    />
                  ) : (
                    <span>
                      {getInitials(studentForm.name) || "?"}
                    </span>
                  )}
                </div>

                <div>
                  <label className="upload-label">
                    Student Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>

                  <small>
                    JPG or PNG. The image will automatically be resized.
                  </small>
                </div>
              </div>

              <div className="subjects-heading">
                <div>
                  <h3>Subject Grades</h3>
                  <p>
                    Add every subject that should be included in the overall
                    average.
                  </p>
                </div>

                <button
                  type="button"
                  className="add-subject-button"
                  onClick={addSubject}
                >
                  ＋ Add Subject
                </button>
              </div>

              <div className="subjects-form">
                {studentForm.subjects.map((subject, index) => (
                  <div className="subject-input-row" key={index}>
                    <div className="subject-index">
                      {index + 1}
                    </div>

                    <input
                      type="text"
                      placeholder="Subject name"
                      value={subject.name}
                      onChange={(event) =>
                        updateSubject(
                          index,
                          "name",
                          event.target.value
                        )
                      }
                    />

                    <input
                      className="grade-input"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="Grade"
                      value={subject.grade}
                      onChange={(event) =>
                        updateSubject(
                          index,
                          "grade",
                          event.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="remove-subject"
                      onClick={() => removeSubject(index)}
                      disabled={studentForm.subjects.length === 1}
                      title="Remove subject"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="live-average">
                <span>Calculated Overall Average</span>
                <strong>
                  {formatGrade(
                    calculateAverage(studentForm.subjects)
                  )}
                </strong>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeStudentModal}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingStudent ? "Save Changes" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;