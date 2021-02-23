import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useParams, Redirect } from 'react-router-dom';

import { cookieCheck, logout } from '../Login/actions';
import Loader from '../Loader';
import Context from '../Text/context';

import { Styled, StyledType } from './Gate.types';

const fetchTranslations = params => ({
    type: 'core.translation.fetch',
    method: 'core.translation.fetch',
    params
});

const Gate: StyledType = ({ classes, children, cookieCheck, logout, fetchTranslations }) => {
    const [loaded, setLoaded] = useState(null);
    const [cookieChecked, setCookieChecked] = useState(false);
    const login = useSelector(state => state.login || false);

    async function load() {
        // setPermissions(result.get('permission.get').toJS());
        const language = login?.language?.languageId;
        const translations = await fetchTranslations({
            languageId: language,
            dictName: ['text', 'actionConfirmation']
        });
        const dictionary = translations?.result?.translations?.reduce(
            (prev, {dictionaryKey, translatedValue}) => dictionaryKey === translatedValue ? prev : {...prev, [dictionaryKey]: translatedValue},
            {}
        );
        setLoaded({
            language,
            translate: text => dictionary?.[text] || text
        });
    }

    const {appId} = useParams();

    async function check() {
        await cookieCheck({ appId });
        setCookieChecked(true);
    }

    useEffect(() => {
        if (!cookieChecked && !login) check();
        if (!loaded && login) load();
    }, [cookieChecked, login, loaded]);

    if (!cookieChecked && !login) {
        return <Loader />;
    } else if (login) {
        return (
            <div className={classes.gate}>
                {loaded ? <Context.Provider value={loaded}>{children}</Context.Provider> : <Loader />}
            </div>
        );
    } else {
        return <Redirect to='/login' />;
    }
};

export default connect(
    null,
    { cookieCheck, fetchTranslations, logout }
)(Styled(Gate));
