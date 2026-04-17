/**
 * Tafqeet: Multi-language Number to Words Converter
 * Supports: Arabic (ar), English (en), Urdu (ur)
 * Optimized for Saudi Riyal (SR) and Halala context.
 */

// --- Arabic Constants ---
const arOnes = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
const arTens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
const arHundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
const arThousands = ["", "ألف", "ألفان", "آلاف", "ألف"];
const arMillions = ["", "مليون", "مليونان", "ملايين", "مليون"];
const arBillions = ["", "مليار", "ملياران", "مليارات", "مليار"];

function convertArGroup(n: number): string {
    let res = "";
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;

    if (h > 0) res += arHundreds[h];
    if (t > 0 || o > 0) {
        if (res !== "") res += " و";
        if (t < 2) res += arOnes[t * 10 + o];
        else {
            res += arOnes[o];
            if (o > 0 && t > 0) res += " و";
            res += arTens[t];
        }
    }
    return res;
}

// --- English Constants ---
const enOnes = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const enTens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function convertEnGroup(n: number): string {
    let res = "";
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;

    if (h > 0) res += enOnes[h] + " Hundred";
    if (t > 0 || o > 0) {
        if (res !== "") res += " and ";
        if (t < 2) res += enOnes[t * 10 + o];
        else {
            res += enTens[t];
            if (o > 0) res += "-" + enOnes[o];
        }
    }
    return res;
}

// --- Urdu Constants ---
const urOnes = ["", "ایک", "دو", "تین", "چار", "پانچ", "چھ", "سات", "آٹھ", "نو", "دس", "گیارہ", "بارہ", "تیرہ", "چودہ", "پندرہ", "سولہ", "سترہ", "اٹھارہ", "انیس"];
const urTens = ["", "دس", "بیس", "تیس", "چالیس", "پچاس", "ساٹھ", "ستر", "اسی", "نوے"];

function convertUrGroup(n: number): string {
    let res = "";
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;

    if (h > 0) res += urOnes[h] + " سو";
    if (t > 0 || o > 0) {
        if (res !== "") res += " اور ";
        if (t < 2) res += urOnes[t * 10 + o];
        else {
            res += urTens[t];
            if (o > 0) res += " " + urOnes[o];
        }
    }
    return res;
}

// --- Main Functions ---

function tafqeetAr(n: number): string {
    if (n === 0) return "صفر";
    const parts = n.toFixed(2).split(".");
    const integerPart = parseInt(parts[0]);
    const fractionPart = parseInt(parts[1]);

    let res = "";
    const b = Math.floor(integerPart / 1000000000);
    const m = Math.floor((integerPart % 1000000000) / 1000000);
    const k = Math.floor((integerPart % 1000000) / 1000);
    const h = integerPart % 1000;

    if (b > 0) res += (b === 1 ? "مليار" : b === 2 ? "ملياران" : convertArGroup(b) + " " + (b >= 3 && b <= 10 ? arBillions[3] : arBillions[4]));
    if (m > 0) {
        if (res !== "") res += " و";
        res += (m === 1 ? "مليون" : m === 2 ? "مليونان" : convertArGroup(m) + " " + (m >= 3 && m <= 10 ? arMillions[3] : arMillions[4]));
    }
    if (k > 0) {
        if (res !== "") res += " و";
        res += (k === 1 ? "ألف" : k === 2 ? "ألفان" : convertArGroup(k) + " " + (k >= 3 && k <= 10 ? arThousands[3] : arThousands[4]));
    }
    if (h > 0) {
        if (res !== "") res += " و";
        res += convertArGroup(h);
    }

    if (integerPart > 0) res += " ريالاً";
    if (fractionPart > 0) {
        if (res !== "") res += " و";
        res += convertArGroup(fractionPart) + (fractionPart >= 3 && fractionPart <= 10 ? " هللات" : " هللة");
    }
    return res.trim() + " فقط لا غير";
}

function tafqeetEn(n: number): string {
    if (n === 0) return "Zero";
    const parts = n.toFixed(2).split(".");
    const integerPart = parseInt(parts[0]);
    const fractionPart = parseInt(parts[1]);

    let res = "";
    const b = Math.floor(integerPart / 1000000000);
    const m = Math.floor((integerPart % 1000000000) / 1000000);
    const k = Math.floor((integerPart % 1000000) / 1000);
    const h = integerPart % 1000;

    if (b > 0) res += convertEnGroup(b) + " Billion ";
    if (m > 0) res += convertEnGroup(m) + " Million ";
    if (k > 0) res += convertEnGroup(k) + " Thousand ";
    if (h > 0) res += convertEnGroup(h);

    if (integerPart > 0) res += " Riyals";
    if (fractionPart > 0) {
        if (res !== "") res += " and ";
        res += convertEnGroup(fractionPart) + " Halalas";
    }
    return res.trim() + " Only";
}

function tafqeetUr(n: number): string {
    if (n === 0) return "صفر";
    const parts = n.toFixed(2).split(".");
    const integerPart = parseInt(parts[0]);
    const fractionPart = parseInt(parts[1]);

    let res = "";
    const b = Math.floor(integerPart / 1000000000);
    const m = Math.floor((integerPart % 1000000000) / 1000000);
    const k = Math.floor((integerPart % 1000000) / 1000);
    const h = integerPart % 1000;

    if (b > 0) res += convertUrGroup(b) + " بلین ";
    if (m > 0) res += convertUrGroup(m) + " ملین ";
    if (k > 0) res += convertUrGroup(k) + " ہزار ";
    if (h > 0) res += convertUrGroup(h);

    if (integerPart > 0) res += " ریال";
    if (fractionPart > 0) {
        if (res !== "") res += " اور ";
        res += convertUrGroup(fractionPart) + " حلالہ";
    }
    return res.trim() + " صرف";
}

export function tafqeet(num: number | string, lang: "ar" | "en" | "ur" = "ar"): string {
    const n = Number(num);
    if (isNaN(n)) return "";
    
    switch (lang) {
        case "en": return tafqeetEn(n);
        case "ur": return tafqeetUr(n);
        default: return tafqeetAr(n);
    }
}
