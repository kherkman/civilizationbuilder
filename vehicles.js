// vehicles.js

// This function returns a string containing only Vehicle SVG symbol definitions.
function getVehiclesSVGDefinitions() {
    return `
    <svg>
        <!-- --- VEHICLES (from Vehicles.html) --- -->
        <!-- 1. Light Scout Vehicle (Jeep/Humvee) -->
        <symbol id="jeep" viewBox="0 0 100 150">
            <!-- Body -->
            <rect x="15" y="10" width="70" height="130" rx="5" ry="5" fill="#6b8e23"/>
            <!-- Cabin/Interior -->
            <rect x="25" y="60" width="50" height="70" fill="#556b2f"/>
            <!-- Windshield/Rollbar Base -->
            <rect x="18" y="50" width="64" height="10" fill="#556b2f"/>
            <!-- Headlights/Front Detail -->
            <rect x="20" y="15" width="10" height="5" fill="#a0c44a"/>
            <rect x="70" y="15" width="10" height="5" fill="#a0c44a"/>
            <!-- Wheels (Simple block representation) -->
            <rect x="5" y="30" width="10" height="20" fill="#333333"/>
            <rect x="85" y="30" width="10" height="20" fill="#333333"/>
            <rect x="5" y="100" width="10" height="20" fill="#333333"/>
            <rect x="85" y="100" width="10" height="20" fill="#333333"/>
        </symbol>

        <!-- 2. Medium APC (Armored Personnel Carrier) -->
        <symbol id="apc" viewBox="0 0 120 180">
            <!-- Tracks (Sides) -->
            <rect x="5" y="10" width="20" height="160" fill="#333333"/>
            <rect x="95" y="10" width="20" height="160" fill="#333333"/>
            <!-- Body (Chassis) -->
            <rect x="25" y="20" width="70" height="140" fill="#6b8e23" rx="3"/>
            <!-- Commander Hatch/Detail -->
            <circle cx="60" cy="40" r="10" fill="#556b2f"/>
            <!-- Firing Port (Side View Detail) -->
            <rect x="25" y="80" width="70" height="10" fill="#556b2f"/>
        </symbol>

        <!-- 3. Heavy Tank (Main Battle Tank) -->
        <symbol id="tank" viewBox="0 0 150 150">
            <!-- Tracks (Outer frame) -->
            <rect x="0" y="10" width="30" height="130" fill="#333333"/>
            <rect x="120" y="10" width="30" height="130" fill="#333333"/>
            <!-- Chassis (Lower body) -->
            <rect x="30" y="20" width="90" height="110" fill="#6b8e23" rx="5"/>
            <!-- Turret (Central piece) -->
            <rect x="40" y="50" width="70" height="50" fill="#556b2f" rx="3"/>
            <!-- Main Gun Barrel -->
            <rect x="65" y="0" width="20" height="55" fill="#556b2f"/>
            <!-- Loader/Hatch detail on turret -->
            <circle cx="50" cy="65" r="5" fill="#333333"/>
        </symbol>

        <!-- 4. Attack Helicopter (Air Unit) -->
        <symbol id="helicopter" viewBox="0 0 200 200">
            <!-- Main Body (Oval shape from above) -->
            <ellipse cx="100" cy="100" rx="40" ry="70" fill="#6b8e23"/>
            <!-- Cockpit Canopy -->
            <ellipse cx="100" cy="70" rx="25" ry="30" fill="#4a5d2a"/>
            <!-- Tail Boom -->
            <rect x="90" y="120" width="20" height="70" fill="#556b2f"/>
            <!-- Main Rotor (Simple cross) -->
            <line x1="20" y1="100" x2="180" y2="100" stroke="#333333" stroke-width="5" stroke-linecap="round"/>
            <line x1="100" y1="20" x2="100" y2="180" stroke="#333333" stroke-width="5" stroke-linecap="round"/>
            <!-- Tail Rotor -->
            <rect x="85" y="180" width="30" height="10" fill="#333333"/>
        </symbol>
    </svg>
    `;
}