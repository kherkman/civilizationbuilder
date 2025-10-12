// people.js

// This function returns a string containing only People SVG symbol definitions.
function getPeopleSVGDefinitions() {
    return `
    <svg>
        <!-- --- PEOPLE (from People.html) --- -->
        <defs>
            <g id="body_base_people">
                <rect x="15" y="20" width="20" height="10" rx="4" ry="4" fill="#6b8e23"/>
                <circle cx="25" cy="20" r="5" fill="#556b2f"/>
            </g>
            <g id="civilian_base_people">
                <rect x="15" y="20" width="20" height="10" rx="4" ry="4" fill="#6f4e37"/>
                <circle cx="25" cy="20" r="5" fill="#a3a3a3"/>
            </g>
        </defs>
        
        <symbol id="rifleman" viewBox="0 0 50 50">
            <use href="#body_base_people" />
            <rect x="30" y="10" width="2" height="10" fill="#333333"/>
        </symbol>

        <symbol id="rocket_trooper" viewBox="0 0 50 50">
            <use href="#body_base_people" />
            <rect x="30" y="5" width="5" height="15" fill="#cc0000" rx="1"/>
            <circle cx="32.5" cy="4" r="2" fill="#333333"/>
        </symbol>

        <symbol id="engineer" viewBox="0 0 50 50">
            <use href="#body_base_people" />
            <rect x="35" y="20" width="6" height="10" fill="#ffcc00"/>
        </symbol>

        <symbol id="medic" viewBox="0 0 50 50">
            <use href="#body_base_people" />
            <rect x="20" y="20" width="10" height="10" fill="#ffffff" rx="1"/> 
            <rect x="24" y="22" width="2" height="6" fill="#cc0000"/>
            <rect x="22" y="24" width="6" height="2" fill="#cc0000"/>
        </symbol>

        <symbol id="grenadier" viewBox="0 0 50 50">
            <use href="#body_base_people" />
            <rect x="31" y="16" width="3" height="8" fill="#a9a9a9"/>
            <circle cx="32.5" cy="15" r="1.5" fill="#555555"/>
        </symbol>

        <symbol id="civilian" viewBox="0 0 50 50">
            <use href="#civilian_base_people" />
        </symbol>
        
        <!-- NEW: Cleaner Unit Symbol -->
        <symbol id="cleaner" viewBox="0 0 50 50">
            <use href="#civilian_base_people" />
            <!-- White uniform top over civilian body base -->
            <rect x="17" y="22" width="16" height="6" fill="#ffffff" rx="1"/> 
            <!-- Broom Handle (silver) -->
            <rect x="33" y="10" width="2" height="18" fill="#a9a9a9"/>
            <!-- Broom Head (brown) -->
            <rect x="31" y="26" width="6" height="3" fill="#8b4513"/>
        </symbol>

        <symbol id="construction_worker" viewBox="0 0 50 50">
            <use href="#civilian_base_people" />
            <rect x="16" y="21" width="18" height="8" fill="#ffa500" rx="2"/>
            <rect x="20" y="12" width="10" height="5" rx="2" ry="2" fill="#ffa500"/>
        </symbol>

        <symbol id="farmer" viewBox="0 0 50 50">
            <use href="#civilian_base_people" />
            <ellipse cx="25" cy="18" rx="8" ry="4" fill="#8b4513"/>
            <rect x="32" y="15" width="2" height="15" fill="#333333"/>
        </symbol>

        <symbol id="zombie" viewBox="0 0 50 50">
            <rect x="15" y="20" width="20" height="10" rx="4" ry="4" fill="#4CAF50"/>
            <circle cx="25" cy="20" r="5" fill="#2E7D32"/>
            <circle cx="20" cy="25" r="2" fill="#cc0000"/><rect x="26" y="17" width="2" height="3" fill="#cc0000"/>
        </symbol>

        <symbol id="scientist" viewBox="0 0 50 50">
            <rect x="15" y="20" width="20" height="10" rx="4" ry="4" fill="#1e90ff"/>
            <circle cx="25" cy="20" r="5" fill="#a3a3a3"/>
            <circle cx="25" cy="18" r="7" fill="transparent" stroke="#333333" stroke-width="1"/> 
            <circle cx="25" cy="18" r="4" fill="#333333"/> 
        </symbol>

        <symbol id="police_officer" viewBox="0 0 50 50">
            <rect x="15" y="20" width="20" height="10" rx="4" ry="4" fill="#000080"/>
            <circle cx="25" cy="20" r="5" fill="#a3a3a3"/>
            <rect x="18" y="22" width="14" height="6" fill="#ffd700" rx="1"/> 
            <rect x="23" y="21" width="4" height="8" fill="#8b4513"/> 
        </symbol>

        <symbol id="doctor" viewBox="0 0 50 50">
            <rect x="15" y="20" width="20" height="10" rx="4" ry="4" fill="#f0f8ff"/>
            <circle cx="25" cy="20" r="5" fill="#a3a3a3"/>
            <rect x="23" y="13" width="4" height="2" fill="#cc0000"/><rect x="24" y="12" width="2" height="4" fill="#cc0000"/>
        </symbol>

        <symbol id="chef" viewBox="0 0 50 50">
            <rect x="15" y="20" width="20" height="10" rx="4" ry="4" fill="#ffffff"/>
            <circle cx="25" cy="20" r="5" fill="#a3a3a3"/>
            <rect x="20" y="10" width="10" height="7" rx="2" fill="#ffffff"/><rect x="22" y="8" width="6" height="3" rx="1" fill="#ffffff"/>
        </symbol>

        <symbol id="pilot" viewBox="0 0 50 50">
            <rect x="15" y="20" width="20" height="10" rx="4" ry="4" fill="#a9a9a9"/>
            <circle cx="25" cy="20" r="5" fill="#a3a3a3"/>
            <path d="M 25 15 L 20 20 L 30 20 Z" fill="#333333"/> 
            <rect x="20" y="18" width="10" height="2" fill="#333333"/> 
        </symbol>
    </svg>
    `;
}