// the main randomizer function
function Rando(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function randomizeCategory(dataArray, enabledSet, nameId, imageId, label) {
    const available = dataArray.filter(item => enabledSet.has(item.name));

    if (available.length === 0) {
        alert(`No ${label} selected. Enable at least one to randomize.`);
        return;
    }

    const picked = Rando(available);
    document.getElementById(nameId).textContent = picked.name;
    document.getElementById(imageId).src = picked.image;
}

// very riggidy way of switching pages
function showPage(page) {
    const rando = document.getElementById("rando");
    const settings = document.getElementById("settings");
    const cosmorando = document.getElementById("cosmorando");

    if (page === "rando") {
        rando.style.display = "block";
        settings.style.display = "none";
        cosmorando.style.display = "none";
    } else if (page === "cosmorando") {
        rando.style.display = "none";
        settings.style.display = "none";
        cosmorando.style.display = "block";
    } else if (page === "settings") {
        rando.style.display = "none";
        settings.style.display = "block";
        cosmorando.style.display = "none";
    }
}

// PreCache images to prevent stuttering
function preLoadAllImages() {

        // list definition as safety precaution
        let list = [];

        // Fill in entries from existing arrays
        let validEntryList = [mainWeapons, specialWeapons, tools, melee, rundowns, helmet, torso, legs, backpack, palette];

        // Loop over constants containing data
        for (let i = 0; i < validEntryList.length; i++) {
            for (let j = 0; j < validEntryList[i].length; j++) {

                // Push into list Array if image string exists
                if (validEntryList[i][j].image != undefined) {
                    list.push(validEntryList[i][j].image);
                }

            }
        }

        // Load the images and remove them from memory
        for (let i = 0; i < list.length; i++) {

            let img = new Image();

            // Define load functionality to remove themselves
            img.onload = function() {
                let index = list.indexOf(this);
                if (index  !== -1) {
                    list.splice(index, 1);
                }
            }

            // Set src so they actually load
            img.src = list[i];
        }

        console.log("Images were precached succesfully");
    }

function loadSettings(key, array) {
    const saved = localStorage.getItem(key);
    return saved ? new Set(JSON.parse(saved)) : new Set(array.map(x => x.name));
}
// creating loadout settings
// this and cosmetic can, and should, be combined
function createWeaponSettings(array, elementId, set) {
    const container = document.getElementById(elementId);

    array.forEach(weapon => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = set.has(weapon.name);

        checkbox.addEventListener("change", function() {
            this.checked ? set.add(weapon.name) : set.delete(weapon.name);
            localStorage.setItem(elementId, JSON.stringify(Array.from(set)));
        });

        label.appendChild(checkbox);
        label.append(" " + weapon.name);
        container.appendChild(label);
    });
}

function createCosmeticSettings(array, elementId, set) {
    const container = document.getElementById(elementId);

    array.forEach(cosmetic => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = set.has(cosmetic.name);

        checkbox.addEventListener("change", function() {
            this.checked ? set.add(cosmetic.name) : set.delete(cosmetic.name);
            localStorage.setItem(elementId, JSON.stringify(Array.from(set)));
        });

        label.appendChild(checkbox);
        label.append(" " + cosmetic.name);
        container.appendChild(label);
    });
}

function createRundownSettings() {
    const container = document.getElementById("rundown-settings");
    const uniqueRundowns = [...new Set(rundowns.map(r => r.rundown))];

    uniqueRundowns.forEach(number => {
        const column = document.createElement("div");
        column.className = "rundown-column";

        const title = document.createElement("h3");
        title.textContent = "R" + number;
        column.appendChild(title);

        rundowns.filter(r => r.rundown === number).forEach(level => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = enableRundowns.has(level.name);

            checkbox.addEventListener("change", function() {
                this.checked ? enableRundowns.add(level.name) : enableRundowns.delete(level.name);
                localStorage.setItem("rundowns", JSON.stringify(Array.from(enableRundowns)));
            });

            label.appendChild(checkbox);
            label.append(" " + level.name);
            column.appendChild(label);
        });
        container.appendChild(column);
    });
}


// Initialize Sets
let enableMainWeapons = loadSettings("main-weapon-settings", mainWeapons);
let enableSpecialWeapons = loadSettings("special-weapon-settings", specialWeapons);
let enableTools = loadSettings("tool-settings", tools);
let enableMelee = loadSettings("melee-settings", melee);

let enableRundowns = loadSettings("rundowns", rundowns);

// these do nothing right now but they will be used for the cosmetic randomizer settings page
let enableHelmets = loadSettings("helmet-settings", helmet);
let enableTorso = loadSettings("torso-settings", torso);
let enableLegs = loadSettings("legs-settings", legs);
let enableBackpacks = loadSettings("backpack-settings", backpack);
let enablePalettes = loadSettings("palette-settings", palette);

createWeaponSettings(mainWeapons, "main-weapon-settings", enableMainWeapons);
createWeaponSettings(specialWeapons, "special-weapon-settings", enableSpecialWeapons);
createWeaponSettings(tools, "tool-settings", enableTools);
createWeaponSettings(melee, "melee-settings", enableMelee);
createRundownSettings();
createCosmeticSettings(helmet, "helmet-settings", enableHelmets);
createCosmeticSettings(torso, "torso-settings", enableTorso);
createCosmeticSettings(legs, "legs-settings", enableLegs);
createCosmeticSettings(backpack, "backpack-settings", enableBackpacks);
createCosmeticSettings(palette, "palette-settings", enablePalettes);

// Randomizer button
document.getElementById("randomize").addEventListener("click", function() {
    randomizeCategory(mainWeapons, enableMainWeapons, "main-name", "main-image", "Main Weapons");
    randomizeCategory(specialWeapons, enableSpecialWeapons, "special-name", "special-image", "Special Weapons");
    randomizeCategory(tools, enableTools, "tool-name", "tool-image", "Tools");
    randomizeCategory(melee, enableMelee, "melee-name", "melee-image", "Melee");
});

document.getElementById("cosmetic-randomize").addEventListener("click", function() {
    randomizeCategory(helmet, enableHelmets, "helmet-name", "helmet-image", "Helmets");
    randomizeCategory(torso, enableTorso, "torso-name", "torso-image", "Torso");
    randomizeCategory(legs, enableLegs, "legs-name", "legs-image", "Legs");
    randomizeCategory(backpack, enableBackpacks, "backpack-name", "backpack-image", "Backpacks");
    randomizeCategory(palette, enablePalettes, "palette-name", "palette-image", "Palettes");
});

// Updated Rundown Randomizer
document.getElementById("rundown-randomize").addEventListener("click", function() {
    const selectedRundown = document.getElementById("rundown-select").value;
    
    const filterMain = document.getElementById("mainfilter").checked;
    const filterSecondary = document.getElementById("secfilter").checked;
    const filterOverload = document.getElementById("overloadfilter").checked;

    const filtered = rundowns.filter(r => {
        const matchesDropdown = (selectedRundown === "all" || r.rundown == selectedRundown);
        
        const isEnabled = enableRundowns.has(r.name);

        const isMainRundown = (selectedRundown === 1 || selectedRundown === 2 || selectedRundown === 3);
        
        let matchesObjectives = true;
        
        if (!isMainRundown) {
        if (filterMain) {
                const ignore = r.objectives.includes("secondary");
                if (ignore) matchesObjectives = false;
            }
        if (filterSecondary && !r.objectives.includes("secondary")) matchesObjectives = false;
        if (filterOverload && !r.objectives.includes("overload")) matchesObjectives = false;
        }

        return matchesDropdown && isEnabled && matchesObjectives;
    });

    if (filtered.length === 0) {
        alert("Main only implies the existence of no secondary or overload objective, doesn't it?");
        return;
    }

    const result = Rando(filtered);
    document.getElementById("rundown-result").textContent = result.name;
    document.getElementById("rundown-image").src = result.image;
});