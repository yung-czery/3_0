const button1 = document.getElementById('cw1');
const button2 = document.getElementById('cw2');
const button3 = document.getElementById('cw3');

const answer = document.getElementById('answer');

button1.addEventListener('click', () => {
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
  document.body.appendChild(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const capital = formData.get('capital');

    try {
      const { data } = await axios.get(`https://restcountries.com/v3.1/capital/${capital}`);

      console.log(data);
      const country = data[0];

      const table = document.getElementById('cw1-table');

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

      table.style.visibility = 'visible';
    } catch (e) {
      console.error(e);
      alert('Nie znaleziono kraju o takiej stolicy.');
    }
  });
});


button2.addEventListener('click', () => {

});


button3.addEventListener('click', () => answer.textContent = '3');