window.addEventListener("load", function () {

    const base = CONFIG.SUPABASE_URL + "/rest/v1/";
    const apiKey = CONFIG.SUPABASE_KEY;

    const headers = {
        "apikey": apiKey,
        "Authorization": "Bearer " + apiKey
    };

    let physData = [];
    let courseData = [];
    let yearData = [];
    let trainingData = [];

    Promise.all([
        fetch(base + "v_athlete_physiology", { headers }).then(r => r.json()),
        fetch(base + "v_active_athlete_prs_pivot", { headers }).then(r => r.json()),
        fetch(base + "v_athlete_5k_years_wide", { headers }).then(r => r.json()),
        fetch(base + "v_athlete_training_output", { headers }).then(r => r.json())
    ])
    .then(([phys, courses, years, training]) => {

        physData = phys;
        courseData = courses || [];
        yearData = years || [];
        trainingData = training || [];

        document.getElementById("status").innerText =
            "Loaded " + physData.length + " athletes";

        const dropdown = document.getElementById("athleteDropdown");
        dropdown.innerHTML = "";

        physData.sort((a, b) => a.full_name.localeCompare(b.full_name));

        physData.forEach((a, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = a.full_name;
            dropdown.appendChild(opt);
        });

        showAthlete(0);

        dropdown.addEventListener("change", e => {
            showAthlete(e.target.value);
        });
    });

    // ---------- helpers ----------

    function getTraining(name) {
        return trainingData.find(r => r.full_name === name);
    }

    function getCourses(id) {
        const row = courseData.find(r => r.athlete_id === id);
        if (!row) return "";

        return Object.entries(row)
            .filter(([k, v]) => k !== "athlete_id" && k !== "full_name" && v)
            .map(([k, v]) => `
                <div class="course-item">
                    <label>${k.replace(/_/g, " ")}</label>
                    <span>${v}</span>
                </div>
            `).join("");
    }

    function getYearRow(name) {
        return yearData.find(r => r.full_name === name);
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

    function buildYearHTML(row) {
        if (!row) return "No data";

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
            `).join("");

        const imp = getImprovement(row);

        return `
            <div class="year-grid">${blocks}</div>
            ${imp ? `<div class="improvement">↓ ${imp} since freshman</div>` : ""}
        `;
    }

    function formatTime(sec) {
        if (!sec) return "-";
        const m = Math.floor(sec / 60);
        const s = (sec % 60).toFixed(2).padStart(5, "0");
        return `${m}:${s}`;
    }

    // ---------- 2D MAP ----------

    function normalize(val, min, max) {
        if (val == null) return 0.5;
        let n = (val - min) / (max - min);
        return Math.max(0, Math.min(1, n));
    }

    function get2DPosition(t) {
        const serMin = 1.023;
        const serMax = 1.164;

        const speedMin = 0.0;
        const speedMax = 0.13;

        const x = normalize(t.speed_reserve_ratio, speedMin, speedMax);
        const y = normalize(t.ser_estimate_raw, serMin, serMax);

        return {
            x: x * 100,
            y: (1 - y) * 100
        };
    }

    function build2DMap(t) {
        const pos = get2DPosition(t);

        return `
            <div class="quad">
                <div class="dot" style="left:${pos.x}%; top:${pos.y}%;"></div>
            </div>
        `;
    }

    function labelMap(g) {
        if (!g) return "Developing";
        if (g === "speed") return "Speed";
        if (g === "distance") return "Endurance";
        return "Balanced";
    }

    function focusMap(f) {
        const map = {
            balanced: "Maintain balance",
            general_development: "Build base endurance",
            speed_support: "Add speed + turnover",
            aerobic_priority: "Build aerobic strength",
            speed_priority: "Develop speed"
        };
        return map[f] || "-";
    }

    // ---------- render ----------

    function showAthlete(i) {
        const a = physData[i];
        const t = getTraining(a.full_name);
        const courses = getCourses(a.athlete_id);
        const years = getYearRow(a.full_name);

        document.getElementById("athleteData").innerHTML = `

        <div class="card training">
            <h2>${a.full_name}</h2>

            <div class="you-are">YOU ARE</div>
            <div class="type">${labelMap(t?.training_group)}</div>

            ${t ? build2DMap(t) : ""}

            <div class="focus-block">
                <label>FOCUS</label>
                <p>${focusMap(t?.focus_type)}</p>
            </div>

            <div class="action-block">
                <label>NEXT ACTION</label>
                <p>${t?.next_action || "-"}</p>
            </div>
        </div>

        <div class="card">
            <h3>PRs</h3>
            <div class="pr-grid">
                <div><label>800</label><span>${formatTime(a.pr_800_seconds)}</span></div>
                <div><label>1600</label><span>${formatTime(a.pr_1600_seconds)}</span></div>
                <div><label>3200</label><span>${formatTime(a.pr_3200_seconds)}</span></div>
                <div><label>4000</label><span>${formatTime(a.pr_4000_seconds)}</span></div>
                <div><label>5000</label><span>${formatTime(a.pr_5000_seconds)}</span></div>
            </div>
        </div>

        <div class="card">
            <h3>HISTORY</h3>

            <div class="course-layout">

                <div>
                    <h4>Courses</h4>
                    <div class="course-grid">${courses}</div>
                </div>

                <div>
                    <h4>Progression</h4>
                    ${buildYearHTML(years)}
                </div>

            </div>
        </div>
        `;
    }

});
