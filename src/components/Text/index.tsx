import React, { useContext } from 'react';

import Context from './context';

import { StyledType } from './Text.types';

const TOKEN = /\${([\w]*)}/g;
/**
 * A very simple template scheme:
 * template = 'This ${item} costs ${price}'
 * params = {item: 'boots', price: '100'})
 * result: 'This boots costs 100, John'
 */
function applyTemplate(template, params) {
    if (typeof template === 'string' && params) {
        return template.replace(TOKEN, function(wholeMatch, key) {
            return (key in params &&
                    typeof params[key] !== 'object' &&
                    typeof params[key] !== 'function' &&
                    typeof params[key] !== 'undefined')
                ? params[key]
                : wholeMatch;
        });
    } else {
        // We cannot do any processing - just return the original
        return template;
    }
}

const Text: StyledType = ({ params, prefix, children, interpolate = applyTemplate }) => {
    const {translate, language} = useContext(Context);
    if (typeof children !== 'string') return <>{children}</>;
    let template = children;
    if (typeof translate === 'function') {
        const text = (prefix ? [prefix, children] : [children]).join('>');
        // Translate the template
        template = translate(text, language);
        if (template === text) {
            template = children;
        }
    }
    return <span>{interpolate(template, params)}</span>;
};

export default Text;
