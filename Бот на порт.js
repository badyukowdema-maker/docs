// ============================================================
//  ПОРТОВЫЙ БОТ + АВТОКЛИКЕР + РАСШИРЕННОЕ GUI
//  F6 - Вкл/Выкл защиту от админов | F7 - старт/стоп | F8 - запись маршрута | F9 - ТП | F10 - точка | F12 - выгрузка
// ============================================================

// ══════════════════════════════════════════════════════════════
//  GUI (взято из stroka_upd, адаптировано под порт)
// ══════════════════════════════════════════════════════════════

var guiBrowser = null;

var guiHTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{background:transparent;overflow:hidden;font-family:'Segoe UI',sans-serif;user-select:none;}
#panel{position:absolute;left:15px;top:15px;width:340px;
  background:linear-gradient(160deg,rgba(15,15,25,0.95),rgba(8,8,18,0.97));
  border-radius:12px;border:1px solid rgba(255,255,255,0.08);
  box-shadow:0 8px 32px rgba(0,0,0,0.6);overflow:hidden;cursor:move;}
.title{background:linear-gradient(90deg,rgba(0,180,80,0.25),rgba(80,0,200,0.25));
  padding:9px 12px;font-size:11px;font-weight:700;text-transform:uppercase;
  letter-spacing:1.5px;color:#fff;border-bottom:1px solid rgba(255,255,255,0.07);text-align:center;}
.tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.06);}
.tab{flex:1;padding:7px 4px;font-size:9px;font-weight:700;text-align:center;
  color:rgba(255,255,255,0.35);cursor:pointer;letter-spacing:.5px;text-transform:uppercase;
  transition:all .2s;border-bottom:2px solid transparent;}
.tab.active{color:#fff;border-bottom:2px solid #a78bfa;}
.tab:hover{color:rgba(255,255,255,0.7);}
.page{display:none;padding:10px 12px;}.page.active{display:block;}
.row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
.row:last-child{margin-bottom:0;}
.lbl{font-size:10px;color:rgba(255,255,255,0.45);font-weight:600;text-transform:uppercase;letter-spacing:.4px;}
.val{font-size:11px;font-weight:700;color:#fff;text-align:right;
  background:rgba(255,255,255,0.07);padding:2px 8px;border-radius:5px;
  max-width:155px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.val.green{background:rgba(0,220,80,0.2);color:#00ff55;}
.val.blue{background:rgba(0,120,255,0.2);color:#4db8ff;}
.val.yellow{background:rgba(255,200,0,0.15);color:#ffe066;}
.val.red{background:rgba(255,50,50,0.2);color:#ff6666;}
.val.orange{background:rgba(255,140,0,0.2);color:#ffaa33;}
.val.purple{background:rgba(167,139,250,0.15);color:#a78bfa;}
.divider{height:1px;background:rgba(255,255,255,0.05);margin:6px 0;}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;}
.stat-cell{background:rgba(255,255,255,0.04);border-radius:7px;padding:7px 8px;text-align:center;}
.stat-cell .n{font-size:15px;font-weight:800;color:#00ff55;}
.stat-cell .l{font-size:8px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-top:2px;}
.inp-row{margin-bottom:8px;}
.inp-lbl{font-size:9px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px;}
input[type=number]{width:100%;background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.1);border-radius:5px;padding:5px 8px;color:#fff;font-size:11px;outline:none;}
select{width:100%;background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.1);border-radius:5px;padding:6px 8px;color:#fff;font-size:11px;outline:none;}
select option{background:#11121d;color:#fff;}
input:focus,select:focus{border-color:rgba(167,139,250,0.5);}
.btn-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;}
.ui-btn{width:100%;padding:7px 6px;border-radius:6px;text-align:center;cursor:pointer;
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
  color:#fff;font-size:10px;font-weight:700;box-sizing:border-box;}
.ui-btn.green{background:rgba(0,220,80,0.15);border-color:rgba(0,220,80,0.3);color:#00ff55;}
.ui-btn.red{background:rgba(255,50,50,0.15);border-color:rgba(255,50,50,0.3);color:#ff6666;}
.ui-btn.yellow{background:rgba(255,200,0,0.15);border-color:rgba(255,200,0,0.25);color:#ffe066;}
.ui-btn.purple{background:rgba(167,139,250,0.2);border-color:rgba(167,139,250,0.3);color:#a78bfa;}
.hint{font-size:9px;color:rgba(255,255,255,0.35);line-height:1.35;margin-top:5px;}
.route-list{max-height:145px;overflow-y:auto;margin-top:7px;padding-right:2px;}
.route-item{width:100%;padding:7px 8px;margin-bottom:5px;border-radius:6px;cursor:pointer;
  background:rgba(255,255,255,0.045);border:1px solid rgba(255,255,255,0.08);
  color:rgba(255,255,255,0.74);font-size:10px;font-weight:700;box-sizing:border-box;}
.route-item:hover{background:rgba(255,255,255,0.08);color:#fff;}
.route-item.active{background:rgba(0,120,255,0.18);border-color:rgba(77,184,255,0.45);color:#4db8ff;}
.route-item.recorded{border-color:rgba(255,200,0,0.18);}
.reset-btn{width:100%;margin-top:8px;padding:6px;background:rgba(255,50,50,0.15);
  border:1px solid rgba(255,50,50,0.2);color:#ff6666;font-size:10px;font-weight:700;
  border-radius:5px;cursor:pointer;text-align:center;letter-spacing:.5px;}
.reset-btn:hover{background:rgba(255,50,50,0.25);}
</style></head><body>
<div id="panel">
  <div class="title">⚓ ПОРТОВЫЙ БОТ v2.0</div>
  <div class="tabs">
    <div class="tab" onclick="showTab('routes',this)">Routes</div>
    <div class="tab active" onclick="showTab('info',this)">📊 Инфо</div>
    <div class="tab" onclick="showTab('stats',this)">📈 Стат</div>
    <div class="tab" onclick="showTab('settings',this)">⚙️ Настр</div>
  </div>

  <div id="page-info" class="page active">
    <div class="row"><span class="lbl">Статус бота</span><span id="status" class="val red">Стоит</span></div>
    <div class="row"><span class="lbl">Автокликер</span><span id="clicker" class="val red">Выкл</span></div>
    <div class="divider"></div>
    <div id="bot-btn" onclick="toggleBot()" style="width:100%;padding:8px;margin-bottom:6px;border-radius:7px;text-align:center;cursor:pointer;background:rgba(0,220,80,0.15);border:1px solid rgba(0,220,80,0.3);color:#00ff55;font-size:11px;font-weight:700;letter-spacing:.5px;box-sizing:border-box;">▶ ЗАПУСТИТЬ БОТА</div>
    <div class="divider"></div>
    <div class="row"><span class="lbl">Текущий маршрут</span><span id="route-name" class="val blue">—</span></div>
    <div class="row"><span class="lbl">Прогресс</span><span id="route-progress" class="val">—</span></div>
    <div class="divider"></div>
    <div class="row"><span class="lbl">Админы &lt;40м</span><span id="admin-count" class="val green">0</span></div>
    <div class="divider"></div>
    <div class="row"><span class="lbl">TGK</span><span class="val purple">t.me/leet_community</span></div>
  </div>

  <div id="page-routes" class="page">
    <div class="inp-row">
      <div class="inp-lbl">Delivery routes pool</div>
      <select id="route-select" onchange="selectRoute()">
        <option value="auto">Auto - by state</option>
      </select>
      <div id="route-list" class="route-list"></div>
      <div class="hint">Pickup is fixed. After pickup the bot randomly chooses a built-in or custom delivery route.</div>
    </div>
    <div class="row"><span class="lbl">Selected</span><span id="selected-route-name" class="val blue">For delete</span></div>
    <div class="row"><span class="lbl">Recorded</span><span id="recorded-route-count" class="val yellow">0</span></div>
    <div class="row"><span class="lbl">Mode</span><span id="route-reverse-status" class="val purple">Random</span></div>
    <div class="divider"></div>
    <div class="btn-grid">
      <div class="ui-btn green" onclick="toggleBot()">F7 Start/Stop</div>
      <div class="ui-btn purple" onclick="clearCustomRoutes()">Clear Custom</div>
      <div class="ui-btn yellow record-route-btn" onclick="toggleRouteRecord()">F8 New Delivery</div>
      <div class="ui-btn yellow" onclick="forceRoutePoint()">F10 Start/Point</div>
      <div class="ui-btn" onclick="refreshRoutes()">Refresh</div>
      <div class="ui-btn red" onclick="deleteSelectedRoute()">Delete</div>
    </div>
  </div>

  <div id="page-stats" class="page">
    <div class="stat-grid">
      <div class="stat-cell"><div class="n" id="s-pk">0</div><div class="l">Обезбол</div></div>
      <div class="stat-cell"><div class="n" id="s-earned" style="color:#ffe066;">$0</div><div class="l">Заработано</div></div>
      <div class="stat-cell"><div class="n" id="s-pkval" style="color:#a78bfa;">$0</div><div class="l">Цена обезбол</div></div>
      <div class="stat-cell"><div class="n" id="s-pkrate">0</div><div class="l">Обезбол / час</div></div>
    </div>
    <div class="divider"></div>
    <div class="row"><span class="lbl">Время сессии</span><span id="s-session" class="val blue">00:00:00</span></div>
    <div class="row"><span class="lbl">$ / час</span><span id="s-earnrate" class="val yellow">—</span></div>
    <div class="row"><span class="lbl">Шанс обезбола</span><span id="s-chance" class="val">—</span></div>
    <div class="divider"></div>
    <div class="reset-btn" onclick="resetStats()">🗑 Сбросить статистику</div>
  </div>

  <div id="page-settings" class="page">
    <div class="inp-row">
      <div class="inp-lbl">Цена 1 обезбола ($)</div>
      <input type="number" id="cfg-pkprice" value="2900" oninput="saveCfg()">
    </div>
    <div class="inp-row">
      <div class="inp-lbl">Стоп при админе</div>
      <div id="admin-toggle" onclick="toggleAdminStop()" style="width:100%;padding:6px;border-radius:6px;text-align:center;cursor:pointer;background:rgba(0,220,80,0.15);border:1px solid rgba(0,220,80,0.3);color:#00ff55;font-size:10px;font-weight:700;box-sizing:border-box;">✅ Включено</div>
    </div>
    <div class="divider"></div>
    <div class="inp-row">
      <div class="inp-lbl">Телепорт на старт</div>
      <div onclick="teleportToStart()" style="width:100%;padding:6px;border-radius:6px;text-align:center;cursor:pointer;background:rgba(167,139,250,0.2);border:1px solid rgba(167,139,250,0.3);color:#a78bfa;font-size:10px;font-weight:700;box-sizing:border-box;">📍 F9 - Телепорт</div>
    </div>
    <div class="inp-row">
      <div class="inp-lbl">Запись маршрута</div>
      <div class="record-route-btn" onclick="toggleRouteRecord()" style="width:100%;padding:6px;border-radius:6px;text-align:center;cursor:pointer;background:rgba(255,200,0,0.15);border:1px solid rgba(255,200,0,0.25);color:#ffe066;font-size:10px;font-weight:700;box-sizing:border-box;">⏺ F8 - Начать запись</div>
    </div>
  </div>
</div>
<script>
  var panel = document.getElementById('panel');
  var drag = false, ox, oy;
  panel.onmousedown = function(e) {
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'OPTION' || e.target.classList.contains('ui-btn') || e.target.classList.contains('route-item')) return;
    drag = true;
    ox = e.clientX - panel.getBoundingClientRect().left;
    oy = e.clientY - panel.getBoundingClientRect().top;
    e.preventDefault();
  };
  document.onmousemove = function(e) { if (drag) { panel.style.left = (e.clientX - ox) + 'px'; panel.style.top = (e.clientY - oy) + 'px'; } };
  document.onmouseup = function() { drag = false; };

  function showTab(t, el) {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('page-'+t).classList.add('active');
  }

  var settingsRecordBtn = document.querySelector('#page-settings .record-route-btn');
  if (settingsRecordBtn && settingsRecordBtn.parentNode) {
    settingsRecordBtn.parentNode.style.display = 'none';
  }

  var CFG = { pkprice: 2900 };
  var statsData = { pk: 0, startTime: Date.now() };
  var __persistLock = false;

  function persistCfg() {
    if (__persistLock) return;
    try { mp.trigger('gui:saveCfg', JSON.stringify(CFG)); } catch(e) {}
  }
  function persistStats() {
    if (__persistLock) return;
    try { mp.trigger('gui:saveStats', JSON.stringify(statsData)); } catch(e) {}
  }

  function loadPersistedCfg(cfg) {
    if (!cfg) return;
    __persistLock = true;
    try {
      var price = parseFloat(cfg.pkprice);
      if (!isNaN(price) && price >= 0) CFG.pkprice = price;
      var inp = document.getElementById('cfg-pkprice');
      if (inp) inp.value = CFG.pkprice;
    } catch(e) {}
    __persistLock = false;
    updateStats();
  }
  function loadPersistedStats(s) {
    if (!s) return;
    __persistLock = true;
    try {
      var pk = parseInt(s.pk, 10);
      statsData.pk = !isNaN(pk) && pk >= 0 ? pk : 0;
      var st = parseInt(s.startTime, 10);
      statsData.startTime = !isNaN(st) && st > 0 ? st : Date.now();
    } catch(e2) {}
    __persistLock = false;
    updateStats();
  }

  function saveCfg() {
    CFG.pkprice = parseFloat(document.getElementById('cfg-pkprice').value) || 0;
    updateStats();
    persistCfg();
    mp.trigger('gui:setPKPrice', CFG.pkprice);
  }
  function resetStats() {
    statsData = { pk: 0, startTime: Date.now() };
    updateStats();
    persistStats();
    mp.trigger('gui:resetStatsClient');
  }
  function addPK(count) {
    statsData.pk += (count || 1);
    updateStats();
    persistStats();
  }
  function updateStats() {
    var totalMoney = statsData.pk * CFG.pkprice;
    var elapsed = (Date.now() - statsData.startTime) / 3600000;
    var ratePerHour = elapsed > 0 ? (statsData.pk / elapsed).toFixed(1) : 0;
    var earnRate = elapsed > 0 ? Math.round(totalMoney / elapsed) : 0;
    var chance = statsData.pk > 0 ? '—' : '—'; // шанс не считаем, т.к. неизвестно кол-во действий
    document.getElementById('s-pk').innerText = statsData.pk;
    document.getElementById('s-earned').innerText = '$' + totalMoney.toLocaleString();
    document.getElementById('s-pkval').innerText = '$' + (statsData.pk * CFG.pkprice).toLocaleString();
    document.getElementById('s-pkrate').innerText = ratePerHour + ' / ч';
    document.getElementById('s-earnrate').innerText = earnRate > 0 ? '$' + earnRate + ' / ч' : '—';
    document.getElementById('s-chance').innerText = chance;
  }

  var _adminStopEnabled = true;
  function toggleAdminStop() {
    _adminStopEnabled = !_adminStopEnabled;
    var btn = document.getElementById('admin-toggle');
    if (_adminStopEnabled) {
      btn.innerText = '✅ Включено';
      btn.style.background = 'rgba(0,220,80,0.15)';
      btn.style.borderColor = 'rgba(0,220,80,0.3)';
      btn.style.color = '#00ff55';
    } else {
      btn.innerText = '❌ Выключено';
      btn.style.background = 'rgba(255,50,50,0.15)';
      btn.style.borderColor = 'rgba(255,50,50,0.3)';
      btn.style.color = '#ff6666';
    }
    mp.trigger('gui:setAdminStop', _adminStopEnabled);
  }
  function teleportToStart() {
    mp.trigger('gui:teleportToStart');
  }
  function toggleBot() {
    mp.trigger('gui:toggleBot');
  }
  function toggleRouteRecord() {
    mp.trigger('gui:toggleRouteRecord');
  }
  function forceRoutePoint() {
    mp.trigger('gui:forceRoutePoint');
  }
  function refreshRoutes() {
    mp.trigger('gui:refreshRoutes');
  }
  function deleteSelectedRoute() {
    var sel = document.getElementById('route-select');
    if (sel) mp.trigger('gui:deleteRecordedRoute', sel.value);
  }
  function clearCustomRoutes() {
    mp.trigger('gui:clearCustomRoutes');
  }
  function toggleRouteReverse() {
    mp.trigger('gui:toggleRouteReverse');
  }
  function selectRoute() {
    var sel = document.getElementById('route-select');
    if (sel) mp.trigger('gui:setRouteSelection', sel.value);
  }
  function pickRoute(routeId) {
    var sel = document.getElementById('route-select');
    if (sel) sel.value = routeId;
    mp.trigger('gui:setRouteSelection', routeId);
  }
  function setRouteReverseStatus(enabled) {
    var el = document.getElementById('route-reverse-status');
    if (!el) return;
    el.innerText = 'Random';
    el.className = 'val purple';
  }
  function setRouteOptions(routes, selectedId) {
    var sel = document.getElementById('route-select');
    var list = document.getElementById('route-list');
    if (sel) sel.innerHTML = '';
    if (list) list.innerHTML = '';
    var recordedCount = 0;
    for (var i = 0; i < routes.length; i++) {
      if (sel) {
        var opt = document.createElement('option');
        opt.value = routes[i].id;
        opt.textContent = routes[i].name;
        sel.appendChild(opt);
      }
      if (list) {
        var item = document.createElement('div');
        item.className = 'route-item' + (routes[i].recorded ? ' recorded' : '') + (routes[i].id === (selectedId || 'auto') ? ' active' : '');
        item.textContent = routes[i].name;
        item.setAttribute('data-route-id', routes[i].id);
        item.onclick = function() { pickRoute(this.getAttribute('data-route-id')); };
        list.appendChild(item);
      }
      if (routes[i].recorded) recordedCount++;
    }
    if (sel) sel.value = selectedId || 'auto';
    var selected = null;
    for (var j = 0; j < routes.length; j++) {
      if (routes[j].id === sel.value) {
        selected = routes[j];
        break;
      }
    }
    var nameEl = document.getElementById('selected-route-name');
    if (nameEl) nameEl.innerText = selected ? selected.name : 'None';
    var countEl = document.getElementById('recorded-route-count');
    if (countEl) countEl.innerText = recordedCount;
  }
  function setBotBtn(running) {
    var btn = document.getElementById('bot-btn');
    if (!btn) return;
    if (running) {
      btn.innerText = '⏹ ОСТАНОВИТЬ БОТА';
      btn.style.background = 'rgba(255,50,50,0.15)';
      btn.style.borderColor = 'rgba(255,50,50,0.3)';
      btn.style.color = '#ff6666';
    } else {
      btn.innerText = '▶ ЗАПУСТИТЬ БОТА';
      btn.style.background = 'rgba(0,220,80,0.15)';
      btn.style.borderColor = 'rgba(0,220,80,0.3)';
      btn.style.color = '#00ff55';
    }
  }
  function setClickerStatus(status) {
    var el = document.getElementById('clicker');
    if (!el) return;
    el.innerText = status;
    el.className = 'val ' + (status === 'ON' ? 'green' : 'red');
  }
  function setStatus(status, route, progress) {
    var statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.innerText = status;
      if (status === 'Running') statusEl.className = 'val green';
      else if (status === 'AFK') statusEl.className = 'val red';
      else statusEl.className = 'val red';
    }
    var routeEl = document.getElementById('route-name');
    if (routeEl) routeEl.innerText = route || '—';
    var progEl = document.getElementById('route-progress');
    if (progEl) progEl.innerText = progress || '—';
  }
  function setAdminCount(count) {
    var el = document.getElementById('admin-count');
    if (!el) return;
    el.innerText = count;
    el.className = 'val ' + (count > 0 ? 'red' : 'green');
  }
  function setSessionTime(timeStr) {
    var el = document.getElementById('s-session');
    if (el) el.innerText = timeStr;
  }
  function setRouteRecordStatus(active, count) {
    var buttons = document.querySelectorAll('.record-route-btn');
    if (buttons.length) {
      for (var i = 0; i < buttons.length; i++) {
        var routeBtn = buttons[i];
        if (active) {
          routeBtn.innerText = 'F8 Stop (' + count + ')';
          routeBtn.style.background = 'rgba(255,50,50,0.15)';
          routeBtn.style.borderColor = 'rgba(255,50,50,0.3)';
          routeBtn.style.color = '#ff6666';
        } else {
          routeBtn.innerText = 'F8 Record';
          routeBtn.style.background = 'rgba(255,200,0,0.15)';
          routeBtn.style.borderColor = 'rgba(255,200,0,0.25)';
          routeBtn.style.color = '#ffe066';
        }
      }
      return;
    }
    var btn = document.getElementById('record-route-btn');
    if (!btn) return;
    if (active) {
      btn.innerText = '⏹ F8 - Стоп (' + count + ')';
      btn.style.background = 'rgba(255,50,50,0.15)';
      btn.style.borderColor = 'rgba(255,50,50,0.3)';
      btn.style.color = '#ff6666';
    } else {
      btn.innerText = '⏺ F8 - Начать запись';
      btn.style.background = 'rgba(255,200,0,0.15)';
      btn.style.borderColor = 'rgba(255,200,0,0.25)';
      btn.style.color = '#ffe066';
    }
  }
  updateStats();
</script>
</body></html>`;

function createGUI() {
    if (guiBrowser) { guiBrowser.destroy(); guiBrowser = null; }
    guiBrowser = mp.browsers.new("data:text/html," + encodeURIComponent(guiHTML));
}

// ══════════════════════════════════════════════════════════════
//  ПОДСЧЁТ ОБЕЗБОЛОВ И СТАТИСТИКА
// ══════════════════════════════════════════════════════════════

var PAINKILLER_STATS = {
    count: 0,
    price: 2900,
    sessionStart: Date.now(),
    sessionActions: 0,  // количество найденных обезболов
    pkNotifyBound: false
};

function formatSessionTime(ms) {
    var sec = Math.floor(ms / 1000);
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
}

function updatePainkillerDisplay() {
    if (!guiBrowser) return;
    var totalMoney = PAINKILLER_STATS.count * PAINKILLER_STATS.price;
    var sessionTime = Date.now() - PAINKILLER_STATS.sessionStart;
    var sessionHours = sessionTime / 3600000;
    var ratePerHour = sessionHours > 0 ? Math.round(PAINKILLER_STATS.sessionActions / sessionHours) : 0;
    var formattedTime = formatSessionTime(sessionTime);
    
    guiBrowser.execute(`
        document.getElementById('s-pk').innerText = '${PAINKILLER_STATS.count}';
        document.getElementById('s-earned').innerText = '$${totalMoney.toLocaleString()}';
        document.getElementById('s-pkrate').innerText = '${ratePerHour} / ч';
        document.getElementById('s-session').innerText = '${formattedTime}';
    `);
}

function savePainkillerStats() {
    try {
        mp.storage.data.portBotStats = {
            count: PAINKILLER_STATS.count,
            sessionStart: PAINKILLER_STATS.sessionStart,
            sessionActions: PAINKILLER_STATS.sessionActions
        };
    } catch(e) {}
}

function loadPainkillerStats() {
    try {
        if (mp.storage.data.portBotStats) {
            var s = mp.storage.data.portBotStats;
            PAINKILLER_STATS.count = s.count || 0;
            PAINKILLER_STATS.sessionStart = s.sessionStart || Date.now();
            PAINKILLER_STATS.sessionActions = s.sessionActions || 0;
        }
    } catch(e) {}
}

function resetAllStats() {
    PAINKILLER_STATS.count = 0;
    PAINKILLER_STATS.sessionActions = 0;
    PAINKILLER_STATS.sessionStart = Date.now();
    
    autorunActive = false;
    isAdminProtectionActive = false;
    currentRoute = null;
    currentRouteName = null;
    routeStep = 0;
    lastCarryingState = null;
    stuckTimer = Date.now();
    lastMovePos = null;
    
    updatePainkillerDisplay();
    updateStatus("Stopped", "N/A", "—");
    savePainkillerStats();
}

let lastPainkillerTime = 0;
var PAINKILLER_NOTIFY_TEXT = "Вы нашли бутылек с таблетками, на него наверняка найдется покупатель";

function onPainkillerFound() {
    const now = Date.now();
    if (now - lastPainkillerTime < 500) return;
    lastPainkillerTime = now;
    
    PAINKILLER_STATS.count++;
    PAINKILLER_STATS.sessionActions++;
    updatePainkillerDisplay();
    savePainkillerStats();
    if (guiBrowser) guiBrowser.execute(`addPK(1);`);
}

var painkillerNotifyHandler = function(type, text) {
    if (type === 'info' && text === PAINKILLER_NOTIFY_TEXT) {
        onPainkillerFound();
        return;
    }
};

try {
    if (!PAINKILLER_STATS.pkNotifyBound) {
        mp.events.add('clientFunc_notify', painkillerNotifyHandler);
        PAINKILLER_STATS.pkNotifyBound = true;
    }
} catch(e) {}

// Обновляем время сессии каждую секунду
setInterval(function() {
    if (autorunActive) {
        updatePainkillerDisplay();
    }
}, 1000);

// ══════════════════════════════════════════════════════════════
//  МАРШРУТЫ (портовые)
// ══════════════════════════════════════════════════════════════

var ROUTE_CARRY_1 = [
    new mp.Vector3(-438.91, -2733.70, 6.00),
    new mp.Vector3(-440.44, -2733.29, 6.00),
    new mp.Vector3(-441.66, -2732.68, 6.00),
    new mp.Vector3(-442.62, -2731.79, 6.00),
    new mp.Vector3(-451.99, -2722.89, 6.00),
    new mp.Vector3(-453.12, -2722.03, 6.00),
    new mp.Vector3(-454.13, -2721.39, 6.00),
    new mp.Vector3(-455.85, -2720.27, 6.00),
    new mp.Vector3(-458.47, -2718.62, 6.00),
    new mp.Vector3(-461.15, -2719.19, 6.00),
    new mp.Vector3(-462.59, -2718.26, 6.00),
    new mp.Vector3(-463.39, -2716.36, 6.00),
    new mp.Vector3(-464.65, -2715.30, 6.00),
    new mp.Vector3(-465.85, -2714.71, 6.00),
    new mp.Vector3(-466.43, -2715.41, 6.00),
    new mp.Vector3(-466.03, -2716.70, 6.00),
    new mp.Vector3(-460.90, -2722.01, 6.00),
    new mp.Vector3(-466.67, -2714.87, 6.00),
    new mp.Vector3(-464.83, -2715.07, 6.00),
    new mp.Vector3(-462.25, -2714.48, 6.00),
    new mp.Vector3(-463.38, -2717.35, 6.00),
    new mp.Vector3(-461.58, -2719.22, 6.00),
    new mp.Vector3(-459.80, -2719.14, 6.00),
    new mp.Vector3(-459.23, -2717.72, 6.00),
    new mp.Vector3(-440.34, -2735.44, 6.00),
    new mp.Vector3(-440.33, -2735.44, 6.00),
];

var ROUTE_CARRY_2 = [
    new mp.Vector3(-441.51, -2732.93, 6.00),
    new mp.Vector3(-450.88, -2723.85, 6.00),
    new mp.Vector3(-453.53, -2721.41, 6.00),
    new mp.Vector3(-456.53, -2719.36, 6.00),
    new mp.Vector3(-458.47, -2718.62, 6.00),
    new mp.Vector3(-461.15, -2719.19, 6.00),
    new mp.Vector3(-462.59, -2718.26, 6.00),
    new mp.Vector3(-463.39, -2716.36, 6.00),
    new mp.Vector3(-464.65, -2715.30, 6.00),
    new mp.Vector3(-465.85, -2714.71, 6.00),
    new mp.Vector3(-466.43, -2715.41, 6.00),
    new mp.Vector3(-466.03, -2716.70, 6.00),
    new mp.Vector3(-460.90, -2722.01, 6.00),
    new mp.Vector3(-466.67, -2714.87, 6.00),
    new mp.Vector3(-464.83, -2715.07, 6.00),
    new mp.Vector3(-462.25, -2714.48, 6.00),
    new mp.Vector3(-463.38, -2717.35, 6.00),
    new mp.Vector3(-461.58, -2719.22, 6.00),
    new mp.Vector3(-459.80, -2719.14, 6.00),
    new mp.Vector3(-459.23, -2717.72, 6.00),
    new mp.Vector3(-440.34, -2735.44, 6.00),
    new mp.Vector3(-440.33, -2735.44, 6.00),
];

var ROUTE_CARRY_3 = [
    new mp.Vector3(-438.53, -2730.49, 6.00),
    new mp.Vector3(-438.89, -2729.58, 6.00),
    new mp.Vector3(-439.70, -2728.34, 6.00),
    new mp.Vector3(-445.42, -2723.11, 6.00),
    new mp.Vector3(-446.62, -2722.23, 6.00),
    new mp.Vector3(-448.10, -2721.45, 6.00),
    new mp.Vector3(-450.13, -2720.79, 6.00),
    new mp.Vector3(-458.47, -2718.62, 6.00),
    new mp.Vector3(-461.15, -2719.19, 6.00),
    new mp.Vector3(-462.59, -2718.26, 6.00),
    new mp.Vector3(-463.39, -2716.36, 6.00),
    new mp.Vector3(-464.65, -2715.30, 6.00),
    new mp.Vector3(-465.85, -2714.71, 6.00),
    new mp.Vector3(-466.43, -2715.41, 6.00),
    new mp.Vector3(-466.03, -2716.70, 6.00),
    new mp.Vector3(-460.90, -2722.01, 6.00),
    new mp.Vector3(-466.67, -2714.87, 6.00),
    new mp.Vector3(-464.83, -2715.07, 6.00),
    new mp.Vector3(-462.25, -2714.48, 6.00),
    new mp.Vector3(-463.38, -2717.35, 6.00),
    new mp.Vector3(-461.58, -2719.22, 6.00),
    new mp.Vector3(-459.80, -2719.14, 6.00),
    new mp.Vector3(-459.23, -2717.72, 6.00),
    new mp.Vector3(-440.34, -2735.44, 6.00),
    new mp.Vector3(-440.33, -2735.44, 6.00),
];

var ROUTE_CARRY_4 = [
    new mp.Vector3(-436.03, -2732.87, 6.00),
    new mp.Vector3(-436.69, -2731.33, 6.00),
    new mp.Vector3(-437.45, -2729.32, 6.00),
    new mp.Vector3(-438.34, -2727.31, 6.00),
    new mp.Vector3(-440.11, -2725.16, 6.00),
    new mp.Vector3(-444.86, -2721.01, 6.00),
    new mp.Vector3(-448.86, -2719.13, 6.00),
    new mp.Vector3(-452.04, -2718.73, 6.00),
    new mp.Vector3(-458.47, -2718.62, 6.00),
    new mp.Vector3(-461.15, -2719.19, 6.00),
    new mp.Vector3(-462.59, -2718.26, 6.00),
    new mp.Vector3(-463.39, -2716.36, 6.00),
    new mp.Vector3(-464.65, -2715.30, 6.00),
    new mp.Vector3(-465.85, -2714.71, 6.00),
    new mp.Vector3(-466.43, -2715.41, 6.00),
    new mp.Vector3(-466.03, -2716.70, 6.00),
    new mp.Vector3(-460.90, -2722.01, 6.00),
    new mp.Vector3(-466.67, -2714.87, 6.00),
    new mp.Vector3(-464.83, -2715.07, 6.00),
    new mp.Vector3(-462.25, -2714.48, 6.00),
    new mp.Vector3(-463.38, -2717.35, 6.00),
    new mp.Vector3(-461.58, -2719.22, 6.00),
    new mp.Vector3(-459.80, -2719.14, 6.00),
    new mp.Vector3(-459.23, -2717.72, 6.00),
    new mp.Vector3(-440.34, -2735.44, 6.00),
    new mp.Vector3(-440.33, -2735.44, 6.00),
];

var ALL_CARRY_ROUTES = [
    { name: "Delivery #1", route: ROUTE_CARRY_1 },
    { name: "Delivery #2", route: ROUTE_CARRY_2 },
    { name: "Delivery #3", route: ROUTE_CARRY_3 },
    { name: "Delivery #4", route: ROUTE_CARRY_4 },
];

var ROUTE_EMPTY = [
    new mp.Vector3(-458.64, -2727.29, 6.00),
    new mp.Vector3(-457.58, -2729.58, 6.00),
    new mp.Vector3(-455.32, -2732.09, 6.00),
    new mp.Vector3(-451.80, -2735.55, 6.00),
    new mp.Vector3(-450.33, -2736.48, 6.00),
    new mp.Vector3(-448.08, -2737.56, 6.00),
    new mp.Vector3(-445.60, -2738.64, 6.00),
    new mp.Vector3(-443.24, -2739.44, 6.00),
    new mp.Vector3(-439.61, -2740.32, 6.00),
    new mp.Vector3(-437.18, -2740.92, 6.00),
    new mp.Vector3(-435.74, -2740.88, 6.00),
    new mp.Vector3(-432.77, -2740.68, 6.00),
    new mp.Vector3(-430.55, -2741.53, 6.00),
    new mp.Vector3(-429.67, -2739.96, 6.00),
    new mp.Vector3(-428.10, -2740.10, 6.00),
    new mp.Vector3(-426.61, -2741.02, 6.00),
    new mp.Vector3(-424.23, -2741.72, 6.00),
    new mp.Vector3(-426.01, -2739.83, 6.00),
    new mp.Vector3(-428.19, -2739.98, 6.00),
    new mp.Vector3(-429.40, -2740.48, 6.00),
    new mp.Vector3(-430.08, -2742.11, 6.00),
    new mp.Vector3(-431.22, -2741.90, 6.00),
    new mp.Vector3(-432.11, -2740.45, 6.00),
    new mp.Vector3(-435.86, -2740.50, 6.00),
    new mp.Vector3(-436.62, -2741.33, 6.00),
    new mp.Vector3(-447.82, -2741.47, 6.00),
];

// ══════════════════════════════════════════════════════════════
//  АВТОКЛИКЕР
// ══════════════════════════════════════════════════════════════

// ============================================================
//  ЗАПИСЬ МАРШРУТОВ
// ============================================================

var routeRecorder = {
    mode: "idle",
    active: false,
    points: [],
    lastPoint: null,
    lastPointTime: 0,
    hadBox: false,
    minDistance: 2.8,
    minInterval: 900,
    maxPoints: 500,
    savedRoutes: []
};

function roundRouteCoord(value) {
    return Math.round(value * 100) / 100;
}

function cloneRoutePoint(pos) {
    return {
        x: roundRouteCoord(pos.x),
        y: roundRouteCoord(pos.y),
        z: roundRouteCoord(pos.z)
    };
}

function routePointDistance(a, b) {
    if (!a || !b) return Infinity;
    return mp.game.system.vdist(a.x, a.y, a.z, b.x, b.y, b.z);
}

function formatRecordedRoute(points, routeName) {
    var lines = ["var " + routeName + " = ["];
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        lines.push("    new mp.Vector3(" + p.x.toFixed(2) + ", " + p.y.toFixed(2) + ", " + p.z.toFixed(2) + "),");
    }
    lines.push("];");
    return lines.join("\n");
}

function saveRecordedRoute() {
    if (routeRecorder.points.length === 0) return null;
    
    var saved = {
        name: "Custom Delivery #" + (routeRecorder.savedRoutes.length + 1),
        createdAt: Date.now(),
        points: routeRecorder.points.slice()
    };
    
    routeRecorder.savedRoutes.unshift(saved);
    if (routeRecorder.savedRoutes.length > 10) routeRecorder.savedRoutes.length = 10;
    
    try {
        mp.storage.data.portBotRecordedRoutes = routeRecorder.savedRoutes;
        mp.storage.flush();
    } catch(e) {}
    
    return saved;
}

function loadRecordedRoutes() {
    try {
        if (mp.storage.data.portBotRecordedRoutes && mp.storage.data.portBotRecordedRoutes.length) {
            routeRecorder.savedRoutes = mp.storage.data.portBotRecordedRoutes;
        }
    } catch(e) {}
}

function updateRouteRecordGui() {
    if (guiBrowser) {
        guiBrowser.execute(`setRouteRecordStatus(${routeRecorder.active}, ${routeRecorder.points.length});`);
    }
}

function resetRouteRecorderState() {
    routeRecorder.mode = "idle";
    routeRecorder.active = false;
    routeRecorder.points = [];
    routeRecorder.lastPoint = null;
    routeRecorder.lastPointTime = 0;
    routeRecorder.hadBox = false;
    updateRouteRecordGui();
}

function addRouteRecordPoint(force) {
    if (!routeRecorder.active) return;
    
    const player = mp.players.local;
    if (!player || !player.handle) return;
    
    var point = cloneRoutePoint(player.position);
    var now = Date.now();
    if (!force) {
        if (now - routeRecorder.lastPointTime < routeRecorder.minInterval) return;
        if (routePointDistance(point, routeRecorder.lastPoint) < routeRecorder.minDistance) return;
    }
    if (routeRecorder.points.length >= routeRecorder.maxPoints) {
        stopRouteRecord();
        mp.gui.chat.push("!{FFCC00}[PORT BOT] Запись маршрута остановлена: лимит " + routeRecorder.maxPoints + " точек.{WHITE}");
        return;
    }
    
    routeRecorder.points.push(point);
    routeRecorder.lastPoint = point;
    routeRecorder.lastPointTime = now;
    updateRouteRecordGui();
}

function startRouteRecord() {
    if (routeRecorder.active) return;
    
    if (routeRecorder.mode !== "ready" && !playerIsCarryingBox()) {
        mp.gui.chat.push("!{FFCC00}[PORT BOT] Press F8 first and wait until the box is picked up.{WHITE}");
        return;
    }
    if (autorunActive) stopBot();
    
    routeRecorder.mode = "recording";
    routeRecorder.active = true;
    routeRecorder.points = [];
    routeRecorder.lastPoint = null;
    routeRecorder.lastPointTime = 0;
    routeRecorder.hadBox = playerIsCarryingBox();
    addRouteRecordPoint(true);
    updateRouteRecordGui();
    updateStatus("Recording", "Custom Delivery", routeRecorder.points.length + " pts");
    mp.gui.chat.push("!{00FF00}[PORT BOT] Delivery recording started. Carry the box to the end; it will save automatically when the box is handed in.{WHITE}");
    return;
    mp.gui.chat.push("!{00FF00}[PORT BOT] Запись маршрута начата. F8 - стоп, F10 - добавить точку вручную.{WHITE}");
}

function stopRouteRecord() {
    if (!routeRecorder.active) return;
    
    const player = mp.players.local;
    if (player && player.handle && routePointDistance(cloneRoutePoint(player.position), routeRecorder.lastPoint) > 0.2) {
        addRouteRecordPoint(true);
    }
    routeRecorder.active = false;
    routeRecorder.mode = "idle";
    routeRecorder.hadBox = false;
    var saved = saveRecordedRoute();
    updateRouteRecordGui();
    
    if (!saved) {
        mp.gui.chat.push("!{FF6666}[PORT BOT] Маршрут не сохранён: нет точек.{WHITE}");
        return;
    }
    
    selectedRouteId = "recorded:0";
    saveRouteSelection();
    updateRouteOptionsGui();
    
    var code = formatRecordedRoute(saved.points, saved.name);
    try {
        mp.console.logInfo("[PORT BOT] Recorded route:\n" + code);
    } catch(e) {}
    
    mp.gui.chat.push("!{00FFFF}[PORT BOT] Маршрут сохранён: " + saved.name + ", точек: " + saved.points.length + ". Код выведен в консоль.{WHITE}");
}

function startDeliveryRecordSetup() {
    resetRouteRecorderState();
    
    if (playerIsCarryingBox()) {
        routeRecorder.mode = "ready";
        updateStatus("Ready", "Record Delivery", "Press F10");
        mp.gui.chat.push("!{00FF00}[PORT BOT] Box detected. Press F10 to start recording the delivery route.{WHITE}");
        return;
    }
    
    routeRecorder.mode = "pickup";
    autorunActive = true;
    portClicker.start();
    currentRoute = ROUTE_EMPTY;
    currentRouteName = "Pickup (Record)";
    routeStep = 0;
    lastCarryingState = false;
    stuckTimer = Date.now();
    lastMovePos = null;
    updateStatus("Running", currentRouteName, "1/" + currentRoute.length);
    if (guiBrowser) guiBrowser.execute(`setBotBtn(true);`);
    mp.gui.chat.push("!{00FF00}[PORT BOT] Recording setup started. Bot is running Pickup; it will stop when the box is picked up.{WHITE}");
}

function finishDeliveryRecordPickup() {
    stopBot();
    routeRecorder.mode = "ready";
    routeRecorder.points = [];
    routeRecorder.lastPoint = null;
    routeRecorder.lastPointTime = 0;
    routeRecorder.hadBox = true;
    lastCarryingState = true;
    updateStatus("Ready", "Record Delivery", "Press F10");
    updateRouteRecordGui();
    mp.gui.chat.push("!{00FFFF}[PORT BOT] Box picked up. Stand where you want and press F10 to start recording delivery route.{WHITE}");
}

function toggleRouteRecord() {
    if (routeRecorder.active) {
        stopRouteRecord();
        return;
    }
    
    if (routeRecorder.mode !== "idle") {
        resetRouteRecorderState();
        if (autorunActive) stopBot();
        updateStatus("Stopped", "N/A", "—");
        mp.gui.chat.push("!{FFCC00}[PORT BOT] Delivery recording setup cancelled.{WHITE}");
        return;
    }
    
    startDeliveryRecordSetup();
    return;
    if (routeRecorder.active) stopRouteRecord();
    else startRouteRecord();
}

function forceRouteRecordPoint() {
    if (routeRecorder.mode === "ready") {
        startRouteRecord();
        return;
    }
    
    if (!routeRecorder.active) {
        mp.gui.chat.push("!{FFCC00}[PORT BOT] Press F8 first. The bot will run Pickup, then F10 starts delivery recording.{WHITE}");
        return;
    }
    
    if (!routeRecorder.active) {
        mp.gui.chat.push("!{FFCC00}[PORT BOT] Сначала включи запись маршрута через F8.{WHITE}");
        return;
    }
    
    addRouteRecordPoint(true);
    mp.gui.chat.push("!{00FFFF}[PORT BOT] Точка добавлена вручную. Всего: " + routeRecorder.points.length + ".{WHITE}");
}

var portClicker = {
    active: false,
    checkInterval: null,
    browser: null,
    gameWasVisible: false,
    hasPressed: false,
    clickDelayMin: 500,
    clickDelayMax: 503,
    
    getRandomDelay: function() {
        return Math.floor(Math.random() * (this.clickDelayMax - this.clickDelayMin + 1)) + this.clickDelayMin;
    },
    
    findBrowser: function() {
        var browsers = mp.browsers.toArray();
        for (var i = 0; i < browsers.length; i++) {
            var url = browsers[i].url || '';
            if (url.includes('__menu.html') || url.includes('Menu')) {
                return browsers[i];
            }
        }
        return null;
    },
    
    checkAndPress: function() {
        this.browser = this.findBrowser();
        if (!this.browser) {
            this.gameWasVisible = false;
            this.hasPressed = false;
            return;
        }
        
        var self = this;
        var checkCode = `
            (function() {
                var gameContent = document.getElementById('portGameContent');
                var isVisible = gameContent && gameContent.style.display !== 'none';
                mp.trigger('clicker:gameStatus', isVisible);
            })();
        `;
        try {
            this.browser.execute(checkCode);
        } catch(e) {}
    },
    
    pressE: function() {
        if (!this.browser) return;
        var pressCode = `
            (function() {
                var key = 'E';
                var events = ['keydown', 'keypress', 'keyup'];
                for (var i = 0; i < events.length; i++) {
                    var event = new KeyboardEvent(events[i], {
                        key: key, code: 'KeyE', bubbles: true, cancelable: true, view: window
                    });
                    document.body.dispatchEvent(event);
                    document.dispatchEvent(event);
                }
            })();
        `;
        try {
            this.browser.execute(pressCode);
        } catch(e) {}
    },
    
    onGameStatus: function(isVisible) {
        if (isVisible && !this.gameWasVisible && !this.hasPressed) {
            this.gameWasVisible = true;
            var self = this;
            var randomDelay = this.getRandomDelay();
            setTimeout(function() {
                if (self.active) {
                    self.pressE();
                    self.hasPressed = true;
                }
            }, randomDelay);
        }
        if (!isVisible) {
            this.gameWasVisible = false;
            this.hasPressed = false;
        }
    },
    
    start: function() {
        if (this.active) return;
        this.active = true;
        this.gameWasVisible = false;
        this.hasPressed = false;
        this.checkInterval = setInterval(() => {
            if (this.active) this.checkAndPress();
        }, 200);
        if (guiBrowser) guiBrowser.execute(`setClickerStatus('ON');`);
    },
    
    stop: function() {
        this.active = false;
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        this.gameWasVisible = false;
        this.hasPressed = false;
        if (guiBrowser) guiBrowser.execute(`setClickerStatus('OFF');`);
    }
};

// ══════════════════════════════════════════════════════════════
//  ПОРТОВЫЙ БОТ
// ══════════════════════════════════════════════════════════════

var autorunActive = false;
var isAdminProtectionActive = false;
var currentRoute = null;
var currentRouteName = null;
var routeStep = 0;
var lastCarryingState = null;
var isAdminDetected = false;
var adminPauseTriggered = false;
var stuckTimer = 0;
var STUCK_TIMEOUT = 7500;
var lastMovePos = null;
var selectedRouteId = "auto";
var routeReverseEnabled = false;

function playerIsCarryingBox() {
    const player = mp.players.local;
    return player.isPlayingAnim("anim@heists@box_carry@", "idle", 3);
}

function stopBot() {
    const player = mp.players.local;
    if (player && player.handle) {
        mp.game.invoke('0xE1EF3C1216AFF2CD', player.handle);
        player.setMoveRateOverride(1.0);
        try {
            mp.game.task.setPedDesiredMoveBlendRatio(player.handle, 1.0);
        } catch {}
    }
    autorunActive = false;
    portClicker.stop();
    updateStatus("Stopped", "N/A", "—");
    if (guiBrowser) guiBrowser.execute(`setBotBtn(false);`);
}

function updateStatus(status, route, progress) {
    if (guiBrowser) {
        guiBrowser.execute(`setStatus(${JSON.stringify(status)}, ${JSON.stringify(route)}, ${JSON.stringify(progress)});`);
    }
}

function updateAdminCount(count) {
    if (guiBrowser) {
        guiBrowser.execute(`setAdminCount(${count});`);
    }
}

function getRouteOptions() {
    var routes = [];
    
    for (var i = 0; i < ALL_CARRY_ROUTES.length; i++) {
        routes.push({ id: "carry:" + i, name: ALL_CARRY_ROUTES[i].name + " (built-in)" });
    }
    
    for (var r = 0; r < routeRecorder.savedRoutes.length; r++) {
        var saved = routeRecorder.savedRoutes[r];
        routes.push({
            id: "recorded:" + r,
            name: (saved.name || ("Recorded #" + (r + 1))) + " (" + ((saved.points && saved.points.length) || 0) + " pts)",
            recorded: true
        });
    }
    
    return routes;
}

function updateRouteOptionsGui() {
    if (guiBrowser) {
        guiBrowser.execute(`setRouteOptions(${JSON.stringify(getRouteOptions())}, ${JSON.stringify(selectedRouteId)});`);
        guiBrowser.execute(`setRouteReverseStatus(${routeReverseEnabled});`);
    }
}

function saveRouteSelection() {
    try {
        mp.storage.data.portBotSelectedRoute = selectedRouteId;
        mp.storage.flush();
    } catch(e) {}
}

function loadRouteSelection() {
    try {
        if (mp.storage.data.portBotSelectedRoute) {
            selectedRouteId = mp.storage.data.portBotSelectedRoute;
        }
        routeReverseEnabled = mp.storage.data.portBotRouteReverse === true;
    } catch(e) {}
}

function saveRouteReverse() {
    try {
        mp.storage.data.portBotRouteReverse = routeReverseEnabled;
        mp.storage.flush();
    } catch(e) {}
}

function toggleRouteReverse() {
    routeReverseEnabled = !routeReverseEnabled;
    saveRouteReverse();
    updateRouteOptionsGui();
    if (autorunActive) {
        chooseRoute(true);
    }
    mp.gui.chat.push("!{A78BFA}[PORT BOT] Reverse route: " + (routeReverseEnabled ? "ON" : "OFF") + ".{WHITE}");
}

function recordedRouteToVectorRoute(saved) {
    var result = [];
    if (!saved || !saved.points) return result;
    
    for (var i = 0; i < saved.points.length; i++) {
        var p = saved.points[i];
        result.push(new mp.Vector3(p.x, p.y, p.z));
    }
    
    return result;
}

function resolveSelectedRoute(carrying) {
    if (!carrying) {
        return { name: "Pickup", route: ROUTE_EMPTY };
    }
    
    var deliveryPool = [];
    for (var b = 0; b < ALL_CARRY_ROUTES.length; b++) {
        deliveryPool.push({
            name: ALL_CARRY_ROUTES[b].name,
            route: ALL_CARRY_ROUTES[b].route
        });
    }
    for (var c = 0; c < routeRecorder.savedRoutes.length; c++) {
        var custom = routeRecorder.savedRoutes[c];
        var customRoute = recordedRouteToVectorRoute(custom);
        if (customRoute.length > 0) {
            deliveryPool.push({
                name: custom.name || ("Custom Delivery #" + (c + 1)),
                route: customRoute
            });
        }
    }
    
    if (deliveryPool.length > 0) {
        return deliveryPool[Math.floor(Math.random() * deliveryPool.length)];
    }
    
    return { name: "Delivery #1", route: ROUTE_CARRY_1 };
    
    if (selectedRouteId === "pickup") {
        return { name: "Pickup", route: ROUTE_EMPTY };
    }
    
    if (selectedRouteId.indexOf("carry:") === 0) {
        var carryIndex = parseInt(selectedRouteId.split(":")[1], 10);
        if (!isNaN(carryIndex) && ALL_CARRY_ROUTES[carryIndex]) {
            return {
                name: ALL_CARRY_ROUTES[carryIndex].name,
                route: ALL_CARRY_ROUTES[carryIndex].route
            };
        }
    }
    
    if (selectedRouteId.indexOf("recorded:") === 0) {
        var recordedIndex = parseInt(selectedRouteId.split(":")[1], 10);
        var saved = routeRecorder.savedRoutes[recordedIndex];
        var vectorRoute = recordedRouteToVectorRoute(saved);
        if (vectorRoute.length > 0) {
            return {
                name: saved.name || ("Recorded #" + (recordedIndex + 1)),
                route: vectorRoute,
                fixed: true
            };
        }
    }
    
    if (carrying) {
        var randomIndex = Math.floor(Math.random() * ALL_CARRY_ROUTES.length);
        return {
            name: ALL_CARRY_ROUTES[randomIndex].name,
            route: ALL_CARRY_ROUTES[randomIndex].route
        };
    }
    
    return { name: "Pickup", route: ROUTE_EMPTY };
}

function setRouteSelection(routeId) {
    selectedRouteId = routeId || "auto";
    saveRouteSelection();
    updateRouteOptionsGui();
    if (autorunActive) {
        chooseRoute(true);
    }
}

function deleteRecordedRoute(routeId) {
    if (!routeId || routeId.indexOf("recorded:") !== 0) {
        mp.gui.chat.push("!{FFCC00}[PORT BOT] Выбери записанный маршрут для удаления.{WHITE}");
        return;
    }
    
    var idx = parseInt(routeId.split(":")[1], 10);
    if (isNaN(idx) || !routeRecorder.savedRoutes[idx]) return;
    
    var removed = routeRecorder.savedRoutes.splice(idx, 1)[0];
    try {
        mp.storage.data.portBotRecordedRoutes = routeRecorder.savedRoutes;
        mp.storage.flush();
    } catch(e) {}
    
    selectedRouteId = "auto";
    saveRouteSelection();
    updateRouteOptionsGui();
    mp.gui.chat.push("!{FF6666}[PORT BOT] Удалён маршрут: " + (removed.name || "Recorded") + ".{WHITE}");
}

function clearCustomRoutes() {
    routeRecorder.savedRoutes = [];
    try {
        mp.storage.data.portBotRecordedRoutes = routeRecorder.savedRoutes;
        mp.storage.flush();
    } catch(e) {}
    selectedRouteId = "auto";
    saveRouteSelection();
    updateRouteOptionsGui();
    mp.gui.chat.push("!{FF6666}[PORT BOT] All custom delivery routes cleared. Built-in routes are still active.{WHITE}");
}

function chooseRoute(findNearest) {
    const carrying = playerIsCarryingBox();
    lastCarryingState = carrying;
    var selected = resolveSelectedRoute(carrying);
    var routeTemplate = selected.route;
    var routeName = selected.name;
    if (false && routeReverseEnabled && routeTemplate && routeTemplate.length > 1) {
        routeTemplate = routeTemplate.slice().reverse();
        routeName += " Reverse";
    }
    
    currentRoute = routeTemplate;
    currentRouteName = routeName;
    
    if (findNearest) {
        const playerPos = mp.players.local.position;
        var minDistance = Infinity;
        var closestStep = 0;
        
        for (var i = 0; i < currentRoute.length; i++) {
            var target = currentRoute[i];
            var dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, target.x, target.y, target.z);
            if (dist < minDistance) {
                minDistance = dist;
                closestStep = i;
            }
        }
        routeStep = closestStep;
        updateStatus("Running", routeName, (routeStep + 1) + "/" + currentRoute.length);
    } else {
        routeStep = 0;
        updateStatus("Running", routeName, "1/" + currentRoute.length);
    }
    
    stuckTimer = Date.now();
}

function moveTo(target) {
    const player = mp.players.local;
    if (!player || !player.handle) return;
    
    player.setMoveRateOverride(1.35);
    try {
        mp.game.task.setPedDesiredMoveBlendRatio(player.handle, 1.35);
    } catch {}
    
    const pos = player.position;
    const dx = target.x - pos.x;
    const dy = target.y - pos.y;
    const heading = Math.atan2(dy, dx) * 180 / Math.PI;
    
    mp.game.task.taskGoStraightToCoord(
        player.handle,
        target.x,
        target.y,
        target.z,
        4.0,
        60000,
        heading,
        0
    );
}

function startBot() {
    if (autorunActive) {
        stopBot();
        return;
    }
    if (routeRecorder.active) stopRouteRecord();
    if (routeRecorder.mode !== "idle") resetRouteRecorderState();
    
    autorunActive = true;
    portClicker.start();
    chooseRoute(true);
    stuckTimer = Date.now();
    lastMovePos = null;
    if (guiBrowser) guiBrowser.execute(`setBotBtn(true);`);
}

function toggleAdminProtection() {
    isAdminProtectionActive = !isAdminProtectionActive;
    if (guiBrowser) {
        guiBrowser.execute(`_adminStopEnabled = ${isAdminProtectionActive};`);
        guiBrowser.execute(`
            var btn = document.getElementById('admin-toggle');
            if (btn) {
                if (${isAdminProtectionActive}) {
                    btn.innerText = '✅ Включено';
                    btn.style.background = 'rgba(0,220,80,0.15)';
                    btn.style.borderColor = 'rgba(0,220,80,0.3)';
                    btn.style.color = '#00ff55';
                } else {
                    btn.innerText = '❌ Выключено';
                    btn.style.background = 'rgba(255,50,50,0.15)';
                    btn.style.borderColor = 'rgba(255,50,50,0.3)';
                    btn.style.color = '#ff6666';
                }
            }
        `);
    }
    if (isAdminProtectionActive) {
        mp.gui.chat.push("!{FFCC00}[PORT BOT] Защита включена! Бот остановится при админе.{WHITE}");
    } else {
        mp.gui.chat.push("!{00FFFF}[PORT BOT] Защита выключена. Бот работает при админе.{WHITE}");
    }
}

function teleportToStart() {
    const player = mp.players.local;
    if (player && player.handle) {
        player.position = new mp.Vector3(-457.70, -2750.95, 8.00);
        mp.gui.chat.push("!{00FF00}[PORT BOT] Телепорт на точку старта.{WHITE}");
    }
}

// ══════════════════════════════════════════════════════════════
//  ОБРАБОТЧИК РЕНДЕРА
// ══════════════════════════════════════════════════════════════

var renderHandler = () => {
    const player = mp.players.local;
    if (!player || !player.handle) return;
    
    const playerPos = player.position;
    const now = Date.now();
    
    let currentAdminCount = 0;
    mp.players.forEachInStreamRange((p) => {
        if (p !== player && p.handle !== 0 && p.doesExist() && p.__displayIsAdmin) {
            currentAdminCount++;
            const adminPos = p.position;
            mp.game.graphics.drawLine(playerPos.x, playerPos.y, playerPos.z, adminPos.x, adminPos.y, adminPos.z, 255, 0, 0, 255);
        }
    });
    updateAdminCount(currentAdminCount);
    isAdminDetected = currentAdminCount > 0;
    
    const carrying = playerIsCarryingBox();
    
    if (routeRecorder.active) {
        addRouteRecordPoint(false);
        if (carrying) routeRecorder.hadBox = true;
        if (routeRecorder.lastPoint) {
            mp.game.graphics.drawLine(
                playerPos.x, playerPos.y, playerPos.z + 0.5,
                routeRecorder.lastPoint.x, routeRecorder.lastPoint.y, routeRecorder.lastPoint.z + 0.5,
                255, 200, 0, 220
            );
        }
        if (routeRecorder.hadBox && !carrying) {
            stopRouteRecord();
            return;
        }
    }
    
    if (routeRecorder.mode === "pickup" && carrying) {
        finishDeliveryRecordPickup();
        return;
    }
    
    if (!autorunActive) return;
    
    if (player.isDead() || player.vehicle) {
        stopBot();
        return;
    }
    
    // Защита от админов (если включена)
    if (isAdminDetected && isAdminProtectionActive) {
        if (!adminPauseTriggered) {
            mp.game.invoke('0xE1EF3C1216AFF2CD', player.handle);
            adminPauseTriggered = true;
            portClicker.stop();
            updateStatus("AFK", "Admin Nearby", "—");
        }
        return;
    } else {
        if (adminPauseTriggered) {
            adminPauseTriggered = false;
            portClicker.start();
            // возобновляем маршрут
            if (currentRoute && routeStep < currentRoute.length) {
                moveTo(currentRoute[routeStep]);
            }
            updateStatus("Running", currentRouteName || "N/A", (routeStep + 1) + "/" + (currentRoute ? currentRoute.length : "?"));
        }
    }
    
    if (routeRecorder.mode === "idle" && carrying !== lastCarryingState) {
        chooseRoute(false);
    }
    
    if (!currentRoute || currentRoute.length === 0) return;
    
    if (routeStep >= currentRoute.length) {
        // Завершили маршрут — можно увеличить счётчик действий (необязательно)
        routeStep = 0;
        stuckTimer = now;
    }
    
    var target = currentRoute[routeStep];
    var dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, target.x, target.y, target.z);
    var timeSinceLastPoint = now - stuckTimer;
    
    if (dist < 1.5) {
        routeStep++;
        if (routeStep >= currentRoute.length) {
            routeStep = 0;
        }
        stuckTimer = now;
        updateStatus("Running", currentRouteName, (routeStep + 1) + "/" + currentRoute.length);
    } else if (timeSinceLastPoint > STUCK_TIMEOUT) {
        player.position = new mp.Vector3(target.x, target.y, target.z);
        routeStep++;
        if (routeStep >= currentRoute.length) {
            routeStep = 0;
        }
        stuckTimer = now;
        updateStatus("Running", currentRouteName, (routeStep + 1) + "/" + currentRoute.length);
    } else {
        moveTo(target);
        mp.game.graphics.drawLine(playerPos.x, playerPos.y, playerPos.z + 0.5, target.x, target.y, target.z + 0.5, 0, 255, 0, 200);
    }
};

// ══════════════════════════════════════════════════════════════
//  ОБРАБОТЧИКИ СОБЫТИЙ GUI
// ══════════════════════════════════════════════════════════════

mp.events.add('gui:toggleBot', function() {
    startBot();
});
mp.events.add('gui:setAdminStop', function(val) {
    isAdminProtectionActive = (val === true || val === 'true');
});
mp.events.add('gui:teleportToStart', function() {
    teleportToStart();
});
mp.events.add('gui:toggleRouteRecord', function() {
    toggleRouteRecord();
});
mp.events.add('gui:forceRoutePoint', function() {
    forceRouteRecordPoint();
});
mp.events.add('gui:refreshRoutes', function() {
    updateRouteOptionsGui();
});
mp.events.add('gui:setRouteSelection', function(routeId) {
    setRouteSelection(routeId);
});
mp.events.add('gui:toggleRouteReverse', function() {
    toggleRouteReverse();
});
mp.events.add('gui:deleteRecordedRoute', function(routeId) {
    deleteRecordedRoute(routeId);
});
mp.events.add('gui:clearCustomRoutes', function() {
    clearCustomRoutes();
});
mp.events.add('gui:setPKPrice', function(price) {
    PAINKILLER_STATS.price = parseFloat(price) || 2900;
    updatePainkillerDisplay();
    savePainkillerStats();
});
mp.events.add('gui:saveCfg', function(json) {
    try {
        var cfg = JSON.parse(json);
        if (cfg.pkprice !== undefined) PAINKILLER_STATS.price = cfg.pkprice;
        savePainkillerStats();
    } catch(e) {}
});
mp.events.add('gui:saveStats', function(json) {
    try {
        var st = JSON.parse(json);
        if (st.pk !== undefined) PAINKILLER_STATS.count = st.pk;
        if (st.startTime !== undefined) PAINKILLER_STATS.sessionStart = st.startTime;
        PAINKILLER_STATS.sessionActions = PAINKILLER_STATS.count; // для совместимости
        savePainkillerStats();
        updatePainkillerDisplay();
    } catch(e) {}
});
mp.events.add('gui:resetStatsClient', function() {
    PAINKILLER_STATS.count = 0;
    PAINKILLER_STATS.sessionActions = 0;
    PAINKILLER_STATS.sessionStart = Date.now();
    updatePainkillerDisplay();
    savePainkillerStats();
    mp.gui.chat.push("!{FFCC00}[PORT BOT] Статистика обнулена.{WHITE}");
});

mp.events.add('clicker:gameStatus', function(isVisible) {
    portClicker.onGameStatus(isVisible);
});

mp.events.add('render', renderHandler);

// ══════════════════════════════════════════════════════════════
//  ВЫГРУЗКА СКРИПТА
// ══════════════════════════════════════════════════════════════

var fullUnloadScript = () => {
    if (routeRecorder.active) stopRouteRecord();
    if (autorunActive) stopBot();
    portClicker.stop();
    
    mp.keys.unbind(0x75, false, toggleAdminProtection);
    mp.keys.unbind(0x76, false, startBot);
    mp.keys.unbind(0x77, false, toggleRouteRecord);
    mp.keys.unbind(0x78, false, teleportToStart);
    mp.keys.unbind(0x79, false, forceRouteRecordPoint);
    mp.keys.unbind(0x7B, false, fullUnloadScript);
    
    mp.events.remove('render', renderHandler);
    mp.events.remove('clicker:gameStatus');
    
    if (guiBrowser) {
        guiBrowser.destroy();
        guiBrowser = null;
    }
    mp.gui.chat.push("!{FF0000}[PORT BOT] Скрипт выгружен.{WHITE}");
};

// ══════════════════════════════════════════════════════════════
//  БИНДЫ КЛАВИШ
// ══════════════════════════════════════════════════════════════

mp.keys.bind(0x75, false, toggleAdminProtection); // F6
mp.keys.bind(0x76, false, startBot);              // F7
mp.keys.bind(0x77, false, toggleRouteRecord);     // F8
mp.keys.bind(0x78, false, teleportToStart);       // F9
mp.keys.bind(0x79, false, forceRouteRecordPoint); // F10
mp.keys.bind(0x7B, false, fullUnloadScript);      // F12

// ══════════════════════════════════════════════════════════════
//  ЗАГРУЗКА
// ══════════════════════════════════════════════════════════════

loadPainkillerStats();
loadRecordedRoutes();
loadRouteSelection();
createGUI();

// Передаём в GUI сохранённую цену обезбола и статистику
setTimeout(function() {
    if (guiBrowser) {
        guiBrowser.execute(`loadPersistedCfg({ pkprice: ${PAINKILLER_STATS.price} });`);
        guiBrowser.execute(`loadPersistedStats({ pk: ${PAINKILLER_STATS.count}, startTime: ${PAINKILLER_STATS.sessionStart} });`);
        guiBrowser.execute(`setClickerStatus('OFF');`);
        guiBrowser.execute(`setBotBtn(false);`);
        guiBrowser.execute(`setRouteRecordStatus(false, 0);`);
        updateRouteOptionsGui();
        guiBrowser.execute(`_adminStopEnabled = ${isAdminProtectionActive};`);
        if (isAdminProtectionActive) {
            guiBrowser.execute(`document.getElementById('admin-toggle').innerText = '✅ Включено';`);
        } else {
            guiBrowser.execute(`document.getElementById('admin-toggle').innerText = '❌ Выключено';`);
        }
    }
}, 500);

mp.gui.chat.push("!{00FFFF}[PORT BOT] Запись маршрутов: F8 - старт/стоп, F10 - добавить точку вручную.{WHITE}");

mp.gui.chat.push("!{00FF00}[PORT BOT] Загружен | F6 - Защита от админов | F7 - Старт/Стоп | F9 - ТП | F12 - Выгрузить{WHITE}");

