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

    function formatTime(seconds) {
        if (seconds === null || seconds === undefined) return "-";
        const min = Math.floor(seconds / 60);
        const sec = (seconds % 60).toFixed(2).padStart(5, "0");
        return `${min}:${sec}`;
    }

    function showAthlete(index) {
        const a = allData[index];
        if (!a) return;

        const container = document.getElementById("athleteData");

        container.innerHTML = `
            <h2>${a.full_name || "Unknown"}</h2>
            <p><b>800:</b> ${formatTime(a.pr_800_seconds)}</p>
            <p><b>1600:</b> ${formatTime(a.pr_1600_seconds)}</p>
            <p><b>3200:</b> ${formatTime(a.pr_3200_seconds)}</p>
            <p><b>5000:</b> ${formatTime(a.pr_5000_seconds)}</p>
            <p><b>SER Ratio:</b> ${a.ser_ratio ?? "-"}</p>
            <p><b>Running Type:</b> ${a.runner_type ?? "-"}</p>
        `;
    }

});
