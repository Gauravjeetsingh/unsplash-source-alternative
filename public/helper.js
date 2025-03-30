const copyText = (buttonEl) => {
  const text = document.querySelector('.url-demo').textContent;
  navigator.clipboard.writeText(text)
    .then(() => {
      buttonEl.disabled = true;
      buttonEl.textContent = "Copied";
      setTimeout(() => {
        buttonEl.disabled = false;
        buttonEl.textContent = "Copy";
      }, 2000);
      console.log('Text copied to clipboard');
    })
    .catch(err => {
      console.log('Error copying text: ', err);
    });
}

const changeMode = (e) => {
  const clickedId = e.id;
  const urlElement = document.getElementsByClassName('url-demo')[0];
  console.log(clickedId);
  switch (clickedId) {
    case 'random': urlElement.innerHTML =
      "https://unsplash-source-alternative.vercel.app/random/" +
      "<span class='editable' contenteditable='true'>1600x1200</span>"
      break;

    case 'keyword': urlElement.innerHTML =
      "https://unsplash-source-alternative.vercel.app/" +
      "<span class='editable' contenteditable='true'>1600x1200</span>" +
      "?keyword=" +
      "<span class='editable' contenteditable='true'>mountain, moon</span>"
      break;

    case 'user': urlElement.innerHTML =
      "https://unsplash-source-alternative.vercel.app/user/" +
      "<span class='editable' contenteditable='true'>turbanpanda</span>" +
      "/" +
      "<span class='editable' contenteditable='true'>1600x1200</span>"
      break;

    case 'collection': urlElement.innerHTML =
      "https://unsplash-source-alternative.vercel.app/collection/" +
      "<span class='editable' contenteditable='true'>227670</span>" +
      "/" +
      "<span class='editable' contenteditable='true'>1600x1200</span>"
      break;

    case 'photo': urlElement.innerHTML =
      "https://unsplash-source-alternative.vercel.app/id/" +
      "<span class='editable' contenteditable='true'>EJN15k3ptTo</span>" +
      "/" +
      "<span class='editable' contenteditable='true'>1600x1200</span>"
      break;

    default: break;
  }
  document.getElementsByClassName('active')[0].classList.remove('active');
  e.classList.add('active');
};