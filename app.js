window.addEventListener("load", function () {

    const base = CONFIG.SUPABASE_URL + "/rest/v1/";
    const apiKey = CONFIG.SUPABASE_KEY;

    const headers = {
        "apikey": apiKey,
        "Authorization": "Bearer " + apiKey
    };

    let physData = [];
    let prData = [];
    let meetData = [];
    let yearData = [];
    let trainingData = [];

    Promise.all([
        fetch(base + "v_athlete_physiology", { headers }).then(r => r.json()),
        fetch(base + "v_athlete_prs", { headers }).then(r => r.json()),
        fetch(base + "v_active_athlete_prs_pivot", { headers }).then(r => r.json()),
        fetch(base + "v_athlete_5k_years_wide", { headers }).then(r => r.json()),
        fetch(base + "v_athlete_pace_bands_v2", { headers }).then(r => r.json())
    ])
    .then(([phys, prs, meets, years, training]) => {

        physData = phys;
        prData = prs || [];
        meetData = meets || [];
        yearData = years || [];
        trainingData = training || [];

        document.getElementById("status").innerText =
            "Loaded " + physData.length + " athletes";

        const dropdown = document.getElementById("athleteDropdown");

        dropdown.innerHTML = "";

        physData.sort((a, b) =>
            a.full_name.localeCompare(b.full_name)
        );

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

    // =========================================
    // HELPERS
    // =========================================

    function getTraining(name) {

        return trainingData.find(r =>
            r.full_name === name
        );
    }

    function getPRs(id) {

        return prData.find(r =>
            r.athlete_id === id
        );
    }

    function getMeetPRs(id) {

        return meetData.find(r =>
            r.athlete_id === id
        );
    }

    function getYearRow(name) {

        return yearData.find(r =>
            r.full_name === name
        );
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

        const sec = (d % 60)
            .toFixed(0)
            .padStart(2, "0");

        return `${m}:${sec}`;
    }

    function formatLabel(v) {

        if (!v) return "-";

        return v
            .replace(/_/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    function formatPaceFrom5k(timeStr) {

        if (!timeStr) return "-";

        const [m, s] = timeStr.split(":");

        const totalSec =
            parseInt(m) * 60 + parseFloat(s);

        const paceSec = totalSec / 3.10686;

        const paceMin = Math.floor(paceSec / 60);

        const paceRemain = Math.round(paceSec % 60)
            .toString()
            .padStart(2, "0");

        return `${paceMin}:${paceRemain}/mi`;
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

                    <div class="year-left">
                        <label>${label}</label>
                    </div>

                    <div class="year-right">

                        <span>${val}</span>

                        <div class="year-pace">
                            ${formatPaceFrom5k(val)}
                        </div>

                    </div>

                </div>
            `)
            .join("");

        const imp = getImprovement(row);

        return `
            <div class="year-grid">${blocks}</div>
            ${imp ? `<div class="improvement">↓ ${imp} since freshman</div>` : ""}
        `;
    }

function buildGoalPaceHTML(pr5000) {

    let minutes = 18;
    let seconds = 0;

    if (pr5000) {

        const parts = pr5000.split(":");

        minutes = parseInt(parts[0]);

        seconds = Math.round(parseFloat(parts[1]));

        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
    }

    const minuteOptions = [];

    for (let i = 14; i <= 30; i++) {

        minuteOptions.push(`
            <option value="${i}" ${i === minutes ? "selected" : ""}>
                ${i}
            </option>
        `);
    }

    const secondOptions = [];

    for (let i = 0; i < 60; i++) {

        secondOptions.push(`
            <option value="${i}" ${i === seconds ? "selected" : ""}>
                ${String(i).padStart(2, "0")}
            </option>
        `);
    }

    return `

    <div class="card goal-pace-card">

        <h3>GOAL PACE</h3>

        <div id="goalPaceResults">

            <div class="goal-grid">

                <div class="goal-column">

                    <div class="goal-heading">
                        Goal Time
                    </div>

                    <div class="goal-picker">

                        <select id="goalMinutes">
                            ${minuteOptions.join("")}
                        </select>

                        <div class="goal-colon">:</div>

                        <select id="goalSeconds">
                            ${secondOptions.join("")}
                        </select>

                    </div>

                </div>

                <div class="goal-column">

                    <div class="goal-heading">
                        Kilometers
                    </div>

                    <div class="goal-row"><span>1K</span><strong>--:--</strong></div>
                    <div class="goal-row"><span>2K</span><strong>--:--</strong></div>
                    <div class="goal-row"><span>3K</span><strong>--:--</strong></div>
                    <div class="goal-row"><span>4K</span><strong>--:--</strong></div>
                    <div class="goal-row"><span>5K</span><strong>--:--</strong></div>

                </div>

                <div class="goal-column">

                    <div class="goal-heading">
                        Miles
                    </div>

                    <div class="goal-row"><span>1M</span><strong>--:--</strong></div>
                    <div class="goal-row"><span>2M</span><strong>--:--</strong></div>
                    <div class="goal-row"><span>3M</span><strong>--:--</strong></div>

                </div>

            </div>

        </div>

    </div>

    `;
}
    // =========================================
    // RENDER
    // =========================================

    function showAthlete(i) {

        const a = physData[i];

        const prs = getPRs(a.athlete_id);

        const meetPRs = getMeetPRs(a.athlete_id);

        const t = getTraining(a.full_name);

        const years = getYearRow(a.full_name);

        document.getElementById("athleteData").innerHTML = `

        <div class="card training">

            <h2>${a.full_name}</h2>

            <div class="athlete-profile">

                <div class="athlete-type">
                    ${formatLabel(t?.runner_type)}
                </div>

                <div class="athlete-focus">
                    ${formatLabel(t?.training_focus)}
                </div>

            </div>

        </div>
<div class="card pace-zones-card">

    <h3>PACE ZONES</h3>

    <div class="pace-scroll">

        <div class="pace-card">

            <div class="pace-zone">
                ZONE 1
            </div>

            <div class="pace-icon">
                ↻
            </div>

            <div class="pace-range">
                ${t?.recovery_min_pace || "-"}
                -
                ${t?.recovery_max_pace || "-"}
            </div>

            <div class="pace-unit">
                min/mi
            </div>

            <div class="pace-effort">
                Full conversation
            </div>

            <div class="pace-title">
                RECOVERY
            </div>

        </div>

        <div class="pace-card">

            <div class="pace-zone">
                ZONE 2
            </div>

            <div class="pace-icon">
                ♡
            </div>

            <div class="pace-range">
                ${t?.aerobic_easy_min_pace || "-"}
                -
                ${t?.aerobic_easy_max_pace || "-"}
            </div>

            <div class="pace-unit">
                min/mi
            </div>

            <div class="pace-effort">
                Easy conversation
            </div>

            <div class="pace-title">
                AEROBIC EASY
            </div>

        </div>

        <div class="pace-card">

            <div class="pace-zone">
                ZONE 3
            </div>

            <div class="pace-icon">
                ∿
            </div>

            <div class="pace-range">
                ${t?.steady_min_pace || "-"}
                -
                ${t?.steady_max_pace || "-"}
            </div>

            <div class="pace-unit">
                min/mi
            </div>

            <div class="pace-effort">
                Short sentences
            </div>

            <div class="pace-title">
                STEADY
            </div>

        </div>

        <div class="pace-card">

            <div class="pace-zone">
                ZONE 4
            </div>

            <div class="pace-icon">
                ◔
            </div>

            <div class="pace-range">
                ${t?.threshold_min_pace || "-"}
                -
                ${t?.threshold_max_pace || "-"}
            </div>

            <div class="pace-unit">
                min/mi
            </div>

            <div class="pace-effort">
                3-5 words
            </div>

            <div class="pace-title">
                THRESHOLD
            </div>

        </div>

        <div class="pace-card">

            <div class="pace-zone">
                ZONE 5
            </div>

            <div class="pace-icon">
                ⚡
            </div>

            <div class="pace-range">
                ${t?.cv_min_pace || "-"}
                -
                ${t?.cv_max_pace || "-"}
            </div>

            <div class="pace-unit">
                min/mi
            </div>

            <div class="pace-effort">
                Single words only
            </div>

            <div class="pace-title">
                CV
            </div>

        </div>

        <div class="pace-card">

            <div class="pace-zone">
                ZONE 5
            </div>

            <div class="pace-icon">
                ◉
            </div>

            <div class="pace-range">
                ${t?.vo2_min_pace || "-"}
                -
                ${t?.vo2_max_pace || "-"}
            </div>

            <div class="pace-unit">
                min/mi
            </div>

            <div class="pace-effort">
                No talking
            </div>

            <div class="pace-title">
                VO2
            </div>

        </div>

    </div>

</div>
</div>
${buildGoalPaceHTML(prs?.pr_5000_raw)}
        <div class="card">

            <h3>PRs</h3>

            <div class="pr-grid">

                <div>

                    <label>800</label>

                    <span>
                        ${prs?.pr_800_raw || "-"}
                    </span>

                    <div class="pr-date">
                        ${prs?.pr_800_date || ""}
                    </div>

                </div>

                <div>

                    <label>1600</label>

                    <span>
                        ${prs?.pr_1600_raw || "-"}
                    </span>

                    <div class="pr-date">
                        ${prs?.pr_1600_date || ""}
                    </div>

                </div>

                <div>

                    <label>3200</label>

                    <span>
                        ${prs?.pr_3200_raw || "-"}
                    </span>

                    <div class="pr-date">
                        ${prs?.pr_3200_date || ""}
                    </div>

                </div>

                <div>

                    <label>4000</label>

                    <span>
                        ${prs?.pr_4000_raw || "-"}
                    </span>

                    <div class="pr-date">
                        ${prs?.pr_4000_date || ""}
                    </div>

                </div>

                <div>

                    <label>5000</label>

                    <span>
                        ${prs?.pr_5000_raw || "-"}
                    </span>

                    <div class="pr-date">
                        ${prs?.pr_5000_date || ""}
                    </div>

                </div>

            </div>

        </div>

        <div class="card">

            <h3>DEVELOPMENT</h3>

            <div class="course-layout">

                <div>

                    <h4>MEET PRs</h4>

                    <div class="course-grid">

                        ${Object.entries(meetPRs || {})
                            .filter(([k, v]) =>
                                k !== "athlete_id" &&
                                k !== "full_name" &&
                                v
                            )
                            .map(([k, v]) => `
                                <div class="course-item">
                                    <label>
                                        ${k.replace(/_/g, " ")}
                                    </label>
                                    <span>${v}</span>
                                </div>
                            `)
                            .join("")}

                    </div>

                </div>

                <div>

                    <h4>YEARLY PRs</h4>

                    ${buildYearHTML(years)}

                </div>

            </div>

        </div>
        `;
    }

});
