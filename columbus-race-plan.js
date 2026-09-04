// Temporary Columbus meet data and presentation.
// Remove this file, its script tag, the build call in app.js, and the matching
// CSS section after the meet.
(function () {
    const plans = {
        "AJ Dumser": ["Evan Lassiter", "Evan Lassiter / Joey Burks", "2500m", "You finished stronger than peers; begin working forward at halfway"],
        "Andersen Horbett": ["Carson Gaskill", "Nolan Hauck / Carson Gaskill / Brayden Clark / Porter Hahn / Maddux Whaley / Brayden Adams", "3000m", "Your track time suggests more ability; stay comfortable then test it after 3K"],
        "Banner Barnes": ["", "Isaiah Vohs", "2500m", "Stay composed early then begin applying pressure at halfway"],
        "Ben Graham": ["Cohen Bullock", "Brady McFall / Dane Stewart / Preston Burris / Wyatt Dumbris", "3000m", "Stay comfortable in the group then compete over the final 2K"],
        "Brady McFall": ["Ben Graham", "Ben Graham / Dane Stewart / Preston Burris / Wyatt Dumbris", "3000m", "You held up well at County; begin moving after 3K"],
        "Braune Naville": ["Parker Applegate", "Parker Applegate / Tyler Stallings / John Ensley", "2500m", "You finished strongly; stay controlled early then begin moving"],
        "Brayden Adams": ["Maddux Whaley", "Nolan Hauck / Carson Gaskill / Brayden Clark / Porter Hahn / Maddux Whaley / Andersen Horbett", "3000m", "Stay with the pack through 3K then begin passing"],
        "Brayden Clark": ["Carson Gaskill", "Nolan Hauck / Carson Gaskill / Porter Hahn / Maddux Whaley / Brayden Adams / Andersen Horbett", "3500m", "Remain tucked into the pack and save your move for the final mile"],
        "Bryson Cronin-Warren": ["Colin Howard", "Harris Jackson / Colin Howard", "3500m", "Stay tucked in and save your move for the final mile"],
        "Camden Clark": ["Colin Halvorsen", "Will Davidson / Harrison Umthum / Colin Halvorsen / Jayden Gedeon", "2500m", "You held back well at County; begin moving at halfway"],
        "Carson Gaskill": ["Nolan Hauck", "Nolan Hauck / Brayden Clark / Porter Hahn / Maddux Whaley / Brayden Adams / Andersen Horbett", "3000m", "Stay attached through 3K then begin working forward"],
        "Chris Williams": ["Inman Kjeldsen", "Inman Kjeldsen", "3000m", "Maintain continuous effort through 3K then compete with nearby runners"],
        "Cohen Baumer": ["Matt Huseman", "Matt Huseman / Kolten Simpson / Josh Moller", "2500m", "You finished strongly at County; begin pressing at halfway"],
        "Cohen Bullock": ["Joey McLaughlin", "Eli Ropte / Finn Adams / Jacob Patlogar / Joey McLaughlin / Drew Hickner", "2500m", "Your County finish showed more ability; start moving at halfway"],
        "Colin Halvorsen": ["Harrison Umthum", "Will Davidson / Harrison Umthum / Camden Clark / Jayden Gedeon", "3000m", "Stay with the pack through 3K then begin passing"],
        "Colin Howard": ["Harris Jackson", "Harris Jackson / Bryson Cronin-Warren", "3500m", "Stay patient and attached; save your move for the final mile"],
        "Dane Stewart": ["Ben Graham", "Ben Graham / Brady McFall / Preston Burris / Wyatt Dumbris", "3000m", "Stay comfortable with the group then compete over the final 2K"],
        "Drew Hickner": ["Joey McLaughlin", "Eli Ropte / Finn Adams / Jacob Patlogar / Joey McLaughlin / Cohen Bullock", "3000m", "Use the pack to establish your 5K effort then compete after 3K"],
        "Eli Ropte": ["Jayden Gedeon", "Finn Adams / Jacob Patlogar / Joey McLaughlin / Cohen Bullock / Drew Hickner", "3000m", "Run evenly with the group then begin competing after 3K"],
        "Evan Lassiter": ["Brayden Adams", "AJ Dumser / Joey Burks", "2500m", "Your strong County finish says you can start moving earlier"],
        "Finn Adams": ["Eli Ropte", "Eli Ropte / Jacob Patlogar / Joey McLaughlin / Cohen Bullock / Drew Hickner", "3500m", "Do not chase early moves; stay in the pack until the final mile"],
        "Gavin Flynn": ["Jack Rush", "Jack Rush", "2500m", "Trust your improved fitness and begin applying pressure at halfway"],
        "Graham Yarber": ["Tyler Hass", "Jackson Thomas / Tyler Hass / Zander Gruber / Maddox Uminski", "3500m", "Stay behind the pack early and race the final mile"],
        "Harris Jackson": ["Maddox Denison", "Colin Howard / Bryson Cronin-Warren", "3500m", "Do not lead the group early; stay attached until the final mile"],
        "Harrison Umthum": ["Will Davidson", "Will Davidson / Colin Halvorsen / Camden Clark / Jayden Gedeon", "3500m", "Let the pack control your early effort and race the final mile"],
        "Inman Kjeldsen": ["", "Chris Williams", "3500m", "Keep the effort controlled and continuous then build over the final mile"],
        "Isaiah Vohs": ["Banner Barnes", "Banner Barnes", "2500m", "Stay connected while controlled and begin competing at halfway"],
        "Jack Rush": ["", "Gavin Flynn", "3500m", "Stay relaxed with Gavin and save your move for the final mile"],
        "Jackson Thomas": ["", "Tyler Hass / Graham Yarber / Zander Gruber / Maddox Uminski", "3000m", "Stay comfortable with the group then compete after 3K"],
        "Jacob Patlogar": ["Finn Adams", "Eli Ropte / Finn Adams / Joey McLaughlin / Cohen Bullock / Drew Hickner", "3500m", "Stay tucked into the pack and make one sustained final-mile move"],
        "Jayden Gedeon": ["Camden Clark", "Will Davidson / Harrison Umthum / Colin Halvorsen / Camden Clark", "2500m", "You finished stronger than peers; begin moving at halfway"],
        "Joey Burks": ["Evan Lassiter", "AJ Dumser / Evan Lassiter", "2500m", "Your track speed and strong finish suggest you can move earlier"],
        "Joey McLaughlin": ["Jacob Patlogar", "Eli Ropte / Finn Adams / Jacob Patlogar / Cohen Bullock / Drew Hickner", "3500m", "Stay patient with the pack and make one move in the final mile"],
        "John Ensley": ["Parker Applegate", "Parker Applegate / Tyler Stallings / Braune Naville", "2500m", "You held the second half extremely well; begin competing at halfway"],
        "Josh Moller": ["Cohen Baumer", "Matt Huseman / Cohen Baumer / Kolten Simpson", "3500m", "Sit behind the group early and save your move for the final mile"],
        "Kolten Simpson": ["Cohen Baumer", "Matt Huseman / Cohen Baumer / Josh Moller", "3000m", "Stay disciplined with the group then begin pressing after 3K"],
        "Lucas Cesar": ["Matthew Moor", "Matthew Moor / Maddox Denison", "3000m", "Your halfway split belongs here; stay controlled then compete after 3K"],
        "Maddox Denison": ["Matthew Moor", "Matthew Moor / Lucas Cesar", "2500m", "You finished strongly at County; begin applying pressure at halfway"],
        "Maddox Uminski": ["Zander Gruber", "Jackson Thomas / Tyler Hass / Graham Yarber / Zander Gruber", "3000m", "Stay with the pack through 3K then begin working forward"],
        "Maddux Whaley": ["Brayden Clark", "Nolan Hauck / Carson Gaskill / Brayden Clark / Porter Hahn / Brayden Adams / Andersen Horbett", "2500m", "Your County finish suggests more is available; move at halfway"],
        "Matt Huseman": ["Gavin Flynn", "Cohen Baumer / Kolten Simpson / Josh Moller", "2500m", "You held the second half well; begin pressing at halfway"],
        "Matthew Moor": ["John Ensley", "Maddox Denison / Lucas Cesar", "2500m", "Your strong second half means you can begin competing earlier"],
        "Nolan Hauck": ["Wyatt Dumbris", "Carson Gaskill / Brayden Clark / Porter Hahn / Maddux Whaley / Brayden Adams / Andersen Horbett", "3000m", "Stay comfortable in the group then start passing after 3K"],
        "Parker Applegate": ["", "Tyler Stallings / John Ensley / Braune Naville", "3000m", "Lead only if comfortable; keep the group together through 3K"],
        "Porter Hahn": ["Brayden Clark", "Nolan Hauck / Carson Gaskill / Brayden Clark / Maddux Whaley / Brayden Adams / Andersen Horbett", "3500m", "This pack matches your demonstrated 5K; stay tucked in and save your move for the final mile"],
        "Preston Burris": ["Ben Graham", "Ben Graham / Brady McFall / Dane Stewart / Wyatt Dumbris", "3000m", "Stay with the group through 3K then begin competing"],
        "Tyler Hass": ["Jackson Thomas", "Jackson Thomas / Graham Yarber / Zander Gruber / Maddox Uminski", "3000m", "Stay connected through 3K then begin moving through runners"],
        "Tyler Stallings": ["Parker Applegate", "Parker Applegate / John Ensley / Braune Naville", "3500m", "Stay tucked into the group and save your move for the final mile"],
        "Will Davidson": ["Zander Gruber", "Harrison Umthum / Colin Halvorsen / Camden Clark / Jayden Gedeon", "3000m", "Stay with the pack through 3K then begin passing"],
        "Wyatt Dumbris": ["Brady McFall", "Ben Graham / Brady McFall / Dane Stewart / Preston Burris", "2500m", "You finished strongly at County; begin moving at halfway"],
        "Zander Gruber": ["Graham Yarber", "Jackson Thomas / Tyler Hass / Graham Yarber / Maddox Uminski", "3000m", "Keep the group organized early then compete after 3K"]
    };

    function escapeHTML(value) {
        return String(value || "").replace(/[&<>"']/g, character => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
        })[character]);
    }

    window.buildColumbusRacePlanHTML = function (fullName) {
        const plan = plans[fullName];
        if (!plan) return "";

        const [anchor, packmates, beginMoving, instruction] = plan;
        const field = (label, value, className = "") => `
            <div class="columbus-plan-field ${className}">
                <div class="columbus-plan-label">${label}</div>
                <div class="columbus-plan-value">${escapeHTML(value) || "&mdash;"}</div>
            </div>`;

        return `
            <section class="card columbus-plan-card" aria-labelledby="columbus-plan-title">
                <div class="columbus-plan-kicker">Columbus</div>
                <h3 id="columbus-plan-title">RACE PLAN</h3>
                <div class="columbus-plan-grid">
                    ${field("Anchor", anchor)}
                    ${field("Look for", packmates)}
                    ${field("Begin moving", beginMoving)}
                    ${field("Individual instruction", instruction, "columbus-plan-instruction")}
                </div>
            </section>`;
    };
})();
