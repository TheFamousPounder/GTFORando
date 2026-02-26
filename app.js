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
    } else {
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
        let validEntryList = [mainWeapons, specialWeapons, tools, melee, rundowns, helmet, torso, legs, backpack, pallete];

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
let enablePalettes = loadSettings("palette-settings", pallete);

createWeaponSettings(mainWeapons, "main-weapon-settings", enableMainWeapons);
createWeaponSettings(specialWeapons, "special-weapon-settings", enableSpecialWeapons);
createWeaponSettings(tools, "tool-settings", enableTools);
createWeaponSettings(melee, "melee-settings", enableMelee);
createRundownSettings();

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
    randomizeCategory(pallete, enablePalettes, "palette-name", "palette-image", "Palettes");
});

// Rundown Randomizer
document.getElementById("rundown-randomize").addEventListener("click", function() {
    const selected = document.getElementById("rundown-select").value;
    
    const filtered = rundowns.filter(r => {
        const matchesDropdown = (selected === "all" || r.rundown == selected);
        return matchesDropdown && enableRundowns.has(r.name);
    });

    if (filtered.length === 0) {
        alert("No rundowns selected. Scared to play?");
        return;
    }

    const result = Rando(filtered);
    document.getElementById("rundown-result").textContent = result.name;
    document.getElementById("rundown-image").src = result.image;
});