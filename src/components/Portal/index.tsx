import React from 'react';
import Box, {Item} from 'devextreme-react/box';
import { useSelector, useDispatch } from 'react-redux';
import TabPanel from 'devextreme-react/tab-panel';

import Menu from 'devextreme-react/menu';

import Context from '../Context';
import Async from '../Async';
import Text from '../Text';

import Title from './Title';
import { Styled, StyledType } from './Portal.types';

// https://usehooks.com/useWindowSize/
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = React.useState({
        width: undefined,
        height: undefined
    });

    React.useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

const ItemComponent = ({data}) => <Async component={data.component} />;

const Portal: StyledType = ({ classes, children }) => {
    const {tabs = [], menu = []} = useSelector(state => state.portal || {});
    const dispatch = useDispatch();
    const size = useWindowSize();
    const {portalName} = React.useContext(Context);
    const handleClick = ({itemData}) => itemData.page && dispatch({
        type: 'front.tab.show',
        component: itemData.page,
        title: itemData.title,
        path: '/' + itemData.page.name
    });
    return (
        <Box direction='col' width='100%' height={size.height}>
            <Item baseSize={59}>
                <div className={classes.headerContainer}>
                    <Box direction='row' height='100%' crossAlign='center'>
                        <Item baseSize={46}>
                            <div className={classes.headerLogo}></div>
                        </Item>
                        <Item baseSize='auto'>
                            <div className={classes.headerTitle}>
                                <Text>{portalName}</Text>
                            </div>
                        </Item>
                        <Item baseSize='auto'>
                            <Menu dataSource={menu}
                                displayExpr='title'
                                showFirstSubmenuMode='onClick'
                                orientation='horizontal'
                                submenuDirection='auto'
                                hideSubmenuOnMouseLeave={false}
                                onItemClick={handleClick}
                            />
                        </Item>
                    </Box>
                </div>
            </Item>
            <Item ratio={1}>
                <TabPanel
                    height='100%'
                    dataSource={tabs}
                    itemTitleComponent={Title}
                    itemComponent={ItemComponent}
                />
                {children}
            </Item>
        </Box>
    );
};

export default Styled(Portal);
