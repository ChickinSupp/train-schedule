const trainList = document.querySelector('#train-list');
const form = document.querySelector('#add-train-form');

// create element and render cafe
function renderTrain(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let time = document.createElement('span');
    let frequency = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    time.textContent = doc.data().time;
    frequency.textContent = doc.data().frequency;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(time);
    li.appendChild(frequency);
    li.appendChild(cross);

    trainList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (event) => {
        event.stopPropagation();
        let id = event.target.parentElement.getAttribute('data-id');
        db.collection('trains').doc(id).delete();
    });
}

//saving data
form.addEventListener('submit', (event) => {
    event.preventDefault();
    db.collection('trains').add({
        name: form.name.value,
        city: form.city.value,
        time: form.city.value,
        frequency: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
    form.time.value = '';
    form.frequency.value = '';
})

// real-time listener
db.collection('trains').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderTrain(change.doc);
        } else if(change.type == 'removed'){
            let li = trainList.querySelector('[data-id=' + change.doc.id + ']');
            trainList.removeChild(li);
        }
    });
});