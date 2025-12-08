const generate_a_joke = async () => {
  const response = await window.versions.joke()
  const jokeContainer = document.getElementById("joke")
    jokeContainer.innerText = response
}

// const generate_joke = document.getElementById("generate-joke")
// generate_joke.addEventListener("click", async () => {
//   generate_a_joke()
// })
