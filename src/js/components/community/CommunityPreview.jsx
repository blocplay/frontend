/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import MockObject from '../../mock/MockObject';

const propTypes = {
	community: PropTypes.instanceOf(MockObject).isRequired,
	tags: PropTypes.arrayOf(PropTypes.string),
	onClick: PropTypes.func,
};

const defaultProps = {
	onClick: null,
	tags: [],
};

function CommunityPreview({ community, ...props }) {
	const tags = props.tags.map((tag, index) => (
		<li className="btn btn-sm btn-dim communityPreview__tag" key={index}>
			{tag}
		</li>
	));

	return (
		<div className="communityPreview__item" onClick={props.onClick}>
			<img className="communityPreview__thumb" src={community.medias.cover} alt={community.name} />
			<div className="communityPreview__text">
				<p>{community.name}</p>
				<ul className="communityPreview__tags">{tags}</ul>
				<p className="communityPreview__member-count">{numeral(community.nbMembers).format('0,0')} Members</p>
			</div>
		</div>
	);
}

CommunityPreview.propTypes = propTypes;
CommunityPreview.defaultProps = defaultProps;

export default CommunityPreview;
