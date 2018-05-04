import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	src: PropTypes.string.isRequired,
};

function StreamVideo(props) {
	// eslint-disable-next-line jsx-a11y/media-has-caption
	return <video autoPlay loop src={props.src} className="stream__video" poster="./mockImages/blank.png" />;
}

StreamVideo.propTypes = propTypes;

export default StreamVideo;
