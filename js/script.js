const overview = document.querySelector(".overview");
const username = "annemarieb78";
const repoList = document.querySelector(".repo-list");
const repoSection = document.querySelector(".repos");
const repoDataDisplay = document.querySelector(".repo-data");
const backToGalleryButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const getGitHubData = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  console.log(data);
  displayUserInfo(data);
};

getGitHubData();

const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `<figure>
    <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div>`;
  overview.append(div);
  gitHubRepos();
};

const gitHubRepos = async function () {
  const fetchRepos = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  const repoData = await fetchRepos.json();
  //console.log(repoData);
  displayRepoData(repoData);
};

const displayRepoData = function (repos) {
  for (const repo of repos) {
    filterInput.classList.remove("hide");
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    getRepoInfo(repoName);
  }
});

const getRepoInfo = async function (repoName) {
  const fetchInfo = await fetch(
    `https://api.github.com/repos/${username}/${repoName}`
  );
  const repoInfo = await fetchInfo.json();

  //grab languages
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  console.log(languageData);

  //make list of languages
  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  }
  console.log(languages);
  displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
  repoDataDisplay.innerHTML = "";
  backToGalleryButton.classList.remove("hide");
  repoDataDisplay.classList.remove("hide");
  repoSection.classList.add("hide");
  const div = document.createElement("div");
  div.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
  <p>Description: ${repoInfo.description}</p>
  <p>Default Branch: ${repoInfo.default_branch}</p>
  <p>Languages: ${languages.join(", ")}</p>
  <a class="visit" href="${
    repoInfo.html_url
  }" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;
  repoDataDisplay.append(div);
};

backToGalleryButton.addEventListener("click", function () {
  repoSection.classList.remove("hide");
  repoDataDisplay.classList.add("hide");
  backToGalleryButton.classList.add("hide");
});

filterInput.addEventListener("input", function (e) {
  const searchText = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const searchLowerText = searchText.toLowerCase();

  for (const repo of repos) {
    const repoLowerText = repo.innerText.toLowerCase();
    if (repoLowerText.includes(searchLowerText)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});

