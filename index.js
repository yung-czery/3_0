const button1 = document.getElementById('cw1');
const button2 = document.getElementById('cw2');
const button3 = document.getElementById('cw3');
const button4 = document.getElementById('cw4');
const button5 = document.getElementById('cw5');
const button6 = document.getElementById('cw6');

const answer = document.getElementById('answer');

function resetPage() {
  answer.innerHTML = '';
  const tables = document.querySelectorAll('table');
  tables.forEach(table => table.style.display = 'none');

  const form4 = document.getElementById('dataForm');
  form4.style.display = 'none';

  const pagination = document.getElementById('pagination');
  pagination.style.display = 'none';

  const gifs = document.getElementById('gifs');
  gifs.style.display = 'none';

  const gifForm = document.getElementById('gifForm');
  gifForm.style.display = 'none';
}

button1.addEventListener('click', () => {
  resetPage();

  const table = document.getElementById('cw1-table');

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'capital';
  input.placeholder = 'Podaj stolicę jakiegoś kraju (po ang)';

  const form = document.createElement('form');
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Zatwierdź';

  form.appendChild(input);
  form.appendChild(submitBtn);
  answer.appendChild(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const capital = formData.get('capital');

    if (!capital) {
      alert('Wprowadzono puste pole.');
      return;
    }

    try {
      const { data } = await axios.get(`https://restcountries.com/v3.1/capital/${capital}`);

      console.log(data);
      const country = data[0];

      let tableBd = table.querySelector('tbody');
      if (!tableBd) {
        tableBd = document.createElement('tbody');
        table.appendChild(tableBd);
      }
      tableBd.innerHTML = '';

      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${country.name.common}</td>
          <td>${country.capital[0]}</td>
          <td>${country.population.toLocaleString()}</td>
          <td>${country.region}</td>
          <td>${country.subregion}</td>
        `;
      tableBd.appendChild(row);

      table.style.display = 'table';
    } catch (e) {
      console.error(e);
      alert('Nie znaleziono kraju o takiej stolicy.');
    }
  });
});

button2.addEventListener('click', async () => {
  resetPage();

  try {
    const { data } = await axios.get('http://localhost:3000/stations');
    const stations = data.results;

    const table = document.getElementById('cw2-table');
    let tableBd = table.querySelector('tbody');
    if (!tableBd) {
      tableBd = document.createElement('tbody');
      table.appendChild(tableBd);
    }
    tableBd.innerHTML = '';

    stations.forEach(station => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${station.id}</td>
          <td>${station.name}</td>
          <td>${station.state ?? 'N/A'}</td>
          <td>${station.latitude.toLocaleString()}</td>
          <td>${station.longitude.toLocaleString()}</td>
        `;
      tableBd.appendChild(row);
    });
    table.style.display = 'table';
  } catch (e) {
    console.error(e);
  }
});

button3.addEventListener('click', async () => {
  resetPage();

  try {
    const { data } = await axios.get('http://localhost:3000/datasets');

    const datasets = data.results;

    const table = document.getElementById('cw3-table');
    let tableBd = table.querySelector('tbody');
    if (!tableBd) {
      tableBd = document.createElement('tbody');
      table.appendChild(tableBd);
    }
    tableBd.innerHTML = '';

    datasets.forEach(dataset => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${dataset.uid}</td>
          <td>${new Date(dataset.mindate).toLocaleDateString('pl-PL')}</td>
          <td>${new Date(dataset.maxdate).toLocaleDateString('pl-PL')}</td>
          <td>${dataset.name}</td>
          <td>${dataset.datacoverage.toLocaleString()}</td>
          <td>${dataset.id}</td>
        `;
      tableBd.appendChild(row);
    });
    table.style.display = 'table';
  } catch (e) {
    console.error(e);
  }
});

button4.addEventListener('click', async () => {
  resetPage();

  const form = document.getElementById('dataForm');
  form.style.display = 'flex';

  try {
    const select = document.getElementById('dataset');
    select.disabled = true;

    const { data: { results } } = await axios.get('http://localhost:3000/datasets');

    select.innerHTML = '';

    const ids = results.map(dataset => dataset.id);
    ids.forEach(id => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = id;
      select.appendChild(option);
    });
    select.disabled = false;

  } catch (e) {
    console.error(e);
  }

  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  let currentPage = 1;

  async function fetchData() {
    const formData = new FormData(form);

    const payload = {
      datasetid: formData.get('dataset'),
      startdate: formData.get('startDate'),
      enddate: formData.get('endDate'),
    };

    try {
      const resultsPerPage = 5;

      const { data } = await axios.get('http://localhost:3000/data', {
        params: {
          ...payload,
          limit: resultsPerPage,
          offset: (currentPage - 1) * resultsPerPage,
        },
      });

      if (!data) {
        alert('Brak danych dla wybranych parametrów.');
        return;
      }

      renderTable(data);
    } catch (e) {
      console.error(e);
      alert(`Błąd w pozyskiwaniu danych. ${e.response?.data?.error ?? ''}`);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentPage = 1;
    await fetchData();
  });

  function renderTable(data) {
    const { metadata: { resultset }, results } = data;

    const table = document.getElementById('cw4-table');
    const pagination = document.getElementById('pagination');
    const pageInfo = document.getElementById('pageInfo');

    let tableBd = table.querySelector('tbody');
    if (!tableBd) {
      tableBd = document.createElement('tbody');
      table.appendChild(tableBd);
    }
    tableBd.innerHTML = '';

    results.forEach(result => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${result.attributes}</td>
          <td>${result.datatype}</td>
          <td>${new Date(result.date).toLocaleDateString('pl-PL')}</td>
          <td>${result.station}</td>
          <td>${result.value.toLocaleString()}</td>
        `;
      tableBd.appendChild(row);
    });

    const totalPages = Math.ceil(resultset.count / resultset.limit);
    pageInfo.textContent = `Strona ${currentPage} z ${totalPages}`;

    table.style.display = 'table';
    pagination.style.display = 'block';
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchData();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchData();
  });
});

button5.addEventListener('click', async () => {
  resetPage();

  try {
    const { data } = await axios.get('https://api.giphy.com/v1/gifs/random?api_key=qRtG0VfOBoJ6HBPqscHtq8yJiA5d8T4p&tag=&rating=g');
    console.log(data);

    const img = document.createElement('img');
    img.src = data.data.images.original.url;
    answer.appendChild(img);
  } catch (e) {
    console.error(e);
  }

});

button6.addEventListener('click', async () => {
  resetPage();

  const form = document.getElementById('gifForm');
  form.style.display = 'flex';

  let currentPage = 1;

  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  function renderGifs(data) {
    const { data: gifs, pagination } = data;

    const paginationElm = document.getElementById('pagination');
    const pageInfo = document.getElementById('pageInfo');

    const gifContainer = document.getElementById('gifs');
    gifContainer.innerHTML = '';
    gifs.forEach(gif => {
      const img = document.createElement('img');
      img.src = gif.images.original.url;
      gifContainer.appendChild(img);
    })

    const totalPages = Math.ceil( pagination.total_count / pagination.count);
    pageInfo.textContent = `Strona ${currentPage} z ${totalPages}`;

    gifContainer.style.display = 'block';
    paginationElm.style.display = 'block';
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchData();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchData();
  });

  async function fetchData() {
    const formData = new FormData(form);

    const searchTerm = formData.get('search');

    try {
      const { data } = await axios.get('https://api.giphy.com/v1/gifs/search?api_key=qRtG0VfOBoJ6HBPqscHtq8yJiA5d8T4p&rating=g&lang=en&bundle=messaging_non_clips', {
        params: {
          q: searchTerm,
          limit: 6,
          offset: (currentPage - 1) * 6,
        },
      });

      renderGifs(data);
    } catch (e) {
      console.error(e);
      alert(`Błąd w pozyskiwaniu danych. ${e.response?.data?.error ?? ''}`);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetchData();
  })
});