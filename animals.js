// animals.js

/**
 * Provides SVG definitions for various wildlife and livestock assets.
 * These definitions are used by the main game loop to render entities on the canvas.
 * @returns {string} HTML string containing SVG <symbol> definitions.
 */
function getAnimalsSVGDefinitions() {
    return `
        <svg>
            <!-- Bear (Forest Wildlife) -->
            <symbol id="bear" viewBox="0 0 100 100">
                <!-- Color palette for brown bear -->
                <rect id="bear-brown-color" fill="#8B4513" style="display:none;"/>
                <rect id="bear-dark-brown-color" fill="#654321" style="display:none;"/>

                <!-- Paws (Top-down small, rounded dark circles) - Must come BEFORE the body to be overlaid -->
                <!-- Paws are still visible, but the body overlaps their inner edges/bases. -->
                <circle cx="35" cy="35" r="6" fill="#654321"/>
                <circle cx="65" cy="35" r="6" fill="#654321"/>
                <circle cx="35" cy="65" r="6" fill="#654321"/>
                <circle cx="65" cy="65" r="6" fill="#654321"/>

                <!-- Body (Brown, horizontally thinner: rx=20) - Placed after legs/paws -->
                <ellipse cx="50" cy="50" rx="20" ry="25" fill="#8B4513"/>
                <!-- Head (Distinct circle at front, Brown) -->
                <circle cx="50" cy="30" r="10" fill="#8B4513"/>
                
                <!-- Ears (Small round circles on the sides of the head) - Placed after head/body to overlay body/head-->
                <circle cx="40" cy="25" r="3" fill="#654321"/>
                <circle cx="60" cy="25" r="3" fill="#654321"/>
                
                <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
            </symbol>

            <!-- Cat (Wildlife/Domestic) -->
            <symbol id="cat" viewBox="0 0 100 100">
                <!-- Color palette: Gray/Dark Gray for wolf/cat -->
                <rect id="cat-gray-color" fill="#7f8c8d" style="display:none;"/>
                <rect id="cat-dark-color" fill="#34495e" style="display:none;"/>

                <!-- Legs/Paws (Dark circles) - Positioned under the main body -->
                <circle cx="40" cy="45" r="3" fill="#34495e"/>
                <circle cx="60" cy="45" r="3" fill="#34495e"/>
                <circle cx="40" cy="60" r="3" fill="#34495e"/>
                <circle cx="60" cy="60" r="3" fill="#34495e"/>

                <!-- Body (Gray, very lean oval) - rx=10, ry=20 -->
                <ellipse cx="50" cy="50" rx="10" ry="20" fill="#7f8c8d"/>
                
                <!-- Head (At the front) -->
                <!-- Main head circle -->
                <circle cx="50" cy="30" r="7" fill="#7f8c8d"/>
                
                <!-- Ears (Pointed shapes at the top of the head) - Adjusted to be more outward -->
                <polygon points="45,28 30,22 45,12" fill="#34495e"/>
                <polygon points="55,28 70,22 55,12" fill="#34495e"/>
                
                <!-- Tail (A straight line at the back) -->
                <line x1="50" y1="70" x2="50" y2="85" stroke="#7f8c8d" stroke-width="5" stroke-linecap="round"/>
                
                <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
            </symbol>

            <!-- Chicken (Farm Animal/Scatter) -->
            <symbol id="chicken" viewBox="0 0 100 100">
                <!-- Color palette for chicken -->
                <rect id="chicken-body-color" fill="#f0f8ff" style="display:none;"/>
                <rect id="chicken-red-color" fill="#ff0000" style="display:none;"/>
                <rect id="chicken-orange-color" fill="#ffa500" style="display:none;"/>

                <!-- Body (White/off-white egg shape) - cy=50, rx=7, ry=10. Bottom of body is at 50 + 10 = 60. -->
                <ellipse cx="50" cy="50" rx="7" ry="10" fill="#f0f8ff"/>
                
                <!-- Head (At the front) - cy=40, r=5 -->
                <circle cx="50" cy="40" r="5" fill="#f0f8ff"/>

                <!-- Beak (small orange triangle) - cy=36 -->
                <polygon points="50,33 53,36 47,36" fill="#ffa500"/>

                <!-- Comb (Small red shape on head) - cy=40, rx=1, ry=3 -->
                <ellipse cx="50" cy="40" rx="1" ry="3" fill="#ff0000"/>

                <!-- Small Red Tail at the bottom of the body (y=60) -->
                <!-- Simple small fan shape, starting at the bottom edge of the body (y=60) -->
                <path d="M45,60 Q50,65 55,60 L50,62 Z" fill="#ff0000"/>
                
                <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
            </symbol>

            <!-- Cow (Farm Animal) -->
            <symbol id="cow" viewBox="0 0 100 100">
                <!-- Color palette for cow -->
                <rect id="cow-white-color" fill="#f0f0f0" style="display:none;"/>
                <rect id="cow-black-color" fill="#000" style="display:none;"/>

                <!-- Body rotation: Vertical orientation -->
                
                <!-- Legs/Hooves (Small black circles) - Placed first to be overlaid by the body -->
                <circle cx="40" cy="35" r="4" fill="#000"/>
                <circle cx="60" cy="35" r="4" fill="#000"/>
                <circle cx="40" cy="65" r="4" fill="#000"/>
                <circle cx="60" cy="65" r="4" fill="#000"/>

                <!-- Body (White, vertically elongated oval) - rx=15, ry=35 -->
                <ellipse cx="50" cy="50" rx="15" ry="35" fill="#f0f0f0"/>

                <!-- Black spots (Clear top-down patches) - Adjusted for the thinner body (rx=15) -->
                <path d="M45,35 Q38,45 42,50 Q38,55 45,65 Q50,60 55,50 Q50,40 45,35 Z" fill="#000"/>
                <rect x="50" y="55" width="10" height="15" fill="#000" rx="5" transform="rotate(90 55 62.5)"/>

                <!-- Head/Snout (at the center top) - White fill -->
                <circle cx="50" cy="15" r="8" fill="#f0f0f0"/>

                <!-- Ears/Horns (Small features near the head) - Moved X-coordinates outwards from 42/58 to 38/62 and Y from 12 to 15 -->
                <!-- Simple small ears -->
                <path d="M45,20 L38,15 L45,18 Z" fill="#d3d3d3"/>
                <path d="M55,20 L62,15 L55,18 Z" fill="#d3d3d3"/>
                
                <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
            </symbol>

            <!-- Stag (Forest Wildlife) -->
            <symbol id="stag" viewBox="0 0 100 100">
                <!-- Color palette for deer (lighter brown, darker hooves/antlers) -->
                <rect id="deer-light-brown" fill="#a0522d" style="display:none;"/>
                <rect id="hoof-color" fill="#654321" style="display:none;"/>

                <!-- Legs (Small dark circles for hooves/bases) - Placed first to be overlaid by the body -->
                <circle cx="40" cy="40" r="3" fill="#654321"/>
                <circle cx="60" cy="40" r="3" fill="#654321"/>
                <circle cx="40" cy="65" r="3" fill="#654321"/>
                <circle cx="60" cy="65" r="3" fill="#654321"/>

                <!-- Body (Elongated oval, light brown) - rx=10 (very thin), ry=25 (long) -->
                <ellipse cx="50" cy="50" rx="10" ry="25" fill="#a0522d"/>

                <!-- Head (Small circle at the front, slightly darker brown) -->
                <circle cx="50" cy="25" r="5" fill="#8b4513"/>
                
                <!-- Ears (Small pointed shapes, top-down view) -->
                <path d="M48,25 L45,20 L48,15 Z" fill="#8b4513"/>
                <path d="M52,25 L55,20 L52,15 Z" fill="#8b4513"/>
                
                <!-- Long Antlers (Radiating, top-down branches from near the head) -->
                <!-- Left Antler branch points. Starting near the head (48, 25) -->
                <path d="M48,25 L40,10 L35,15 L30,10 L40,5" stroke="#654321" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                <!-- Right Antler branch points. Starting near the head (52, 25) -->
                <path d="M52,25 L60,10 L65,15 L70,10 L60,5" stroke="#654321" stroke-width="2.5" stroke-linecap="round" fill="none"/>

                <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
            </symbol>

            <!-- Pig (Farm Animal) -->
            <symbol id="pig" viewBox="0 0 100 100">
                <!-- Color palette for pig -->
                <rect id="pig-pink-color" fill="#ffc0cb" style="display:none;"/>
                <rect id="pig-dark-pink-color" fill="#e0a0b0" style="display:none;"/>

                <!-- Legs/Hooves (Small dark circles) - Lower legs cy changed from 55 to 60 -->
                <circle cx="40" cy="45" r="3" fill="#e0a0b0"/>
                <circle cx="60" cy="45" r="3" fill="#e0a0b0"/>
                <circle cx="40" cy="60" r="3" fill="#e0a0b0"/>
                <circle cx="60" cy="60" r="3" fill="#e0a0b0"/>

                <!-- Pink body (Horizontally very thin: rx=10, ry=20) -->
                <ellipse cx="50" cy="50" rx="10" ry="20" fill="#ffc0cb"/>
                
                <!-- Head (Removed) -->
                
                <!-- Ears (Small triangular/pointed shapes, top-down view) -->
                <polygon points="40,35 45,28 48,35" fill="#ffc0cb" stroke="#e0a0b0" stroke-width="1"/>
                <polygon points="60,35 55,28 52,35" fill="#ffc0cb" stroke="#e0a0b0" stroke-width="1"/>
                
                <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
            </symbol>

            <!-- Rabbit (Brown) -->
            <symbol id="rabbit-b" viewBox="0 0 100 100">
                <!-- Color palette: Brown/Tan -->
                <!-- Main Body Color -->
                <rect id="brown-body-color" fill="#8b4513" style="display:none;"/>
                <!-- Lighter Accent/Ear Color -->
                <rect id="tan-accent-color" fill="#a0522d" style="display:none;"/>
                <!-- Foot Color -->
                <rect id="foot-color" fill="#654321" style="display:none;"/>

                <!-- Body (Brown oval) - rx=10 (narrow), ry=12 (long) -->
                <ellipse cx="50" cy="55" rx="10" ry="12" fill="#8b4513"/>
                <!-- Head (Brown circle) -->
                <circle cx="50" cy="40" r="7" fill="#8b4513"/>
                <!-- Ears (Tan elongated ovals) -->
                <ellipse cx="45" cy="30" rx="3" ry="8" fill="#a0522d" transform="rotate(-15 45 30)"/>
                <ellipse cx="55" cy="30" rx="3" ry="8" fill="#a0522d" transform="rotate(15 55 30)"/>
                <!-- Legs/feet (small dark brown dots) -->
                <circle cx="40" cy="60" r="2" fill="#654321"/>
                <circle cx="60" cy="60" r="2" fill="#654321"/>
                <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
            </symbol>

            <!-- Rabbit (White) -->
            <symbol id="rabbit-w" viewBox="0 0 100 100">
                <!-- Body (Light gray oval) - Made horizontally narrow (rx=10) and vertically longer (ry=12) -->
                <ellipse cx="50" cy="55" rx="10" ry="12" fill="#b0c4de"/>
                <!-- Head -->
                <circle cx="50" cy="40" r="7" fill="#b0c4de"/>
                <!-- Ears (Elongated ovals seen clearly from above) -->
                <ellipse cx="45" cy="30" rx="3" ry="8" fill="#a0b4cd" transform="rotate(-15 45 30)"/>
                <ellipse cx="55" cy="30" rx="3" ry="8" fill="#a0b4cd" transform="rotate(15 55 30)"/>
                <!-- Legs/feet (small light dots) -->
                <circle cx="40" cy="60" r="2" fill="#d3d3d3"/>
                <circle cx="60" cy="60" r="2" fill="#d3d3d3"/>
                <text x="50" y="90" font-size="8" fill="#fff" text-anchor="middle"> </text>
            </symbol>
        </svg>
    `;
}