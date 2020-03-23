const formComments = document.querySelector('.comment-form');
const commentsDiv = document.querySelector('.comments');

const fetchImage = async () => {
  try {
    const loaderDiv = document.querySelector('.loader');
    loaderDiv.innerHTML = 'Loading...';
    let res = await fetch('/kitten/image');
    res = await checkError(res);
    loaderDiv.innerHTML = '';
    document.querySelector('img').src = res.src;
  } catch (e) {
    const error = await e.json();
    document.querySelector('.error').innerHTML = error.message;
  }
};

const voteOnImg = async (direction) => {
  try {
    let res = await fetch(`/kitten/${direction}vote`, { method: 'PATCH' });
    res = await checkError(res);
    document.querySelector('.score').innerHTML = res.score;
  } catch (e) {
    const error = await e.json();
    document.querySelector('.error').innerHTML = error.message;
  }
};

const checkError = (res) => {
  if (!res.ok) {
    throw res;
  }
  return res.json();
};

const addComment = async (comment) => {
  try {
    let res = await fetch('/kitten/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, body: JSON.stringify({
        comment
      })
    });
    res = await checkError(res);
    const idx = res.comments.length - 1;
    addCommentToDOM(res.comments[idx], idx)
  } catch (e) {
    document.querySelector('.error').innerHTML = 'Error submitting comment to server...';
  }
};

const addCommentToDOM = (comment, idx) => {
  const newComment = document.createElement('div');
  newComment.innerHTML = comment;
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('id', idx);
  deleteButton.innerHTML = 'Delete';
  newComment.appendChild(deleteButton);
  commentsDiv.appendChild(newComment);
};

document.getElementById('new-pic')
  .addEventListener('click', fetchImage);

document.getElementById('upvote')
  .addEventListener('click', () => voteOnImg('up', 1));

document.getElementById('downvote')
  .addEventListener('click', () => voteOnImg('down', -1));

formComments.addEventListener('submit', ev => {
  ev.preventDefault();
  const formData = new FormData(formComments);
  const comment = formData.get('user-comment');
  addComment(comment);
});

document.querySelector('.comments')
  .addEventListener('click', async ev => {
    try {
      if (event.target.tagName !== 'BUTTON') return;
      let res = await fetch(`/kitten/comments/${event.target.id}`, { method: 'DELETE' });
      res = await checkError(res);
      commentsDiv.innerHTML = '';
      res.comments.forEach((comment, idx) => {
        addCommentToDOM(comment, idx);
      });
    } catch (e) {
      document.querySelector('.error').innerHTML = 'Error deleting a comment from the server...';
    }
  });
