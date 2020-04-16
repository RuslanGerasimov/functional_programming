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
    toPairs, fromPairs, ifElse, identity, always, tap, flip
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

const checkIfHasOnlyColor = compose(equals(1), length, keys, invert);
const allFiguresAreOfSameColor = (color) => allPass([compose(has(color), invert), checkIfHasOnlyColor]);
const checkFigureColor = (figure, color) => compose(equals(color), prop(figure));
const getColorQuantity = (color) => compose(length, prop(color), invert);
const checkColorQuantityMoreEqual = (color, number) => compose(lte(number), getColorQuantity(color));
const checkColorQuantityEqual = (color, number) => compose(equals(number), getColorQuantity(color));

const getColorsQuantityMap = compose(map(length), invert);
const isRedStar = checkFigureColor(FIGURE_STAR, red);
const isGreenTriangle = checkFigureColor(FIGURE_TRIANGLE, green);
const isGreenSquare = checkFigureColor(FIGURE_SQUARE, green);
const isBlueCircle = checkFigureColor(FIGURE_CIRCLE, blue);
const isOrangeSquare = checkFigureColor(FIGURE_SQUARE, orange);
const isWhiteMoreEqualTwo = checkColorQuantityMoreEqual(white, 2);
const isGreenMoreEqualTwo = checkColorQuantityMoreEqual(green, 2);
const isGreenEqualTwo = checkColorQuantityEqual(green, 2);
const isRedEqualOne = checkColorQuantityEqual(red, 1);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isRedStar, isGreenSquare, isWhiteMoreEqualTwo]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = isGreenMoreEqualTwo;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose((arr) => equals(...arr), props([red, blue]), getColorsQuantityMap);

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = allPass([isRedStar, isBlueCircle, isOrangeSquare]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    not,
    has(white),
    fromPairs,
    ifElse(
        compose(lte(1), length),
        identity,
        always([[white, 3]])
    ),
    filter((ar) => ar[1] >= 3),
    toPairs,
    getColorsQuantityMap
);

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = allPass([isGreenEqualTwo, isRedEqualOne, isGreenTriangle]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allFiguresAreOfSameColor(orange);

// 8. Не красная и не белая звезда.
export const validateFieldN8 = compose(not, flip(includes)([white, red]), prop(FIGURE_STAR));

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(allFiguresAreOfSameColor(green));

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = allPass([
    compose(equals(1), length, uniq, props([FIGURE_TRIANGLE, FIGURE_SQUARE])),
    compose(not, equals(white), prop(FIGURE_TRIANGLE))
]);
