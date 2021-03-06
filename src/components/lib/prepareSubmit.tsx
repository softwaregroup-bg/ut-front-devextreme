import get from 'lodash.get';
import set from 'lodash.set';

export default ([form, {tables = [], files = []} = {}]) => {
    const {$, ...value} = form;
    tables?.forEach(name => {
        const table = get(value, name);
        if (Array.isArray(table)) set(value, name, table.filter(Boolean));
    });
    if (files?.length) {
        const formData = new FormData();
        const parts = [];
        const skip = [];
        files.forEach(name => {
            const file = get(value, name);
            if (file != null) {
                parts.push([name, file[0]]);
                skip.push(file);
            }
        });
        formData.append('$', JSON.stringify(value, (key, value) => skip.includes(value) ? undefined : value));
        parts.forEach(([name, file]) => file && formData.append('$.' + name, file));
        return {formData};
    } else {
        return value;
    }
};
