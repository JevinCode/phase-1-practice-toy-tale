let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

addSubmitToyFormEvent();

fetchJSON('http://localhost:3000/toys').then(toys => toys.forEach(renderToy));

function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");
  const card = document.createElement('div');
  card.className = 'card';

  const h2 = document.createElement('h2');
  h2.textContent = toy.name;

  const img = document.createElement('img');
  img.className = 'toy-avatar';
  img.src = toy.image;

  const p = document.createElement('p');
  p.textContent = `${toy.likes} Likes`;

  const button = document.createElement('button');
  button.className = 'like-btn';
  button.id = toy.id;
  button.textContent = 'Like';
  button.addEventListener('click', e => {
    e.preventDefault();
    patchJSON(`http://localhost:3000/toys/${toy.id}`, {"likes": toy.likes + 1}).then(data => {
      toy.likes = data.likes;
      p.textContent = `${data.likes} Likes`;
    });
  });
  card.append(h2, img, p, button);

  toyCollection.append(card);
}



function addSubmitToyFormEvent() {
  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener('submit', e => {
    e.preventDefault();

    const toy = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    };
    postJSON('http://localhost:3000/toys', toy).then(response => renderToy(response));
    e.target.reset();
  });
}

function fetchJSON(url) {
  return fetch(url).then(response => {
    if(response.ok) {
      return response.json()
    } else {
      throw(`An error occured. Status code: ${response.status}.`);
    }
    });
}
function postJSON(url, data) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw (response.statusText)
      }
    })
}
function patchJSON(url, data) {
  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw (response.statusText)
      }
    })
}