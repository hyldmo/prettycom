import { Actions } from 'actions'
import { Messages } from 'components/Messages'
import React from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

import './home.less'

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchToProps

class Home extends React.Component<Props> {
	render () {
		const { devices } = this.props
		return (
			<div className="sessions">
				{devices.filter(device => device.connected || device.messages.length > 0).map(device => (
					<Messages key={device.comName} device={device} />
				))}
			</div>
		)
	}
}

const mapStateToProps = (state: State) => ({
	devices: state.devices
})

const dispatchToProps = {
	connectSerial: Actions.connect,
	disconnect: Actions.disconnect
}

export default connect(mapStateToProps, dispatchToProps)(Home)
