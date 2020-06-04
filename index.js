import axios from 'axios';
import flatpickr from 'flatpickr';
import { Italian } from 'flatpickr/dist/l10n/it.js';
require('flatpickr/dist/themes/airbnb.css');

axios
  .get('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
  })
  .then(({ data }) => {
    document.querySelector('#day1').textContent = data.joke;
    console.log(data.joke);
  });

flatpickr('#calendar', { locale: Italian });
