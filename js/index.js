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

const chartObj = (function () {

  function init(song) {
    show(song)
  }

  function show(song) {
    resetDivs()
    chart.classList = ["chart"]
    chart.classList.add(song.name)
    divs.forEach(div => {
      for (const member in song.prc) {
        if (div.dataset.auth.toLowerCase() === member) {
          div.classList.contains("none") ? div.classList.remove("none") : null
          div.classList.add("show")
          div.style.height = `${song.prc[member].val * 8}px`
          div.dataset.val = song.prc[member].val
          div.dataset.msg = song.prc[member].msg
          div.querySelector("input.prc-input").value = `${song.prc[member].val}%`
          div.querySelector("input.slider").value = song.prc[member].val
          changeSendBtnColor(song.name)
          lessThan100(song)
        }
      }
    })
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
        input.addEventListener("change", rangeHandler)
      })

      sendBtn.addEventListener("click", sendHandler)
    })

  }

  return { init, addEvListeners, show }
})()

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

// const allowedKey = ["0","1","2","3","4","5","6","7","8","9"]
// function inputChangeHandler(e) {
//   const song = getSong(chart.classList[1])
//   const div = e.target.parentElement
//   const key = e.code
//   if (key.includes("Digit") || key.includes("Numpad") || allowedKey.includes(key)) {
//     song.prc[div.dataset.auth.toLowerCase()].val = parseFloat(e.target.value)
//   } else if (key === "Enter") {
//     if (e.target.value.includes("%")) {
//       e.target.value.replace("%", "")
//     }
//     let prevSong = {...song}
//     prevSong.prc[div.dataset.auth.toLowerCase()].val = parseFloat(e.target.value)
//     if (lessThan100(prevSong)) {
//       song.prc[div.dataset.auth.toLowerCase()].val = parseFloat(e.target.value)
//       chartObj.show(song)
//     }
//   } else if (key.includes("Arrow") || key === "Backspace") {
//     console.log("Do nothing")
//   } else {
//     e.target.value = ""
//   }
// }
function inputChangeHandler(e) {
  const song = getSong(chart.classList[1])
  const div = e.target.parentElement
  const member = div.dataset.auth.toLowerCase()
  let val = this.value
  if (val.includes("%")) {
    val = val.replace("%", "")

  }
  if (isNumeric(val)) {
    let prevSong = { ...song }
    prevSong.prc[member].val = parseFloat(val)
    if (lessThan100(prevSong)) {
      song.prc[member].val = parseFloat(val)
      chartObj.show(song)
    } else {
      alert("Con ese porcentaje superarías el 100%, baja de otro lado")
    }
  } else {
    alert("Introduce un numero o un porcentaje")
  }
}

function rangeHandler(e) {
  const song = getSong(chart.classList[1])
  const div = e.target.parentElement
  const member = div.dataset.auth.toLowerCase()
  const inputVal = parseFloat(this.value)
  let prevSong = JSON.parse(JSON.stringify(song))
  prevSong.prc[member].val = inputVal
  if (lessThan100(prevSong)) {
    song.prc[member].val = inputVal
  } else {
    this.value = song.prc[member].val
    alert("Con ese porcentaje superarías el 100%, baja de otro lado")
  }
  chartObj.show(song)
}


function sendHandler(e) {
  if (confirm("Si acpetas se descargará un archivo con la información que hayas cambiado, mandame ese archivo por el grupo, correo o como prefieras.")) {
    download("porcentajesCanciones.txt", JSON.stringify(songs))
  }
}

function changeSendBtnColor(name) {
  const newColor = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`)
  document.documentElement.style
    .setProperty('--send-btn-clr', newColor)
}

function getSong(name) {
  let selectedSong
  songs.forEach(song => {
    if (song.name === name) {
      selectedSong = song
    }
  })
  return selectedSong
}

function lessThan100(song) {
  const members = Object.values(song.prc)
  const totalPrc = members.reduce((acc, el) => acc + el.val, 0)
  const prcDisplay = document.querySelector(".percentaje")
  if (totalPrc <= 100) {
    prcDisplay.innerHTML = `${totalPrc}%`
    return true
  } else {
    return false
  }
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


function isNumeric(str) {
  if (typeof str != "string") return false 
  return !isNaN(str) && 
    !isNaN(parseFloat(str)) 
}








