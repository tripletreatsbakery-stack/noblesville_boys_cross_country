// Temporary Columbus meet data and presentation.
// Remove this file, its script tag, the build call in app.js, and the matching
// CSS section after the meet.
(function () {
    const plans = {
        "AJ Dumser": ["2500m","You finished stronger than peers; begin working forward at halfway"],
        "Andersen Horbett": ["3000m","Your track time suggests more ability; stay comfortable then test it after 3K"],
        "Banner Barnes": ["2500m","Stay composed early then begin applying pressure at halfway"],
        "Ben Graham": ["3000m","Stay comfortable in the group then compete over the final 2K"],
        "Brady McFall": ["3000m","You held up well at County; begin moving after 3K"],
        "Braune Naville": ["2500m","You finished strongly; stay controlled early then begin moving"],
        "Brayden Adams": ["3000m","Stay with the pack through 3K then begin passing"],
        "Brayden Clark": ["3500m","Remain tucked into the pack and save your move for the final mile"],
        "Bryson Cronin-Warren": ["3500m","Stay tucked in and save your move for the final mile"],
        "Camden Clark": ["2500m","You held back well at County; begin moving at halfway"],
        "Carson Gaskill": ["3000m","Stay attached through 3K then begin working forward"],
        "Chris Williams": ["3000m","Maintain continuous effort through 3K then compete with nearby runners"],
        "Cohen Baumer": ["2500m","You finished strongly at County; begin pressing at halfway"],
        "Cohen Bullock": ["2500m","Your County finish showed more ability; start moving at halfway"],
        "Colin Halvorsen": ["3000m","Stay with the pack through 3K then begin passing"],
        "Colin Howard": ["3500m","Stay patient and attached; save your move for the final mile"],
        "Dane Stewart": ["3000m","Stay comfortable with the group then compete over the final 2K"],
        "Drew Hickner": ["3000m","Use the pack to establish your 5K effort then compete after 3K"],
        "Eli Ropte": ["3000m","Run evenly with the group then begin competing after 3K"],
        "Evan Lassiter": ["2500m","Your strong County finish says you can start moving earlier"],
        "Finn Adams": ["3500m","Do not chase early moves; stay in the pack until the final mile"],
        "Gavin Flynn": ["2500m","Trust your improved fitness and begin applying pressure at halfway"],
        "Graham Yarber": ["3500m","Stay behind the pack early and race the final mile"],
        "Harris Jackson": ["3500m","Do not lead the group early; stay attached until the final mile"],
        "Harrison Umthum": ["3500m","Let the pack control your early effort and race the final mile"],
        "Inman Kjeldsen": ["3500m","Keep the effort controlled and continuous then build over the final mile"],
        "Isaiah Vohs": ["2500m","Stay connected while controlled and begin competing at halfway"],
        "Jack Rush": ["3500m","Stay relaxed with Gavin and save your move for the final mile"],
        "Jackson Thomas": ["3000m","Stay comfortable with the group then compete after 3K"],
        "Jacob Patlogar": ["3500m","Stay tucked into the pack and make one sustained final-mile move"],
        "Jayden Gedeon": ["2500m","You finished stronger than peers; begin moving at halfway"],
        "Joey Burks": ["2500m","Your track speed and strong finish suggest you can move earlier"],
        "Joey McLaughlin": ["3500m","Stay patient with the pack and make one move in the final mile"],
        "John Ensley": ["2500m","You held the second half extremely well; begin competing at halfway"],
        "Josh Moller": ["3500m","Sit behind the group early and save your move for the final mile"],
        "Kolten Simpson": ["3000m","Stay disciplined with the group then begin pressing after 3K"],
        "Lucas Cesar": ["3000m","Your halfway split belongs here; stay controlled then compete after 3K"],
        "Maddox Denison": ["2500m","You finished strongly at County; begin applying pressure at halfway"],
        "Maddox Uminski": ["3000m","Stay with the pack through 3K then begin working forward"],
        "Maddux Whaley": ["2500m","Your County finish suggests more is available; move at halfway"],
        "Matt Huseman": ["2500m","You held the second half well; begin pressing at halfway"],
        "Matthew Moor": ["2500m","Your strong second half means you can begin competing earlier"],
        "Nolan Hauck": ["3000m","Stay comfortable in the group then start passing after 3K"],
        "Parker Applegate": ["3000m","Lead only if comfortable; keep the group together through 3K"],
        "Porter Hahn": ["3500m","This pack matches your demonstrated 5K; stay tucked in and save your move for the final mile"],
        "Preston Burris": ["3000m","Stay with the group through 3K then begin competing"],
        "Tyler Hass": ["3000m","Stay connected through 3K then begin moving through runners"],
        "Tyler Stallings": ["3500m","Stay tucked into the group and save your move for the final mile"],
        "Will Davidson": ["3000m","Stay with the pack through 3K then begin passing"],
        "Wyatt Dumbris": ["2500m","You finished strongly at County; begin moving at halfway"],
        "Zander Gruber": ["3000m","Keep the group organized early then compete after 3K"]
    };

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
        const [beginMoving, instruction] = plans[fullName] || [];
        const anchor = neighborhood?.anchor;
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
                ${anchor ? field("Anchor", anchor) : ""}
                ${raceGroup ? field("Race Group", raceGroup) : ""}
                ${beginMoving ? field("Begin moving", beginMoving) : ""}
                ${instruction ? field("Individual instruction", instruction, "columbus-plan-instruction") : ""}`;

        if (!fields.trim()) return "";

        return `
            <section class="card columbus-plan-card" aria-labelledby="columbus-plan-title">
                <div class="columbus-plan-kicker">Columbus</div>
                <h3 id="columbus-plan-title">RACE PLAN</h3>
                <div class="columbus-plan-grid">
                    ${fields}
                </div>
            </section>`;
    };
})();
