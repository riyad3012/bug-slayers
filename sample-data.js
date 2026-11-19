// Pre-loaded realistic VTU Department Result Datasets
const SAMPLE_DATASETS = {
  cse7: {
    department: "Computer Science & Engineering",
    semester: "7th Semester (Batch 2021-2025)",
    scheme: "2021 Scheme (CBCS)",
    college: "Visvesvaraya Institute of Technology, Bangalore",
    subjects: [
      { code: "21CS71", name: "Artificial Intelligence & Machine Learning", credits: 4, maxCie: 50, maxSee: 50 },
      { code: "21CS72", name: "Big Data Analytics", credits: 4, maxCie: 50, maxSee: 50 },
      { code: "21CS734", name: "Cloud Computing & DevOps", credits: 3, maxCie: 50, maxSee: 50 },
      { code: "21CS742", name: "Cyber Security & Digital Forensics", credits: 3, maxCie: 50, maxSee: 50 },
      { code: "21CSL75", name: "Project Work Phase - 1", credits: 2, maxCie: 100, maxSee: 0 },
      { code: "21INT76", name: "Research Internship / Industry Training", credits: 3, maxCie: 50, maxSee: 50 }
    ],
    students: [
      {
        usn: "1MS21CS001", name: "Aarav Sharma",
        marks: [
          { code: "21CS71", cie: 48, see: 47 },
          { code: "21CS72", cie: 49, see: 48 },
          { code: "21CS734", cie: 47, see: 46 },
          { code: "21CS742", cie: 48, see: 49 },
          { code: "21CSL75", cie: 98, see: 0 },
          { code: "21INT76", cie: 49, see: 48 }
        ]
      },
      {
        usn: "1MS21CS002", name: "Ananya Rao",
        marks: [
          { code: "21CS71", cie: 47, see: 46 },
          { code: "21CS72", cie: 48, see: 47 },
          { code: "21CS734", cie: 48, see: 48 },
          { code: "21CS742", cie: 47, see: 46 },
          { code: "21CSL75", cie: 96, see: 0 },
          { code: "21INT76", cie: 48, see: 47 }
        ]
      },
      {
        usn: "1MS21CS003", name: "Aditya Hegde",
        marks: [
          { code: "21CS71", cie: 46, see: 45 },
          { code: "21CS72", cie: 47, see: 46 },
          { code: "21CS734", cie: 46, see: 47 },
          { code: "21CS742", cie: 48, see: 45 },
          { code: "21CSL75", cie: 95, see: 0 },
          { code: "21INT76", cie: 47, see: 46 }
        ]
      },
      {
        usn: "1MS21CS004", name: "Bhavana Kulkarni",
        marks: [
          { code: "21CS71", cie: 45, see: 44 },
          { code: "21CS72", cie: 46, see: 45 },
          { code: "21CS734", cie: 45, see: 45 },
          { code: "21CS742", cie: 46, see: 46 },
          { code: "21CSL75", cie: 94, see: 0 },
          { code: "21INT76", cie: 46, see: 45 }
        ]
      },
      {
        usn: "1MS21CS005", name: "Chandan Kumar V",
        marks: [
          { code: "21CS71", cie: 44, see: 43 },
          { code: "21CS72", cie: 45, see: 44 },
          { code: "21CS734", cie: 45, see: 43 },
          { code: "21CS742", cie: 45, see: 45 },
          { code: "21CSL75", cie: 92, see: 0 },
          { code: "21INT76", cie: 45, see: 44 }
        ]
      },
      {
        usn: "1MS21CS006", name: "Deepika Nayak",
        marks: [
          { code: "21CS71", cie: 43, see: 44 },
          { code: "21CS72", cie: 44, see: 43 },
          { code: "21CS734", cie: 44, see: 42 },
          { code: "21CS742", cie: 45, see: 43 },
          { code: "21CSL75", cie: 92, see: 0 },
          { code: "21INT76", cie: 44, see: 43 }
        ]
      },
      {
        usn: "1MS21CS007", name: "Darshan Gowda",
        marks: [
          { code: "21CS71", cie: 42, see: 43 },
          { code: "21CS72", cie: 43, see: 42 },
          { code: "21CS734", cie: 43, see: 44 },
          { code: "21CS742", cie: 44, see: 42 },
          { code: "21CSL75", cie: 90, see: 0 },
          { code: "21INT76", cie: 43, see: 42 }
        ]
      },
      {
        usn: "1MS21CS008", name: "Divya Shree S",
        marks: [
          { code: "21CS71", cie: 42, see: 41 },
          { code: "21CS72", cie: 42, see: 43 },
          { code: "21CS734", cie: 42, see: 41 },
          { code: "21CS742", cie: 43, see: 42 },
          { code: "21CSL75", cie: 89, see: 0 },
          { code: "21INT76", cie: 42, see: 41 }
        ]
      },
      {
        usn: "1MS21CS009", name: "Gagan B R",
        marks: [
          { code: "21CS71", cie: 41, see: 40 },
          { code: "21CS72", cie: 42, see: 41 },
          { code: "21CS734", cie: 41, see: 42 },
          { code: "21CS742", cie: 42, see: 40 },
          { code: "21CSL75", cie: 88, see: 0 },
          { code: "21INT76", cie: 41, see: 40 }
        ]
      },
      {
        usn: "1MS21CS010", name: "Harshitha Patel",
        marks: [
          { code: "21CS71", cie: 40, see: 41 },
          { code: "21CS72", cie: 41, see: 40 },
          { code: "21CS734", cie: 40, see: 41 },
          { code: "21CS742", cie: 41, see: 39 },
          { code: "21CSL75", cie: 87, see: 0 },
          { code: "21INT76", cie: 40, see: 41 }
        ]
      },
      // First Class with Distinction (FCD) students
      {
        usn: "1MS21CS011", name: "Ishaan Joshi",
        marks: [
          { code: "21CS71", cie: 39, see: 38 },
          { code: "21CS72", cie: 40, see: 39 },
          { code: "21CS734", cie: 39, see: 40 },
          { code: "21CS742", cie: 40, see: 38 },
          { code: "21CSL75", cie: 85, see: 0 },
          { code: "21INT76", cie: 39, see: 39 }
        ]
      },
      {
        usn: "1MS21CS012", name: "Kavya Murthy",
        marks: [
          { code: "21CS71", cie: 38, see: 39 },
          { code: "21CS72", cie: 39, see: 38 },
          { code: "21CS734", cie: 38, see: 39 },
          { code: "21CS742", cie: 39, see: 37 },
          { code: "21CSL75", cie: 84, see: 0 },
          { code: "21INT76", cie: 38, see: 38 }
        ]
      },
      {
        usn: "1MS21CS013", name: "Kiran Kumar M",
        marks: [
          { code: "21CS71", cie: 38, see: 37 },
          { code: "21CS72", cie: 38, see: 38 },
          { code: "21CS734", cie: 37, see: 38 },
          { code: "21CS742", cie: 38, see: 36 },
          { code: "21CSL75", cie: 83, see: 0 },
          { code: "21INT76", cie: 37, see: 37 }
        ]
      },
      {
        usn: "1MS21CS014", name: "Likith Raj",
        marks: [
          { code: "21CS71", cie: 37, see: 36 },
          { code: "21CS72", cie: 37, see: 37 },
          { code: "21CS734", cie: 36, see: 37 },
          { code: "21CS742", cie: 37, see: 35 },
          { code: "21CSL75", cie: 82, see: 0 },
          { code: "21INT76", cie: 36, see: 36 }
        ]
      },
      {
        usn: "1MS21CS015", name: "Megha S",
        marks: [
          { code: "21CS71", cie: 36, see: 37 },
          { code: "21CS72", cie: 36, see: 36 },
          { code: "21CS734", cie: 37, see: 36 },
          { code: "21CS742", cie: 36, see: 35 },
          { code: "21CSL75", cie: 81, see: 0 },
          { code: "21INT76", cie: 36, see: 35 }
        ]
      },
      {
        usn: "1MS21CS016", name: "Manoj Deshpande",
        marks: [
          { code: "21CS71", cie: 36, see: 35 },
          { code: "21CS72", cie: 35, see: 36 },
          { code: "21CS734", cie: 36, see: 35 },
          { code: "21CS742", cie: 35, see: 34 },
          { code: "21CSL75", cie: 80, see: 0 },
          { code: "21INT76", cie: 35, see: 34 }
        ]
      },
      // First Class (FC) students
      {
        usn: "1MS21CS017", name: "Naveen Prasad",
        marks: [
          { code: "21CS71", cie: 34, see: 33 },
          { code: "21CS72", cie: 35, see: 32 },
          { code: "21CS734", cie: 33, see: 34 },
          { code: "21CS742", cie: 34, see: 32 },
          { code: "21CSL75", cie: 78, see: 0 },
          { code: "21INT76", cie: 34, see: 33 }
        ]
      },
      {
        usn: "1MS21CS018", name: "Nikitha Reddy",
        marks: [
          { code: "21CS71", cie: 33, see: 32 },
          { code: "21CS72", cie: 34, see: 33 },
          { code: "21CS734", cie: 32, see: 33 },
          { code: "21CS742", cie: 33, see: 31 },
          { code: "21CSL75", cie: 76, see: 0 },
          { code: "21INT76", cie: 33, see: 32 }
        ]
      },
      {
        usn: "1MS21CS019", name: "Pooja Hegde",
        marks: [
          { code: "21CS71", cie: 32, see: 31 },
          { code: "21CS72", cie: 33, see: 32 },
          { code: "21CS734", cie: 31, see: 32 },
          { code: "21CS742", cie: 32, see: 30 },
          { code: "21CSL75", cie: 75, see: 0 },
          { code: "21INT76", cie: 32, see: 31 }
        ]
      },
      {
        usn: "1MS21CS020", name: "Pranav Bhat",
        marks: [
          { code: "21CS71", cie: 31, see: 30 },
          { code: "21CS72", cie: 32, see: 31 },
          { code: "21CS734", cie: 30, see: 31 },
          { code: "21CS742", cie: 31, see: 29 },
          { code: "21CSL75", cie: 74, see: 0 },
          { code: "21INT76", cie: 31, see: 30 }
        ]
      },
      {
        usn: "1MS21CS021", name: "Priya Sharma",
        marks: [
          { code: "21CS71", cie: 30, see: 29 },
          { code: "21CS72", cie: 31, see: 30 },
          { code: "21CS734", cie: 30, see: 29 },
          { code: "21CS742", cie: 30, see: 28 },
          { code: "21CSL75", cie: 72, see: 0 },
          { code: "21INT76", cie: 30, see: 29 }
        ]
      },
      {
        usn: "1MS21CS022", name: "Rahul Verma",
        marks: [
          { code: "21CS71", cie: 29, see: 28 },
          { code: "21CS72", cie: 30, see: 29 },
          { code: "21CS734", cie: 29, see: 28 },
          { code: "21CS742", cie: 29, see: 27 },
          { code: "21CSL75", cie: 70, see: 0 },
          { code: "21INT76", cie: 29, see: 28 }
        ]
      },
      {
        usn: "1MS21CS023", name: "Rakshitha N",
        marks: [
          { code: "21CS71", cie: 28, see: 27 },
          { code: "21CS72", cie: 29, see: 28 },
          { code: "21CS734", cie: 28, see: 27 },
          { code: "21CS742", cie: 28, see: 26 },
          { code: "21CSL75", cie: 68, see: 0 },
          { code: "21INT76", cie: 28, see: 27 }
        ]
      },
      // Second Class (SC) students
      {
        usn: "1MS21CS024", name: "Rohan S",
        marks: [
          { code: "21CS71", cie: 26, see: 25 },
          { code: "21CS72", cie: 27, see: 24 },
          { code: "21CS734", cie: 25, see: 25 },
          { code: "21CS742", cie: 26, see: 24 },
          { code: "21CSL75", cie: 65, see: 0 },
          { code: "21INT76", cie: 26, see: 25 }
        ]
      },
      {
        usn: "1MS21CS025", name: "Sahana Acharya",
        marks: [
          { code: "21CS71", cie: 25, see: 24 },
          { code: "21CS72", cie: 26, see: 23 },
          { code: "21CS734", cie: 24, see: 24 },
          { code: "21CS742", cie: 25, see: 23 },
          { code: "21CSL75", cie: 62, see: 0 },
          { code: "21INT76", cie: 25, see: 24 }
        ]
      },
      {
        usn: "1MS21CS026", name: "Sanjay Dixit",
        marks: [
          { code: "21CS71", cie: 24, see: 23 },
          { code: "21CS72", cie: 25, see: 22 },
          { code: "21CS734", cie: 23, see: 23 },
          { code: "21CS742", cie: 24, see: 22 },
          { code: "21CSL75", cie: 60, see: 0 },
          { code: "21INT76", cie: 24, see: 23 }
        ]
      },
      {
        usn: "1MS21CS027", name: "Shreya Joshi",
        marks: [
          { code: "21CS71", cie: 23, see: 22 },
          { code: "21CS72", cie: 24, see: 21 },
          { code: "21CS734", cie: 22, see: 22 },
          { code: "21CS742", cie: 23, see: 21 },
          { code: "21CSL75", cie: 58, see: 0 },
          { code: "21INT76", cie: 23, see: 22 }
        ]
      },
      // Pass Class students
      {
        usn: "1MS21CS028", name: "Siddharth Rao",
        marks: [
          { code: "21CS71", cie: 22, see: 20 },
          { code: "21CS72", cie: 22, see: 19 },
          { code: "21CS734", cie: 21, see: 20 },
          { code: "21CS742", cie: 22, see: 18 },
          { code: "21CSL75", cie: 55, see: 0 },
          { code: "21INT76", cie: 22, see: 19 }
        ]
      },
      // Failures / Backlog students (CIE < 20 or SEE < 18 or Total < 40 in VTU 50+50 scheme)
      {
        usn: "1MS21CS029", name: "Sumanth M",
        marks: [
          { code: "21CS71", cie: 24, see: 12 }, // Fail in AI & ML (SEE < 18)
          { code: "21CS72", cie: 26, see: 22 },
          { code: "21CS734", cie: 25, see: 24 },
          { code: "21CS742", cie: 24, see: 21 },
          { code: "21CSL75", cie: 60, see: 0 },
          { code: "21INT76", cie: 25, see: 22 }
        ]
      },
      {
        usn: "1MS21CS030", name: "Suraj Nayak",
        marks: [
          { code: "21CS71", cie: 25, see: 22 },
          { code: "21CS72", cie: 22, see: 10 }, // Fail in Big Data (SEE < 18)
          { code: "21CS734", cie: 24, see: 20 },
          { code: "21CS742", cie: 25, see: 19 },
          { code: "21CSL75", cie: 58, see: 0 },
          { code: "21INT76", cie: 23, see: 20 }
        ]
      },
      {
        usn: "1MS21CS031", name: "Tanvi Shetty",
        marks: [
          { code: "21CS71", cie: 20, see: 14 }, // Fail in AI & ML (SEE < 18)
          { code: "21CS72", cie: 21, see: 12 }, // Fail in Big Data (SEE < 18)
          { code: "21CS734", cie: 22, see: 21 },
          { code: "21CS742", cie: 23, see: 20 },
          { code: "21CSL75", cie: 56, see: 0 },
          { code: "21INT76", cie: 21, see: 20 }
        ]
      },
      {
        usn: "1MS21CS032", name: "Tarun K",
        marks: [
          { code: "21CS71", cie: 16, see: 15 }, // Fail in AI & ML (CIE < 20 and SEE < 18)
          { code: "21CS72", cie: 18, see: 14 }, // Fail in Big Data
          { code: "21CS734", cie: 19, see: 13 }, // Fail in Cloud Computing
          { code: "21CS742", cie: 20, see: 18 },
          { code: "21CSL75", cie: 52, see: 0 },
          { code: "21INT76", cie: 20, see: 19 }
        ]
      },
      {
        usn: "1MS21CS033", name: "Varun R",
        marks: [
          { code: "21CS71", cie: 23, see: 21 },
          { code: "21CS72", cie: 24, see: 20 },
          { code: "21CS734", cie: 22, see: 11 }, // Fail in Cloud Computing
          { code: "21CS742", cie: 24, see: 22 },
          { code: "21CSL75", cie: 58, see: 0 },
          { code: "21INT76", cie: 23, see: 21 }
        ]
      },
      {
        usn: "1MS21CS034", name: "Vidya Sagar",
        marks: [
          { code: "21CS71", cie: 22, see: 20 },
          { code: "21CS72", cie: 21, see: 18 },
          { code: "21CS734", cie: 23, see: 21 },
          { code: "21CS742", cie: 22, see: 0, absent: true }, // Absent in Cyber Security
          { code: "21CSL75", cie: 54, see: 0 },
          { code: "21INT76", cie: 22, see: 20 }
        ]
      },
      {
        usn: "1MS21CS035", name: "Yashaswi Patil",
        marks: [
          { code: "21CS71", cie: 41, see: 42 },
          { code: "21CS72", cie: 42, see: 40 },
          { code: "21CS734", cie: 43, see: 41 },
          { code: "21CS742", cie: 41, see: 42 },
          { code: "21CSL75", cie: 88, see: 0 },
          { code: "21INT76", cie: 42, see: 41 }
        ]
      },
      {
        usn: "1MS21CS036", name: "Zoya Fathima",
        marks: [
          { code: "21CS71", cie: 43, see: 41 },
          { code: "21CS72", cie: 44, see: 42 },
          { code: "21CS734", cie: 42, see: 43 },
          { code: "21CS742", cie: 43, see: 40 },
          { code: "21CSL75", cie: 89, see: 0 },
          { code: "21INT76", cie: 43, see: 42 }
        ]
      }
    ]
  },

  ise5: {
    department: "Information Science & Engineering",
    semester: "5th Semester (Batch 2022-2026)",
    scheme: "2021 Scheme (CBCS)",
    college: "Visvesvaraya Institute of Technology, Bangalore",
    subjects: [
      { code: "21IS51", name: "Automata Theory & Computability", credits: 4, maxCie: 50, maxSee: 50 },
      { code: "21IS52", name: "Computer Networks", credits: 4, maxCie: 50, maxSee: 50 },
      { code: "21IS53", name: "Database Management Systems", credits: 4, maxCie: 50, maxSee: 50 },
      { code: "21IS54", name: "Software Engineering & Project Management", credits: 3, maxCie: 50, maxSee: 50 },
      { code: "21ISL55", name: "Computer Networks & DBMS Laboratory", credits: 2, maxCie: 50, maxSee: 50 },
      { code: "21EVS56", name: "Environmental Studies", credits: 1, maxCie: 50, maxSee: 50 }
    ],
    students: [
      {
        usn: "1MS22IS001", name: "Aishwarya Rai",
        marks: [
          { code: "21IS51", cie: 49, see: 48 },
          { code: "21IS52", cie: 48, see: 49 },
          { code: "21IS53", cie: 50, see: 49 },
          { code: "21IS54", cie: 47, see: 48 },
          { code: "21ISL55", cie: 49, see: 49 },
          { code: "21EVS56", cie: 48, see: 47 }
        ]
      },
      {
        usn: "1MS22IS002", name: "Abhishek Kulkarni",
        marks: [
          { code: "21IS51", cie: 48, see: 47 },
          { code: "21IS52", cie: 47, see: 46 },
          { code: "21IS53", cie: 49, see: 48 },
          { code: "21IS54", cie: 46, see: 47 },
          { code: "21ISL55", cie: 48, see: 47 },
          { code: "21EVS56", cie: 46, see: 46 }
        ]
      },
      {
        usn: "1MS22IS003", name: "Deepak S",
        marks: [
          { code: "21IS51", cie: 46, see: 45 },
          { code: "21IS52", cie: 45, see: 46 },
          { code: "21IS53", cie: 47, see: 46 },
          { code: "21IS54", cie: 45, see: 44 },
          { code: "21ISL55", cie: 46, see: 47 },
          { code: "21EVS56", cie: 45, see: 44 }
        ]
      },
      {
        usn: "1MS22IS004", name: "Gautam R",
        marks: [
          { code: "21IS51", cie: 45, see: 43 },
          { code: "21IS52", cie: 44, see: 44 },
          { code: "21IS53", cie: 46, see: 45 },
          { code: "21IS54", cie: 44, see: 43 },
          { code: "21ISL55", cie: 45, see: 46 },
          { code: "21EVS56", cie: 44, see: 43 }
        ]
      },
      {
        usn: "1MS22IS005", name: "Harini M",
        marks: [
          { code: "21IS51", cie: 44, see: 42 },
          { code: "21IS52", cie: 43, see: 43 },
          { code: "21IS53", cie: 45, see: 44 },
          { code: "21IS54", cie: 43, see: 42 },
          { code: "21ISL55", cie: 44, see: 45 },
          { code: "21EVS56", cie: 43, see: 42 }
        ]
      },
      {
        usn: "1MS22IS006", name: "Jagadish H",
        marks: [
          { code: "21IS51", cie: 42, see: 41 },
          { code: "21IS52", cie: 41, see: 42 },
          { code: "21IS53", cie: 43, see: 42 },
          { code: "21IS54", cie: 41, see: 40 },
          { code: "21ISL55", cie: 43, see: 43 },
          { code: "21EVS56", cie: 42, see: 40 }
        ]
      },
      {
        usn: "1MS22IS007", name: "Keerthi V",
        marks: [
          { code: "21IS51", cie: 41, see: 40 },
          { code: "21IS52", cie: 40, see: 41 },
          { code: "21IS53", cie: 42, see: 41 },
          { code: "21IS54", cie: 40, see: 39 },
          { code: "21ISL55", cie: 42, see: 41 },
          { code: "21EVS56", cie: 41, see: 39 }
        ]
      },
      {
        usn: "1MS22IS008", name: "Madhav Joshi",
        marks: [
          { code: "21IS51", cie: 40, see: 39 },
          { code: "21IS52", cie: 39, see: 40 },
          { code: "21IS53", cie: 41, see: 39 },
          { code: "21IS54", cie: 39, see: 38 },
          { code: "21ISL55", cie: 41, see: 40 },
          { code: "21EVS56", cie: 40, see: 38 }
        ]
      },
      {
        usn: "1MS22IS009", name: "Nandini R",
        marks: [
          { code: "21IS51", cie: 39, see: 38 },
          { code: "21IS52", cie: 38, see: 39 },
          { code: "21IS53", cie: 40, see: 38 },
          { code: "21IS54", cie: 38, see: 37 },
          { code: "21ISL55", cie: 40, see: 39 },
          { code: "21EVS56", cie: 39, see: 37 }
        ]
      },
      {
        usn: "1MS22IS010", name: "Omkar Hegde",
        marks: [
          { code: "21IS51", cie: 38, see: 37 },
          { code: "21IS52", cie: 37, see: 38 },
          { code: "21IS53", cie: 39, see: 37 },
          { code: "21IS54", cie: 37, see: 36 },
          { code: "21ISL55", cie: 39, see: 38 },
          { code: "21EVS56", cie: 38, see: 36 }
        ]
      },
      // First Class
      {
        usn: "1MS22IS011", name: "Prashant K",
        marks: [
          { code: "21IS51", cie: 34, see: 33 },
          { code: "21IS52", cie: 33, see: 34 },
          { code: "21IS53", cie: 35, see: 33 },
          { code: "21IS54", cie: 32, see: 33 },
          { code: "21ISL55", cie: 36, see: 35 },
          { code: "21EVS56", cie: 33, see: 32 }
        ]
      },
      {
        usn: "1MS22IS012", name: "Rashmi Bhat",
        marks: [
          { code: "21IS51", cie: 32, see: 31 },
          { code: "21IS52", cie: 31, see: 32 },
          { code: "21IS53", cie: 33, see: 31 },
          { code: "21IS54", cie: 30, see: 31 },
          { code: "21ISL55", cie: 34, see: 33 },
          { code: "21EVS56", cie: 31, see: 30 }
        ]
      },
      // Second Class
      {
        usn: "1MS22IS013", name: "Shashank V",
        marks: [
          { code: "21IS51", cie: 26, see: 25 },
          { code: "21IS52", cie: 25, see: 24 },
          { code: "21IS53", cie: 27, see: 25 },
          { code: "21IS54", cie: 24, see: 23 },
          { code: "21ISL55", cie: 30, see: 28 },
          { code: "21EVS56", cie: 25, see: 24 }
        ]
      },
      // Backlogs / Failures
      {
        usn: "1MS22IS014", name: "Tejas Gowda",
        marks: [
          { code: "21IS51", cie: 22, see: 11 }, // Fail in Automata (SEE < 18)
          { code: "21IS52", cie: 28, see: 26 },
          { code: "21IS53", cie: 27, see: 25 },
          { code: "21IS54", cie: 26, see: 24 },
          { code: "21ISL55", cie: 32, see: 30 },
          { code: "21EVS56", cie: 26, see: 25 }
        ]
      },
      {
        usn: "1MS22IS015", name: "Vinay Kumar",
        marks: [
          { code: "21IS51", cie: 18, see: 14 }, // Fail in Automata
          { code: "21IS52", cie: 19, see: 13 }, // Fail in Networks
          { code: "21IS53", cie: 24, see: 22 },
          { code: "21IS54", cie: 22, see: 21 },
          { code: "21ISL55", cie: 28, see: 27 },
          { code: "21EVS56", cie: 22, see: 21 }
        ]
      }
    ]
  }
};
