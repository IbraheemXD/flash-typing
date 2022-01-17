const paragraph = document.querySelector(".paragraph");
const textArea = document.getElementById("my-textarea");
const typo_elem = document.querySelector(".typo");
const accuracey_elem = document.querySelector(".accuracey");
const speed_elem = document.querySelector(".speed");
const time_elem = document.querySelector(".time");
const loading_screen = document.querySelector(".loading-screen");
const result_screen = document.querySelector(".result-screen");
const container = document.querySelector(".container");
const flashAudio = new Audio("/audio/mixkit-fast-thunder-whoosh-1293.wav");
const effect_container = document.querySelector(".effect-container");
const progress_elem = document.querySelector(".progress");
let time, count, totalQuotesLength, typedinit, typoinit, netWordinit;
count = time = totalQuotesLength = typoinit = typoinit = netWordinit = 0;
let renderinit = 0;

renderData();
loading_screen.classList.remove("hide");
function getRandomQuote() {
  return fetch("https://api.quotable.io/random?minLength=70&maxLength=110")
    .then((response) => response.json())
    .then((quote) => quote.content)
    .finally(() => loading_screen.classList.add("hide"));
}

getRandomQuote().then(() => {
  updateUi();
});

textArea.addEventListener("input", function () {
  updateUi();
  const arrayQuote = paragraph.querySelectorAll("span");
  const arrayValue = textArea.value.split("");
  container.classList.remove("shake-animation");

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      container.classList.remove("shake-animation");
      addBlinker(characterSpan);
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      container.classList.add("shake-animation");
      addBlinker(characterSpan);
    }
  });
});

function addBlinker(element) {
  [...element.parentElement.children].forEach((e) =>
    e.classList.remove("active-word")
  );
  element.classList.add("active-word");
}

async function renderData() {
  const quote = await getRandomQuote();
  totalQuotesLength = totalQuotesLength + quote.length;
  paragraph.innerText = "";
  textArea.value = "";
  textArea.setAttribute("maxlength", quote.length);

  quote.split("").map((e) => {
    const textSpan = document.createElement("span");
    textSpan.innerText = e;
    paragraph.append(textSpan);
  });

  textArea.style.width = paragraph.offsetWidth + "px";
}

function updateUi() {
  getRecords();
  showNextQuote();
  typingEffects();
  const firstSpanElement = paragraph.querySelectorAll("span")[0];
  if (textArea.value == "") {
    firstSpanElement.classList.add("active-cursor");
  } else {
    firstSpanElement.classList.remove("active-cursor");
  }
}

function getRecords() {
  const typo = document.querySelectorAll(".incorrect").length + typoinit;
  const netWords = document.querySelectorAll(".correct").length + netWordinit;
  const netSpeed = Math.round(netWords / 5 / (time / 60)) || 0;
  const accuracey = Math.round(
    ((totalQuotesLength - typo) / totalQuotesLength) * 100
  );

  typo_elem.innerText = typo;
  accuracey_elem.innerText = `${accuracey}%`;
  speed_elem.innerText = `${netSpeed} wpm`;
  return {
    typo: typo,
    netSpeed: netSpeed,
    accuracey: accuracey,
    netWords: netWords,
    grossWords: totalQuotesLength,
  };
}

function showNextQuote() {
  if (textArea.value.length == textArea.getAttribute("maxlength")) {
    typedinit = getRecords().grossWords;
    typoinit = getRecords().typo;
    netWordinit = getRecords().netWords;
    renderinit += 1;
    renderData();
  }
}

function showResult() {
  if (time === 60) {
    container.classList.add("hide");
    result_screen.classList.remove("hide");

    for (const [keys, values] of Object.entries(getRecords())) {
      const elem = document.querySelector(".total-" + keys);
      if (elem != null) {
        elem.innerText = values;
      }
    }
    setTimeout(() => {
      effect_container.classList.remove("hide");
      flashAudio.play();

      setTimeout(() => {
        effect_container.classList.add("hide");
      }, 200);
    }, 1500);
  }
}

function timer() {
  setInterval(function () {
    time += 1;
    time_elem.innerText = time;
    showResult();
  }, 1000);
}

function typingEffects() {
  if (count === 0) {
    if (getRecords().netSpeed > 40 && time > 10) {
      effect_container.classList.remove("hide");
      flashAudio.play();
      count = 1;

      setTimeout(() => {
        effect_container.classList.add("hide");
      }, 200);

      setTimeout(() => {
        count = 0;
      }, 15000);

      progress_elem.classList.remove("hide");
      progress_elem.innerText = `🏆 ${getRecords().netSpeed}+`;

      setTimeout(() => {
        progress_elem.classList.add("hide");
      }, 4000);
    }
  }
}

window.addEventListener(
  "keydown",
  function () {
    timer();
  },
  { once: true }
);
window.addEventListener("keydown", function () {
  textArea.focus();
});
