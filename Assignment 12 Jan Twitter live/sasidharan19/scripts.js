
  let data = [];
  const eventsContainer = document.getElementById('events');
  const paginationContainer = document.getElementById('pagination');
  const searchInput = document.getElementById('search');
  const sortSelect = document.getElementById('sort');

  let currentPage = 1;
  const eventsPerPage = 10;

  async function fetchData() {
    try {
      const response = await fetch('./data.json');
      data = await response.json();
      updateUI();
    } catch (error) {
      console.error('Error fetching the JSON data:', error);
    }
  }

  function renderEvents(events) {
    eventsContainer.innerHTML = '';
    events.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'event';
      eventDiv.innerHTML = `
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <small>${new Date(event.timestamp * 1000).toLocaleString()}</small>
      `;
      eventsContainer.appendChild(eventDiv);
    });
  }

  function renderPagination(totalEvents) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalEvents / eventsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.disabled = i === currentPage;
      button.addEventListener('click', () => {
        currentPage = i;
        updateUI();
      });
      paginationContainer.appendChild(button);
    }
  }

  function updateUI() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortOrder = sortSelect.value;

    let filteredEvents = data.filter(event =>
      event.title.toLowerCase().includes(searchTerm)
    );

    filteredEvents.sort((a, b) => {
      return sortOrder === 'asc'
        ? a.timestamp - b.timestamp
        : b.timestamp - a.timestamp;
    });

    const start = (currentPage - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    const paginatedEvents = filteredEvents.slice(start, end);

    renderEvents(paginatedEvents);
    renderPagination(filteredEvents.length);
  }

  searchInput.addEventListener('input', () => {
    currentPage = 1;
    updateUI();
  });

  sortSelect.addEventListener('change', () => {
    currentPage = 1;
    updateUI();
  });

  fetchData();

