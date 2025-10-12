// terrain.js

// This function returns a string containing only Terrain SVG symbol definitions and their associated CSS variables.
function getTerrainSVGDefinitions() {
    return `
    <svg>
        <style>
            /* Define CSS Variables for the Terrain Theme */
            :root {
                --tree-green: #228b22;
                --bush-dark: #38761d;
                --rock-grey: #696969; /* Main rock color */
                --soil-brown: #8b4513;
                --resource-brown: #964b00; 
                --crop-yellow: #f1c40f;
                --flower-red: #c0392b; 
                --sand-yellow: #f4a460; 
                --grass-light: #6a9b4e; 
                --snow-white: #f0f8ff; 
                --water-blue: #005f9e;
                --dead-tree-brown: #654321; 
                --palm-green: #9acd32; 
                --pine-dark-green: #013220; 
                
                /* Birch Tree */
                --birch-green-light: #b8c47b; /* Pale, yellowish-green (Highlight) */
                --birch-green-mid: #a0ac68;   /* Medium tone */
                --birch-green-dark: #899b50;  /* Darker base/shadow */
                --birch-grain-color: #556b2f; /* Darker green/brown for texture dots */

                /* Maple Tree */
                --maple-green-dark: #38761d;  /* Dark Green base/shadow */
                --maple-green-mid: #6aa84f;   /* Medium Green/Canopy layer */
                --maple-green-light: #9acd32; /* Lighter Green/Highlight (a bit yellowish) */
                --maple-grain-color: #2a5515; /* Darker grain/shadow */

                /* Flowers */
                --flower-purple: #8a2be2; /* Blue-Violet flower color */
                
                /* Spruce Tree */
                --spruce-darkest: #044a2d; /* Base layer (slightly lighter than original dark) */
                --spruce-mid: #0f523c;    /* Middle layer */
                --spruce-lightest: #1e735b; /* Top layer/Highlight */
                --spruce-center: #6c9d5d; /* New light green center */
                
                /* Oak Tree */
                --oak-green-dark: #2f4f2f;  /* Dark Slate Gray/Forest Green base */
                --oak-green-mid: #4f804f;   /* Medium Green/Canopy layer */
                --oak-green-light: #6aa84f; /* Lighter Green/Highlight */
                --oak-grain-color: #1e361e; /* Darker grain/shadow */
                
                /* Rocks */
                --rock-dark: #444444; /* Darker rock/shadow */
                --rock-light: #888888; /* Lighter rock/highlight */
            }
        </style>

        <!-- --- TERRAIN ASSETS --- -->

        <!-- 1. Tree (Birch, Top-Down Layered) -->
        <symbol id="tree_birch" viewBox="0 0 100 100">
            <path d="M50,15 Q80,25 85,50 Q80,75 50,85 Q20,75 15,50 Q20,25 50,15 Z" fill="var(--birch-green-dark)" opacity="0.9"/>
            <path d="M50,25 Q70,30 75,50 Q70,70 50,75 Q30,70 25,50 Q30,30 50,25 Z" fill="var(--birch-green-mid)" opacity="0.95"/>
            <path d="M50,35 Q60,40 65,50 Q60,60 50,65 Q40,60 35,50 Q40,40 50,35 Z" fill="var(--birch-green-light)" opacity="1"/>
            <circle cx="45" cy="40" r="1.5" fill="var(--birch-grain-color)" opacity="0.5"/>
            <circle cx="55" cy="35" r="1.2" fill="var(--birch-grain-color)" opacity="0.6"/>
            <circle cx="68" cy="50" r="1.8" fill="var(--birch-grain-color)" opacity="0.4"/>
            <circle cx="32" cy="50" r="1.6" fill="var(--birch-grain-color)" opacity="0.5"/>
            <circle cx="50" cy="60" r="1.4" fill="var(--birch-grain-color)" opacity="0.7"/>
            <circle cx="75" cy="30" r="1.0" fill="var(--birch-grain-color)" opacity="0.3"/>
            <circle cx="25" cy="70" r="1.1" fill="var(--birch-grain-color)" opacity="0.4"/>
            <circle cx="40" cy="20" r="1.3" fill="var(--birch-grain-color)" opacity="0.6"/>
            <circle cx="60" cy="70" r="1.5" fill="var(--birch-grain-color)" opacity="0.5"/>
            <circle cx="30" cy="30" r="1.7" fill="var(--birch-grain-color)" opacity="0.4"/>
            <circle cx="70" cy="60" r="1.2" fill="var(--birch-grain-color)" opacity="0.6"/>
            <circle cx="40" cy="68" r="1.1" fill="var(--birch-grain-color)" opacity="0.7"/>
            <circle cx="65" cy="40" r="1.6" fill="var(--birch-grain-color)" opacity="0.3"/>
            <circle cx="35" cy="45" r="1.0" fill="var(--birch-grain-color)" opacity="0.5"/>
            <circle cx="50" cy="48" r="1.8" fill="var(--birch-grain-color)" opacity="0.8"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>
        
        <!-- 2. Tree (Maple, Top-Down Layered) -->
        <symbol id="tree_maple" viewBox="0 0 100 100">
            <path d="M50,15 Q75,10 90,30 Q95,50 85,75 Q70,90 50,85 Q30,90 15,75 Q5,50 10,30 Q25,10 50,15 Z" fill="var(--maple-green-dark)" opacity="0.9"/>
            <path d="M50,25 Q68,20 80,35 Q83,50 75,68 Q65,80 50,75 Q35,80 20,68 Q17,50 32,35 Q38,20 50,25 Z" fill="var(--maple-green-mid)" opacity="0.95"/>
            <path d="M50,35 Q58,34 65,45 Q66,50 60,60 Q55,65 50,62 Q45,65 40,60 Q34,50 35,45 Q42,34 50,35 Z" fill="var(--maple-green-light)" opacity="1"/>
            <circle cx="45" cy="40" r="3.5" fill="var(--maple-grain-color)" opacity="0.5"/>
            <circle cx="55" cy="35" r="3.2" fill="var(--maple-grain-color)" opacity="0.6"/>
            <circle cx="68" cy="50" r="3.8" fill="var(--maple-grain-color)" opacity="0.4"/>
            <circle cx="32" cy="50" r="3.6" fill="var(--maple-grain-color)" opacity="0.5"/>
            <circle cx="50" cy="60" r="3.4" fill="var(--maple-grain-color)" opacity="0.7"/>
            <circle cx="80" cy="45" r="3.1" fill="var(--maple-grain-color)" opacity="0.45"/>
            <circle cx="20" cy="55" r="3.7" fill="var(--maple-grain-color)" opacity="0.55"/>
            <circle cx="50" cy="25" r="3.3" fill="var(--maple-grain-color)" opacity="0.65"/>
            <circle cx="70" cy="75" r="3.0" fill="var(--maple-grain-color)" opacity="0.35"/>
            <circle cx="75" cy="30" r="2.5" fill="var(--maple-grain-color)" opacity="0.3"/>
            <circle cx="25" cy="70" r="2.8" fill="var(--maple-grain-color)" opacity="0.4"/>
            <circle cx="40" cy="20" r="2.7" fill="var(--maple-grain-color)" opacity="0.6"/>
            <circle cx="60" cy="70" r="2.5" fill="var(--maple-grain-color)" opacity="0.5"/>
            <circle cx="30" cy="30" r="2.6" fill="var(--maple-grain-color)" opacity="0.4"/>
            <circle cx="70" cy="60" r="2.2" fill="var(--maple-grain-color)" opacity="0.6"/>
            <circle cx="40" cy="68" r="2.1" fill="var(--maple-grain-color)" opacity="0.7"/>
            <circle cx="65" cy="40" r="2.0" fill="var(--maple-grain-color)" opacity="0.3"/>
            <circle cx="35" cy="45" r="2.2" fill="var(--maple-grain-color)" opacity="0.5"/>
            <circle cx="50" cy="48" r="2.0" fill="var(--maple-grain-color)" opacity="0.8"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>
        
        <!-- 3. Tree (Spruce, Top-Down Layered) -->
        <symbol id="tree_spruce" viewBox="0 0 100 100">
            <polygon 
                points="50,20 65,30 80,35 68,50 80,65 65,70 50,80 35,70 20,65 32,50 20,35 35,30" 
                fill="var(--spruce-darkest)"
            />
            <polygon 
                points="50,30 62,38 70,45 65,50 68,60 55,65 50,70 38,65 32,60 35,50 30,45 38,38" 
                fill="var(--spruce-mid)"
            />
            <polygon points="50,38 60,47 62,50 60,53 50,62 40,53 38,50 40,47" fill="var(--spruce-lightest)"/>
            <circle cx="50" cy="50" r="2" fill="var(--spruce-center)"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>
        
        <!-- 4. Tree (Oak, Top-Down Layered) -->
        <symbol id="tree_oak" viewBox="0 0 100 100">
            <path d="M50,15 Q70,10 85,25 Q90,50 80,70 Q70,85 50,80 Q30,85 15,70 Q10,50 20,25 Q30,10 50,15 Z" fill="var(--oak-green-dark)" opacity="0.9"/>
            <path d="M50,25 Q65,22 75,35 Q78,50 70,65 Q60,75 50,70 Q40,75 25,65 Q22,50 35,35 Q40,22 50,25 Z" fill="var(--oak-green-mid)" opacity="0.95"/>
            <path d="M50,35 Q58,38 65,50 Q58,62 50,60 Q42,62 35,50 Q42,38 50,35 Z" fill="var(--oak-green-light)" opacity="1"/>
            <circle cx="45" cy="40" r="2.5" fill="var(--oak-grain-color)" opacity="0.5"/>
            <circle cx="55" cy="35" r="2.2" fill="var(--oak-grain-color)" opacity="0.6"/>
            <circle cx="68" cy="50" r="2.8" fill="var(--oak-grain-color)" opacity="0.4"/>
            <circle cx="32" cy="50" r="2.6" fill="var(--oak-grain-color)" opacity="0.5"/>
            <circle cx="50" cy="60" r="2.4" fill="var(--oak-grain-color)" opacity="0.7"/>
            <circle cx="75" cy="30" r="2.0" fill="var(--oak-grain-color)" opacity="0.3"/>
            <circle cx="25" cy="70" r="2.1" fill="var(--oak-grain-color)" opacity="0.4"/>
            <circle cx="40" cy="20" r="2.3" fill="var(--oak-grain-color)" opacity="0.6"/>
            <circle cx="60" cy="70" r="2.5" fill="var(--oak-grain-color)" opacity="0.5"/>
            <circle cx="30" cy="30" r="2.7" fill="var(--oak-grain-color)" opacity="0.4"/>
            <circle cx="70" cy="60" r="2.2" fill="var(--oak-grain-color)" opacity="0.6"/>
            <circle cx="40" cy="68" r="2.1" fill="var(--oak-grain-color)" opacity="0.7"/>
            <circle cx="65" cy="40" r="2.6" fill="var(--oak-grain-color)" opacity="0.3"/>
            <circle cx="35" cy="45" r="2.0" fill="var(--oak-grain-color)" opacity="0.5"/>
            <circle cx="50" cy="48" r="2.8" fill="var(--oak-grain-color)" opacity="0.8"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>

        <!-- 5. Red/Yellow Flower Field (Scatter) -->
        <symbol id="flowerfield_red" viewBox="0 0 100 100">
            <circle cx="20" cy="20" r="3" fill="var(--flower-red)"/>
            <circle cx="55" cy="15" r="2.5" fill="var(--flower-red)"/>
            <circle cx="80" cy="30" r="3" fill="var(--flower-red)"/>
            <circle cx="30" cy="50" r="2.5" fill="var(--flower-red)"/>
            <circle cx="70" cy="70" r="3.5" fill="var(--flower-red)"/>
            <circle cx="15" cy="85" r="2" fill="var(--flower-red)"/>
            <circle cx="40" cy="35" r="2" fill="var(--crop-yellow)"/>
            <circle cx="65" cy="25" r="1.5" fill="var(--crop-yellow)"/>
            <circle cx="50" cy="45" r="2.5" fill="var(--crop-yellow)"/>
            <circle cx="85" cy="55" r="1.8" fill="var(--crop-yellow)"/>
            <circle cx="35" cy="75" r="2" fill="var(--crop-yellow)"/>
            <circle cx="25" cy="10" r="1.5" fill="var(--crop-yellow)"/>
            <circle cx="75" cy="85" r="2.2" fill="var(--crop-yellow)"/>
        </symbol>
        
        <!-- 6. Dense Purple/Blue Flower Field -->
        <symbol id="flowerfield_purple" viewBox="0 0 100 100">
            <circle cx="10" cy="10" r="3" fill="var(--flower-purple)"/>
            <circle cx="30" cy="15" r="2.5" fill="var(--flower-purple)"/>
            <circle cx="55" cy="20" r="3.5" fill="var(--flower-purple)"/>
            <circle cx="80" cy="12" r="2.8" fill="var(--flower-purple)"/>
            <circle cx="95" cy="25" r="3" fill="var(--flower-purple)"/>
            <circle cx="15" cy="40" r="2.2" fill="var(--flower-purple)"/>
            <circle cx="40" cy="50" r="3" fill="var(--flower-purple)"/>
            <circle cx="65" cy="45" r="2.5" fill="var(--flower-purple)"/>
            <circle cx="85" cy="40" r="3.2" fill="var(--flower-purple)"/>
            <circle cx="25" cy="65" r="3.5" fill="var(--flower-purple)"/>
            <circle cx="50" cy="75" r="2.8" fill="var(--flower-purple)"/>
            <circle cx="75" cy="80" r="3" fill="var(--flower-purple)"/>
            <circle cx="90" cy="70" r="2.5" fill="var(--flower-purple)"/>
            <circle cx="15" cy="90" r="3.2" fill="var(--flower-purple)"/>
            <circle cx="45" cy="90" r="2.5" fill="var(--flower-purple)"/>
            <circle cx="22" cy="50" r="1.5" fill="#e0ffff"/>
            <circle cx="60" cy="10" r="1.2" fill="#e0ffff"/>
            <circle cx="80" cy="50" r="1.8" fill="#e0ffff"/>
            <circle cx="50" cy="30" r="1.6" fill="#e0ffff"/>
            <circle cx="70" cy="55" r="1.4" fill="#e0ffff"/>
        </symbol>

        <!-- 7. Sunflower Field (Resource) -->
        <symbol id="sunflower_field" viewBox="0 0 100 100">
            <circle cx="20" cy="25" r="4" fill="#ffd700"/>
            <circle cx="20" cy="25" r="1.5" fill="#8b4513"/>
            <circle cx="50" cy="10" r="4.5" fill="#f1c40f"/>
            <circle cx="50" cy="10" r="1.8" fill="#a0522d"/>
            <circle cx="80" cy="30" r="4" fill="#ffd700"/>
            <circle cx="80" cy="30" r="1.5" fill="#8b4513"/>
            <circle cx="35" cy="55" r="3.8" fill="#f1c40f"/>
            <circle cx="35" cy="55" r="1.6" fill="#a0522d"/>
            <circle cx="70" cy="70" r="4.2" fill="#ffd700"/>
            <circle cx="70" cy="70" r="1.7" fill="#8b4513"/>
            <circle cx="10" cy="80" r="3.5" fill="#f1c40f"/>
            <circle cx="10" cy="80" r="1.4" fill="#a0522d"/>
            <circle cx="90" cy="50" r="3.9" fill="#ffd700"/>
            <circle cx="90" cy="50" r="1.6" fill="#8b4513"/>
        </symbol>

        <!-- 8. Daisy Field (White Petals/Yellow Centers) -->
        <symbol id="daisy_field" viewBox="0 0 100 100">
            <circle cx="20" cy="20" r="3" fill="#ffffff"/>
            <circle cx="20" cy="20" r="1" fill="#ffd700"/>
            <circle cx="55" cy="15" r="2.5" fill="#ffffff"/>
            <circle cx="55" cy="15" r="0.8" fill="#ffd700"/>
            <circle cx="80" cy="30" r="3" fill="#ffffff"/>
            <circle cx="80" cy="30" r="1" fill="#ffd700"/>
            <circle cx="30" cy="50" r="2.5" fill="#ffffff"/>
            <circle cx="30" cy="50" r="0.8" fill="#ffd700"/>
            <circle cx="70" cy="70" r="3.5" fill="#ffffff"/>
            <circle cx="70" cy="70" r="1.2" fill="#ffd700"/>
            <circle cx="15" cy="85" r="2" fill="#ffffff"/>
            <circle cx="15" cy="85" r="0.7" fill="#ffd700"/>
            <circle cx="40" cy="35" r="2" fill="#ffffff"/>
            <circle cx="40" cy="35" r="0.7" fill="#ffd700"/>
            <circle cx="85" cy="55" r="1.8" fill="#ffffff"/>
            <circle cx="85" cy="55" r="0.6" fill="#ffd700"/>
            <circle cx="50" cy="80" r="3" fill="#ffffff"/>
            <circle cx="50" cy="80" r="1" fill="#ffd700"/>
        </symbol>
        
        <!-- 9. Dense Yellow Flower Field (Monochromatic) -->
        <symbol id="flowerfield_yellow" viewBox="0 0 100 100">
            <circle cx="15" cy="15" r="3.5" fill="var(--crop-yellow)"/>
            <circle cx="40" cy="10" r="2.8" fill="var(--crop-yellow)"/>
            <circle cx="70" cy="25" r="3" fill="var(--crop-yellow)"/>
            <circle cx="90" cy="18" r="2.5" fill="var(--crop-yellow)"/>
            <circle cx="10" cy="50" r="3" fill="var(--crop-yellow)"/>
            <circle cx="35" cy="45" r="4" fill="var(--crop-yellow)"/>
            <circle cx="65" cy="55" r="3.2" fill="var(--crop-yellow)"/>
            <circle cx="85" cy="40" r="2.8" fill="var(--crop-yellow)"/>
            <circle cx="25" cy="80" r="3.5" fill="var(--crop-yellow)"/>
            <circle cx="55" cy="70" r="2.9" fill="var(--crop-yellow)"/>
            <circle cx="75" cy="90" r="4" fill="var(--crop-yellow)"/>
            <circle cx="5" cy="75" r="2.5" fill="var(--crop-yellow)"/>
            <circle cx="20" cy="30" r="1.5" fill="#e0b800"/>
            <circle cx="60" cy="15" r="1.2" fill="#e0b800"/>
            <circle cx="80" cy="65" r="1.8" fill="#e0b800"/>
            <circle cx="45" cy="50" r="1.6" fill="#e0b800"/>
            <circle cx="70" cy="40" r="1.4" fill="#e0b800"/>
        </symbol>

        <!-- 10. Dense White Flower Field (Monochromatic) -->
        <symbol id="flowerfield_white" viewBox="0 0 100 100">
            <circle cx="15" cy="15" r="3.5" fill="var(--snow-white)"/>
            <circle cx="40" cy="10" r="2.8" fill="var(--snow-white)"/>
            <circle cx="70" cy="25" r="3" fill="var(--snow-white)"/>
            <circle cx="90" cy="18" r="2.5" fill="var(--snow-white)"/>
            <circle cx="10" cy="50" r="3" fill="var(--snow-white)"/>
            <circle cx="35" cy="45" r="4" fill="var(--snow-white)"/>
            <circle cx="65" cy="55" r="3.2" fill="var(--snow-white)"/>
            <circle cx="85" cy="40" r="2.8" fill="var(--snow-white)"/>
            <circle cx="25" cy="80" r="3.5" fill="var(--snow-white)"/>
            <circle cx="55" cy="70" r="2.9" fill="var(--snow-white)"/>
            <circle cx="75" cy="90" r="4" fill="var(--snow-white)"/>
            <circle cx="5" cy="75" r="2.5" fill="var(--snow-white)"/>
            <circle cx="20" cy="30" r="1.5" fill="#cccccc"/>
            <circle cx="60" cy="15" r="1.2" fill="#cccccc"/>
            <circle cx="80" cy="65" r="1.8" fill="#cccccc"/>
            <circle cx="45" cy="50" r="1.6" fill="#cccccc"/>
            <circle cx="70" cy="40" r="1.4" fill="#cccccc"/>
        </symbol>

        <!-- 11. Dense Blue Flower Field (Monochromatic) -->
        <symbol id="flowerfield_blue" viewBox="0 0 100 100">
            <circle cx="15" cy="15" r="3.5" fill="#4682b4"/> 
            <circle cx="40" cy="10" r="2.8" fill="#4682b4"/>
            <circle cx="70" cy="25" r="3" fill="#4682b4"/>
            <circle cx="90" cy="18" r="2.5" fill="#4682b4"/>
            <circle cx="10" cy="50" r="3" fill="#4682b4"/>
            <circle cx="35" cy="45" r="4" fill="#4682b4"/>
            <circle cx="65" cy="55" r="3.2" fill="#4682b4"/>
            <circle cx="85" cy="40" r="2.8" fill="#4682b4"/>
            <circle cx="25" cy="80" r="3.5" fill="#4682b4"/>
            <circle cx="55" cy="70" r="2.9" fill="#4682b4"/>
            <circle cx="75" cy="90" r="4" fill="#4682b4"/>
            <circle cx="5" cy="75" r="2.5" fill="#4682b4"/>
            <circle cx="20" cy="30" r="1.5" fill="#87cefa"/>
            <circle cx="60" cy="15" r="1.2" fill="#87cefa"/>
            <circle cx="80" cy="65" r="1.8" fill="#87cefa"/>
            <circle cx="45" cy="50" r="1.6" fill="#87cefa"/>
            <circle cx="70" cy="40" r="1.4" fill="#87cefa"/>
        </symbol>

        <!-- 12. Rock (Small, single obstacle) -->
        <symbol id="rock_small" viewBox="0 0 100 100">
            <path d="M20,60 L40,30 L70,40 L85,70 L55,80 Z" fill="var(--rock-dark)"/>
            <path d="M25,60 L45,35 L68,43 L80,68 L58,78 Z" fill="var(--rock-grey)"/>
            <circle cx="40" cy="50" r="3" fill="var(--rock-light)" opacity="0.6"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>

        <!-- 13. Rock (Medium, single obstacle) -->
        <symbol id="rock_medium" viewBox="0 0 100 100">
            <path d="M30,50 Q40,30 60,35 Q80,50 70,70 Q50,80 30,70 Q20,60 30,50 Z" fill="var(--rock-dark)"/>
            <path d="M35,50 Q45,35 60,40 Q75,50 65,65 Q50,75 35,65 Q25,55 35,50 Z" fill="var(--rock-grey)"/>
            <circle cx="50" cy="45" r="4" fill="var(--rock-light)" opacity="0.7"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>

        <!-- 14. Rock (Tiny, low-profile) -->
        <symbol id="rock_tiny" viewBox="0 0 100 100">
            <ellipse cx="50" cy="50" rx="15" ry="10" fill="var(--rock-dark)"/>
            <ellipse cx="50" cy="50" rx="13" ry="8" fill="var(--rock-grey)"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>

        <!-- 15. Rock Cluster (Medium group of obstacles) -->
        <symbol id="rock_cluster" viewBox="0 0 100 100">
            <path d="M20,40 L35,25 L50,40 L30,55 Z" fill="var(--rock-dark)"/>
            <path d="M25,40 L40,30 L45,35 L35,50 Z" fill="var(--rock-grey)"/>
            <path d="M60,60 L75,50 L85,70 L70,80 Z" fill="var(--rock-dark)"/>
            <path d="M65,62 L78,55 L82,65 L72,75 Z" fill="var(--rock-grey)"/>
            <circle cx="45" cy="75" r="8" fill="var(--rock-dark)"/>
            <circle cx="45" cy="75" r="6" fill="var(--rock-grey)"/>
            <circle cx="60" cy="30" r="5" fill="var(--rock-dark)"/>
            <circle cx="60" cy="30" r="3" fill="var(--rock-grey)"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>

        <!-- 16. Rock Cluster (Elongated) -->
        <symbol id="rock_cluster_elongated" viewBox="0 0 100 100">
            <path d="M10,50 L30,40 L50,45 L70,35 L90,45 L80,60 L60,70 L40,65 L20,75 Z" fill="var(--rock-dark)"/>
            <path d="M15,50 L35,45 L50,50 L75,40 L85,50 L75,65 L55,70 L35,60 L25,70 Z" fill="var(--rock-grey)"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>

        <!-- 17. Rock Cluster (Scattered Dots) -->
        <symbol id="rock_cluster_scattered" viewBox="0 0 100 100">
            <circle cx="20" cy="30" r="4" fill="var(--rock-dark)"/>
            <circle cx="45" cy="20" r="3" fill="var(--rock-grey)"/>
            <circle cx="70" cy="40" r="5" fill="var(--rock-dark)"/>
            <circle cx="35" cy="65" r="3.5" fill="var(--rock-grey)"/>
            <circle cx="80" cy="70" r="4" fill="var(--rock-dark)"/>
            <circle cx="50" cy="80" r="2.5" fill="var(--rock-grey)"/>
            <circle cx="15" cy="55" r="5.5" fill="var(--rock-dark)"/>
            <circle cx="60" cy="55" r="3" fill="var(--rock-grey)"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>

        <!-- 18. Rock Hazard (Large, rugged obstacle) -->
        <symbol id="rock_hazard" viewBox="0 0 100 100">
            <path d="M15,45 L40,15 L70,25 L85,55 L75,75 L45,85 L20,70 Z" fill="var(--rock-dark)"/>
            <path d="M25,48 L45,25 L65,35 L78,58 L68,72 L40,80 L28,65 Z" fill="var(--rock-grey)"/>
            <rect x="40" y="30" width="15" height="5" fill="#555" transform="rotate(20 47 32)"/>
            <rect x="55" y="60" width="10" height="4" fill="#555" transform="rotate(-30 60 62)"/>
            <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
        </symbol>
    </svg>
    `;
}