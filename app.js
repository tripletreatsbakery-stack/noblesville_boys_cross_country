// Ensure page fully loaded
window.addEventListener("load", function () {

    if (!window.CONFIG) {
        document.getElementById("status").innerText = "CONFIG not loaded";
        console.error("CONFIG missing");
        return;
    }

    const url = CONFIG.SUPABASE_URL + "/rest/v1/v_athlete_physiology";
    const apiKey = CONFIG.SUPABASE_KEY;

    let allData = [];

    fetch(url, {
        headers: {
            "apikey": apiKey,
            "Authorization": "Bearer " + apiKey,
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("HTTP error " + res.status);
        }
        return res.json();
    })
    .then(data => {

        console.log("DATA:", data);

        if (!data || data.length === 0) {
            document.getElementById("status").innerText = "No data returned";
            return;
        }

        document.getElementById("status").innerText =
            "Loaded " + data.length + " athletes";

        // sort alphabetically
        data.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));

        allData = data;

        const dropdown = document.getElementById("athleteDropdown");

        // prevent duplicates on reload
        dropdown.innerHTML = "";

        data.forEach((athlete, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = athlete.full_name || "Unknown";
            dropdown.appendChild(option);
        });

        showAthlete(0);

        dropdown.addEventListener("change", (e) => {
            showAthlete(e.target.value);
        });

    })
    .catch(err => {
        document.getElementById("status").innerText = "Error: " + err.message;
        console.error(err);
    });

    // ---------- Helpers ----------

    function formatTime(seconds) {
        if (seconds === null || seconds === undefined) return "-";
        const min = Math.floor(seconds / 60);
        const sec = (seconds % 60).toFixed(2).padStart(5, "0");
        return `${min}:${sec}`;
    }

    function formatNumber(val) {
        if (val === null || val === undefined) return "-";
        return Number(val).toFixed(2);
    }

    function formatSeconds(val) {
        if (val === null || val === undefined) return "-";
        return Number(val).toFixed(1) + "s";
    }

    function getFocus(group) {
        if (!group) return "-";

        switch (group) {
            case "aerobic_development":
                return "Build aerobic strength (tempo, long intervals)";
            case "speed_development":
                return "Develop speed + turnover (strides, short reps)";
            case "distance":
                return "Race endurance (threshold + sustained efforts)";
            default:
                return "-";
        }
    }

    // ---------- Render ----------
function showAthlete(index) {
    const a = allData[index];
    if (!a) return;

    const container = document.getElementById("athleteData");

    container.innerHTML = `
        <div class="card">

            <h2>${a.full_name || "Unknown"}</h2>

            <div class="badges">
                <span class="badge type-${a.runner_type_multi || "unknown"}">
                    ${a.runner_type_multi || "unknown"}
                </span>
                <span class="badge confidence-${a.confidence_level || "none"}">
                    ${a.confidence_level || "none"}
                </span>
            </div>

            <!-- PR SECTION -->
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

            <!-- TRAINING PROFILE -->
            <div class="section profile">
                <h3>Training Profile</h3>
                <p><b>SER Multi:</b> ${formatNumber(a.ser_multi)}</p>
                <p><b>Speed Reserve:</b> ${formatSeconds(a.speed_reserve_seconds)}</p>
                <p><b>Ratio:</b> ${formatNumber(a.speed_reserve_ratio)}</p>
                <p><b>Group:</b> ${a.training_group || "-"}</p>
            </div>

            <!-- TRAINING FOCUS -->
            <div class="section focus">
                <h3>Training Focus</h3>
                <p>${getFocus(a.training_group)}</p>
            </div>

        </div>
    `;
}

});
