import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {selectCurrentUser} from 'redux/modules/users';
import Avatar from 'components/user/avatar/Avatar';
import {Link} from 'react-router';
import HelpIcon from 'components/svg/icons/Help';

import theme from './mainNavigation.css';

class MainNavigation extends Component {
	static propTypes = {
		currentUser: PropTypes.object,
		player: PropTypes.object
	};

	render() {
		const {currentUser} = this.props;
		return (
			<div className={theme.nav}>
				<Link to='/home'>
					<div className={theme.soundbounce}>
						SB
					</div>
				</Link>
				<Link to='/help'>
					<div className={theme.helpContainer}>
						<HelpIcon />
					</div>
				</Link>
				<Link to='/profile'>
					<div className={theme.avatarContainer}>
						<Avatar user={currentUser}/>
					</div>
				</Link>
			</div>
		);
	}
}

// map the spotify player state to prop 'player'
const mapStateToProps = state => ({
	currentUser: selectCurrentUser(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);

