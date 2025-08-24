let csvData = [];
const log = msg => {
  document.getElementById("log").textContent += msg + "\n";
};

document.getElementById("csvFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    csvData = text
      .split(/\r?\n/)
      .filter(l => l.trim() !== "")
      .slice(1)
      .map(l => l.split(";").map(v => v.trim()));

    log(`✅ CSV chargé (${csvData.length} lignes)`);
    document.getElementById("startBtn").disabled = false;
  };
  reader.readAsText(file, "ISO-8859-1");
});

document.getElementById("startBtn").addEventListener("click", async () => {
  if (!csvData.length) {
    log("⚠️ Pas de données CSV !");
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Injecter content.js dans la page cible
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });

  for (let i = 0; i < csvData.length; i++) {
    const [IDClient, NameClient] = csvData[i];
    log(`➡ Ligne ${i + 1}: ID=${IDClient}, Name=${NameClient}`);

    // Appel de la fonction qui existe dans content.js
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (id, name) => window.processClient(id, name),
      args: [IDClient, NameClient]
    });

    await new Promise(r => setTimeout(r, 2000));
  }

  log("✅ Boucle terminée !");
});
