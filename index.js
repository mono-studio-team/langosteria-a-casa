import flatpickr from 'flatpickr';
import { Italian } from 'flatpickr/dist/l10n/it.js';
const { addDays, format } = require('date-fns');
const { default: itLocalize } = require('date-fns/locale/it');
require('flatpickr/dist/themes/airbnb.css');

flatpickr('.flatpickr', { locale: Italian, wrap: true });

const condaDocId = 'iOgTgYXs5x';

const condaTableIds = {
  settingsServices: 'grid-a1_7s2luxz',
  settingsCaps: 'grid-PjdOUMts6h',
  calendarAvailabilities: 'grid-50DT1drYMb',
};

const codaViewIds = {
  next3days: 'table-gzB6L_u3ML',
};

const filterPickups = (i) => i.nome.startsWith('Pickup');
const filterDeliveries = (i) => i.nome.startsWith('Delivery');

const updateButtonLabel = (selector, text) =>
  (document.querySelector(selector).textContent = text);

const main = async () => {
  const { axiosInstance } = await import('./useAxios');

  const { coda } = await import('./useCoda');

  const { getTableData, getViewData } = coda(axiosInstance);

  const servicesObj = await getTableData({
    docId: condaDocId,
    tableIdOrName: condaTableIds.settingsServices,
  });
  const pickups = servicesObj.filter(filterPickups);
  const deliveries = servicesObj.filter(filterDeliveries);
  const capsObj = await getTableData({
    docId: condaDocId,
    tableIdOrName: condaTableIds.settingsCaps,
  });
  const caps = capsObj.map((i) => i['cAP']);

  const availabilities = await getTableData({
    docId: condaDocId,
    tableIdOrName: condaTableIds.calendarAvailabilities,
  });

  const next3Days = await getViewData({
    docId: condaDocId,
    viewIdOrName: codaViewIds.next3days,
  });

  console.log('pickups', pickups);
  console.log('deliveries', deliveries);
  console.log('caps', caps);
  console.log('availabilities', availabilities);
  console.log('next3Days', next3Days);

  const day1Text = format(addDays(new Date(), 0), 'EEEE d', {
    locale: itLocalize,
  });
  updateButtonLabel('#day1', day1Text);

  const day2Text = format(addDays(new Date(), 1), 'EEEE d', {
    locale: itLocalize,
  });
  updateButtonLabel('#day2', day2Text);

  const day3Text = format(addDays(new Date(), 2), 'EEEE d', {
    locale: itLocalize,
  });
  updateButtonLabel('#day3', day3Text);

  let currentRadioOption = '';
  const radios = [...document.querySelectorAll('input[name=choice]')];
  radios.forEach(
    (radio) => (radio.onchange = () => (currentRadioOption = radio.value))
  );
};

main();
