// VTU Result Analyzer - Core Application Engine

let currentDatasetKey = 'cse7';
let currentData = null;
let analyzedData = null;
let currentFilter = 'all'; // 'all', 'toppers', 'fcd', 'fc', 'sc', 'fail'
let searchQuery = '';
let charts = {};
let activeAddTab = 'form';
let lastAddedUsn = null;

// VTU Grading Scale & Rules
function calculateGrade(total, cie, see, maxTotal = 100, maxSee = 50, maxCie = 50, isAbsent = false) {
  if (isAbsent) return { grade: 'F (AB)', points: 0, status: 'Fail', reason: 'Absent in SEE' };
  
  // VTU minimum passing criteria
  const minCie = maxCie * 0.40; // 20 for 50 max
  const minSee = maxSee * 0.35; // 18 for 50 max
  const minTotal = maxTotal * 0.40; // 40 for 100 max

  if (cie < minCie) {
    return { grade: 'F', points: 0, status: 'Fail', reason: `CIE < ${minCie}` };
  }
  if (maxSee > 0 && see < minSee) {
    return { grade: 'F', points: 0, status: 'Fail', reason: `SEE < ${minSee}` };
  }
  if (total < minTotal) {
    return { grade: 'F', points: 0, status: 'Fail', reason: `Total < ${minTotal}` };
  }

  const pct = (total / maxTotal) * 100;
  if (pct >= 90) return { grade: 'O', points: 10, status: 'Pass' };
  if (pct >= 80) return { grade: 'A+', points: 9, status: 'Pass' };
  if (pct >= 70) return { grade: 'A', points: 8, status: 'Pass' };
  if (pct >= 60) return { grade: 'B+', points: 7, status: 'Pass' };
  if (pct >= 55) return { grade: 'B', points: 6, status: 'Pass' };
  if (pct >= 50) return { grade: 'C', points: 5, status: 'Pass' };
  if (pct >= 40) return { grade: 'P', points: 4, status: 'Pass' };
  return { grade: 'F', points: 0, status: 'Fail', reason: 'Marks below 40%' };
}

// Compute student level results & SGPA
function analyzeStudent(student, subjects) {
  let totalCredits = 0;
  let earnedCreditPoints = 0;
  let totalMarksObtained = 0;
  let totalMaxMarks = 0;
  let hasBacklog = false;
  let backlogs = [];
  let detailedSubjects = [];

  subjects.forEach(sub => {
    const markEntry = student.marks.find(m => m.code === sub.code) || { cie: 0, see: 0 };
    const maxTotal = sub.maxCie + sub.maxSee;
    const totalMarks = (markEntry.cie || 0) + (markEntry.see || 0);
    const gradeInfo = calculateGrade(
      totalMarks,
      markEntry.cie || 0,
      markEntry.see || 0,
      maxTotal,
      sub.maxSee,
      sub.maxCie,
      markEntry.absent
    );

    const creditPoints = sub.credits * gradeInfo.points;
    totalCredits += sub.credits;
    earnedCreditPoints += creditPoints;
    totalMarksObtained += totalMarks;
    totalMaxMarks += maxTotal;

    if (gradeInfo.status === 'Fail') {
      hasBacklog = true;
      backlogs.push({
        code: sub.code,
        name: sub.name,
        cie: markEntry.cie,
        see: markEntry.see,
        total: totalMarks,
        reason: gradeInfo.reason
      });
    }

    detailedSubjects.push({
      code: sub.code,
      name: sub.name,
      credits: sub.credits,
      cie: markEntry.cie,
      see: markEntry.see,
      total: totalMarks,
      maxTotal,
      grade: gradeInfo.grade,
      gradePoints: gradeInfo.points,
      status: gradeInfo.status,
      reason: gradeInfo.reason
    });
  });

  const sgpa = totalCredits > 0 ? Number((earnedCreditPoints / totalCredits).toFixed(2)) : 0;
  const percentage = totalMaxMarks > 0 ? Number(((totalMarksObtained / totalMaxMarks) * 100).toFixed(2)) : 0;

  // Determine Class
  let awardedClass = '';
  let badgeClass = '';
  if (hasBacklog) {
    awardedClass = 'Fail / Backlog';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
  } else if (sgpa >= 7.75 || percentage >= 70) {
    awardedClass = 'First Class with Distinction';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (sgpa >= 6.75 || percentage >= 60) {
    awardedClass = 'First Class';
    badgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (sgpa >= 5.75 || percentage >= 50) {
    awardedClass = 'Second Class';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
  } else {
    awardedClass = 'Pass Class';
    badgeClass = 'bg-purple-100 text-purple-800 border-purple-300';
  }

  return {
    ...student,
    sgpa,
    percentage,
    totalMarksObtained,
    totalMaxMarks,
    hasBacklog,
    backlogCount: backlogs.length,
    backlogs,
    awardedClass,
    badgeClass,
    detailedSubjects
  };
}

// Full Department Analysis
function runDepartmentAnalysis(dataset) {
  const analyzedStudents = dataset.students.map(s => analyzeStudent(s, dataset.subjects));

  // Sort: Students with zero backlogs first, ordered by SGPA, then Total Marks
  const sortedStudents = [...analyzedStudents].sort((a, b) => {
    if (!a.hasBacklog && b.hasBacklog) return -1;
    if (a.hasBacklog && !b.hasBacklog) return 1;
    if (b.sgpa !== a.sgpa) return b.sgpa - a.sgpa;
    return b.totalMarksObtained - a.totalMarksObtained;
  });

  // Assign overall rank
  sortedStudents.forEach((student, idx) => {
    student.rank = idx + 1;
  });

  // Top 10 Toppers
  const toppers = sortedStudents.filter(s => !s.hasBacklog).slice(0, 10);

  // Classification Categories
  const fcdList = sortedStudents.filter(s => s.awardedClass === 'First Class with Distinction');
  const fcList = sortedStudents.filter(s => s.awardedClass === 'First Class');
  const scList = sortedStudents.filter(s => s.awardedClass === 'Second Class');
  const passClassList = sortedStudents.filter(s => s.awardedClass === 'Pass Class');
  const failList = sortedStudents.filter(s => s.hasBacklog);

  const totalStudents = sortedStudents.length;
  const passedStudents = totalStudents - failList.length;
  const passPercentage = totalStudents > 0 ? Number(((passedStudents / totalStudents) * 100).toFixed(2)) : 0;

  // Department Average SGPA (among passed)
  const avgSgpa = passedStudents > 0
    ? Number((sortedStudents.filter(s => !s.hasBacklog).reduce((acc, s) => acc + s.sgpa, 0) / passedStudents).toFixed(2))
    : 0;

  const highestSgpa = toppers.length > 0 ? toppers[0].sgpa : 0;

  // Subject-wise statistics
  const subjectAnalytics = dataset.subjects.map(sub => {
    let failedCount = 0;
    let totalCie = 0;
    let totalSee = 0;
    let highestTotal = 0;
    let lowestTotal = 999;

    sortedStudents.forEach(st => {
      const mark = st.detailedSubjects.find(m => m.code === sub.code);
      if (mark) {
        if (mark.status === 'Fail') failedCount++;
        totalCie += mark.cie;
        totalSee += mark.see;
        if (mark.total > highestTotal) highestTotal = mark.total;
        if (mark.total < lowestTotal) lowestTotal = mark.total;
      }
    });

    const studentCount = sortedStudents.length;
    const passedCount = studentCount - failedCount;
    const subPassPercentage = studentCount > 0 ? Number(((passedCount / studentCount) * 100).toFixed(1)) : 0;
    const subFailPercentage = studentCount > 0 ? Number(((failedCount / studentCount) * 100).toFixed(1)) : 0;
    const avgCie = studentCount > 0 ? Number((totalCie / studentCount).toFixed(1)) : 0;
    const avgSee = studentCount > 0 ? Number((totalSee / studentCount).toFixed(1)) : 0;

    return {
      code: sub.code,
      name: sub.name,
      credits: sub.credits,
      failedCount,
      passedCount,
      passPercentage: subPassPercentage,
      failPercentage: subFailPercentage,
      avgCie,
      avgSee,
      avgTotal: Number((avgCie + avgSee).toFixed(1)),
      highestTotal,
      lowestTotal: lowestTotal === 999 ? 0 : lowestTotal
    };
  });

  return {
    metadata: {
      department: dataset.department,
      semester: dataset.semester,
      scheme: dataset.scheme,
      college: dataset.college
    },
    subjects: dataset.subjects,
    students: sortedStudents,
    toppers,
    categories: {
      fcd: fcdList,
      fc: fcList,
      sc: scList,
      passClass: passClassList,
      fail: failList
    },
    stats: {
      totalStudents,
      passedStudents,
      passPercentage,
      failCount: failList.length,
      failPercentage: totalStudents > 0 ? Number(((failList.length / totalStudents) * 100).toFixed(2)) : 0,
      fcdCount: fcdList.length,
      fcdPercentage: totalStudents > 0 ? Number(((fcdList.length / totalStudents) * 100).toFixed(2)) : 0,
      fcCount: fcList.length,
      fcPercentage: totalStudents > 0 ? Number(((fcList.length / totalStudents) * 100).toFixed(2)) : 0,
      scCount: scList.length,
      scPercentage: totalStudents > 0 ? Number(((scList.length / totalStudents) * 100).toFixed(2)) : 0,
      avgSgpa,
      highestSgpa
    },
    subjectAnalytics
  };
}

// Add or update a student and place them into Department Rankings
function addStudentToDepartment(newStudent, shouldScroll = true) {
  const normUsn = newStudent.usn.toUpperCase().trim();
  newStudent.usn = normUsn;

  // Check if exists
  const existingIdx = currentData.students.findIndex(s => s.usn === normUsn);
  if (existingIdx >= 0) {
    currentData.students[existingIdx] = newStudent;
  } else {
    currentData.students.push(newStudent);
  }

  lastAddedUsn = normUsn;
  analyzeAndRender();

  // Find newly analyzed student data
  const analyzedStudent = analyzedData.students.find(s => s.usn === normUsn);
  if (!analyzedStudent) return;

  const isTopper = analyzedData.toppers.some(t => t.usn === normUsn);
  const rank = analyzedStudent.rank;
  const sgpa = analyzedStudent.sgpa;
  const awardedClass = analyzedStudent.awardedClass;

  // Show celebration banner
  const banner = document.getElementById('rank-celebration-banner');
  const badge = document.getElementById('celebration-badge');
  const title = document.getElementById('celebration-title');
  const desc = document.getElementById('celebration-desc');
  const icon = document.getElementById('celebration-icon');
  const classEl = document.getElementById('celebration-class');

  banner.classList.remove('hidden');
  classEl.textContent = awardedClass;

  if (rank === 1) {
    icon.textContent = '🥇';
    badge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-amber-950';
    badge.textContent = 'Department Rank 1 Gold!';
    title.textContent = `Incredible! ${analyzedStudent.name} is the #1 Department Topper!`;
    desc.textContent = `Achieved a magnificent ${sgpa} SGPA (${analyzedStudent.percentage}%). Placed on the Center Podium!`;
  } else if (rank === 2) {
    icon.textContent = '🥈';
    badge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-300 text-slate-900';
    badge.textContent = 'Department Rank 2 Silver!';
    title.textContent = `Outstanding! ${analyzedStudent.name} achieved Department Rank #2!`;
    desc.textContent = `Scored ${sgpa} SGPA (${analyzedStudent.percentage}%). Placed on the Silver Podium step!`;
  } else if (rank === 3) {
    icon.textContent = '🥉';
    badge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-600/30 text-amber-900';
    badge.textContent = 'Department Rank 3 Bronze!';
    title.textContent = `Splendid! ${analyzedStudent.name} achieved Department Rank #3!`;
    desc.textContent = `Scored ${sgpa} SGPA (${analyzedStudent.percentage}%). Placed on the Bronze Podium step!`;
  } else if (isTopper) {
    icon.textContent = '🏆';
    badge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-800';
    badge.textContent = `Rank #${rank} Topper`;
    title.textContent = `Congratulations! Placed at Rank #${rank} in the Top 10 Toppers!`;
    desc.textContent = `${analyzedStudent.name} earned ${sgpa} SGPA (${awardedClass}) with zero backlogs.`;
  } else if (!analyzedStudent.hasBacklog) {
    icon.textContent = '🌟';
    badge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800';
    badge.textContent = `Rank #${rank} / ${analyzedData.stats.totalStudents}`;
    title.textContent = `Result Analyzed! Ranked #${rank} in the Department`;
    desc.textContent = `${analyzedStudent.name} secured ${sgpa} SGPA (${awardedClass}) with 100% subjects cleared.`;
  } else {
    icon.textContent = '⚠️';
    badge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800';
    badge.textContent = `${analyzedStudent.backlogCount} Backlog(s)`;
    title.textContent = `Result Analyzed: Backlogs Detected in ${analyzedStudent.backlogs.map(b => b.code).join(', ')}`;
    desc.textContent = `${analyzedStudent.name} requires re-examinations or remedial classes in the highlighted subjects.`;
  }

  // Scroll to toppers or student table
  if (shouldScroll) {
    if (isTopper) {
      document.getElementById('section-toppers').scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('section-student-directory').scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Highlight row in tables
  setTimeout(() => {
    document.querySelectorAll(`[data-usn="${normUsn}"]`).forEach(el => {
      el.classList.add('highlight-new-student');
    });
  }, 300);
}

// Initialize Application
function initApp() {
  currentData = JSON.parse(JSON.stringify(SAMPLE_DATASETS[currentDatasetKey]));
  analyzeAndRender();
  setupEventListeners();
  if (window.lucide) window.lucide.createIcons();
}

function analyzeAndRender() {
  analyzedData = runDepartmentAnalysis(currentData);
  renderHeaderAndMetadata();
  renderKpiCards();
  renderPodiumAndToppers();
  renderStudentTable();
  renderSubjectAnalytics();
  renderCharts();
  renderBacklogAnalysis();
  if (window.lucide) window.lucide.createIcons();
}

// Render Header & Department Metadata
function renderHeaderAndMetadata() {
  document.getElementById('header-dept').textContent = analyzedData.metadata.department;
  document.getElementById('header-sem').textContent = analyzedData.metadata.semester;
  document.getElementById('header-college').textContent = analyzedData.metadata.college;
  document.getElementById('header-scheme').textContent = analyzedData.metadata.scheme;
}

// Render Key Performance Indicators Cards
function renderKpiCards() {
  const s = analyzedData.stats;
  document.getElementById('kpi-total').textContent = s.totalStudents;
  document.getElementById('kpi-pass-pct').textContent = `${s.passPercentage}%`;
  document.getElementById('kpi-passed-count').textContent = `${s.passedStudents} Passed`;
  
  document.getElementById('kpi-fcd-count').textContent = s.fcdCount;
  document.getElementById('kpi-fcd-pct').textContent = `${s.fcdPercentage}% of dept`;
  
  document.getElementById('kpi-fc-count').textContent = s.fcCount;
  document.getElementById('kpi-fc-pct').textContent = `${s.fcPercentage}% of dept`;
  
  document.getElementById('kpi-sc-count').textContent = s.scCount;
  document.getElementById('kpi-sc-pct').textContent = `${s.scPercentage}% of dept`;
  
  document.getElementById('kpi-fail-count').textContent = s.failCount;
  document.getElementById('kpi-fail-pct').textContent = `${s.failPercentage}% backlogs`;

  document.getElementById('kpi-avg-sgpa').textContent = s.avgSgpa;
  document.getElementById('kpi-highest-sgpa').textContent = `Top SGPA: ${s.highestSgpa}`;
}

// Render Visual Podium for Top 3 & Table for Top 10 Toppers
function renderPodiumAndToppers() {
  const toppers = analyzedData.toppers;
  
  // Podium
  if (toppers.length >= 3) {
    const rank1 = toppers[0];
    const rank2 = toppers[1];
    const rank3 = toppers[2];

    document.getElementById('podium-r1-name').textContent = rank1.name;
    document.getElementById('podium-r1-usn').textContent = rank1.usn;
    document.getElementById('podium-r1-sgpa').textContent = `${rank1.sgpa} SGPA`;
    document.getElementById('podium-r1-marks').textContent = `${rank1.totalMarksObtained}/${rank1.totalMaxMarks} (${rank1.percentage}%)`;

    document.getElementById('podium-r2-name').textContent = rank2.name;
    document.getElementById('podium-r2-usn').textContent = rank2.usn;
    document.getElementById('podium-r2-sgpa').textContent = `${rank2.sgpa} SGPA`;
    document.getElementById('podium-r2-marks').textContent = `${rank2.totalMarksObtained}/${rank2.totalMaxMarks} (${rank2.percentage}%)`;

    document.getElementById('podium-r3-name').textContent = rank3.name;
    document.getElementById('podium-r3-usn').textContent = rank3.usn;
    document.getElementById('podium-r3-sgpa').textContent = `${rank3.sgpa} SGPA`;
    document.getElementById('podium-r3-marks').textContent = `${rank3.totalMarksObtained}/${rank3.totalMaxMarks} (${rank3.percentage}%)`;

    // Highlight newly added student on podium
    const p1 = document.getElementById('podium-card-r1');
    const p2 = document.getElementById('podium-card-r2');
    const p3 = document.getElementById('podium-card-r3');
    [p1, p2, p3].forEach(c => c && c.classList.remove('ring-4', 'ring-emerald-400', 'animate-pulse'));

    if (lastAddedUsn === rank1.usn) p1.classList.add('ring-4', 'ring-emerald-400', 'animate-pulse');
    if (lastAddedUsn === rank2.usn) p2.classList.add('ring-4', 'ring-emerald-400', 'animate-pulse');
    if (lastAddedUsn === rank3.usn) p3.classList.add('ring-4', 'ring-emerald-400', 'animate-pulse');
  }

  // Top 10 Table
  const tbody = document.getElementById('toppers-tbody');
  tbody.innerHTML = '';

  toppers.forEach((student, index) => {
    const tr = document.createElement('tr');
    tr.dataset.usn = student.usn;
    tr.className = `hover:bg-indigo-50/60 transition-colors cursor-pointer border-b border-slate-100 ${lastAddedUsn === student.usn ? 'highlight-new-student' : ''}`;
    tr.onclick = () => openStudentModal(student.usn);

    let rankBadge = '';
    if (index === 0) rankBadge = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">🥇 Rank 1</span>';
    else if (index === 1) rankBadge = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">🥈 Rank 2</span>';
    else if (index === 2) rankBadge = '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-700/10 text-amber-900 border border-amber-400">🥉 Rank 3</span>';
    else rankBadge = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">#${index + 1}</span>`;

    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap">${rankBadge}</td>
      <td class="px-4 py-3 whitespace-nowrap font-mono font-semibold text-indigo-700">${student.usn}</td>
      <td class="px-4 py-3 whitespace-nowrap font-medium text-slate-900">${student.name}</td>
      <td class="px-4 py-3 whitespace-nowrap text-right font-bold text-emerald-600 text-base">${student.sgpa}</td>
      <td class="px-4 py-3 whitespace-nowrap text-right font-medium text-slate-700">${student.percentage}%</td>
      <td class="px-4 py-3 whitespace-nowrap text-right text-slate-600">${student.totalMarksObtained} / ${student.totalMaxMarks}</td>
      <td class="px-4 py-3 whitespace-nowrap">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${student.badgeClass}">
          ${student.awardedClass}
        </span>
      </td>
      <td class="px-4 py-3 whitespace-nowrap text-center">
        <button class="text-indigo-600 hover:text-indigo-900 text-xs font-semibold px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors">
          View Result
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Master Student Table with Filtering & Search
function renderStudentTable() {
  const tbody = document.getElementById('students-tbody');
  tbody.innerHTML = '';

  let list = analyzedData.students;

  // Apply tab filter
  if (currentFilter === 'toppers') list = analyzedData.toppers;
  else if (currentFilter === 'fcd') list = analyzedData.categories.fcd;
  else if (currentFilter === 'fc') list = analyzedData.categories.fc;
  else if (currentFilter === 'sc') list = analyzedData.categories.sc;
  else if (currentFilter === 'fail') list = analyzedData.categories.fail;

  // Apply search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(s => s.usn.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }

  // Update count badge
  document.getElementById('table-count-badge').textContent = `Showing ${list.length} students`;

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-8 text-slate-400">
          No students found matching current filters.
        </td>
      </tr>
    `;
    return;
  }

  list.forEach((student, index) => {
    const tr = document.createElement('tr');
    tr.dataset.usn = student.usn;
    tr.className = `hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 ${lastAddedUsn === student.usn ? 'highlight-new-student' : ''}`;
    tr.onclick = () => openStudentModal(student.usn);

    const backlogsSummary = student.hasBacklog
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800" title="${student.backlogs.map(b => b.code).join(', ')}">
          ${student.backlogCount} Backlog${student.backlogCount > 1 ? 's' : ''} (${student.backlogs.map(b => b.code).join(', ')})
        </span>`
      : `<span class="text-emerald-600 text-xs font-semibold flex items-center gap-1">✓ Cleared</span>`;

    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap text-xs text-slate-500 font-mono">#${student.rank}</td>
      <td class="px-4 py-3 whitespace-nowrap font-mono font-bold text-indigo-700">${student.usn}</td>
      <td class="px-4 py-3 whitespace-nowrap font-medium text-slate-900">${student.name}</td>
      <td class="px-4 py-3 whitespace-nowrap text-right font-bold ${student.hasBacklog ? 'text-rose-500' : 'text-slate-900'}">${student.sgpa}</td>
      <td class="px-4 py-3 whitespace-nowrap text-right text-slate-700">${student.percentage}%</td>
      <td class="px-4 py-3 whitespace-nowrap text-right text-slate-600">${student.totalMarksObtained} / ${student.totalMaxMarks}</td>
      <td class="px-4 py-3 whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${student.badgeClass}">
          ${student.awardedClass}
        </span>
      </td>
      <td class="px-4 py-3 whitespace-nowrap">${backlogsSummary}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Subject-wise Analytics Table
function renderSubjectAnalytics() {
  const tbody = document.getElementById('subject-tbody');
  tbody.innerHTML = '';

  analyzedData.subjectAnalytics.forEach(sub => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-100 hover:bg-slate-50 text-sm';

    let passBarClass = 'bg-emerald-500';
    if (sub.passPercentage < 75) passBarClass = 'bg-amber-500';
    if (sub.passPercentage < 60) passBarClass = 'bg-rose-500';

    tr.innerHTML = `
      <td class="px-4 py-3 font-mono font-bold text-slate-800">${sub.code}</td>
      <td class="px-4 py-3 font-medium text-slate-900">${sub.name}</td>
      <td class="px-4 py-3 text-center text-slate-600">${sub.credits}</td>
      <td class="px-4 py-3 text-center font-semibold text-emerald-600">${sub.passedCount}</td>
      <td class="px-4 py-3 text-center font-bold ${sub.failedCount > 0 ? 'text-rose-600' : 'text-slate-400'}">${sub.failedCount}</td>
      <td class="px-4 py-3">
        <div class="flex items-center gap-2">
          <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div class="${passBarClass} h-2 rounded-full" style="width: ${sub.passPercentage}%"></div>
          </div>
          <span class="text-xs font-bold text-slate-700 min-w-[42px]">${sub.passPercentage}%</span>
        </div>
      </td>
      <td class="px-4 py-3 text-right text-slate-600">${sub.avgCie} / 50</td>
      <td class="px-4 py-3 text-right text-slate-600">${sub.avgSee} / 50</td>
      <td class="px-4 py-3 text-right font-bold text-slate-800">${sub.avgTotal} / 100</td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Backlog and Remedial Action Section
function renderBacklogAnalysis() {
  const failList = analyzedData.categories.fail;
  const countEl = document.getElementById('backlog-student-count');
  countEl.textContent = `${failList.length} Students`;

  const container = document.getElementById('backlog-cards-container');
  container.innerHTML = '';

  if (failList.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 w-full col-span-full">
        🎉 Exceptional! No students with backlogs in this department batch. 100% Pass Rate!
      </div>
    `;
    return;
  }

  failList.forEach(student => {
    const card = document.createElement('div');
    card.dataset.usn = student.usn;
    card.className = `bg-white p-4 rounded-xl border border-rose-200 shadow-sm hover:shadow transition-shadow ${lastAddedUsn === student.usn ? 'highlight-new-student' : ''}`;
    
    let backlogsHtml = student.backlogs.map(b => `
      <div class="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
        <div>
          <span class="font-mono font-bold text-rose-700">${b.code}</span>
          <span class="text-slate-600 ml-1 truncate">${b.name}</span>
        </div>
        <div class="text-right">
          <span class="font-medium text-slate-700">CIE: ${b.cie} | SEE: ${b.see}</span>
          <span class="text-rose-600 block text-[11px] font-semibold">${b.reason}</span>
        </div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <div>
          <h4 class="font-bold text-slate-900">${student.name}</h4>
          <span class="font-mono text-xs font-semibold text-indigo-700">${student.usn}</span>
        </div>
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
          ${student.backlogCount} Subject${student.backlogCount > 1 ? 's' : ''}
        </span>
      </div>
      <div class="mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
        ${backlogsHtml}
      </div>
      <div class="mt-3 flex justify-between items-center text-xs">
        <span class="text-slate-500">Current SGPA: <b class="text-slate-800">${student.sgpa}</b></span>
        <button onclick="openStudentModal('${student.usn}')" class="text-indigo-600 hover:text-indigo-900 font-semibold">
          Full Ledger →
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Chart.js Visualizations
function renderCharts() {
  if (typeof Chart === 'undefined') return;

  // 1. Class Distribution Doughnut Chart
  const s = analyzedData.stats;
  const ctxClass = document.getElementById('chart-class-distribution').getContext('2d');
  
  if (charts.classDist) charts.classDist.destroy();
  charts.classDist = new Chart(ctxClass, {
    type: 'doughnut',
    data: {
      labels: ['Distinction (FCD)', 'First Class (FC)', 'Second Class (SC)', 'Fail / Backlog'],
      datasets: [{
        data: [s.fcdCount, s.fcCount, s.scCount, s.failCount],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11, family: 'Inter' } } }
      },
      cutout: '65%'
    }
  });

  // 2. Subject-wise Pass Percentage Bar Chart
  const ctxSub = document.getElementById('chart-subjects-pass').getContext('2d');
  const subLabels = analyzedData.subjectAnalytics.map(s => s.code);
  const subPassRates = analyzedData.subjectAnalytics.map(s => s.passPercentage);
  const subFailRates = analyzedData.subjectAnalytics.map(s => s.failPercentage);

  if (charts.subPass) charts.subPass.destroy();
  charts.subPass = new Chart(ctxSub, {
    type: 'bar',
    data: {
      labels: subLabels,
      datasets: [
        {
          label: 'Pass %',
          data: subPassRates,
          backgroundColor: '#6366f1',
          borderRadius: 6
        },
        {
          label: 'Fail %',
          data: subFailRates,
          backgroundColor: '#f43f5e',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: v => v + '%' }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
      }
    }
  });
}

// Student Detail Result Modal
function openStudentModal(usn) {
  const student = analyzedData.students.find(s => s.usn === usn);
  if (!student) return;

  document.getElementById('modal-student-name').textContent = student.name;
  document.getElementById('modal-student-usn').textContent = student.usn;
  document.getElementById('modal-student-sgpa').textContent = student.sgpa;
  document.getElementById('modal-student-pct').textContent = `${student.percentage}%`;
  document.getElementById('modal-student-marks').textContent = `${student.totalMarksObtained} / ${student.totalMaxMarks}`;
  document.getElementById('modal-student-class').textContent = student.awardedClass;
  document.getElementById('modal-student-rank').textContent = `#${student.rank}`;

  const tbody = document.getElementById('modal-marks-tbody');
  tbody.innerHTML = '';

  student.detailedSubjects.forEach(sub => {
    const tr = document.createElement('tr');
    tr.className = sub.status === 'Fail' ? 'bg-rose-50/70 border-b border-rose-100' : 'border-b border-slate-100';

    tr.innerHTML = `
      <td class="px-4 py-2.5 font-mono font-bold text-slate-800 text-xs">${sub.code}</td>
      <td class="px-4 py-2.5 font-medium text-slate-800 text-xs">${sub.name}</td>
      <td class="px-4 py-2.5 text-center text-slate-600 text-xs">${sub.credits}</td>
      <td class="px-4 py-2.5 text-center text-slate-700 text-xs">${sub.cie}</td>
      <td class="px-4 py-2.5 text-center text-slate-700 text-xs">${sub.see}</td>
      <td class="px-4 py-2.5 text-center font-bold text-slate-900 text-xs">${sub.total} / ${sub.maxTotal}</td>
      <td class="px-4 py-2.5 text-center font-bold ${sub.status === 'Fail' ? 'text-rose-600' : 'text-emerald-600'} text-xs">${sub.grade}</td>
      <td class="px-4 py-2.5 text-center font-bold text-slate-700 text-xs">${sub.gradePoints}</td>
      <td class="px-4 py-2.5 text-center text-xs">
        <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${sub.status === 'Fail' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
          ${sub.status}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const modal = document.getElementById('student-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeStudentModal() {
  const modal = document.getElementById('student-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// ==========================================
// ADD / UPLOAD STUDENT RESULT MODAL ENGINE
// ==========================================

function openAddStudentModal(tab = 'form') {
  renderManualSubjectInputs();
  switchAddTab(tab);
  updateLivePreview();
  const modal = document.getElementById('add-student-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeAddStudentModal() {
  const modal = document.getElementById('add-student-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function switchAddTab(tab) {
  activeAddTab = tab;
  ['form', 'paste', 'upload'].forEach(t => {
    const tabEl = document.getElementById(`add-tab-${t}`);
    const btnEl = document.getElementById(`tab-btn-${t}`);
    if (t === tab) {
      tabEl.classList.remove('hidden');
      btnEl.className = 'pb-2.5 border-b-2 border-indigo-600 text-indigo-600 font-bold';
    } else {
      tabEl.classList.add('hidden');
      btnEl.className = 'pb-2.5 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium';
    }
  });

  const submitBtn = document.getElementById('btn-submit-student');
  if (tab === 'form') {
    submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>Analyze & Place in Toppers List</span>';
  } else if (tab === 'paste') {
    submitBtn.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i><span>Parse Text & Rank Student</span>';
  } else {
    submitBtn.innerHTML = '<i data-lucide="upload" class="w-4 h-4"></i><span>Process File & Rank</span>';
  }
  if (window.lucide) window.lucide.createIcons();
}

// Render dynamic subject inputs in manual form
function renderManualSubjectInputs() {
  const container = document.getElementById('manual-subjects-container');
  container.innerHTML = '';

  currentData.subjects.forEach(sub => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs';
    
    div.innerHTML = `
      <div class="flex-1 min-w-0 pr-2">
        <span class="font-mono font-bold text-indigo-700">${sub.code}</span>
        <span class="text-slate-700 font-medium truncate block">${sub.name}</span>
        <span class="text-[10px] text-slate-400">Credits: ${sub.credits} | Max CIE: ${sub.maxCie}, Max SEE: ${sub.maxSee}</span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <div>
          <label class="block text-[10px] text-slate-500 font-semibold text-center">CIE (50)</label>
          <input 
            type="number" 
            id="sub_cie_${sub.code}" 
            min="0" 
            max="${sub.maxCie}" 
            value="${Math.min(sub.maxCie, 45)}" 
            oninput="updateLivePreview()" 
            class="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center font-bold text-slate-800 focus:ring-1 focus:ring-indigo-500"
          >
        </div>
        ${sub.maxSee > 0 ? `
        <div>
          <label class="block text-[10px] text-slate-500 font-semibold text-center">SEE (50)</label>
          <input 
            type="number" 
            id="sub_see_${sub.code}" 
            min="0" 
            max="${sub.maxSee}" 
            value="${Math.min(sub.maxSee, 46)}" 
            oninput="updateLivePreview()" 
            class="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center font-bold text-slate-800 focus:ring-1 focus:ring-indigo-500"
          >
        </div>
        ` : `
        <div class="w-16 text-center text-[10px] text-slate-400 font-semibold pt-3">
          (No SEE)
        </div>
        `}
      </div>
    `;
    container.appendChild(div);
  });
}

// Apply quick presets to manual form
function applyPresetMarks(type) {
  let usn = document.getElementById('manual-usn');
  let name = document.getElementById('manual-name');

  if (!usn.value) usn.value = '1MS21CS099';
  if (!name.value) name.value = 'My Result (Topper Test)';

  currentData.subjects.forEach((sub, idx) => {
    const cieInput = document.getElementById(`sub_cie_${sub.code}`);
    const seeInput = document.getElementById(`sub_see_${sub.code}`);

    if (type === 'topper') {
      // 9.75 SGPA
      if (cieInput) cieInput.value = sub.maxCie >= 100 ? 98 : 49;
      if (seeInput) seeInput.value = 49;
    } else if (type === 'fcd') {
      // 8.40 SGPA
      if (cieInput) cieInput.value = sub.maxCie >= 100 ? 86 : 41;
      if (seeInput) seeInput.value = 40;
    } else if (type === 'fc') {
      // 7.10 SGPA
      if (cieInput) cieInput.value = sub.maxCie >= 100 ? 74 : 34;
      if (seeInput) seeInput.value = 32;
    } else if (type === 'fail') {
      // Backlog in first subject
      if (idx === 0) {
        if (cieInput) cieInput.value = 24;
        if (seeInput) seeInput.value = 12; // SEE < 18 Fail!
      } else {
        if (cieInput) cieInput.value = sub.maxCie >= 100 ? 75 : 35;
        if (seeInput) seeInput.value = 30;
      }
    }
  });

  updateLivePreview();
}

// Live preview of student score and projected rank
function updateLivePreview() {
  const dummyStudent = {
    usn: 'PREVIEW',
    name: 'Preview',
    marks: currentData.subjects.map(sub => {
      const cieEl = document.getElementById(`sub_cie_${sub.code}`);
      const seeEl = document.getElementById(`sub_see_${sub.code}`);
      return {
        code: sub.code,
        cie: cieEl ? parseFloat(cieEl.value) || 0 : 0,
        see: seeEl ? parseFloat(seeEl.value) || 0 : 0
      };
    })
  };

  const analyzed = analyzeStudent(dummyStudent, currentData.subjects);

  document.getElementById('preview-sgpa').textContent = `${analyzed.sgpa} SGPA`;
  document.getElementById('preview-pct').textContent = `(${analyzed.percentage}%)`;
  document.getElementById('preview-class').textContent = analyzed.awardedClass;

  // Project rank among current students
  let projectedRank = 1;
  if (analyzed.hasBacklog) {
    projectedRank = 'Backlog List';
  } else {
    currentData.students.forEach(st => {
      const a = analyzeStudent(st, currentData.subjects);
      if (!a.hasBacklog && (a.sgpa > analyzed.sgpa || (a.sgpa === analyzed.sgpa && a.totalMarksObtained > analyzed.totalMarksObtained))) {
        projectedRank++;
      }
    });
    projectedRank = `#${projectedRank}`;
  }

  document.getElementById('preview-rank').textContent = projectedRank;
}

// Submit handler for adding student
function submitAddStudent() {
  if (activeAddTab === 'form') {
    const usnInput = document.getElementById('manual-usn').value.trim();
    const nameInput = document.getElementById('manual-name').value.trim();

    if (!usnInput) {
      alert('Please enter a valid Student USN (e.g. 1MS21CS099).');
      return;
    }

    const marks = currentData.subjects.map(sub => {
      const cieEl = document.getElementById(`sub_cie_${sub.code}`);
      const seeEl = document.getElementById(`sub_see_${sub.code}`);
      return {
        code: sub.code,
        cie: cieEl ? parseFloat(cieEl.value) || 0 : 0,
        see: seeEl ? parseFloat(seeEl.value) || 0 : 0
      };
    });

    const newStudent = {
      usn: usnInput,
      name: nameInput || `Student ${usnInput}`,
      marks
    };

    closeAddStudentModal();
    addStudentToDepartment(newStudent, true);

  } else if (activeAddTab === 'paste') {
    const text = document.getElementById('modal-paste-input').value.trim();
    if (!text) {
      alert('Please paste VTU result text into the box.');
      return;
    }
    closeAddStudentModal();
    parseVtuResultText(text);

  } else if (activeAddTab === 'upload') {
    const fileInput = document.getElementById('modal-file-input');
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Please choose a file to upload.');
      return;
    }
    const mode = document.querySelector('input[name="modal-upload-mode"]:checked').value;
    handleFileObject(fileInput.files[0], mode);
    closeAddStudentModal();
  }
}

// Parse Raw Text from VTU Result Portal
function parseVtuResultText(text) {
  // 1. Look for USN
  const usnRegex = /1[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{3}/i;
  const usnMatch = text.match(usnRegex);
  const usn = usnMatch ? usnMatch[0].toUpperCase() : '1MS21CS099';

  // 2. Look for Student Name
  let name = `Student ${usn}`;
  const nameMatch = text.match(/(?:Student Name|Name)\s*[:\-]?\s*([A-Za-z\s]{3,35})/i);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1].trim();
  }

  // 3. Match subject lines
  // Standard format: [Code e.g. 21CS71] [Subject Name] [CIE e.g. 48] [SEE e.g. 47] [Total e.g. 95] [Result P/F]
  const marks = [];
  const lines = text.split(/\r?\n/);

  currentData.subjects.forEach(sub => {
    // Check if line contains this subject code
    let found = false;
    for (const line of lines) {
      if (line.toUpperCase().includes(sub.code.toUpperCase())) {
        const numbers = line.match(/\b\d{1,3}\b/g);
        if (numbers && numbers.length >= 2) {
          const cie = parseFloat(numbers[0]) || 0;
          const see = parseFloat(numbers[1]) || 0;
          marks.push({ code: sub.code, cie, see });
          found = true;
          break;
        }
      }
    }
    if (!found) {
      // Default to passing marks for unmentioned subjects
      marks.push({ code: sub.code, cie: 45, see: 44 });
    }
  });

  const student = { usn, name, marks };
  addStudentToDepartment(student, true);
}

// Load realistic sample text into the paste box for quick testing
function loadSamplePasteText() {
  const sample = `VISVESVARAYA TECHNOLOGICAL UNIVERSITY, BELAGAVI
Provisional Results of 7th Semester B.E. Examination, 2026
University Seat Number : 1MS21CS099
Student Name : Vikram Malhotra

Subject Code | Subject Name | Internal Marks | External Marks | Total | Result
21CS71 Artificial Intelligence & Machine Learning 49 48 97 P
21CS72 Big Data Analytics 48 49 97 P
21CS734 Cloud Computing & DevOps 48 47 95 P
21CS742 Cyber Security & Digital Forensics 49 49 98 P
21CSL75 Project Work Phase - 1 98 0 98 P
21INT76 Research Internship / Industry Training 49 48 97 P`;

  document.getElementById('text-ledger-input').value = sample;
  const modalPaste = document.getElementById('modal-paste-input');
  if (modalPaste) modalPaste.value = sample;
}

// Universal File Upload Handler (Handles both Tall single student cards & Wide class sheets)
function handleFileObject(file, mode = 'merge') {
  const fileName = file.name;
  const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

  if (isExcel) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        processUniversalRows(jsonRows, fileName, mode);
      } catch (err) {
        alert('Error parsing Excel file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    // CSV / Text file
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: function(results) {
        processUniversalRows(results.data, fileName, mode);
      },
      error: function(err) {
        alert('Error parsing CSV file: ' + err.message);
      }
    });
  }
}

// Process arbitrary rows into Student Results
function processUniversalRows(rows, sourceName, mode = 'merge') {
  if (!rows || rows.length < 2) {
    alert('File must contain at least 2 rows of data.');
    return;
  }

  // Check if this is a Single Student Result Card (Tall format: 1 row per subject)
  // Usually contains "Subject Code" or "CIE" or "SEE" as column headers in row 0, 1, or 2
  let isTallStudentCard = false;
  let singleUsn = null;
  let singleName = null;

  // Search first few rows for USN or Student Name
  for (let r = 0; r < Math.min(rows.length, 5); r++) {
    const rowStr = rows[r].join(' ');
    const usnMatch = rowStr.match(/1[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{3}/i);
    if (usnMatch && !singleUsn) singleUsn = usnMatch[0].toUpperCase();

    const nameMatch = rowStr.match(/(?:Student Name|Name)\s*[,:\-]?\s*([A-Za-z\s]{3,30})/i);
    if (nameMatch && !singleName) singleName = nameMatch[1].trim();
  }

  // Look for header row having Code, CIE, SEE
  let subHeaderIdx = -1;
  let codeCol = -1, cieCol = -1, seeCol = -1, nameCol = -1;

  for (let r = 0; r < Math.min(rows.length, 6); r++) {
    const row = rows[r].map(c => String(c || '').trim().toLowerCase());
    const cIdx = row.findIndex(c => /code|subject/i.test(c));
    const cieI = row.findIndex(c => /cie|internal|int/i.test(c));
    const seeI = row.findIndex(c => /see|external|ext/i.test(c));

    if (cIdx >= 0 && (cieI >= 0 || seeI >= 0)) {
      subHeaderIdx = r;
      codeCol = cIdx;
      cieCol = cieI;
      seeCol = seeI;
      nameCol = row.findIndex(c => /name|title/i.test(c));
      isTallStudentCard = true;
      break;
    }
  }

  if (isTallStudentCard && subHeaderIdx >= 0) {
    // Parse single student marks from rows below header
    const marks = [];
    for (let r = subHeaderIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;
      const code = String(row[codeCol] || '').trim().toUpperCase();
      if (!code || !/^[0-9]{2}[A-Za-z]/.test(code)) continue;

      const cie = cieCol >= 0 ? parseFloat(row[cieCol]) || 0 : 0;
      const see = seeCol >= 0 ? parseFloat(row[seeCol]) || 0 : 0;
      marks.push({ code, cie, see });
    }

    if (marks.length > 0) {
      const student = {
        usn: singleUsn || '1MS21CS099',
        name: singleName || `Student ${singleUsn || '1MS21CS099'}`,
        marks
      };

      addStudentToDepartment(student, true);
      alert(`🎉 Student ${student.name} (${student.usn}) parsed successfully and placed into Department Rankings!`);
      return;
    }
  }

  // Otherwise, treat as Wide Department Ledger (1 row per student)
  processWideDepartmentLedger(rows, sourceName, mode);
}

// Process Wide Department Ledger (1 row per student)
function processWideDepartmentLedger(rows, sourceName, mode) {
  const header = rows[0].map(h => String(h || '').trim());
  let usnIdx = header.findIndex(h => /usn/i.test(h));
  let nameIdx = header.findIndex(h => /name|student/i.test(h));

  if (usnIdx === -1) usnIdx = 0;
  if (nameIdx === -1) nameIdx = 1;

  // Identify subjects from header
  const subjectsMap = {};
  const subjectColumns = [];

  for (let c = 0; c < header.length; c++) {
    if (c === usnIdx || c === nameIdx) continue;
    const colName = header[c];
    
    const match = colName.match(/^([0-9]{2}[A-Za-z]+[0-9A-Za-z]+)(?:_(CIE|SEE|INT|EXT|TOT))?$/i);
    if (match) {
      const code = match[1].toUpperCase();
      const type = (match[2] || 'TOT').toUpperCase();

      if (!subjectsMap[code]) {
        subjectsMap[code] = { code, name: `Subject ${code}`, credits: 4, maxCie: 50, maxSee: 50 };
      }
      subjectColumns.push({ colIndex: c, code, type });
    }
  }

  let detectedSubjects = Object.values(subjectsMap);
  if (detectedSubjects.length === 0) {
    // Fallback: Use current department subjects
    detectedSubjects = currentData.subjects;
    detectedSubjects.forEach((sub, i) => {
      subjectColumns.push({ colIndex: 2 + i * 2, code: sub.code, type: 'CIE' });
      subjectColumns.push({ colIndex: 3 + i * 2, code: sub.code, type: 'SEE' });
    });
  }

  // Parse Student Rows
  const students = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;
    const usn = String(row[usnIdx] || '').trim().toUpperCase();
    if (!usn) continue;
    const name = String(row[nameIdx] || `Student ${usn}`).trim();

    const marksMap = {};
    detectedSubjects.forEach(sub => {
      marksMap[sub.code] = { code: sub.code, cie: 0, see: 0 };
    });

    subjectColumns.forEach(sc => {
      if (sc.colIndex < row.length) {
        const val = parseFloat(row[sc.colIndex]) || 0;
        if (marksMap[sc.code]) {
          if (sc.type === 'CIE' || sc.type === 'INT') {
            marksMap[sc.code].cie = val;
          } else if (sc.type === 'SEE' || sc.type === 'EXT') {
            marksMap[sc.code].see = val;
          } else {
            marksMap[sc.code].cie = Math.round(val / 2);
            marksMap[sc.code].see = val - marksMap[sc.code].cie;
          }
        }
      }
    });

    students.push({
      usn,
      name,
      marks: Object.values(marksMap)
    });
  }

  if (students.length === 0) {
    alert('No student records found in file.');
    return;
  }

  if (mode === 'replace') {
    currentData = {
      department: `Uploaded Department (${sourceName})`,
      semester: "Analyzed Semester",
      scheme: "VTU CBCS Scheme",
      college: "Affiliated VTU College",
      subjects: detectedSubjects,
      students
    };
    lastAddedUsn = students[0].usn;
    analyzeAndRender();
    alert(`Successfully loaded ${students.length} student records from ${sourceName}!`);
  } else {
    // Merge into current department
    students.forEach(st => {
      const idx = currentData.students.findIndex(s => s.usn === st.usn);
      if (idx >= 0) currentData.students[idx] = st;
      else currentData.students.push(st);
    });
    lastAddedUsn = students[0].usn;
    addStudentToDepartment(students[0], true);
    alert(`Merged ${students.length} students into department. First student (${students[0].name}) ranked!`);
  }
}

// Modal File Upload Listener
function handleModalFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById('modal-file-selected-name').textContent = `Selected: ${file.name} (${Math.round(file.size / 1024)} KB)`;
}

// Setup Event Listeners
function setupEventListeners() {
  // Add student triggers
  const btnOpen = document.getElementById('btn-open-add-student');
  if (btnOpen) btnOpen.addEventListener('click', () => openAddStudentModal('form'));

  const btnHero = document.getElementById('btn-hero-check-rank');
  if (btnHero) btnHero.addEventListener('click', () => openAddStudentModal('form'));

  const btnQuickUpload = document.getElementById('btn-quick-upload');
  if (btnQuickUpload) btnQuickUpload.addEventListener('click', () => openAddStudentModal('upload'));

  const btnViewTopper = document.getElementById('btn-view-ranked-topper');
  if (btnViewTopper) {
    btnViewTopper.addEventListener('click', () => {
      document.getElementById('section-toppers').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Manual inputs USN & Name listeners for live preview
  const manualUsn = document.getElementById('manual-usn');
  if (manualUsn) manualUsn.addEventListener('input', updateLivePreview);

  // Tab Filters
  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab-btn').forEach(b => {
        b.classList.remove('active-tab', 'text-indigo-600', 'border-indigo-600');
        b.classList.add('text-slate-500', 'border-transparent');
      });
      btn.classList.add('active-tab', 'text-indigo-600', 'border-indigo-600');
      btn.classList.remove('text-slate-500', 'border-transparent');

      currentFilter = btn.dataset.filter;
      renderStudentTable();
    });
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderStudentTable();
    });
  }

  // Dataset selector
  const datasetSelect = document.getElementById('dataset-select');
  if (datasetSelect) {
    datasetSelect.addEventListener('change', (e) => {
      currentDatasetKey = e.target.value;
      currentData = JSON.parse(JSON.stringify(SAMPLE_DATASETS[currentDatasetKey]));
      analyzeAndRender();
    });
  }

  // Main page CSV/Excel File input
  const fileInput = document.getElementById('csv-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const modeEl = document.querySelector('input[name="upload-mode-main"]:checked');
        const mode = modeEl ? modeEl.value : 'merge';
        handleFileObject(e.target.files[0], mode);
      }
    });
  }

  // Parse Text button on main page
  const btnParse = document.getElementById('btn-parse-text');
  if (btnParse) {
    btnParse.addEventListener('click', () => {
      const text = document.getElementById('text-ledger-input').value.trim();
      if (!text) {
        alert('Please paste result text into the box or click "Load Sample Text".');
        return;
      }
      parseVtuResultText(text);
    });
  }

  // Export buttons
  document.getElementById('btn-export-toppers-csv').addEventListener('click', exportToppersCSV);
  document.getElementById('btn-export-all-csv').addEventListener('click', exportAllCSV);
  document.getElementById('btn-export-remedial-csv').addEventListener('click', exportRemedialCSV);
  document.getElementById('btn-print-report').addEventListener('click', () => window.print());

  // Close modals on ESC or backdrop click
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeStudentModal();
      closeAddStudentModal();
    }
  });

  document.addEventListener('click', (e) => {
    const studentModal = document.getElementById('student-modal');
    if (e.target === studentModal) closeStudentModal();

    const addModal = document.getElementById('add-student-modal');
    if (e.target === addModal) closeAddStudentModal();
  });
}

// Export Top 10 Toppers to CSV
function exportToppersCSV() {
  const toppers = analyzedData.toppers;
  let csv = "Rank,USN,Student Name,SGPA,Percentage,Marks Obtained,Max Marks,Class Awarded\n";
  toppers.forEach(s => {
    csv += `${s.rank},"${s.usn}","${s.name}",${s.sgpa},${s.percentage}%,${s.totalMarksObtained},${s.totalMaxMarks},"${s.awardedClass}"\n`;
  });
  downloadFile(csv, "VTU_Top10_Toppers.csv", "text/csv");
}

// Export All Students Analysis
function exportAllCSV() {
  const students = analyzedData.students;
  let csv = "Rank,USN,Student Name,SGPA,Percentage,Marks Obtained,Max Marks,Class Awarded,Backlogs Count,Failed Subjects\n";
  students.forEach(s => {
    const failedCodes = s.backlogs.map(b => b.code).join('; ');
    csv += `${s.rank},"${s.usn}","${s.name}",${s.sgpa},${s.percentage}%,${s.totalMarksObtained},${s.totalMaxMarks},"${s.awardedClass}",${s.backlogCount},"${failedCodes}"\n`;
  });
  downloadFile(csv, "VTU_Department_Full_Result_Analysis.csv", "text/csv");
}

// Export Remedial Backlog Students List
function exportRemedialCSV() {
  const failList = analyzedData.categories.fail;
  let csv = "USN,Student Name,Backlog Subject Code,Subject Name,CIE Marks,SEE Marks,Failure Reason\n";
  failList.forEach(s => {
    s.backlogs.forEach(b => {
      csv += `"${s.usn}","${s.name}","${b.code}","${b.name}",${b.cie},${b.see},"${b.reason}"\n`;
    });
  });
  downloadFile(csv, "VTU_Remedial_Classes_Backlog_List.csv", "text/csv");
}

// Generic file downloader helper
function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Start app on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp);
