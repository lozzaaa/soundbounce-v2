/**
 * Created by paulbarrass on 30/04/2017.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Transition from 'components/transition/Transition';

import theme from './blurredNowPlaying.css';
import fade from 'shared/css/transitions/fade.css';

const hashCode = (str) => {
	let hash = 0, i, chr;
	if (str.length === 0) return hash;
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

class BlurredNowPlaying extends Component {
	static propTypes = {
		player: PropTypes.object
	};

	render() {
		const {player} = this.props;
		// no player state so return nothing

		const images = player['item'] ? player.item.album.images : null;
		const artwork = images ? `url(${images[images.length > 1 ? 1 : 0].url})` : 'none';
		return (
			<div>
				<Transition style={fade} duration={1200}>
					{[
						<div key={hashCode(artwork)}
							 className={theme.artwork}
							 style={{backgroundImage: artwork}}>
						</div>
					]}
				</Transition>
			</div>
		);
	}
}

// map the spotify player state to prop 'player'
const mapStateToProps = state => ({
	player: state.spotify.player
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BlurredNowPlaying);

