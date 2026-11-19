# VTU Result Sheet Analyzer & Department Performance Portal

A fully functional, responsive, modern web application designed for engineering colleges affiliated with **Visvesvaraya Technological University (VTU)** to process, analyze, and visualize department semester result sheets.

---

## 🎯 Features

1. **Department Top 10 Toppers Leaderboard**:
   - Dynamic podium for **Rank 1 (Gold)**, **Rank 2 (Silver)**, and **Rank 3 (Bronze)**.
   - Comprehensive Top 10 ranking table based on VTU SGPA, total marks obtained, and zero backlog criteria.
   - One-click student result card modal showing detailed subject breakdown.

2. **VTU Class Award Classification**:
   - **First Class with Distinction (FCD)**: SGPA $\ge 7.75$ (or $\ge 70\%$) with no active backlogs.
   - **First Class (FC)**: $6.75 \le \text{SGPA} < 7.75$ (or $60\% - 69.99\%$).
   - **Second Class (SC)**: $5.75 \le \text{SGPA} < 6.75$ (or $50\% - 59.99\%$).
   - **Pass Class**: $4.00 \le \text{SGPA} < 5.75$.
   - **Failures / Backlogs**: Students with CIE $< 20$, SEE $< 18$, or Total $< 40$ in any subject.

3. **Failure & Remedial Action Center**:
   - Highlights all students having active backlogs with exact subject codes and names.
   - Classifies reasons for failure: CIE shortfall, SEE shortfall, or Absent.
   - Direct CSV export for remedial classes and re-examination scheduling.

4. **Subject-wise Performance Matrix**:
   - Department pass percentage per theory and lab subject.
   - Average CIE (Internal) vs SEE (External) scores to identify tough subjects.
   - Failure hotspots visualization with color-coded pass bars.

5. **Visual Charts & Executive KPIs**:
   - Class distribution doughnut chart (FCD vs FC vs SC vs Fail).
   - Subject-wise pass/fail rates bar chart.
   - Overall department pass rate, average SGPA, and top SGPA.

6. **File Import & Parsing**:
   - **Excel (.xlsx, .xls)** and **CSV** uploader with automatic subject column detection.
   - **Raw Text / Web Result Ledger Parser**: Paste result text or USNs directly from VTU web portal.
   - Pre-loaded authentic datasets: 7th Sem Computer Science (60+ students) and 5th Sem Information Science.
   - Bundled downloadable `sample_vtu_results.csv` template.

7. **Reports & Exports**:
   - Export Top 10 Toppers to CSV.
   - Export Complete Department Result Analysis Ledger to CSV.
   - Export Backlog & Remedial List to CSV.
   - **Official Print / PDF View**: Formatted for HOD & Principal sign-off blocks.

---

## 🚀 How to Run the Website

### Option 1: Direct Browser Launch
Simply double-click or open `index.html` in any web browser (Opera, Chrome, Edge, etc.):
```text
C:\Users\RASHMI M\.gemini\antigravity\scratch\vtu-result-analyzer\index.html
```

### Option 2: Local Web Server (PowerShell)
Run the included zero-dependency PowerShell HTTP server:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-server.ps1
```
Then visit:
```
http://localhost:8080
```

---

## 📊 File Structure
- `index.html`: Main responsive dashboard with Tailwind CSS, Chart.js, and Lucide icons.
- `app.js`: Core VTU calculation logic, SGPA algorithms, filters, search, and chart engines.
- `sample-data.js`: Authentic sample datasets for testing.
- `sample_vtu_results.csv`: Ready-to-use CSV template for college result sheets.
- `styles.css`: Custom animations, podium styles, and print media layouts.
- `start-server.ps1`: Lightweight local HTTP server.
