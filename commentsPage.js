document.addEventListener("DOMContentLoaded", function () {

const postDetailContainer = document.querySelector("#postDetailContainer");
const queryParams = new URLSearchParams(window.location.search);
const postId = queryParams.get("id");
// const postUrl = `https://hacker-news.firebaseio.com/v0/item/${postId}.json`;

async function fetchPostDetails() {
  const rawData = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${postId}.json`
  );
  const postData = await rawData.json();
  displayPostDetails(postData);

  //   console.log(postData.kids)
  if (postData.kids) {
    // comments id
    const commentsCont = document.createElement("div"); //div for all containers
    fetchComments(postData.kids, commentsCont);
    postDetailContainer.appendChild(commentsCont);
  }
}

function fetchComments(commentIds, container) {
  commentIds.map(async function (id) {
    const rawData = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    const commentData = await rawData.json();
    displayComment(commentData, container);
  });
}

function displayComment(commentData, container) {
  //farak container
  const commentElement = document.createElement("div");
  commentElement.classList.add("comment");
  commentElement.innerHTML = `
  <p class='themeText'><i class="ri-user-3-line pdd"></i>${commentData.by}</p>
 <p>${commentData.text}</p>
 <div class="replies"></div>`;

  container.appendChild(commentElement);

  if (commentData.kids) {
    const repliesCont = document.querySelector(".replies");
    fetchComments(commentData.kids, repliesCont);
  }
}
function displayPostDetails(data) {
  postDetailContainer.innerHTML = `
  <h1>${data.title}</h1> 
  <div class='makeFlex'>
    <p class="author pd"><i class="ri-user-3-line pdd"></i>${data.by}</p>
    <p class="stars pd"><i class="ri-star-smile-line pdd"></i>${data.score ? data.score : 0}</p>
    <p class='pd'><i class="ri-calendar-line pdd"></i> ${new Date(data.time * 1000).toLocaleString()}</p>
    <a class='pa pd' href='${data.url}' target='_blank'><i class="ri-links-line pdd"></i>Read Full Story</a>
  </div>
  <p class='postText'>${data.text? data.text:''}</p>
  <h3>Comments:</h3>
  `;
}
fetchPostDetails();
})
