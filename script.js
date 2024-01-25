document.addEventListener("DOMContentLoaded", function () {
  const topStoriesUrl =
    "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
  const postsCont = document.querySelector("#posts-cont");

  let currentPage = 1;
  const postsPerPage = 20;
  let allPosts = [];

  async function fetchPosts() {
    let rawData = await fetch(topStoriesUrl);
    let postsIds = await rawData.json();
    allPosts = postsIds.slice(0, 500); //copying data of postids into all post for manipulation
    displayPage(currentPage);

    // fetch(topStoriesUrl)
    // .then((rawData) => {
    //   return rawData.json()
    // })
    // .then((data) =>{
    //     console.log(data)
    // })
  }
  function displayPage(page) {
    postsCont.innerHTML=''// clearing postcont for each new page
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const totalPages = Math.ceil(allPosts.length/postsPerPage)

    let postsInThisPage = allPosts.slice(start, end);
    postsInThisPage.forEach(async function (id) {
      const eachPostUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
      const postResponse = await fetch(eachPostUrl);
      const postData = await postResponse.json();

      displayPost(postData);
    });
    updatePageNumber(page,totalPages)
  }
  function displayPost(data) {
    const postElement = document.createElement("div");
    postElement.className = "eachPost";
    postElement.innerHTML = `
        <div id="postTitle">${data.title}</div>
        <div id="postDetails">
            <div class="stars pd"><i class="ri-star-smile-line pdd"></i>${
              data.score ? data.score : 0
            }</div>
            <div class="comments pd"><i class="ri-message-3-line pdd"></i>${
              data.descendants ? data.descendants : 0
            }</div>
            <div class="author pd"><i class="ri-user-3-line pdd"></i>${
              data.by
            }</div>
        </div>
    `;
    postElement.style.cursor = "pointer";
    postElement.onclick = () => {
      window.location.href = `commentsPage.html?id=${data.id}`; //harek post ma click garda tesma naya comments page vanne page kholcha jun ma tyo post ko id jancha
    };
    postsCont.appendChild(postElement);
  }

  const prevPage=document.querySelector('#prevPage')
  prevPage.onclick=function(){
    if(currentPage>1){
      currentPage--
      displayPage(currentPage)
    }
  }
  const nextPage=document.querySelector('#nextPage')
  nextPage.onclick=function(){
    if(currentPage*postsPerPage<allPosts.length){
      currentPage++ // currentPage=currentPage+1 
      displayPage(currentPage)
    }
  }

  fetchPosts();
});

function updatePageNumber(currentPageNumber,numberOfTotalPage){ // updating page numbers
  const pageInfo = document.querySelector('#page-info')
  pageInfo.textContent = `${currentPageNumber}/${numberOfTotalPage}`
}
