(function () {
const elementData = `
H|Водород|1.008
He|Хелий|4.0026
Li|Литий|6.94
Be|Берилий|9.0122
B|Бор|10.81
C|Въглерод|12.011
N|Азот|14.007
O|Кислород|15.999
F|Флуор|18.998
Ne|Неон|20.180
Na|Натрий|22.990
Mg|Магнезий|24.305
Al|Алуминий|26.982
Si|Силиций|28.085
P|Фосфор|30.974
S|Сяра|32.06
Cl|Хлор|35.45
Ar|Аргон|39.948
K|Калий|39.098
Ca|Калций|40.078
Sc|Скандий|44.956
Ti|Титан|47.867
V|Ванадий|50.942
Cr|Хром|51.996
Mn|Манган|54.938
Fe|Желязо|55.845
Co|Кобалт|58.933
Ni|Никел|58.693
Cu|Мед|63.546
Zn|Цинк|65.38
Ga|Галий|69.723
Ge|Германий|72.630
As|Арсен|74.922
Se|Селен|78.971
Br|Бром|79.904
Kr|Криптон|83.798
Rb|Рубидий|85.468
Sr|Стронций|87.62
Y|Итрий|88.906
Zr|Цирконий|91.224
Nb|Ниобий|92.906
Mo|Молибден|95.95
Tc|Технеций|[98]
Ru|Рутений|101.07
Rh|Родий|102.91
Pd|Паладий|106.42
Ag|Сребро|107.87
Cd|Кадмий|112.41
In|Индий|114.82
Sn|Калай|118.71
Sb|Антимон|121.76
Te|Телур|127.60
I|Йод|126.90
Xe|Ксенон|131.29
Cs|Цезий|132.91
Ba|Барий|137.33
La|Лантан|138.91
Ce|Церий|140.12
Pr|Празеодим|140.91
Nd|Неодим|144.24
Pm|Прометий|[145]
Sm|Самарий|150.36
Eu|Европий|151.96
Gd|Гадолиний|157.25
Tb|Тербий|158.93
Dy|Диспрозий|162.50
Ho|Холмий|164.93
Er|Ербий|167.26
Tm|Тулий|168.93
Yb|Итербий|173.05
Lu|Лутеций|174.97
Hf|Хафний|178.49
Ta|Тантал|180.95
W|Волфрам|183.84
Re|Рений|186.21
Os|Осмий|190.23
Ir|Иридий|192.22
Pt|Платина|195.08
Au|Злато|196.97
Hg|Живак|200.59
Tl|Талий|204.38
Pb|Олово|207.2
Bi|Бисмут|208.98
Po|Полоний|[209]
At|Астат|[210]
Rn|Радон|[222]
Fr|Франций|[223]
Ra|Радий|[226]
Ac|Актиний|[227]
Th|Торий|232.04
Pa|Протактиний|231.04
U|Уран|238.03
Np|Нептуний|[237]
Pu|Плутоний|[244]
Am|Америций|[243]
Cm|Кюрий|[247]
Bk|Берклий|[247]
Cf|Калифорний|[251]
Es|Айнщайний|[252]
Fm|Фермий|[257]
Md|Менделевий|[258]
No|Нобелий|[259]
Lr|Лоуренсий|[266]
Rf|Ръдърфордий|[267]
Db|Дубний|[268]
Sg|Сиборгий|[269]
Bh|Борий|[270]
Hs|Хасий|[269]
Mt|Майтнерий|[278]
Ds|Дармщадтий|[281]
Rg|Рьонтгений|[282]
Cn|Коперниций|[285]
Nh|Нихоний|[286]
Fl|Флеровий|[289]
Mc|Московий|[290]
Lv|Ливерморий|[293]
Ts|Тенесин|[294]
Og|Оганесон|[294]
`.trim().split('\n').map(function (line) {
    return line.trim().split('|');
});

const categorySets = {
    alkali: new Set([3, 11, 19, 37, 55, 87]),
    alkaline: new Set([4, 12, 20, 38, 56, 88]),
    metalloid: new Set([5, 14, 32, 33, 51, 52, 84]),
    nonmetal: new Set([1, 6, 7, 8, 15, 16, 34]),
    halogen: new Set([9, 17, 35, 53, 85, 117]),
    noble: new Set([2, 10, 18, 36, 54, 86, 118])
};

const categoryNames = {
    alkali: 'Алкален метал',
    alkaline: 'Алкалоземен метал',
    transition: 'Преходен метал',
    'post-transition': 'Друг метал',
    metalloid: 'Полуметал',
    nonmetal: 'Неметал',
    halogen: 'Халоген',
    noble: 'Благороден газ',
    lanthanide: 'Лантаноид',
    actinide: 'Актиноид'
};

const groupValencies = {
    1: 'I',
    2: 'II',
    13: 'III',
    14: 'II, IV',
    15: 'III, V',
    16: 'II, IV, VI',
    17: 'I, III, V, VII',
    18: '0'
};
const elementValencies = {
    2: '0',
    8: 'II',
    9: 'I',
    10: '0',
    18: '0',
    19: 'I',
    20: 'II',
    21: 'III',
    22: 'II, III, IV',
    23: 'II, III, IV, V',
    24: 'II, III, VI',
    25: 'II, III, IV, VI, VII',
    26: 'II, III',
    27: 'II, III',
    28: 'II, III',
    29: 'I, II',
    30: 'II',
    35: 'I, III, V, VII',
    36: '0',
    39: 'III',
    40: 'IV',
    41: 'III, V',
    42: 'II, III, IV, V, VI',
    43: 'IV, V, VII',
    44: 'II, III, IV, VI, VIII',
    45: 'I, III',
    46: 'II, IV',
    47: 'I',
    48: 'II',
    54: '0, II, IV, VI, VIII',
    57: 'III',
    58: 'III, IV',
    59: 'III, IV',
    60: 'III',
    61: 'III',
    62: 'II, III',
    63: 'II, III',
    64: 'III',
    65: 'III, IV',
    66: 'III',
    67: 'III',
    68: 'III',
    69: 'II, III',
    70: 'II, III',
    71: 'III',
    72: 'IV',
    73: 'V',
    74: 'II, III, IV, V, VI',
    75: 'II, III, IV, VI, VII',
    76: 'II, III, IV, VI, VIII',
    77: 'I, III, IV',
    78: 'II, IV',
    79: 'I, III',
    80: 'I, II',
    86: '0',
    87: 'I',
    88: 'II',
    89: 'III',
    90: 'IV',
    91: 'IV, V',
    92: 'III, IV, V, VI',
    93: 'III, IV, V, VI, VII',
    94: 'III, IV, V, VI',
    95: 'III, IV, V, VI',
    96: 'III, IV',
    97: 'III, IV',
    98: 'II, III, IV',
    99: 'III',
    100: 'II, III',
    101: 'II, III',
    102: 'II, III',
    103: 'III',
    104: 'IV',
    105: 'V',
    106: 'VI',
    107: 'VII',
    108: 'VIII'
};

function range(start, end) {
    return Array.from({ length: end - start + 1 }, function (_, index) {
        return start + index;
    });
}

const layoutRows = [
    { row: 1, numbers: [1, 2], groups: [1, 18] },
    { row: 2, numbers: range(3, 10), groups: [1, 2, 13, 14, 15, 16, 17, 18] },
    { row: 3, numbers: range(11, 18), groups: [1, 2, 13, 14, 15, 16, 17, 18] },
    { row: 4, numbers: range(19, 36), groups: range(1, 18) },
    { row: 5, numbers: range(37, 54), groups: range(1, 18) },
    { row: 6, numbers: [55, 56, 57].concat(range(72, 86)), groups: [1, 2, 3].concat(range(4, 18)) },
    { row: 7, numbers: [87, 88, 89].concat(range(104, 118)), groups: [1, 2, 3].concat(range(4, 18)) }
];
const positions = {};
layoutRows.forEach(function (period) {
    period.numbers.forEach(function (number, index) {
        positions[number] = { row: period.row, group: period.groups[index] };
    });
});
range(58, 71).forEach(function (number, index) {
    positions[number] = { row: 8, group: null, column: index + 4 };
});
range(90, 103).forEach(function (number, index) {
    positions[number] = { row: 9, group: null, column: index + 4 };
});

function getCategory(number) {
    if (number >= 57 && number <= 71) return 'lanthanide';
    if (number >= 89 && number <= 103) return 'actinide';
    if (categorySets.alkali.has(number)) return 'alkali';
    if (categorySets.alkaline.has(number)) return 'alkaline';
    if (categorySets.metalloid.has(number)) return 'metalloid';
    if (categorySets.nonmetal.has(number)) return 'nonmetal';
    if (categorySets.halogen.has(number)) return 'halogen';
    if (categorySets.noble.has(number)) return 'noble';
    if ((number >= 21 && number <= 30) || (number >= 39 && number <= 48) ||
        (number >= 72 && number <= 80) || (number >= 104 && number <= 112)) {
        return 'transition';
    }
    return 'post-transition';
}

const gases = new Set([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86]);
const liquids = new Set([35, 80]);
const elements = elementData.map(function (entry, index) {
    const number = index + 1;
    const position = positions[number];
    const category = getCategory(number);
    return {
        symbol: entry[0],
        name: entry[1],
        mass: entry[2],
        number: number,
        category: category,
        period: position.row > 7 ? position.row - 2 : position.row,
        group: position.group,
        row: position.row,
        col: position.column || position.group,
        state: number >= 104 ? 'Неизвестно' : gases.has(number) ? 'Газ' : liquids.has(number) ? 'Течност' : 'Твърдо',
        valency: elementValencies[number] || (number >= 104 ? 'Неустановена' : groupValencies[position.group] || 'III')
    };
});

window.periodicTableElements = elements;
const table = document.getElementById('periodicTable');
if (!table) return;

const searchInput = document.getElementById('elementSearch');
const searchStatus = document.getElementById('searchStatus');
const elementButtons = [];
const seriesLabels = {};

function createPeriodicTable() {
    table.replaceChildren();

    [
        { label: 'Лантаноиди', row: 8 },
        { label: 'Актиноиди', row: 9 }
    ].forEach(function (series) {
        const label = document.createElement('div');
        label.className = 'series-label';
        label.textContent = series.label;
        label.style.gridColumn = '1 / span 3';
        label.style.gridRow = series.row;
        seriesLabels[series.row] = label;
        table.appendChild(label);
    });

    elements.forEach(function (element) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'element ' + element.category;
        button.style.gridColumn = element.col;
        button.style.gridRow = element.row;
        button.setAttribute('aria-label', element.number + '. ' + element.name + ', ' + element.symbol + ', атомна маса ' + element.mass);
        button.title = element.name;
        button.dataset.search = (element.name + ' ' + element.symbol).toLocaleLowerCase('bg');

        const number = document.createElement('span');
        number.className = 'element-number';
        number.textContent = element.number;
        const mass = document.createElement('span');
        mass.className = 'element-mass';
        mass.textContent = element.mass;
        const symbol = document.createElement('span');
        symbol.className = 'element-symbol';
        symbol.textContent = element.symbol;
        const name = document.createElement('span');
        name.className = 'element-name';
        name.textContent = element.name;
        button.append(number, mass, symbol, name);

        button.addEventListener('click', function () {
            showDetails(element, button);
        });
        elementButtons.push(button);
        table.appendChild(button);
    });
}

function showDetails(element, button) {
    document.querySelectorAll('.element.selected').forEach(function (item) {
        item.classList.remove('selected');
    });
    button.classList.add('selected');
    document.getElementById('selectedName').textContent = element.name + ' (' + element.symbol + ')';
    document.getElementById('selectedDescription').textContent = 'Елемент №' + element.number + ' в периодичната таблица.';
    document.getElementById('detailsGrid').style.display = 'grid';
    document.getElementById('symbol').textContent = element.symbol;
    document.getElementById('atomicNumber').textContent = element.number;
    document.getElementById('atomicMass').textContent = element.mass + ' u';
    document.getElementById('valency').textContent = element.valency;
    document.getElementById('type').textContent = categoryNames[element.category];
    document.getElementById('position').textContent = element.group
        ? 'Период ' + element.period + ', група ' + element.group
        : 'Период ' + element.period + ', ' + categoryNames[element.category].toLocaleLowerCase('bg');
    document.getElementById('state').textContent = element.state;
}

function filterElements() {
    const query = searchInput.value.trim().toLocaleLowerCase('bg');
    let visibleCount = 0;
    elementButtons.forEach(function (button) {
        const matches = button.dataset.search.includes(query);
        button.hidden = !matches;
        if (matches) visibleCount += 1;
    });
    seriesLabels[8].hidden = !elements.some(function (element) {
        return element.row === 8 && (element.name + ' ' + element.symbol).toLocaleLowerCase('bg').includes(query);
    });
    seriesLabels[9].hidden = !elements.some(function (element) {
        return element.row === 9 && (element.name + ' ' + element.symbol).toLocaleLowerCase('bg').includes(query);
    });
    searchStatus.textContent = query
        ? 'Намерени елементи: ' + visibleCount
        : 'Показани са всички ' + elements.length + ' елемента.';
}

searchInput.addEventListener('input', filterElements);
createPeriodicTable();
filterElements();
})();
