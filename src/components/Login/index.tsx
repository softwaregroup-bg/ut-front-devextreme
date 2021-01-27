import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { Redirect } from 'react-router-dom';
import Form, { Item } from 'devextreme-react/form';

import { closeAllTabs } from '../AddTab/actions';
import Text from '../Text';
import { Validator } from '../lib/validator';

import { Styled, StyledType } from './Login.types';
import { cookieCheck, identityCheck, bioScan } from './actions';

const inputTypes = {
    username: {
        name: 'username',
        type: 'text',
        label: 'Username',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 30
        }
    },
    password: {
        name: 'password',
        type: 'password',
        label: 'Password',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 3,
            maxLength: 30
        }
    },
    newPassword: {
        name: 'newPassword',
        type: 'password',
        label: 'New password',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength', 'shouldMatchField'],
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 30,
            shouldMatchField: 'confirmPassword'
        }
    },
    confirmPassword: {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm password',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength', 'shouldMatchField'],
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 30,
            shouldMatchField: 'newPassword'
        },
        skipSubmit: true
    },
    otp: {
        name: 'otp',
        type: 'password',
        label: 'Otp code',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'length'],
        validations: {
            isRequired: true,
            length: 4
        }
    }
};

const loginSteps = {
    initial: {
        inputs: {
            username: inputTypes.username
        },
        buttonLabel: 'Next',
        title: 'System Login'
    },
    password: {
        inputs: {
            username: inputTypes.username,
            password: inputTypes.password
        },
        disabledFields: ['username'],
        buttonLabel: 'Login',
        title: 'Login with password'
    },
    newPassword: {
        inputs: {
            username: inputTypes.username,
            newPassword: inputTypes.newPassword,
            confirmPassword: inputTypes.confirmPassword
        },
        disabledFields: ['username'],
        buttonLabel: 'Change',
        title: 'Password change required'
    },
    otp: {
        inputs: {
            username: inputTypes.username,
            otp: inputTypes.otp
        },
        disabledFields: ['username'],
        buttonLabel: 'Login',
        title: 'Login with OTP'
    },
    checkLdapUser: {
        inputs: {
            username: inputTypes.username,
            password: inputTypes.password
        },
        disabledFields: ['username'],
        buttonLabel: 'Login',
        title: 'Login with password'
    }
};

type State = {
    title: string;
    error: string;
    buttonLabel: string;
    inputs: {
        name: string;
        label: string;
        type: string;
        disabled?: boolean;
    }[]
}

type Action = {
    type: 'login',
    methodRequestState?: string,
    error?: {
        type: string,
        message: string
    },
    result?: {}
} | {
    type: 'logout'
};

const updateLoginStep = (state, step) => {
    const loginStep = loginSteps[step];
    const currentInputs = state.inputs;

    const inputs = Object.entries(loginStep.inputs).map(([name, input]: [string, {}]) => ({
        ...input,
        value: currentInputs[name]?.value,
        disabled: loginStep.disabledFields.includes(name)
    }));

    return {
        ...state,
        inputs,
        error: '',
        loginType: step
    };
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'login':
            if (action.methodRequestState !== 'finished') break;
            if (action.error) {
                const err = action.error.type.split('.');
                const type = err[err.length - 1];

                return loginSteps[type] ? updateLoginStep(state, type) : { ...state, error: action.error.message };
            } else if (action.result) {
                return { ...state, error: '' };
            }
            break;
        case 'logout':
            return state;
    }
}

const validator = new Validator(inputTypes);
const initialState: State = {
    error: '',
    ...loginSteps.initial,
    inputs: [inputTypes.username]
};

const Login: StyledType = ({
    authenticated,
    identityCheck,
    classes: {
        loginContainer,
        loginLogo,
        loginPageFooter,
        loginPageHeader,
        loginForm,
        loginTitle,
        formError,
        errorIcon,
        errorMessage,
        formContainer
    }
}) => {
    if (authenticated) return <Redirect to='/' />;

    const [{ title, error, inputs, buttonLabel }, dispatch] = React.useReducer(reducer, initialState);

    async function handleSubmit(e) {
        e.preventDefault();
        const allInputs = Array.prototype.slice.call(e.target.querySelectorAll('input'))
            .reduce((prev, { name, value }) => name ? { ...prev, [name]: value } : prev, {});
        const valid = validator.validateAll(allInputs);
        if (valid.isValid) {
            dispatch({ ...await identityCheck(allInputs), type: 'login' });
        } else {
            ;
        }
    }

    return (<div className={loginContainer}>
        <div className={clsx(loginLogo, loginPageHeader)} />
        <div className={loginForm}>
            {title && <div className={loginTitle}><Text>{title}</Text></div>}
            {error && <div className={formError}>
                <div className={errorIcon} />
                <div className={errorMessage}>{error}</div>
            </div>}
            <form className={formContainer} onSubmit={handleSubmit} autoComplete='off'>
                <Form labelLocation='top'>
                    {inputs.map(({ name, type, label, disabled }) => <Item
                        key={name}
                        dataField={name}
                        title={label}
                        disabled={disabled}
                        {...{
                            password: {
                                editorType: 'dxTextBox',
                                editorOptions: {
                                    mode: 'password'
                                }
                            },
                            text: {
                                editorType: 'dxTextBox'
                            }
                        }[type]}
                    />).filter(Boolean)}
                    <Item itemType='button' buttonOptions={{ text: buttonLabel, type: 'success', useSubmitBehavior: true }} />
                </Form>
            </form>
        </div>
        <div className={clsx(loginLogo, loginPageFooter)} />
    </div>
    );
};

export default connect(
    ({ login }) => {
        return {
            authenticated: login.get('authenticated')
        };
    },
    { cookieCheck, identityCheck, bioScan, closeAllTabs }
)(Styled(Login));
