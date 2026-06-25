const Api = (() => {
  async function call(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set('action', action);
    url.searchParams.set('key', CONFIG.API_KEY);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
  }

  async function analyze(moduleConfig) {
    return call('analyze', {
      sheet: moduleConfig.sheet,
      columns: moduleConfig.columns || ''
    });
  }

  async function readPage(moduleConfig, page = 1) {
    const data = await call('read', {
      sheet: moduleConfig.sheet,
      columns: moduleConfig.columns || '',
      limit: CONFIG.PAGE_SIZE,
      page
    });
    if (!data.success) throw new Error(data.error || `Error leyendo ${moduleConfig.sheet}`);
    return {
      rows: (data.data || []).map(row => ({ ...row, _sheet: moduleConfig.sheet })),
      totalPages: Number(data.total_pages || 1),
      total: Number(data.total || data.count || 0),
      page
    };
  }

  return { call, analyze, readPage };
})();