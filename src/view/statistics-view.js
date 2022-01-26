import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';

const BAR_HEIGHT = 90;

const getAllUniqTypes = (points) => {
  let allTypes = [];

  points.forEach((element) => {
    allTypes.push(element.type);
  });

  allTypes = [...new Set(allTypes)];

  return allTypes;
};

const getPriceType = (typePoint, points) => {
  let price = 0;
  points.forEach((point) => {
    if (point.type === typePoint) {
      price += point.price;
    }
  });

  return price;
};

const renderMoneyChart = (moneyCtx, points) => {
  moneyCtx.height = BAR_HEIGHT * 5;
  const alllUniqTypes = getAllUniqTypes(points);
  const priceType = alllUniqTypes.map((type) => getPriceType(type, points));

  const moneyChart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: alllUniqTypes,
      datasets: [{
        data: priceType,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return moneyChart;
};

const getCountType = (type, points) => points.filter((point) => point.type === type).length;

const renderTypeChart = (typeCtx, points) => {
  typeCtx.height = BAR_HEIGHT * 5;
  const alllUniqTypes = getAllUniqTypes(points);
  const countTypes = alllUniqTypes.map((type) => getCountType(type, points));

  const typeChart = new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: alllUniqTypes,
      datasets: [{
        data: countTypes,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return typeChart;
};

const getDurationEachType = (type, points) => {
  let allDuration = 0;
  const durationPoints = [];
  points.forEach((point) => {
    if (point.type === type) {
      const durationPoint = dayjs(dayjs(point.dateEnd).diff(dayjs(point.dateStart)));
      durationPoints.push(durationPoint);
    }
  });
  allDuration = dayjs(durationPoints.reduce((prevDate, currentDate) => prevDate + currentDate));

  return allDuration;
};

const renderTimeChart = (timeCtx, points) => {
  timeCtx.height = BAR_HEIGHT * 5;
  const alllUniqTypes = getAllUniqTypes(points);
  const durationEachType = alllUniqTypes.map((type) => getDurationEachType(type, points));

  const timeChart = new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: alllUniqTypes,
      datasets: [{
        data: durationEachType,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val.format('DD[D] HH[H] mm[M]')}`,
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return timeChart;
};

const createStatistics = () => (
  `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="money" width="900">1</canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="type" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="time" width="900"></canvas>
  </div>
</section>`
);

class StatisticsView extends SmartView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this.#setCharts();
  }

  get template () {
    return createStatistics();
  }

  #setCharts = () => {
    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');

    this._moneyChart = renderMoneyChart(moneyCtx, this.#points);
    this._typeChart = renderTypeChart(typeCtx, this.#points);
    this._timeChart = renderTimeChart(timeCtx, this.#points);
  }
}

export {StatisticsView as default};
