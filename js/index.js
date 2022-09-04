/**
  * Inspired by https://dribbble.com/shots/2947089--018-Analytics-Chart-Daily-UI-challenge
  *
  */
const chart = document.getElementsByClassName('chart')[0]
const divs = chart.querySelectorAll('div')
const buttons = document.querySelectorAll('nav button')
const txtInputs = document.querySelectorAll("input.prc-input")
const rangeInputs = document.querySelectorAll("input.slider")
const sendBtn = document.querySelector(".send-btn")

let songs
window.onload = () => {
  fetch("./js/songs.json")
    .then(res => res.json())
    .then(json => {
      songs = json
      const [dbf] = songs
      chartObj.addEvListeners(songs)
      chartObj.init(dbf)
    })
}



const chartObj = (function () {

  function init(song) {
    show(song)
  }

  function show(song) {
    resetDivs()
    updateChartTo(song.name)
    divs.forEach(div => {
      for (const member in song.prc) {
        if (div.dataset.auth.toLowerCase() === member) {
          div.classList.contains("none") ? div.classList.remove("none") : null
          div.classList.add("show")
          displayStats(song,member,div)
          changeSendBtnColor(song.name)
          displayPrc(song)
        }
      }
    })
  }

  function displayStats(song,member,div){
    div.style.height = `${song.prc[member].val * 8}px`
    div.dataset.val = song.prc[member].val
    div.dataset.msg = song.prc[member].msg
    div.querySelector("input.prc-input").value = `${song.prc[member].val}%`
    div.querySelector("input.slider").value = song.prc[member].val
  }


  function addEvListeners(songs) {
    buttons.forEach((btn, i) => {
      btn.addEventListener("click", e => {
        resetButtons()
        show(songs[i])
        btn.classList.add("active")
      })
      txtInputs.forEach(input => {
        input.addEventListener("change", inputChangeHandler)
        input.addEventListener("onfocusout", inputChangeHandler)
      })
      rangeInputs.forEach(input => {
        input.addEventListener("input", rangeHandler)
      })

      sendBtn.addEventListener("click", sendHandler)
    })
  }
  return { init, addEvListeners, show, displayStats }
})()



// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%% EVENT HANDLERS %%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function inputChangeHandler(e) {
  const song = getSong(chart.classList[1])
  const div = e.target.parentElement
  const member = div.dataset.auth.toLowerCase()
  let val = this.value
  if (val.includes("%")) {
    val = val.replace("%", "")
  }
  if (isNumeric(val)) {
    let prevSong = JSON.parse(JSON.stringify(song))
    prevSong.prc[member].val = parseFloat(val)
    if (lessThan100(prevSong)) {
      song.prc[member].val = parseFloat(val)
      chartObj.displayStats(song,member,div)
      displayPrc(song)
    } else {
      alert("Con ese porcentaje superarías el 100%, baja de otro lado")
      chartObj.displayStats(song,member,div)
    }
  } else {
    alert("Introduce un numero o un porcentaje")
  }
}

function rangeHandler(e) {
  const song = getSong(chart.classList[1])
  const div = e.target.parentElement
  const member = div.dataset.auth.toLowerCase()
  const inputVal = parseFloat(e.target.value)
  let prevSong = JSON.parse(JSON.stringify(song))
  prevSong.prc[member].val = inputVal
  if (lessThan100(prevSong)) {
    song.prc[member].val = inputVal
  } else {
    e.target.value = song.prc[member].val
  }
  displayPrc(song)
  chartObj.displayStats(song, member,div)
}


function sendHandler(e) {
  if (confirm("Si acpetas se descargará un archivo con la información que hayas cambiado, mandame ese archivo por el grupo, correo o como prefieras.")) {
    download("porcentajesCanciones.txt", JSON.stringify(songs))
  }
}




// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%% HELP FUNCS %%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function resetDivs() {
  divs.forEach(div => {
    div.classList.contains("show") ? div.classList.remove("show") : div.classList.remove("none")
    div.classList.add("none")
  })
}
function resetButtons() {
  buttons.forEach(btn => {
    if (btn.classList.contains("active")) { btn.classList.remove("active") }
  })
}
function changeSendBtnColor(name) {
  const newColor = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`)
  document.documentElement.style
    .setProperty('--send-btn-clr', newColor)
}
function getSong(name) {
  let selectedSong
  songs.forEach(song => song.name===name?selectedSong = song:null)
  return selectedSong
}

function lessThan100(song) {
  const totalPrc = getTotalPrc(song)
  return totalPrc <= 100? true : false
}

function getTotalPrc(song){
  const members = Object.values(song.prc)
  const totalPrc = members.reduce((acc, el) => acc + el.val, 0)
  return totalPrc
}

function displayPrc(song){
  const totalPrc = getTotalPrc(song)
  const prcDisplay = document.querySelector(".percentaje")
  prcDisplay.innerHTML = `${totalPrc}%`
}

function download(filename, text) {
  var element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

function updateChartTo(name){
  chart.classList = ["chart"]
  chart.classList.add(name)
}

function isNumeric(str) {
  if (typeof str != "string") return false 
  return !isNaN(str) && 
    !isNaN(parseFloat(str)) 
}








