let currentPage = 1;
let reposPerPage = 10;
let totalRepos = 0;
let searchTerm = '';

document.addEventListener('DOMContentLoaded', function () {
  const repositoriesList = document.getElementById('repositories-list');
  const loader = document.getElementById('loader');
  const pagination = document.getElementById('pagination');
  const statusBar = document.getElementById('statusBar');
  const searchInput = document.getElementById('searchInput');

  const githubUsername = 'johnpapa';

  const fetchRepositories = async (page) => {
    try {
      loader.style.display = 'block';
      const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&page=${page}&per_page=${reposPerPage}&q=${searchTerm}`);
      const data = await response.json();
      totalRepos = parseInt(response.headers.get('X-Total-Count'), 10);
      displayRepositories(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      loader.style.display = 'none';
    }
  };

  const displayRepositories = (repositories) => {
    repositoriesList.innerHTML = '';

    repositories.forEach(repository => {
      const repoCard = document.createElement('div');
      repoCard.className = 'repository';

      const repoName = document.createElement('h2');
      const repoLink = document.createElement('a');
      repoLink.href = repository.html_url;
      repoLink.textContent = repository.name;
      repoName.appendChild(repoLink);

      const repoDescription = document.createElement('p');
      repoDescription.textContent = repository.description || 'No description available.';

      repoCard.appendChild(repoName);
      repoCard.appendChild(repoDescription);

      // Add three buttons inside the repository card
      const button1 = createButton('javascript', repository.id);
      const button2 = createButton('angular', repository.id);
      const button3 = createButton('angularjs', repository.id);

      repoCard.appendChild(button1);
      repoCard.appendChild(button2);
      repoCard.appendChild(button3);

      repositoriesList.appendChild(repoCard);
    });

    renderPagination();
    renderStatusBar();
  };

  const createButton = (text, repositoryId) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('btn', 'btn-primary', 'mr-2'); // Add Bootstrap button classes
    button.onclick = () => handleButtonClick(repositoryId);
    return button;
  };

  const handleButtonClick = (repositoryId) => {
    // Handle button click for the specific repository
    console.log(`Button clicked for repository with ID ${repositoryId}`);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalRepos / reposPerPage);
    pagination.innerHTML = '';

    const prevButton = createPaginationButton('<<', currentPage > 1 ? currentPage - 1 : 1);
    pagination.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
      const button = createPaginationButton(i, i);
      if (i === currentPage) {
        button.classList.add('active');
      }
      pagination.appendChild(button);
    }

    const nextButton = createPaginationButton('>>', currentPage < totalPages ? currentPage + 1 : totalPages);
    pagination.appendChild(nextButton);
  };

  const createPaginationButton = (text, page) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('page-link');
    button.onclick = () => changePage(page);
    return button;
  };

  const renderStatusBar = () => {
    const totalPages = Math.ceil(totalRepos / reposPerPage);
    const statusText = document.createElement('p');
    statusText.textContent = `Page ${currentPage} of ${totalPages}`;
    statusBar.innerHTML = '';
    statusBar.appendChild(statusText);
  };

  const changePage = (newPage) => {
    if (newPage !== currentPage) {
      currentPage = newPage;
      fetchRepositories(currentPage);
    }
  };

  const handleSearch = () => {
    searchTerm = searchInput.value;
    fetchRepositories(currentPage);
  };

  fetchRepositories(currentPage);
});
