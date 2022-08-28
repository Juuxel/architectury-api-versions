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
    document.getElementById("version-holder").append(spinner);

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
    addLoader(sorted, "Fabric", "fabric");
    addLoader(sorted, "Forge", "forge");
    addLoader(sorted, "Quilt", "quilt");

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
    if (filtered.length == 0) return;

    const version = filtered[0];
    const versionBox = document.createElement("div");
    versionBox.classList.add("version-box");
    const loaderName = document.createElement("span");
    loaderName.classList.add("loader-name");
    loaderName.classList.add(id);
    loaderName.textContent = name;
    versionBox.append(loaderName);
    const versionElement = document.createElement("a");
    versionElement.classList.add("version");
    versionElement.textContent = version.name;
    versionElement.href = "https://modrinth.com/mod/architectury-api/version/" + version.id;
    versionBox.append(versionElement);
    document.getElementById("version-holder").append(versionBox);
}
