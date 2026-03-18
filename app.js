window.addEventListener("load", function () {

    const base = CONFIG.SUPABASE_URL + "/rest/v1/";
    const apiKey = CONFIG.SUPABASE_KEY;

    const headers = {
        "apikey": apiKey,
        "Authorization": "Bearer " + apiKey
    };

    let allData = [];
    let courseData = [];
    let yearData = [];

    Promise.all([
        fetch(base + "v_athlete_physiology", { headers }).then(r => r.json()),
        fetch(base + "v_active_athlete_prs_pivot", { headers }).then(r => r.json()),
        fetch(base + "v_athlete_5k_years_wide", { headers }).then(r => r.json())
    ])
    .then(([phys, courses, years]) => {

        allData = phys;
        courseData = courses || [];
        yearData = years || [];

        document.getElementById("status").innerText =
            "Loaded " + allData.length + " athletes";

        const dropdown = document.getElementById("athleteDropdown");
        dropdown.innerHTML = "";

        allData.sort((a, b) => a.full_name.localeCompare(b.full_name));

        allData.forEach((a, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = a.full_name;
            dropdown.appendChild(opt);
        });

        showAthlete(0);

        dropdown.addEventListener("change", (e) => {
            showAthlete(e.target.value);
        });
    });

    // ---------- helpers ----------

    function formatTime(sec) {
        if (!sec) return "-";
        const m = Math.floor(sec / 60);
        const s = (sec % 60).toFixed(2).padStart(5, "0");
        return `${m}:${s}`;
    }

    function timeToSeconds(t) {
        if (!t) return null;
        const [m, s] = t.split(":");
        return parseInt(m) * 60 + parseFloat(s);
    }

    function getImprovement(row) {
        if (!row) return null;

        const f = timeToSeconds(row.freshman_pr);
        const s =
            timeToSeconds(row.senior_pr) ||
            timeToSeconds(row.junior_pr) ||
            timeToSeconds(row.sophomore_pr);

        if (!f || !s) return null;

        const d = f - s;
        const m = Math.floor(d / 60);
        const sec = (d % 60).toFixed(0).padStart(2, "0");

        return `${m}:${sec}`;
    }

    function getYearRow(name) {
        return yearData.find(r => r.full_name === name);
    }

    function getCourseRows(id) {
        const row = courseData.find(r => r.athlete_id === id);
        if (!row) return "";

        return Object.entries(row)
            .filter(([k, v]) =>
                k !== "athlete_id" &&
                k !== "full_name" &&
                v
            )
            .map(([k, v]) => `
                <div class="course-item">
                    <label>${k.replace(/_/g, " ")}</label>
                    <span>${v}</span>
                </div>
            `)
            .join("");
    }

    function buildYearHTML(row) {
        if (!row) return "<div class='empty'>No data</div>";

        const years = [
            ["Freshman", row.freshman_pr],
            ["Sophomore", row.sophomore_pr],
            ["Junior", row.junior_pr],
            ["Senior", row.senior_pr]
        ];

        const blocks = years
            .filter(([_, v]) => v)
            .map(([label, val]) => `
                <div class="year-item">
                    <label>${label}</label>
                    <span>${val}</span>
                </div>
            `)
            .join("");

        const improvement = getImprovement(row);

        return `
            <div class="year-grid">${blocks}</div>
            ${
                improvement
                    ? `<div class="improvement">
                        ↓ ${improvement} since freshman
                       </div>`
                    : ""
            }
        `;
    }

    function getLabelFromGroup(group) {
        if (!group) return "Balanced";

        if (group.includes("speed")) return "Speed";
        if (group.includes("aerobic") || group.includes("distance")) return "Endurance";

        return "Balanced";
    }

    // ---------- GAUGE ----------

    function getSpectrumPosition(val) {
        if (val == null) return 50;

        const min = 0.85;
        const max = 1.15;

        let pct = (val - min) / (max - min);
        pct = Math.max(0, Math.min(1, pct));

        return Math.round(pct * 100);
    }

    function buildGauge(a) {
        const pos = getSpectrumPosition(a.ser_multi);

        return `
            <div class="spectrum">

                <div class="labels">
                    <span>SPEED</span>
                    <span>BALANCED</span>
                    <span>ENDURANCE</span>
                </div>

                <div class="bar">
                    <div class="marker" style="left:${pos}%"></div>
                </div>

            </div>
        `;
    }

    // ---------- render ----------

    function showAthlete(i) {
        const a = allData[i];
        if (!a) return;

        const courses = getCourseRows(a.athlete_id);
        const years = getYearRow(a.full_name);

        document.getElementById("athleteData").innerHTML = `
            <div class="card">

                <h2>${a.full_name}</h2>

                <div class="identity">
                    <div class="you-are">YOU ARE</div>
                    <div class="type">${getLabelFromGroup(a.training_group)}</div>
                    ${buildGauge(a)}
                </div>

                <div class="section prs">
                    <h3>PRs</h3>
                    <div class="pr-grid">
                        <div><label>800</label><span>${formatTime(a.pr_800_seconds)}</span></div>
                        <div><label>1600</label><span>${formatTime(a.pr_1600_seconds)}</span></div>
                        <div><label>3200</label><span>${formatTime(a.pr_3200_seconds)}</span></div>
                        <div><label>4000</label><span>${formatTime(a.pr_4000_seconds)}</span></div>
                        <div><label>5000</label><span>${formatTime(a.pr_5000_seconds)}</span></div>
                    </div>
                </div>

                <div class="section focus">
                    <h3>FOCUS</h3>
                    <p>${
                        a.training_group === "speed_development"
                            ? "Build endurance to improve 5K strength"
                            : a.training_group === "aerobic_development"
                            ? "Increase aerobic capacity for stronger finishes"
                            : "-"
                    }</p>
                </div>

            </div>

            ${(courses || years) ? `
            <div class="card courses">

                <h3>COURSE & PROGRESSION</h3>

                <div class="course-layout">

                    <div>
                        <h4>Course Times</h4>
                        <div class="course-grid">${courses}</div>
                    </div>

                    <div>
                        <h4>Progression</h4>
                        ${buildYearHTML(years)}
                    </div>

                </div>

            </div>
            ` : ""}
        `;
    }

});
