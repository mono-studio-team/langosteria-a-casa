import flatpickr from 'flatpickr';
import { Italian } from 'flatpickr/dist/l10n/it.js';
const { addDays, format, isToday, isAfter } = require('date-fns');
const { default: itLocalize } = require('date-fns/locale/it');
require('flatpickr/dist/themes/airbnb.css');
// require('./useMaps');

console.log('>>langosteria@1.99990<<');
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
// const $FAKE_NOTES_TEXTAREA = '#fake-notes';
const $NOTES_TEXTAREA = 'textarea[name=note]';
const $FAKE_NOTES = '#fakenotes';
const $CLASS_SELECTED = 'selected';
const $CLASS_DISABLED = 'disabled';

let state = {
  availabilities: [],
  mode: 'delivery',
  date: null,
  time: null,
  // notes: '',
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

const updateNotes = (notes) => {
  const { mode, date, time } = state;
  const dataString = JSON.stringify({ mode, date, time, notes });
  document.querySelector($NOTES_TEXTAREA).value = dataString;

  // const nextState = { ...state, notes };
  // state = nextState;
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
      el.disabled = !(
        availability.d1Availability || availability.d2Availability
      );
    } else {
      el.disabled = !(
        availability.p1Availability || availability.p2Availability
      );
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
    if (mode === 'delivery' && (curr.d1Availability || curr.d2Availability)) {
      return [curr.dateFlatpickr, ...res];
    } else if (
      mode === 'pickup' &&
      (curr.p1Availability || curr.p2Availability)
    ) {
      return [curr.dateFlatpickr, ...res];
    }
    return res;
  }, []);

  const fp = document.querySelector($CALENDAR)._flatpickr;
  if (fp && fp.destroy) {
    fp.destroy();

    flatpickr($CALENDAR, {
      locale: Italian,
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
        el.dataset.timeslot === '1'
          ? !selectedAvailability.d1Availability
          : !selectedAvailability.d2Availability;
    } else {
      el.disabled =
        el.dataset.timeslot === '2'
          ? !selectedAvailability.p1Availability
          : !selectedAvailability.p2Availability;
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

const setupCheckoutButton = () => {
  document.querySelector($CHECKOUT_BUTTON).onclick = () => {
    const { mode, date, time, notes } = state;
    const dataString = JSON.stringify({ mode, date, time, notes });
    document.querySelector($NOTES_TEXTAREA).value = dataString;
  };
};

const setupNotesListener = () => {
  document.querySelector($NOTES_TEXTAREA).onkeydown = () =>
    updateNotes(document.querySelector($NOTES_TEXTAREA).value);
  document.querySelector($NOTES_TEXTAREA).onchange = () =>
    updateNotes(document.querySelector($NOTES_TEXTAREA).value);
};

const setupFakeNotes = () => {
  const realNotes = document.querySelector($NOTES_TEXTAREA);
  // clone = realNotes.cloneNode(true); // true means clone all childNodes and all event handlers
  clone = realNotes.cloneNode(false);
  clone.id = 'fakenotes';
  realNotes.parentElement.appendChild(clone);
  realNotes.style.display = 'none';

  document.querySelector($FAKE_NOTES).onkeydown = () =>
    updateNotes(document.querySelector($FAKE_NOTES).value);
  document.querySelector($FAKE_NOTES).onchange = () =>
    updateNotes(document.querySelector($FAKE_NOTES).value);
};

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
  let checkExist = setInterval(function () {
    if (timerCounter > 10) {
      clearInterval(checkExist);
    }
    timerCounter += 1;
    if (document.querySelector($CALENDAR)) {
      clearInterval(checkExist);
      flatpickr(calendarEl, {
        locale: Italian,
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
  setInterval(
    (function (updSt) {
      return function () {
        const radios = document.querySelectorAll($MODE_RADIO);
        if (radios[0].dataset.mode) return;
        radios[0].setAttribute('data-mode', 'delivery');
        radios[1].setAttribute('data-mode', 'pickup');

        const currentMode = document.querySelector(
          'input[name=shipping-method-choice]:checked'
        ).dataset.mode;
        updSt([{ type: 'mode', payload: currentMode }]);

        radios.forEach(
          (el) =>
            (el.onchange = () => {
              updSt([
                { type: 'mode', payload: el.dataset.mode },
                { type: 'date', payload: null },
                { type: 'time', payload: null },
              ]);
            })
        );
      };
    })(updateState),
    1000
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
  setupFakeNotes();
  // setupNotesListener();
  // setupCheckoutButton();
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
