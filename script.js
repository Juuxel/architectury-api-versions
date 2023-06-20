function fetchVersions(minecraft) {
    const request = new XMLHttpRequest();
    request.onload = () => applyVersions(request, minecraft);
    request.open("GET", "https://api.modrinth.com/v2/project/architectury-api/version");
    request.setRequestHeader("User-Agent", "Juuxel/architectury-api-versions");
    request.send();

    // Clear children of version holder
    removeByClassName("version-box");

    // Create spinner
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    document.getElementById("spinner-holder").append(spinner);

    // Disable buttons
    const buttons = document.getElementsByClassName("version-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons.item(i).disabled = true;
    }
}

function applyVersions(request, minecraft) {
    if (request.status != 200) {
        console.log("Could not retrieve versions!", request.status, request.response);
        return;
    }

    const response = JSON.parse(request.response);
    const sorted = response.filter(version => version.game_versions.includes(minecraft))
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    removeByClassName("spinner");
    addVersionBox("CurseForge", "All versions for " + minecraft, "curseforge", "https://www.curseforge.com/minecraft/mc-mods/architectury-api/files?version=" + minecraft);
    addLoader(sorted, "Fabric", "fabric");
    addLoader(sorted, "Forge", "forge");
    if (addLoader(sorted, "Quilt", "quilt")) {
        document.getElementById("version-holder").classList.add("threecolumns");
    } else {
        document.getElementById("version-holder").classList.remove("threecolumns");
    }

    // Re-enable buttons
    const buttons = document.getElementsByClassName("version-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons.item(i).disabled = false;
    }
}

function removeByClassName(className) {
    const elements = document.getElementsByClassName(className);
    const length = elements.length;
    for (let i = 1; i <= length; i++) {
        const element = elements.item(length - i);
        element.remove();
    }
}

function addLoader(versions, name, id) {
    const filtered = versions.filter(version => version.loaders.includes(id));
    if (filtered.length == 0) return false;

    const version = filtered[0];
    addVersionBox(name, version.name, "modrinth", "https://modrinth.com/mod/architectury-api/version/" + version.id);
    return true;
}

function addVersionBox(title, versionName, id, link) {
    const versionBox = document.createElement("div");
    versionBox.classList.add("version-box");
    versionBox.classList.add(id);
    const loaderName = document.createElement("span");
    loaderName.classList.add("card-header");
    loaderName.textContent = title;
    versionBox.append(loaderName);
    const versionElement = document.createElement("a");
    versionElement.classList.add("version");
    versionElement.textContent = versionName;
    versionElement.href = link;
    versionBox.append(versionElement);
    document.getElementById("version-holder").append(versionBox);
}
