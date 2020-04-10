/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
    allPass,
    compose,
    props,
    partialRight,
    prop,
    keys,
    length,
    has,
    not,
    invert,
    equals,
    lte,
    includes,
    uniq,
    map,
    filter,
    toPairs
} from "ramda";
const FIGURE_STAR = 'star';
const FIGURE_SQUARE = 'square';
const FIGURE_TRIANGLE = 'triangle';
const FIGURE_CIRCLE = 'circle';

const white = 'white';
const green = 'green';
const blue = 'blue';
const red = 'red';
const orange = 'orange';


const allFiguresAreOfSameColor = (color) => {
    return allPass([
        compose(has(orange), invert),
        compose(equals(1), length, keys, invert),
    ])
};


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (data) => {
    return allPass([
        compose(equals(red), prop(FIGURE_STAR)),
        compose(equals(green), prop(FIGURE_SQUARE)),
        compose(lte(2), length, prop(white), invert),
    ])(data);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (data) => {
    return compose(lte(2), length, prop(green), invert)(data);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (data) => {
    const equalArray = (arr) => equals(...arr);
    return  compose(equalArray, map(length), props([red, blue]), invert)(data);
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (data) => {
    return allPass([
        compose(equals(red), prop(FIGURE_STAR)),
        compose(equals(blue), prop(FIGURE_CIRCLE)),
        compose(equals(orange), prop(FIGURE_SQUARE)),
    ])(data);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (data) => {
    return compose(equals(1), length, filter((arr) => arr[0] !== white && arr[1].length >= 3), toPairs, invert)(data)
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (data) => {
    return allPass([
        compose(equals(2), length, prop(green), invert),
        compose(equals(green), prop(FIGURE_TRIANGLE)),
        compose(equals(1), length, prop(red), invert)
    ])(data)
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (data) => {
    return compose(allFiguresAreOfSameColor(orange))(data);
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = (data) => {
    const includeWhiteOrRed = partialRight(includes, [[white, red]]);
    return compose(not, includeWhiteOrRed, prop(FIGURE_STAR))(data)
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (data) => {
    return compose(allFiguresAreOfSameColor(green))(data);
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = (data) => {
    return allPass([
        compose(equals(1), length, uniq, props([FIGURE_TRIANGLE, FIGURE_SQUARE])),
        compose(not, equals(white), prop(FIGURE_TRIANGLE))
    ])(data)
};
