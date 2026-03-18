// Ensure page fully loaded
window.addEventListener("load", function () {

    if (!window.CONFIG) {
        document.getElementById("status").innerText = "CONFIG not loaded";
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
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
    })
    .then(data => {

        if (!data || data.length === 0) {
            document.getElementById("status").innerText = "No data returned";
            return;
        }

        document.getElementById("status").innerText =
            "Loaded " + data.length + " athletes";

        data.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));
        allData = data;

        const dropdown = document.getElementById("athleteDropdown");
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
    });

    // ---------- Helpers ----------

    function formatTime(seconds) {
        if (seconds == null) return "-";
        const min = Math.floor(seconds / 60);
        const sec = (seconds % 60).toFixed(2).padStart(5, "0");
        return `${min}:${sec}`;
    }

    function formatNumber(val) {
        if (val == null) return "-";
        return Number(val).toFixed(2);
    }

    function getAthleteLabel(type) {
        switch (type) {
            case "speed": return "Speed Builder";
            case "endurance-leaning": return "Endurance Strength";
            case "balanced": return "Balanced Runner";
            default: return "Developing Runner";
        }
    }

    function getConfidenceLabel(conf) {
        if (conf === "high") return "High Confidence";
        if (conf === "low") return "Early Data";
        return "";
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

    function getProgress(val) {
        if (val == null) return 0;
        const min = -0.2;
        const max = 0.2;
        let pct = (val - min) / (max - min);
        pct = Math.max(0, Math.min(1, pct));
        return Math.round(pct * 100);
    }

    // ---------- Render ----------

    function showAthlete(index) {
        const a = allData[index];
        if (!a) return;

        const progress = getProgress(a.speed_reserve_ratio);

        document.getElementById("athleteData").innerHTML = `
            <div class="card">

                <h2>${a.full_name}</h2>

                <div class="identity">
                    <div class="you-are">YOU ARE</div>
                    <div class="type">${getAthleteLabel(a.runner_type_multi)}</div>
                    <div class="confidence">${getConfidenceLabel(a.confidence_level)}</div>
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

                    <div class="gauge">
                        <div class="gauge-bar">
                            <div class="gauge-fill" style="width:${progress}%"></div>
                        </div>
                        <div class="gauge-label">
                            ${progress}% toward next level
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

});
