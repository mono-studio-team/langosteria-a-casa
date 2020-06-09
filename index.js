import flatpickr from 'flatpickr';
import { Italian } from 'flatpickr/dist/l10n/it.js';
const { addDays, format, isToday, isAfter } = require('date-fns');
const { default: itLocalize } = require('date-fns/locale/it');
require('flatpickr/dist/themes/airbnb.css');
// require('./useMaps');

console.log('>>langosteria@1.994<<');
let intervalId;

const condaDocId = 'iOgTgYXs5x';

const condaTableIds = {
  settingsServices: 'grid-a1_7s2luxz',
  settingsCaps: 'grid-PjdOUMts6h',
  settingsAddresses: 'grid-rp5_HDm90K',
  calendarAvailabilities: 'grid-50DT1drYMb',
};

// const codaViewIds = {
//   next3days: 'table-gzB6L_u3ML',
// };

// const filterPickups = (i) => i.nome.startsWith('Pickup');
// const filterDeliveries = (i) => i.nome.startsWith('Delivery');

const $MODE_RADIO = 'input[name=shipping-method-choice]';
const $DATE_BUTTONS = '.date-btn';
const $TIME_BUTTONS = '.time-btn';
const $CALENDAR_DIV = '#calendar-div';
const $CALENDAR = '#calendar';
const $CHECKOUT_BUTTON = '#btn-checkout';
const $FAKE_NOTES_TEXTAREA = '#fake-notes';
const $REAL_NOTES_TEXTAREA = 'textarea[name=note]';
const $CLASS_SELECTED = 'selected';
const $CLASS_DISABLED = 'disabled';

let fp;
let state = {
  availabilities: [],
  mode: 'delivery',
  date: null,
  time: null,
  notes: '',
};

const updateState = (actions) => {
  let nextState;
  actions.forEach(({ type, payload }) => {
    nextState = { ...state, ...nextState, [type]: payload };
  });

  const statelog = {
    mode: nextState.mode,
    date: nextState.date,
    time: nextState.time,
  };
  console.log(JSON.stringify(statelog, null, 2));
  updateDateButtons(nextState);
  updateCalendar(nextState);
  updateTimeButtons(nextState);
  updateCheckoutButton(nextState);
  state = nextState;
};

const updateDateButtons = ({ availabilities, mode, date }) => {
  const selectedAvailability = availabilities.find(
    (a) => a.dateFlatpickr === date
  );

  document.querySelectorAll($DATE_BUTTONS).forEach((el) => {
    // update enable/disable
    const availability = availabilities.find(
      (a) => a.dateFlatpickr === el.dataset.date
    );

    el.classList.remove($CLASS_SELECTED);
    el.classList.remove($CLASS_DISABLED);

    if (!date) {
      // do nothing
    } else if (mode === 'delivery') {
      el.disabled = !(availability.delivery1Cap || availability.delivery2Cap);
    } else {
      el.disabled = !(availability.delivery1Cap || availability.delivery2Cap);
    }

    if (el.disabled) {
      el.classList.add($CLASS_DISABLED);
    }

    // update selected css
    if (!date) {
      el.classList.remove($CLASS_SELECTED);
    } else if (el.dataset.date === selectedAvailability.dateFlatpickr) {
      el.classList.add($CLASS_SELECTED);
    } else {
      el.classList.remove($CLASS_SELECTED);
    }
  });
};

const updateCalendar = ({ availabilities, mode }) => {
  const enable = availabilities.reduce((res, curr) => {
    if (mode === 'delivery' && (curr.delivery1Cap || curr.delivery2Cap)) {
      return [curr.dateFlatpickr, ...res];
    } else if (mode === 'pickup' && (curr.pickup1Cap || curr.pickup2Cap)) {
      return [curr.dateFlatpickr, ...res];
    }
    return res;
  }, []);

  if (fp && fp.destroy) {
    fp.destroy();

    fp = flatpickr($CALENDAR, {
      locale: Italian,
      wrap: true,
      enable,
      onChange: (selectedDates, dateStr) =>
        updateState([
          { type: 'date', payload: dateStr },
          { type: 'time', payload: null },
        ]),
    });
  }
};

const updateTimeButtons = ({ availabilities, mode, date, time }) => {
  const selectedAvailability = availabilities.find(
    (a) => a.dateFlatpickr === date
  );

  document.querySelectorAll($TIME_BUTTONS).forEach((el) => {
    // update enabled/disabled
    if (!date) {
      // do nothing
    } else if (mode === 'delivery') {
      el.disabled =
        el.dataset.timeslot === 1
          ? !selectedAvailability.delivery1Cap
          : !selectedAvailability.delivery2Cap;
    } else {
      el.disabled =
        el.dataset.timeslot === 2
          ? !selectedAvailability.pickup1Cap
          : !selectedAvailability.pickup2Cap;
    }

    el.classList.remove($CLASS_SELECTED);
    el.classList.remove($CLASS_DISABLED);

    if (el.disabled) {
      el.classList.add($CLASS_DISABLED);
    }

    // update selected css
    if (!time) {
      el.classList.remove($CLASS_SELECTED);
    } else if (el.dataset.timeslot === time) {
      el.classList.add($CLASS_SELECTED);
    } else {
      el.classList.remove($CLASS_SELECTED);
    }
  });
};

const updateCheckoutButton = ({ mode, date, time }) => {
  const isOk = mode && date && time;
  document.querySelector($CHECKOUT_BUTTON).disabled = !isOk;
  if (isOk) {
    document.querySelector($CHECKOUT_BUTTON).classList.remove($CLASS_DISABLED);
  } else {
    document.querySelector($CHECKOUT_BUTTON).classList.add($CLASS_DISABLED);
  }
};

const setupCheckoutButton = () =>
  (document.querySelector($CHECKOUT_BUTTON).onclick = () => {
    const { mode, date, time } = state;
    const notes = document.querySelector($FAKE_NOTES_TEXTAREA).value;

    const dataString = JSON.stringify({ mode, date, time, notes }, null, 2);
    document.querySelector($REAL_NOTES_TEXTAREA).value = dataString;
    console.log(dataString);
  });

const setupTimeButtons = () => {
  document
    .querySelectorAll($TIME_BUTTONS)
    .forEach(
      (el) =>
        (el.onclick = () =>
          updateState([{ type: 'time', payload: el.dataset.timeslot }]))
    );
};

const setupCalendar = () => {
  const calendarEl = document.createElement('input');
  calendarEl.id = 'calendar';
  calendarEl.classList.add('text-block-2');
  calendarEl.type = 'text';
  calendarEl.placeholder = 'Calendario';
  calendarEl.setAttribute('data-input', '');

  document.querySelector($CALENDAR_DIV).appendChild(calendarEl);
  // document.querySelector($CALENDAR_DIV).innerHTML =
  //   '<input id="calendar" class="text-block-2" type="text" placeholder="Calendario" data-input>';

  // `<input type="text" class="text-block-2" placeholder="Calendario" data-input>
  // <button class="input-button button options w-button" title="toggle" data-toggle>...</button>`;

  // fp = flatpickr(calendarEl, {
  //   locale: Italian,
  //   wrap: true,
  //   enable: ['1900-1-1'],
  // });

  let timerCounter = 0;
  let checkExist = setInterval(() => {
    if (timerCounter > 10) {
      clearInterval(checkExist);
    }
    timerCounter += 1;
    if (document.querySelector($CALENDAR).length) {
      clearInterval(checkExist);
      fp = flatpickr(calendarEl, {
        locale: Italian,
        wrap: true,
        enable: ['1900-1-1'],
      });
    }
  }, 100);
};

const setupDateButtons = () => {
  document.querySelectorAll($DATE_BUTTONS).forEach((el) => {
    const btnDate = addDays(new Date(), +el.dataset.adddays);

    // set data-date attribute
    const attributeValue = format(btnDate, 'yyyy-MM-dd', {
      locale: itLocalize,
    });
    el.setAttribute('data-date', attributeValue);

    // set label text
    el.textContent = format(btnDate, 'EEEE d', {
      locale: itLocalize,
    });
  });

  document.querySelectorAll($DATE_BUTTONS).forEach(
    (el) =>
      (el.onclick = () =>
        updateState([
          { type: 'date', payload: el.dataset.date },
          { type: 'time', payload: null },
        ]))
  );
};

const setupModeRadios = () => {
  const radios = document.querySelectorAll($MODE_RADIO);
  radios[0].setAttribute('data-mode', 'delivery');
  radios[1].setAttribute('data-mode', 'pickup');

  radios.forEach(
    (el) =>
      (el.onchange = () => {
        updateState([
          { type: 'mode', payload: el.dataset.value },
          { type: 'date', payload: null },
          { type: 'time', payload: null },
        ]);
      })
  );
};

const load = async () => {
  clearInterval(intervalId);
  setupCalendar();

  const { axiosInstance } = await import('./useAxios');
  const { coda } = await import('./useCoda');
  const { getTableData, getViewData } = coda(axiosInstance);

  // GET DATA FROM CODA
  // const servicesObj = await getTableData({
  //   docId: condaDocId,
  //   tableIdOrName: condaTableIds.settingsServices,
  // });
  // const pickups = servicesObj.filter(filterPickups);
  // const deliveries = servicesObj.filter(filterDeliveries);

  // const next3Days = await getViewData({
  //   docId: condaDocId,
  //   viewIdOrName: codaViewIds.next3days,
  // });

  const addresses = await getTableData({
    docId: condaDocId,
    tableIdOrName: condaTableIds.settingsAddresses,
  });

  const availabilities = await getTableData({
    docId: condaDocId,
    tableIdOrName: condaTableIds.calendarAvailabilities,
  });

  const nextAvailabilities = availabilities.filter(
    (a) =>
      isToday(new Date(a.dateFlatpickr)) ||
      isAfter(new Date(a.dateFlatpickr), new Date())
  );

  updateState([{ type: 'availabilities', payload: nextAvailabilities }]);

  // console.log('pickups', pickups);
  // console.log('deliveries', deliveries);
  // console.log('availabilities', availabilities);
  // console.log('next3Days', next3Days);
  //|-> end of GET DATA FROM CODA

  setupModeRadios();
  setupDateButtons();
  setupTimeButtons();
  setupCheckoutButton();
};

intervalId = setInterval(function () {
  console.log('search for radios...');
  if (!!document.querySelector($MODE_RADIO)) {
    console.log('radios found!');
    load();
  }
}, 1000);

// const routeStreetNumber = document.querySelector('#route_street_number');

// if (!routeStreetNumber.value) {
//   routeStreetNumber.onkeydown = (e) => {
//     console.log('checking', routeStreetNumber.value);
//     if (routeStreetNumber.value !== '') {
//       load();
//       routeStreetNumber.onkeydown = null;
//     }
//   };
// }
