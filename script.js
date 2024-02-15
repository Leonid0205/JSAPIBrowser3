const nameEl = document.querySelector('.name');
const lastNameEl = document.querySelector('.lastName');
const imageEl = document.querySelector('.image-test');
const likeEl = document.querySelector('.likes');
const likeButtonEl = document.querySelector('.like-button');
const unlikeButtonEl = document.querySelector('.unlike-button');
const client_id = 'Your token';
let isFetching = false;

const initialLikes = `[
    
]`;

const likesLocalStorageKey = "likess";

if (!localStorage.getItem(likesLocalStorageKey)) {
    localStorage.setItem(likesLocalStorageKey, initialLikes);
}

const likess = JSON.parse(localStorage.getItem(likesLocalStorageKey));

getImagesFetch();
renderRandomImage();

window.addEventListener('load', () => {
    renderRandomImage();
});

if (likess.some((element) => element.id === imageEl.dataset.id)) {
    console.log('You have liked this photo already');
    let indexLike = findLikeIndex();
    likeEl.textContent = likess[indexLike].likes;
    buttonsReset();
} else {
    unlikeButtonEl.classList.add('disabled');
}

likeButtonEl.addEventListener('click', function (e) {
    let likesCount = parseInt(likeEl.textContent, 10) + 1;
    likeEl.textContent = likesCount;
    let id = imageEl.dataset.id;
    let likes = +likeEl.textContent;
    if (likess.some((element) => element.id === imageEl.dataset.id)) {
        let indexLike = findLikeIndex();
        likess[indexLike].likes = likesCount;
        savaData(likess, likesLocalStorageKey);
        buttonsReset();

    } else {
        likess.push({ id, likes });
        savaData(likess, likesLocalStorageKey);
        buttonsReset();
    }
});

unlikeButtonEl.addEventListener('click', function (e) {
    let likesCount = parseInt(likeEl.textContent, 10) - 1;
    likeEl.textContent = likesCount;
    let indexLike = findLikeIndex();
    likess[indexLike].likes = likesCount;
    savaData(likess, likesLocalStorageKey);
    unlikeButtonEl.classList.add('disabled');
    likeButtonEl.classList.remove('disabled');
});

function findLikeIndex() {
    let id = imageEl.dataset.id;
    return likess.findIndex(item => item.id === id);
}

function savaData(array, userLocalStorageKey) {
    localStorage.setItem(userLocalStorageKey, JSON.stringify(array));
}

function buttonsReset() {
    likeButtonEl.classList.add('disabled');
    unlikeButtonEl.classList.remove('disabled');
}

async function getImagesFetch() {
    isFetching = true;
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random/?client_id=${client_id}`)
        if (!response.ok) {
            throw new Error("Server failed")
        }
        return await response.json();
    } catch (err) {
        console.error('Error: ', err);
        return {};
    } finally {
        isFetching = false;
    }
}

async function renderRandomImage() {
    const image = await getImagesFetch();
    nameEl.textContent = `${image.user.name}`;
    lastNameEl.textContent = `${image.user.last_name}`;
    imageEl.src = image.urls.small;
    imageEl.dataset.id = `${image.id}`;
    likeEl.textContent = `${image.likes}`;
}