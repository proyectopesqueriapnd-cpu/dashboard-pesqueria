const Modules = (() => {
  const fields = {
    general: {
      planta: ['Planta'],
      area: ['Area', 'Área'],
      linea: ['Línea', 'Linea'],
      localizacion: ['Localizacion', 'Localización'],
      statusPT: ['Status PT', 'Estatus PT'],
      ejecutantePT: ['Ejecutante / PT', 'Ejecutante PT', 'Ejecutante/PT'],
      fechaPT: ['Fecha / PT', 'Fecha PT', 'Fecha/PT']
    },
    backlog: {
      ubicacion: ['UBICACIÓN', 'Ubicación', 'Ubicacion'],
      fluido: ['Fluido'],
      especificacion: ['Especificación', 'Especificacion'],
      pnd: ['% PND', '%PND'],
      totalProyecto: ['JUNTAS SW,LET TOTALES DE PROYECTO'],
      inspeccionadas: ['JUNTAS INSPECCIONADAS'],
      requeridas: ['JUNTAS REQUERIDAS'],
      backlog: ['BACKLOG']
    }
  };

  function filters(moduleId) {
    if (moduleId === 'general') {
      return [
        { id: 'planta', label: 'Planta', getter: r => Utils.getVal(r, fields.general.planta), all: 'Todas' },
        { id: 'area', label: 'Área', getter: r => Utils.getVal(r, fields.general.area), all: 'Todas' },
        { id: 'statusPT', label: 'Status PT', getter: r => Utils.getVal(r, fields.general.statusPT), all: 'Todos', format: Utils.statusLabel },
        { id: 'ejecutantePT', label: 'Ejecutante PT', getter: r => Utils.getVal(r, fields.general.ejecutantePT), all: 'Todos' }
      ];
    }

    return [
      { id: 'ubicacion', label: 'Ubicación', getter: r => Utils.getVal(r, fields.backlog.ubicacion), all: 'Todas' },
      { id: 'fluido', label: 'Fluido', getter: r => Utils.getVal(r, fields.backlog.fluido), all: 'Todos' },
      { id: 'especificacion', label: 'Especificación', getter: r => Utils.getVal(r, fields.backlog.especificacion), all: 'Todas' },
      { id: 'pnd', label: '% PND', getter: r => Utils.getVal(r, fields.backlog.pnd), all: 'Todos' }
    ];
  }

  function kpis(moduleId, rows, meta) {
    if (moduleId === 'general') {
      const total = rows.length;
      const plantas = Utils.countBy(rows, r => Utils.getVal(r, fields.general.planta)).length;
      const areas = Utils.countBy(rows, r => Utils.getVal(r, fields.general.area)).length;
      const ejecutantes = Utils.countBy(rows, r => Utils.getVal(r, fields.general.ejecutantePT)).length;
      const status = Utils.countBy(rows, r => Utils.getVal(r, fields.general.statusPT));
      const aprobadas = status.filter(d => Utils.statusClass(d.value) === 'status-a').reduce((s, d) => s + d.count, 0);
      const pendientes = status.filter(d => Utils.statusClass(d.value) === 'status-p').reduce((s, d) => s + d.count, 0);

      return [
        { label: 'Total visible', value: Utils.fmt(total), sub: `${meta.loadedText}`, icon: 'database' },
        { label: 'PT Aprobadas', value: Utils.fmt(aprobadas), sub: `${Utils.pct(aprobadas, total)}%`, icon: 'check-circle' },
        { label: 'PT Pendientes', value: Utils.fmt(pendientes), sub: `${Utils.pct(pendientes, total)}%`, icon: 'alert-triangle' },
        { label: 'Áreas', value: Utils.fmt(areas), sub: `${plantas} plantas`, icon: 'map' },
        { label: 'Ejecutantes', value: Utils.fmt(ejecutantes), sub: 'Ejecutante / PT', icon: 'users' }
      ];
    }

    const totalProyecto = Utils.sumBy(rows, r => Utils.getVal(r, fields.backlog.totalProyecto));
    const inspeccionadas = Utils.sumBy(rows, r => Utils.getVal(r, fields.backlog.inspeccionadas));
    const requeridas = Utils.sumBy(rows, r => Utils.getVal(r, fields.backlog.requeridas));
    const backlog = Utils.sumBy(rows, r => Utils.getVal(r, fields.backlog.backlog));
    const avance = requeridas ? Utils.pct(inspeccionadas, requeridas) : Utils.pct(inspeccionadas, totalProyecto);

    return [
      { label: 'Juntas proyecto', value: Utils.fmt(totalProyecto), sub: `${Utils.fmt(rows.length)} líneas`, icon: 'database' },
      { label: 'Inspeccionadas', value: Utils.fmt(inspeccionadas), sub: `${avance}% avance`, icon: 'check-circle' },
      { label: 'Requeridas', value: Utils.fmt(requeridas), sub: 'Según % PND', icon: 'target' },
      { label: 'Backlog', value: Utils.fmt(backlog), sub: 'Pendiente', icon: 'alert-triangle' },
      { label: 'Ubicaciones', value: Utils.fmt(Utils.countBy(rows, r => Utils.getVal(r, fields.backlog.ubicacion)).length), sub: 'Backlog PT', icon: 'map' }
    ];
  }

  function chartCards(moduleId) {
    if (moduleId === 'general') {
      return [
        { id: 'status', title: 'Distribución Status PT', sub: 'Aprobado, pendiente y otros', type: 'compact' },
        { id: 'statusPlanta', title: 'Status PT por Planta', sub: 'Comparativo apilado', type: '' },
        { id: 'planta', title: 'Registros por Planta', sub: 'Distribución general', type: '' },
        { id: 'areas', title: 'Top Áreas', sub: 'Áreas con más registros', type: 'compact' },
        { id: 'ejecutantes', title: 'Top Ejecutantes PT', sub: 'Ranking de ejecutantes', type: '' },
        { id: 'fechas', title: 'Tendencia por Fecha PT', sub: 'Últimas fechas con datos', type: 'full tall' }
      ];
    }

    return [
      { id: 'ubicacion', title: 'Backlog por Ubicación', sub: 'Ranking de ubicación', type: '' },
      { id: 'fluido', title: 'Backlog por Fluido', sub: 'Distribución por fluido', type: 'compact' },
      { id: 'especificacion', title: 'Backlog por Especificación', sub: 'Top especificaciones', type: '' },
      { id: 'avance', title: 'Proyecto vs Inspeccionado vs Backlog', sub: 'Totales globales', type: 'compact' },
      { id: 'pnd', title: '% PND', sub: 'Distribución de requerimiento', type: 'compact' },
      { id: 'rankingBacklog', title: 'Ranking de Backlog', sub: 'Mayor pendiente', type: 'full tall' }
    ];
  }

  function renderCharts(moduleId, rows) {
    if (moduleId === 'general') {
      const status = Utils.countBy(rows, r => Utils.getVal(r, fields.general.statusPT));
      Charts.doughnut('chart-status', status.map(d => Utils.statusLabel(d.value)), status.map(d => d.count));

      const plantas = Utils.countBy(rows, r => Utils.getVal(r, fields.general.planta)).slice(0, 10).map(d => d.value);
      const statuses = status.slice(0, 5).map(d => d.value);
      Charts.stackedBar('chart-statusPlanta', plantas, statuses.map(s => ({
        label: Utils.statusLabel(s),
        data: plantas.map(p => rows.filter(r =>
          String(Utils.getVal(r, fields.general.planta)) === p &&
          String(Utils.getVal(r, fields.general.statusPT)) === s
        ).length)
      })));

      const plantaDist = Utils.countBy(rows, r => Utils.getVal(r, fields.general.planta));
      Charts.bar('chart-planta', plantaDist.map(d => d.value), plantaDist.map(d => d.count));

      const areaDist = Utils.countBy(rows, r => Utils.getVal(r, fields.general.area)).slice(0, 15);
      Charts.doughnut('chart-areas', areaDist.map(d => d.value), areaDist.map(d => d.count));

      const ejecutantes = Utils.countBy(rows, r => Utils.getVal(r, fields.general.ejecutantePT)).slice(0, 15);
      Charts.bar('chart-ejecutantes', ejecutantes.map(d => Utils.short(d.value, 22)), ejecutantes.map(d => d.count), true);

      const fechas = Utils.countBy(rows, r => Utils.getVal(r, fields.general.fechaPT)).sort(Utils.dateSort).slice(-60);
      Charts.line('chart-fechas', fechas.map(d => d.value), fechas.map(d => d.count));
      return;
    }

    const byUbicacion = Utils.countBy(rows, r => Utils.getVal(r, fields.backlog.ubicacion)).slice(0, 15);
    Charts.bar('chart-ubicacion', byUbicacion.map(d => Utils.short(d.value, 24)), byUbicacion.map(d => d.count), true);

    const byFluido = Utils.countBy(rows, r => Utils.getVal(r, fields.backlog.fluido)).slice(0, 12);
    Charts.doughnut('chart-fluido', byFluido.map(d => d.value), byFluido.map(d => d.count));

    const byEsp = Utils.countBy(rows, r => Utils.getVal(r, fields.backlog.especificacion)).slice(0, 15);
    Charts.bar('chart-especificacion', byEsp.map(d => Utils.short(d.value, 24)), byEsp.map(d => d.count), true);

    const totalProyecto = Utils.sumBy(rows, r => Utils.getVal(r, fields.backlog.totalProyecto));
    const inspeccionadas = Utils.sumBy(rows, r => Utils.getVal(r, fields.backlog.inspeccionadas));
    const requeridas = Utils.sumBy(rows, r => Utils.getVal(r, fields.backlog.requeridas));
    const backlog = Utils.sumBy(rows, r => Utils.getVal(r, fields.backlog.backlog));
    Charts.doughnut('chart-avance', ['Inspeccionadas', 'Backlog', 'Resto proyecto'], [
      inspeccionadas,
      backlog,
      Math.max(0, totalProyecto - inspeccionadas - backlog)
    ]);

    const byPnd = Utils.countBy(rows, r => Utils.getVal(r, fields.backlog.pnd)).slice(0, 10);
    Charts.doughnut('chart-pnd', byPnd.map(d => d.value), byPnd.map(d => d.count));

    const ranking = rows
      .map(r => ({
        label: `${Utils.getVal(r, fields.backlog.ubicacion)} · ${Utils.getVal(r, fields.backlog.fluido)} · ${Utils.getVal(r, fields.backlog.especificacion)}`,
        value: Number(Utils.getVal(r, fields.backlog.backlog) || 0)
      }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 25);
    Charts.bar('chart-rankingBacklog', ranking.map(d => Utils.short(d.label, 36)), ranking.map(d => d.value), true);
  }

  function tableColumns(moduleId, rows) {
    const first = rows[0] || {};
    if (moduleId === 'general') {
      const preferred = ['Planta', 'Area', 'Área', 'Localizacion', 'Localización', 'Línea', 'Linea', 'Junta', 'Status PT', 'Ejecutante / PT', 'Fecha / PT'];
      return preferred.filter(c => Object.keys(first).some(k => Utils.norm(k) === Utils.norm(c))).slice(0, 10);
    }
    const preferred = ['UBICACIÓN', 'Fluido', 'Especificación', '% PND', 'JUNTAS SW,LET TOTALES DE PROYECTO', 'JUNTAS INSPECCIONADAS', 'JUNTAS REQUERIDAS', 'BACKLOG'];
    return preferred.filter(c => Object.keys(first).some(k => Utils.norm(k) === Utils.norm(c))).slice(0, 10);
  }

  return { fields, filters, kpis, chartCards, renderCharts, tableColumns };
})();