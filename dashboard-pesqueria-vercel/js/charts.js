const Charts = (() => {
  const instances = {};
  const palette = ['#1a73e8','#34a853','#ea4335','#fbbc04','#9c27b0','#ff6d00','#00897b','#e91e63','#3f51b5','#00bcd4','#cddc39','#ffc107','#673ab7','#03a9f4','#ff5722'];

  Chart.defaults.font.family = 'Inter';
  Chart.defaults.font.size = 11;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.plugins.legend.labels.boxWidth = 12;
  Chart.defaults.plugins.legend.labels.padding = 12;

  function destroy(id) {
    if (instances[id]) {
      instances[id].destroy();
      delete instances[id];
    }
  }

  function colors(n) {
    return Array.from({ length: n }, (_, i) => palette[i % palette.length]);
  }

  function doughnut(id, labels, data) {
    destroy(id);
    instances[id] = new Chart(document.getElementById(id), {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors(data.length), borderWidth: 0, hoverOffset: 8 }] },
      options: {
        cutout: '58%',
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: c => `${c.label}: ${Utils.fmt(c.raw)}` } }
        }
      }
    });
  }

  function bar(id, labels, data, horizontal = false) {
    destroy(id);
    instances[id] = new Chart(document.getElementById(id), {
      type: 'bar',
      data: { labels, datasets: [{ data, backgroundColor: colors(data.length), borderRadius: 6 }] },
      options: {
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => Utils.fmt(c.raw) } } },
        scales: {
          x: { grid: { display: horizontal ? true : false }, ticks: { callback: v => horizontal ? Utils.fmt(v) : this?.getLabelForValue?.(v) ?? v } },
          y: { grid: { display: horizontal ? false : true }, ticks: { callback: v => horizontal ? this?.getLabelForValue?.(v) ?? v : Utils.fmt(v) } }
        }
      }
    });
  }

  function stackedBar(id, labels, series) {
    destroy(id);
    instances[id] = new Chart(document.getElementById(id), {
      type: 'bar',
      data: {
        labels,
        datasets: series.map((s, i) => ({
          label: s.label,
          data: s.data,
          backgroundColor: palette[i % palette.length],
          borderRadius: 4
        }))
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, ticks: { callback: v => Utils.fmt(v) } }
        }
      }
    });
  }

  function line(id, labels, data) {
    destroy(id);
    instances[id] = new Chart(document.getElementById(id), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor: '#1a73e8',
          backgroundColor: 'rgba(26,115,232,.14)',
          fill: true,
          tension: .35,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: v => Utils.fmt(v) } } }
      }
    });
  }

  function clearAll() {
    Object.keys(instances).forEach(destroy);
  }

  return { doughnut, bar, stackedBar, line, clearAll };
})();