import React from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import MockObject from '../../mock/MockObject';
import StreamPreview from './StreamPreview';
import Icon from '../icons/Icon';

const propTypes = {
	streams: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
	onStreamClick: PropTypes.func,
	icon: PropTypes.string,
	title: PropTypes.string,
};

const defaultProps = {
	streams: [],
	onStreamClick: null,
	icon: null,
	title: null,
};

function StreamList(props) {
	const swiperParams = {
		slidesPerView: 'auto',
		spaceBetween: 22,
		wrapperClass: 'streamList__row',
	};
	const handleClick = stream => () => {
		if (props.onStreamClick) {
			props.onStreamClick(stream);
		}
	};

	const streams = props.streams.map(stream => (
		<div key={stream.id} onClick={handleClick(stream)}>
			<StreamPreview stream={stream} />
		</div>
	));
	return (
		<div className="streamList">
			{props.title &&
				props.icon && (
					<div className="streamList__title">
						<Icon icon={props.icon} />
						<h2 className="streamList__title-text">{props.title}</h2>
					</div>
				)}
			<Swiper {...swiperParams}>{streams}</Swiper>
		</div>
	);
}

StreamList.propTypes = propTypes;
StreamList.defaultProps = defaultProps;

export default StreamList;
