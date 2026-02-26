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

    if (page === "rando") {
        rando.style.display = "block";
        settings.style.display = "none";
    } else {
        rando.style.display = "none";
        settings.style.display = "block";
    }
}

function preLoadAllImages() {
    let list = [];
    let validEntryList = [mainWeapons, specialWeapons, tools, melee, rundowns];

    validEntryList.forEach(category => {
        category.forEach(item => {
            if (item.image) list.push(item.image);
        });
    });

    list.forEach(src => {
        let img = new Image();
        img.src = src;
    });
    console.log("Images precached.");
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