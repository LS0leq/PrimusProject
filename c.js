/*
############################################
#                                          #
#  This file includes C.JS framework core  #
#     Distributed under MS-RSL license     #
#                                          #
#    Any changes or other distributions    #
#        requires author agreement         #
#                                          #
#          Created by technic404           #
#      https://github.com/technic404       #
#                                          #
############################################
*/

/**
 * Class ment to be implemented into other readers.
 * 
 * Detects basic comment checks and provides text with or without it.
 */
class BaseReader {
    comment = {
        multipleLineEnabled: true,
        opening: "<!--",
        closing: "-->",
        ignoreInString: true,
        singleLineEnabled: false,
        singleLine: "//"
    }

    stringChars = [
        "\"", "'"
    ]

    loop = {
        comment: {
            multipleLineOpened: false,
            singleLineOpened: false
        },
        string: {
            openingChar: "",
            opened: false
        },
        skipChars: 0,
        char: "",
        text: ""
    }

    /**
     * String to analyze input
     * @param {string} source 
     */
    constructor(source) {
        this.source = source;
    }

    /**
     * @param {[]} array 
     * @param {number} index 
     * @returns {boolean}
     */
    _isOutOfBounds(array, index) {
        return array.length <= index + 1;;
    }

    /**
     * Checks if string chars is one by one next chars in the array
     * @param {string} toMatch 
     * @param {[]} array 
     * @param {boolean} logNext 
     * @returns {boolean}
     */
    _matchNextChars(toMatch, array, logNext = false) {
        if(toMatch === undefined) return false;

        const chars = toMatch.split("");

        if(logNext) console.log(`Comparsion: "${toMatch}" with "${array.slice(0, toMatch.length).join("")}"`);

        const charByChar = [];

        const logCharByChar = () => {
            if(!logNext) return;

            console.log("Char by char comparsion:", charByChar.map(e => `"${e.matchChar}" ${e.matchChar === e.arrayChar ? "==" : "!="} "${e.arrayChar}"`).join(", "));
        }

        for(let j = 0; j < chars.length; j++) {
            const char = chars[j];
            const nextStringCharIndex = j;

            if(this._isOutOfBounds(array, nextStringCharIndex)) {
                logCharByChar();
                return false;
            }

            const nextStringChar = array[nextStringCharIndex];

            charByChar.push({ matchChar: char, arrayChar: nextStringChar });

            if(nextStringChar !== char) {
                logCharByChar();
                return false;
            }
        }

        logCharByChar();

        return true;
    }

    /**
     * Reads string ignoring the comments sections with checks if the comment is in string to exclude comment or include comment
     * @example <div attr="Hello<!-- world -->"></div>
     * @description 
     * Everything from example above will be included
     * Other scenario when comment in string check is disabled, then this div will be readen like this:
     * @example <div attr="Hello"></div>
     * @param {(char: string, index: number, matchNextChars: (text: string, logNext?: boolean) => boolean) => void} callback 
     * @returns {string}
     */
    _read(callback = () => {}) {
        const { comment, loop } = this;
        const splitted = this.source.split("");
        let text = '';

        for(let i = 0; i < splitted.length; i++) {
            loop.char = splitted[i];
            
            if(loop.skipChars > 0) {
                loop.skipChars--;
                continue;
            }

            if(comment.multipleLineEnabled && this._matchNextChars(comment.closing, splitted.slice(i)) && loop.comment.multipleLineOpened) {
                loop.comment.multipleLineOpened = false;
                loop.skipChars = comment.closing.length - 1;
                continue;
            }

            if(comment.singleLineEnabled && loop.comment.singleLineOpened && this._matchNextChars("\n", splitted.slice(i))) {
                loop.comment.singleLineOpened = false;
                loop.skipChars = 1;
                continue;
            }

            if(loop.comment.multipleLineOpened || loop.comment.singleLineOpened) continue;

            if(loop.string.opened && loop.char === loop.string.openingChar) {
                loop.string.opened = false;
                loop.string.openingChar = '';
                text += loop.char;
                continue;
            }

            if(this.stringChars.includes(loop.char) && !loop.string.opened) {
                loop.string.opened = true;
                loop.string.openingChar = loop.char;
            }

            if(comment.singleLineEnabled && this._matchNextChars(comment.singleLine, splitted.slice(i)) && !loop.string.opened) {
                loop.comment.singleLineOpened = true;
                continue;
            }

            if(comment.multipleLineEnabled && this._matchNextChars(comment.opening, splitted.slice(i))) {
                if(loop.string.multipleLineOpened && comment.ignoreInString) {
                    text += loop.char;
                    continue;
                }

                loop.comment.multipleLineOpened = true;
                continue;
            }

            text += loop.char;
        }

        const textSplit = text.split("");

        const passCallback = (char, i) => {
            callback(char, i, (toMatch, logNext = false) => {
                if(toMatch === undefined) return false;

                return this._matchNextChars(toMatch, textSplit.slice(i), logNext);
            });
        }
        
        for(let i = 0; i < textSplit.length; i++) {
            const char = textSplit[i];

            if(loop.string.opened && char === loop.string.openingChar) {
                loop.string.opened = false;
                loop.string.openingChar = '';

                passCallback(char, i);
                continue;
            }

            if(this.stringChars.includes(char) && !loop.string.opened) {
                loop.string.opened = true;
                loop.string.openingChar = char;

                passCallback(char, i);
                continue;
            }

            passCallback(char, i);
        }

        return text;
    }
}


class CssReader extends BaseReader {
    comment = {
        multipleLineEnabled: true,
        opening: "/*",
        closing: "*/",
        ignoreInString: true,
        singleLineEnabled: false,
    }

    /**
     * Css text
     * @param {string} css 
     */
    constructor(css) {
        super(css);
    }

    /**
     * Provides selector with its contents
     * @returns {Object.<string, string>}
     */
    read() {
        const rules = {};
        let isBracketOpened = false;
        let nestedBrackets = 0;
        let tempText = '';
        let selector = '';

        const replaceNewLines = (str) => { return str.replaceAll("\n", ""); }

        this._read((char) => {
            const loop = this.loop;
            
            if(char === '{' && !isBracketOpened && !loop.string.opened) {
                isBracketOpened = true;
                selector = replaceNewLines(tempText);
                tempText = '';
    
                if(!(selector in rules)) rules[selector] = '';
                
                return;
            }
    
            if(!isBracketOpened) { tempText += char; return; }
            
            if(char === '{' && isBracketOpened && !loop.string.opened) { nestedBrackets++; }
    
            if(char === '}' && nestedBrackets > 0 && !loop.string.opened) {
                nestedBrackets--;
                tempText += char;
                return;
            }
    
            if(char === '}' && nestedBrackets === 0 && !loop.string.opened) {
                rules[selector] = replaceNewLines(tempText);
                selector = '';
                tempText = '';
                isBracketOpened = false;
                return;
            }
    
            tempText += char;
        });
    

        return rules;
    }
}


class CssStylePropertiesReader extends BaseReader {
    comment = {
        multipleLineEnabled: true,
        opening: "/*",
        closing: "*/",
        ignoreInString: true,
        singleLineEnabled: false,
    }

    /**
     * Css selector style
     * @param {string} css 
     */
    constructor(css) {
        super(css);
    }

    /**
     * Returns properties names and its values inside the css selector
     * @returns {Object.<string, string>}
     */
    read() {
        const replaceNewLines = (str) => { return str.replaceAll("\n", ""); }

        this.source = replaceNewLines(this.source);

        const properties = {};

        const tempProperty = {
            name: '', 
            value: '', 
            /** @type {"name"|"value"} */
            reading: 'name',
            _parse: () => {
                tempProperty.name = tempProperty.name.replaceAll(" ", "");
                tempProperty.value = tempProperty.value.trim();
            },
            _reset: () => {
                tempProperty.name = '';
                tempProperty.value = '';
                tempProperty.reading = 'name';
            }
        }

        this._read((char) => {
            const { loop } = this;

            const endRead = char === ";" && !loop.string.opened && tempProperty.reading === "value";

            if(endRead) {
                tempProperty._parse();

                const { name, value } = tempProperty;

                properties[name] = value;

                tempProperty._reset();
                return;
            }

            const startReadValue = char === ":" && !loop.string.opened && tempProperty.reading === "name"

            if(startReadValue) {
                tempProperty.reading = 'value';
                return;
            }

            const readValue = tempProperty.reading === "value";

            if(readValue) {
                tempProperty.value += char;
                return;
            }

            const readName = tempProperty.reading === "name";

            if(readName) {
                tempProperty.name += char;
            }
        });
        
        return properties;
    }
}



const CjsStyle = {
    RootVariables: {
        /**
         * Adds properties to RootVariable object
         * @param {Object.<string, string>} properties 
         */
        _addProperties: (properties) => {
            for(const [name, value] of Object.entries(properties)) {
                CjsStyle.RootVariables[name.trim()] = value;
            }
        }
    },
    /**
     * Adds style to website
     * @param {string} path 
     */
    importStyle: async (path) => {
        const request = await new CjsRequest(path, "get").doRequest();

        if(request.isError()) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Error occurred while importing style (${Colors.Yellow}${path}${Colors.None})`);
        }

        const text = request.text();
        const style = document.head.querySelector(`[id="${CJS_STYLE_PREFIX}"]`);

        style.innerHTML += addPrefixToSelectors(text);
    }
}

/**
 * @param {string} cssText
 * @param {string} prefix
 * @param {CjsStyleImportOptions} options
 * @return {string}
 */
function addPrefixToSelectors(cssText, prefix = '', options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true }) {
    const rules = new CssReader(cssText).read();

    let newRules = [];

    const getModifiedRules = (selector, cssText) => {
        selector = selector.trim();
        const fullCssText = `${selector} { ${cssText} }`;

        if(selector.startsWith(":")) {
            const isRoot = selector.startsWith(":root");

            if(isRoot) {
                const properties = new CssStylePropertiesReader(cssText).read();

                CjsStyle.RootVariables._addProperties(properties);
            }

            return [fullCssText];
        }

        return selector.split(',').map(sel => {
            const selectorFirstChar = sel.trim().substring(0, 1);
            const isSelectorClassOrId = selectorFirstChar === "." || selectorFirstChar === "#";
            const selectors = [`${prefix}${(isSelectorClassOrId ? '': ' ')}${sel.trim()}`];
            
            // if(options.enableMultiSelector) {
            //     // selectors.push(`${prefix} > * ${sel.trim()}`);
            //     selectors.push(`${prefix} ${sel.trim()}`);
            // }

            if(!isSelectorClassOrId) {
                // Selector like button[cjsAttribute] { ... }
                const selectorTextSplit = selector.split(" ");
                const firstTag = selectorTextSplit[0];
                const rawRestSelector = selectorTextSplit.slice(1).join(" ");

                // like button:before or button::before
                const colonSelector = firstTag.includes(":") ? firstTag.slice(firstTag.indexOf(":")) : "";
                const parsedFirstTag = firstTag.replace(colonSelector, "");
                const restSelector = `${colonSelector} ${rawRestSelector}`;

                // like button:before, button:after
                const commaSeparatedRemainingSelectors = restSelector.split(",").map(e => e.trim()).slice(1);
                const commaSeparatedSelectors = restSelector.includes(",") ? commaSeparatedRemainingSelectors.map(e => {
                    const parts = [`${parsedFirstTag}${prefix}`, `${e.replace(parsedFirstTag, "")}`];
                    const createSpacing = !parts[1].startsWith(":");

                    return parts.join(createSpacing ? " " : "");
                }) : "";

                if(restSelector.includes(",")) {
                    selectors.push(`${parsedFirstTag}${prefix}${restSelector.replace(commaSeparatedRemainingSelectors, commaSeparatedSelectors)}`);
                } else {
                    selectors.push(`${parsedFirstTag}${prefix}${restSelector}`);
                }
            }

            return selectors;
        })
            .map(selectors => `${selectors.join(", ")} { ${cssText} }`)
            .flat();
    }

    const getModifiedRulesInside = ((selector, cssText) => {
        const rules = new CssReader(cssText).read();

        const newRules = [];

        for(const [selector, cssText] of Object.entries(rules)) {
            const modifiedRules = getModifiedRules(selector, cssText);

            newRules.push(...modifiedRules);
        }

        return newRules;
    });

    for (const [selector, cssText] of Object.entries(rules)) {
        const isEmptyRule = cssText.trim() === '';

        if(isEmptyRule) continue;

        const isMediaRule = selector.startsWith("@media");
        const isKeyFrameRule = selector.startsWith("@keyframes");
        const isRangeRule = selector.startsWith("@range"); // @range > 450px

        if(isRangeRule) {
            const parts = selector.split(" ");
            const determiner = parts[1];
            const value = parts[2];
            const isVariable = value.startsWith("var(") && value.endsWith(")");
            const mapping = {};

            if(isVariable) { // TODO, var() and calc() support inside @media (min-width: var(--variable-name))
                const variableName = value.slice(4, -1);

                if(!(variableName in CjsStyle.RootVariables)) {
                    console.log(`${CJS_PRETTY_PREFIX_X} @range selector error, used variable "${variableName}" that is not defined in none of the :root scopes`);
                    continue;
                }

                const variableValue = CjsStyle.RootVariables[variableName];

                mapping["<"] = `max-width: ${variableValue}`;
                mapping["<="] = `max-width: ${variableValue}`; // TODO, not exacly true
                mapping[">"] = `min-width: ${variableValue}`;
                mapping[">="] = `min-width: ${variableValue}`; // TODO, not excaly true
            } else {
                const valueParts = (() => {
                    let number = ``;
                    let unit = ``;
    
                    for(const char of value.split("")) {
                        if(isNaN(char)) {
                            unit += char;
                        } else {
                            number += char
                        }
                    }
    
                    return {
                        number: parseInt(number), unit
                    }
                })();
    
                const { number, unit } = valueParts;
    
                mapping["<"] = `max-width: ${number - 1}`;
                mapping["<="] = `max-width: ${number}`;
                mapping[">"] = `min-width: ${number + 1}`;
                mapping[">="] = `min-width: ${number}`;
    
                const addMappingUnits = (() => {
                    for(const [k, v] of Object.entries(mapping)) {
                        mapping[k] = v + unit;
                    }
                });
    
                addMappingUnits();
            }

            const mediaCss = `@media only screen and (${mapping[determiner]}) { ${getModifiedRulesInside(selector, cssText).join("\n")} }`;

            CjsDebug.Style.Media.push(mediaCss);

            newRules.push(mediaCss);

            continue;
        }

        if(isMediaRule) {
            const mediaCss = `${selector} { ${getModifiedRulesInside(selector, cssText).join("\n")} }`;

            CjsDebug.Style.Media.push(mediaCss);
            
            newRules.push(mediaCss);
            
            continue;
        }

        if (isKeyFrameRule) {
            const fullCssText = `${selector} { ${cssText} }`;

            newRules.push(fullCssText);
            continue;
        }

        if (options.prefixStyleRules) {
            const modifiedRules = getModifiedRules(selector, cssText);

            newRules.push(...modifiedRules);

            continue;
        }

        newRules.push(cssText);
    }

    return newRules.join(' ').replaceAll("\n", "");
}

const Colors = {
    None: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m"
};
const CJS_ID_LENGTH = 16;

const CJS_PRETTY_PREFIX = `${Colors.Yellow}${Colors.Underscore}[CJS]${Colors.None} `;
const CJS_PRETTY_PREFIX_X = `${CJS_PRETTY_PREFIX}${Colors.Red}✘ ${Colors.None}`;
const CJS_PRETTY_PREFIX_V = `${CJS_PRETTY_PREFIX}${Colors.Green}✔ ${Colors.None}`;
const CJS_PRETTY_PREFIX_I = `${CJS_PRETTY_PREFIX}${Colors.Yellow}⚠ ${Colors.None}`;

const CJS_PREFIX = "c_js-";

const CJS_STYLE_PREFIX = `${CJS_PREFIX}style-`;
const CJS_STYLE_FILTERS_PREFIX = `${CJS_PREFIX}filters-`;
const CJS_STYLE_KEYFRAMES_PREFIX = `${CJS_PREFIX}keyframes-`;
const CJS_STYLE_PLUGINS_PREFIX = `${CJS_PREFIX}plugins-`;
const CJS_ROOT_CONTAINER_PREFIX = `${CJS_PREFIX}root-`;
const CJS_COMPONENT_PREFIX = `${CJS_PREFIX}component-`;
const CJS_LAYOUT_PREFIX = `${CJS_PREFIX}layout-`;
const CJS_ELEMENT_PREFIX = `${CJS_PREFIX}element-`;
const CJS_ELEMENT_DISABLED_PREFIX = `${CJS_PREFIX}elementdisabled-`;
const CJS_OBSERVER_PREFIX = `${CJS_PREFIX}observer-`;

const CjsLazyElementPrefix = `${CJS_PREFIX}lazy-`;
const CjsLazyClassPrefix = "lazy:";

const CjsFrameworkEvents = { 
    /**
     * Executes when layout is being loaded to component
     * @param {CjsLayout} layout
     */
    onLoadLayout: (layout) => {}
};

const CjsTakenAttributes = {
    components: [],
    layouts: [],
    lazy: []
};

const Cjs = {};

const CjsDebug = {
    Style: {
        /** @type {string[]} Displays all the media rules used on the website */
        Media: []
    }
};
class CjsRunnable {
    constructor() {
        /** @type {{ compiled?: boolean, relativePathPosition?: number, tempWebServerPort?: number, style: { map: Map } }} */
        this.data = {};
    }

    /**
     * If runnable variable is present
     * @returns {boolean}
     */
    exists() {
        const runnableExists = typeof CjsRunnableDetails !== 'undefined';

        return runnableExists;
    }

    import() {
        if(!this.exists()) return;

        this.data = CjsRunnableDetails;
    }

    isCompiled() {
        return "compiled" in this.data && this.data.compiled;
    }

    getTempWebServerPort() {
        return this.data.tempWebServerPort;
    }

    hasStyle() { return ("style" in this.data) }
    
    isStyleValid() {
        return (
            this.hasStyle() &&
            ("map" in this.data.style)
        )
    }

    validateStyle() {
        if(!("map" in this.data.style)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Map is not present in runnable style configuration`)
        }
    }

    validate() {
        if(this.hasStyle()) {
            this.validateStyle();

            if("map" in this.data.style) {
                console.log(`${CJS_PRETTY_PREFIX_I}Please note that style compiler does not support import options: prefixStyleRules, encodeKeyframes, enableMultiSelector`)
            }
        }
    }
}

const cjsRunnable = new CjsRunnable();

cjsRunnable.import();
cjsRunnable.validate();
/**
 * To lower case (html naming friendly)
 * @param {number} length
 * @returns {string}
 */
function getRandomCharacters(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.toLowerCase(); // lower case is html naming friendly
    const charactersLength = characters.length;
    let counter = 0;

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }

    /**
     * @param {String} string
     * @return {boolean}
     */
    const isFirstCharacterANumber = (string) => { return !isNaN(string.substring(0, 1)); };

    while (isFirstCharacterANumber(result)) {
        result = getRandomCharacters(length);
    }

    return result;
}

/**
 * Creates unique number
 * @param {string} string
 * @return {number}
 */
function getUniqueNumberId(string) {
    let hash = 5381; // Initial hash value

    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = (hash * 33) ^ char; // DJB2 hash function
    }

    return hash >>> 0; // Ensure the result is a positive integer
}

/**
 * string.replaceAll function, but supports multiple js enviroments
 * @param {string} string source string
 * @param {string} search
 * @param {string} value
 * @return {string}
 */
function safeReplaceAll(string, search, value) {
    return string.replace(new RegExp(`${search}`, 'g'), `${value}`)
}
/**
 * Provides attributes that starts with certain string in element
 * @param {HTMLElement|Node} element
 * @param {string} startingWith
 * @returns {string[]} attribute name
 */
function getAttributeStartingWith(element, startingWith) {
    let attributes = [];

    if(!element.attributes) return [];

    for (const attribute of element.attributes) {
        const attributeName = attribute.name;

        if (attributeName.startsWith(startingWith)) {
            attributes.push(attributeName);
        }
    }

    return attributes;
}

/**
 * Turns html string into HTMLElement
 * @param {string} html 
 * @returns {HTMLElement}
 */
function htmlToElement(html) {
    const template = document.createElement('template');

    template.innerHTML = html;

    return template.content.firstElementChild;
}

/**
 * Creates a <virtualContainer> tag at the top of provided element
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
function createVirtualContainer(element) {
    const virtualContainer = document.createElement("virtualContainer");

    virtualContainer.appendChild(element);

    return virtualContainer;
}

/**
 * Finds parent that has attribute starting with passed value
 * @param {HTMLElement} countFromElement
 * @param {string} attribute
 * @param {boolean} includeSelf
 * @return {null|HTMLElement}
 */
function findParentThatHasAttribute(countFromElement, attribute, includeSelf = true) {
    function hasAttribute(element) {
        return getAttributeStartingWith(element, attribute).length > 0;
    }

    if(includeSelf && hasAttribute(countFromElement)) return countFromElement;

    if(!countFromElement.parentElement) return null;

    let parent = countFromElement.parentElement;

    while (!hasAttribute(parent)) {
        if(!parent.parentElement) return null;

        parent = parent.parentElement;
    }

    return parent;
}
const CjsRunnableStyleWatcher = new Map();

/**
 * @param {string} selectorPrefix
 * @param {string} path
 * @param {CjsStyleImportOptions} options
 */
async function addRootStyle(selectorPrefix, path, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true } ) {
    if(!("prefixStyleRules" in options)) options.prefixStyleRules = true;
    if(!("encodeKeyframes" in options)) options.encodeKeyframes = true;
    if(!("enableMultiSelector" in options)) options.enableMultiSelector = true;
    
    if(cjsRunnable.isStyleValid()) return CjsRunnableStyleWatcher.set(selectorPrefix, { options, path }); 

    const request = await new CjsRequest(path, "get").doRequest();

    if(request.isError()) {
        return console.log(`${CJS_PRETTY_PREFIX_X}Error occurred while importing style (${Colors.Yellow}${path}${Colors.None})`);
    }

    const text = request.text();
    const style = document.head.querySelector(`[id="${CJS_STYLE_PREFIX}"]`);
    const prefixed = addPrefixToSelectors(text, `[${selectorPrefix}]`, options);

    style.innerHTML += prefixed;
}
/**
 * Converts multidimensional array to single dimension array
 * @param {[]} arr 
 * @returns {[]}
 */
function flattenInfinite(arr) {
    return arr.reduce((acc, current) => {
        if (Array.isArray(current)) {
            return acc.concat(flattenInfinite(current));
        } else {
            return acc.concat(current);
        }
    }, []);
}

/**
 * Returns random array element
 * @param {[]} array 
 * @returns {any}
 */
function getRandomArrayElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
/**
 * The maximum is inclusive and the minimum is inclusive
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
class CjsSearch {
    /**
     * Returns the specific url part without domain and query search
     * 
     * `https://domain.pl/`**`channel/4718230`**`?option=sort`
     * @param {string} href 
     * @returns {string}
     */
    #getDesiredPart(href) {
        return new URL(href).pathname.substring(1);
    }

    /**
     * Updates the website url
     */
    #updateUrl() {
        const modes = {
            "query": () => {
                const currentUrl = new URL(window.location.href);

                currentUrl.searchParams.set('path', this.search);

                history.pushState({}, '', currentUrl);
            },
            "path": () => {
                history.pushState(null, '', `/${this.search}`);
            }
        }

        modes[this._mode]();

        window.dispatchEvent(new Event('popstate'));
    }

    /** @type {string} */
    #debugBoxId = "cjs-debug/Search";

    /** @returns {HTMLElement} */
    #createDebugBox() {
        const element = htmlToElement(`
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #000000;
                padding: 6px 12px;
                border: 2xp solid #ffffff;
                border-radius: 6px;
            " id="${this.#debugBoxId}">
                <p style="
                    font-family: Consolas, sans-serif;
                    margin: 0;
                    color: #acacac;
                    font-size: 10px;
                    user-select: none;
                ">Search url</p>
                <p style="
                    font-family: Consolas, sans-serif;
                    margin: 0;
                    color: #ffffff;
                    font-size: 15px;
                "></p>
            </div>
        `);

        const bodyNotLoaded = document.body === null;

        if(bodyNotLoaded) return element;

        document.body.appendChild(element);

        return element;
    }

    /**
     * Parses search to basic search format
     * @example
     * `/users` -> `users`
     * `/users/` -> `users`
     * `/users/dashboard` -> `users/dashboard`
     * @param {string} search 
     * @returns {string}
     */
    #parseSearch(search) {
        if(search.charAt(0) === "/") search = search.slice(1);
        if(search.charAt(search.length - 1) === "/") search = search.slice(0, -1);

        return search;
    }

    #displayOnScreen = true;
    #updateWebsiteUrl = true;

    #localStorageId = "cjsSearch";

    /** @type {function({ search: string, parts: string[], length: number })[]} */
    #listeners = [];

    /** @type {"query"|"path"} */
    _mode = "query";

    /**
     * Sets the Search functional mode
     * @param {"query"|"path"} mode
     */
    setMode(mode) {
        this._mode = mode;
    }

    /** @type {number} */
    length = 0;

    /**
     * Updates search parameters
     */
    update() {
        // history.pushState(null, '', `/${this.search}`);

        localStorage.setItem(this.#localStorageId, this.search);

        const parts = this.search.split("/").filter(e => e.trim() !== "");

        this.length = parts.length;

        this.#listeners.forEach(listener => listener({ search: this.search, parts, length: this.length }));

        if(this.#displayOnScreen) {
            const debugBox = document.getElementById(this.#debugBoxId) === null 
            ? this.#createDebugBox()
            : document.getElementById(this.#debugBoxId);

            debugBox.querySelector("p:nth-child(2)").innerText = `/${this.search}`;
        }

        if(this.#updateWebsiteUrl) {
            this.#updateUrl();
        }
    }

    constructor() {
        this.search = ""; //this.#getDesiredPart(window.location.href)

        window.addEventListener('popstate', () => {
            const currentUrl = new URL(window.location.href);
            const path = this._mode === "query"
                ? currentUrl.searchParams.get('path')
                : currentUrl.pathname.replace(/^\/|\/$/g, '');

            this.set(path);
        });
    }

    /**
     * Checks if search text in function param, matches the actual search
     * @example
     * // Actual search: dashboard/users
     * ✔ equals("dashboard/users"); // true
     * ✔ equals("/dashboard/users"); // true
     * ✔ equals("/dashboard/users/"); // true
     * ✘ equals("dashboard"); // false
     * ✘ equals("/dashboard"); // false
     * @param {string} text 
     * @returns {boolean}
     */
    equals(text) {
        if(text === this.search) return true;

        return this.search === this.#parseSearch(text);
    }

    /**
     * Checks if search starts with certain string
     * @param {string} text 
     * @returns {boolean}
     */
    startsWith(text) {
        return this.search.startsWith(this.#parseSearch(text));
    }

    /**
     * Slice implementation for Search
     * @param {number} start
     * @param {number} end
     * @returns {string}
     */
    slice(start, end = null) {
        const parts = this.search.split("/").filter(e => e.trim() !== "");

        if(!end) return parts.slice(start).join("/");

        return parts.slice(start, end).join("/");
    }

    /**
     * If display the actual debug search in the black box on the website.
     * @param {boolean} displayOnScreen 
     * @returns {CjsSearch}
     */
    setDisplayedOnScreen(displayOnScreen) {
        this.#displayOnScreen = displayOnScreen;

        return this;
    }

    /**
     * Adds listener and calls it when search changes
     * @param {function({ search: string, parts: string[], length: number })} callback 
     * @returns {CjsSearch}
     */
    onChange(callback) {
        this.#listeners.push(callback);

        return this;
    }

    /**
     * Sets the search location to provided value.
     * @param {string} search
     * @param {boolean} forceRerender if force rerenderOnSearch 
     * @returns {CjsSearch}
     */
    set(search, forceRerender = false) {
        const parsed = search.charAt(0) === "/" ? search.slice(1) : search;
        const notChanged = this.search === parsed;

        if(notChanged && !forceRerender) return this;

        this.search = parsed;

        this.update();

        return this;
    }

    /**
     * Retrieves data from search location
     * @param {number} index 
     * @returns {string|null}
     */
    get(index) {
        const split = this.search.split("/");
        const isOutOfRange = index > split.length - 1

        if(isOutOfRange) {
            console.log(`${CJS_PRETTY_PREFIX_X}Provided index is too high.`);
            
            return null;
        }

        return split[index];
    }

    /**
     * Adds value to url
     * 
     * `https://domain.pl/channels`
     * 
     * ```js
     * Search.add("9130148278934798234");
     * ```
     * 
     * `https://domain.pl/channels/9130148278934798234`
     * @param {string} value 
     * @returns {CjsSearch}
     */
    add(value) {
        const parsed = `${value}`.replace(new RegExp("/", "g"), "");

        this.search += this.search.trim().length === 0 ? `${parsed}` : `/${parsed}`;

        this.update();

        return this;
    }

    /**
     * Removes the number of search entries separated by "/"
     * 
     * `https://domain.pl/channels/9130148278934798234`
     * ```js
     * Search.remove(2);
     * ```
     * `https://domain.pl/`
     * 
     * @param {number} count 
     * @returns {CjsSearch}
     */
    remove(count) {
        const split = this.search.split("/");
        const isOutOfRange = count > split.length - 1;

        if(isOutOfRange) {
            console.log(`${CJS_PRETTY_PREFIX_X}Provided index is too high.`);
            
            return this;
        }

        const cuttedSearch = split.slice(0, split.length - count);

        this.search = cuttedSearch.join("/");

        this.update();

        return this;
    }
}

const Search = new CjsSearch();
/**
 * Returns parsed path that does not start with `./` and `/`
 * @param {string} path 
 * @returns {string}
 */
function toFixedPath(path) {
    if(path.startsWith("./")) return path.slice(2);

    if(path.startsWith("/")) return path.slice(1);

    return path;
}
const CjsObject = {
    /**
     * Returns values from the keys if the value is not an object
     * @param {object} object 
     * @returns {[]}
     */
    getNonObjectValues: function(object) {
        /**
         * @param {ObjectConstructor} subObject 
         * @returns {[]}
         */
        const traverse = (subObject) => {
            const values = [];
            const keys = Object.keys(subObject).filter(key => subObject.hasOwnProperty(key));
    
            for(const key of keys) {
                const value = subObject[key];
                const isKeyAnObject = typeof value === 'object' && value !== null;
    
                values.push(...(isKeyAnObject ? traverse(value) : [value]));
            }
        
            return values;
        }
    
        return traverse(object);
    },
    /**
     * Merges two objects into one, by default object2 overwites values of object1
     * @param {object} object1 
     * @param {object} object2 
     * @param {boolean} overwrite if overwrite values using object2
     * @returns {object}
     */
    join: function(object1, object2, overwrite = true) {
        const traverse = (obj1, obj2, overwrite) => {
            if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
                return obj1 || obj2;
            }
    
            const result = {};
    
            for (const key in obj1) {
                result[key] = traverse(obj1[key], obj2[key], overwrite);
            }
    
            for (const key in obj2) {
                if (overwrite && result.hasOwnProperty(key)) continue;
                result[key] = obj2[key];
            }
    
            return result;
        }
      
        return traverse(object1, object2, overwrite);
    },
    /**
     * Performs deep object copy
     * @param {*} object
     * @returns {*}
     */
    copy: function(object) {
        const traverse = (obj) => {
            if(obj === null) return null;
            
            const isPrimitive = typeof obj !== 'object';
            const isHtmlElement = obj instanceof HTMLElement || obj instanceof Node;

            if(isPrimitive || isHtmlElement) return obj;
            
            if(Array.isArray(obj)) {
                const arrayClone = [];
        
                obj.forEach(o => arrayClone.push(traverse(o)));
        
                return arrayClone;
            }
            
            const objectClone = {};
            
            for(const [key, value] of Object.entries(obj)) {
                objectClone[key] = traverse(value);
            }
            
            return objectClone;
        }
        
        return traverse(object);
    }
};
const CjsString = {
    /**
     * Remove Html tags from the input, keeping the inner Html content
     * @param {string} input 
     * @returns {string}
     */
    removeHtmlTags: function(input) {
        return input.replace(/<[^>]*>/g, '');
    }
};

/**
 * Downloads a file
 * @param {string} path
 * @param {string} filename
 */
async function download(path, filename = null) {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Couldn't download file ${response.statusText}`);
        }

        const blob = await response.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename ? filename : path.split('/').pop();

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.log(`${CJS_PRETTY_PREFIX_X}Error downloading file`, error);
    }
}
const CjsMobile = {
    /**
     * Performs basic check if user visited website on mobile device
     * @returns {boolean}
     */
    isMobile: () => {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }
};
const CjsValidator = {
    /**
     * Checks if provided valid email
     * @param {string} string 
     * @returns {boolean}
     */
    isEmail(string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(string);
    }
};

/**
 * Array.map function but also turns it to string
 * 
 * Example:
 * ```
 * <div class="row">
 *     ${strmap(data.fields, (field) => `
 *         <div class="field">${field.name}</div>
 *     `)}
 * </div>
 * ```
 * @param {[]} array 
 * @param {function(any, number)} callback 
 * @returns {string}
 */
function strmap(array, callback) {
    if(!Array.isArray(array)) {
        console.log(`${CJS_PRETTY_PREFIX_X}The provided argument in strmap is not an array, it's `, array)
        return '';
    }

    return array.map(callback).join("");
}

/**
 * Helps when creating conditions in string
 * 
 * Example:
 * ```
 * <div class="row">
 *     ${strif(data.count > -1, `
 *         <div class="counter">${data.count}</div>
 *     `)}
 * </div>
 * ```
 * 
 * @param {boolean} condition 
 * @param {string} string 
 * @returns {string}
 */
function strif(condition, string) {
    return condition ? string : '';
}
/**
 * Creates a void type promise that will stop a function by provided amount of time
 * @param {number} ms
 * @return {Promise<void>}
 */
async function sleep(ms) {
    return await new Promise((res) => { setTimeout(() => { res() }, ms) })
}
class CjsFilter {
    /**
     * @param {string} name
     * @param {number} amount
     * @param {string} direction
     * @param {number} time
     * @param {string} className
     */
    constructor(name, amount, direction, time, className) {
        this.name = name;
        this.amount = amount;
        this.direction = direction;
        this.time = time;
        this.className = className;
    }

    getClassName() {
        return this.className;
    }
}

/**
 * @param {CjsFilterTypes} filterName
 * @param {number} filterAmount
 * @param {CjsFilterDirections} filterDirection
 * @param {number} timeMs
 */
function addStyle(filterName, filterAmount, filterDirection, timeMs) {
    const style = document.head.querySelector(`[id="${CJS_STYLE_FILTERS_PREFIX}"]`);

    let filter = {
        from: null, to: null
    }

    switch (filterName) {
        case "grayscale": filter = { from: `grayscale(0)`, to: `grayscale(${filterAmount})` }; break;
        case "blur": filter = { from: `blur(0px)`, to: `blur(${filterAmount}px)` }; break;
        case "brightness": filter = { from: `brightness(0%)`, to: `brightness(${filterAmount}%)` }; break;
        case "contrast": filter = { from: `contrast(0%)`, to: `contrast(${filterAmount}%)` }; break;
        case "hue-rotate": filter = { from: `hue-rotate(0deg)`, to: `hue-rotate(${filterAmount}deg)` }; break;
        case "invert": filter = { from: `invert(0%)`, to: `invert(${filterAmount}%)` }; break;
        case "opacity": filter = { from: `opacity(0)`, to: `opacity(${filterAmount})` }; break;
        case "saturate": filter = { from: `saturate(0%)`, to: `saturate(${filterAmount}%)` }; break;
        case "sepia": filter = { from: `sepia(0%)`, to: `sepia(${filterAmount}%)` }; break;
    }

    if(filterDirection === "reverse") {
        const to = filter.to;

        filter.to = filter.from;
        filter.from = to;
    }

    const className = `${CJS_STYLE_FILTERS_PREFIX}${filterName}-${getRandomCharacters(8)}`;
    const animationName = getRandomCharacters(32);

    const css = `
    .${className} {
        filter: ${filter.to};
        animation: ${animationName} ${timeMs / 1000}s;
    }
    
    @keyframes ${animationName} {
        0% { filter: ${filter.from}; }
        100% { filter: ${filter.to}; }
    }
    `

    style.innerHTML += css;

    return new CjsFilter(
        filterName,
        filterAmount,
        filterDirection,
        timeMs,
        className
    );
}

const ACTIVE_FILTERS = { blur: [], opacity: [] };

async function passFilterToElement(el, name, amount, direction, time) {
    const matchingElements = ACTIVE_FILTERS[name].filter(e => {
        return (
            e.name === name &&
            e.amount === amount &&
            e.direction === direction &&
            e.time === time
        )
    });

    const cjsFilter = (matchingElements.length > 0 ? matchingElements[0] : addStyle(name, amount, direction, time));

    ACTIVE_FILTERS[name].push(cjsFilter);
    ACTIVE_FILTERS[name].forEach(c => { el.classList.remove(c.getClassName()); });

    el.classList.add(cjsFilter.getClassName());

    await sleep(time);

    el.classList.remove(cjsFilter.getClassName());
}

/**
 * @param {HTMLElement} element
 * @param {CjsFilterOptions} options
 * @return {Promise<void>}
 */
async function createFilter(element, options) {
    if(!("time" in options)) { options.time = 500; }
    if(!("amount" in options)) { options.amount = 10; }
    if(!("direction" in options)) { options.direction = "standard"; }

    await passFilterToElement(element, options.filter, options.amount, options.direction, options.time);
}
class CjsRequestResult {
    /**
     * @param {number} statusCode
     * @param {string} responseText
     * @param {boolean} networkError
     */
    constructor(statusCode, responseText, networkError) {
        this.statusCode = statusCode;
        this.responseText = responseText;
        this.networkError = networkError;
    }

    getStatusCode() {
        return this.statusCode;
    }

    isError() {
        return this.statusCode !== 200 || this.networkError;
    }

    isNetworkError() {
        return this.networkError;
    }

    text() {
        return this.responseText;
    }

    json() {
        return JSON.parse(this.responseText);
    }

    /**
     *
     * @param {number} code
     * @param {function} callback
     */
    onStatus(code, callback) {
        if(this.statusCode === code) {
            callback();
        }
    }
}

/**
 * @class
 * @classdesc Class intended to manage web requests
 */
class CjsRequest {
    #onStartCallback = function() {};
    #onEndCallback = function() {};
    #onErrorCallback = function() {};
    #onSuccessCallback = function() {};
    #onProgressCallback = function() {};

    /**
     * @param {string} url
     * @param {CjsRequestMethods} method
     */
    constructor(url, method) {
        this.url = url;
        this.method = method;
        this.query = {};
        this.body = {};
        this.headers = {};
        this.files = {};
        this.cooldown = 0;
        this.bodyKey = null;
    }

    /**
     * Sets body key, it's required when sending files and body at the same time
     * @param {string} bodyKey 
     * @returns {CjsRequest}
     */
    setBodyKey(bodyKey) {
        this.bodyKey = bodyKey;

        return this;
    }

    /**
     * Executes when request starts
     * @param {function} callback
     * @returns {CjsRequest}
     */
    onStart(callback) {
        this.#onStartCallback = callback;

        return this;
    }

    /**
     * Executes when request end
     * @param {function(CjsRequestResult)} callback
     * @returns {CjsRequest}
     */
    onEnd(callback) {
        this.#onEndCallback = callback;

        return this;
    }


    /**
     * Sets cooldown before making a request
     * @param {number} cooldown in milliseconds
     * @returns {CjsRequest}
     */
    setCooldown(cooldown) {
        this.cooldown = cooldown;

        return this;
    }

    /**
     * Sets function that will be called if occurred error
     * @param {function(CjsRequestResult)} callback 
     * @returns {CjsRequest}
     */
    onError(callback) {
        this.#onErrorCallback = callback;

        return this;
    }

    /**
     * Sets function that will be called if request was successfull
     * @param {function(CjsRequestResult)} callback 
     * @returns {CjsRequest}
     */
    onSuccess(callback) {
        this.#onSuccessCallback = callback;

        return this;
    }

    /**
     * Provides percentage status for progress (eg. uploading files)
     * @param {(percentage: number, loaded: number, total: number, event: ProgressEvent<EventTarget>) => void} callback 
     * @returns {CjsRequest}
     */
    onProgress(callback) {
        this.#onProgressCallback = callback;

        return this;
    }

    /**
     * Executes request
     * @return {Promise<CjsRequestResult>}
     */
    async doRequest() {
        if(this.cooldown > 0) {
            await new Promise((res) => setTimeout(() => res(), this.cooldown));
        }

        const xhr = new XMLHttpRequest();

        if(this.url === undefined) {
            console.log(`${CJS_PRETTY_PREFIX_X}Request url is undefined`);

            return new CjsRequestResult(0, null, true);
        }

        let url = this.url;

        if(this.method === undefined) {
            console.log(`${CJS_PRETTY_PREFIX_X}Request method is undefined (${this.url})`);

            return new CjsRequestResult(0, null, true);
        }

        url += `?${Object.keys(this.query).map(e => { return `${e}=${this.query[e]}` }).join("&")}`

        xhr.open(this.method, url, true);

        for(const [key, value] of Object.entries(this.headers)) {
            xhr.setRequestHeader(key, `${value}`);
        }

        const bodyExists = Object.keys(this.body).length > 0;
        const filesExists = Object.keys(this.files).length > 0;

        if(filesExists && bodyExists) {
            console.log(`${CJS_PRETTY_PREFIX_X}Cannot send files and body data at the same time`);

            return new CjsRequestResult(0, null, true)
        }

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                var percentage = (e.loaded / e.total) * 100;

                this.#onProgressCallback(percentage, e.loaded, e.total, e);
            }
        };

        if(bodyExists || filesExists) {
            if(bodyExists && !filesExists) {
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(this.body));
            } else {
                const formData = new FormData();

                for (const [key, value] of Object.entries(this.files)) {
                    if (value instanceof FileList) {
                        for (const file of Array.from(value)) {
                            formData.append(key, file);
                        }
                    } else {
                        formData.append(key, value);
                    }
                }

                if(bodyExists && !this.bodyKey) {
                    console.log(`${CJS_PRETTY_PREFIX_X}Cannot send files and body data at the same time if bodyKey is not defined`);

                    return new CjsRequestResult(0, null, true);
                }
    
                if(bodyExists) formData.append(this.bodyKey, JSON.stringify(this.body));

                xhr.send(formData);
            }
        } else {
            xhr.send();
        }

        // if(bodyExists) {
        //     xhr.setRequestHeader("Content-Type", "application/json");

        //     xhr.send(JSON.stringify(this.body));
        // } else if(filesExists) {
        //     //xhr.setRequestHeader("Content-Type", "multipart/form-data");

        //     const formData = new FormData();

        //     for(const [key, value] of Object.entries(this.files)) {
        //         if(value instanceof FileList) {
        //             for(const file of Array.from(value)) {
        //                 formData.append(key, file);
        //             }
        //         }
        //     }

        //     xhr.send(formData);
        // } else {
        //     xhr.send();
        // }

        xhr.onerror = (e) => {
            const requestResult = new CjsRequestResult(0, null, true);

            this.#onErrorCallback(requestResult);

            return requestResult;
        }

        this.#onStartCallback();

        return await new Promise(((resolve, reject) => {
            xhr.onreadystatechange = async () => {
                const requestResult = new CjsRequestResult(
                    xhr.status,
                    xhr.responseText,
                    (xhr.status === 0)
                );

                if(xhr.readyState !== 4) return;

                this.#onEndCallback(requestResult);

                if(requestResult.isError()) {
                    this.#onErrorCallback(requestResult);
                } else {
                    this.#onSuccessCallback(requestResult);
                }

                resolve(requestResult);
            }
        }))
    }

    /**
     * Sets query parameters in url like `?param=value&sort=ASC`
     * @param {Object.<string, string>} query
     * @return {CjsRequest}
     */
    setQuery(query) {
        this.query = query;

        return this;
    }

    /**
     * Sets headers like eg. `Authorization: Bearer TOKEN`
     * @param {Object.<string, string>} headers
     * @returns {CjsRequest}
     */
    setHeaders(headers) {
        this.headers = headers;

        return this;
    }

    /**
     * Sets body data
     * @param {object} body
     * @returns {CjsRequest}
     */
    setBody(body) {
        this.body = body;

        return this;
    }

    /**
     * Sets files
     * @param {object} files
     * @returns {CjsRequest}
     */
    setFiles(files) {
        this.files = files;

        return this;
    }
}
/**
 * It is a shortcut for accessing files in assets directory
 * 
 * In the following example image will be taken from:
 * 
 * `/src/assets/images/user.png`
 * @example
 * <img src="${asset(`images/user.png`)}" alt="user">
 * @param {string} path 
 * @returns {string}
 */
function asset(path) {
    const fixed = toFixedPath(path);

    if(!cjsRunnable.exists()) return `src/assets/${fixed}`;

    return "../".repeat(cjsRunnable.data.relativePathPosition) + `src/assets/${fixed}`;
}

/**
 * Shortcut of `asset` method, by default adds `svg/` prefix and `.svg` suffix.
 * @param {string} path 
 * @returns {string}
 */
function svg(path) {
    return asset(`svg/${path}.svg`);
}

/**
 * Shortcut of `asset` method, by default adds `images/` prefix and `.png` suffix.
 * @param {string} path 
 * @returns {string}
 */
function png(path) {
    return asset(`images/${path}.png`);
}

/**
 * Shortcut of `asset` method, by default adds `images/` prefix and `.jpg` suffix.
 * @param {string} path 
 * @returns {string}
 */
function jpg(path) {
    return asset(`images/${path}.jpg`);
}

/**
 * Shortcut of `asset` method, by default adds `gif/` prefix and `.gif` suffix.
 * @param {string} path
 * @returns {string}
 */
function gif(path) {
    return asset(`gif/${path}.gif`);
}
const CJS_KEYFRAMES_ANIMATIONS = []; // { hash: number, animation: string }
const CJS_KEYFRAMES_CLASSES = []; // { hash: number, class: string }

class CjsKeyFrame {
    constructor() {
        this.entries = [];
        this.duration = 1000;
        this.timingFunction = 'ease';
        this.keepEndingEntryStyle = true;
        this.selector = '';
        this.isImportant = false;
        this.fillMode = '';
    }

    /**
     * Set selector of class, so the animation could be applied to child divs if for example selector is ".animationClass > div"
     * @param {string} selector
     * @returns {CjsKeyFrame}
     */
    setSelector(selector) {
        this.selector = selector;

        return this;
    }

    /**
     * Sets the filling style of the animation
     * @param {"none"|"forwards"|"backwards"|"both"} fillMode
     * @returns {CjsKeyFrame}
     */
    setFillMode(fillMode) {
        this.fillMode = fillMode;

        return this;
    }

    /**
     * @param {boolean} keepEntry
     * @returns {CjsKeyFrame}
     */
    setEndingEntryStyle(keepEntry) {
        this.keepEndingEntryStyle = keepEntry;

        return this;
    }

    /**
     * @param {CjsStylePropertieses} style
     * @returns {CjsKeyFrame}
     */
    addEntry(style) {
        this.entries.push(style);

        return this;
    }

    /**
     * @param {number} duration animation time in ms
     * @return {CjsKeyFrame}
     */
    setDuration(duration) {
        if(isNaN(duration)) {
            console.log(`${CJS_PRETTY_PREFIX_X} Provided argument is not a number`);
        }

        this.duration = duration;

        return this;
    }

    /**
     * @param {CjsAnimationTimingFunction} timingFunction
     * @return {CjsKeyFrame}
     */
    setTimingFunction(timingFunction) {
        this.timingFunction = timingFunction;

        return this;
    }

    /**
     * @param {boolean} isImportant
     * @return {CjsKeyFrame}
     */
    setImportant(isImportant) {
        this.isImportant = isImportant;

        return this;
    }

    /**
     * @param {{reversed?: boolean}} options
     * @return {string}
     */
    getClass(options = { reversed: false }) {
        if(!("reversed" in options)) { options.reversed = false; };

        if(this.entries.length > 100) {
            console.log(`${CJS_PRETTY_PREFIX_X}CjsKeyFrame cannot have more than 100 entries`);
        }

        const directionDefinedEntries = ( options.reversed === true ? this.entries.slice().reverse() : this.entries );

        const entriesEachPercent = 100 / (directionDefinedEntries.length - 1);
        let parsedEntries = directionDefinedEntries.map((entry, i) => {
            const hasOneEntry = directionDefinedEntries.length === 1;
            const percent = hasOneEntry ? 100 : i * entriesEachPercent;

            return `    ${percent}% { ${Object.keys(entry).map(e => `${e}: ${entry[e]};`).join(" ")} }`;
        });

        const entriesCss = `{ \n${parsedEntries.join("\n")} \n}`;
        const animationHash = getUniqueNumberId(entriesCss);
        const animationFilter = CJS_KEYFRAMES_ANIMATIONS.filter(e => e.hash === animationHash);
        const style = document.head.querySelector(`[id="${CJS_STYLE_KEYFRAMES_PREFIX}"]`);

        if(animationFilter.length === 0) {
            const animationName = `${CJS_STYLE_KEYFRAMES_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
            const css = `@keyframes ${animationName} ${entriesCss}`;

            style.innerHTML += `\n${css}`;

            const object = { hash: animationHash, animation: animationName };

            CJS_KEYFRAMES_ANIMATIONS.push(object);

            animationFilter.push(object);
        }

        const animationName = animationFilter[0].animation;
        const lastEntry = directionDefinedEntries[directionDefinedEntries.length - 1];
        const importantProperty = `${(this.isImportant ? ' !important' : '')}`;
        const lastEntryStyle = `${Object.keys(lastEntry).map(e => `${e}: ${lastEntry[e]};`).join(" ")}`;
        const cssContentParts = [
            `animation: ${animationName} ${this.duration / 1000}s ${this.timingFunction}${importantProperty}`
        ];

        if(this.keepEndingEntryStyle) {
            cssContentParts.push(lastEntryStyle);
        }

        const classCssContent = `{ ${cssContentParts.join("; ")} }`;
        const classHash = getUniqueNumberId(`${this.selector}-${classCssContent}`);

        const classFilter = CJS_KEYFRAMES_CLASSES.filter(e => e.hash === classHash);

        if(classFilter.length === 0) {
            const className = `${animationName}-${classHash}`;
            const css = `.${className} ${this.selector} ${classCssContent}`;

            style.innerHTML += `\n${css}`;

            CJS_KEYFRAMES_CLASSES.push({ hash: classHash, class: className });

            return className;
        }

        return classFilter[0].class;
    }
}
class CjsAnimationExecutor {
    /**
     * Creates simple animation that transforms object by provided value
     * @param {number} offset 
     * @param {number} time animation milliseconds time
     * @returns {string} class name
     */
    x(offset, time = 500) {
        const k = new CjsKeyFrame()
        .setDuration(time)
        .addEntry({ transform: `translateX(${offset}px)` })
        .addEntry({ transform: `translateX(0)` });

        return k.getClass();
    }

    /**
     * Creates simple animation that transforms object by provided value
     * @param {number} offset 
     * @param {number} time animation milliseconds time
     * @returns {string} class name
     */
    y(offset, time = 500) {
        const k = new CjsKeyFrame()
        .setDuration(time)
        .addEntry({ transform: `translateY(${offset}px)` })
        .addEntry({ transform: `translateY(0)` });

        return k.getClass();
    }

    /**
     * Creates simple animation that transforms object by provided value
     * @param {number} start start value of scale to value 1.0
     * @param {number} time animation milliseconds time
     * @returns {string} class name
     */
    scale(start, time = 500) {
        const k = new CjsKeyFrame()
        .setDuration(time)
        .addEntry({ transform: `scale(${start})` })
        .addEntry({ transform: `scale(1)` });

        return k.getClass();
    }

    /**
     * Adds class to element and after selected time removes it
     * @param {HTMLElement} element element to apply class on
     * @param {string} className name of the temp class
     * @param {number} time time in milliseconds after remove the class
     */
    tempClass(element, className, time = 500) {
        element.classList.add(className);

        setTimeout(() => { element.classList.remove(className) }, time);
    }
}

const CjsAnimation = new CjsAnimationExecutor();
/**
 * Variable that stores global settings for website
 * @type {CjsGlobalsOptions}
 */
const CjsGlobals = {
    mouse: {
        up: true,
        down: false,
        state: "up"
    },
    window: {
        DOMContentLoaded: false
    }
};

/* Mouse */
window.addEventListener('mousedown', () => { CjsGlobals.mouse = { up: false, down: true, state: "down" } });
window.addEventListener('mouseup', () => { CjsGlobals.mouse = { up: true, down: false, state: "up" } });
window.addEventListener('DOMContentLoaded', () => { CjsGlobals.window.DOMContentLoaded = true; });
class CjsWebSocket {
    constructor() {
        /** @type {WebSocket} */
        this.webSocket = null;
        this.captures = new Map(); // captureId, callback
        this.isOpened = false;
        this.waitingSendRequests = [];
    }

    /**
     * Connects to WebSocket
     * @param {string} url ws://address:port/
     * @returns {CjsWebSocket}
     */
    connect(url) {
        this.webSocket = new WebSocket(url);

        this.webSocket.onopen = () => {
            this.isOpened = true;

            this.waitingSendRequests.forEach(data => {
                this.webSocket.send(data);
            })
        }

        this.webSocket.onmessage = (event) => {
            Array.from(this.captures.values()).forEach(captureFunction => {
                captureFunction(event);
            })
        }

        this.webSocket.onclose = (event) => {
            
        }

        return this;
    }

    /**
     * Sends data to WebSocket
     * @param {*} data
     * @returns {CjsWebSocket}
     */
    send(data) {
        if(!this.isOpened) {
            this.waitingSendRequests.push(data);

            return this;
        }

        this.webSocket.send(data);

        return this;
    }

    /**
     * Sets data as json to WebSocket (uses JSON.stringify(...))
     * @param {object} json
     * @returns {CjsWebSocket}
     */
    sendJson(json) {
        this.send(JSON.stringify(json));

        return this;
    }

    /**
     * Creates capture, when any message is received the capture will provide its content
     * @param {function(MessageEvent)} callback
     * @returns {string} id of the created capture
     */
    createCapture(callback) {
        const id = getRandomCharacters(16);

        this.captures.set(id, callback);

        return id;
    }

    /**
     * Removes capture
     * @param {string} id
     * @returns {CjsWebSocket}
     */
    removeCapture(id) {
        this.captures.delete(id);

        return this;
    }

    /**
     * Checks is capture exists
     * @param {string} id
     * @returns {boolean}
     */
    hasCapture(id) {
        return this.captures.has(id);
    }
}
/**
 * Creates a handle function, used for autocomplete when using CjsEvent
 * @example
 * 
 * ```js
 * const handleLoad = createHandle((e) => {
 *     console.log('Element just loaded', e.source)
 * });
 * ```
 * 
 * @param {function(CjsEvent)} func
 * @returns {function}
 */
function createHandle(func) {
    return func;
}

/**
 * Utility providing various functions that support windows managing
 */
const CjsWindow = {
    /**
     * Opens url within new tab
     * @param {string} href 
     * @param {"_blank"|"_self"|"_parent"|"_top"} target _blank is default
     */
    open(href, target = "_blank") {
        const a = htmlToElement(`<a href="${href}" target="${target}"></a>`);
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
};
/**
 * Generates attribute
 * @param {string} prefix 
 * @param {[]} exclude 
 * @returns {string}
 */
Cjs.generateAttribute = (prefix, exclude) => {
    let attribute = null;

    /**
     * Determinates if do next iteration for searching non duplicated attribute
     * @returns {boolean} 
     */
    const next = () => {
        const doesNotHaveAttribute = attribute === null;
        const attributeIsTaken = exclude.includes(attribute);

        return doesNotHaveAttribute || attributeIsTaken;
    }

    while (next()) {
        attribute = `${prefix}${getRandomCharacters(CJS_ID_LENGTH)}`;
    }

    return attribute;
}
/**
 * @class
 * @classdesc Converts string to CjsHtmlElement
 */
class CjsHtmlElement {
    /** @type {HTMLElement} */
    #element;

    /**
     * @param {string} html 
     */
    constructor(html) {
        this.#element = htmlToElement(html);
    }

    /**
     * Returns pure html from created html element
     * @returns {string}
     */
    toString() {
        return this.#element.outerHTML;
    }

    /**
     * Returns pure html from created html element
     * @returns {string}
     */
    toHtml() {
        return this.#element.outerHTML;
    }

    /**
     * Returns HTMLElement from html
     * @returns {HTMLElement}
     */
    toElement() {
        return this.#element;
    }
}
/**
 * @class
 * @classdesc Class that determinates the basic event
 */
class CjsEvent {
    /**
     * @param {Event|ChangesObserverEvent} event
     * @param {HTMLElement} source element to witch the event was applied
     */
    constructor(event, source) {
        this.event = event;
        this.target = event.target;
        this.component = findParentThatHasAttribute(source, CJS_COMPONENT_PREFIX);
        this.source = source;
    }
}
/**
 * @class
 * @classdesc Object intended to manage the form data
 */
class CjsForm {
    /** @type {HTMLFormElement} */
    #element;
    
    constructor(element) {
        this.#element = element;
    }

    /**
     * Serializes data from form element
     * @returns {object}
     */
    serialize() {
        const selects = Array.from(this.#element.querySelectorAll("select"));
        const inputs = Array.from(this.#element.querySelectorAll("input"));
        const textareas = Array.from(this.#element.querySelectorAll("textarea"));
        const elements = selects.concat(inputs).concat(textareas);
        const data = {};

        for(let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const name = element.getAttribute("name");
            const value = element.getAttribute("type") === "checkbox" ? element.checked : element.value;
            const key = name || i;
        
            data[key] = value;
        }

        return data;
    }
}
/**
 * @class
 * @classdesc Class for creating a Component used for styling in website
 * @description
 * You can use that element to set the website layout and flow.
 */
class CjsComponent {
    /** @type {string} attribute that indicated the element on the website */
    attribute = null;
    
    /** @type {object} */
    _onLoadData = {};

    /** Callback that is called when element is loaded into website */
    #onLoadCallback = function() {};

    /** @type {{ offset: number, maxHeight: number }} Auto fills height of the component to window height if set */
    #fillHeightData;

    /**
     * Returns data that will be passed to html
     * @param {object} data
     * @returns {object} data with merged default data 
     */
    _getData(data) {
        const mergedData = {};

        /**
         * Recursive function to merge objects
         * @param {object} obj1 object that will be changed to merged object
         * @param {object} obj2 object that will be overwriting data to obj1
         */
        function mergeObjects(obj1, obj2, l = false) {
            for (const key in obj2) {
                if(!obj2.hasOwnProperty(key)) continue;

                const hasObjectInside = typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]

                if (hasObjectInside) {
                    mergeObjects(obj1[key], obj2[key]);
                } else {
                    const propertyHasNullableValue = obj1[key] === null || obj1[key] === undefined;

                    if(propertyHasNullableValue) {
                        obj1[key] = obj2[key];
                    }
                }
            }
        }

        mergeObjects(mergedData, data);
        mergeObjects(mergedData, this.defaultData, true);

        return CjsObject.copy(mergedData);
    }

    /**
     * Returns html containing attribute in parent with data transformed into its references
     * @param {object} data 
     * @param {object} layoutData
     * @returns {string} html
     */
    _getHtml = (data, layoutData = {}) => {
        let elementPromiseResolver = () => {};

        const elementPromise = new Promise((resolve, rejest) => elementPromiseResolver = resolve);
        const onLoadAttribute = mutationListener.listen("add", (cjsEvent) => {
            elementPromiseResolver(cjsEvent.target);
            this._executeOnLoad(this._onLoadData)
        });
        const html = this.func(data, elementPromise, layoutData);

        /**
         * Adds attributes to root element
         * 
         * For example if you have `<div class="wrapper"><p>text</p></div>`
         * 
         * The transformed code will be `<div attribute-1 attribute-2 class="wrapped"><p>text</p></div>`
         * @param {string} html
         * @param {string[]} attributes
         * @returns {string} code with added attributes
         */
        const addAttributes = (html, attributes) => {
            const element = createVirtualContainer(htmlToElement(html));
            const hasNoChildren = element.children.length === 0;
    
            if(hasNoChildren) return ``;
    
            const { firstElementChild } = element;

            attributes.forEach(attribute => {
                firstElementChild.setAttribute(attribute, "");
            });
    
            return firstElementChild.outerHTML;
        }

        /**
         * Adds identifiers to elements that use lazy scheme in their class names
         * @param {string} html 
         * @returns {string}
         */
        const addLazyIdentifiers = (html) => {
            const container = createVirtualContainer(htmlToElement(html));

            for(
                const element of Array
                    .from(container.querySelectorAll(`[class*='${CjsLazyClassPrefix}'`))
                    .filter(e => getAttributeStartingWith(e, CjsLazyElementPrefix).length == 0)
            ) {
                let id = null;

                while(id in CjsTakenAttributes.lazy || id === null) {
                    id = getRandomCharacters(CJS_ID_LENGTH);
                }

                CjsTakenAttributes.lazy.push(id);

                const attribute = `${CjsLazyElementPrefix}${id}`;

                element.setAttribute(attribute, "");
            }

            return container.innerHTML;
        }

        return addAttributes(addLazyIdentifiers(html), [
            this.attribute, onLoadAttribute.trim()
        ]);
    }

    /** @returns {CjsForm[]} */
    get forms() {
        const element = this.toElement();
        const forms = Array.from(element.querySelectorAll("form"));
        const componentIsForm = element.tagName === "FORM"

        if(componentIsForm) forms.push(element);

        return forms.map(form => new CjsForm(form));
    }

    /**
     * @returns {CjsComponentsCollection}
     */
    get components() {
        return new CjsComponentsCollection(document.body.querySelectorAll(`[${this.attribute}='']`));
    }

    /**
     * Creates the component type element
     * @param {(componentData: object, promise: Promise<HTMLElement> layoutData: object) => string} func function that will return component html. The object argument is data provided by parent layout
     */
    constructor(func) {
        this.func = func;

        this.defaultData = {};
        this.preSetData = {};

        this.attribute = Cjs.generateAttribute(CJS_COMPONENT_PREFIX, CjsTakenAttributes.components);
    }

    /**
     * Parses HTMLElement to forms
     * @param {HTMLElement} element 
     * @returns {CjsForm[]}
     */
    toForms(element) {
        const forms = Array.from(element.querySelectorAll("form"));
        const componentIsForm = element.tagName === "FORM"

        if(componentIsForm) forms.push(element);

        return forms.map(form => new CjsForm(form));
    }

    /**
     * Clones an component and sets data with argument (used for Layouts)
     * @param {object} data
     * @returns {CjsComponent}
     */
    withData(data) {
        const clone = Object.create(Object.getPrototypeOf(this));
        Object.assign(clone, this);
        return clone.setData(data);
    }

    /**
     * Determinates if component exists in DOM
     * @returns {boolean}
     */
    exists() {
        const selector = document.body.querySelector(`[${this.attribute}=""]`);
        const elementExists = selector !== null;

        return elementExists;
    }

    /**
     * Auto fills height of the component to window height
     * @param {number} offset determinates the offsets
     */
    fillHeight(offset = 0, maxHeight = undefined) {
        this.#fillHeightData = {
            offset,
            maxHeight
        };
    }

    /**
     * Creates a component as an new instance of HTMLElement that doesn't exists in DOM
     * @returns {HTMLElement}
     */
    toVirtualElement() {
        return htmlToElement(this._getHtml(this._getData(this.preSetData), this._onLoadData));
    }

    /**
     * Provides component element as HTMLElement, could be a new instance if not exists in DOM, but also could return existing component in DOM
     * @param {boolean} ignoreReadyState 
     * @returns {HTMLElement}
     */
    toElement(ignoreReadyState = false) {
        const DOMElement = document.body.querySelector(`[${this.attribute}=""]`);
        const elementExists = DOMElement !== null;

        if(elementExists) return DOMElement;

        const isDocumentLoaded = document.readyState === 'complete';

        if(isDocumentLoaded && !ignoreReadyState) return DOMElement;

        return this.toVirtualElement();
    }

    /**
     * Renders the html string from provided data
     * @param {object} data 
     * @returns {string}
     */
    render(data = {}) {
        return this._getHtml(this._getData(data), this._onLoadData);
    }

    /**
     * Visualises component as HTMLElement
     * @param {object} data 
     * @returns {HTMLElement}
     */
    visualise(data = {}) {
        return htmlToElement(this.render(data));
    }

    /**
    * Sets data for component and reload the old component occurrence
    * @param {object} data information that should be inserted to component
    * @returns {CjsComponent}
    */
    setData(data) {
        const isObject = (any) => { return any instanceof Object; }

        if(!isObject(data)) return console.log(`${CJS_PRETTY_PREFIX_X}Data passed into setData() have to be object type argument`)

        this.preSetData = data;

        const selector = document.body.querySelector(`[${this.attribute}=""]`);
        const elementExists = selector !== null;

        if(elementExists) {
            selector.replaceWith(htmlToElement(this._getHtml(this._getData(data), this._onLoadData)))
        }

        return this;
    }

    /**
     * Loads layout inside the selected component
     * @param {CjsLayout} layouts
     */
    loadLayout(...layouts) {
        const element = this.toElement();

        element.innerHTML = ``;

        for(const layout of layouts) {
            element.insertAdjacentElement(`beforeend`, layout.toElement());

            // Timeout because of addEventListener overlaping
            setTimeout(() => {
                layout._executeOnLoad();

                CjsFrameworkEvents.onLoadLayout(layout);
            }, 2);
        }
    }


    /**
     * Redenders all components this type when search changed
     * @param {{ useSmartRender: boolean }} data 
     * @returns {CjsComponent}
     */
    rerenderOnSearch(data = { useSmartRender: false }) {
        Search.onChange(() => this.rerenderComponents(data));

        return this;
    }

    /**
     * Redenders all components this type
     * @param {object} data
     * @param {{ useSmartRender: boolean }} options
     * @returns {CjsComponent}
     */
    rerenderComponents(data = {}, options = { useSmartRender: false }) {
        const components = Array.from(document.body.querySelectorAll(`[${this.attribute}]`));
        const element = htmlToElement(this._getHtml(data, this._onLoadData));

        if(options.useSmartRender) {
            for(const component of components) {
                /**
                 * @param {HTMLElement} parent 
                 * @param {HTMLElement} newParent 
                 */
                const walk = (parent, newParent) => {
                    const attributesMap = (attributes) => {
                        const obj = {};
                        
                        Array.from(attributes).forEach(attribute => {
                            obj[attribute.name] = attribute.value;
                        });

                        return obj;
                    }

                    if(newParent === null) {
                        parent.remove();
                        return;
                    }

                    const children = Array.from(parent.children);
                    const newChildren = Array.from("children" in newParent ? newParent.children : []);

                    for(let i = 0; i < children.length; i++) {
                        const child = children[i];
                        const newChild = newChildren[i];

                        if(newChild === undefined) continue;

                        const sameInnerText = child.innerText === newChild.innerText;
                        const hasNoChildren = child.children.length === 0;

                        if(!sameInnerText && hasNoChildren) {
                            child.innerText = newChild.innerText;
                        }

                        const sameTags = child.tagName === newChild.tagName;

                        if(!sameTags) {
                            child.replaceWith(newChild);
                            continue;
                        }

                        const attributes = attributesMap(child.attributes);
                        const newAttributes = attributesMap(newChild.attributes);
                        const addedAttributeNames = [];

                        for(const [name, value] of Object.entries(attributes)) {
                            const hasUnusedAttribute = !(name in newAttributes);
                            const isCjsAttribute = name.startsWith(CJS_PREFIX);

                            if(hasUnusedAttribute) {
                                child.removeAttribute(name);

                                if(isCjsAttribute) {
                                    functionMappings.removeElementAppliedFunctions(name);
                                }

                                continue;
                            }

                            const newAttributeValue = newAttributes[name];

                            const isSameValue = value === newAttributeValue;

                            if(!isSameValue) {
                                child.setAttribute(name, newAttributeValue);
                                addedAttributeNames.push(name);
                                continue;
                            }
                        }

                        for(const [name, value] of Object.entries(newAttributes)) {
                            const wasAdded = addedAttributeNames.includes(name);

                            if(wasAdded) continue;

                            const isCjsAttribute = name.startsWith(CJS_PREFIX);

                            if(isCjsAttribute) {
                                functionMappings.applyElementAttributeMappingFunction(child, name, false);
                            }

                            child.setAttribute(name, value);
                        }
                    }

                    if(parent.nodeType === Node.ELEMENT_NODE && newParent.nodeType === Node.ELEMENT_NODE) {
                        if(parent.children.length > newParent.children.length) {
                            const diff = parent.children.length - newParent.children.length;
                            const childrenToRemove = Array.from(parent.children).slice(-1 * diff);
    
                            childrenToRemove.forEach(c => c.remove());
                        }
                    }

                    const childrenToAppend = newChildren.slice(children.length);

                    for(const child of childrenToAppend) {
                        parent.appendChild(child);
                    }
                }

                /**
                 * 
                 * @param {HTMLElement} root 
                 * @param {HTMLElement} newRoot 
                 */
                const traverse = (root, newRoot) => {
                    walk(root, newRoot);

                    let rootChildNode = root.firstChild;
                    let newRootChildNode = newRoot !== null ? newRoot.firstChild : null;
                    while(rootChildNode) {
                        if(rootChildNode.nodeType === Node.ELEMENT_NODE) {
                            traverse(rootChildNode, newRootChildNode);
                        }

                        if(newRootChildNode === null) return;

                        rootChildNode = rootChildNode.nextSibling;
                        newRootChildNode = newRootChildNode.nextSibling;
                    }
                }

                traverse(component, element);
            }
        } else {
            for(const component of components) {
                component.replaceWith(element);
            }
        }

        return this;
    }

    /**
     * Set function that will be executed when element is loaded on website
     * @param {() => void} callback 
     */
    onLoad(callback) {
        this.#onLoadCallback = callback;
    }

    /**
     * Sets load data for generic onLoad function
     * @param {object} onLoadData 
     * @returns {CjsPart|CjsComponent}
     */
    _setOnLoadData(onLoadData) {
        this._onLoadData = onLoadData;

        return this;
    }

    /**
     * Executes the onLoad function
     * @param {object} data information passed to onLoad function
     */
    _executeOnLoad(data) {
        this.#onLoadCallback(data);
        
        if(this.#fillHeightData !== undefined) {
            const { maxHeight, offset } = this.#fillHeightData;
            const element = this.toElement();
            const resize = () => element.style.height = `${window.innerHeight > maxHeight ? maxHeight : window.innerHeight + offset}px`;

            resize();

            window.addEventListener('resize', resize);
        }
    }

    /**
     * Imports style to element from specified file
     * @param {string} path path of the specific style file (.css)
     * @param {CjsStyleImportOptions} options
     */
    importStyle(path, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true } ) {
        addRootStyle(this.attribute, path, options).then();
    }

    /**
     * Sets default data, so if there is no values in original data, the missing values will be replaced with defaults
     * @param {object} data 
     * @returns {CjsComponent}
     */
    setDefaultData(data) {
        const isObject = (any) => { return any instanceof Object; }

        if(!isObject(data)) return console.log(`${CJS_PRETTY_PREFIX_X}Data passed into setDefaultData() have to be object type argument`);

        this.defaultData = data;

        return this;
    }


    /**
     * Returns the first element that is a descendant of node that matches selectors (only for the first instance of the component).
     * @param {string} selectors 
     * @returns {HTMLElement|Element|null}
     */
    querySelector(selectors) {
        return this.toElement().querySelector(selectors);
    }

    /**
     * Returns all element descendants of node that match selectors (for all instances of component).
     * @param {string} selectors 
     * @returns {HTMLElement[]|Element[]}
     */
    querySelectorAll(selectors) {
        return Array.from(this.toElement().querySelectorAll(selectors));
    }
}
class CjsLayout {
    /** @type {(object) => void} Callback that is called when element is loaded into website */
    #onLoadCallback = function(data) {};

    /** @type {{ default: object|null, active: object|null }} */
    #data = { default: null, active: null };

    /** @type {string} attribute identifier of layout */
    attribute;

    /**
     * @param {CjsComponent|CjsLayout[][]} elements 
     */
    constructor(elements) {
        this.elements = elements;

        this.attribute = Cjs.generateAttribute(CJS_LAYOUT_PREFIX, CjsTakenAttributes.layouts);
    }

    /**
     * Set function that will be executed when layout is loaded on website
     * @param {function} callback 
     */
    onLoad(callback) {
        this.#onLoadCallback = (data) => {
            CjsFrameworkEvents.onLoadLayout(this);
            callback(data);
        };
    }

    /**
     * Executes the onLoad function and sub components and layouts onLoad's
     * @param {object} data information passed to onLoad function
     */
    _executeOnLoad(data) {
        flattenInfinite(this.elements).forEach(element => { 
            const isLayout = element instanceof CjsLayout;

            if(isLayout) {
                element._executeOnLoad();
                return;
            }

            const isComponent = element instanceof CjsComponent;

            if(isComponent) {
                // element._executeOnLoad(this.data);
                element._setOnLoadData(this.data);
                return;
            }
        });

        this.#onLoadCallback(data);
    }

    /**
     * Finds component in layout
     * @param {CjsComponent} component
     * @returns {CjsComponent|null}
     */
    select(component) {
        const filtered = flattenInfinite(this.elements).filter(e => e.attribute === component.attribute);
        const componentNotExists = filtered.length === 0;

        if(componentNotExists) {
            console.log(`${CJS_PRETTY_PREFIX_X}Component not found when trying to use select(), make sure that provided component exists in layout`);
        
            return null;
        }

        return filtered[0];
    }

    /**
     * Provides data defined globally in layout
     * @returns {object} 
     */
    get data() {
        return this.#data.active;
    }

    /**
     * Resets layout data to state where first has been set
     * @returns {CjsLayout}
     */
    resetToDefaultData() {
        const isDefaultDataAlreadySet = this.#data.default !== null;

        if(!isDefaultDataAlreadySet) {
            console.log(`${CJS_PRETTY_PREFIX_X}Cannot reset layout data to default, because default data is not set`);

            return this;
        }

        this.#data.active = Object.assign({}, this.#data.default);

        return this;
    }

    /**
     * Sets global layout data
     * @param {object} data 
     * @returns {CjsLayout}
     */
    setData(data) {
        const isDefaultDataAlreadySet = this.#data.default !== null;

        if(isDefaultDataAlreadySet) {
            /**
             * 
             * @param {object} existing existing default layout data
             * @param {object} provided values provided by user to overwrite layout data
             * @returns {object} merged data with overwritten data
             */
            const overwriteNotSetValues = (existing, provided) => {
                // Deep clone the default configuration to avoid modifying it directly
                // TODO change that in the future, if passed for example custom class inside data
                // const merged = JSON.parse(JSON.stringify(existing));

                /**
                 * Created very deep copy for provided object
                 * @param {object} obj input
                 * @returns {object} copied object
                 */
                const deepObjectCopy = (obj) => {
                    const isPrimitive = obj === null || typeof obj !== 'object'; // like int, string, etc.

                    if(isPrimitive) return obj;

                    const isCustomClass = obj.constructor && obj.constructor !== Object
                    
                    if(isCustomClass) return new obj.constructor();

                    const isArray = Array.isArray(obj)
                    
                    if(isArray) {
                        const newArray = [];
                        
                        for (let i = 0; i < obj.length; i++) { newArray[i] = deepObjectCopy(obj[i]); }

                        return newArray;
                    }
                    
                    // If obj is a plain object, create a new object and deep copy each property
                    const newObj = {};

                    for (const key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;

                        newObj[key] = deepObjectCopy(obj[key]);
                    }

                    return newObj;
                }

                const merged = deepObjectCopy(existing);

                /**
                 * Recursive function that merged two objects
                 * @param {object} obj1 
                 * @param {object} obj2 
                 */
                const walk = (obj1, obj2) => {
                    for (const key in obj2) {
                        if(!obj2.hasOwnProperty(key)) continue;
        
                        if (typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]) {
                            // If both are objects, merge them recursively
                            walk(obj1[key], obj2[key]);
                        } else {
                            // Otherwise, overwrite the value from user settings
                            obj1[key] = obj2[key];
                        }
                    }
                }
            
                walk(merged, provided);
            
                return merged;
            }

            this.#data.active = overwriteNotSetValues(this.#data.default, data)
        
            return this;
        }

        this.#data.default = Object.assign({}, data);
        this.#data.active = Object.assign({}, this.#data.default)

        return this;
    }

    /**
     * Replaces the website content with layout elements
     */
    replacePage() {
        const container = document.getElementById(CJS_ROOT_CONTAINER_PREFIX);

        container.innerHTML = ``;
        container.appendChild(this.toElement());

        this._executeOnLoad(this.#data.active);
    }

    /**
     * Finds layout in the DOM by query selector
     * @returns {HTMLElement}
     */
    getElement() {
        return document.body.querySelector(`[${this.attribute}]`);
    }

    /**
     * Checks if element exists in DOM
     * @returns {boolean}
     */
    exists() {
        return document.body.querySelector(`[${this.attribute}]`) !== null;
    }

    /**
     * Creates the HTMLElement from other layouts and components inside layout
     * @returns {HTMLElement} layout element
     */
    toElement() {
        const container = document.createElement("div");

        container.setAttribute(this.attribute, "");

        /**
         * 
         * @param {CjsComponent|CjsLayout[][]} elements 
         * @param {object} parentLayoutData
         * @returns {HTMLElement}
         */
        const walk = (elements, parentLayoutData) => {
            const componentInArray = elements instanceof Array;

            if(!componentInArray) {
                console.log(`${CJS_PRETTY_PREFIX_X}Layout have wrong pattern, component should be in array`);

                return document.createElement(`cjslayouterror`);
            }

            const noComponents = elements.length === 0;

            if(noComponents) {
                console.log(`${CJS_PRETTY_PREFIX_X}Layout have an empty component space`);

                return document.createElement(`cjslayouterror`);
            }

            const layoutElement = elements[0];
            const isLayout = layoutElement instanceof CjsLayout

            if(isLayout) return layoutElement.toElement();

            const isComponent = layoutElement instanceof CjsComponent;

            if(!isComponent) {
                console.log(`${CJS_PRETTY_PREFIX_X}The passed element inside layout is not CjsComponent and CjsLayout, expected CjsComponent or CjsLayout`);

                return document.createElement(`cjslayouterror`);
            }
            
            /**
             * @type {CjsComponent}
             */
            const component = layoutElement._setOnLoadData(parentLayoutData).toVirtualElement();
            const hasParentAndChild = elements.length === 2;

            if(hasParentAndChild) {
                /**
                 * @type {CjsComponent|CjsLayout[]}
                 */
                const componentChildren = elements[1]
                const isChildAnArray = componentChildren instanceof Array;

                if(!isChildAnArray) return console.log(`${CJS_PRETTY_PREFIX_X}Layout sub components at second argument have to be Array`);

                componentChildren.forEach(componentChild => {
                    component.insertAdjacentElement(`beforeend`, walk(componentChild, parentLayoutData))
                });
            }

            return component;
        }

        this.elements.forEach(elements => {
            container.insertAdjacentElement(`beforeend`, walk(elements, this.#data.active));
        });

        return container;
    }

    /**
     * Sets display to none
     */
    hide() {
        this.getElement().style.display = 'none';
    }

    /**
     * Removes display style property
     */
    show() {
        this.getElement().style.display = '';
    }

    /**
     * Rerenders all layouts this type
     * @returns {CjsLayout}
     */
    rerenderLayouts() {
        const layouts = Array.from(document.body.querySelectorAll(`[${this.attribute}]`));
        const newLayout = this.toElement();

        for(const layout of layouts) {
            layout.replaceWith(newLayout);

            setTimeout(() => {
                this._executeOnLoad();

                CjsFrameworkEvents.onLoadLayout(this);
            }, 2);
        }

        return this;
    }
}
class CjsComponentsCollection {

    /** @param {function(HTMLElement)} func */
    #call = (func) => {
        this.components.forEach(c => func(c));
    }

    /** @param {HTMLElement} */
    _add(element) {
        this.components.push(element);
    }

    /** @type {HTMLElement[]} */
    components;

    /**
     * @param {NodeListOf<HTMLElement>} components 
     */
    constructor(components) {
        this.components = Array.from(components);
    }

    /**
     * Sets the class name for all components
     * @param {string} token
     */
    set className(token) {
        this.#call((c) => c.className = token);
    }

    /**
     * Returns the value of first component className
     * @returns {string|null}
     */
    get className() {
        if(this.components.length === 0) return null;

        return this.components[0].className;
    }

    /**
     * Allows for manipulation of element's class content attribute as a set of whitespace-separated tokens through a DOMTokenList object.
     */
    get classList() {
        return {
            /**
             * @param {...string} tokens 
             */
            add: (tokens) => this.#call((c) => c.classList.add(tokens)),
            /**
             * @param {...string} tokens 
             */
            remove: (...tokens) => this.#call((c) => c.classList.remove(tokens)),
            /**
             * @param {string} token 
             */
            contains: (token) => {
                let allContains = true;

                this.#call((c) => {
                    if(!allContains) return;

                    if(!c.classList.contains(token)) allContains = false;
                });
                
                return allContains;
            },
            /**
             * @param {string} token 
             * @param {boolean} force
             */
            toggle: (token, force = false) => this.#call((c) => c.classList.toggle(token, force)),
            /**
             * Adds class except the provided element
             * @param {string} token 
             * @param {HTMLElement} except 
             */
            addExcept: (token, except) => {
                this.#call((c) => {
                    if(c === except) return;

                    c.classList.add(token);
                });
            },
            /**
             * Removes class except the provided element
             * @param {string} token 
             * @param {HTMLElement} except 
             */
            removeExcept: (token, except) => {
                this.#call((c) => {
                    if(c === except) return;

                    c.classList.remove(token);
                });
            },
            /**
             * Adds class to provided element, removes class from every other component
             * @param {string} token 
             * @param {HTMLElement} only 
             */
            addOnlyRemoveOthers: (token, only) => {
                this.#call((c) => {
                    c.classList[c === only ? "add" : "remove"](token);
                });
            },
            /**
             * Removes class from provided element, adds class to every other component
             * @param {string} token 
             * @param {HTMLElement} only 
             */
            removeOnlyAddOthers: (token, only) => {
                this.#call((c) => {
                    c.classList[c === only ? "remove" : "add"](token);
                });
            },
        }
    }
}
/** @type {CjsPage[]} */
const CjsPages = [];

/**
 * @class
 * @classdesc Organiser for declaring website sub pages
 */
class CjsPage extends CjsLayout {
    /**
     * @param {string} basename
     * @param {CjsComponent|CjsLayout[][]} elements 
     */
    constructor(basename, elements) {
        super(elements);

        this.basename = basename;

        CjsPages.push(this);
    }
}
/**
 * Executes when changed the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onChange(f) {
    return functionMappings.add("change", (e, s) => f(new CjsEvent(e, s)));
}
/**
 * Executes when clicked on the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onClick(f) {
    return functionMappings.add("click", (e, s) => f(new CjsEvent(e, s)))
}
/**
 * Executes when double-clicked on the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onDblclick(f) {
    return functionMappings.add("dblclick", (e, s) => f(new CjsEvent(e, s)));
}
/**
 * Executes when focused the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onFocus(f) {
    return functionMappings.add("focus", (e, s) => f(new CjsEvent(e, s)));
}
/**
 * Executes when focused out the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onFocusOut(f) {
    return functionMappings.add("focusout", (e, s) => f(new CjsEvent(e, s)));
}
/**
 * Executes when typed in the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onInput(f) {
    return functionMappings.add("input", (e, s) => f(new CjsEvent(e, s)))
}
/**
 * Executes when mouse enter the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onMouseenter(f) {
    return functionMappings.add("mouseenter", (e, s) => f(new CjsEvent(e, s)));
}
/**
 * Executes when mouse leave the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onMouseleave(f) {
    return functionMappings.add("mouseleave", (e, s) => f(new CjsEvent(e, s)));
}
/**
 * Executes when mouse moves on the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onMouseMove(f) {
    return functionMappings.add("mousemove", (e, s) => f(new CjsEvent(e, s)));
}
/**
 * Executes when move-touched the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onTouchMove(f) {
    return functionMappings.add("touchmove", (e, s) => f(new CjsEvent(e, s)));
}
/**
 * Executes when hold down in touch or click on specific element
 * @param {function(CjsEvent)} f
 * @param {number} time time of hold down in ms
 * @returns {string}
 */
function onHoldDown(f, time = 500) {
    return onLoad(cjsEvent => {
        let timeout;

        const cancel = () => { clearTimeout(timeout); }
        const down = () => {
            timeout = setTimeout(() => {
                f(cjsEvent);
            }, time);
        }

        cjsEvent.source.addEventListener('mousedown', down);
        cjsEvent.source.addEventListener('touchstart', down);

        cjsEvent.source.addEventListener('mouseup', cancel);
        cjsEvent.source.addEventListener('mousemove', cancel);
        cjsEvent.source.addEventListener('touchend', cancel);
        cjsEvent.source.addEventListener('touchcancel', cancel);
        cjsEvent.source.addEventListener('touchmove', cancel);
    })
}
/**
 * Executes when element is being loaded into website
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onLoad(f) {
    return mutationListener.listen("add", f);
}
/**
 * Executes when clicked outside the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onOuterclick(f) {
    return functionMappings.add("click", (event, source) => {
        if (!document.body.contains(source)) return;

        if (source !== event.target && !source.contains(event.target)) {
            f(new CjsEvent(event, source));
        }
    }, { windowApplied: true, additionalName: 'outerclick' });
}
/**
 * Extecutes when slided by touch of mouse drag down by certain threshold
 * @param {function(CjsEvent)} f
 * @param {number} slideThreshold
 * @returns {string}
 */
function onSlideDown(f, slideThreshold = 10) {
    return onLoad((cjsEvent) => {
        let startY;
        let lastClientY = null;

        const start = (e) => {
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            lastClientY = clientY;
            startY = clientY;
        }

        const move = (e) => {
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientY + 1 >= lastClientY;
            const deltaY = clientY - startY;

            if(!moveProgressed) {
                startY = undefined;
                return;
            }

            if(deltaY > slideThreshold) {
                f(cjsEvent)

                startY = undefined;
            }

            lastClientY = clientY;
        }

        cjsEvent.source.addEventListener('mousedown', start)
        cjsEvent.source.addEventListener('touchstart', start)

        cjsEvent.source.addEventListener('mousemove', move);
        cjsEvent.source.addEventListener('touchmove', move);
    });
}
/**
 * Extecutes when slided by touch of mouse drag to left by certain threshold
 * @param {function(CjsEvent)} f
 * @param {number} slideThreshold triggers event when user slides by that amount of pixels
 * @param {number} cancelUpDownThreshold cancels event when user slides down or up too much (if disable just set -1)
 * @returns {string}
 */
function onSlideLeft(f, slideThreshold = 50, cancelUpDownThreshold = 50) {
    return onLoad((cjsEvent) => {
        let mouse = { startX: null, startY: null, lastX: null, lastY: null }

        const start = (e) => {
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            mouse.lastX = clientX;
            mouse.startX = clientX;
            mouse.lastY = clientY;
            mouse.startY = clientY;
        }

        const move = (e) => {
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientX - 1 <= mouse.lastX;
            const deltaX = clientX - mouse.startX;
            const deltaY = clientY - mouse.startY;

            if(cancelUpDownThreshold !== -1 && cancelUpDownThreshold < Math.abs(deltaY)) {
                mouse.startX = undefined;
                return;
            }

            if(!moveProgressed) {
                mouse.startX = undefined;
                return;
            }

            if(deltaX < -1 * slideThreshold) {
                f(cjsEvent)

                mouse.startX = undefined;
            }

            mouse.lastX = clientX;
        }

        cjsEvent.source.addEventListener('mousedown', start)
        cjsEvent.source.addEventListener('touchstart', start)

        cjsEvent.source.addEventListener('mousemove', move);
        cjsEvent.source.addEventListener('touchmove', move);
    });
}
/**
 * Extecutes when slided by touch of mouse drag to right by certain threshold
 * @param {function(CjsEvent)} f
 * @param {number} slideThreshold triggers event when user slides by that amount of pixels
 * @param {number} cancelUpDownThreshold cancels event when user slides down or up too much (if disable just set -1)
 * @returns {string}
 */
function onSlideRight(f, slideThreshold = 50, cancelUpDownThreshold = 50) {
    return onLoad((cjsEvent) => {
        let mouse = { startX: null, startY: null, lastX: null, lastY: null }

        const start = (e) => {
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            mouse.lastX = clientX;
            mouse.startX = clientX;
            mouse.lastY = clientY;
            mouse.startY = clientY;
        }

        const move = (e) => {
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientX + 1 >= mouse.lastX;
            const deltaX = clientX - mouse.startX;
            const deltaY = clientY - mouse.startY;

            if(cancelUpDownThreshold !== -1 && cancelUpDownThreshold < Math.abs(deltaY)) {
                mouse.startX = undefined;
                return;
            }

            if(!moveProgressed) {
                mouse.startX = undefined;
                return;
            }

            if(deltaX > slideThreshold) {
                f(cjsEvent)

                mouse.startX = undefined;
            }

            mouse.lastX = clientX
        }

        cjsEvent.source.addEventListener('mousedown', start)
        cjsEvent.source.addEventListener('touchstart', start)

        cjsEvent.source.addEventListener('mousemove', move);
        cjsEvent.source.addEventListener('touchmove', move);
    });
}
/**
 * Extecutes when slided by touch of mouse drag up by certain threshold
 * @param {function(CjsEvent)} f
 * @param {number} slideThreshold
 * @returns {string}
 */
function onSlideUp(f, slideThreshold = 10) {
    return onLoad((cjsEvent) => {
        let startY;
        let lastClientY = null;

        const start = (e) => {
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            lastClientY = clientY;
            startY = clientY;
        }

        const move = (e) => {
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientY - 1 <= lastClientY;
            const deltaY = clientY - startY;

            if(!moveProgressed) {
                startY = undefined;
                return;
            }

            if(deltaY < -1 *  slideThreshold) {
                f(cjsEvent)

                startY = undefined;
            }

            lastClientY = clientY;
        }

        cjsEvent.source.addEventListener('mousedown', start)
        cjsEvent.source.addEventListener('touchstart', start)

        cjsEvent.source.addEventListener('mousemove', move);
        cjsEvent.source.addEventListener('touchmove', move);
    });
}
/**
 * Disables all events in element, where this attribute is passed
 * @param {CjsCustomEvents} event
 */
function off(...event) {
    return functionMappings.disable(event);
}
class FunctionMappings {
    constructor() {
        this.mappings = new Map(); // attribute, { type: "click", action: function }
        this.disabled = new Map(); // attribute, { events: ["click", "input", "outerclick"] }
        this.appliedFunctions = new Map(); // attribute, [ { element: HTMLElement, type: "click", mappingFunction: function } ]
    }

    /**
     * Adds new listener to website for provided event
     * @param {CjsCommonEvents} type
     * @param {function} mappingFunction
     * @param {{windowApplied: boolean, additionalName: string|null}} options
     * @param {object} data
     * @returns {string} attribute
     */
    add(type, mappingFunction, options = { windowApplied: false, additionalName: null }, data = {}) {
        let attribute = null;

        while (this.mappings.has(attribute) || attribute == null) {
            attribute = `${CJS_ELEMENT_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
        }

        this.mappings.set(attribute, { type: type, action: mappingFunction, options: options, data: data, isApplied: false, isLocked: false });

        return ` ${attribute} `; // space between
    }

    /**
     * Disables the provided event from being executed
     * @param {CjsCustomEvents} event
     * @returns {string}
     */
    disable(event) {
        let attribute = null;

        while (this.mappings.has(attribute) || attribute == null) {
            attribute = `${CJS_ELEMENT_DISABLED_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
        }

        this.disabled.set(attribute, { events: event })

        return ` ${attribute} `;
    }

    /**
     * Clones mapping without cloning the data and isApplied parameter
     * @param sourceAttribute
     * @returns {string|null}
     */
    cloneMapping(sourceAttribute) {
        if(!this.mappings.has(sourceAttribute)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Cannot clone mapping for ${Colors.Yellow}"${sourceAttribute}"${Colors.None}, because it does not exists`)
            return null;
        }

        const mapping = this.mappings.get(sourceAttribute);

        return this.add(mapping.type, mapping.action, mapping.options, mapping.data);
    }

    getElementActionAttributes(element, filterEventType = null, includeChildren = false) {
        const attributes = [];

        for(const child of [element, ...(includeChildren ? Array.from(element.children) : [])]) {
            let attributesStarting = getAttributeStartingWith(child, CJS_ELEMENT_PREFIX);

            if(filterEventType !== null) {
                attributesStarting.forEach(attributeStarting => {
                    if(!this.mappings.has(attributeStarting)) return;

                    const mapping = this.mappings.get(attributeStarting);

                    const { additionalName } = mapping.options;
                    const eventNameNotMatch = mapping.type !== filterEventType;
                    const additionalNameNotMatch = additionalName === null || filterEventType !== additionalName;

                    if(eventNameNotMatch && additionalNameNotMatch) return;

                    attributes.push(attributeStarting);
                })
            } else {
                attributesStarting.forEach(attributeStarting => {
                    attributes.push(attributeStarting);
                })
            }
        }

        return flattenInfinite(attributes);
    }

    setEventAttributeLocked(attribute, isLocked) {
        if(!this.mappings.has(attribute)) return console.log(`${CJS_PRETTY_PREFIX_X}Cannot set data for ${Colors.Yellow}${attribute}${Colors.None}, because it doesn't exists`);

        const mapping = this.mappings.get(attribute);

        mapping.isLocked = isLocked;
    }

    isEventAttributeLocked(attribute) {
        if(!this.mappings.has(attribute)) return console.log(`${CJS_PRETTY_PREFIX_X}Cannot set data for ${Colors.Yellow}"${attribute}"${Colors.None}, because it doesn't exists`);

        const mapping = this.mappings.get(attribute);

        return mapping.isLocked;
    }

    /**
     *
     * @param {string} attribute
     * @param {object} data
     */
    setData(attribute, data) {
        if(!this.mappings.has(attribute)) return console.log(`${CJS_PRETTY_PREFIX_X}Cannot set data for ${Colors.Yellow}"${attribute}"${Colors.None}, because it doesn't exists`);

        const mapping = this.mappings.get(attribute);

        mapping.data = data;
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {string} attribute
     * @param {boolean} allowDuplicates
     */
    applyElementAttributeMappingFunction(element, attribute, allowDuplicates = false) {
        if(!this.mappings.has(attribute)) return;

        const mapping = this.mappings.get(attribute);

        if(mapping.isApplied && !allowDuplicates) return;

        mapping.isApplied = true;

        if(!element) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Fatal error mapping for ${Colors.Yellow}"${attribute}"${Colors.None} failed, cannot find element matching that attribute`);
        }

        const targetElementEvent = (mapping.options.windowApplied ? window : element);

        const eventFunction = (event) => {
            const parent = findParentThatHasAttribute(
                mapping.options.windowApplied ? event.target : element,
                CJS_ELEMENT_DISABLED_PREFIX,
                true
            );

            if(parent !== null) {
                const startingAttributes = getAttributeStartingWith(parent, CJS_ELEMENT_DISABLED_PREFIX);

                for(const startingAttribute of startingAttributes) {
                    if(!this.disabled.has(startingAttribute)) continue;

                    const data = this.disabled.get(startingAttribute);

                    const hasDisabledCommonEvent = data.events.includes(mapping.type);
                    const hasDisabledAdditionalEvent = mapping.options.additionalName !== null && data.events.includes(mapping.options.additionalName)

                    if(hasDisabledCommonEvent || hasDisabledAdditionalEvent) {
                        return;
                    }
                }
            }

            if(this.isEventAttributeLocked(attribute)) return;

            mapping.action(event, element, mapping.data);
        }

        // Remove last applied event to prevent multi addEventListener to the element
        if(this.appliedFunctions.has(attribute)) { 
            const lastApplied = this.appliedFunctions.get(attribute);

            targetElementEvent.removeEventListener(lastApplied.type, lastApplied.mappingFunction);
        }

        this.appliedFunctions.set(attribute, { element: targetElementEvent, type: mapping.type, mappingFunction: eventFunction });

        targetElementEvent.addEventListener(mapping.type, eventFunction);
    }

    /**
     * Removes applied functions on element with specific attribute
     * @param {string} attribute 
     * @returns {boolean} if is success or not
     */
    removeElementAppliedFunctions(attribute) {
        if(!this.appliedFunctions.has(attribute)) {
            return false;
        }

        const data = this.appliedFunctions.get(attribute);
        const { element, type, mappingFunction } = data;

        element.removeEventListener(type, mappingFunction);

        return true;
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {boolean} allowDuplicates
     */
    applyElementMappingFunction(element, allowDuplicates = false) {
        const attributes = getAttributeStartingWith(element, CJS_ELEMENT_PREFIX);

        for(const attribute of attributes) {
            this.applyElementAttributeMappingFunction(element, attribute, allowDuplicates);
        }
    }

    /**
     * Applies mappings to all elements in body without duplicates (theoretically)
     */
    applyBodyMappings() {
        for (const element of document.body.querySelectorAll("*")) {
            this.applyElementMappingFunction(element, false, 'body')
        }
    }
}

const functionMappings = new FunctionMappings();
/**
 * @class
 * @classdesc Class for detecting elements that appear in user view
 */
class CjsIntersectionListener {
    /**
     * @param {IntersectionObserverEntry[]} entries 
     */
    #callback = (entries) => {
        for(const entry of entries) {
            if(!entry.isIntersecting) continue;

            const attribute = getAttributeStartingWith(entry.target, CjsLazyElementPrefix)[0];
            const DOMElement = document.body.querySelector(`[${attribute}]`);

            this.performLazy(DOMElement);
        }
    }

    constructor() {
        this.observer = new IntersectionObserver(this.#callback, {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        });
    }

    /**
     * @param {Node} element 
     */
    observe(element) {
        const attributes = getAttributeStartingWith(element, CjsLazyElementPrefix);
        const noLazyAttribute = attributes.length === 0;

        if(noLazyAttribute) return;

        const attribute = attributes[0];
        const DOMElement = document.body.querySelector(`[${attribute}]`);

        this.observer.observe(DOMElement);
    }

    /**
     * Observes all elements with attribute
     */
    observeAll() {
        const elements = Array.from(document.querySelectorAll(`[class*='${CjsLazyClassPrefix}']`));

        elements.forEach(element => {
            this.observe(element);
        });
    }

    /**
     * @param {HTMLElement} element 
     */
    performLazy(element) {
        if(element.classList.length === 0) return this.observer.unobserve(element);

        const lazyClass = Array.from(element.classList).find(cls => cls.startsWith(CjsLazyClassPrefix));

        if (lazyClass) {
            const classNameToAdd = lazyClass.slice(CjsLazyClassPrefix.length);
            
            element.classList.remove(lazyClass);
            element.classList.add(classNameToAdd);
        }

        this.observer.unobserve(element);
    }
}
class CjsMutationEvent {
    /**
     * @param {HTMLElement} target
     * @param {Date} date
     */
    constructor(target, date) {
        this.target = target;
        this.date = date;
    }
}

/**
 * @class
 * @classdesc Class for detecting elements that are inserted into website DOM
 */
class CjsMutationListener {
    /** @type {(element: Node) => {}} */
    #onAddCallback = () => {};

    /**
     * @param {string} attribute 
     * @returns {HTMLElement[]}
     */
    #findRealElements = (attribute) => {
        return Array
            .from(document.querySelectorAll(`[${attribute}='']`))
            .flat()
    }

    /**
     * @param {MutationRecord[]} mutationsList 
     */
    #callback = (mutationsList) => {
        const childListMutations = mutationsList
        .filter((mutation) => mutation.type === 'childList');

        for(
            const fictionChild of childListMutations
                .map((mutation) => Array.from(mutation.addedNodes))
                .flat()
                .map((addedNode) => {
                    // Convert Node to HTMLElement
                    const element = document.createElement("div");
                    element.appendChild(addedNode.cloneNode(true));
            
                    return element;
                })
                .map((element) => [element, ...element.querySelectorAll("*")])
                .flat()
        ) {
            this.#onAddCallback(fictionChild);

            const elements = {
                element: getAttributeStartingWith(fictionChild, CJS_ELEMENT_PREFIX)
                    .map(attribute => {
                        return {
                            elements: this.#findRealElements(attribute),
                            attribute
                        }
                    })
                    .flat(),
                observer: getAttributeStartingWith(fictionChild, CJS_OBSERVER_PREFIX)
                    .map(attribute => {
                        return {
                            elements: this.#findRealElements(attribute),
                            attribute
                        }
                    })
                    .flat()
            }

            if(cjsRunnable.isStyleValid()) {
                const attributes = Array
                    .from(fictionChild.attributes)
                    .filter(attribute => CjsRunnableStyleWatcher.has(attribute.name));

                for(const attribute of attributes) {
                    // Find real path of the source style file
                    const runnableStyleWatcherData = CjsRunnableStyleWatcher.get(attribute.name);

                    // Find the short class name (compressed name) for style
                    const runnableDetailsData = CjsRunnableDetails.style.map.get(runnableStyleWatcherData.path);

                    if(!CjsRunnableDetails.style.map.has(runnableStyleWatcherData.path)){
                        console.log(`${CJS_PRETTY_PREFIX_X}Could not found the ${runnableStyleWatcherData.path} style file`)
                        return;
                    }

                    this.#findRealElements(attribute.name).forEach(child => {
                        child.setAttribute(runnableDetailsData.prefix, "");
                    });
                }
            }
            
            elements.element.forEach(data => {
                const { elements, attribute } = data;

                elements.forEach(element => {
                    // Allowing duplicates because of the child was added right now so it does not have any event yet
                    functionMappings.applyElementAttributeMappingFunction(element, attribute, true);
                });
            });

            elements.observer.forEach(data => {
                const { elements, attribute } = data;

                elements.forEach(element => {
                    this.execute("add", attribute, element);
                });
            });
        }

        for(
            const removedNode of childListMutations
                .map((mutation) => mutation.removedNodes)
                .flat()
        ) {
            const attributes = getAttributeStartingWith(removedNode, CJS_OBSERVER_PREFIX);

            attributes.forEach(attribute => {
                this.execute("remove", attribute, removedNode);
            });
        }
    }

    constructor() {
        this.map = new Map(); // attribute, { type: string, action: function, data: object }
        this.executedFunctions = new Map(); // attribute, { element: HTMLElement }
        this.observer = new MutationObserver(this.#callback);
    }

    observe() {
        this.observer.observe(document, { childList: true, subtree: true });
    }

    /**
     * @param {(element: Node) => {}} callback 
     */
    _onAdd(callback) {
        this.#onAddCallback = callback;
    }

    /**
     * @param {"add"|"remove"} type
     * @param {function(CjsEvent)} f function to execute when changes observer detects the trigger
     * @returns {string} attribute
     */
    listen(type, f) {
        if(!["add", "remove"].includes(type)) {
            console.log(`${CJS_PRETTY_PREFIX_X}The 'type' param should be 'add' or 'remove'`)
            return null;
        }

        let attribute = null;

        while (this.map.has(attribute) || attribute === null) {
            attribute = `${CJS_OBSERVER_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`
        }

        this.map.set(attribute, { type: type, action: f, data: {} });

        return ` ${attribute} `;
    }

    /**
     * @param {string} attribute
     * @return {string|null} new attribute
     */
    cloneAttribute(attribute) {
        if(!this.map.has(attribute)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Map does not contain the attribute ${attribute}`);

            return null;
        }

        let newAttribute = null;

        while (this.map.has(newAttribute) || newAttribute === null) {
            newAttribute = `${CJS_OBSERVER_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`
        }

        const obj = Object.assign({}, this.map.get(attribute));

        this.map.set(newAttribute, obj);

        return newAttribute;
    }

    /**
     * @param {HTMLElement} element 
     * @param {string} oldAttribute 
     * @param {string} newAttribute 
     */
    replaceAttribute(element, oldAttribute, newAttribute) {
        element.removeAttribute(oldAttribute);
        element.setAttribute(newAttribute, "");
    }

    /**
     * Observer needs to reload attributes
     * @param {string} attribute
     * @param {object} data
     * @returns {string|Null}
     */
    setData(attribute, data) {
        if(!this.map.has(attribute)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Provided attribute does not exists`)
            return null;
        }

        const newAttribute = this.cloneAttribute(attribute);
        const obj = this.map.get(newAttribute);

        obj.data = data;

        return newAttribute;
    }

    /**
     * @param {"add"|"remove"} type
     */
    executeAll(type) {
        for(const [attribute, data] of CjsRunnableStyleWatcher.entries()) {
            const elements = document.body.querySelectorAll(`[${attribute}='']`);

            if(elements.length === 0) continue;

            elements.forEach(element => {
                const parsedPath = data.path;
                const attribute = CjsRunnableDetails.style.map.get(parsedPath);

                element.setAttribute(attribute.prefix, "");
            })
        }

        for(const [attribute, obj] of this.map.entries()) {
            if(obj.type !== type) continue;

            const elements = document.body.querySelectorAll(`[${attribute}='']`);

            if(elements.length === 0) continue;

            elements.forEach(element => {
                this.execute(type, attribute, element);
            });
        }
    }

    /**
     * @param {"add"|"remove"} type
     * @param {string} attribute
     * @param {HTMLElement|Node} element source element that has been changed
     */
    execute(type, attribute, element) {
        if(!this.map.has(attribute)) return;

        const isRegistered = this.executedFunctions.has(attribute);

        if(isRegistered) {
            const registeredElementMatches = this.executedFunctions.get(attribute).element === element

            if(registeredElementMatches) return;
        }

        const obj = this.map.get(attribute);

        if(obj.type !== type) return;

        const cjsEvent = new CjsEvent(
            new CjsMutationEvent(element, new Date()),
            findParentThatHasAttribute(element, CJS_COMPONENT_PREFIX),
            element,
        );

        obj.action(cjsEvent);

        if(!this.executedFunctions.has(attribute)) {
            this.executedFunctions.set(attribute, { element: element })
        }
    }
}
const mutationListener = new CjsMutationListener();
const insertionListener = new CjsIntersectionListener();

mutationListener._onAdd((node) => {
    insertionListener.observe(node);
});

window.addEventListener('DOMContentLoaded', () => {
    insertionListener.observeAll();

    mutationListener.observe();
    mutationListener.executeAll("add");
});
/**
 * Definition of Root website class
 */
class CjsRoot {
    constructor() {
        // Default website properties
        this.website = {
            title: "New project",
            icon: null,
        };
    }

    /**
     * Sets cursor for the body (whole website)
     * @param {CjsCursorTypes} cursor
     */
    setCursor(cursor) {
        document.body.style.cursor = cursor;
    }

    /**
     * @param {{title?: string, icon?: string}} data
     */
    setDocumentData(data) {
        // Set default values for missing options in data object
        Object.keys(this.website).forEach(key => {
            if(!(key in data)) {
                data[key] = this.website[key];
            } else {
                this.website[key] = data[key];
            }
        });

        function createLink(rel, href) {
            if(href === null) return;

            const element = document.createElement("link");
            element.rel = rel;
            element.href = href;

            document.head.appendChild(element);
        }

        document.title = data.title;

        document.head.appendChild(document.createComment("Meta definitions"));

        // Links
        createLink("icon", data.icon);
    }

    async importStyle(path) {
        const style = document.head.querySelector(`[id="${CJS_STYLE_PREFIX}"]`);
        const request = await new CjsRequest(path, "get").doRequest();

        if(request.isError()) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Error importing root style at path "${path}"`);
        }

        const definitions = addPrefixToSelectors(request.text());

        style.innerHTML += definitions;
        
    }
}

const Root = new CjsRoot();

/**
 * Inits a webpage by a provided layout scheme
 * @param {CjsLayout|CjsPage} layout
 */
async function init(layout) {
    if(!(layout instanceof CjsLayout) && !(layout instanceof CjsPage)) {
        return console.log(`${CJS_PRETTY_PREFIX_X}Provided element in init() method is not CjsLayout or CjsPage`);
    }

    const sleep = async (ms) => await new Promise((res) => { setTimeout(() => { res() }, ms) });
    const loadStartMs = new Date().getTime();

    const removeRootIfExists = () => {
        const roots = Array.from(document.querySelectorAll(`#${CJS_ROOT_CONTAINER_PREFIX}`));

        roots.forEach(root => root.remove());

        document.head.appendChild(document.createComment("Styles"));
    };

    const loadLayout = async () => {
        removeRootIfExists();

        await sleep(10); // avoid conflict between ChangesObserver

        /* Cjs body root */
        const container = createContainer(CJS_ROOT_CONTAINER_PREFIX);
        const layoutElement = layout.toElement();

        container.innerHTML = ``;
        container.insertAdjacentElement(`beforeend`, layoutElement);

        layout._executeOnLoad();

        functionMappings.applyBodyMappings(); // loaded only on init of RootLayout

        console.log(`${CJS_PRETTY_PREFIX_V}Website loaded in ${Colors.Green}${new Date().getTime() - loadStartMs} ms${Colors.None}.`);
    }

    if(CjsGlobals.window.DOMContentLoaded) {
        await loadLayout();
        return;
    }

    document.addEventListener('DOMContentLoaded', async (e) => {
        await loadLayout();
    });
}

function createContainer(id) {
    const container = document.createElement("div");
    container.setAttribute("id", id);

    document.body.appendChild(container);

    return container;
}
/**
 * Variable that provides shortcut for writing less code
 */
const cjs = {
    a: CjsAnimation
};
class CjsPlugin {
    /**
     * Enables the plugin
     */
    enable() {}

    /**
     * Add styles to plugin styles
     * @param {Object.<string, string[]>} styleRules 
     */
    _addStyleRules(styleRules) {
        const style = document.getElementById(CJS_STYLE_PLUGINS_PREFIX);

        for(const [selector, rules] of Object.entries(styleRules)) {
            style.innerHTML += `${selector} { ${rules.join(" ")} }`;
        }
    }
}
class CjsNotificationPlugin extends CjsPlugin {
    #containerId = "cjs-notification-plugin-container";
    #keyframe = {
        name: "cjs-notification-plugin",
        duration: 4000,
        showHideOffset: 10,
        yDiff: 8
    };

    #themes = {
        dark: {
            backgroundColor: "#242323",
        },
        light: {
            backgroundColor: "#ffffff"
        }
    };

    #addStyles() {
        const theme = "dark";
        const oppositeTheme = theme === "dark" ? "light" : "dark";

        this._addStyleRules({
            [`#${this.#containerId}.container`]: [
                `position: fixed;`,
                `bottom: 0;`,
                `z-index: 999999999999;`,
                `width: 100%;`,
                `display: flex;`,
                `align-items: center;`,
                `flex-direction: column;`,
                `gap: ${this.#keyframe.yDiff}px;`
            ],
            [`#${this.#containerId}.container > .notification`]: [
                `background: ${this.#themes[theme].backgroundColor};`,
                `border-radius: 14px;`,
                `padding: 8px;`,
                `width: fit-content;`,
                `display: flex;`,
                `align-items: center;`,
                `gap: 5px;`,
                `opacity: 0;`,
                `transform: translateY(0px);`,
                `filter: drop-shadow(1px 2px 3px black);`,
                `animation: ${this.#keyframe.name} ${this.#keyframe.duration}ms`
            ],
            [`#${this.#containerId}.container > .notification.warning`]: [
                `background: #c0bd00;`,
            ],
            [`#${this.#containerId}.container > .notification.error`]: [
                `background: #de1f1f;`,
            ],
            [`#${this.#containerId}.container > .notification.info`]: [
                `background: #0e73ff;`,
            ],
            [`#${this.#containerId}.container > .notification.success`]: [
                `background: #00b600;`,
            ],
            [`#${this.#containerId}.container > .notification > p`]: [
                `color: ${this.#themes[oppositeTheme].backgroundColor};`,
                `margin: 0;`,
                `font-size: 16px;`,
            ],
            [`#${this.#containerId}.container > .notification > .icon`]: [
                `--size: 22px;`,
                // `font-size: var(--size);`,
                // `border-radius: 6px;`,
                `width: var(--size);`,
                `height: var(--size);`,
                // `background: ${this.#themes[oppositeTheme].backgroundColor};`,
                // `color: ${this.#themes[theme].backgroundColor};`,
                // `text-align: center;`,
                // `line-height: calc(var(--size) - 1px);`,
                // `margin-right: 6px;`,
                // `user-select: none;`,
            ],
            [`#${this.#containerId}.container > .notification > .icon > svg`]: [

            ],
            [`@keyframes ${this.#keyframe.name}`]: [
                `0% { opacity: 0; transform: translateY(${this.#keyframe.yDiff}px); }`,
                `${this.#keyframe.showHideOffset}% { opacity: 1; transform: translateY(-${this.#keyframe.yDiff}px); }`,
                `${100 - this.#keyframe.showHideOffset}% { opacity: 1; transform: translateY(-${this.#keyframe.yDiff}px); }`,
                `100% { opacity: 0; transform: translateY(${this.#keyframe.yDiff}px); }`
            ]
        })
    }

    /**
     * Creates the container for notifications
     * @returns {HTMLElement} Notifications container
     */
    #createContainer() {
        const element = htmlToElement(`
            <div id="${this.#containerId}" class="container">
            </div>
        `);

        document.body.appendChild(element);

        return element;
    }

    /**
     * @param {string} text
     * @param {"success"|"error"|"info"|"warning"} type
     */
    #create(text, type) {
        const container = document.getElementById(this.#containerId) || this.#createContainer();

        const svgIcon = {
            "success": `<svg fill="#ffffff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>checkmark1</title> <path d="M21.82 13.030l-1.002-1.002c-0.185-0.185-0.484-0.185-0.668 0l-6.014 6.013-2.859-2.882c-0.186-0.185-0.484-0.185-0.67 0l-1.002 1.003c-0.185 0.185-0.185 0.484 0 0.668l4.193 4.223c0.185 0.184 0.484 0.184 0.668 0l7.354-7.354c0.186-0.185 0.186-0.484 0-0.669zM16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM16 26c-5.522 0-10-4.478-10-10 0-5.523 4.478-10 10-10 5.523 0 10 4.477 10 10 0 5.522-4.477 10-10 10z"></path> </g></svg>`,
            "error": `<svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>error</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="add" fill="#ffffff" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,3.55271368e-14 C331.136,3.55271368e-14 426.666667,95.5306667 426.666667,213.333333 C426.666667,331.136 331.136,426.666667 213.333333,426.666667 C95.5306667,426.666667 3.55271368e-14,331.136 3.55271368e-14,213.333333 C3.55271368e-14,95.5306667 95.5306667,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,42.6666667 C119.232,42.6666667 42.6666667,119.232 42.6666667,213.333333 C42.6666667,307.434667 119.232,384 213.333333,384 C307.434667,384 384,307.434667 384,213.333333 C384,119.232 307.434667,42.6666667 213.333333,42.6666667 Z M262.250667,134.250667 L292.416,164.416 L243.498667,213.333333 L292.416,262.250667 L262.250667,292.416 L213.333333,243.498667 L164.416,292.416 L134.250667,262.250667 L183.168,213.333333 L134.250667,164.416 L164.416,134.250667 L213.333333,183.168 L262.250667,134.250667 Z" id="error"> </path> </g> </g> </g></svg>`,
            "info": `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm8-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm.01 8a1 1 0 102 0V9a1 1 0 10-2 0v5z"></path> </g></svg>`,
            "warning": `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 " stroke="none" fill-rule="evenodd" fill="#ffffff"></path></g></svg>`
        }

        const element = htmlToElement(/*html*/`
            <div class="notification ${type}">
                <div class="icon">${svgIcon[type]}</div>
                <p>${text}</p>
            </div>
        `);

        container.appendChild(element);

        sleep(this.#keyframe.duration).then(() => element.remove());
    }

    info(text) { this.#create(text, "info"); }
    error(text) { this.#create(text, "error"); }
    warning(text) { this.#create(text, "warning"); }
    success(text) { this.#create(text, "success"); }

    enable() {
        this.#addStyles();
    }
}
class CjsRipplePlugin extends CjsPlugin {
    /** @type {string} Name of the attribute, to apply ripple effect */
    #attribute = 'ripple';

    /** @type {number} Animation time in ms */
    #animationTime = 400;

    #cssVariables = {
        s: "sx",
        t: "tx", // animation time
        o: "ox", // opacity
        d: "dx", // width, height
        x: "xx", // position
        y: "yx" // position
    }

    /**
     * Applies the effect, adds click listener to element
     * @param {HTMLElement} element 
     */
    #applyEffect(element) {
        element.addEventListener('click', e => {
            e = e.touches ? e.touches[0] : e;

            const r = element.getBoundingClientRect();
            const d = Math.sqrt(Math.pow(r.width, 2) + Math.pow(r.height, 2)) * 2;

            element.style.cssText = `--${this.#cssVariables.s}: 0; --${this.#cssVariables.o}: 1;`;
            element.offsetTop;
            element.style.cssText = `--${this.#cssVariables.t}: 1; --${this.#cssVariables.o}: 0; --${this.#cssVariables.d}: ${d}; --${this.#cssVariables.x}:${e.clientX - r.left}; --${this.#cssVariables.y}:${e.clientY - r.top};`;
        });
    }

    #addStyles() {
        const cssAnimationTime = `${this.#animationTime}ms`;

        this._addStyleRules({
            [`[${this.#attribute}]`]: [
                `cursor: pointer;`,
                `overflow: hidden;`,
                `position: relative;`,
                `-webkit-user-select: none;`,
                `-moz-user-select: none;`,
                `-ms-user-select: none;`,
                `user-select: none;`,
                `-webkit-tap-highlight-color: rgba(0, 0, 0, 0);`,
            ],
            [`[${this.#attribute}]:before`]: [
                `content: '';`,
                `display: block;`,
                `border-radius: 50%;`,
                `position: absolute;`,
                `pointer-events: none;`,
                `transform-origin: center;`,
                `top: calc(var(--${this.#cssVariables.y}) * 1px);`,
                `left: calc(var(--${this.#cssVariables.x}) * 1px);`,
                `width: calc(var(--${this.#cssVariables.d}) * 1px);`,
                `height: calc(var(--${this.#cssVariables.d}) * 1px);`,
                `background: var(--ripple-background, white);`,
                `transform: translate(-50%, -50%) scale(var(--${this.#cssVariables.s}, 1));`,
                `opacity: calc(var(--${this.#cssVariables.o}, 1) * var(--ripple-opacity, 0.3));`,
                `transition: calc(var(--${this.#cssVariables.t}, 0) * var(--ripple-duration, ${cssAnimationTime})) var(--ripple-easing, linear);`,
            ]
        });
    }

    /**
     * Enables the plugin
     */
    enable() {
        this.#addStyles();

        window.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll(`[${this.#attribute}]`).forEach(el => {
                this.#applyEffect(el);
            });
        });

        const observer = new MutationObserver((mutations) => {
            const filtered = mutations
                .filter(mutation => mutation.type === 'childList')
                .map(mutation => Array.from(mutation.addedNodes))
                .flat()
                .filter(addedNode => "getAttribute" in addedNode)
                .map(addedNode => [addedNode, ...addedNode.querySelectorAll("*")])
                .flat()
                .filter(element => element.getAttribute(this.#attribute) !== null);

            for(const element of filtered) {
                this.#applyEffect(element);
            }
        });

        observer.observe(document, { childList: true, subtree: true });
    }
}
class CjsScaleClickPlugin extends CjsPlugin {
    /** @type {string} Name of the attribute, to apply ripple effect */
    #attribute = 'scale';

    /** @type {number} Animation time in ms */
    #animationTime = 350;

    scales = { start: 0.85, end: 1 }
    keyframe = new CjsKeyFrame()
        .setDuration(this.#animationTime)
        .addEntry({ transform: `scale(${this.scales.start})` })
        .addEntry({ transform: `scale(${this.scales.end})` })

    /**
     * @param {HTMLElement} element 
     * @param {boolean} isTouchStart 
     */
    #onTouch(element, isTouchStart) {
        if(element.hasAttribute("disabled")) return;

        const className = this.keyframe.getClass({ reversed: isTouchStart });
        const endScale = isTouchStart ? this.scales.start : this.scales.end;

        element.classList.add(className);
        element.style.transform = `scale(${endScale})`

        setTimeout(() => {
            element.classList.remove(className);

            if(!isTouchStart) {
                element.style.transform = '';
            }
        }, this.duration);
    }

    /**
     * @param {HTMLElement} element 
     */
    applyEvents(element) {
        element.addEventListener('touchstart', () => { this.#onTouch(element, true) });
        element.addEventListener('touchend', () => { this.#onTouch(element, false) });
    }

    enable() {
        window.addEventListener('DOMContentLoaded', () => {
            const elements = document.querySelectorAll(`[${this.#attribute}]`);

            elements.forEach(element => { this.applyEvents(element) });
        })

        new MutationObserver((mutationsList, observer) => {
            const childList = mutationsList.filter(e => e.type === 'childList');
            const addedNodes = childList.map(e => Array.from(e.addedNodes)).flat();
            const addedNodesWithChildren = addedNodes
                .filter(e => e instanceof HTMLElement)
                .map(e => [e, ...Array.from(e.querySelectorAll("*"))])
                .flat()
                .filter(e => e.getAttribute(this.#attribute) !== null);

            for(const node of addedNodesWithChildren) {
                this.applyEvents(node);
            }
        }).observe(document, { childList: true, subtree: true });
    }
}
class CjsScaleHoverPlugin extends CjsPlugin {
    /** @type {string} Name of the attribute, to apply hover scale effect */
    #attribute = 'hover';

    /** @type {number} Animation time in ms */
    #animationTime = 350;

    /** @type {number} End scale in `transform: scale(...)` on `:hover` */
    #hoverScale = 0.95;

    #addStyles() {
        this._addStyleRules({
            [`[${this.#attribute}]`]: [
                `transition: transform ${this.#animationTime}ms !important;`,
            ],
            [`[${this.#attribute}]:hover`]: [
                `transform: scale(${this.#hoverScale}) !important;`,
            ]
        });
    }

    enable() {
        this.#addStyles();
    }
}
const CjsRipple = new CjsRipplePlugin();
const CjsNotification = new CjsNotificationPlugin();
const CjsScaleClick = new CjsScaleClickPlugin();
const CjsScaleHover = new CjsScaleHoverPlugin();

const CjsPluginManager = {
    /**
     * Enables plugins
     * @param {{ ripple?: boolean, notification?: boolean, scaleClick?: boolean, scaleHover?: boolean }} plugins 
     */
    enable(plugins) {
        const mapping = {
            ripple: CjsRipple,
            notification: CjsNotification,
            scaleClick: CjsScaleClick,
            scaleHover: CjsScaleHover 
        }
        
        for(const [key, value] of Object.entries(plugins)) {
            const parsedKey = key.trim();

            if(!(parsedKey in mapping)) continue;

            /** @type {CjsPlugin} */
            const plugin = mapping[parsedKey];

            if(value) plugin.enable();
        }
    },
}
/**
 * @class
 * @classdesc Class util for creating a <progress> elements
 * @example 
 * ```js
 * // Creating a progress with lime color
 * export const Container = new CjsComponent((data) => {
 *     const progress = new CjsProgressBuilder()
 *     .setProperties({
 *         fillColor: "lime"
 *     });
 *     
 *     return `
 *         <div class="container">
 *             ${progress}
 *         </div>
 *     `;
 * });
 * ```
 */
class CjsProgressBuilder {
    fillColor = "dodgerblue";
    backgroundColor = "#393939";
    border = "none";
    borderRadius = "8px";
    height = "12px";
    width = "100%";

    max = 100;
    value = 75;
    valueTransitionDuration = 1000;

    className = CJS_PREFIX + getRandomCharacters(16);
    selector = `progress.${this.className}`;

    /**
     * @param {function(HTMLProgressElement)} callback 
     */
    #forEach(callback) {
        const elements = Array.from(document.body.querySelectorAll(this.selector));

        for(const element of elements) {
            callback(element);
        }
    }

    /**
     * Sets progress value transition time (in ms)
     * @param {number} ms 
     * @returns {CjsProgressBuilder}
     */
    setValueTransitionDuration(ms) {
        this.valueTransitionDuration = ms;

        return this;
    }

    /**
     * Sets max value of progress range
     * @param {number} max 
     * @returns {CjsProgressBuilder}
     */
    setMax(max) {
        this.max = max;

        this.#forEach((element) => element.max = this.max);

        return this;
    }

    /**
     * Sets value of progress
     * @param {number} value 
     * @returns {CjsProgressBuilder}
     */
    setValue(value) {
        this.value = value;

        this.#forEach((element) => element.value = this.value);

        return this;
    }

    /**
     * Sets base style properties of `<progress>`
     * @param {{ fillColor?: string, backgroundColor?: string, border?: string, borderRadius?: string, height: string, width: string }} properties 
     * @return {CjsProgressBuilder}
     */
    setProperties(properties) {
        const propertiesList = [
            "fillColor",
            "backgroundColor",
            "border",
            "borderRadius",
            "height",
            "width"
        ];

        for(const propertyName of propertiesList) {
            if(propertyName in properties) this[propertyName] = properties[propertyName];
        }

        return this;
    }

    toString() {
        return this.toHtml();
    }

    toHtml() {
        const styleProperties = [
            { key: "appearance", value: "none" },
            { key: "-webkit-appearance", value: "none" },
            { key: "-moz-appearance", value: "none" },
            { key: "overflow", value: "hidden" },
            { key: "border", value: this.border },
            { key: "border-radius", value: this.borderRadius },
            { key: "width", value: this.width },
            { key: "height", value: this.height },
        ];

        const styles = {
            "": styleProperties.map(e => `${e.key}: ${e.value};`),
            "::-webkit-progress-bar": [
                `background: ${this.backgroundColor};`,
                `border-radius: ${this.borderRadius};`
            ],
            "::-webkit-progress-value": [
                `background: ${this.fillColor};`,
                `border-radius: ${this.borderRadius};`,
                `transition: width ${this.valueTransitionDuration}ms;`
            ],
            "::-moz-progress-bar": [
                `background: ${this.fillColor};`,
                `border-radius: ${this.borderRadius};`
            ]
        };

        const styleBlock = `<style>${Object.keys(styles).map(key => `${this.selector}${key} { \n${styles[key].map(e => `    ${e}`).join("\n")} \n}`).join("\n")}</style>`;

        const html = `<progress class="${this.className}" value="${this.value}" max="${this.max}">${styleBlock}</progress>`;

        return html;
    }

    /**
     * @returns {HTMLProgressElement}
     */
    toElement() {
        return htmlToElement(this.toHtml());
    }
}