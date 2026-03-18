// Ensure page fully loaded
window.addEventListener("load", function () {

    if (!window.CONFIG) {
        document.getElementById("status").innerText = "CONFIG not loaded";
        return;
    }

    const base = CONFIG.SUPABASE_URL + "/rest/v1/";
    const apiKey = CONFIG.SUPABASE_KEY;

    let allData = [];
    let courseData = [];

    Promise.all([
        fetch(base + "v_athlete_physiology", {
            headers: {
                "apikey": apiKey,
                "Authorization": "Bearer " + apiKey
            }
        }).then(r => r.json()),

        fetch(base + "v_active_athlete_prs_pivot", {
            headers: {
                "apikey": apiKey,
                "Authorization": "Bearer " + apiKey
            }
        }).then(r => r.json())
    ])
    .then(([phys, courses]) => {

        if (!phys || phys.length === 0) {
            document.getElementById("status").innerText = "No data returned";
            return;
        }

        allData = phys;
        courseData = courses || [];

        document.getElementById("status").innerText =
            "Loaded " + phys.length + " athletes";

        allData.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));

        const dropdown = document.getElementById("athleteDropdown");
        dropdown.innerHTML = "";

        allData.forEach((athlete, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = athlete.full_name;
            dropdown.appendChild(option);
        });

        showAthlete(0);

        dropdown.addEventListener("change", (e) => {
            showAthlete(e.target.value);
        });

    });

    // ---------- helpers ----------

    function formatTime(seconds) {
        if (seconds == null) return "-";
        const min = Math.floor(seconds / 60);
        const sec = (seconds % 60).toFixed(2).padStart(5, "0");
        return `${min}:${sec}`;
    }

    function getAthleteLabel(type) {
        switch (type) {
            case "speed": return "Speed Builder";
            case "endurance-leaning": return "Endurance Strength";
            case "balanced": return "Balanced Runner";
            default: return "Developing Runner";
        }
    }

    function getFocus(group) {
        switch (group) {
            case "speed_development":
                return "Build endurance to improve 5K strength (tempo + longer intervals)";
            case "aerobic_development":
                return "Increase aerobic capacity for stronger 5K finishes";
            case "distance":
                return "Maintain endurance and sharpen race pace for 5K";
            default:
                return "-";
        }
    }

    function getCourseRows(athleteId) {
        const row = courseData.find(r => r.athlete_id === athleteId);
        if (!row) return "";

        return Object.entries(row)
            .filter(([k, v]) =>
                k !== "athlete_id" &&
                k !== "full_name" &&
                v !== null &&
                v !== ""
            )
            .map(([k, v]) => `
                <div class="course-item">
                    <label>${k.replace(/_/g, " ")}</label>
                    <span>${v}</span>
                </div>
            `)
            .join("");
    }

    // ---------- render ----------

    function showAthlete(index) {
        const a = allData[index];
        if (!a) return;

        const coursesHTML = getCourseRows(a.athlete_id);

        document.getElementById("athleteData").innerHTML = `
            <div class="card">

                <h2>${a.full_name}</h2>

                <div class="identity">
                    <div class="you-are">YOU ARE</div>
                    <div class="type">${getAthleteLabel(a.runner_type_multi)}</div>
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
                    <p>${getFocus(a.training_group)}</p>
                </div>

            </div>

            ${coursesHTML ? `
                <div class="card courses">
                    <h3>COURSE TIMES</h3>
                    <div class="course-grid">
                        ${coursesHTML}
                    </div>
                </div>
            ` : ""}
        `;
    }

});
