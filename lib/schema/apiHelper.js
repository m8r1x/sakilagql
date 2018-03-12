"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const dataloader_1 = __importDefault(require("dataloader"));
const api_1 = require("../api");
const localUrlLoader = new dataloader_1.default((urls) => Promise.all(urls.map(api_1.getFromLocalUrl)));
function objectWithId(obj) {
    obj.id = parseInt(obj.url.split('/')[5], 10);
    return obj;
}
function getObjectFromUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield localUrlLoader.load(url);
        return objectWithId(data);
    });
}
exports.getObjectFromUrl = getObjectFromUrl;
function getObjectFromTypeAndId(type, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield getObjectFromUrl(`http://localhost:8000/api/${type}/${id}/`);
    });
}
exports.getObjectFromTypeAndId = getObjectFromTypeAndId;
function getObjectByType(type) {
    return __awaiter(this, void 0, void 0, function* () {
        let objects = [];
        let nextUrl = `http://localhost:8000/api/${type}/`;
        while (nextUrl) {
            const pageData = yield localUrlLoader.load(nextUrl);
            objects = objects.concat(pageData.results.map(objectWithId));
            nextUrl = pageData.next;
        }
        objects = sortObjectsById(objects);
        return { objects, totalCount: objects.length };
    });
}
exports.getObjectByType = getObjectByType;
function getObjectFromUrls(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        const array = yield Promise.all(urls.map(getObjectFromUrl));
        return sortObjectsById(array);
    });
}
exports.getObjectFromUrls = getObjectFromUrls;
function sortObjectsById(array) {
    return array.sort((a, b) => a.id - b.id);
}
function convertToNumber(value) {
    if (['unknown', 'n/a'].indexOf(value) !== -1) {
        return null;
    }
    const numberString = value.replace(/,/, '');
    return Number(numberString);
}
exports.convertToNumber = convertToNumber;
