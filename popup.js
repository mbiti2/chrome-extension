const countEl = document.getElementById('count');
const resultEl = document.getElementById('result');
const historyTable = document.getElementById('history');

// Load saved history
chrome.storage.local.get({ history: [] }, data => {
  data.history.forEach(appendHistoryRow);
});

document.getElementById('start').addEventListener('click', () => {
  const challenge = document.getElementById('challenge').value;
  const difficulty = parseInt(document.getElementById('difficulty').value, 10);

  if (!challenge || isNaN(difficulty) || difficulty < 1) {
    alert("Enter valid challenge and difficulty.");
    return;
  }

  countEl.textContent = '0';
  resultEl.textContent = '';
  chrome.runtime.sendMessage({ cmd: 'startPoW', challenge, difficulty });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'count') {
    countEl.textContent = msg.value;
  } else if (msg.type === 'done') {
    resultEl.textContent = `✅ Nonce = ${msg.nonce}, Hash = ${msg.hash}`;
    appendHistoryRow({
      challenge: msg.challenge,
      nonce: msg.nonce,
      hash: msg.hash,
      time: msg.time
    });
  }
});

function appendHistoryRow({ challenge, nonce, hash, time }) {
  const tr = document.createElement('tr');
  [challenge, nonce, hash, new Date(time).toLocaleString()].forEach(text => {
    const td = document.createElement('td');
    td.textContent = text;
    tr.appendChild(td);
  });
  historyTable.appendChild(tr);
}
