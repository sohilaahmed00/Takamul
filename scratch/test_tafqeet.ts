import { tafqeet } from "../src/utils/tafqeet";

const tests = [
    { num: 341.055, langs: ["ar", "en", "ur"] },
    { num: 1000, langs: ["ar", "en", "ur"] },
];

tests.forEach(test => {
    test.langs.forEach(lang => {
        console.log(`${test.num} (${lang}) => ${tafqeet(test.num, lang as any)}`);
    });
});
