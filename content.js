// == Fonctions utilitaires ==
function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function clickAt(x, y) {
  const el = document.elementFromPoint(x, y);
  if (el) {
    el.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y
    }));
    console.log(`✅ Clic en (${x},${y})`);
  } else {
    console.log(`❌ Aucun élément trouvé en (${x},${y})`);
  }
}

function typeText(text) {
  const active = document.activeElement;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    active.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
    active.dispatchEvent(new KeyboardEvent("keypress", { key: char, bubbles: true }));
    if (active.tagName === "INPUT" || active.tagName === "TEXTAREA") {
      active.value += char;
    } else if (active.isContentEditable) {
      active.textContent += char;
    }
    active.dispatchEvent(new KeyboardEvent("keyup", { key: char, bubbles: true }));
  }
  console.log("✅ Texte tapé :", text);
}

function pressEnter() {
  const active = document.activeElement;
  ["keydown","keypress","keyup"].forEach(type => {
    active.dispatchEvent(new KeyboardEvent(type, {
      key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true
    }));
  });
  console.log("✅ Entrée simulée");
}

function copyTextBetweenPoints(x1, y1, x2, y2) {
  const startPos = document.caretRangeFromPoint(x1, y1);
  const endPos = document.caretRangeFromPoint(x2, y2);
  if (!startPos || !endPos) {
    console.log("❌ Impossible de copier entre les points.");
    return "Client";
  }

  const range = document.createRange();
  range.setStart(startPos.startContainer, startPos.startOffset);
  range.setEnd(endPos.startContainer, endPos.startOffset);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  const text = selection.toString();
  selection.removeAllRanges();
  console.log("✅ Texte copié :", text);
  return text || "Client";
}

function scrollBottom() {
  window.scrollTo(0, document.body.scrollHeight);
  console.log("✅ Scroll bas");
}

// === Processus principal ===
async function processClient(IDClient, NameClient) {
  console.log("🚀 Nouveau client:", IDClient, NameClient);

  // 1. clic champ ID (à adapter)
  clickAt(499, 18);
  await wait(1000);

  // 2. taper ID
  typeText(IDClient);
  await wait(500);

  // 3. Entrée
  pressEnter();
  await wait(5000);

  // 4. copier genre (à adapter)
  const GenderClient = copyTextBetweenPoints(615, 139, 698, 140);
  await wait(3000);

  // 5. clic autre (à adapter)
  clickAt(499, 18);
  await wait(5000);

  // 6. scroll bas
  scrollBottom();
  await wait(2000);

  // 7. clic bouton 1 (à adapter)
  clickAt(499, 18);
  await wait(1000);

  // 8. clic bouton 2 (à adapter)
  clickAt(400, 820);
  await wait(500);

  // 9. message
  const message = `Bonjour ${GenderClient} ${NameClient},\nJ'espère que vous passez une bonne journée.\nA bientôt au Magasin`;
  typeText(message);
  await wait(5000);

  // 10. clic envoi (à adapter)
  clickAt(450, 850);
  await wait(5000);

  // 11. clic retour (à adapter)
  clickAt(100, 100);
  await wait(1000);

  console.log("✅ Client terminé !");
}
