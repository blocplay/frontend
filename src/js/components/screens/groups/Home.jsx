import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '../../AppBar';
import SectionTabs from '../../navigation/SectionTabs';
import Sidebar from '../../Sidebar';
import ProfilePreview from '../../../containers/user/ProfilePreview';
import Avatar from '../../appBar/Avatar';
import Actions from '../../appBar/Actions';
import User from '../../../app/User';

const propTypes = {
	children: PropTypes.element.isRequired,
	sectionTabs: PropTypes.array,
	currentUser: PropTypes.instanceOf(User),
	onSettingsClick: PropTypes.func,
};

const defaultProps = {
	sectionTabs: [],
	currentUser: null,
	onSettingsClick: null,
};

function Home(props) {
	const appBarActions = [{ id: 'more', icon: 'ellipsis-h', callback: props.onSettingsClick }];

	return (
		<div className="screenGroupHome">
			<div className="screenGroupHome__header">
				<AppBar pre={<Avatar user={props.currentUser} />} post={<Actions actions={appBarActions} />} />
			</div>
			<div className="screenGroupHome__sectionTabs">
				<SectionTabs sectionTabs={props.sectionTabs} />
			</div>
			<div className="screenGroupHome__content">
				<div className="screenGroupHome__sidebar">
					<Sidebar>
						<ProfilePreview user={props.currentUser} />
					</Sidebar>
				</div>
				<div className="screenGroupHome__main">{props.children}</div>
			</div>
		</div>
	);
}

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

export default Home;
