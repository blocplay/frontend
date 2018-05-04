import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import SectionTabs from '../../../navigation/SectionTabs';
import MockObject from '../../../../mock/MockObject';
import ScrollableView from '../../../ScrollableView';

@observer
class Events extends Component {
	static propTypes = {
		calendarNumberOfMonths: PropTypes.number.isRequired,
		suggestedEvents: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		allEvents: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		gamesEvents: PropTypes.arrayOf(PropTypes.instanceOf(MockObject)),
		onEventClick: PropTypes.func,
	};
	static defaultProps = {
		suggestedEvents: [],
		allEvents: [],
		gamesEvents: [],
		onEventClick: null,
	};

	@observable
	/**
	 * @type {'suggested'|'all'|'games'}
	 */
	view = '';

	componentWillMount() {
		this.view = 'suggested';
	}

	getTabs() {
		return Object.entries({
			suggested: { title: 'Suggested', icon: 'lightbulb' },
			all: { title: 'All', icon: 'list-alt' },
			games: { title: 'Only Games', icon: 'gamepad' },
		}).map(([id, data]) => ({
			id,
			title: data.title,
			icon: data.icon,
			isActive: this.view === id,
			callback: this.handleTabClick(id),
		}));
	}

	handleTabClick(id) {
		return () => {
			this.view = id;
		};
	}

	handleEventClick(event) {
		return () => {
			if (this.props.onEventClick) {
				this.props.onEventClick(event);
			}
		}
	}

	renderCalendar() {
		const monthNames = [];
		const start = moment();

		for (let i = 0; i < this.props.calendarNumberOfMonths; i += 1) {
			monthNames.push(moment(start).add(i, 'months').format('MMM'));
		}
		const cursorStyle = {
			left: `${(100 * start.date()) / start.daysInMonth()}%`,
		};

		return (
			<div className="calendar">
				<div className="calendar__events">
					<div className="calendar__gantt">
						{/* TODO: cleanup sample events, provide logic for determining spacing */}
						<img className="calendar__gantt-event gantt__sample-1" src="./mockImages/banners/banner-overwatch.jpg" alt="Overwatch Event"/>
						<img className="calendar__gantt-event gantt__sample-2" src="./mockImages/banners/banner-dota.jpg" alt="Dota 2 Event"/>
						<img className="calendar__gantt-event gantt__sample-3" src="./mockImages/banners/banner-halo5.jpg" alt="Halo 5 Event"/>
						<img className="calendar__gantt-event gantt__sample-4" src="./mockImages/banners/banner-overwatch.jpg" alt="Overwatch Event"/>
						<img className="calendar__gantt-event gantt__sample-5" src="./mockImages/banners/banner-dota.jpg" alt="Dota 2 Event"/>
					</div>
					<div className="calendar__cursor-container">
						<div className="calendar__cursor-line" style={cursorStyle}/>
					</div>
				</div>
				<div className="calendar__months">
					{monthNames.map(name => <div key={name} className="calendar__month">{name}</div>)}
				</div>
			</div>
		)
	}

	renderEvents(events) {
		const eventsNode = events.map(event => (
			<div className="activities__card" key={event.id} onClick={this.handleEventClick(event)}>
				<div className="activities__meta">
					<img className="stream__gameTag-thumbnail" src={event.medias.cover} alt={event.name} />
					<div className="activities__text">
						<div className="activities__card-title">Event: {event.name}</div>
						<p className="stream__gameTag-publisher">{moment(event.startDateTime).format('MMM M, YYYY')}</p>
					</div>
				</div>
				<img className="activities__image" src={event.medias.activity} alt={event.name} />
			</div>
		));

		return <div>{eventsNode}</div>;
	}

	renderTabContent() {
		switch (this.view) {
			case 'suggested':
				return this.renderEvents(this.props.suggestedEvents);
			case 'games':
				return this.renderEvents(this.props.gamesEvents);
			default:
				return this.renderEvents(this.props.allEvents);
		}
	}

	render() {
		return (
			<ScrollableView>
				{this.renderCalendar()}
				<SectionTabs sectionTabs={this.getTabs()} />
				<div className="activities__list">
					{this.renderTabContent()}
				</div>
			</ScrollableView>
		);
	}
}

export default Events;
