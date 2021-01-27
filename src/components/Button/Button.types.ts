import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    className?: string;
    button?: string;
    sizeType?: string;
    fullWidth?: boolean;
}

const styles = createStyles({
    btn: {
        textTransform: 'uppercase',
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#FFFFFF',
        borderRadius: 2,
        border: 0,
        fontWeight: 600
    },
    '.btn:focus': {
        outline: '5px auto -webkit-focus-ring-color',
        fallbacks: [{
            outline: '#014c8c'
        }, {
            outline: '1px dotted'
        }]
    },
    btnNormal: {
        width: 146,
        height: 46
    },
    btnSmall: {
        fontSize: 11,
        lineHeight: '11px',
        padding: '8px 10px'
    },
    btnFullWidth: {
        width: '100%'
    },
    '.btn:disabled': {
        backgroundColor: '#F2F2F2',
        cursor: 'pointer'
    },
    '.btn:disabled:hover': {
        backgroundColor: '#F2F2F2',
        cursor: 'pointer'
    },
    btnGreen: {
        backgroundColor: '#7EC241'
    },
    '.btnGreen:hover': {
        backgroundColor: '#72A73F'
    },
    btnPink: {
        backgroundColor: '#0074ba'
    },
    '.btnPink:hover': {
        backgroundColor: '#0067a6'
    },
    btnGrey: {
        backgroundColor: '#D2D5D6'
    },
    '.btnGrey:hover': {
        backgroundColor: '#777E7D'
    },
    btnGreyDark: {
        backgroundColor: '#4D525A'
    },
    '.btnGreyDark:hover': {
        backgroundColor: '#384044'
    },
    btnClose: {
        width: 15,
        height: 15,
        color: 'transparent',
        overflow: 'hidden',
        padding: 0
    },
    '.btnClose:hover': {
        width: 15,
        height: 15,
        color: 'transparent',
        overflow: 'hidden',
        padding: 0
    },
    btnClosePage: {
        width: 40,
        height: 31,
        color: 'transparent',
        overflow: 'hidden'
    },
    '.btnClosePage:hover': {
        fontWeight: 'normal'
    },
    btnValidateFile: {
        paddingLeft: 30,
        paddingRight: 10,
        backgroundColor: '#FFFFFF',
        border: '1px solid #7EC241',
        color: '#7EC241'
    },
    '.btnValidateFile:hover': {
        backgroundColor: '#72A73F',
        color: '#FFFFFF'
    },
    btnRejectFile: {
        paddingLeft: 30,
        paddingRight: 10,
        backgroundColor: '#FFFFFF',
        border: '1px solid #EA4949',
        color: '#EA4949'
    },
    '.btnRejectFile:hover': {
        backgroundColor: '#EA4949',
        color: '#FFFFFF'
    },
    btnCustom: {
        background: 'none',
        border: 'none'
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
