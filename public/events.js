const errorDiv = document.querySelector('.error');
const loader = document.querySelector('.loader');
const image = document.querySelector('img');
const score = document.querySelector('.score');
const comments = document.querySelector('.comments');
const userComment = document.getElementById('user-comment');
const form = document.querySelector('.comment-form');

const handleNewPic = () => {
  fetch('/kitten/image')
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      loader.innerHTML = 'Loading...';
      return res.json();
    }).then(data => {
      loader.innerHTML = '';
      image.src = data.src;
      score.innerHTML = data.score
    }).catch(async err => {
      let obj = await err.json();
      image.src = '';
      errorDiv.innerHTML = obj.message;
    });
}

const handleVote = (direction) => {
  fetch(`/kitten/${direction}Vote`, { method: 'PATCH' })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json()
    }).then(data => score.innerHTML = data.score)
    .catch(async err => {
      let obj = await err.json();
      image.src = '';
      errorDiv.innerHTML = obj.message;
    });
}

const formCb = submittedComment => {
  fetch("/kitten/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      comment: submittedComment
    })
  }).then(res => res.json())
    .then(data => {
      let array = data.comments;
      const newComment = document.createElement('div');
      const deleteButton = document.createElement('button');
      deleteButton.setAttribute('id', array.length - 1);
      deleteButton.innerHTML = 'Delete';
      newComment.innerHTML = array[array.length - 1];
      newComment.prepend(deleteButton);
      comments.appendChild(newComment);
    });

};

const deleteComment = (id) => {
  fetch(`/kitten/comments/${id}`, { method: 'DELETE' })
    .then()
};

document.getElementById('new-pic')
  .addEventListener('click', () => {
    handleNewPic();
    errorDiv.innerHTML = "";
    comments.innerHTML = "";
    userComment.value = "";
    score.innerHTML = "";
  });

document.getElementById('upvote')
  .addEventListener('click', () => handleVote('up'));
document.getElementById('downvote')
  .addEventListener('click', () => handleVote('down'));

form.addEventListener('submit', ev => {
  ev.preventDefault();
  let formData = new FormData(form);
  let submittedComment = formData.get('user-comment');
  formCb(submittedComment);
  userComment.value = "";
});

comments.addEventListener('click', ev => {
  // ev.stopPropagation();
  let target = ev.currentTarget;
  console.log(target);
});