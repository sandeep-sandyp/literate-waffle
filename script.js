const repositoryList = document.querySelector('#repository-list');
const repositoryCount = document.querySelector('#repository-count');

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(`${date}T00:00:00`));
}

function createRepository(repository) {
  const article = document.createElement('article');
  article.className = 'repository';

  const details = document.createElement('div');
  const title = document.createElement('h3');
  const link = document.createElement('a');
  link.href = repository.url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = `${repository.owner} / ${repository.name}`;
  title.append(link);

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = repository.description;

  const metadata = document.createElement('p');
  metadata.className = 'metadata';
  metadata.innerHTML = `<span>${repository.language}</span><span>Starred ${formatDate(repository.starredAt)}</span>`;

  const stars = document.createElement('span');
  stars.className = 'star-count';
  stars.textContent = `★ ${repository.stars}`;
  stars.setAttribute('aria-label', `${repository.stars} stars`);

  details.append(title, description, metadata);
  article.append(details, stars);
  return article;
}

async function renderRepositories() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    repositoryList.replaceChildren(...repositories.map(createRepository));
    repositoryCount.textContent = `${repositories.length} repositories`;
  } catch (error) {
    repositoryCount.textContent = 'Unavailable';
    repositoryList.innerHTML = '<p class="status">The repository list could not be loaded. Please try again.</p>';
    console.error(error);
  }
}

renderRepositories();