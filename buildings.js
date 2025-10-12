// buildings.js 

// This function returns a string containing only Building SVG symbol definitions.
function getBuildingSVGDefinitions() {
    return `
    <svg>
        <!-- --- EXISTING MILITARY & CORE STRUCTURES (7) from Buildings.html --- -->
        <!-- 1. Construction Yard (CY) - Largest structure (COLOR CHANGED TO GREY) -->
        <symbol id="cy" viewBox="0 0 100 100">
            <rect x="5" y="5" width="90" height="90" fill="var(--foundation-color)" rx="5"/>
            <rect x="15" y="15" width="70" height="70" fill="#666666" rx="3"/>
            <rect x="25" y="25" width="50" height="50" fill="#444444"/>
            <rect x="70" y="10" width="10" height="15" fill="var(--foundation-color)"/>
            <rect x="80" y="10" width="5" height="5" fill="#a0c44a"/>
            <text x="50" y="55" font-size="10" fill="#222" font-weight="bold" text-anchor="middle">C Y</text>
        </symbol>
        <!-- 2. Power Plant - Tall and distinct structure -->
        <symbol id="power_plant" viewBox="0 0 100 100">
            <rect x="10" y="60" width="80" height="30" fill="var(--foundation-color)" rx="3"/>
            <rect x="20" y="30" width="60" height="60" fill="var(--military-main)" rx="3"/>
            <rect x="30" y="10" width="10" height="40" fill="var(--foundation-color)"/>
            <rect x="60" y="10" width="10" height="40" fill="var(--foundation-color)"/>
            <circle cx="50" cy="60" r="10" fill="var(--energy-color)"/>
            <text x="50" y="90" font-size="8" fill="#aaa" text-anchor="middle">POWER</text>
        </symbol>
        <!-- 3. Barracks - Infantry production building -->
        <symbol id="barracks" viewBox="0 0 100 100">
            <rect x="15" y="15" width="70" height="70" fill="var(--foundation-color)" rx="3"/>
            <rect x="20" y="20" width="60" height="60" fill="var(--military-main)" rx="3"/>
            <rect x="45" y="80" width="10" height="5" fill="var(--foundation-color)"/>
            <rect x="30" y="30" width="10" height="15" fill="var(--military-detail)"/>
            <circle cx="35" cy="28" r="4" fill="var(--military-detail)"/>
            <text x="50" y="55" font-size="10" fill="#fff" font-weight="bold" text-anchor="middle">BARRACKS</text>
        </symbol>
        <!-- 4. Refinery / Silo - Resource collection and storage -->
        <symbol id="refinery" viewBox="0 0 100 100">
            <rect x="20" y="60" width="60" height="30" fill="#4b5320" rx="3"/>
            <rect x="60" y="15" width="25" height="60" fill="var(--military-main)" rx="5"/>
            <rect x="65" y="20" width="15" height="5" fill="var(--foundation-color)"/>
            <rect x="65" y="30" width="15" height="5" fill="var(--foundation-color)"/>
            <rect x="15" y="30" width="40" height="30" fill="var(--military-detail)"/>
            <text x="50" y="85" font-size="8" fill="#aaa" text-anchor="middle">REFINERY</text>
        </symbol>
        <!-- 5. Defense Tower was here (REMOVED) -->
        <!-- 6. Turret (Small rotating defense) -->
        <symbol id="turret" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="var(--foundation-color)"/>
            <rect x="35" y="40" width="30" height="20" fill="var(--military-main)" rx="5"/>
            <rect x="45" y="15" width="10" height="30" fill="var(--defense-color)"/>
            <text x="50" y="85" font-size="8" fill="#aaa" text-anchor="middle">TURRET</text>
        </symbol>
        <!-- 7. Wall Segment (0 degrees / default) -->
        <symbol id="wall_segment" viewBox="0 0 100 100">
            <rect x="10" y="40" width="80" height="20" fill="var(--foundation-color)" rx="3"/>
            <rect x="15" y="45" width="70" height="10" fill="var(--military-main)"/>
            <rect x="25" y="40" width="5" height="20" fill="#222"/>
            <rect x="70" y="40" width="5" height="20" fill="#222"/>
            <text x="50" y="75" font-size="8" fill="#aaa" text-anchor="middle">WALL</text>
        </symbol>
        
        <!-- 8. Wall Segment (45 degrees) -->
        <!-- Re-use the same symbol definition, rotation is handled via JS entity.rotation -->
        <symbol id="wall_segment_45" viewBox="0 0 100 100">
            <rect x="10" y="40" width="80" height="20" fill="var(--foundation-color)" rx="3"/>
            <rect x="15" y="45" width="70" height="10" fill="var(--military-main)"/>
            <rect x="25" y="40" width="5" height="20" fill="#222"/>
            <rect x="70" y="40" width="5" height="20" fill="#222"/>
            <text x="50" y="75" font-size="8" fill="#aaa" text-anchor="middle">WALL 45</text>
        </symbol>

        <!-- 9. Wall Segment (90 degrees) -->
        <!-- Re-use the same symbol definition, rotation is handled via JS entity.rotation -->
            <symbol id="wall_segment_90" viewBox="0 0 100 100">
                <rect x="40" y="10" width="20" height="80" fill="var(--foundation-color)" rx="3"/>
                <rect x="45" y="15" width="10" height="70" fill="var(--military-main)"/>
                <rect x="40" y="25" width="20" height="5" fill="#222"/>
                <rect x="40" y="70" width="20" height="5" fill="#222"/>
                <text x="50" y="95" font-size="8" fill="#aaa" text-anchor="middle" transform="rotate(-90 50 50)">WALL 90</text>
            </symbol>
        
        <!-- 10. Wall Segment (135 degrees) -->
        <!-- Re-use the same symbol definition, rotation is handled via JS entity.rotation -->
        <symbol id="wall_segment_135" viewBox="0 0 100 100">
            <rect x="10" y="40" width="80" height="20" fill="var(--foundation-color)" rx="3"/>
            <rect x="15" y="45" width="70" height="10" fill="var(--military-main)"/>
            <rect x="25" y="40" width="5" height="20" fill="#222"/>
            <rect x="70" y="40" width="5" height="20" fill="#222"/>
            <text x="50" y="75" font-size="8" fill="#aaa" text-anchor="middle">WALL 135</text>
        </symbol>

        <!-- 11. Chopper Landing Area (Military Infrastructure) -->
        <symbol id="helipad" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" fill="var(--infrastructure-color)"/>
            <circle cx="50" cy="50" r="35" fill="#1c3024"/>
            <rect x="40" y="45" width="20" height="10" fill="#f0f0f0"/>
            <rect x="45" y="40" width="10" height="20" fill="#f0f0f0"/>
            <text x="50" y="85" font-size="8" fill="#aaa" text-anchor="middle">HELIPAD</text>
        </symbol>

        <!-- 12. Bunker (Military Defense) - UPDATED TO BE CIRCLE AND GREY ONLY -->
        <symbol id="bunker" viewBox="0 0 100 100">
            <!-- Outer grey foundation/perimeter -->
            <circle cx="50" cy="50" r="40" fill="#555"/>
            <!-- Inner bunker structure (darker grey) -->
            <circle cx="50" cy="50" r="30" fill="#444"/>
            <!-- Gun slot / Entrance (light grey) -->
            <rect x="35" y="45" width="30" height="10" fill="#777"/>
            <text x="50" y="85" font-size="8" fill="#ccc" text-anchor="middle">BUNKER</text>
        </symbol>

        <!-- 13. Skyscraper (Civilian/Landmark) - MODIFIED FOR TOP-DOWN VIEW -->
        <symbol id="skyscraper" viewBox="0 0 100 100">
            <!-- Large dark square representing the roof/footprint -->
            <rect x="20" y="20" width="60" height="60" fill="#3a4a58"/>
            <!-- Central elevator core/roof structure -->
            <rect x="40" y="40" width="20" height="20" fill="#2c3a45"/>
            <!-- Windows/vents on the roof perimeter (lighter color) -->
            <rect x="25" y="25" width="5" height="5" fill="#99a9b9"/>
            <rect x="50" y="25" width="5" height="5" fill="#99a9b9"/>
            <rect x="70" y="25" width="5" height="5" fill="#99a9b9"/>
            <rect x="25" y="70" width="5" height="5" fill="#99a9b9"/>
            <rect x="70" y="70" width="5" height="5" fill="#99a9b9"/>
            <text x="50" y="95" font-size="8" fill="#f0f0f0" text-anchor="middle">SKYSCRAPER</text>
        </symbol>
        
        <!-- 14. Hospital (Civilian/Special) -->
        <symbol id="hospital" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" fill="#f0f0f0" rx="5"/>
            <rect x="40" y="30" width="20" height="40" fill="#cc0000"/>
            <rect x="30" y="40" width="40" height="20" fill="#cc0000"/>
            <text x="50" y="95" font-size="8" fill="#cc0000" text-anchor="middle">HOSPITAL</text>
        </symbol>

        <!-- 15. University (Civilian/Special) -->
        <symbol id="university" viewBox="0 0 100 100">
            <rect x="10" y="30" width="80" height="50" fill="#cd853f" rx="3"/>
            <rect x="45" y="15" width="10" height="25" fill="#8b4513"/>
            <circle cx="50" cy="15" r="7" fill="#daa520"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle">UNIVERSITY</text>
        </symbol>

        <!-- 16. Prison (Civilian/Special) -->
        <symbol id="prison" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" fill="#404040"/>
            <rect x="15" y="15" width="70" height="70" fill="#606060"/>
            <rect x="20" y="20" width="60" height="60" fill="#505050"/>
            <rect x="30" y="40" width="40" height="20" fill="#707070"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle">PRISON</text>
        </symbol>

        <!-- 17. Stadium (Civilian/Landmark) -->
        <symbol id="stadium" viewBox="0 0 100 100">
            <ellipse cx="50" cy="50" rx="45" ry="35" fill="#006400"/>
            <ellipse cx="50" cy="50" rx="35" ry="25" fill="#228b22"/>
            <text x="50" y="55" font-size="10" fill="#fff" font-weight="bold" text-anchor="middle">STADIUM</text>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle">(LANDMARK)</text>
        </symbol>

        <!-- 18. Trade Center (Civilian/Office) -->
        <symbol id="trade_center" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" fill="#555" rx="5"/>
            <rect x="20" y="20" width="60" height="60" fill="#777" rx="3"/>
            <rect x="25" y="25" width="10" height="10" fill="#ccc"/>
            <rect x="65" y="65" width="10" height="10" fill="#ccc"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle">TRADE</text>
        </symbol>

        <!-- 19. Office (Civilian/Generic) -->
        <symbol id="office" viewBox="0 0 100 100">
            <rect x="15" y="15" width="70" height="70" fill="#778899"/>
            <rect x="20" y="20" width="5" height="5" fill="#add8e6"/>
            <rect x="30" y="20" width="5" height="5" fill="#add8e6"/>
            <rect x="40" y="20" width="5" height="5" fill="#add8e6"/>
            <rect x="50" y="20" width="5" height="5" fill="#add8e6"/>
            <rect x="60" y="20" width="5" height="5" fill="#add8e6"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle">OFFICE</text>
        </symbol>

        <!-- 20. Grocery Store (Civilian) - ENHANCED LOOK -->
        <symbol id="grocery_store" viewBox="0 0 100 100">
            <!-- Dark foundation/parking lot -->
            <rect x="10" y="10" width="80" height="80" fill="#555"/>
            <!-- Building footprint -->
            <rect x="25" y="25" width="50" height="50" fill="#88b04b" rx="5"/>
            <!-- Roof detail / Accent color -->
            <rect x="30" y="30" width="40" height="40" fill="#9acd32" rx="3"/>
            <!-- Entrance/Door -->
            <rect x="45" y="70" width="10" height="5" fill="#333"/>
            <!-- Simple Shopping Cart Icon on roof/sign -->
            <line x1="40" y1="45" x2="60" y2="45" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
            <rect x="38" y="47" width="24" height="3" fill="#fff"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle">GROCERY</text>
        </symbol>

        <!-- 21. Bar (Civilian) - ENHANCED LOOK -->
        <symbol id="bar" viewBox="0 0 100 100">
            <!-- Base footprint -->
            <rect x="20" y="20" width="60" height="60" fill="#4b0082" rx="5"/>
            <!-- Roof/Structure (Purple) -->
            <rect x="25" y="25" width="50" height="50" fill="#6a5acd" rx="3"/>
            <!-- Doorway -->
            <rect x="55" y="70" width="10" height="5" fill="#222"/>
            <!-- Neon Sign Glow (Bright Pink Circle) -->
            <circle cx="35" cy="35" r="5" fill="#ff69b4"/>
            <text x="50" y="85" font-size="8" fill="#fff" text-anchor="middle">BAR</text>
        </symbol>

        <!-- 22. Gym (Civilian) -->
        <symbol id="gym" viewBox="0 0 100 100">
            <rect x="25" y="25" width="50" height="50" fill="#b0c4de" rx="5"/>
            <line x1="35" y1="50" x2="65" y2="50" stroke="#333" stroke-width="5" stroke-linecap="round"/>
            <circle cx="35" cy="50" r="4" fill="#333"/>
            <circle cx="65" cy="50" r="4" fill="#333"/>
            <text x="50" y="80" font-size="8" fill="#333" text-anchor="middle">GYM</text>
        </symbol>
    </svg>
    `;
}