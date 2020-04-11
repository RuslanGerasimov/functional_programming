/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
    allPass,
    ifElse,
    gt,
    lt,
    partial,
    partialRight,
    prop,
    tap,
    test,
    compose,
    equals,
    always,
    concat,
    when, applySpec, identity, flip, toString, has
} from "ramda";

const api = new Api();


const stringLength = (string) => string.length;

//При первом вызове возврвщаем функцию редюсер. При втором - запускаем функцию с аргументом
const composeAsync = function() {
    const funcs = [...arguments].reverse();
    return (currentData) => {
        return funcs.reduce(async (res, f) => {
            if(res instanceof Promise) {
                let result = null;
                try {
                    result = await res;
                } catch (e) {
                    if(typeof e === 'object') {
                        result = {error: JSON.stringify(e)};
                    } else {
                        result = { error: e };
                    }
                }
                return f(result);
            } else {
                return f(res)
            }
        }, currentData);
    }
};


const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const numberConverter = api.get('https://api.tech/numbers/base');
    const writeLogTapped = tap(writeLog);
    const animalEndPoint = 'https://animals.tech/';
    const fetchAnimal = flip(api.get)({stub: true});

    ifElse(
        allPass([
            compose(lt(2), stringLength),
            compose(gt(10), stringLength),
            test(/^(([1-9][0-9]*)|0)(\.\d+)?$/s)
        ]),
        composeAsync(
            ifElse(
                has('error'),
                compose(handleError, prop('error')),
                compose(
                    composeAsync(
                        ifElse(
                            has('error'),
                            compose(handleError, prop('error')),
                            compose(
                                handleSuccess,
                                prop('result'),
                            )
                        ),
                        fetchAnimal
                    ),
                    compose(concat(animalEndPoint), toString),
                    writeLogTapped,
                    (a) => a % 3,
                    writeLogTapped,
                    partialRight(Math.pow, [2]),
                    writeLogTapped,
                    stringLength,
                    writeLogTapped,
                    prop('result')
                )
            ),
            numberConverter,
            applySpec({
                from: always(10),
                to: always(2),
                number: identity
            }),
            writeLogTapped,
            when(equals(0), always(1)),
            Math.round
        ),
        partial(handleError, ['ValidationError'])
    )(value);
};

export default processSequence;
