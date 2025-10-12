// game.js

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const controlPanel = document.getElementById('controlPanel');
        const fileInput = document.getElementById('fileInput');
        const clearAllButton = document.getElementById('clearAllButton');
        const spawnButtons = document.querySelectorAll('.spawn-button');
        const zoomSlider = document.getElementById('zoomSlider');
        const zoomValueSpan = document.getElementById('zoomValue');
        const body = document.body;
        const svgDefinitionsContainer = document.getElementById('svgDefinitionsContainer');
        const startAttackButton = document.getElementById('startAttackButton'); 

        // Enemy Configuration Inputs
        const zombieCountInput = document.getElementById('zombieCount');
        const crawlerCountInput = document.getElementById('crawlerCount');
        const raiderCountInput = document.getElementById('raiderCount');
        
        // Player Resources
        let playerCoins = 5000;
        const coinDisplay = document.getElementById('coinDisplay');

        // NEW: Economic Rates Inputs
        const incomeTaxInput = document.getElementById('incomeTaxInput');
        const vatInput = document.getElementById('vatInput');
        // NEW: Interest Rate Input and Inflation Display
        const interestRateInput = document.getElementById('interestRateInput');
        const inflationDisplay = document.getElementById('inflationDisplay'); // Assuming an element with this ID exists in index.html
        
        let incomeTaxRate = parseFloat(incomeTaxInput?.value) || 10; // Default 10%
        let vatRate = parseFloat(vatInput?.value) || 5; // Default 5%
        // NEW: Interest Rate and Inflation State
        let interestRate = parseFloat(interestRateInput?.value) || 0; // Default 0%
        let currentInflation = 0; // Calculated
        
        // Civilian Economic Configuration
        const CIVILIAN_START_COINS = 100;
        const OFFICE_CAPACITY = 10; // Max civilians that can be assigned to one office
        
        // NEW HEALTH CONSTANTS
        const CIVILIAN_START_HEALTH = 100;
        const CIVILIAN_WORK_HEALTH_LOSS = 5; // Health lost per work session
        const CIVILIAN_MIN_WORK_HEALTH = 50; // Minimum health to work (50%)
        const CIVILIAN_CRITICAL_HEALTH = 30; // Health to trigger hospital run (30%)
        const CIVILIAN_HOSPITAL_HEAL_RATE = 20; // Health gained per second at hospital
        const CIVILIAN_REST_HEAL_RATE = 10; // Health gained per second at skyscraper
        // END NEW HEALTH CONSTANTS
        
        // NEW DOCTOR/HEALING CONSTANTS
        const DOCTOR_HEAL_RANGE = 40; // Range to target a wounded unit
        const DOCTOR_HEAL_AMOUNT = 10; // HP healed per second
        const DOCTOR_HEAL_COOLDOWN = 1.0; // Cooldown to re-target/re-heal (for visual only, healing is continuous)
        // END NEW DOCTOR/HEALING CONSTANTS
        
        // NEW MEDIC HEALING CONSTANTS
        const MEDIC_HEAL_RANGE = 50; // Range to target a wounded unit
        const MEDIC_HEAL_AMOUNT = 5; // HP healed per second
        // END NEW MEDIC HEALING CONSTANTS

        // NEW VEHICLE/ENGINEER FUEL CONSTANTS
        const DEFAULT_MAX_FUEL = 1000; // For most vehicles
        const ENGINEER_MAX_FUEL = 100;
        const DEFAULT_FUEL_RATE = 0.05; // Fuel per unit of distance moved
        const REFINERY_RECHARGE_RATE = 15; // Engineer fuel per second at refinery (Self-refuel rate - used for consumption in the new logic)
        const FUEL_TRANSFER_RATE = 200; // Fuel transferred per second (from Engineer to Vehicle)
        const FUEL_RANGE = 30; // Range for engineer to start fueling vehicle
        // END NEW VEHICLE/ENGINEER FUEL CONSTANTS
        
        // NEW RAW MATERIAL CONSTANTS (For Bar and Chef)
        const BAR_MAX_RAW_MATERIAL = 500;
        const CHEF_MAX_RAW_MATERIAL = 100;
        const RAW_MATERIAL_LOAD_RATE = 50; // Rate at which chef loads/unloads raw material/fuel
        // NEW: Refinery's max fuel will be its max raw material capacity
        const REFINERY_MAX_FUEL = 1000; 
        // END NEW RAW MATERIAL CONSTANTS
        
        // NEW POWER PLANT CONSTANTS
        const POWER_PLANT_MAX_POWER = 1000; // Max power capacity
        const POWER_PLANT_DECAY_RATE = 1; // Power lost per second
        // END NEW POWER PLANT CONSTANTS
        
        // NEW CLEANER CONSTANTS
        const CLEANER_MAX_RAW_MATERIAL = 100; // Max trash/fuel a cleaner can carry
        // NEW: Trash Accumulation
        const BUILDING_MAX_TRASH = 100;
        const TRASH_ACCUMULATION_PER_VISIT = 1; 
        // END NEW CLEANER CONSTANTS
        
        // NEW APC CONSTANTS
        const APC_CAPACITY = 5;
        const APC_EJECT_DISTANCE = 15; // Distance from APC to eject units
        // END NEW APC CONSTANTS
        
        // NEW: APC EJECTION LOCKOUT
        const EJECTION_LOCKOUT_DURATION = 2.0; // Seconds to prevent re-entry/movement after ejection
        // END NEW APC EJECTION LOCKOUT
        
        // NEW: Building Decay/Repair Constants
        const BUILDING_DECAY_RATE = 0.01; // HP loss per second for buildings
        const BUILDING_REPAIR_AMOUNT = 5; // HP gain per work session (per visit by worker)
        // END NEW Building Decay/Repair Constants

        // Civilian Routing Definitions (Simplified to just include the building names)
        const CIVILIAN_ROUTES = {
            civilian: ['skyscraper', 'office', 'grocery_store', 'bar', 'stadium'], // grocery_store added to all routes
            // ADDED ALL MAJOR BUILDINGS FOR CONSTRUCTION WORKER
            construction_worker: ['skyscraper', 'cy', 'trade_center', 'stadium', 'grocery_store', 'barracks', 'hospital', 'university', 'prison', 'office', 'refinery', 'power_plant', 'bunker', 'gym', 'helipad', 'bar', 'wall_segment'], 
            farmer: ['skyscraper', 'refinery', 'bar', 'stadium', 'grocery_store'], // grocery_store added to all routes
            // CHANGED SCIENTIST ROUTE FOR POWER_PLANT
            scientist: ['skyscraper', 'power_plant', 'university', 'grocery_store'], // power_plant added to all routes
            police_officer: ['skyscraper', 'prison', 'gym', 'bar', 'stadium', 'grocery_store'], // grocery_store added to all routes
            doctor: ['skyscraper', 'hospital', 'grocery_store'], // grocery_store added to all routes
            // CHEF ROUTE MODIFIED FOR RAW MATERIAL TRANSPORT LOOP
            chef: ['bar', 'refinery', 'grocery_store'], // Bar for loading, Refinery for work/unloading, Grocery Store for spending
            pilot: ['barracks', 'helipad', 'gym', 'bar', 'stadium', 'grocery_store'], // barracks added for rest, helipad for work
            cleaner: ['skyscraper', 'power_plant', 'grocery_store', 'office', 'bar', 'stadium', 'barracks', 'gym', 'refinery', 'prison', 'university', 'hospital', 'bunker', 'helipad'] // All buildings
        };
        const CIVILIAN_REWARD_COOLDOWN = 1; // seconds to prevent coin spam (for salary/spending)
        const CIVILIAN_WAIT_DURATION = 5; // Increased from 2 to 5 seconds
        
        // NEW: Base Civilian Work/Spend Logic (Used for base values and routing structure)
        const BASE_CIVILIAN_BUILDING_LOGIC = {
            civilian: {
                work: { buildingId: 'office', salary: 200 },
                spend: [
                    { buildingId: 'bar', cost: 50, vat: true },
                    { buildingId: 'stadium', cost: 150, vat: true },
                    { buildingId: 'grocery_store', cost: 30, vat: true }
                ]
            },
            construction_worker: {
                work: { buildingId: 'cy', salary: 250 },
                spend: [
                    { buildingId: 'trade_center', cost: 100, vat: true }, 
                    { buildingId: 'stadium', cost: 150, vat: true },
                    { buildingId: 'grocery_store', cost: 30, vat: true }
                ]
            },
            farmer: {
                work: { buildingId: 'refinery', salary: 180 }, 
                spend: [
                    { buildingId: 'bar', cost: 50, vat: true },
                    { buildingId: 'stadium', cost: 150, vat: true },
                    { buildingId: 'grocery_store', cost: 30, vat: true }
                ]
            },
            scientist: {
                work: { buildingId: 'power_plant', salary: 350 },
                spend: [
                    { buildingId: 'university', cost: 50, vat: false }, // Use University for a non-essential spend
                    { buildingId: 'grocery_store', cost: 30, vat: true }
                ] 
            },
            police_officer: {
                work: { buildingId: 'prison', salary: 220 },
                spend: [
                    { buildingId: 'gym', cost: 40, vat: true },
                    { buildingId: 'bar', cost: 50, vat: true },
                    { buildingId: 'grocery_store', cost: 30, vat: true }
                ]
            },
            doctor: {
                work: { buildingId: 'hospital', salary: 280 },
                spend: [
                    { buildingId: 'grocery_store', cost: 30, vat: true }
                ]
            },
            chef: {
                // Chef is paid upon drop-off at refinery (see AI logic for work/salary implementation)
                work: { buildingId: 'refinery', salary: 250 }, 
                spend: [
                    { buildingId: 'grocery_store', cost: 30, vat: true }
                ]
            },
            pilot: {
                work: { buildingId: 'helipad', salary: 250 }, // CHANGED: Pilot works at Helipad
                spend: [
                    { buildingId: 'helipad', cost: 50, vat: false }, 
                    { buildingId: 'gym', cost: 40, vat: true },
                    { buildingId: 'grocery_store', cost: 30, vat: true }
                ]
            },
            // NEW: Cleaner - collects trash/fuel for the power plant
            cleaner: {
                // Cleaner is paid upon drop-off at power_plant (see AI logic for work/salary implementation)
                work: { buildingId: 'power_plant', salary: 200 }, 
                spend: [
                    { buildingId: 'grocery_store', cost: 30, vat: true },
                    { buildingId: 'bar', cost: 50, vat: true }
                ]
            }
        };
        
        // Mutable copy of the logic, updated dynamically
        let currentEconomicLogic = JSON.parse(JSON.stringify(BASE_CIVILIAN_BUILDING_LOGIC));
        
        // NEW ECONOMIC CONSTANTS (Tuning Parameters)
        const SALARY_INTEREST_RATE_DELAY = 20; // Seconds delay for interest rate to affect salaries
        const POPULATION_PRICE_FACTOR = 0.02; // Price increase/decrease per civilian above/below base
        const PROFESSION_SALARY_FACTOR = 1; // Salary decrease/increase per profession unit above/below base
        const INTEREST_PRICE_FACTOR = 1.5; // Price increase/decrease per point of interest rate
        const INTEREST_SALARY_FACTOR = -1.2; // Salary decrease/increase per point of interest rate
        const INFLATION_SALARY_FACTOR = 1.0; // Salary adjustment per point of inflation to counter price changes
        const BASE_POPULATION = 10; // Population threshold for price/salary dynamic effects
        const THEFT_INTERVAL = 30; // Seconds between theft checks
        const THEFT_AMOUNT = 100;
        // END NEW ECONOMIC CONSTANTS
        
        // NEW: Salary Interest Rate Delay Timer
        let salaryInterestDelayTimer = 0; 
        // NEW: Theft Timer
        let theftTimer = 0;
        
        // NEW: Animal Roaming Configuration
        const ANIMAL_ROAMING_DISTANCE = 80; // Max distance for a random move target
        const ANIMAL_WAIT_DURATION = 3; // Max wait time before picking a new target
        
        // New: Enemy Specs for wave spawning (Copied from previous full game.js)
        const ENEMY_SPECS = {
            zombie: { symbolId: "zombie", width: 8, height: 8, speed: 20, color: "#4CAF50", team: "enemy", hp: 15, damage: 2, range: 10, cooldown: 1 },
            crawler: { symbolId: "crawler", width: 12, height: 12, speed: 20, color: "#222222", team: "enemy", hp: 40, damage: 4, range: 100, cooldown: 2 },
            raider: { symbolId: "raider", width: 8, height: 8, speed: 60, color: "#38a169", team: "enemy", hp: 10, damage: 5, range: 10, cooldown: 0.5 }
        };
        
        // NEW: Display settings
        let showTargetLines = true;
        let showHealthBars = true;
        
        // NEW: Left-Click Move Mode State
        let leftClickMoveMode = false;
        
        // NEW: Map Generator Modal Elements
        const mapGenModal = document.getElementById('mapGenModal'); 
        const openMapGenButton = document.getElementById('openMapGenButton');
        const closeMapGenModal = document.getElementById('closeMapGenModal');
        
        // Function to update the coin display
        function updateCoinDisplay() {
            coinDisplay.textContent = playerCoins.toLocaleString() + ' Coins';
        }
        updateCoinDisplay(); // Initial display update

        // NEW: Event listeners for economic rates
        if (incomeTaxInput) {
            incomeTaxInput.addEventListener('input', () => {
                incomeTaxRate = Math.max(0, Math.min(100, parseInt(incomeTaxInput.value) || 0));
                incomeTaxInput.value = incomeTaxRate;
            });
        }
        if (vatInput) {
            vatInput.addEventListener('input', () => {
                vatRate = Math.max(0, Math.min(100, parseInt(vatInput.value) || 0));
                vatInput.value = vatRate;
            });
        }
        // NEW: Interest Rate Input Listener
        if (interestRateInput) {
            interestRateInput.addEventListener('input', () => {
                // Allow interest rate to be a float, clamped between -10 and 20
                interestRate = Math.max(-10, Math.min(20, parseFloat(interestRateInput.value) || 0)); 
                interestRateInput.value = interestRate;
                salaryInterestDelayTimer = 0; // Reset the delay timer when interest rate changes
            });
        }
        
        // Inject SVG definitions from the external JS files (Copied from previous full game.js)
        if (typeof getBuildingSVGDefinitions === 'function') {
                svgDefinitionsContainer.innerHTML += getBuildingSVGDefinitions();
            } else {
                console.error("Error: getBuildingSVGDefinitions() not found. Ensure buildings.js is loaded correctly.");
        }

        if (typeof getPeopleSVGDefinitions === 'function') {
            svgDefinitionsContainer.innerHTML += getPeopleSVGDefinitions();
        } else {
            console.error("Error: getPeopleSVGDefinitions() not found. Ensure people.js is loaded correctly.");
        }
        if (typeof getVehiclesSVGDefinitions === 'function') {
            svgDefinitionsContainer.innerHTML += getVehiclesSVGDefinitions();
        } else {
            console.error("Error: getVehiclesSVGDefinitions() not found. Ensure vehicles.js is loaded correctly.");
        }
        if (typeof getEnemiesSVGDefinitions === 'function') {
            svgDefinitionsContainer.innerHTML += getEnemiesSVGDefinitions();
        } else {
            console.error("Error: getEnemiesSVGDefinitions() not found. Ensure enemies.js is loaded correctly.");
        }
        
        // NEW: Inject Terrain SVG definitions
        if (typeof getTerrainSVGDefinitions === 'function') {
            svgDefinitionsContainer.innerHTML += getTerrainSVGDefinitions();
        } else {
            console.error("Error: getTerrainSVGDefinitions() not found. Ensure terrain.js is loaded correctly.");
        }
        
        // NEW: Inject Animals SVG definitions
        if (typeof getAnimalsSVGDefinitions === 'function') { 
            svgDefinitionsContainer.innerHTML += getAnimalsSVGDefinitions(); 
        } else { 
            console.error("Error: getAnimalsSVGDefinitions() not found. Ensure animals.js is loaded correctly."); 
        }


        const GAME_WORLD_SIZE = 800; // Logical size of our game world (e.g., 800x800 units)
        let viewPortWidth = 0; 
        let viewPortHeight = 0; 
        let MAP_DATA_SIZE = 256;     

        let currentMapData = null;
        let gameEntities = [];
        let selectedEntity = null;
        let entityIdCounter = 0;

        let currentSpawnConfig = null; 
        
        // Pan and Zoom state variables
        let zoomLevel = parseFloat(zoomSlider.value); // Initialized from the slider's default value (now 5.0)
        let viewportX = 0; 
        let viewportY = 0; 
        
        let isPanning = false;
        let lastPanMouseX = 0;
        let lastPanMouseY = 0;
        
        // NEW: Touch State Variables
        let touchStartTime = 0;
        let lastTouch = null; // Stores last single touch position and canvas coordinates for panning
        let isPinching = false;
        let initialPinchDistance = 0;
        // END NEW
        
        // Combat/Effect state variables
        let destructionEffects = [];
        let combatEffects = [];
        let combatActive = false; // FLAG: Combat/Shooting is disabled until START ATTACK is pressed
        
        // New: Attack Message State
        let attackMessage = null;
        const ATTACK_MESSAGE_DURATION_FRAMES = 180; // 3 seconds at 60 FPS
        let attackMessageLifetime = 0; 

        // New: Multi-placement mode and keyboard shortcuts
        let isCtrlPressed = false;
        let removeModeActive = false;
        let lastSelectedSpawnButton = null; // Track last used spawn button for quick re-insertion

        // NEW: Civilian panic state
        let civilianPanicMode = false;
        let bunkerBuilding = null;
        
        // NEW: APC EJECT BUTTON RECT (Stores the last drawn button location for click detection)
        let ejectButtonRect = null;


        // Global cache for SVG Image objects
        const svgImageCache = new Map();

        // String containing all relevant CSS variable definitions, including both unit and building specific ones. (Copied from previous full game.js)
        const embeddedSvgCss = `
            <style>
                :root {
                    --body-color: #6b8e23;
                    --detail-color: #556b2f;
                    --gear-color: #333333;
                    --highlight-color: #a0c44a;
                    --civilian-body: #6f4e37;
                    --civilian-head: #a3a3a3;
                    --worker-gear: #ffa500;
                    --farmer-gear: #8b4513;
                    --zombie-body: #4CAF50;
                    --zombie-head: #2E7D32;
                    --zombie-wound: #cc0000;
                    --scientist-color: #1e90ff;
                    --police-color: #000080;
                    --doctor-color: #f0f8ff;
                    --chef-color: #ffffff;
                    --pilot-color: #a9a9a9;

                    /* Building specific variables */
                    --military-main: #4a5d3f;
                    --military-detail: #6b8e23;
                    --foundation-color: #333333;
                    --energy-color: #ffff00;
                    --defense-color: #8b0000;
                    --civilian-main-building: #778899;
                    --civilian-detail-building: #b0c4de;
                    --infrastructure-color: #555555;
                    
                    /* Vehicle specific variables (even if hardcoded in original SVG, define here for consistency if they were to use var()) */
                    --track-color: #333333;
                    --vehicle-body-color: #6b8e23;
                    --vehicle-detail-color: #556b2f;
                    --vehicle-highlight-color: #a0c44a;

                    /* NEW: Animal specific variables */
                    --bear-brown-color: #8B4513;
                    --bear-dark-brown-color: #654321;
                    --cat-gray-color: #7f8c8d;
                    --cat-dark-color: #34495e;
                    --chicken-body-color: #f0f8ff;
                    --chicken-red-color: #ff0000;
                    --chicken-orange-color: #ffa500;
                    --cow-white-color: #f0f0f0;
                    --cow-black-color: #000;
                    --deer-light-brown: #a0522d;
                    --hoof-color: #654321;
                    --pig-pink-color: #ffc0cb;
                    --pig-dark-pink-color: #e0a0b0;
                    --brown-body-color: #8b4513;
                    --tan-accent-color: #a0522d;
                    --foot-color: #654321;
                    
                    /* Terrain specific variables (Copied from terrain.js style) */
                    --tree-green: #228b22;
                    --bush-dark: #38761d;
                    --rock-grey: #696969;
                    --soil-brown: #8b4513;
                    --resource-brown: #964b00; 
                    --crop-yellow: #f1c40f;
                    --flower-red: #c0392b; 
                    --flower-purple: #8a2be2; 
                    --sand-yellow: #f4a460; 
                    --grass-light: #6a9b4e; 
                    --snow-white: #f0f8ff; 
                    --water-blue: #005f9e;
                    --dead-tree-brown: #654321; 
                    --palm-green: #9acd32; 
                    --pine-dark-green: #013220; 
                    --birch-green-light: #b8c47b; 
                    --birch-green-mid: #a0ac68;   
                    --birch-green-dark: #899b50;  
                    --birch-grain-color: #556b2f; 
                    --maple-green-dark: #38761d;  
                    --maple-green-mid: #6aa84f;   
                    --maple-green-light: #9acd32; 
                    --maple-grain-color: #2a5515; 
                    --spruce-darkest: #044a2d; 
                    --spruce-mid: #0f523c;    
                    --spruce-lightest: #1e735b; 
                    --spruce-center: #6c9d5d; 
                    --oak-green-dark: #2f4f2f;  
                    --oak-green-mid: #4f804f;   
                    --oak-green-light: #6aa84f; 
                    --oak-grain-color: #1e361e; 
                    --rock-dark: #444444; 
                    --rock-light: #888888;
                }
            </style>
        `;

        /**
         * Generates and caches an HTML Image element from an SVG symbol. (Copied from previous full game.js)
         * @param {string} symbolId The ID of the SVG <symbol> to render.
         * @returns {HTMLImageElement} The cached or newly created Image element.
         */
        function getCachedSvgImage(symbolId) {
            const cacheKey = symbolId; 
            if (svgImageCache.has(cacheKey)) {
                return svgImageCache.get(cacheKey);
            }

            const img = new Image();
            img.crossOrigin = "anonymous"; 

            const tempDiv = document.createElement('div');
            // Cloning innerHTML is required to capture the full set of symbols and the embedded <style> block
            tempDiv.innerHTML = svgDefinitionsContainer.innerHTML;

            const globalDefs = tempDiv.querySelector('defs');
            let defsHtml = '';
            if (globalDefs) {
                defsHtml = globalDefs.outerHTML;
            }

            const symbolElement = tempDiv.querySelector(`#${symbolId}`);
            if (!symbolElement) {
                return null;
            }

            const viewBox = symbolElement.getAttribute('viewBox') || "0 0 50 50"; 
            const [,,vbWidth, vbHeight] = viewBox.split(' ').map(Number);

            const fullSvgString = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${vbWidth}" height="${vbHeight}" viewBox="${viewBox}">
                    ${embeddedSvgCss}
                    ${defsHtml}
                    ${symbolElement.outerHTML}
                    <use href="#${symbolId}" x="0" y="0" width="${vbWidth}" height="${vbHeight}"/>
                </svg>
            `;

            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fullSvgString);

            svgImageCache.set(cacheKey, img);
            return img;
        }

        // NEW: Create and add display control buttons (Copied from previous full game.js)
        function createDisplayControlButtons() {
            // ... (rest of the createDisplayControlButtons function) ...
            // As per the provided index.html, the HTML structure for these buttons is already there, 
            // so we only need the event listeners part, which is at the end of the original function.
            
            // Add event listeners for display control buttons
            document.getElementById('toggleTargetLines').addEventListener('click', toggleTargetLines);
            document.getElementById('toggleHealthBars').addEventListener('click', toggleHealthBars);
            document.getElementById('saveTerrainButton').addEventListener('click', saveTerrainMap);
            document.getElementById('saveGameButton').addEventListener('click', saveGame);
            document.getElementById('loadGameButton').addEventListener('click', () => fileInput.click());
        }

        // NEW: Toggle target lines visibility (Copied from previous full game.js)
        function toggleTargetLines() {
            showTargetLines = !showTargetLines;
            const button = document.getElementById('toggleTargetLines');
            if (showTargetLines) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
            drawGame();
        }

        // NEW: Toggle health bars visibility (Copied from previous full game.js)
        function toggleHealthBars() {
            showHealthBars = !showHealthBars;
            const button = document.getElementById('toggleHealthBars');
            if (showHealthBars) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
            drawGame();
        }

        // NEW: Toggle Left-Click Move Mode (M)
        function toggleLeftClickMoveMode() {
            leftClickMoveMode = !leftClickMoveMode;
            const button = document.getElementById('toggleLeftClickMoveModeButton');
            if (button) {
                if (leftClickMoveMode) {
                    button.classList.add('active');
                    attackMessage = 'Left-Click Move Mode Active';
                } else {
                    button.classList.remove('active');
                    attackMessage = 'Left-Click Move Mode Deactivated';
                }
                attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                drawGame();
            }
        }

        // NEW: Save terrain map function (Copied from previous full game.js)
        function saveTerrainMap() {
            if (!currentMapData) {
                attackMessage = 'No map loaded to save!';
                attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                drawGame();
                return;
            }

            const terrainItems = gameEntities.filter(entity => entity.type === 'terrain');
            
            const mapData = {
                elevationData: currentMapData,
                placeableItems: terrainItems.map(item => ({
                    type: 'terrain',
                    symbolId: item.symbolId,
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                    rotation: item.rotation || 0
                }))
            };

            const dataStr = JSON.stringify(mapData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = 'terrain_map.map';
            link.click();
            
            attackMessage = 'Terrain map saved successfully!';
            attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
            drawGame();
        }

        // NEW: Save game function (Updated to include all new properties)
        function saveGame() {
            if (!currentMapData) {
                attackMessage = 'No game to save!';
                attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                drawGame();
                return;
            }

            const gameData = {
                elevationData: currentMapData,
                gameState: {
                    playerCoins: playerCoins,
                    incomeTaxRate: incomeTaxRate,
                    vatRate: vatRate,
                    // NEW: Save Interest Rate, Inflation, and Economic Logic/Timer
                    interestRate: interestRate,
                    currentInflation: currentInflation,
                    currentEconomicLogic: currentEconomicLogic,
                    salaryInterestDelayTimer: salaryInterestDelayTimer,
                    theftTimer: theftTimer, // NEW: Save Theft Timer
                    // END NEW
                    entities: gameEntities.map(entity => ({
                        id: entity.id,
                        type: entity.type,
                        symbolId: entity.symbolId,
                        x: entity.x,
                        y: entity.y,
                        width: entity.width,
                        height: entity.height,
                        rotation: entity.rotation || 0,
                        color: entity.color,
                        speed: entity.speed,
                        team: entity.team,
                        hp: entity.hp,
                        maxHp: entity.maxHp,
                        damage: entity.damage,
                        attackRange: entity.attackRange,
                        attackCooldown: entity.attackCooldown,
                        currentCooldown: entity.currentCooldown,
                        isCivilian: entity.isCivilian || false,
                        route: entity.route || [],
                        routeIndex: entity.routeIndex || -1,
                        coinCooldown: entity.coinCooldown || 0,
                        waitTimer: entity.waitTimer || 0,
                        targetEntityId: entity.targetEntityId || null,
                        avoidingCollision: entity.avoidingCollision || false,
                        targetX: entity.targetX,
                        targetY: entity.targetY,
                        civilianCoins: entity.civilianCoins || 0, 
                        assignedWorkBuildingId: entity.assignedWorkBuildingId || null,
                        civilianHealth: entity.civilianHealth || CIVILIAN_START_HEALTH,
                        ejectionLockoutTimer: entity.ejectionLockoutTimer || 0, // NEW
                        // NEW VEHICLE/ENGINEER/MEDIC/APC PROPERTIES
                        maxFuel: entity.maxFuel || 0,
                        currentFuel: entity.currentFuel || 0,
                        fuelConsumptionRate: entity.fuelConsumptionRate || 0,
                        isEngineer: entity.isEngineer || false,
                        isMedic: entity.isMedic || false,
                        capacity: entity.capacity || 0,
                        garrisonedUnits: entity.garrisonedUnits || [],
                        // NEW RAW MATERIAL PROPERTIES (For Bar/Chef/Refinery/Cleaner as fuel)
                        maxRawMaterial: entity.maxRawMaterial || 0, 
                        currentRawMaterial: entity.currentRawMaterial || 0,
                        // NEW POWER PLANT PROPERTIES
                        maxPower: entity.maxPower || 0,
                        currentPower: entity.currentPower || 0,
                        // NEW TRASH PROPERTIES
                        maxTrash: entity.maxTrash || 0,
                        currentTrash: entity.currentTrash || 0
                    })),
                    combatActive: combatActive,
                    entityIdCounter: entityIdCounter
                }
            };

            const dataStr = JSON.stringify(gameData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = 'game_save.map';
            link.click();
            
            attackMessage = 'Game saved successfully!';
            attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
            drawGame();
        }

        // NEW: Load game function (Updated to include all new properties)
        function loadGame(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const loadedData = JSON.parse(e.target.result);
                    
                    if (!loadedData.elevationData || !loadedData.gameState) {
                        console.error("Invalid game save file structure.");
                        attackMessage = 'Invalid game save file!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        return;
                    }
                    
                    // Load map data
                    currentMapData = loadedData.elevationData;
                    MAP_DATA_SIZE = currentMapData.length;
                    
                    // Load game state
                    playerCoins = loadedData.gameState.playerCoins;
                    combatActive = loadedData.gameState.combatActive;
                    entityIdCounter = loadedData.gameState.entityIdCounter;
                    
                    // NEW: Load Economic Rates and State
                    incomeTaxRate = loadedData.gameState.incomeTaxRate || 10;
                    vatRate = loadedData.gameState.vatRate || 5;
                    interestRate = loadedData.gameState.interestRate || 0;
                    currentInflation = loadedData.gameState.currentInflation || 0;
                    currentEconomicLogic = loadedData.gameState.currentEconomicLogic ? loadedData.gameState.currentEconomicLogic : JSON.parse(JSON.stringify(BASE_CIVILIAN_BUILDING_LOGIC));
                    salaryInterestDelayTimer = loadedData.gameState.salaryInterestDelayTimer || 0;
                    theftTimer = loadedData.gameState.theftTimer || 0; // NEW: Load Theft Timer

                    if (incomeTaxInput) incomeTaxInput.value = incomeTaxRate;
                    if (vatInput) vatInput.value = vatRate;
                    if (interestRateInput) interestRateInput.value = interestRate;
                    if (inflationDisplay) inflationDisplay.textContent = currentInflation.toFixed(1) + '%';
                    
                    // Load entities
                    gameEntities = loadedData.gameState.entities.map(entityData => ({
                        ...entityData,
                        // Ensure all required properties are set
                        currentCooldown: entityData.currentCooldown || 0,
                        coinCooldown: entityData.coinCooldown || 0,
                        waitTimer: entityData.waitTimer || 0,
                        avoidingCollision: entityData.avoidingCollision || false,
                        // Civilian Economic Properties
                        civilianCoins: entityData.civilianCoins || 0,
                        assignedWorkBuildingId: entityData.assignedWorkBuildingId || null,
                        civilianHealth: entityData.civilianHealth || CIVILIAN_START_HEALTH,
                        ejectionLockoutTimer: entityData.ejectionLockoutTimer || 0, // NEW
                        // NEW VEHICLE/ENGINEER/MEDIC/APC PROPERTIES
                        maxFuel: entityData.maxFuel || 0,
                        currentFuel: entityData.currentFuel || 0,
                        fuelConsumptionRate: entityData.fuelConsumptionRate || 0,
                        isEngineer: entityData.isEngineer || false,
                        isMedic: entityData.isMedic || false,
                        capacity: entityData.capacity || 0,
                        garrisonedUnits: entityData.garrisonedUnits || [],
                        // NEW RAW MATERIAL PROPERTIES (For Bar/Chef/Refinery/Cleaner as fuel)
                        maxRawMaterial: entityData.maxRawMaterial || 0, 
                        currentRawMaterial: entityData.currentRawMaterial || 0,
                        // NEW POWER PLANT PROPERTIES
                        maxPower: entityData.maxPower || 0,
                        currentPower: entityData.currentPower || 0,
                        // NEW TRASH PROPERTIES
                        maxTrash: entityData.maxTrash || 0,
                        currentTrash: entityData.currentTrash || 0
                    }));
                    
                    updateCoinDisplay();
                    selectedEntity = null;
                    currentSpawnConfig = null;
                    body.classList.remove('placement-mode');
                    
                    // Find bunker for civilian panic mode
                    bunkerBuilding = gameEntities.find(e => e.type === 'building' && e.symbolId === 'bunker');
                    
                    attackMessage = 'Game loaded successfully!';
                    attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                    drawGame();
                    
                } catch (error) {
                    console.error("Error loading game save:", error);
                    attackMessage = 'Error loading game save!';
                    attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                    drawGame();
                }
            };
            reader.readAsText(file);
        }

        // NEW: Create and add keyboard shortcut buttons (Copied from previous full game.js)
        function createShortcutButtons() {
            // ... (rest of the createShortcutButtons function, which is already in index.html)
        }

        function resizeCanvas() {
            viewPortWidth = canvas.offsetWidth;
            viewPortHeight = canvas.offsetHeight;
            canvas.width = viewPortWidth;
            canvas.height = viewPortHeight;
            
            clampViewport();
            drawGame(); 
        }
        function clampViewport() {
            const effectiveWorldViewWidth = viewPortWidth / zoomLevel;
            const effectiveWorldViewHeight = viewPortHeight / zoomLevel;

            viewportX = Math.max(0, viewportX); 
            if (effectiveWorldViewWidth < GAME_WORLD_SIZE) { 
                viewportX = Math.min(GAME_WORLD_SIZE - effectiveWorldViewWidth, viewportX);
            } else { 
                // Center the world view if it's smaller than the screen
                viewportX = (GAME_WORLD_SIZE - effectiveWorldViewWidth) / 2;
            }

            viewportY = Math.max(0, viewportY); 
            if (effectiveWorldViewHeight < GAME_WORLD_SIZE) { 
                viewportY = Math.min(GAME_WORLD_SIZE - effectiveWorldViewHeight, viewportY);
            } else { 
                // Center the world view if it's smaller than the screen
                viewportY = (GAME_WORLD_SIZE - effectiveWorldViewHeight) / 2;
            }
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); 

        function getColor(elevation) {
            if (elevation < 0.20) return 'hsl(210, 80%, 35%)'; 
            if (elevation < 0.35) return 'hsl(210, 70%, 55%)'; 
            if (elevation < 0.45) return 'hsl(40, 60%, 85%)';  
            if (elevation < 0.60) return 'hsl(100, 50%, 40%)'; 
            if (elevation < 0.75) return 'hsl(80, 40%, 45%)';  
            if (elevation < 0.90) return 'hsl(30, 30%, 50%)';  
            return 'hsl(0, 0%, 95%)'; 
        }
        function getTerrainTypeAtGameCoord(gameX, gameY) {
            if (!currentMapData || MAP_DATA_SIZE === 0) return 'unknown';
            const mapX = Math.floor((gameX / GAME_WORLD_SIZE) * MAP_DATA_SIZE);
            const mapY = Math.floor((gameY / GAME_WORLD_SIZE) * MAP_DATA_SIZE);
            if (mapX < 0 || mapX >= MAP_DATA_SIZE || mapY < 0 || mapY >= MAP_DATA_SIZE) {
                return 'off_map';
            }
            const elevation = currentMapData[mapY][mapX];
            if (elevation < 0.20) return 'deep_water';
            if (elevation < 0.35) return 'shallow_water';
            if (elevation < 0.45) return 'sand';
            if (elevation < 0.60) return 'grassland';
            if (elevation < 0.75) return 'forest';
            if (elevation < 0.90) return 'mountains';
            return 'snow_peak';
        }
        function isTraversableForUnits(terrainType) {
            return terrainType === 'sand' || terrainType === 'grassland' || 
                   terrainType === 'forest' || terrainType === 'mountains';
        }
        function isValidBuildingPlacement(terrainType) {
            return terrainType !== 'deep_water' && terrainType !== 'off_map';
        }

        // NEW: Check if terrain can be placed on water (Copied from previous full game.js)
        function isValidTerrainPlacement(terrainType, symbolId) {
            const isTreeOrFlower = symbolId.includes('tree') || symbolId.includes('flower') || 
                                  symbolId.includes('bush') || symbolId.includes('palm') || 
                                  symbolId.includes('pine') || symbolId.includes('birch') || 
                                  symbolId.includes('maple') || symbolId.includes('spruce') || 
                                  symbolId.includes('oak');
            
            if (isTreeOrFlower) {
                return terrainType !== 'deep_water' && terrainType !== 'shallow_water' && terrainType !== 'off_map';
            }
            
            return terrainType !== 'off_map';
        }

        // NEW: Quick insert function (Copied from previous full game.js)
        function quickInsert() {
            if (lastSelectedSpawnButton) {
                lastSelectedSpawnButton.click();
            } else {
                attackMessage = 'No previous item to insert. Select an item first.';
                attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                drawGame();
            }
        }

        // NEW: Delete selected entity (Modified to not refund buildings)
        function deleteSelectedEntity() {
            if (selectedEntity) {
                const index = gameEntities.findIndex(e => e.id === selectedEntity.id);
                if (index !== -1) {
                    
                    // Only refund for units/vehicles, not terrain or buildings
                    if (selectedEntity.type !== 'terrain' && selectedEntity.type !== 'building') {
                        let refundAmount = 0;
                        spawnButtons.forEach(button => {
                            if (button.dataset.symbolId === selectedEntity.symbolId) {
                                refundAmount = parseInt(button.dataset.price) || 0;
                            }
                        });
                        if (refundAmount > 0) {
                            playerCoins += refundAmount;
                            updateCoinDisplay();
                            attackMessage = `+${refundAmount} Coins Refunded`;
                            attackMessageLifetime = 60;
                        }
                    }
                    
                    // If deleting an APC, eject its units first (to prevent data loss)
                    if (selectedEntity.symbolId === 'apc' && selectedEntity.garrisonedUnits?.length > 0) {
                        ejectGarrisonedUnits(selectedEntity);
                    }
                    
                    gameEntities.splice(index, 1);
                    selectedEntity = null;
                    drawGame();
                }
            }
        }

        // NEW: Toggle remove mode (Copied from previous full game.js)
        function toggleRemoveMode() {
            removeModeActive = !removeModeActive;
            const removeButton = document.getElementById('removeButton');
            if (removeButton) {
                if (removeModeActive) {
                    removeButton.classList.add('active');
                    body.classList.add('remove-mode');
                    currentSpawnConfig = null;
                    body.classList.remove('placement-mode');
                    attackMessage = 'Remove Mode Active - Click items to delete';
                    attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                } else {
                    removeButton.classList.remove('active');
                    body.classList.remove('remove-mode');
                    attackMessage = 'Remove Mode Deactivated';
                    attackMessageLifetime = 60;
                }
                drawGame();
            }
        }

        // NEW: Cancel current action (Copied from previous full game.js)
        function cancelAction() {
            if (currentSpawnConfig) {
                currentSpawnConfig = null;
                body.classList.remove('placement-mode');
                attackMessage = 'Placement Cancelled';
                attackMessageLifetime = 60;
            } else if (selectedEntity) {
                selectedEntity = null;
                attackMessage = 'Selection Cleared';
                attackMessageLifetime = 60;
            } else if (removeModeActive) {
                toggleRemoveMode();
            } else if (leftClickMoveMode) { // NEW: Cancel left-click move mode
                toggleLeftClickMoveMode();
            }
            drawGame();
        }

        // NEW: Check if enemies are nearby for civilian panic (Copied from previous full game.js)
        function areEnemiesNearby(civilian, radius = 100) {
            return gameEntities.some(entity => 
                entity.team === 'enemy' && 
                entity.hp > 0 &&
                Math.sqrt((entity.x - civilian.x) ** 2 + (entity.y - civilian.y) ** 2) < radius
            );
        }

        // NEW: Check if all enemies are defeated (Copied from previous full game.js)
        function areAllEnemiesDefeated() {
            return !gameEntities.some(entity => entity.team === 'enemy' && entity.hp > 0);
        }
        
        // NEW: Eject all units from an APC
        function ejectGarrisonedUnits(apc) {
            // NEW: Check if APC is on water and prevent ejection
            const terrainType = getTerrainTypeAtGameCoord(apc.x, apc.y);
            if (terrainType === 'deep_water' || terrainType === 'shallow_water') {
                attackMessage = `Cannot eject units on water. Move APC to land first.`;
                attackMessageLifetime = 60;
                drawGame();
                return;
            }

            if (apc.garrisonedUnits && apc.garrisonedUnits.length > 0) {
                let ejectedCount = 0;
                let angleOffset = 0;
                const totalUnits = apc.garrisonedUnits.length;
                
                apc.garrisonedUnits.forEach(unitData => {
                    const angle = angleOffset + (Math.random() * Math.PI / 4); // Eject in a small arc
                    let ejectX = apc.x + Math.cos(angle) * APC_EJECT_DISTANCE;
                    let ejectY = apc.y + Math.sin(angle) * APC_EJECT_DISTANCE;
                    
                    // FIX: Clamp Ejection Coordinates (Guards against boundary issues)
                    ejectX = Math.max(0, Math.min(GAME_WORLD_SIZE, ejectX));
                    ejectY = Math.max(0, Math.min(GAME_WORLD_SIZE, ejectY));
                    
                    // Restore properties that might have been changed/lost on garrisoning (like IDs, currentCooldowns, etc.)
                    const ejectedUnit = {
                        ...unitData,
                        id: entityIdCounter++, // Assign a new ID to avoid collisions with old ones
                        x: ejectX,
                        y: ejectY,
                        targetX: ejectX + (Math.cos(angle) * 1), // Set target slightly away to force a movement and clear target
                        targetY: ejectY + (Math.sin(angle) * 1),
                        rotation: 0,
                        currentCooldown: 0,
                        ejectionLockoutTimer: EJECTION_LOCKOUT_DURATION, // NEW: Lockout timer
                        // Ensure all required properties are present (width/height now come from ...unitData)
                        width: unitData.width,
                        height: unitData.height,
                        hp: unitData.hp,
                        maxHp: unitData.maxHp,
                        damage: unitData.damage,
                        attackRange: unitData.attackRange,
                        attackCooldown: unitData.attackCooldown,
                        speed: unitData.speed,
                        team: unitData.team,
                        type: unitData.type,
                        symbolId: unitData.symbolId
                    };
                    
                    gameEntities.push(ejectedUnit);
                    ejectedCount++;
                    angleOffset += (Math.PI * 2) / totalUnits;
                });

                apc.garrisonedUnits = [];
                attackMessage = `${ejectedCount} units ejected from APC.`;
                attackMessageLifetime = 60;
                selectedEntity = apc; // Keep APC selected
                drawGame();
            } else {
                attackMessage = `APC is empty.`;
                attackMessageLifetime = 60;
                drawGame();
            }
        }


        // --- Rendering Functions (Modified) ---
        function drawMapTerrain() {
            // ... (drawMapTerrain logic - unchanged) ...
            if (!currentMapData || MAP_DATA_SIZE === 0) {
                ctx.fillStyle = '#0f172a'; 
                ctx.fillRect(0, 0, canvas.width, canvas.height); 
                ctx.fillStyle = '#e2e8f0'; 
                ctx.font = '24px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('No map loaded. Please load a .map file.', viewPortWidth / 2, viewPortHeight / 2);
                return;
            }

            const cellSize = GAME_WORLD_SIZE / MAP_DATA_SIZE; 
            for (let y = 0; y < MAP_DATA_SIZE; y++) {
                for (let x = 0; x < MAP_DATA_SIZE; x++) {
                    const elevation = currentMapData[y][x];
                    ctx.fillStyle = getColor(elevation);
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize + 0.5, cellSize + 0.5);
                }
            }
        }

        function drawEntities() {
            // NEW: Sort entities: Chopper highest, then Trees, then Buildings, then Units/Vehicles by Y-position, then Terrain
            const sortedEntities = [...gameEntities].sort((a, b) => {
                const aType = a.type;
                const bType = b.type;
                
                // 1. Chopper always on top
                if (a.symbolId === 'helicopter' && b.symbolId !== 'helicopter') return 1;
                if (a.symbolId !== 'helicopter' && b.symbolId === 'helicopter') return -1;
                
                // 2. Trees always overlay everything else (except chopper)
                const aIsTree = aType === 'terrain' && (a.symbolId.includes('tree') || a.symbolId.includes('bush'));
                const bIsTree = bType === 'terrain' && (b.symbolId.includes('tree') || b.symbolId.includes('bush'));
                
                if (aIsTree && !bIsTree) return 1;    
                if (!aIsTree && bIsTree) return -1;   
                
                // 3. Terrain items (excluding trees/bushes) go first (lowest layer)
                if (aType === 'terrain' && aIsTree === false && bType !== 'terrain') return -1;
                if (aType !== 'terrain' && bType === 'terrain' && bIsTree === false) return 1;
                
                // 4. Force Buildings (which includes walls) to draw after Units (people/vehicles) unless they are the same type.
                if (aType === 'building' && bType === 'unit') return 1;
                if (aType === 'unit' && bType === 'building') return -1;
                
                // 5. For the rest (same types, or already prioritized types), use Y-coordinate for depth
                return a.y - b.y; 
            });     


            sortedEntities.forEach(entity => {
                const renderX = entity.x - entity.width / 2;
                const renderY = entity.y - entity.height / 2;

                const svgImage = getCachedSvgImage(entity.symbolId);
                
                ctx.save(); 

                ctx.translate(entity.x, entity.y);

                // Buildings and Terrain can also have rotation
                if (entity.rotation !== undefined && entity.rotation !== 0) {
                    ctx.rotate(entity.rotation);
                }

                if (svgImage && svgImage.complete) {
                    ctx.drawImage(svgImage, -entity.width / 2, -entity.height / 2, entity.width, entity.height);
                } else {
                    // Fallback to circle/rectangle (Copied from previous full game.js)
                    ctx.fillStyle = entity.color || '#999999';
                    if (entity.type === 'unit') {
                        ctx.beginPath();
                        ctx.arc(0, 0, entity.width / 2, 0, Math.PI * 2); 
                        ctx.fill();
                        ctx.strokeStyle = '#000'; 
                        ctx.lineWidth = 1 / zoomLevel; 
                        ctx.stroke();
                    } else { 
                        ctx.fillRect(-entity.width / 2, -entity.height / 2, entity.width, entity.height); 
                        ctx.strokeStyle = '#000'; 
                        ctx.lineWidth = 2 / zoomLevel; 
                        ctx.strokeRect(-entity.width / 2, -entity.height / 2, entity.width, entity.height);
                    }
                }
                
                // Draw selection highlight if selected (after entity's rotation)
                if (selectedEntity && selectedEntity.id === entity.id) {
                    ctx.strokeStyle = 'cyan';
                    ctx.lineWidth = 3 / zoomLevel; 
                    ctx.strokeRect(-entity.width / 2 - (5 / zoomLevel), -entity.height / 2 - (5 / zoomLevel), entity.width + (10 / zoomLevel), entity.height + (10 / zoomLevel));
                }
                
                // Draw Health Bar (only if enabled)
                if (showHealthBars && entity.maxHp > 0) {
                    const healthBarWidth = entity.width * 1.5; 
                    const healthBarHeight = 3;
                    const healthPercentage = entity.hp / entity.maxHp;
                    let barY = entity.height / 2 + 5; 
                    
                    // Restore rotation/translation before drawing health bar to ensure it's world-aligned
                    ctx.restore(); 
                    ctx.save();
                    ctx.translate(entity.x, entity.y);

                    // Draw background bar
                    ctx.fillStyle = '#333333';
                    ctx.fillRect(-healthBarWidth / 2, barY, healthBarWidth, healthBarHeight);

                    // Draw health bar
                    ctx.fillStyle = healthPercentage > 0.5 ? '#10b981' : (healthPercentage > 0.25 ? '#f59e0b' : '#ef4444');
                    ctx.fillRect(-healthBarWidth / 2, barY, healthBarWidth * healthPercentage, healthBarHeight);

                    let nextBarY = barY + healthBarHeight + 3;
                    
                    // NEW: Draw Power Bar (only for Power Plant)
                    if (entity.symbolId === 'power_plant' && entity.maxPower > 0) {
                        const powerBarWidth = entity.width * 1.5;
                        const powerBarHeight = 3;
                        const powerPercentage = entity.currentPower / entity.maxPower;
                        const powerBarY = nextBarY;
                        nextBarY += powerBarHeight + 3; // Advance nextBarY

                        // Draw background bar
                        ctx.fillStyle = '#333333';
                        ctx.fillRect(-powerBarWidth / 2, powerBarY, powerBarWidth, powerBarHeight);

                        // Draw power bar (yellow/orange/red)
                        ctx.fillStyle = powerPercentage > 0.5 ? '#ffff00' : (powerPercentage > 0.25 ? '#ff8c00' : '#ff4500');
                        ctx.fillRect(-powerBarWidth / 2, powerBarY, powerBarWidth * powerPercentage, powerBarHeight);

                        // Draw Label
                        const fontSize = 8 / zoomLevel;
                        ctx.font = `${fontSize}px Inter, sans-serif`;
                        ctx.fillStyle = 'white';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        ctx.fillText('POWER', 0, powerBarY - fontSize - 2);
                    }

                    // NEW: Draw Fuel Bar (only for vehicles and engineer)
                    if (entity.maxFuel > 0 && entity.symbolId !== 'refinery') { // Refinery maxFuel is for raw material, draws below
                        const fuelBarWidth = entity.width * 1.5; 
                        const fuelBarHeight = 3;
                        const fuelPercentage = entity.currentFuel / entity.maxFuel;
                        const fuelBarY = nextBarY; 
                        nextBarY += fuelBarHeight + 3;
                        
                        // Draw background bar
                        ctx.fillStyle = '#333333';
                        ctx.fillRect(-fuelBarWidth / 2, fuelBarY, fuelBarWidth, fuelBarHeight);

                        // Draw fuel bar
                        ctx.fillStyle = fuelPercentage > 0.2 ? '#1e90ff' : '#ff7f50'; // Blue/Orange
                        ctx.fillRect(-fuelBarWidth / 2, fuelBarY, fuelBarWidth * fuelPercentage, fuelBarHeight);
                        
                        // Draw Label
                        const fontSize = 8 / zoomLevel;
                        ctx.font = `${fontSize}px Inter, sans-serif`;
                        ctx.fillStyle = 'white';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        ctx.fillText('FUEL', 0, fuelBarY - fontSize - 2);
                    }
                    
                    // NEW: Draw Raw Material Bar (for Bar, Chef, Refinery, and Cleaner)
                    const isRawMaterialEntity = entity.maxRawMaterial > 0 || entity.symbolId === 'refinery';
                    if (isRawMaterialEntity) {
                        const maxMaterial = entity.maxRawMaterial || entity.maxFuel;
                        const currentMaterial = entity.currentRawMaterial || entity.currentFuel;
                        let barLabel = entity.symbolId === 'refinery' ? 'FUEL SUPPLY' : 'RAW';
                        if (entity.symbolId === 'cleaner') barLabel = 'RAW (Trash)'; // Update label

                        if (maxMaterial > 0) {
                            const rawBarWidth = entity.width * 1.5;
                            const rawBarHeight = 3;
                            const rawPercentage = currentMaterial / maxMaterial;
                            const rawBarY = nextBarY;
                            nextBarY += rawBarHeight + 3; // Advance nextBarY
                            
                            // Draw background bar
                            ctx.fillStyle = '#333333';
                            ctx.fillRect(-rawBarWidth / 2, rawBarY, rawBarWidth, rawBarHeight);

                            // Draw raw material bar
                            ctx.fillStyle = rawPercentage > 0.5 ? '#b8860b' : (rawPercentage > 0.25 ? '#daa520' : '#ffd700'); // Gold colors
                            ctx.fillRect(-rawBarWidth / 2, rawBarY, rawBarWidth * rawPercentage, rawBarHeight);

                            // Draw Label
                            const fontSize = 8 / zoomLevel;
                            ctx.font = `${fontSize}px Inter, sans-serif`;
                            ctx.fillStyle = 'white';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText(barLabel, 0, rawBarY - fontSize - 2);
                        }
                    }
                    
                    // NEW: Draw Trash Bar (for buildings)
                    if (entity.type === 'building' && entity.maxTrash > 0) {
                        const trashBarWidth = entity.width * 1.5;
                        const trashBarHeight = 3;
                        const trashPercentage = entity.currentTrash / entity.maxTrash;
                        const trashBarY = nextBarY;
                        
                        // Draw background bar
                        ctx.fillStyle = '#333333';
                        ctx.fillRect(-trashBarWidth / 2, trashBarY, trashBarWidth, trashBarHeight);

                        // Draw trash bar (Darker color for trash)
                        ctx.fillStyle = trashPercentage < 0.25 ? '#4b4b4b' : (trashPercentage < 0.75 ? '#694f33' : '#8b4513'); // Gray/Brown
                        ctx.fillRect(-trashBarWidth / 2, trashBarY, trashBarWidth * trashPercentage, trashBarHeight);

                        // Draw Label
                        const fontSize = 8 / zoomLevel;
                        ctx.font = `${fontSize}px Inter, sans-serif`;
                        ctx.fillStyle = 'white';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        ctx.fillText('TRASH', 0, trashBarY - fontSize - 2);
                    }


                    ctx.restore(); // Restore again
                    ctx.save();
                    ctx.translate(entity.x, entity.y);
                    // Re-apply rotation for unit/building if needed
                    if (entity.rotation !== undefined && entity.rotation !== 0) {
                        ctx.rotate(entity.rotation);
                    }
                }

                ctx.restore(); 

                // Draw unit target marker and line (Movement Line) (Copied from previous full game.js)
                if (showTargetLines && entity.type === 'unit' && entity.targetX !== undefined && entity.targetY !== undefined) {
                    ctx.strokeStyle = '#cccccc'; 
                    ctx.lineWidth = 2 / zoomLevel; 
                    ctx.beginPath();
                    ctx.arc(entity.targetX, entity.targetY, 8 / zoomLevel, 0, Math.PI * 2); 
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(entity.x, entity.y);
                    ctx.lineTo(entity.targetX, entity.targetY); 
                    ctx.stroke();
                }
                
                // Draw Civilian Coin Counter AND Health Bar (Copied from previous full game.js)
                if (entity.isCivilian && entity.civilianCoins !== undefined && entity.civilianHealth !== undefined) {
                    ctx.save();
                    ctx.translate(entity.x, entity.y); 

                    const civilianHealthBarWidth = entity.width * 1.5; 
                    const civilianHealthBarHeight = 3;
                    const civilianHealthPercentage = entity.civilianHealth / CIVILIAN_START_HEALTH;
                    const civilianBarY = -entity.height / 2 - 20; 
                    
                    // Draw background bar
                    ctx.fillStyle = '#333333';
                    ctx.fillRect(-civilianHealthBarWidth / 2, civilianBarY, civilianHealthBarWidth, civilianHealthBarHeight);

                    // Draw health bar
                    ctx.fillStyle = civilianHealthPercentage > 0.5 ? '#10b981' : (civilianHealthPercentage > 0.3 ? '#f59e0b' : '#ef4444');
                    ctx.fillRect(-civilianHealthBarWidth / 2, civilianBarY, civilianHealthBarWidth * civilianHealthPercentage, civilianHealthBarHeight);
                    
                    const coinText = entity.civilianCoins.toFixed(0); 
                    const fontSize = 10 / zoomLevel;
                    ctx.font = `${fontSize}px Inter, sans-serif`;
                    ctx.fillStyle = entity.civilianCoins > 0 ? '#ffcc00' : '#ff4444';
                    ctx.textAlign = 'center';
                    
                    const coinTextY = civilianBarY + civilianHealthBarHeight + (fontSize / 2) + 2; 

                    ctx.fillText('$' + coinText, 0, coinTextY);
                    
                    ctx.restore();
                }
            });
            
            // NEW: Draw In-World APC Eject Button and Counter
            ejectButtonRect = null; // Reset for the current frame
            if (selectedEntity && selectedEntity.symbolId === 'apc' && selectedEntity.garrisonedUnits?.length > 0) {
                ctx.save();
                
                const apc = selectedEntity;
                const buttonWidth = 60 / zoomLevel;
                const buttonHeight = 15 / zoomLevel;
                const offsetFromCenter = apc.height / 2 + 10 / zoomLevel; 
                
                // Button world position
                const buttonWorldX = apc.x;
                const buttonWorldY = apc.y - offsetFromCenter; 
                
                // Store screen coordinates for click detection
                const buttonScreenX = (apc.x - buttonWidth / 2 - viewportX) * zoomLevel;
                const buttonScreenY = (apc.y - offsetFromCenter - buttonHeight / 2 - viewportY) * zoomLevel;
                
                ejectButtonRect = {
                    screenX: buttonScreenX,
                    screenY: buttonScreenY,
                    width: buttonWidth * zoomLevel,
                    height: buttonHeight * zoomLevel
                };

                ctx.translate(buttonWorldX, buttonWorldY);
                
                // Draw Button Background
                ctx.fillStyle = '#dc2626'; // Red
                ctx.fillRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
                ctx.strokeStyle = '#f87171';
                ctx.lineWidth = 1 / zoomLevel;
                ctx.strokeRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);

                // Draw Button Text
                const fontSize = 8 / zoomLevel;
                ctx.font = `${fontSize}px Inter, sans-serif`;
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('EJECT', 0, 0);

                // Draw People Counter
                const counterText = `${apc.garrisonedUnits.length}/${apc.capacity}`;
                const counterX = buttonWidth / 2 + 15 / zoomLevel;
                const counterFontSize = 10 / zoomLevel;
                ctx.font = `${counterFontSize}px Inter, sans-serif`;
                ctx.fillStyle = '#ffcc00';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(counterText, counterX, 0);
                
                ctx.restore();
            }
        }

        // Draw Combat Effects (Shots) (Copied from previous full game.js)
        function drawCombatEffects() {
            combatEffects.forEach(effect => {
                ctx.strokeStyle = '#ffff00'; 
                ctx.lineWidth = 1.5 / zoomLevel; 
                ctx.beginPath();
                ctx.moveTo(effect.startX, effect.startY);
                ctx.lineTo(effect.endX, effect.endY);
                ctx.stroke();

                ctx.fillStyle = '#ffff00'; 
                ctx.beginPath();
                ctx.arc(effect.endX, effect.endY, 2 / zoomLevel, 0, Math.PI * 2);
                ctx.fill();

                effect.lifetime -= 1; 
            });
            combatEffects = combatEffects.filter(e => e.lifetime > 0);
        }

        // Draw Destruction Effects (Scatter) (Copied from previous full game.js)
        function drawDestructionEffects() {
            destructionEffects.forEach(effect => {
                effect.particles.forEach(p => {
                    ctx.fillStyle = effect.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            });
            destructionEffects = destructionEffects.filter(e => e.lifetime > 0);
        }

        // Draw Attack Message on top of the canvas viewport (Modified to appear at top)
        function drawAttackMessage() {
            if (attackMessage) {
                ctx.save();
                const alpha = Math.min(1.0, attackMessageLifetime / 60); 
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; 
                ctx.font = '36px "Chakra Petch", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Position message at 10% from the top
                const messageY = viewPortHeight * 0.1;
                ctx.fillText(attackMessage, viewPortWidth / 2, messageY); 
                ctx.restore();
            }
        }


        // Consolidated draw function for a full frame update
        function drawGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 

            ctx.save(); 

            ctx.translate(-viewportX * zoomLevel, -viewportY * zoomLevel);
            ctx.scale(zoomLevel, zoomLevel);

            drawMapTerrain();
            drawEntities();
            drawCombatEffects(); 
            drawDestructionEffects(); 

            ctx.restore(); 
            
            drawAttackMessage();
        }

        // --- Game Loop ---
        let lastTime = 0;
        const GAME_FPS = 60; // Target frames per second
        const FRAME_DURATION = 1000 / GAME_FPS; // Milliseconds per frame
        
        // NEW: Helper function for animal movement (random target on traversable land) (Copied from previous full game.js)
        function findRandomTraversableCoord(centerX, centerY, maxDistance) {
            const attempts = 10;
            for (let i = 0; i < attempts; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * maxDistance;
                
                let targetX = centerX + Math.cos(angle) * distance;
                let targetY = centerY + Math.sin(angle) * distance;
                
                // Clamp to map boundaries
                targetX = Math.max(0, Math.min(GAME_WORLD_SIZE, targetX));
                targetY = Math.max(0, Math.min(GAME_WORLD_SIZE, targetY));

                const terrainType = getTerrainTypeAtGameCoord(targetX, targetY);
                if (isTraversableForUnits(terrainType)) {
                    return { x: targetX, y: targetY };
                }
            }
            return { x: centerX + (Math.random() - 0.5) * 10, y: centerY + (Math.random() - 0.5) * 10 };
        }

        // NEW: Helper function to handle unit movement commands (used by right-click and left-click move mode)
        function handleUnitMovement(entity, targetX, targetY) {
            if (entity.ejectionLockoutTimer !== undefined && entity.ejectionLockoutTimer > 0) {
                attackMessage = 'Unit is in ejection lockout and cannot move.';
                attackMessageLifetime = 60;
                return false;
            }

            const terrainType = getTerrainTypeAtGameCoord(targetX, targetY); 
            
            // NEW: Allow APCs to move over water.
            const isAPC = entity.symbolId === 'apc';
            const canTraverseWater = isAPC && (terrainType === 'deep_water' || terrainType === 'shallow_water');

            if (entity.symbolId === 'helicopter' || isTraversableForUnits(terrainType) || canTraverseWater) {
                
                // Engineer Logic: Target a nearby vehicle for fueling if clicked near one
                if (entity.isEngineer) {
                    let nearestVehicle = null;
                    let minDistanceSq = Infinity;
                    
                    gameEntities.forEach(e => {
                        if (e.maxFuel > 0 && e.fuelConsumptionRate > 0 && e.id !== entity.id) {
                            const distSq = (e.x - targetX)**2 + (e.y - targetY)**2;
                            if (distSq < minDistanceSq) {
                                minDistanceSq = distSq;
                                nearestVehicle = e;
                            }
                        }
                    });
                    
                    // Check if the click was near a vehicle (within 2x FUEL_RANGE)
                    if (nearestVehicle && Math.sqrt(minDistanceSq) < FUEL_RANGE * 2) { 
                        entity.targetX = nearestVehicle.x;
                        entity.targetY = nearestVehicle.y;
                        entity.targetEntityId = nearestVehicle.id; // Set target to the vehicle ID
                        
                        attackMessage = `Engineer targeting ${nearestVehicle.symbolId} for fueling.`;
                        attackMessageLifetime = 60;
                    } else {
                        // Normal move
                        entity.targetX = targetX; 
                        entity.targetY = targetY; 
                        entity.targetEntityId = null; // Clear any previous target vehicle
                    }
                } else {
                    // Normal unit move
                    entity.targetX = targetX; 
                    entity.targetY = targetY; 
                    entity.targetEntityId = null; 
                }
                
                // Stop civilian AI temporarily if manually ordered to move
                if (entity.isCivilian) {
                    entity.routeIndex = -1; 
                    entity.waitTimer = 0; 
                    entity.targetEntityId = entity.isEngineer ? entity.targetEntityId : null; // Keep engineer target if it was set
                    entity.assignedWorkBuildingId = null; 
                    entity.avoidingCollision = false; 
                }
                return true; // Move successful
            } else {
                attackMessage = 'Cannot move unit to non-traversable terrain!';
                attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                return false; // Move failed
            }
        }


        function gameLoop(currentTime) {
            if (!lastTime) lastTime = currentTime; 
            const deltaTime = currentTime - lastTime;

            if (deltaTime >= FRAME_DURATION) {
                update(deltaTime / 1000); 
                drawGame(); 
                lastTime = currentTime - (deltaTime % FRAME_DURATION);
            }
            requestAnimationFrame(gameLoop); 
        }
        
        function isEnemy(entity) {
            return entity.team === 'enemy';
        }

        // NEW: Check if two entities should collide with each other
        function shouldCollide(entity1, entity2) {
            
            if (entity1.symbolId === 'helicopter' || entity2.symbolId === 'helicopter') {
                return false;
            }
            
            if ((entity1.type === 'terrain' && (entity1.symbolId.includes('tree') || entity1.symbolId.includes('flower') || entity1.symbolId.includes('bush'))) ||
                (entity2.type === 'terrain' && (entity2.symbolId.includes('tree') || entity2.symbolId.includes('flower') || entity2.symbolId.includes('bush')))) {
                return false;
            }
            
            if (entity1.type === 'terrain' && entity1.symbolId.includes('rock') && 
                entity2.type === 'terrain' && entity2.symbolId.includes('rock')) {
                return false;
            }
            
            if (entity1.type === 'building' && entity1.symbolId.includes('wall') && 
                entity2.type === 'building' && entity2.symbolId.includes('wall')) {
                return false;
            }
            
            if (entity1.team === 'neutral_animal' && entity2.team === 'neutral_animal') {
                return false;
            }
            
            // NEW: APC does not collide with friendly military units
            const isFriendlyMilitary = (e) => e.team === 'friendly_military' && e.type === 'unit';
            if ((entity1.symbolId === 'apc' && isFriendlyMilitary(entity2)) || 
                (entity2.symbolId === 'apc' && isFriendlyMilitary(entity1))) {
                return false;
            }
            
            return true;
        }
        
        function getBuildingBySymbolId(symbolId) {
            return gameEntities.find(e => e.type === 'building' && e.symbolId === symbolId && e.hp > 0);
        }

        // NEW: Get all work buildings of a specific type that are not at capacity (Copied from previous full game.js)
        function getAvailableWorkBuildings(buildingId, civilianSymbolId) {
            const allBuildings = gameEntities.filter(e => 
                e.type === 'building' && e.symbolId === buildingId && e.hp > 0
            );

            const assignmentTally = {};
            gameEntities.forEach(e => {
                if (e.isCivilian && e.assignedWorkBuildingId) {
                    assignmentTally[e.assignedWorkBuildingId] = (assignmentTally[e.assignedWorkBuildingId] || 0) + 1;
                }
            });

            const availableBuildings = allBuildings.filter(building => {
                const count = assignmentTally[building.id] || 0;
                
                // Special case: Chef's "work" building is Refinery, but the logic is handled separately (transport)
                // For simplicity, we assume all work buildings use OFFICE_CAPACITY max.
                // Civilian's office (symbolId: 'civilian', buildingId: 'office') is the main one to check.
                if (buildingId === 'office' && civilianSymbolId === 'civilian') {
                    return count < OFFICE_CAPACITY;
                }
                
                // For all other "work" buildings, we allow max capacity, 
                // but the civilian logic below will only assign one civilian per "work" building type, 
                // as that building type is generally a resource/core building.
                // The `getAvailableWorkBuildings` function is mainly used to find the *nearest* valid work building.
                return true; 
            });
            
            return availableBuildings;
        }


        function update(dt) {
            
            if (attackMessageLifetime > 0) {
                attackMessageLifetime -= dt * 60; 
                if (attackMessageLifetime <= 0) {
                    attackMessage = null;
                    attackMessageLifetime = 0;
                }
            }
            
            // Start of the Inflation Economic Logic
            let totalCivilians = 0;
            const professionCounts = {};
            const allCivilianLogic = Object.keys(BASE_CIVILIAN_BUILDING_LOGIC);
            
            allCivilianLogic.forEach(prof => professionCounts[prof] = 0);

            gameEntities.forEach(entity => {
                if (entity.isCivilian) {
                    totalCivilians++;
                    professionCounts[entity.symbolId] = (professionCounts[entity.symbolId] || 0) + 1;
                }
            });
            
            // NEW: Check if no civilians exist to skip economic pressure and reset inflation
            if (totalCivilians === 0) {
                if (currentInflation !== 0) {
                    currentInflation = 0;
                    if (inflationDisplay) {
                        inflationDisplay.textContent = currentInflation.toFixed(1) + '%';
                    }
                }
                // Ensure economic logic reverts to base if no people are around to drive prices/salaries
                currentEconomicLogic = JSON.parse(JSON.stringify(BASE_CIVILIAN_BUILDING_LOGIC));
                salaryInterestDelayTimer = 0; // Reset delay timer too, since no one is working
            } else {
                // 1. Price Adjustment (Immediate Effect - Pop, Interest, Inflation)
                let aggregateBasePrice = 0;
                let aggregateAdjustedPrice = 0;
                
                const civilianPopDiff = totalCivilians - BASE_POPULATION;
                // Prices rise if total population > BASE_POPULATION
                const populationPriceAdjust = civilianPopDiff * POPULATION_PRICE_FACTOR;
                // Prices rise immediately with interest rate
                const interestPriceAdjust = interestRate * INTEREST_PRICE_FACTOR;

                for (const profession in currentEconomicLogic) {
                    const baseLogic = BASE_CIVILIAN_BUILDING_LOGIC[profession];
                    const currentLogic = currentEconomicLogic[profession];

                    if (currentLogic.spend) {
                        currentLogic.spend.forEach((currentSpendItem, index) => {
                            const baseCost = baseLogic.spend[index].cost;
                            
                            // Price adjusts immediately to population, interest, AND current inflation
                            let newCost = baseCost + populationPriceAdjust + interestPriceAdjust + (baseCost * currentInflation / 100);
                            
                            // Ensure cost doesn't drop too low (min 5)
                            newCost = Math.max(5, Math.round(newCost));
                            
                            currentSpendItem.cost = newCost;
                            
                            aggregateBasePrice += baseCost;
                            aggregateAdjustedPrice += newCost;
                        });
                    }
                }
                
                // 2. Inflation Calculation (Based on price change over time)
                const currentAggregatePriceIndex = aggregateAdjustedPrice; 
                const baseAggregatePriceIndex = aggregateBasePrice; 
                
                // Simple inflation formula: % change in aggregate price index from baseline
                const newInflation = ((currentAggregatePriceIndex - baseAggregatePriceIndex) / baseAggregatePriceIndex) * 100;
                currentInflation = newInflation;
                if (inflationDisplay) {
                    inflationDisplay.textContent = currentInflation.toFixed(1) + '%';
                }


                // 3. Salary Adjustment (Delayed Effect - Profession Pop, Delayed Interest, Inflation)
                salaryInterestDelayTimer = Math.min(SALARY_INTEREST_RATE_DELAY, salaryInterestDelayTimer + dt);
                const interestEffectActive = salaryInterestDelayTimer >= SALARY_INTEREST_RATE_DELAY;
                
                // Salaries change with interest rate after delay
                const delayedInterestSalaryAdjust = interestEffectActive ? interestRate * INTEREST_SALARY_FACTOR : 0; 
                
                for (const profession in currentEconomicLogic) {
                    const baseLogic = BASE_CIVILIAN_BUILDING_LOGIC[profession];
                    const currentLogic = currentEconomicLogic[profession];
                    const professionCount = professionCounts[profession] || 0;

                    if (currentLogic.work) {
                        const baseSalary = baseLogic.work.salary;
                        
                        // Compare profession count to a proportional base, leading to profession-specific salary pressure.
                        const professionPopDiff = professionCount - (BASE_POPULATION / allCivilianLogic.length); 
                        // Salaries decrease if specific profession count is high
                        const professionSalaryAdjust = -professionPopDiff * PROFESSION_SALARY_FACTOR; 
                        
                        // Salary adjusts to delayed interest, inverse profession population, and inflation (to counter price rises)
                        let newSalary = baseSalary + professionSalaryAdjust + delayedInterestSalaryAdjust + (baseSalary * currentInflation / 100 * INFLATION_SALARY_FACTOR);
                        
                        // Ensure salary doesn't drop too low (min 50)
                        newSalary = Math.max(50, Math.round(newSalary));

                        currentLogic.work.salary = newSalary;
                    }
                }
            }            
            // End of the Inflation Economic Logic
            
            // NEW: Theft Timer Update and Logic
            theftTimer += dt;
            if (theftTimer >= THEFT_INTERVAL) {
                theftTimer = 0; // Reset the timer regardless of theft outcome
                
                const hasPolice = gameEntities.some(e => e.symbolId === 'police_officer' && e.hp > 0);
                
                if (!hasPolice && playerCoins > 0) {
                    const stolenAmount = Math.min(THEFT_AMOUNT, playerCoins);
                    playerCoins -= stolenAmount;
                    updateCoinDisplay();
                    
                    attackMessage = `Unattended Coins Stolen! (-${stolenAmount} Coins)`;
                    attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                }
            }
            
            // NEW: Update civilian panic mode (Copied from previous full game.js)
            const enemiesExist = gameEntities.some(e => e.team === 'enemy' && e.hp > 0);
            if (enemiesExist && !civilianPanicMode) {
                civilianPanicMode = true;
                if (!bunkerBuilding) {
                    bunkerBuilding = getBuildingBySymbolId('bunker');
                }
            } else if (!enemiesExist && civilianPanicMode) {
                civilianPanicMode = false;
            }

            // 1. Remove dead entities and create destruction effects
            const entitiesAlive = [];
            for (const entity of gameEntities) {
                if (entity.type === 'terrain' || entity.hp > 0) {
                    entitiesAlive.push(entity);
                } else {
                    if (entity.maxHp > 0) { 
                        createDestructionEffect(entity);
                    }
                    if (entity.type === 'building' && entity.hp <= 0) {
                        gameEntities.forEach(civilian => {
                            if (civilian.isCivilian && civilian.assignedWorkBuildingId === entity.id) {
                                civilian.assignedWorkBuildingId = null;
                                civilian.routeIndex = -1; 
                            }
                        });
                    }
                }
            }
            gameEntities = entitiesAlive;
            
            // 1.5. NEW: Building Decay/Power Decay
            gameEntities.forEach(entity => {
                if (entity.type === 'building' && entity.hp > 0 && entity.maxHp > 0) {
                    entity.hp = Math.max(0, entity.hp - BUILDING_DECAY_RATE * dt);
                }
                
                // NEW: Power Plant Decay
                if (entity.symbolId === 'power_plant' && entity.hp > 0) {
                    entity.currentPower = Math.max(0, entity.currentPower - POWER_PLANT_DECAY_RATE * dt);
                }
            });


            // 2. Combat, Civilian AI, and Movement Logic
            gameEntities.forEach(entity => {
                
                // Handle cooldowns
                if (entity.currentCooldown > 0) {
                    entity.currentCooldown -= dt;
                }
                if (entity.coinCooldown > 0) {
                    entity.coinCooldown -= dt;
                }
                
                // NEW: Handle Ejection Lockout Timer (Change 2)
                if (entity.ejectionLockoutTimer !== undefined && entity.ejectionLockoutTimer > 0) {
                    entity.ejectionLockoutTimer -= dt;
                }

                // NEW: Animal Roaming Logic (Copied from previous full game.js)
                if (entity.team === 'neutral_animal') { 
                    
                    if (entity.waitTimer === undefined) entity.waitTimer = 0; 
                    
                    if (entity.waitTimer > 0) {
                        entity.waitTimer -= dt;
                        entity.targetX = undefined; 
                        entity.targetY = undefined;
                        entity.rotation = 0;
                    }

                    const hasReachedTarget = entity.targetX !== undefined && entity.targetY !== undefined && 
                                            Math.abs(entity.x - entity.targetX) < 1 && Math.abs(entity.y - entity.targetY) < 1;

                    if (hasReachedTarget) {
                        entity.x = entity.targetX;
                        entity.y = entity.targetY;
                        entity.targetX = undefined; 
                        entity.targetY = undefined;
                        entity.rotation = 0;
                        entity.avoidingCollision = false; 

                        entity.waitTimer = Math.random() * ANIMAL_WAIT_DURATION; 
                    }

                    if (entity.targetX === undefined && entity.waitTimer <= 0) {
                        const newTarget = findRandomTraversableCoord(entity.x, entity.y, ANIMAL_ROAMING_DISTANCE);
                        entity.targetX = newTarget.x;
                        entity.targetY = newTarget.y;
                    }
                }
                
                // NEW: Engineer Logic
                if (entity.isEngineer) {
                    const refinery = getBuildingBySymbolId('refinery');
                    if (refinery) {
                        const distanceSq = (refinery.x - entity.x)**2 + (refinery.y - entity.y)**2;
                        if (Math.sqrt(distanceSq) < 50) { // Near enough to refinery
                            
                            // Engineer self-refueling, which draws from the Refinery's fuel supply (raw material)
                            const neededFuel = entity.maxFuel - entity.currentFuel;
                            const availableFuel = refinery.currentFuel;
                            // REFINERY_RECHARGE_RATE is used as the transfer rate limit
                            const transferAmount = Math.min(neededFuel, availableFuel, REFINERY_RECHARGE_RATE * dt);

                            if (transferAmount > 0) {
                                entity.currentFuel += transferAmount;
                                refinery.currentFuel -= transferAmount; // Refinery loses fuel here!
                            }
                        }
                    }
                    
                    // Engineer is moving to target a vehicle for fueling (targetEntityId is set via right-click)
                    if (entity.targetEntityId) {
                        const targetVehicle = gameEntities.find(e => e.id === entity.targetEntityId && e.maxFuel > 0);
                        if (targetVehicle) {
                            const distance = Math.sqrt((targetVehicle.x - entity.x)**2 + (targetVehicle.y - entity.y)**2);
                            
                            if (distance < FUEL_RANGE) {
                                // Arrived in range, stop moving, start fueling
                                entity.targetX = undefined;
                                entity.targetY = undefined;
                                entity.rotation = 0;
                                entity.waitTimer = 1; // Keep movement paused
                                
                                const canTransfer = Math.min(FUEL_TRANSFER_RATE * dt, entity.currentFuel);
                                const neededFuel = targetVehicle.maxFuel - targetVehicle.currentFuel;
                                
                                const transferAmount = Math.min(canTransfer, neededFuel);
                                
                                if (transferAmount > 0) {
                                    entity.currentFuel -= transferAmount;
                                    targetVehicle.currentFuel += transferAmount;
                                }
                                
                                if (targetVehicle.currentFuel >= targetVehicle.maxFuel || entity.currentFuel <= 0) {
                                    entity.targetEntityId = null; // Done fueling or out of fuel
                                    entity.waitTimer = 0; // Resume movement
                                    attackMessage = targetVehicle.currentFuel >= targetVehicle.maxFuel 
                                                    ? `${targetVehicle.symbolId} fully fueled.` 
                                                    : `Engineer out of fuel.`;
                                    attackMessageLifetime = 60;
                                }
                                return; // Skip normal movement for this frame
                            }
                        } else {
                            entity.targetEntityId = null; // Target is gone
                        }
                    }
                }
                
                // NEW: Medic Healing Logic
                if (entity.isMedic) {
                    // Find nearest wounded friendly military unit
                    const woundedUnits = gameEntities.filter(e => 
                        e.team === 'friendly_military' && e.type === 'unit' && !e.isEngineer && !e.isMedic && e.hp > 0 && e.hp < e.maxHp
                    );

                    let nearestWounded = null;
                    let minDistanceSq = Infinity;

                    woundedUnits.forEach(target => {
                        const dx = target.x - entity.x;
                        const dy = target.y - entity.y;
                        const distanceSq = dx * dx + dy * dy;

                        if (distanceSq < minDistanceSq) {
                            minDistanceSq = distanceSq;
                            nearestWounded = target;
                        }
                    });

                    if (nearestWounded) {
                        const distance = Math.sqrt(minDistanceSq);
                        
                        if (distance <= MEDIC_HEAL_RANGE) {
                            // In range: Stop movement and heal
                            entity.targetX = undefined;
                            entity.targetY = undefined;
                            entity.rotation = 0;
                            nearestWounded.hp = Math.min(nearestWounded.maxHp, nearestWounded.hp + MEDIC_HEAL_AMOUNT * dt);
                            
                            // Visual effect: Quick flash on cooldown (already handled by DOCTOR_HEAL_COOLDOWN logic)
                            if (entity.currentCooldown <= 0) {
                                combatEffects.push({
                                    startX: entity.x,
                                    startY: entity.y,
                                    endX: nearestWounded.x,
                                    endY: nearestWounded.y,
                                    color: 'green', 
                                    lifetime: 5 
                                });
                                entity.currentCooldown = DOCTOR_HEAL_COOLDOWN; 
                            }

                            if (nearestWounded.hp === nearestWounded.maxHp) {
                                attackMessage = `Medic healed ${nearestWounded.symbolId} to full health!`;
                                attackMessageLifetime = 60;
                            }
                            return; // Skip normal movement
                        } else {
                            // Out of range: Move towards target
                            entity.targetX = nearestWounded.x;
                            entity.targetY = nearestWounded.y;
                        }
                    }
                }


                // NEW: Doctor Healing AI Logic (Copied from previous full game.js)
                if (entity.symbolId === 'doctor' && entity.team === 'friendly_civilian') {
                    // ... (Doctor AI logic, as per previous full game.js) ...
                    // 1. Find nearest wounded friendly unit
                    const woundedFriendlyUnits = gameEntities.filter(e => 
                        e.team.startsWith('friendly') && e.type === 'unit' && e.hp > 0 && e.hp < e.maxHp
                    );

                    let nearestWounded = null;
                    let minDistanceSq = Infinity;

                    woundedFriendlyUnits.forEach(target => {
                        const dx = target.x - entity.x;
                        const dy = target.y - entity.y;
                        const distanceSq = dx * dx + dy * dy;

                        if (distanceSq < minDistanceSq) {
                            minDistanceSq = distanceSq;
                            nearestWounded = target;
                        }
                    });

                    if (nearestWounded) {
                        const distance = Math.sqrt(minDistanceSq);
                        
                        // Set target to wounded unit (override civilian AI target)
                        entity.targetEntityId = nearestWounded.id;
                        entity.routeIndex = -3; // Special flag for healing route
                        entity.waitTimer = 0; // Stop waiting

                        if (distance > DOCTOR_HEAL_RANGE) {
                            // Move towards target
                            entity.targetX = nearestWounded.x;
                            entity.targetY = nearestWounded.y;
                        } else {
                            // Arrived in range, stop movement, start healing
                            entity.targetX = undefined;
                            entity.targetY = undefined;
                            entity.rotation = 0;
                            
                            nearestWounded.hp = Math.min(nearestWounded.maxHp, nearestWounded.hp + DOCTOR_HEAL_AMOUNT * dt);
                            
                            if (entity.currentCooldown <= 0) {
                                combatEffects.push({
                                    startX: entity.x,
                                    startY: entity.y,
                                    endX: nearestWounded.x,
                                    endY: nearestWounded.y,
                                    color: 'green', 
                                    lifetime: 5 
                                });
                                entity.currentCooldown = DOCTOR_HEAL_COOLDOWN; 
                            }
                            
                            if (nearestWounded.hp === nearestWounded.maxHp) {
                                entity.targetEntityId = null;
                                entity.routeIndex = -1; // Resume normal route
                                attackMessage = `Doctor healed ${nearestWounded.symbolId} to full health!`;
                                attackMessageLifetime = 60;
                            }
                            return; 
                        }
                    } else if (entity.routeIndex === -3) {
                        entity.routeIndex = -1;
                        entity.targetEntityId = null;
                    }
                }

                // NEW: Civilian Panic Behavior (Copied from previous full game.js)
                if (entity.isCivilian && entity.routeIndex !== -3 && civilianPanicMode) { 
                    
                    const enemiesNearby = areEnemiesNearby(entity, 150); 
                    
                    if (enemiesNearby) {
                        const hospitalBuilding = getBuildingBySymbolId('hospital');
                        const isWounded = entity.civilianHealth < CIVILIAN_START_HEALTH;
                        let fleeTarget = null;

                        if (isWounded && hospitalBuilding) {
                            fleeTarget = hospitalBuilding;
                        } 
                        else if (bunkerBuilding) {
                            fleeTarget = bunkerBuilding;
                        }
                        
                        entity.targetX = undefined;
                        entity.targetY = undefined;
                        entity.waitTimer = 0;
                        
                        if (fleeTarget && (!entity.targetEntityId || entity.targetEntityId !== fleeTarget.id)) {
                            entity.targetX = fleeTarget.x;
                            entity.targetY = fleeTarget.y;
                            entity.targetEntityId = fleeTarget.id;
                            entity.waitTimer = 0; 
                            entity.routeIndex = -4; 
                        }
                    } else if (!enemiesNearby && entity.routeIndex === -4) {
                        entity.targetX = undefined;
                        entity.targetY = undefined;
                        entity.targetEntityId = null;
                        entity.routeIndex = -1; 
                    }
                    if (entity.routeIndex === -4) return; 
                }

                // New: Handle Civilian Wait Timer (Copied from previous full game.js)
                if (entity.waitTimer !== undefined && entity.waitTimer > 0 && entity.team !== 'neutral_animal') { 
                    entity.waitTimer -= dt;
                    entity.targetX = undefined; 
                    entity.targetY = undefined; 
                    entity.rotation = 0;
                }

                // CIVILIAN AI LOGIC (No route/AI if ejection locked)
                if (entity.isCivilian && entity.ejectionLockoutTimer <= 0 && entity.routeIndex !== -3 && (!civilianPanicMode || !areEnemiesNearby(entity, 150))) { 
                    
                    // ... (Civilian Health Logic - Hospital/Skyscraper/Barracks healing) ... 
                    const hospitalBuilding = getBuildingBySymbolId('hospital');
                    const skyscraperBuilding = getBuildingBySymbolId('skyscraper');
                    const barracksBuilding = getBuildingBySymbolId('barracks'); // NEW
                    
                    const isCriticallyInjured = entity.civilianHealth < CIVILIAN_CRITICAL_HEALTH;
                    const isAtHospital = entity.targetEntityId && hospitalBuilding && entity.targetEntityId === hospitalBuilding.id && 
                                          Math.abs(entity.x - hospitalBuilding.x) < 1 && Math.abs(entity.y - hospitalBuilding.y) < 1;
                    const isAtSkyscraper = entity.targetEntityId && skyscraperBuilding && entity.targetEntityId === skyscraperBuilding.id && 
                                            Math.abs(entity.x - skyscraperBuilding.x) < 1 && Math.abs(entity.y - skyscraperBuilding.y) < 1;
                    const isPilotAtBarracks = entity.symbolId === 'pilot' && entity.targetEntityId && barracksBuilding && entity.targetEntityId === barracksBuilding.id && 
                                               Math.abs(entity.x - barracksBuilding.x) < 1 && Math.abs(entity.y - barracksBuilding.y) < 1; // NEW
                    
                    if (isCriticallyInjured && hospitalBuilding && entity.targetEntityId !== hospitalBuilding.id) {
                        entity.targetX = hospitalBuilding.x;
                        entity.targetY = hospitalBuilding.y;
                        entity.targetEntityId = hospitalBuilding.id;
                        entity.waitTimer = 0; 
                        entity.routeIndex = -2; 
                    } 
                    
                    if (entity.civilianHealth < CIVILIAN_START_HEALTH) {
                        if (isAtHospital && entity.routeIndex === -2) { 
                            entity.waitTimer = 1; 
                            entity.civilianHealth = Math.min(CIVILIAN_START_HEALTH, entity.civilianHealth + CIVILIAN_HOSPITAL_HEAL_RATE * dt);
                            if (entity.civilianHealth === CIVILIAN_START_HEALTH) {
                                entity.waitTimer = 0; 
                                entity.routeIndex = -1; 
                                entity.targetEntityId = null; 
                                attackMessage = `${entity.symbolId} fully healed at Hospital!`;
                                attackMessageLifetime = 60;
                            }
                            return; 
                        } 
                        
                        const isSkyscraperInRoute = entity.route.includes('skyscraper');
                        const canRestAtSkyscraper = isAtSkyscraper && isSkyscraperInRoute;

                        // NEW: Pilot rest logic combined with Skyscraper logic
                        if (canRestAtSkyscraper || isPilotAtBarracks) {
                            entity.civilianHealth = Math.min(CIVILIAN_START_HEALTH, entity.civilianHealth + CIVILIAN_REST_HEAL_RATE * dt);
                            if (entity.civilianHealth < CIVILIAN_START_HEALTH) {
                                entity.waitTimer = Math.max(entity.waitTimer, 1); 
                                return; 
                            }
                        }
                    }
                    
                    // ... (Normal route logic - arrival and move-to-next-building) ... (Copied from previous full game.js)
                    const hasReachedTarget = entity.targetX !== undefined && entity.targetY !== undefined && 
                                            Math.abs(entity.x - entity.targetX) < 1 && Math.abs(entity.y - entity.targetY) < 1;
                    
                    if (hasReachedTarget) {
                        
                        const currentBuilding = gameEntities.find(e => e.id === entity.targetEntityId);
                        
                        // NEW: Trash Accumulation (for all civilians at all valid buildings)
                        if (currentBuilding && currentBuilding.type === 'building' && currentBuilding.maxTrash > 0) {
                             currentBuilding.currentTrash = Math.min(currentBuilding.maxTrash, currentBuilding.currentTrash + TRASH_ACCUMULATION_PER_VISIT);
                        }
                        
                        if (entity.avoidingCollision) {
                            entity.x = entity.targetX; 
                            entity.y = entity.targetY;
                            entity.targetX = undefined; 
                            entity.targetY = undefined;
                            entity.avoidingCollision = false; 
                            entity.rotation = 0;
                            
                        } else {
                            const currentBuildingSymbolId = entity.route[entity.routeIndex];
                            
                            // Use the mutable logic for transactions
                            const transactionLogic = currentEconomicLogic[entity.symbolId] || {};
                            
                            // NEW: Chef Transport & Salary Logic (Replaces standard work/salary)
                            if (entity.symbolId === 'chef') {
                                const barBuilding = getBuildingBySymbolId('bar');
                                const refineryBuilding = getBuildingBySymbolId('refinery');
                                const powerPlantBuilding = getBuildingBySymbolId('power_plant'); 
                                
                                if (currentBuildingSymbolId === 'bar' && barBuilding && Math.abs(barBuilding.x - entity.x) < 1) {
                                    // Chef arrived at Bar to load raw material
                                    const rawToLoad = Math.min(CHEF_MAX_RAW_MATERIAL - entity.currentRawMaterial, barBuilding.currentRawMaterial);
                                    if (rawToLoad > 0) {
                                        const transferAmount = Math.min(RAW_MATERIAL_LOAD_RATE * dt, rawToLoad);
                                        entity.currentRawMaterial += transferAmount;
                                        barBuilding.currentRawMaterial -= transferAmount;
                                        entity.waitTimer = Math.max(entity.waitTimer, 1); // Keep waiting while loading
                                        
                                        if (entity.currentRawMaterial >= CHEF_MAX_RAW_MATERIAL || barBuilding.currentRawMaterial <= 0) {
                                            entity.waitTimer = 0; // Done loading
                                        }
                                        return; 
                                    }
                                } else if (currentBuildingSymbolId === 'refinery' && refineryBuilding && Math.abs(refineryBuilding.x - entity.x) < 1) {
                                    // Chef arrived at Refinery to unload raw material (fuel it)
                                    
                                    // CHECK: Power Plant Dependency
                                    if (!powerPlantBuilding || powerPlantBuilding.currentPower <= 0) {
                                        attackMessage = `Refinery is offline. Power Plant is out of power!`;
                                        attackMessageLifetime = 60;
                                        entity.waitTimer = 0;
                                        // The chef should immediately proceed to the next stop if power is out
                                        if (entity.routeIndex !== -1 && entity.routeIndex !== -2 && entity.route.length > 0) {
                                            entity.routeIndex = (entity.routeIndex + 1) % entity.route.length; 
                                        }
                                        entity.waitTimer = CIVILIAN_WAIT_DURATION; 
                                        entity.targetEntityId = null; 
                                        entity.targetX = undefined; 
                                        entity.targetY = undefined; 
                                        return; 
                                    }
                                    // END NEW CHECK
                                    
                                    const fuelToUnload = entity.currentRawMaterial;
                                    if (fuelToUnload > 0) {
                                        const fuelNeeded = refineryBuilding.maxFuel - refineryBuilding.currentFuel;
                                        const transferAmount = Math.min(RAW_MATERIAL_LOAD_RATE * dt, fuelToUnload, fuelNeeded);
                                        
                                        if (transferAmount > 0) {
                                            entity.currentRawMaterial -= transferAmount;
                                            refineryBuilding.currentFuel += transferAmount;
                                            entity.waitTimer = Math.max(entity.waitTimer, 1); // Keep waiting while unloading

                                            // Only pay salary on successful material transfer completion (after work cooldown)
                                            if (entity.coinCooldown <= 0) {
                                                if (entity.civilianHealth >= CIVILIAN_MIN_WORK_HEALTH) {
                                                    const salary = currentEconomicLogic['chef'].work.salary;
                                                    const taxAmount = Math.floor(salary * incomeTaxRate / 100);
                                                    const netSalary = salary - taxAmount;

                                                    entity.civilianCoins += netSalary;
                                                    playerCoins += taxAmount;
                                                    
                                                    entity.civilianHealth = Math.max(0, entity.civilianHealth - CIVILIAN_WORK_HEALTH_LOSS);
                                                    
                                                    entity.coinCooldown = CIVILIAN_REWARD_COOLDOWN; 
                                                    attackMessage = `+${netSalary} ($${taxAmount} Tax) at Refinery`;
                                                    updateCoinDisplay();
                                                } else {
                                                    attackMessage = `Health too low (${entity.civilianHealth.toFixed(0)}%) to work at Refinery`;
                                                    entity.coinCooldown = CIVILIAN_REWARD_COOLDOWN; 
                                                }
                                            }
                                            return; 
                                        }
                                    }
                                    entity.waitTimer = 0; // Nothing to unload/refinery full
                                }
                            }
                            
                            // NEW: Cleaner Transport & Salary Logic
                            if (entity.symbolId === 'cleaner') {
                                const powerPlantBuilding = getBuildingBySymbolId('power_plant');
                                const currentBuildingForTrash = gameEntities.find(e => e.id === entity.targetEntityId);
                                
                                // Cleaner only loads at buildings that are NOT the power plant (work building)
                                const canLoad = currentBuildingSymbolId !== 'power_plant'; 
                                
                                if (canLoad && currentBuildingForTrash && currentBuildingForTrash.maxTrash > 0) {
                                    // Cleaner arrived at a building to load raw material (trash)
                                    const spaceInCleaner = CLEANER_MAX_RAW_MATERIAL - entity.currentRawMaterial;
                                    const availableTrash = currentBuildingForTrash.currentTrash;
                                    
                                    // NEW: Do not load if building has no trash
                                    if (availableTrash <= 0) {
                                        entity.waitTimer = 0; // Skip and move on
                                        return;
                                    }
                                    
                                    const rawToLoad = Math.min(spaceInCleaner, availableTrash);
                                    
                                    if (rawToLoad > 0) {
                                        const transferAmount = Math.min(RAW_MATERIAL_LOAD_RATE * dt, rawToLoad);
                                        entity.currentRawMaterial += transferAmount;
                                        currentBuildingForTrash.currentTrash = Math.max(0, currentBuildingForTrash.currentTrash - transferAmount); // Building loses trash here!
                                        entity.waitTimer = Math.max(entity.waitTimer, 1); // Keep waiting while loading
                                        
                                        if (entity.currentRawMaterial >= CLEANER_MAX_RAW_MATERIAL || currentBuildingForTrash.currentTrash <= 0) {
                                            entity.waitTimer = 0; // Done loading
                                        }
                                        return; 
                                    }
                                } else if (currentBuildingSymbolId === 'power_plant' && powerPlantBuilding && Math.abs(powerPlantBuilding.x - entity.x) < 1) {
                                    // Cleaner arrived at Power Plant to unload raw material (fuel it)
                                    const fuelToUnload = entity.currentRawMaterial;
                                    if (fuelToUnload > 0) {
                                        const powerNeeded = powerPlantBuilding.maxPower - powerPlantBuilding.currentPower;
                                        const transferAmount = Math.min(RAW_MATERIAL_LOAD_RATE * dt, fuelToUnload, powerNeeded);
                                        
                                        if (transferAmount > 0) {
                                            entity.currentRawMaterial -= transferAmount;
                                            powerPlantBuilding.currentPower += transferAmount; // Power Plant gains power here!
                                            entity.waitTimer = Math.max(entity.waitTimer, 1); // Keep waiting while unloading

                                            // Only pay salary on successful material transfer completion (after work cooldown)
                                            if (entity.coinCooldown <= 0) {
                                                if (entity.civilianHealth >= CIVILIAN_MIN_WORK_HEALTH) {
                                                    const salary = currentEconomicLogic['cleaner'].work.salary;
                                                    const taxAmount = Math.floor(salary * incomeTaxRate / 100);
                                                    const netSalary = salary - taxAmount;

                                                    entity.civilianCoins += netSalary;
                                                    playerCoins += taxAmount;
                                                    
                                                    entity.civilianHealth = Math.max(0, entity.civilianHealth - CIVILIAN_WORK_HEALTH_LOSS);
                                                    
                                                    entity.coinCooldown = CIVILIAN_REWARD_COOLDOWN; 
                                                    attackMessage = `+${netSalary} ($${taxAmount} Tax) at Power Plant`;
                                                    updateCoinDisplay();
                                                } else {
                                                    attackMessage = `Health too low (${entity.civilianHealth.toFixed(0)}%) to work at Power Plant`;
                                                    entity.coinCooldown = CIVILIAN_REWARD_COOLDOWN; 
                                                }
                                            }
                                            return; 
                                        }
                                    }
                                    entity.waitTimer = 0; // Nothing to unload/power plant full
                                }
                            }
                            
                            // NEW: Construction Worker Repair Logic (Change 5)
                            if (entity.symbolId === 'construction_worker') {
                                const visitedBuilding = gameEntities.find(e => 
                                    e.type === 'building' && e.symbolId === currentBuildingSymbolId && e.hp > 0 && e.maxHp > 0 &&
                                    Math.abs(e.x - entity.x) < 1 && Math.abs(e.y - entity.y) < 1
                                );
                                if (visitedBuilding && visitedBuilding.hp < visitedBuilding.maxHp) {
                                    visitedBuilding.hp = Math.min(visitedBuilding.maxHp, visitedBuilding.hp + BUILDING_REPAIR_AMOUNT);
                                    attackMessage = `Construction Worker repaired ${currentBuildingSymbolId} (+${BUILDING_REPAIR_AMOUNT} HP)!`;
                                    attackMessageLifetime = 60;
                                }
                            }

                            if (entity.coinCooldown <= 0) {
                                let rewardMessage = null;
                                let rewarded = false;

                                // 1. WORK/SALARY LOGIC (Standard, excludes Chef and Cleaner)
                                if (entity.symbolId !== 'chef' && entity.symbolId !== 'cleaner' && transactionLogic.work && transactionLogic.work.buildingId === currentBuildingSymbolId) {
                                    if (entity.civilianHealth >= CIVILIAN_MIN_WORK_HEALTH) {
                                        
                                        // Use adjusted salary from currentEconomicLogic
                                        const salary = transactionLogic.work.salary;
                                        const taxAmount = Math.floor(salary * incomeTaxRate / 100);
                                        const netSalary = salary - taxAmount;

                                        entity.civilianCoins += netSalary;
                                        playerCoins += taxAmount;
                                        
                                        entity.civilianHealth = Math.max(0, entity.civilianHealth - CIVILIAN_WORK_HEALTH_LOSS);
                                        
                                        entity.coinCooldown = CIVILIAN_REWARD_COOLDOWN; 
                                        rewardMessage = `+${netSalary} ($${taxAmount} Tax) at ${currentBuildingSymbolId}`;
                                        rewarded = true;
                                        updateCoinDisplay();
                                    } else {
                                        rewardMessage = `Health too low (${entity.civilianHealth.toFixed(0)}%) to work at ${currentBuildingSymbolId}`;
                                        rewarded = true; 
                                    }
                                }

                                // 2. SPEND/VAT LOGIC
                                const spendItem = transactionLogic.spend?.find(s => s.buildingId === currentBuildingSymbolId);
                                if (spendItem) {
                                    if (currentBuildingSymbolId === 'trade_center') {
                                        let messageSegment;
                                        if (Math.random() < 0.5) { 
                                            const lostAmount = entity.civilianCoins;
                                            entity.civilianCoins = 0;
                                            messageSegment = `LOST ALL coins at Trade Center! (-${lostAmount})`;
                                        } else { 
                                            const currentCoins = entity.civilianCoins;
                                            const doubledCoins = currentCoins * 2;
                                            const gain = doubledCoins - currentCoins; 
                                            
                                            const vatAmount = Math.ceil(gain * vatRate / 100);
                                            playerCoins += vatAmount;
                                            
                                            entity.civilianCoins = doubledCoins - vatAmount; 
                                            messageSegment = `DOUBLED coins at Trade Center! (+${gain - vatAmount} net, $${vatAmount} VAT)`;
                                            updateCoinDisplay();
                                        }
                                        rewardMessage = (rewardMessage ? rewardMessage + ' | ' : '') + messageSegment;
                                        entity.coinCooldown = CIVILIAN_REWARD_COOLDOWN; 
                                        rewarded = true;
                                        
                                    } else {
                                        // Use adjusted cost from currentEconomicLogic
                                        const cost = spendItem.cost;
                                        if (entity.civilianCoins >= cost) {
                                            entity.civilianCoins -= cost;
                                            
                                            if (spendItem.vat) {
                                                const vatAmount = Math.ceil(cost * vatRate / 100);
                                                playerCoins += vatAmount;
                                                rewardMessage = (rewardMessage ? rewardMessage + ' | ' : '') + `-${cost} ($${vatAmount} VAT) at ${currentBuildingSymbolId}`;
                                                updateCoinDisplay();
                                            } else {
                                                rewardMessage = (rewardMessage ? rewardMessage + ' | ' : '') + `-${cost} at ${currentBuildingSymbolId}`;
                                            }
                                            entity.coinCooldown = CIVILIAN_REWARD_COOLDOWN; 
                                            rewarded = true;

                                            // NEW: Increase Bar's raw material if civilian spends there
                                            if (currentBuildingSymbolId === 'bar') {
                                                const bar = gameEntities.find(e => e.id === entity.targetEntityId);
                                                if (bar) {
                                                    bar.currentRawMaterial = Math.min(bar.maxRawMaterial, bar.currentRawMaterial + 10); // Small raw material gain
                                                }
                                            }
                                        } else {
                                            rewardMessage = (rewardMessage ? rewardMessage + ' | ' : '') + `Not enough funds to spend at ${currentBuildingSymbolId}`;
                                        }
                                    }
                                }

                                if (rewarded) {
                                    attackMessage = rewardMessage;
                                    attackMessageLifetime = 60;
                                }
                            }
                            
                            // Only advance route if the unit is done with its current action (waitTimer is 0)
                            if (entity.waitTimer <= 0) { 
                                if (entity.routeIndex !== -1 && entity.routeIndex !== -2 && entity.route.length > 0) {
                                    entity.routeIndex = (entity.routeIndex + 1) % entity.route.length; 
                                }
                                
                                entity.waitTimer = CIVILIAN_WAIT_DURATION; 
                                entity.targetEntityId = null; 
                                entity.targetX = undefined; 
                                entity.targetY = undefined; 
                            }
                        }
                    }

                    // ... (Normal route move logic - finding next target building with capacity) ... (Copied from previous full game.js)
                    if (entity.targetX === undefined && entity.waitTimer <= 0) {
                        
                        if (entity.routeIndex === -2) {
                            entity.routeIndex = -1;
                        }
                        
                        let originalIndex = entity.routeIndex; 
                        let nextTargetBuilding = null;
                        let startIndex = originalIndex === -1 ? 0 : originalIndex;
                        
                        // Use Base logic for the structure/routing check
                        const routingLogic = BASE_CIVILIAN_BUILDING_LOGIC[entity.symbolId]; 
                        
                        // NEW: Chef transport AI override for route planning
                        if (entity.symbolId === 'chef') {
                            const barBuilding = getBuildingBySymbolId('bar');
                            const refineryBuilding = getBuildingBySymbolId('refinery');

                            if (entity.currentRawMaterial > 0) {
                                // Chef has raw material, needs to unload at refinery
                                if (refineryBuilding && refineryBuilding.currentFuel < refineryBuilding.maxFuel) {
                                    nextTargetBuilding = refineryBuilding;
                                    entity.routeIndex = entity.route.indexOf('refinery'); // Force route index to refinery
                                } else if (refineryBuilding) {
                                    // Refinery full, chef waits near it or goes to a spend location
                                    if (entity.routeIndex === -1 || entity.route[entity.routeIndex] !== 'grocery_store') {
                                        entity.routeIndex = entity.route.indexOf('grocery_store'); // Go spend
                                    }
                                }
                            } else if (barBuilding && barBuilding.currentRawMaterial > 0) {
                                // Chef is empty, bar has material, go load at bar
                                nextTargetBuilding = barBuilding;
                                entity.routeIndex = entity.route.indexOf('bar'); // Force route index to bar
                            }
                        }
                        
                        // NEW: Cleaner transport AI override for route planning
                        if (entity.symbolId === 'cleaner') {
                            const powerPlantBuilding = getBuildingBySymbolId('power_plant');
                            
                            if (entity.currentRawMaterial > 0) {
                                // Cleaner has raw material, needs to unload at power plant
                                if (powerPlantBuilding && powerPlantBuilding.currentPower < powerPlantBuilding.maxPower) {
                                    nextTargetBuilding = powerPlantBuilding;
                                    entity.routeIndex = entity.route.indexOf('power_plant'); // Force route index to power_plant
                                } else if (powerPlantBuilding) {
                                    // Power Plant full, cleaner waits near it or goes to a spend location
                                    if (entity.routeIndex === -1 || entity.route[entity.routeIndex] !== 'grocery_store') {
                                        entity.routeIndex = entity.route.indexOf('grocery_store'); // Go spend
                                    }
                                }
                            } else {
                                // Cleaner is empty, go to the next location in route to collect trash
                                let potentialTargets = [];
                                for (let i = 0; i < entity.route.length; i++) {
                                    const nextIndex = (startIndex + i) % entity.route.length; 
                                    const nextBuildingSymbolId = entity.route[nextIndex];
                                    
                                    if (nextBuildingSymbolId !== 'power_plant') {
                                        const building = getBuildingBySymbolId(nextBuildingSymbolId);
                                        // Only target buildings that have trash to be collected AND space in the cleaner
                                        if (building && building.currentTrash > 0 && entity.currentRawMaterial < CLEANER_MAX_RAW_MATERIAL) { 
                                            potentialTargets.push({ building: building, index: nextIndex });
                                        }
                                    }
                                }
                                
                                if (potentialTargets.length > 0) {
                                    // Pick the nearest building that has trash
                                    let nearestAvailable = potentialTargets.reduce((nearest, target) => {
                                        const distSq = (target.building.x - entity.x)**2 + (target.building.y - entity.y)**2;
                                        if (distSq < nearest.distSq) {
                                            return { building: target.building, distSq: distSq, index: target.index };
                                        }
                                        return nearest;
                                    }, { building: null, distSq: Infinity, index: -1 });

                                    if (nearestAvailable.building) {
                                        nextTargetBuilding = nearestAvailable.building;
                                        entity.routeIndex = nearestAvailable.index; 
                                    }
                                }
                            }
                        }

                        // Normal route planning (if not a chef or cleaner, or if chef/cleaner didn't find a transport target)
                        if (!nextTargetBuilding) {
                            for (let i = 0; i < entity.route.length; i++) {
                                const nextIndex = (startIndex + i) % entity.route.length; 
                                const nextBuildingSymbolId = entity.route[nextIndex];
                                
                                const isWorkBuilding = routingLogic && routingLogic.work?.buildingId === nextBuildingSymbolId;
                                
                                if (isWorkBuilding) {
                                    if (entity.assignedWorkBuildingId) {
                                        const assignedBuilding = gameEntities.find(e => e.id === entity.assignedWorkBuildingId && e.hp > 0);
                                        if (assignedBuilding) {
                                            nextTargetBuilding = assignedBuilding;
                                            entity.routeIndex = nextIndex; 
                                            break;
                                        } else {
                                            entity.assignedWorkBuildingId = null;
                                        }
                                    }
                                    
                                    const availableBuildings = getAvailableWorkBuildings(nextBuildingSymbolId, entity.symbolId);
                                    if (availableBuildings.length > 0) {
                                        let nearestAvailable = availableBuildings.reduce((nearest, building) => {
                                            const distSq = (building.x - entity.x)**2 + (building.y - entity.y)**2;
                                            if (distSq < nearest.distSq) {
                                                return { building: building, distSq: distSq };
                                            }
                                            return nearest;
                                        }, { building: null, distSq: Infinity });

                                        if (nearestAvailable.building) {
                                            entity.assignedWorkBuildingId = nearestAvailable.building.id;
                                            nextTargetBuilding = nearestAvailable.building;
                                            entity.routeIndex = nextIndex; 
                                            break;
                                        }
                                    } 
                                    
                                } else {
                                    nextTargetBuilding = getBuildingBySymbolId(nextBuildingSymbolId);
                                    
                                    if (nextTargetBuilding) {
                                        entity.routeIndex = nextIndex; 
                                        break;
                                    }
                                }
                            }
                        }

                        if (nextTargetBuilding) {
                            entity.targetX = nextTargetBuilding.x;
                            entity.targetY = nextTargetBuilding.y; 
                            entity.targetEntityId = nextTargetBuilding.id; 
                        } else {
                            entity.targetX = undefined;
                            entity.targetY = undefined;
                            entity.rotation = 0;
                            entity.targetEntityId = null;
                        }
                    }
                }
                
                // COMBAT LOGIC (Copied from previous full game.js)
                if (combatActive && entity.damage > 0 && entity.attackRange > 0) {
                    
                    let targetEntities = [];
                    if (entity.team === 'enemy') {
                        targetEntities = gameEntities.filter(e => 
                            (e.team.startsWith('friendly') || e.team === 'neutral_animal') && 
                            e.type !== 'terrain' && 
                            e.hp > 0
                        );
                    } else if (entity.team.startsWith('friendly')) {
                        targetEntities = gameEntities.filter(e => e.team === 'enemy' && e.type !== 'terrain' && e.hp > 0);
                    } else {
                        return; 
                    }
                    
                    if (targetEntities.length > 0) {
                        let nearestTarget = null;
                        let minDistanceSq = Infinity;

                        targetEntities.forEach(target => {
                            const dx = target.x - entity.x;
                            const dy = target.y - entity.y;
                            const distanceSq = dx * dx + dy * dy;

                            if (distanceSq < minDistanceSq) {
                                minDistanceSq = distanceSq;
                                nearestTarget = target;
                            }
                        });
                        
                        if (nearestTarget) {
                            const distance = Math.sqrt(minDistanceSq);
                            
                            if (entity.type === 'unit' || entity.symbolId === 'turret') {
                                const dx = nearestTarget.x - entity.x;
                                const dy = nearestTarget.y - entity.y;
                                const angle = Math.atan2(dy, dx);
                                entity.rotation = angle + Math.PI / 2;
                                
                                if (entity.type === 'unit' && distance < entity.attackRange) {
                                    entity.targetX = undefined; 
                                    entity.targetY = undefined;
                                }
                            }

                            if (distance < entity.attackRange) {
                                
                                if (entity.currentCooldown <= 0) {
                                    nearestTarget.hp -= entity.damage;
                                    entity.currentCooldown = entity.attackCooldown; 
                                    
                                    const shotColor = isEnemy(entity) ? 'red' : 'yellow';
                                    combatEffects.push({
                                        startX: entity.x,
                                        startY: entity.y,
                                        endX: nearestTarget.x,
                                        endY: nearestTarget.y,
                                        color: shotColor, 
                                        lifetime: 5 
                                    });
                                }
                            }
                        }
                    }
                }
                
                // ENEMY MOVEMENT TARGETING (Copied from previous full game.js)
                if (entity.team === 'enemy' && combatActive) {
                    if (entity.targetX === undefined || entity.targetY === undefined) {
                        let targetEntities = gameEntities.filter(e => (e.team.startsWith('friendly') || e.team === 'neutral_animal') && e.type !== 'terrain' && e.hp > 0);
                        if (targetEntities.length > 0) {
                            let nearestFriendly = null;
                            let minDistanceSq = Infinity;

                            targetEntities.forEach(friendly => {
                                const dx = friendly.x - entity.x;
                                const dy = friendly.y - entity.y;
                                const distanceSq = dx * dx + dy * dy;

                                if (distanceSq < minDistanceSq) {
                                    minDistanceSq = distanceSq;
                                    nearestFriendly = friendly;
                                }
                            });
                            
                            if (nearestFriendly) {
                                const distance = Math.sqrt(minDistanceSq);
                                if (distance > entity.attackRange) { 
                                    entity.targetX = nearestFriendly.x;
                                    entity.targetY = nearestFriendly.y;
                                }
                            }
                        }
                    }
                }

                // Unit Movement (Only if unit, has a target)
                const isAnimal = entity.team === 'neutral_animal';
                const isCivilian = entity.isCivilian;
                const isMilitaryUnit = entity.team === 'friendly_military' && entity.type === 'unit';
                
                // Can move if: is a unit, has a target, AND (is an enemy OR is an animal OR is a civilian (no stopping during attack) OR combat is inactive OR it is an armed friendly unit/chopper)
                const canMove = entity.type === 'unit' && entity.targetX !== undefined && entity.targetY !== undefined && 
                                (isEnemy(entity) || isAnimal || isCivilian || !combatActive || entity.damage > 0 || entity.symbolId === 'helicopter' || entity.isEngineer || entity.isMedic)
                                && (entity.ejectionLockoutTimer === undefined || entity.ejectionLockoutTimer <= 0); // NEW: Check lockout
                
                if (canMove) {
                    const dx = entity.targetX - entity.x;
                    const dy = entity.targetY - entity.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const speed = entity.speed; 
                    
                    // NEW: Check if unit has fuel, and if fuel is zero, block movement. Engineer (fuelConsumptionRate=0) ignores this block.
                    if (entity.maxFuel > 0 && entity.fuelConsumptionRate > 0) {
                        if (entity.currentFuel <= 0) {
                            entity.targetX = undefined; entity.targetY = undefined; entity.rotation = 0; 
                            attackMessage = `${entity.symbolId} out of fuel!`;
                            attackMessageLifetime = 60;
                            return;
                        }
                    }

                    if (distance < speed * dt) {
                        entity.x = entity.targetX;
                        entity.y = entity.targetY;
                        
                        // Garrisoning Logic - Military Unit arriving at APC 
                        // Only allow non-vehicle, non-specialized friendly military units to enter.
                        const isFootUnit = isMilitaryUnit && entity.symbolId !== 'apc' // && !entity.isEngineer && !entity.isMedic 
                                            && entity.symbolId !== 'jeep' && entity.symbolId !== 'tank' && entity.symbolId !== 'helicopter';

                        if (isFootUnit) {
                            const apcTarget = gameEntities.find(e => e.type === 'unit' && e.symbolId === 'apc' && e.hp > 0);
                            // Only proceed if the unit has arrived at or very near an APC.
                            if (apcTarget && Math.sqrt((apcTarget.x - entity.x)**2 + (apcTarget.y - entity.y)**2) < 10) { 
                                
                                if (apcTarget.garrisonedUnits.length < apcTarget.capacity) {
                                    // Remove excess properties for garrisoned unit to keep save data lean
                                    const garrisonedUnitData = {
                                        id: entity.id, // Keep old ID for selection logic
                                        type: entity.type,
                                        symbolId: entity.symbolId,
                                        team: entity.team,
                                        hp: entity.hp,
                                        maxHp: entity.maxHp,
                                        damage: entity.damage,
                                        attackRange: entity.attackRange,
                                        attackCooldown: entity.attackCooldown,
                                        speed: entity.speed,
                                        color: entity.color,
                                        // FIX: Ensure width and height are saved for re-ejection/drawing
                                        width: entity.width,
                                        height: entity.height,
                                        // End FIX
                                        isEngineer: entity.isEngineer,
                                        isMedic: entity.isMedic,
                                        // Civilian specific properties
                                        isCivilian: entity.isCivilian,
                                        civilianCoins: entity.civilianCoins,
                                        civilianHealth: entity.civilianHealth,
                                        // Keep other properties if they are needed for save/load of the unit's state when inside APC
                                    };
                                    
                                    apcTarget.garrisonedUnits.push(garrisonedUnitData);
                                    
                                    // Remove unit from main game entities list
                                    gameEntities = gameEntities.filter(e => e.id !== entity.id);
                                    
                                    attackMessage = `${entity.symbolId} entered APC (${apcTarget.garrisonedUnits.length}/${apcTarget.capacity}).`;
                                    attackMessageLifetime = 60;
                                    // Important: Unit is now gone, so return to stop further processing on a dead entity
                                    return;
                                } else {
                                    attackMessage = `APC is full (${apcTarget.garrisonedUnits.length}/${apcTarget.capacity}).`;
                                    attackMessageLifetime = 60;
                                }
                            }
                        }
                        
                        // End of the entering to the APC code block.
                        
                        if (!entity.isCivilian && !isAnimal) {
                            entity.targetX = undefined;
                            entity.targetY = undefined;
                        }
                        entity.rotation = 0; 
                    } else {
                        const ratio = (speed * dt) / distance;
                        let potentialNewX = entity.x + dx * ratio;
                        let potentialNewY = entity.y + dy * ratio;

                        let actualMoveX = potentialNewX;
                        let actualMoveY = potentialNewY;
                        let blockedByCollision = false;

                        const halfWidth = entity.width / 2;
                        const halfHeight = entity.height / 2;
                        
                        let checkTerrain = true;
                        // NEW: APC can travel on water, so skip terrain checks for water on APC
                        const isAPC = entity.symbolId === 'apc';
                        if (entity.symbolId === 'helicopter' || isAPC) {
                            checkTerrain = false;
                        }

                        // Bounding/Terrain Checks
                        if (potentialNewX < 0 || potentialNewX > GAME_WORLD_SIZE || 
                            potentialNewY < 0 || potentialNewY > GAME_WORLD_SIZE) {
                            
                            if (potentialNewX < -100 || potentialNewX > GAME_WORLD_SIZE + 100 ||
                                potentialNewY < -100 || potentialNewY > GAME_WORLD_SIZE + 100) {
                                    actualMoveX = entity.x; 
                                    actualMoveY = entity.y; 
                                    blockedByCollision = true;
                            }
                            // Don't check terrain if out of bounds, but still block if out of soft-bounds
                            checkTerrain = false; 
                        }
                        
                        if (checkTerrain) {
                            const terrainTypeAtNewPosition = getTerrainTypeAtGameCoord(potentialNewX, potentialNewY);
                            if (!isTraversableForUnits(terrainTypeAtNewPosition)) {
                                entity.targetX = undefined; entity.targetY = undefined; entity.rotation = 0; return; 
                            }
                        } else if (isAPC) {
                             // Specific terrain check for APC: only block on off_map
                            const terrainTypeAtNewPosition = getTerrainTypeAtGameCoord(potentialNewX, potentialNewY);
                            if (terrainTypeAtNewPosition === 'off_map') {
                                entity.targetX = undefined; entity.targetY = undefined; entity.rotation = 0; return; 
                            }
                        }


                        // Collision Checks
                        if (entity.symbolId === 'helicopter') {
                            // Chopper moves freely
                        } else {
                            const unitPotentialRect = {
                                x: potentialNewX - halfWidth, y: potentialNewY - halfHeight, width: entity.width, height: entity.height
                            };
                            for (const other of gameEntities) {
                                if (other.id === entity.id) continue; 
                                
                                if (!shouldCollide(entity, other)) { // Includes APC/Military check (Change 3)
                                    continue;
                                }
                                
                                // NEW: Collision Block 1: Unit vs Unit - skip if both are civilians
                                if (entity.type === 'unit' && other.type === 'unit') {
                                    if (entity.isCivilian && other.isCivilian) {
                                        continue;
                                    }
                                }
                                
                                // NEW: Collision Block 2: Unit vs Building/Wall - skip if other is a route building for a civilian
                                if (entity.isCivilian && other.type === 'building' && entity.route.includes(other.symbolId)) {
                                    continue;
                                }

                                const existingEntityRect = {
                                    x: other.x - other.width / 2,
                                    y: other.y - other.height / 2,
                                    width: other.width,
                                    height: other.height
                                };
                                
                                // Check collision for X movement
                                const tempRectForX = { ...unitPotentialRect, x: potentialNewX - halfWidth, y: entity.y - halfHeight }; 
                                if (potentialNewX !== entity.x && checkCollision(tempRectForX, existingEntityRect)) { 
                                    if (isEnemy(entity) || isAnimal) {
                                        const randomAngle = Math.random() * 2 * Math.PI;
                                        const distance = isEnemy(entity) ? 15 : 25; 
                                        
                                        entity.targetX = entity.x + Math.cos(randomAngle) * distance;
                                        entity.targetY = entity.y + Math.sin(randomAngle) * distance;
                                        
                                        entity.targetX = Math.max(-10, Math.min(GAME_WORLD_SIZE + 10, entity.targetX));
                                        entity.targetY = Math.max(-10, Math.min(GAME_WORLD_SIZE + 10, entity.targetY));

                                        entity.avoidingCollision = true;
                                        return; 
                                    } else {
                                        actualMoveX = entity.x; 
                                        blockedByCollision = true; 
                                    }
                                }
                                
                                // Check collision for Y movement
                                const tempRectForY = { ...unitPotentialRect, x: entity.x - halfWidth, y: potentialNewY - halfHeight }; 
                                if (potentialNewY !== entity.y && checkCollision(tempRectForY, existingEntityRect)) { 
                                    if (isEnemy(entity) || isAnimal) {
                                        const randomAngle = Math.random() * 2 * Math.PI;
                                        const distance = isEnemy(entity) ? 15 : 25; 
                                        
                                        entity.targetX = entity.x + Math.cos(randomAngle) * distance;
                                        entity.targetY = entity.y + Math.sin(randomAngle) * distance;
                                        
                                        entity.targetX = Math.max(-10, Math.min(GAME_WORLD_SIZE + 10, entity.targetX));
                                        entity.targetY = Math.max(-10, Math.min(GAME_WORLD_SIZE + 10, entity.targetY));

                                        entity.avoidingCollision = true;
                                        return; 
                                    } else {
                                        actualMoveY = entity.y; 
                                        blockedByCollision = true; 
                                    }
                                }
                                if (blockedByCollision && actualMoveX === entity.x && actualMoveY === entity.y) { break; }
                            }
                        }

                        // Apply fuel consumption (only if fuelConsumptionRate > 0)
                        if (entity.maxFuel > 0 && entity.fuelConsumptionRate > 0) {
                            const travelDistance = Math.sqrt((actualMoveX - entity.x)**2 + (actualMoveY - entity.y)**2);
                            const fuelUsed = travelDistance * entity.fuelConsumptionRate;
                            entity.currentFuel = Math.max(0, entity.currentFuel - fuelUsed);
                        }

                        // Calculate rotation based on movement direction
                        if (actualMoveX !== entity.x || actualMoveY !== entity.y) {
                            const angle = Math.atan2(actualMoveY - entity.y, actualMoveX - entity.x);
                            entity.rotation = angle + Math.PI / 2; 
                        }

                        // Apply actual movement
                        entity.x = actualMoveX;
                        entity.y = actualMoveY;

                        if (blockedByCollision && actualMoveX === entity.x && actualMoveY === entity.y) {
                            
                            if (entity.isCivilian || isAnimal) {
                                const randomAngle = Math.random() * 2 * Math.PI;
                                const distance = isAnimal ? 20 : 25; 
                                
                                entity.targetX = entity.x + Math.cos(randomAngle) * distance;
                                entity.targetY = entity.y + Math.sin(randomAngle) * distance;
                                
                                entity.targetX = Math.max(-10, Math.min(GAME_WORLD_SIZE + 10, entity.targetX));
                                entity.targetY = Math.max(-10, Math.min(GAME_WORLD_SIZE + 10, entity.targetY));

                                entity.avoidingCollision = true; 
                                
                            } else if (isEnemy(entity)) {
                                const randomAngle = Math.random() * 2 * Math.PI;
                                const distance = 15;
                                
                                entity.targetX = entity.x + Math.cos(randomAngle) * distance;
                                entity.targetY = entity.y + Math.sin(randomAngle) * distance;
                                
                                entity.targetX = Math.max(-10, Math.min(GAME_WORLD_SIZE + 10, entity.targetX));
                                entity.targetY = Math.max(-10, Math.min(GAME_WORLD_SIZE + 10, entity.targetY));

                                entity.avoidingCollision = true;
                            } else {
                                entity.targetX = undefined; entity.targetY = undefined; entity.rotation = 0; 
                            }
                        }
                    }
                } else if (entity.isCivilian && combatActive && civilianPanicMode) {
                    if (entity.targetEntityId !== bunkerBuilding?.id) {
                        entity.targetX = undefined;
                        entity.targetY = undefined;
                        entity.rotation = 0;
                    }
                }
            });
            
            // 3. Update destruction effects (Copied from previous full game.js)
            const frameRateFactor = dt * 60; 
            destructionEffects.forEach(effect => {
                effect.particles.forEach(p => {
                    p.x += p.vx * frameRateFactor; 
                    p.y += p.vy * frameRateFactor;
                    p.vy += 0.5 * frameRateFactor; 
                    p.size *= 1 - (0.02 * frameRateFactor); 
                    if (p.size < 0.5) p.size = 0.5;
                });
                effect.lifetime -= 1; 
            });
        }


        // Function to create a destruction effect (Copied from previous full game.js)
        function createDestructionEffect(entity) {
            const numParticles = 20;
            const particles = [];
            const entityColor = entity.team === 'enemy' ? '#dc2626' : (entity.color || '#94a3b8'); 
            
            for (let i = 0; i < numParticles; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 1;
                particles.push({
                    x: entity.x,
                    y: entity.y,
                    vx: Math.cos(angle) * speed * 0.1, 
                    vy: Math.sin(angle) * speed * 0.1 - 0.2, 
                    size: Math.random() * 3 + 1
                });
            }

            destructionEffects.push({
                particles: particles,
                color: entityColor,
                lifetime: 30 
            });
        }

        // Axis-Aligned Bounding Box (AABB) Collision detection (Copied from previous full game.js)
        function checkCollision(rect1, rect2) {
            return rect1.x < rect2.x + rect2.width &&
                   rect1.x + rect1.width > rect2.x &&
                   rect1.y < rect2.y + rect2.height &&
                   rect1.y + rect1.height > rect2.y;
        }

        // NEW: Load default map (Copied from previous full game.js)
        function loadDefaultMap() {
            fetch('map1.map')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Default map not found');
                    }
                    return response.json();
                })
                .then(loadedData => {
                    if (!loadedData.elevationData) {
                        console.error("Invalid default map file structure: Missing elevationData.");
                        return;
                    }
                    
                    currentMapData = loadedData.elevationData;
                    MAP_DATA_SIZE = currentMapData.length; 
                    gameEntities = []; 
                    selectedEntity = null;
                    entityIdCounter = 0;
                    currentSpawnConfig = null;
                    body.classList.remove('placement-mode'); 
                    combatActive = false;
                    attackMessage = null;
                    attackMessageLifetime = 0;
                    
                    // Reset economic state to defaults
                    interestRate = 0;
                    currentInflation = 0;
                    currentEconomicLogic = JSON.parse(JSON.stringify(BASE_CIVILIAN_BUILDING_LOGIC));
                    salaryInterestDelayTimer = 0;
                    theftTimer = 0; // NEW: Reset Theft Timer
                    if (interestRateInput) interestRateInput.value = interestRate;
                    if (inflationDisplay) inflationDisplay.textContent = currentInflation.toFixed(1) + '%';


                    // Load terrain items from default map
                    if (loadedData.placeableItems && Array.isArray(loadedData.placeableItems)) {
                        loadedData.placeableItems.forEach(item => {
                            if (item.type === 'terrain') {
                                const newTerrain = {
                                    id: entityIdCounter++,
                                    type: 'terrain',
                                    symbolId: item.symbolId,
                                    x: item.x,
                                    y: item.y,
                                    width: item.width || 20,
                                    height: item.height || 20,
                                    rotation: item.rotation || 0,
                                    team: 'neutral',
                                    hp: 0,
                                    maxHp: 0,
                                    damage: 0,
                                    attackRange: 0,
                                    attackCooldown: 0,
                                    currentCooldown: 0
                                };
                                gameEntities.push(newTerrain);
                            }
                        });
                    }

                    entityIdCounter = gameEntities.length;
                    
                    viewportX = (GAME_WORLD_SIZE - (viewPortWidth / zoomLevel)) / 2;
                    viewportY = (GAME_WORLD_SIZE - (viewPortHeight / zoomLevel)) / 2;
                    clampViewport(); 

                    drawGame();
                    
                    attackMessage = 'Default map loaded successfully!';
                    attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                    drawGame();
                })
                .catch(error => {
                    console.log('Default map not found or error loading:', error);
                });
        }

        // NEW: Core logic extracted for touch/mouse compatibility
        function handleCanvasTapOrClick(gameX, gameY, mouseCanvasX, mouseCanvasY) {
            
            // 1. Check for in-world APC Eject Button click
            if (selectedEntity && selectedEntity.symbolId === 'apc' && ejectButtonRect) {
                // Check if the click is within the calculated screen coordinates of the button
                if (mouseCanvasX >= ejectButtonRect.screenX && mouseCanvasX <= ejectButtonRect.screenX + ejectButtonRect.width &&
                    mouseCanvasY >= ejectButtonRect.screenY && mouseCanvasY <= ejectButtonRect.screenY + ejectButtonRect.height) {
                    
                    ejectGarrisonedUnits(selectedEntity);
                    return true; // Handled click
                }
            }

            // 2. Remove mode functionality
            if (removeModeActive) {
                for (let i = gameEntities.length - 1; i >= 0; i--) {
                    const entity = gameEntities[i];
                    const entityRect = {
                        x: entity.x - entity.width / 2,
                        y: entity.y - entity.height / 2,
                        width: entity.width,
                        height: entity.height
                    };
                    
                    if (gameX >= entityRect.x && gameX <= entityRect.x + entityRect.width &&
                        gameY >= entityRect.y && gameY <= entityRect.y + entityRect.height) {
                        
                        // If deleting an APC, eject its units first
                        if (entity.symbolId === 'apc' && entity.garrisonedUnits?.length > 0) {
                            ejectGarrisonedUnits(entity); 
                            // IMPORTANT: ejectGarrisonedUnits checks for water and returns if on water, 
                            // preventing deletion of APC and ejection on water.
                            if (getTerrainTypeAtGameCoord(entity.x, entity.y) === 'deep_water' || getTerrainTypeAtGameCoord(entity.x, entity.y) === 'shallow_water') {
                                return true; 
                            }
                        }
                        
                        // Only refund for units/vehicles, not terrain or buildings
                        if (entity.type !== 'terrain' && entity.type !== 'building') {
                            let refundAmount = 0;
                            spawnButtons.forEach(button => {
                                if (button.dataset.symbolId === entity.symbolId) {
                                    refundAmount = parseInt(button.dataset.price) || 0;
                                }
                            });
                            if (refundAmount > 0) {
                                playerCoins += refundAmount;
                                updateCoinDisplay();
                                attackMessage = `+${refundAmount} Coins Refunded`;
                                attackMessageLifetime = 60;
                            }
                        }
                        
                        gameEntities.splice(i, 1);
                        
                        drawGame();
                        return true; // Handled click
                    }
                }
                return true; // Remove mode active but nothing clicked, still handled
            }

            // 3. Left-Click Move Mode logic
            if (leftClickMoveMode) {
                // Only allow movement for friendly units, engineer, medic, and vehicles that are selected
                if (selectedEntity && selectedEntity.type === 'unit' && selectedEntity.team !== 'enemy' && selectedEntity.team !== 'neutral_animal') {
                    const moveSuccessful = handleUnitMovement(selectedEntity, gameX, gameY);
                    if (moveSuccessful) {
                        drawGame();
                        return true; // Movement handled, skip selection logic
                    }
                    // If move failed, fall through to selection
                }
                // If nothing is selected, fall through to selection
            }

            // 4. Placement Logic (only runs if currentSpawnConfig is set)
            if (currentSpawnConfig) {
                
                if (!currentMapData) {
                    attackMessage = 'Please load a map first before placing entities!';
                    attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                    drawGame();
                    return true;
                }
                
                // NEW: Building Dependency Checks
                if (currentSpawnConfig.symbolId === 'refinery') {
                    const hasPowerPlant = gameEntities.some(e => e.type === 'building' && e.symbolId === 'power_plant' && e.hp > 0);
                    if (!hasPowerPlant) {
                        attackMessage = 'Refinery requires a built Power Plant!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                }
                // NEW: Grocery Store Dependency Check (Needs Farmer)
                if (currentSpawnConfig.symbolId === 'grocery_store') {
                    const hasFarmer = gameEntities.some(e => e.type === 'unit' && e.symbolId === 'farmer' && e.hp > 0);
                    if (!hasFarmer) {
                        attackMessage = 'Grocery Store requires a deployed Farmer unit!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                }
                // NEW: Bar Dependency Check (Needs Grocery Store)
                if (currentSpawnConfig.symbolId === 'bar') {
                    const hasGroceryStore = gameEntities.some(e => e.type === 'building' && e.symbolId === 'grocery_store' && e.hp > 0);
                    if (!hasGroceryStore) {
                        attackMessage = 'Bar requires a built Grocery Store!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                }

                
                // NEW: Unit Dependency Checks
                if (currentSpawnConfig.team === 'friendly_military' && currentSpawnConfig.type === 'unit' && !currentSpawnConfig.isMedic && !currentSpawnConfig.isEngineer) {
                    const hasBarracks = gameEntities.some(e => e.type === 'building' && e.symbolId === 'barracks' && e.hp > 0);
                    if (!hasBarracks) {
                        attackMessage = 'Military units require a built Barracks!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                }
                
                // NEW: Helicopter Dependency Check (Requires Helipad AND Pilot)
                if (currentSpawnConfig.symbolId === 'helicopter') {
                    const hasHelipad = gameEntities.some(e => e.type === 'building' && e.symbolId === 'helipad' && e.hp > 0);
                    const hasPilot = gameEntities.some(e => e.type === 'unit' && e.symbolId === 'pilot' && e.hp > 0);
                    if (!hasHelipad) {
                        attackMessage = 'Helicopters require a built Helipad!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                    if (!hasPilot) {
                        attackMessage = 'Helicopters require a deployed Pilot unit!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                }

                // NEW: Power Plant Dependency Check (Requires Scientist)
                if (currentSpawnConfig.symbolId === 'power_plant') {
                    const hasScientist = gameEntities.some(e => e.type === 'unit' && e.symbolId === 'scientist' && e.hp > 0);
                    if (!hasScientist) {
                        attackMessage = 'Power Plant requires a deployed Scientist unit!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                }
                
                // NEW: Scientist Dependency Check (Requires University)
                if (currentSpawnConfig.symbolId === 'scientist') {
                    const hasUniversity = gameEntities.some(e => e.type === 'building' && e.symbolId === 'university' && e.hp > 0);
                    if (!hasUniversity) {
                        attackMessage = 'Scientist requires a built University!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                }
                
                // NEW: Doctor Unit Dependency Check (Requires University)
                if (currentSpawnConfig.symbolId === 'doctor') {
                    const hasUniversity = gameEntities.some(e => e.type === 'building' && e.symbolId === 'university' && e.hp > 0);
                    if (!hasUniversity) {
                        attackMessage = 'Doctor unit requires a built University!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                }
                
                // NEW: Hospital Dependency Check (Requires Doctor)
                if (currentSpawnConfig.symbolId === 'hospital') {
                    const hasDoctor = gameEntities.some(e => e.type === 'unit' && e.symbolId === 'doctor' && e.hp > 0);
                    if (!hasDoctor) {
                        attackMessage = 'Hospital requires a deployed Doctor unit!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                }
                
                // NEW: Farmer Dependency Check (Needs Cow, Pig, or Chicken)
                if (currentSpawnConfig.symbolId === 'farmer') {
                    const hasAnimal = gameEntities.some(e => 
                        e.team === 'neutral_animal' && 
                        (e.symbolId === 'cow' || e.symbolId === 'pig' || e.symbolId === 'chicken') && 
                        e.hp > 0
                    );
                    if (!hasAnimal) {
                        attackMessage = 'Farmer requires a Cow, Pig, or Chicken animal to be deployed!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                }


                const newEntity = {
                    id: entityIdCounter++,
                    type: currentSpawnConfig.type,
                    symbolId: currentSpawnConfig.symbolId,
                    x: gameX, 
                    y: gameY, 
                    width: currentSpawnConfig.width,
                    height: currentSpawnConfig.height,
                    color: currentSpawnConfig.color,
                    speed: currentSpawnConfig.speed,
                    rotation: currentSpawnConfig.type === 'terrain' ? Math.random() * Math.PI * 2 : currentSpawnConfig.initialRotation,
                    team: currentSpawnConfig.team,
                    hp: currentSpawnConfig.hp,
                    maxHp: currentSpawnConfig.maxHp, 
                    damage: currentSpawnConfig.damage,
                    attackRange: currentSpawnConfig.attackRange,
                    attackCooldown: currentSpawnConfig.attackCooldown,
                    currentCooldown: currentSpawnConfig.currentCooldown,
                    isCivilian: currentSpawnConfig.isCivilian || false, 
                    route: currentSpawnConfig.route || [], 
                    routeIndex: currentSpawnConfig.routeIndex, 
                    coinCooldown: currentSpawnConfig.coinCooldown || 0,
                    waitTimer: currentSpawnConfig.waitTimer || 0,
                    targetEntityId: currentSpawnConfig.targetEntityId || null,
                    avoidingCollision: currentSpawnConfig.avoidingCollision || false, 
                    civilianCoins: currentSpawnConfig.civilianCoins || 0,
                    assignedWorkBuildingId: currentSpawnConfig.assignedWorkBuildingId || null,
                    civilianHealth: currentSpawnConfig.civilianHealth || CIVILIAN_START_HEALTH,
                    ejectionLockoutTimer: currentSpawnConfig.ejectionLockoutTimer || 0, // NEW
                    // NEW VEHICLE/ENGINEER/MEDIC/APC PROPERTIES
                    maxFuel: currentSpawnConfig.maxFuel || 0,
                    currentFuel: currentSpawnConfig.currentFuel || 0,
                    fuelConsumptionRate: currentSpawnConfig.fuelConsumptionRate || 0,
                    isEngineer: currentSpawnConfig.isEngineer || false,
                    isMedic: currentSpawnConfig.isMedic || false,
                    capacity: currentSpawnConfig.capacity || 0,
                    garrisonedUnits: currentSpawnConfig.garrisonedUnits || [],
                    // NEW RAW MATERIAL PROPERTIES (For Bar/Chef/Refinery/Cleaner as fuel)
                    maxRawMaterial: currentSpawnConfig.maxRawMaterial || 0, 
                    currentRawMaterial: currentSpawnConfig.currentRawMaterial || 0,
                    // NEW POWER PLANT PROPERTIES
                    maxPower: currentSpawnConfig.maxPower || 0,
                    currentPower: currentSpawnConfig.currentPower || 0,
                    // NEW TRASH PROPERTIES
                    maxTrash: currentSpawnConfig.maxTrash || 0,
                    currentTrash: currentSpawnConfig.currentTrash || 0
                };

                const terrainType = getTerrainTypeAtGameCoord(gameX, gameY);
                
                // NEW: APC Water Placement is allowed (it's a unit, so it's checked here)
                const isAPC = newEntity.symbolId === 'apc';
                const canPlaceAPCInWater = isAPC && (terrainType === 'deep_water' || terrainType === 'shallow_water');

                if (newEntity.type === 'terrain') {
                    if (!isValidTerrainPlacement(terrainType, newEntity.symbolId)) {
                        attackMessage = 'Trees and flowers cannot be placed on water!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                    }
                } 
                else if (newEntity.type === 'unit' && newEntity.symbolId !== 'helicopter' && !isTraversableForUnits(terrainType) && !canPlaceAPCInWater) { 
                        attackMessage = 'Units can only be placed on traversable land (or water for APC)!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        return true;
                } else if (newEntity.type === 'building' && !isValidBuildingPlacement(terrainType)) {
                    attackMessage = 'Buildings cannot be placed in deep water or off-map!';
                    attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                    drawGame();
                    return true;
                }
                
                if (newEntity.team === 'neutral_animal') {
                    newEntity.waitTimer = 1; 
                }

                let canPlace = true;
                const newEntityRect = {
                    x: newEntity.x - newEntity.width / 2,
                    y: newEntity.y - newEntity.height / 2,
                    width: newEntity.width,
                    height: newEntity.height
                };

                for (const existingEntity of gameEntities) {
                    
                    if (newEntity.symbolId === 'helicopter' || existingEntity.symbolId === 'helicopter') {
                         continue;
                    }

                    const isFlowerField = newEntity.symbolId.includes('flowerfield') || newEntity.symbolId.includes('daisy') || newEntity.symbolId.includes('sunflower');
                    const existingIsFlowerField = existingEntity.symbolId.includes('flowerfield') || existingEntity.symbolId.includes('daisy') || existingEntity.symbolId.includes('sunflower');
                    if (isFlowerField || existingIsFlowerField) {
                         continue; 
                    }

                    if (!shouldCollide(newEntity, existingEntity)) {
                        continue;
                    }

                    const existingEntityRect = {
                        x: existingEntity.x - existingEntity.width / 2,
                        y: existingEntity.y - existingEntity.height / 2,
                        width: existingEntity.width,
                        height: existingEntity.height
                    };
                    
                    if (checkCollision(newEntityRect, existingEntityRect)) {
                        canPlace = false;
                        attackMessage = 'Cannot place here, something is already there!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        break;
                    }
                }

                if (canPlace) {
                    gameEntities.push(newEntity);
                    
                    if (newEntity.type !== 'terrain') {
                        playerCoins -= currentSpawnConfig.price;
                        updateCoinDisplay();
                    }

                    if (!isCtrlPressed) {
                        currentSpawnConfig = null; 
                        body.classList.remove('placement-mode');
                    }
                    drawGame();
                    return true;
                }
                return true; // Attempted placement, stop.
            }

            // 5. Selection Logic
            selectedEntity = null; 
            for (let i = gameEntities.length - 1; i >= 0; i--) {
                const entity = gameEntities[i];
                const entityRect = {
                    x: entity.x - entity.width / 2,
                    y: entity.y - entity.height / 2,
                    width: entity.width,
                    height: entity.height
                };
                if (gameX >= entityRect.x && gameX <= entityRect.x + entityRect.width &&
                    gameY >= entityRect.y && gameY <= entityRect.y + entityRect.height) {
                    selectedEntity = entity;
                    break;
                }
            }
            
            if (selectedEntity) {
                drawGame(); 
            }
            
            return false; // Not a placement, remove, or special click, signals to mouse logic to continue (for panning)
        }
        // --- END: Core logic extracted for touch/mouse compatibility ---


        // --- Event Handlers (Modified) ---
        
        createDisplayControlButtons();
        // createShortcutButtons(); // Already in index.html

        if (incomeTaxInput) incomeTaxInput.value = incomeTaxRate;
        if (vatInput) vatInput.value = vatRate;
        if (interestRateInput) interestRateInput.value = interestRate; // Initialize interest rate input

        loadDefaultMap();
        
        // NEW: Add listener for the Left-Click Move Mode button
        const toggleMoveButton = document.getElementById('toggleLeftClickMoveModeButton');
        if (toggleMoveButton) {
            toggleMoveButton.addEventListener('click', toggleLeftClickMoveMode);
        }

        // NEW: Map Generator Modal Event Listeners
        if (openMapGenButton) {
            openMapGenButton.addEventListener('click', () => {
                if (mapGenModal) {
                    mapGenModal.style.display = 'flex';
                }
            });
        }

        if (closeMapGenModal) {
            closeMapGenModal.addEventListener('click', () => {
                if (mapGenModal) {
                    mapGenModal.style.display = 'none';
                }
            });
        }

        // Keyboard event listeners (Copied from previous full game.js)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Control') {
                isCtrlPressed = true;
            }
            
            // NEW: WASD Scrolling (Change 7)
            const scrollSpeed = 20 / zoomLevel; 
            switch (event.key.toLowerCase()) {
                case 'w':
                    viewportY = Math.max(0, viewportY - scrollSpeed);
                    clampViewport();
                    drawGame();
                    break;
                case 's':
                    viewportY = Math.min(GAME_WORLD_SIZE, viewportY + scrollSpeed);
                    clampViewport();
                    drawGame();
                    break;
                case 'a':
                    viewportX = Math.max(0, viewportX - scrollSpeed);
                    clampViewport();
                    drawGame();
                    break;
                case 'd':
                    viewportX = Math.min(GAME_WORLD_SIZE, viewportX + scrollSpeed);
                    clampViewport();
                    drawGame();
                    break;
            }
            // END NEW WASD

            if (!event.ctrlKey && !event.altKey) { 
                switch (event.key) {
                    case 'r':
                    case 'R':
                        event.preventDefault();
                        toggleRemoveMode();
                        break;
                    case 'i':
                    case 'I':
                        event.preventDefault();
                        quickInsert();
                        break;
                    case 'm': // NEW: M for Left-Click Move Mode
                    case 'M':
                        event.preventDefault();
                        toggleLeftClickMoveMode();
                        break;
                    case 'Escape':
                        event.preventDefault();
                        cancelAction();
                        break;
                    case 'Delete':
                        event.preventDefault();
                        deleteSelectedEntity();
                        break;
                }
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'Control') {
                isCtrlPressed = false;
            }
        });

        const quickInsertButton = document.getElementById('quickInsertButton');
        if (quickInsertButton) {
            quickInsertButton.addEventListener('click', quickInsert);
        }

        const cancelActionButton = document.getElementById('cancelActionButton');
        if (cancelActionButton) {
            cancelActionButton.addEventListener('click', cancelAction);
        }

        const removeButton = document.getElementById('removeButton');
        if (removeButton) {
            removeButton.addEventListener('click', toggleRemoveMode);
        }

        fileInput.addEventListener('change', handleFileSelect);

        // handleFileSelect (Copied from previous full game.js)
        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;

            const isGameSave = file.name.includes('game_save') || file.name.includes('save');
            
            if (isGameSave) {
                loadGame(file);
            } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const loadedData = JSON.parse(e.target.result);
                        if (!loadedData.elevationData) {
                            console.error("Invalid map file structure: Missing elevationData.");
                            attackMessage = 'Invalid map file structure: Missing elevationData.';
                            attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                            return;
                        }
                        
                        currentMapData = loadedData.elevationData;
                        MAP_DATA_SIZE = currentMapData.length; 
                        gameEntities = []; 
                        selectedEntity = null;
                        entityIdCounter = 0;
                        currentSpawnConfig = null;
                        body.classList.remove('placement-mode'); 
                        combatActive = false; 
                        attackMessage = null;
                        attackMessageLifetime = 0;

                        // Reset economic state to defaults
                        interestRate = 0;
                        currentInflation = 0;
                        currentEconomicLogic = JSON.parse(JSON.stringify(BASE_CIVILIAN_BUILDING_LOGIC));
                        salaryInterestDelayTimer = 0;
                        theftTimer = 0; // NEW: Reset Theft Timer
                        if (interestRateInput) interestRateInput.value = interestRate;
                        if (inflationDisplay) inflationDisplay.textContent = currentInflation.toFixed(1) + '%';


                        if (loadedData.placeableItems && Array.isArray(loadedData.placeableItems)) {
                            loadedData.placeableItems.forEach(item => {
                                if (item.type === 'terrain') {
                                    const newTerrain = {
                                        id: entityIdCounter++, 
                                        type: 'terrain',
                                        symbolId: item.symbolId,
                                        x: item.x,
                                        y: item.y,
                                        width: item.width || 20, 
                                        height: item.height || 20,
                                        rotation: item.rotation || 0,
                                        team: 'neutral',
                                        hp: 0,
                                        maxHp: 0,
                                        damage: 0,
                                        attackRange: 0,
                                        attackCooldown: 0,
                                        currentCooldown: 0
                                    };
                                    gameEntities.push(newTerrain);
                                }
                            });
                        }

                        entityIdCounter = gameEntities.length; 
                        
                        viewportX = (GAME_WORLD_SIZE - (viewPortWidth / zoomLevel)) / 2;
                        viewportY = (GAME_WORLD_SIZE - (viewPortHeight / zoomLevel)) / 2;
                        clampViewport(); 

                        drawGame(); 
                        event.target.value = ''; 
                    } catch (error) {
                        console.error("Error loading or parsing map file:", error);
                        attackMessage = 'Error loading map file!';
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        event.target.value = ''; 
                    }
                };
                reader.readAsText(file);
            }
        }

        clearAllButton.addEventListener('click', () => {
            gameEntities = [];
            selectedEntity = null;
            currentSpawnConfig = null;
            destructionEffects = []; 
            combatEffects = []; 
            combatActive = false; 
            civilianPanicMode = false;
            bunkerBuilding = null;
            body.classList.remove('placement-mode');
            removeModeActive = false;
            if (removeButton) removeButton.classList.remove('active');
            body.classList.remove('remove-mode');
            leftClickMoveMode = false; // NEW: Reset move mode
            const moveButton = document.getElementById('toggleLeftClickMoveModeButton');
            if (moveButton) moveButton.classList.remove('active');
            
            playerCoins = 5000;
            updateCoinDisplay();
            
            // Reset economic state to defaults
            interestRate = 0;
            currentInflation = 0;
            currentEconomicLogic = JSON.parse(JSON.stringify(BASE_CIVILIAN_BUILDING_LOGIC));
            salaryInterestDelayTimer = 0;
            theftTimer = 0; // NEW: Reset Theft Timer
            if (interestRateInput) interestRateInput.value = interestRate;
            if (inflationDisplay) inflationDisplay.textContent = currentInflation.toFixed(1) + '%';
            
            attackMessage = 'All entities cleared. Coins reset.';
            attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
            drawGame(); 
        });

        // Start Attack Button Handler (Copied from previous full game.js)
        startAttackButton.addEventListener('click', startAttack);

        function startAttack() {
            const zombieCount = parseInt(zombieCountInput.value) || 0;
            const crawlerCount = parseInt(crawlerCountInput.value) || 0;
            const raiderCount = parseInt(raiderCountInput.value) || 0;
            const totalEnemies = zombieCount + crawlerCount + raiderCount;

            if (!currentMapData) {
                attackMessage = 'Load a map first!';
                attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                drawGame();
                return;
            }
            
            gameEntities = gameEntities.filter(e => e.team !== 'enemy');
            
            const friendlyEntities = gameEntities.filter(e => e.team.startsWith('friendly') && e.hp > 0);
            if (friendlyEntities.length === 0) {
                attackMessage = 'No friendly base to attack!';
                attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                combatActive = false;
                drawGame();
                return;
            }
            
            if (totalEnemies === 0) {
                attackMessage = 'No enemies selected for the attack wave!';
                attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                combatActive = false;
                drawGame();
                return;
            }
            
            combatActive = true; 

            const edge = Math.floor(Math.random() * 4);
            const edgeName = ['Top', 'Right', 'Bottom', 'Left'][edge];
            const offset = 10; 
            const mapMax = GAME_WORLD_SIZE + offset; 
            const mapMin = -offset; 

            const spawnEnemies = (count, spec) => {
                for (let i = 0; i < count; i++) {
                    let startX, startY;
                    
                    switch (edge) {
                        case 0: startX = Math.random() * GAME_WORLD_SIZE; startY = mapMin; break; 
                        case 1: startX = mapMax; startY = Math.random() * GAME_WORLD_SIZE; break; 
                        case 2: startX = Math.random() * GAME_WORLD_SIZE; startY = mapMax; break; 
                        case 3: startX = mapMin; startY = Math.random() * GAME_WORLD_SIZE; break; 
                    }

                    let nearestTarget = friendlyEntities[0]; 
                    let minDistanceSq = Infinity;
                    
                    const potentialTargets = gameEntities.filter(e => (e.team.startsWith('friendly') || e.team === 'neutral_animal') && e.hp > 0 && e.type !== 'terrain');
                    if (potentialTargets.length > 0) {
                        nearestTarget = potentialTargets[0];
                        potentialTargets.forEach(target => {
                            const dx = target.x - startX;
                            const dy = target.y - startY;
                            const distanceSq = dx * dx + dy * dy;

                            if (distanceSq < minDistanceSq) {
                                minDistanceSq = distanceSq;
                                nearestTarget = target;
                            }
                        });
                    }

                    const newEnemy = {
                        id: entityIdCounter++,
                        type: 'unit', 
                        symbolId: spec.symbolId,
                        x: startX, 
                        y: startY, 
                        width: spec.width,
                        height: spec.height,
                        color: spec.color,
                        speed: spec.speed,
                        rotation: 0, 
                        team: spec.team,
                        hp: spec.hp,
                        maxHp: spec.hp, 
                        damage: spec.damage,
                        attackRange: spec.range,
                        attackCooldown: spec.cooldown,
                        currentCooldown: 0,
                        targetX: nearestTarget.x, 
                        targetY: nearestTarget.y,
                        avoidingCollision: false 
                    };

                    gameEntities.push(newEnemy);
                }
            };

            spawnEnemies(zombieCount, ENEMY_SPECS.zombie);
            spawnEnemies(crawlerCount, ENEMY_SPECS.crawler);
            spawnEnemies(raiderCount, ENEMY_SPECS.raider);
            
            attackMessage = `Attack Wave of ${totalEnemies} enemies started from the ${edgeName}!`;
            attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
            drawGame();
        }


        // Spawn Button Logic (UPDATED for APC/Fuel/Engineer/Medic properties)
        spawnButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (selectedEntity) {
                    selectedEntity = null;
                    drawGame(); 
                }
                
                const price = parseInt(button.dataset.price);
                
                if (currentSpawnConfig && currentSpawnConfig.symbolId === button.dataset.symbolId) {
                    currentSpawnConfig = null; 
                    body.classList.remove('placement-mode');
                } else {
                    if (button.dataset.entityType !== 'terrain' && price > playerCoins) {
                        attackMessage = `Insufficient Coins! Need ${price}. You have ${playerCoins}.`;
                        attackMessageLifetime = ATTACK_MESSAGE_DURATION_FRAMES;
                        drawGame();
                        currentSpawnConfig = null; 
                        body.classList.remove('placement-mode');
                        return; 
                    }
                    
                    // Default values for new properties
                    const isVehicle = button.dataset.symbolId === 'jeep' || button.dataset.symbolId === 'apc' || 
                                      button.dataset.symbolId === 'tank' || button.dataset.symbolId === 'helicopter';
                    const isEngineer = button.dataset.isEngineer === 'true';
                    const isMedic = button.dataset.isMedic === 'true';
                    
                    // --- NEW RAW MATERIAL / FUEL / POWER / TRASH SETUP ---
                    let maxFuel = parseInt(button.dataset.maxFuel) || (isEngineer ? ENGINEER_MAX_FUEL : (isVehicle ? DEFAULT_MAX_FUEL : 0));
                    let currentFuel = maxFuel; // Start with full fuel
                    let fuelConsumptionRate = parseFloat(button.dataset.fuelRate) || (isVehicle ? DEFAULT_FUEL_RATE : 0);
                    const capacity = parseInt(button.dataset.capacity) || (button.dataset.symbolId === 'apc' ? APC_CAPACITY : 0);
                    
                    let maxRawMaterial = parseInt(button.dataset.maxRawMaterial) || 0;
                    let currentRawMaterial = maxRawMaterial;
                    
                    // NEW POWER PLANT PROPERTIES
                    let maxPower = 0;
                    let currentPower = 0;
                    
                    // NEW TRASH PROPERTIES
                    let maxTrash = 0;
                    let currentTrash = 0;
                    
                    // Special case: Buildings get trash properties
                    if (button.dataset.entityType === 'building') {
                        maxTrash = BUILDING_MAX_TRASH;
                        currentTrash = 0;
                    }

                    // Special case: Refinery uses maxFuel/currentFuel for its raw material supply
                    if (button.dataset.symbolId === 'refinery') {
                        maxFuel = REFINERY_MAX_FUEL; 
                        currentFuel = REFINERY_MAX_FUEL;
                        fuelConsumptionRate = 0; // Refinery consumption is now handled by Engineer load/Chef unload
                    }
                    // Special case: Bar is a building with a raw material resource
                    if (button.dataset.symbolId === 'bar') {
                        maxRawMaterial = BAR_MAX_RAW_MATERIAL;
                        currentRawMaterial = BAR_MAX_RAW_MATERIAL;
                    }
                    // Special case: Chef is a unit with a raw material resource
                    if (button.dataset.symbolId === 'chef') {
                        maxRawMaterial = CHEF_MAX_RAW_MATERIAL;
                        currentRawMaterial = 0; // Chef starts empty
                    }
                    // NEW: Special case: Cleaner is a unit with a raw material resource
                    if (button.dataset.symbolId === 'cleaner') {
                        maxRawMaterial = CLEANER_MAX_RAW_MATERIAL;
                        currentRawMaterial = 0; // Cleaner starts empty
                    }
                    // NEW: Special case: Power Plant has power capacity (overrides general building trash)
                    if (button.dataset.symbolId === 'power_plant') {
                        maxPower = POWER_PLANT_MAX_POWER;
                        currentPower = POWER_PLANT_MAX_POWER;
                        maxTrash = 0; // Power Plant itself doesn't accumulate trash from visits
                        currentTrash = 0;
                    }
                    // --- END NEW RAW MATERIAL / FUEL / POWER / TRASH SETUP ---


                    currentSpawnConfig = {
                        type: button.dataset.entityType,
                        symbolId: button.dataset.symbolId,
                        width: parseInt(button.dataset.width),
                        height: parseInt(button.dataset.height),
                        color: button.dataset.color,
                        speed: parseInt(button.dataset.speed) || 0,
                        team: button.dataset.team,
                        hp: parseInt(button.dataset.hp) || 0, 
                        maxHp: parseInt(button.dataset.hp) || 0,
                        damage: parseInt(button.dataset.damage) || 0,
                        attackRange: parseInt(button.dataset.range) || 0,
                        attackCooldown: parseFloat(button.dataset.cooldown) || 0,
                        currentCooldown: 0,
                        initialRotation: parseFloat(button.dataset.rotation) || 0,
                        price: price,
                        ejectionLockoutTimer: 0, // NEW: Default value for the timer
                        
                        // NEW VEHICLE/ENGINEER/MEDIC/APC PROPERTIES
                        maxFuel: maxFuel,
                        currentFuel: currentFuel,
                        fuelConsumptionRate: fuelConsumptionRate,
                        isEngineer: isEngineer,
                        isMedic: isMedic,
                        capacity: capacity,
                        garrisonedUnits: [],
                        // NEW RAW MATERIAL PROPERTIES (For Bar/Chef/Refinery/Cleaner as fuel)
                        maxRawMaterial: maxRawMaterial, 
                        currentRawMaterial: currentRawMaterial,
                        // NEW POWER PLANT PROPERTIES
                        maxPower: maxPower,
                        currentPower: currentPower,
                        // NEW TRASH PROPERTIES
                        maxTrash: maxTrash,
                        currentTrash: currentTrash
                    };
                    
                    // Add civilian-specific properties
                    if (currentSpawnConfig.team === 'friendly_civilian') {
                        currentSpawnConfig.isCivilian = true;
                        currentSpawnConfig.route = CIVILIAN_ROUTES[currentSpawnConfig.symbolId];
                        currentSpawnConfig.routeIndex = -1; 
                        currentSpawnConfig.coinCooldown = 0;
                        currentSpawnConfig.waitTimer = 0; 
                        currentSpawnConfig.targetEntityId = null; 
                        currentSpawnConfig.avoidingCollision = false; 
                        currentSpawnConfig.civilianCoins = CIVILIAN_START_COINS;
                        currentSpawnConfig.assignedWorkBuildingId = null;
                        currentSpawnConfig.civilianHealth = CIVILIAN_START_HEALTH;
                    }

                    body.classList.add('placement-mode');
                    removeModeActive = false;
                    if (removeButton) removeButton.classList.remove('active');
                    body.classList.remove('remove-mode');
                    
                    lastSelectedSpawnButton = button;
                }
            });
        });

        zoomSlider.addEventListener('input', () => {
            const oldZoom = zoomLevel;
            zoomLevel = parseFloat(zoomSlider.value);
            zoomValueSpan.textContent = zoomLevel.toFixed(1) + 'x';
            
            zoomLevel = Math.max(2.0, Math.min(8.0, zoomLevel));
            zoomLevel = parseFloat(zoomLevel.toFixed(1)); 
            zoomSlider.value = zoomLevel;

            if (zoomLevel !== oldZoom) {
                // Adjust viewport to keep the center of the screen the same point in the world (Copied from previous full game.js)
                viewportX = (viewportX + (viewPortWidth / (2 * oldZoom))) - (viewPortWidth / (2 * zoomLevel));
                viewportY = (viewportY + (viewPortHeight / (2 * oldZoom))) - (viewPortHeight / (2 * zoomLevel));

                clampViewport(); 
                drawGame();
            }
        }, { passive: false }); 


        function isMouseOverControlPanel(e) {
            const rect = controlPanel.getBoundingClientRect();
            return e.clientX >= rect.left && e.clientX <= rect.right &&
                   e.clientY >= rect.top && e.clientY <= rect.bottom;
        }

        canvas.addEventListener('mousedown', (event) => {
            if (isMouseOverControlPanel(event)) {
                return; 
            }

            const rect = canvas.getBoundingClientRect();
            const mouseCanvasX = event.clientX - rect.left;
            const mouseCanvasY = event.clientY - rect.top;

            const gameX = (mouseCanvasX / zoomLevel) + viewportX;
            const gameY = (mouseCanvasY / zoomLevel) + viewportY;
            
            if (event.button === 0) { // Left click for selection / Pan start
                
                // If the click handles an action (Eject, Remove, Place, Left-Click Move) don't start panning.
                const handledAction = handleCanvasTapOrClick(gameX, gameY, mouseCanvasX, mouseCanvasY);
                
                if (handledAction) {
                    return;
                }
                
                // If nothing was selected/placed/removed, start panning
                if (!selectedEntity) {
                    isPanning = true;
                    lastPanMouseX = event.clientX;
                    lastPanMouseY = event.clientY;
                    canvas.style.cursor = 'grabbing'; 
                }

            } else if (event.button === 2) { // Right click for movement (for units)
                if (currentSpawnConfig) return; 
                
                // Allow movement for friendly units, engineer, medic, and vehicles
                if (selectedEntity && selectedEntity.type === 'unit' && selectedEntity.team !== 'enemy' && selectedEntity.team !== 'neutral_animal') { 
                    handleUnitMovement(selectedEntity, gameX, gameY); 
                } else {
                    selectedEntity = null; 
                }
                drawGame(); 
            }
            event.preventDefault(); 
        });

        canvas.addEventListener('mousemove', (event) => {
            if (isPanning) {
                const deltaX = event.clientX - lastPanMouseX;
                const deltaY = event.clientY - lastPanMouseY;

                viewportX -= deltaX / zoomLevel;
                viewportY -= deltaY / zoomLevel;

                clampViewport(); 
                
                lastPanMouseX = event.clientX;
                lastPanMouseY = event.clientY;
                drawGame();
            }
        });

        canvas.addEventListener('mouseup', () => {
            isPanning = false;
            canvas.style.cursor = 'default'; 
        });

        canvas.addEventListener('wheel', (event) => {
            event.preventDefault(); 

            const mouseCanvasX = event.clientX - canvas.getBoundingClientRect().left;
            const mouseCanvasY = event.clientY - canvas.getBoundingClientRect().top;

            const mouseWorldX = (mouseCanvasX / zoomLevel) + viewportX;
            const mouseWorldY = (mouseCanvasY / zoomLevel) + viewportY;

            const zoomFactor = 1.1; 
            const oldZoom = zoomLevel;
            if (event.deltaY < 0) { 
                zoomLevel *= zoomFactor;
            } else { 
                zoomLevel /= zoomFactor;
            }

            zoomLevel = Math.max(2.0, Math.min(8.0, zoomLevel));
            zoomLevel = parseFloat(zoomLevel.toFixed(1)); 

            if (zoomLevel !== oldZoom) {
                viewportX = mouseWorldX - (mouseCanvasX / zoomLevel);
                viewportY = mouseWorldY - (mouseCanvasY / zoomLevel);

                clampViewport(); 
                
                zoomSlider.value = zoomLevel;
                zoomValueSpan.textContent = zoomLevel.toFixed(1) + 'x';
                drawGame();
            }
        }, { passive: false }); 


        // --- NEW: Touch Event Handlers for Touch Screen Compatibility ---
        
        const TAP_THRESHOLD_MS = 250; 
        const DRAG_THRESHOLD_PX = 5; 
        
        canvas.addEventListener('touchstart', (event) => {
            if (isMouseOverControlPanel(event.touches[0])) {
                return;
            }

            event.preventDefault(); 
            touchStartTime = Date.now();
            
            if (event.touches.length === 1) {
                // Single touch: Pan start
                const touch = event.touches[0];
                isPanning = true;
                lastTouch = { x: touch.clientX, y: touch.clientY, canvasX: touch.clientX - canvas.getBoundingClientRect().left, canvasY: touch.clientY - canvas.getBoundingClientRect().top };
                canvas.style.cursor = 'grabbing';
            } else if (event.touches.length === 2) {
                // Two touches: Pinch start
                isPanning = false; 
                isPinching = true;
                initialPinchDistance = getPinchDistance(event.touches);
            }
        });

        canvas.addEventListener('touchmove', (event) => {
            if (event.touches.length === 0) return;
            event.preventDefault(); 
            
            if (isPinching && event.touches.length === 2) {
                // Pinch-to-zoom logic
                const newPinchDistance = getPinchDistance(event.touches);
                const zoomDelta = newPinchDistance / initialPinchDistance;
                
                const oldZoom = zoomLevel;
                let newZoom = zoomLevel * zoomDelta;
                
                newZoom = Math.max(2.0, Math.min(8.0, newZoom));
                newZoom = parseFloat(newZoom.toFixed(1)); 

                if (newZoom !== oldZoom) {
                    
                    const rect = canvas.getBoundingClientRect();
                    const centerTouchX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
                    const centerTouchY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
                    
                    const mouseCanvasX = centerTouchX - rect.left;
                    const mouseCanvasY = centerTouchY - rect.top;

                    const mouseWorldX = (mouseCanvasX / oldZoom) + viewportX;
                    const mouseWorldY = (mouseCanvasY / oldZoom) + viewportY;

                    viewportX = mouseWorldX - (mouseCanvasX / newZoom);
                    viewportY = mouseWorldY - (mouseCanvasY / newZoom);
                    
                    zoomLevel = newZoom;
                    initialPinchDistance = newPinchDistance; 
                    
                    clampViewport();
                    zoomSlider.value = zoomLevel;
                    zoomValueSpan.textContent = zoomLevel.toFixed(1) + 'x';
                    drawGame();
                }
                
            } else if (isPanning && event.touches.length === 1) {
                // Pan logic
                const touch = event.touches[0];
                const deltaX = touch.clientX - lastTouch.x;
                const deltaY = touch.clientY - lastTouch.y;

                viewportX -= deltaX / zoomLevel;
                viewportY -= deltaY / zoomLevel;

                clampViewport(); 
                
                lastTouch.x = touch.clientX;
                lastTouch.y = touch.clientY;
                lastTouch.canvasX = touch.clientX - canvas.getBoundingClientRect().left;
                lastTouch.canvasY = touch.clientY - canvas.getBoundingClientRect().top;

                drawGame();
            }
        });

        canvas.addEventListener('touchend', (event) => {
            event.preventDefault(); 
            
            const touchDuration = Date.now() - touchStartTime;
            
            if (event.touches.length === 0) {
                // No more touches: Check for tap/end pan/pinch
                
                if (isPinching) {
                    // Pinch ended, do nothing further
                } else if (isPanning && lastTouch) {
                    // Pan ended, check if it was a short tap
                    
                    // Use a synthetic touch position if the last touch has been removed from event.touches
                    // The 'changedTouches' array contains the touch points that were removed.
                    const startTouch = event.changedTouches[0]; 
                    const rect = canvas.getBoundingClientRect();

                    const deltaX = Math.abs(startTouch.clientX - lastTouch.x);
                    const deltaY = Math.abs(startTouch.clientY - lastTouch.y);
                    
                    if (touchDuration < TAP_THRESHOLD_MS && deltaX < DRAG_THRESHOLD_PX && deltaY < DRAG_THRESHOLD_PX) {
                        // It was a tap (not a drag/pan)
                        const mouseCanvasX = startTouch.clientX - rect.left;
                        const mouseCanvasY = startTouch.clientY - rect.top;
                        
                        const gameX = (mouseCanvasX / zoomLevel) + viewportX;
                        const gameY = (mouseCanvasY / zoomLevel) + viewportY;
                        
                        handleCanvasTapOrClick(gameX, gameY, mouseCanvasX, mouseCanvasY);
                    }
                }
                
                isPanning = false;
                isPinching = false;
                lastTouch = null;
                canvas.style.cursor = 'default';
            }
        });
        
        // Helper to calculate distance between two touches for pinching
        function getPinchDistance(touches) {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }
        
        // Prevent context menu (right-click on mouse, long press on touch)
        canvas.addEventListener('contextmenu', (e) => e.preventDefault()); 

        // --- END: Touch Event Handlers ---

        // Start the game loop 
        requestAnimationFrame(gameLoop);
    });
})();