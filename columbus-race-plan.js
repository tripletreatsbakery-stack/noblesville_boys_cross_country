// Temporary Columbus meet data and presentation.
// Remove this file, its script tag, the build call in app.js, and the matching
// CSS section after the meet.
(function () {
const talkToBlakeAthletes = new Set([
        "banner barnes",
        "isaiah vohs",
        "jack rush",
        "gavin flynn",
        "matt huseman",
        "cohen baumer",
        "josh moller",
        "parker applegate",
        "kolten simpson",
        "tyler stallings",
        "john ensley",
        "braune naville"
    ]);

    function normalizeName(value) {
        return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
    }

    function escapeHTML(value) {
        return String(value || "").replace(/[&<>"']/g, character => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
        })[character]);
    }

    window.buildColumbusRacePlanHTML = function (fullName, neighborhood = null) {
        const anchors = [neighborhood?.anchor_1, neighborhood?.anchor_2]
            .filter(Boolean).join(" / ");
        const raceGroup = ["faster_1", "faster_2", "faster_3", "peer_1", "peer_2"]
            .map(key => neighborhood?.[key]).filter(Boolean).join(" / ");
        const field = (label, value, className = "") => `
            <div class="columbus-plan-field ${className}">
                <div class="columbus-plan-label">${label}</div>
                <div class="columbus-plan-value">${escapeHTML(value) || "&mdash;"}</div>
            </div>`;

        const fields = talkToBlakeAthletes.has(normalizeName(fullName))
            ? field("Packmate", "Talk to Blake", "columbus-plan-solo")
            : `
                ${anchors ? field("Anchors", anchors) : ""}
                ${raceGroup ? field("Race Group", raceGroup) : ""}`;

        if (!fields.trim()) return "";

        return `
            <section class="card columbus-plan-card" aria-labelledby="columbus-plan-title">
                <h3 id="columbus-plan-title">RACE PLAN</h3>
                <div class="columbus-plan-grid">
                    ${fields}
                </div>
            </section>`;
    };
})();
