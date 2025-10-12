// enemies.js

// This function returns a string containing only Enemy SVG symbol definitions.
function getEnemiesSVGDefinitions() {
    return `
    <svg>
        <!-- --- ENEMIES --- -->

        <!-- 1. Crawler (Slow, heavily armored enemy) -->
        <symbol id="crawler" viewBox="0 0 50 50">
            <!-- Body (Dark, segmented) -->
            <rect x="10" y="10" width="30" height="30" fill="#222"/>
            <!-- Head (Red eye) -->
            <circle cx="25" cy="15" r="5" fill="#dc2626"/>
            <!-- Claws/Legs (Spiky) -->
            <rect x="5" y="15" width="5" height="20" fill="#444"/>
            <rect x="40" y="15" width="5" height="20" fill="#444"/>
            <!-- Armor Plates (Grey) -->
            <rect x="15" y="20" width="20" height="5" fill="#6b7280"/>
            <rect x="15" y="30" width="20" height="5" fill="#6b7280"/>
        </symbol>

        <!-- 2. Raider (Fast, light enemy) -->
        <symbol id="raider" viewBox="0 0 50 50">
            <!-- Body (Darker green than military) -->
            <rect x="18" y="22" width="14" height="8" fill="#38a169" rx="2"/>
            <!-- Head (Skull mask) -->
            <circle cx="25" cy="20" r="5" fill="#ffffff" stroke="#333" stroke-width="1"/>
            <circle cx="23" cy="19" r="1" fill="#333"/>
            <circle cx="27" cy="19" r="1" fill="#333"/>
            <!-- Weapon/Spike -->
            <line x1="32" y1="26" x2="45" y2="26" stroke="#cc0000" stroke-width="2" stroke-linecap="round"/>
        </symbol>
    </svg>
    `;
}