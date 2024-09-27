export default function (language = 'fr', action) {
    if (action.type === 'uk') {
        return 'uk';
    } else if (action.type === 'fr'){
        return 'fr';
    } else if (action.type === 'us'){
        return 'us';
    }else if (action.type === 'ge'){
        return 'ge';
    }else if (action.type === 'it'){
        return 'it';
    }else if (action.type === 'ru'){
        return 'ru';
    }else {
        return language;
    }
}