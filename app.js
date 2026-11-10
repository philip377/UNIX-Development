(() => {
  'use strict';

  // The public site intentionally contains no network calls, credentials, or real work data.
  const menuButton = document.querySelector('.nav-toggle');
  const menu = document.getElementById('siteNav');
  if (menuButton && menu) {
    const closeMenu = () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Открыть меню');
    };
    menuButton.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', event => {
      if (menu.classList.contains('open') && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const modules = {
    memory: {
      title: 'MEMORIA',
      description: 'Память UNIX: контекст, значимые события, наблюдения и знания, которые помогают принимать следующие решения.',
      points: ['Контекст и история взаимодействий', 'Контролируемое хранение данных', 'Поиск значимой информации'],
      status: 'В развитии'
    },
    agents: {
      title: 'AGENTS',
      description: 'Специализированные участники проектируемой системы. Каждый отвечает за понятный набор задач и передаёт проверяемый результат координатору.',
      points: ['Распределение задач по ролям', 'Обмен результатами между модулями', 'Контроль действий человеком'],
      status: 'Прототипы'
    },
    voice: {
      title: 'VOICE',
      description: 'Голосовой слой для более естественной работы с UNIX: распознавание фраз и подготовка к диалогу с минимальными задержками.',
      points: ['Распознавание голосовых команд', 'Обработка пауз и прерываний', 'Интеграция в настольный интерфейс'],
      status: 'Исследуется'
    },
    tools: {
      title: 'TOOLS',
      description: 'Доступ к приложениям через контролируемые инструменты, прозрачные разрешения и понятный журнал выполнения.',
      points: ['Ограничения полномочий', 'Проверка результатов', 'Подтверждение важных операций'],
      status: 'Проектируется'
    }
  };
  const nodes = [...document.querySelectorAll('[data-node]')];
  const name = document.getElementById('moduleName');
  const description = document.getElementById('moduleDescription');
  const points = document.getElementById('modulePoints');
  const badge = document.getElementById('moduleBadge');
  if (name && description && points && badge && nodes.length) {
    nodes.forEach(node => node.addEventListener('click', () => {
      const chosen = modules[node.dataset.node];
      if (!chosen) return;
      nodes.forEach(button => button.setAttribute('aria-pressed', String(button === node)));
      name.textContent = chosen.title;
      description.textContent = chosen.description;
      points.replaceChildren(...chosen.points.map(point => {
        const item = document.createElement('li');
        item.textContent = point;
        return item;
      }));
      badge.textContent = chosen.status;
    }));
  }

  const scenarios = {
    report: {
      request: '«Проанализируй вымышленные показатели за неделю и подготовь краткий отчёт»',
      steps: [
        ['PRIMUS', 'Получена демонстрационная задача: недельный отчёт.'],
        ['MEMORIA', 'Подготовлен учебный набор данных — без реальных источников.'],
        ['OPERIS', 'Пример значений: понедельник 12, вторник 15, среда 13.'],
        ['PRIMUS', 'По тестовым значениям максимум приходится на вторник.'],
        ['RESULT', 'Демо завершено: создано текстовое резюме тестовых данных.']
      ]
    },
    document: {
      request: '«Подготовь структуру вымышленного документа и проверь обязательные разделы»',
      steps: [
        ['PRIMUS', 'Получен учебный запрос на структурирование документа.'],
        ['MEMORIA', 'Выбраны демонстрационные требования: цель, сроки, результат.'],
        ['OPERIS', 'Сформирован макет разделов: введение, этапы, проверка.'],
        ['PRIMUS', 'Проверен перечень разделов, отсутствующих пунктов нет.'],
        ['RESULT', 'Демо завершено: показан план документа, файл не создавался.']
      ]
    },
    memory: {
      request: '«Вспомни вымышленный контекст проекта и предложи следующий шаг»',
      steps: [
        ['PRIMUS', 'Получена учебная задача с сохранённым примером контекста.'],
        ['MEMORIA', 'Пример заметки: тестовый проект находится на этапе дизайна.'],
        ['MEMORIA', 'Следующий шаг по сценарию — собрать обратную связь.'],
        ['PRIMUS', 'Рекомендация проверена на соответствие учебной заметке.'],
        ['RESULT', 'Демо завершено: показано использование вымышленных фактов.']
      ]
    }
  };
  const tabs = [...document.querySelectorAll('[data-scenario]')];
  const demoRequest = document.getElementById('demoRequest');
  const startButton = document.getElementById('demoStart');
  const log = document.getElementById('demoLog');
  const status = document.getElementById('demoStatus');
  const footer = document.getElementById('demoFoot');
  let selected = 'report';
  let timer = null;
  let generation = 0;

  const clearSimulation = () => {
    generation++;
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };
  const addLine = (actor, line) => {
    const item = document.createElement('li');
    const prefix = document.createElement('strong');
    prefix.textContent = '[' + actor + '] ';
    prefix.className = actor === 'RESULT' ? 'log-ok' : '';
    item.append(prefix, document.createTextNode(line));
    if (actor === 'RESULT') item.classList.add('log-ok');
    log.append(item);
  };
  const reset = () => {
    clearSimulation();
    log.replaceChildren();
    addLine('SIMULATION', 'Сценарий выбран. Нажмите «Запустить симуляцию».');
    status.textContent = 'Готово к запуску';
    footer.textContent = 'Все действия — постановочная браузерная симуляция.';
    if (startButton) startButton.disabled = false;
  };
  if (demoRequest && log && status && startButton && footer) {
    tabs.forEach(tab => tab.addEventListener('click', () => {
      if (!scenarios[tab.dataset.scenario]) return;
      selected = tab.dataset.scenario;
      tabs.forEach(button => button.setAttribute('aria-pressed', String(button === tab)));
      demoRequest.textContent = scenarios[selected].request;
      reset();
    }));
    startButton.addEventListener('click', () => {
      clearSimulation();
      const currentGeneration = generation;
      const steps = scenarios[selected].steps;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const delay = reducedMotion ? 0 : 570;
      log.replaceChildren();
      status.textContent = 'Симуляция выполняется';
      footer.textContent = 'Локальная демонстрация: никаких внешних запросов.';
      startButton.disabled = true;
      let index = 0;
      function next() {
        if (currentGeneration !== generation) return;
        if (index < steps.length) {
          const step = steps[index++];
          addLine(step[0], step[1]);
          timer = setTimeout(next, delay);
        } else {
          status.textContent = 'Симуляция завершена';
          footer.textContent = 'Это только сценарий интерфейса — реальная система не запускалась.';
          startButton.disabled = false;
          timer = null;
        }
      }
      next();
    });
  }
})();
