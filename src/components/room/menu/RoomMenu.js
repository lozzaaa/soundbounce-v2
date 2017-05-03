/**
 * Created by paulbarrass on 03/05/2017.
 */
import React, {Component, PropTypes} from 'react';

import theme from './roomMenu.css';

export default class RoomMenu extends Component {
	static propTypes = {
		room: PropTypes.object.isRequired
	};
	static contextTypes = {
		colors: PropTypes.object
	};

	render() {
		const {room} = this.props;
		const {colors} = this.context;
		const {rgba, primary} = colors;

		const MenuItem = ({children, selected}) => (
			<div className={theme[selected ? 'itemSelected' : 'item']} style={{
				borderBottom: selected
					? `solid 0.3rem ${rgba(primary, 0.9)}`
					: '0.3rem transparent'
			}}>
				{children}
			</div>
		);

		return (
			<div className={theme.menu}>
				<MenuItem selected={true}>Next Up</MenuItem>
				<MenuItem>About</MenuItem>
				<MenuItem>Listening {room.listeners.length}</MenuItem>
				<MenuItem>Top Rated</MenuItem>
			</div>
		);
	}
}
